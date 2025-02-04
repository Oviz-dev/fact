import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
} from 'react-flow-renderer';
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

    const newNode: ApprovalStep = {
      id: `node-${Date.now()}`,
      type,
      data: {
        title: `Шаг ${prevNodes.length + 1}`,
        label: type === 'sequential' ? 'Последовательный' : 'Параллельный',
        responsible: users[0]?.id,
        users
      },
      position: lastNode
        ? { x: lastNode.position.x + nodeWidth + 100, y: lastNode.position.y } // Смещаем вправо
        : { x: 0, y: 0 } // Первый узел в (0,0)
    };

    const updatedNodes = [...prevNodes, newNode];

    setEdges((prevEdges) => {
      if (!lastNode) return prevEdges;

      return [
        ...prevEdges,
        {
          id: `${lastNode.id}-${newNode.id}`,
          source: lastNode.id,
          target: newNode.id
        } as ApprovalConnection
      ];
    });

    return updatedNodes;
  });
}, [edges, users]);



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
        <Button onClick={() => addNode('sequential')}>
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
