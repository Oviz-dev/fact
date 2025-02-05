import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
} from 'react-flow-renderer';

import { useNodes, useEdges, useReactFlow } from 'react-flow-renderer';

import { Button, message } from 'antd';
import dagre from 'dagre';
import { ApprovalStep, ApprovalConnection, ApprovalStepType } from '../types';
import { useUserContext } from '../context/UserContext';
import { validateFlow } from '../utils/validation';
import { saveApprovalFlow } from '../utils/api';
import nodeTypes from './NodeTypes';
import '../styles/workflow.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 240;
const nodeHeight = 120;

const layoutElements = (nodes: ApprovalStep[], edges: ApprovalConnection[]): ApprovalStep[] => {
  dagreGraph.setGraph({
    rankdir: 'LR',
    nodesep: 100,
    ranksep: 80
  });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map(node => {
    const { x, y } = dagreGraph.node(node.id);
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
            ? { x: parentNode.position.x + nodeWidth + 100, y: parentNode.position.y }
            : { x: 0, y: 0 }, // Первый узел в (0,0)
        };

        const updatedNodes = [...prevNodes, newNode];

        setEdges((prevEdges) => {
          let newEdges = [...prevEdges];

          if (type === 'sequential' && parentNode) {
            newEdges.push({
              id: `${parentNode.id}-${newNode.id}`,
              source: parentNode.id,
              target: newNode.id,
            } as ApprovalConnection);
          }

          if (type === 'parallel' && parentIncomingEdge) {
            newEdges.push({
              id: `${parentIncomingEdge.source}-${newNode.id}`,
              source: parentIncomingEdge.source,
              target: newNode.id,
            } as ApprovalConnection);
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
        <Button onClick={() => addNode('sequential')} disabled={hasOutgoingEdges}>
          Добавить шаг
        </Button>
        <Button onClick={() => addNode('parallel')}>
          Добавить ветку
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
