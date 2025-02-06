import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  updateEdge,
  ConnectionMode,
} from 'react-flow-renderer';

import { useNodes, useEdges, useReactFlow } from 'react-flow-renderer';

import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dagre from 'dagre';
import { ApprovalStep, ApprovalConnection, ApprovalStepType } from '../types';
import { useUserContext } from '../context/UserContext';
import { validateFlow } from '../utils/validation';
import { saveApprovalFlow } from '../utils/api';
import nodeTypes from './NodeTypes';
import '../styles/workflow.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidthStart = 240;// ширина узла по умолчанию
const nodeHeight = 120;

const layoutElements = (nodes: ApprovalStep[], edges: ApprovalConnection[]): ApprovalStep[] => {
  dagreGraph.setGraph({
    rankdir: 'LR',
    nodesep: 100,
    ranksep: 80
  });

  nodes.forEach(node => {
    const nodeWidth = node.style?.width ? parseInt(node.style.width as string, 10) : nodeWidthStart;
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map(node => {
    const { x, y } = dagreGraph.node(node.id);
    const nodeWidth = node.style?.width ? parseInt(node.style.width as string, 10) : nodeWidthStart;

    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
      style: { width: nodeWidth }
    };
  });
};

interface Props {
  entityId: string;
  initialNodes: ApprovalStep[];
  initialEdges: ApprovalConnection[];
}

const ApprovalProcessEditor: React.FC<Props> = ({ entityId, initialNodes, initialEdges }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<ApprovalStep['data']>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ApprovalConnection>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { users } = useUserContext();

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
      setEdges((prevEdges) => updateEdge(oldEdge, newConnection, prevEdges));
  };

  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;
    const hasOutgoingEdges = useMemo(() => {
      if (!selectedNodeId) return false;
      return edges.some(edge => edge.source === selectedNodeId);
    }, [selectedNodeId, edges]);

  // Мемоизация списка пользователей для узлов
  const nodesWithUsers = useMemo(() => nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      users
    }
  })), [nodes, users]);

  // Функция для выравнивания узлов
  const arrangeLayout = useCallback(() => {
    setNodes((prevNodes) => layoutElements(prevNodes as ApprovalStep[], edges));
  }, [edges]);

  // Функция для сохранения процесса
  const handleSave = useCallback(async () => {
    try {
      setNodes((prevNodes) => {
        const arrangedNodes = layoutElements(prevNodes as ApprovalStep[], edges);

        const validationResult = validateFlow({ nodes: arrangedNodes, edges });
        if (!validationResult.isValid) {
          message.error(validationResult.errors.join(', '));
          return prevNodes;
        }

        saveApprovalFlow(entityId, { nodes: arrangedNodes, edges })
          .then(() => message.success('Процесс успешно сохранен'))
          .catch(() => message.error('Ошибка сохранения процесса'));

        return arrangedNodes;
      });
    } catch {
      message.error('Ошибка сохранения процесса');
    }
  }, [entityId, edges]);

  // Функция для добавления нового узла
    const addNode = useCallback((type: ApprovalStepType) => {
      setNodes((prevNodes) => {
        const lastNode = prevNodes.length > 0 ? prevNodes[prevNodes.length - 1] : null;
        const selectedNode = selectedNodeId ? prevNodes.find(node => node.id === selectedNodeId) : null;

        // Определяем родительский узел
        let parentNode = selectedNode || lastNode;
        let parentIncomingEdge = selectedNodeId ? edges.find(edge => edge.target === selectedNodeId) : null;

        // Если у выделенного узла есть потомки, не добавляем шаг
        if (type === 'sequential' && hasOutgoingEdges) {
          message.warning('Нельзя добавить шаг: у выделенного узла уже есть потомок.');
          return prevNodes;
        }

        //обновление типа родительского узла на параллельный при добавлении параллельного (НЕ РАБОТАЕТ НАДО ПОПРАВИТЬ)
        let updatedNodes = prevNodes.map(node => {
          if (parentNode && node.id === parentNode.id && node.type === 'sequential' && type === 'parallel') {
            return {
              ...node,
              type: 'parallel',
              data: {
                ...node.data,
                label: 'Параллельный',
              }
            };
          }
          return node;
        });


        // Создаем новый узел
        const newNode: ApprovalStep = {
          id: `node-${Date.now()}`,
          type,
          data: {
            title: `Шаг ${prevNodes.length + 1}`,
            label: type === 'sequential' ? 'Последовательный' : 'Параллельный',
            duration: 1,
            responsible: users[0]?.id,
            users,
          },
          position: parentNode
              ? type === 'parallel'
                ? { x: parentNode.position.x, y: parentNode.position.y + nodeHeight + 50 } // Добавляем ветку вниз
                : { x: parentNode.position.x + (parentNode.style?.width ? parseInt(parentNode.style.width as string, 10) : nodeWidthStart) + 100, y: parentNode.position.y } // Последовательный узел справа
              : { x: 0, y: 0 },
        };

        updatedNodes = [...prevNodes, newNode];

        setEdges((prevEdges) => {
          let newEdges = [...prevEdges];

          if (type === 'sequential' && parentNode) {
            newEdges.push({
              id: `${parentNode.id}-${newNode.id}-${Date.now()}`,
              source: parentNode.id,
              target: newNode.id,
            } as ApprovalConnection);
          }

          if (type === 'parallel') {
            const sourceId = parentIncomingEdge ? parentIncomingEdge.source : lastNode && edges.find(edge => edge.target === lastNode.id)?.source;
            if (sourceId) {
              newEdges.push({
                id: `${sourceId}-${newNode.id}-${Date.now()}`,
                source: sourceId,
                target: newNode.id,
              } as ApprovalConnection);
            }
          }

          return newEdges;
        });

        return updatedNodes;
      });
    }, [edges, users, selectedNodeId, hasOutgoingEdges]);

  // Функция для обработки соединений
  const handleConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;

    setEdges((prevEdges) => [
      ...prevEdges,
      {
        ...params,
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target
      } as ApprovalConnection
    ]);
  }, []);

  return (
    <div className="workflow-editor">
      <div className="editor-toolbar">
        <Button
          onClick={() => addNode('sequential')}
          disabled={hasOutgoingEdges}
          style={{
            border: '2px solid #52c41a', // Зеленая граница для последовательного шага
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#52c41a'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'black'}
        >
          <PlusOutlined /> Шаг
        </Button>

        <Button
          onClick={() => addNode('parallel')}
          style={{
            border: '2px solid #faad14', // Оранжевая граница для параллельного шага
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#faad14'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'black'}
        >
          <PlusOutlined /> Ветка
        </Button>

        <Button onClick={arrangeLayout}>
          Выровнять схему
        </Button>
        <Button type="primary" onClick={handleSave}>
          Сохранить
        </Button>
      </div>

     <ReactFlow
        nodes={nodesWithUsers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}  // Позволяет перетаскивать соединения
        connectionMode={ConnectionMode.Loose}  // Позволяет соединять с любыми точками
        onConnect={handleConnect}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        fitView
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={100}
          color="#e5e7eb"
        />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ApprovalProcessEditor;