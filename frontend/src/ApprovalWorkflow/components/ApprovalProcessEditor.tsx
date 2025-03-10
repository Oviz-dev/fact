import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
    Controls,
    Background,
    Edge,
    Connection,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    updateEdge,
    ConnectionMode,
} from 'react-flow-renderer';
import { Button, message, Tooltip } from 'antd';
import { PlusOutlined, StopOutlined, CaretRightOutlined } from '@ant-design/icons';
import dagre from 'dagre';
import { ApprovalStep, ApprovalConnection, ApprovalStepType, ProcessMode, ProcessStatus } from '../types';
import { useUserContext } from '../context/UserContext';
import { validateFlow } from '../utils/validation';
import { saveApprovalInstance , saveApprovalTemplate} from '../utils/api';
import nodeTypes from './NodeTypes';
import '../styles/workflow.css';
import { ApprovalProcessContext, useApprovalProcessContext } from './ApprovalProcessContext';
import {controlHeight ,nodeWidthStart} from './UIKit';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeHeight = 120; // высота узла

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

interface ApprovalProcessEditorProps {
    mode: ProcessMode;
    instanceData?: {
        id: string;
        entityId: string;
        templateId: string;
        status: string;
    };
    templateData?: {
        id: string;
        name: string;
        description: string;
        templateType: string;
        entityType: string;
    };
    initialNodes: ApprovalStep[];
    initialEdges: ApprovalConnection[];
    processStatus?: ProcessStatus; // Статус процесса для запущенного экземпляра
    onStartProcess?: () => void; // Колбэк для запуска процесса
    onCompleteProcess?: () => void; // Колбэк для завершения процесса
    onStopProcess?: () => void; //Колбэк для остановки процесса
}

const ApprovalProcessEditor: React.FC<ApprovalProcessEditorProps> = ({
        initialNodes, //загруженные из файла узлы
        initialEdges, //загруженные из файла связи
        instanceData, //данные экземпляра процесса
        templateData, //данные шаблона процесса
        mode, // режим работы (шаблон/экземпляр)
        processStatus, // статус процесса
        onStartProcess,
        onStopProcess,
        onCompleteProcess
    }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<ApprovalStep['data']>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<ApprovalConnection>(initialEdges);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const { users } = useUserContext();

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [ setEdges, setNodes, initialNodes, initialEdges]);

    // Логика перехода между узлами
    useEffect(() => {
        if (processStatus !== ProcessStatus.ACTIVE) return;

        const activeNode = nodes.find(node => node.data.status === 'in-progress');
        if (!activeNode) {
            const firstNode = nodes[0];
            if (firstNode) {
                setNodes(nds => nds.map(node =>
                node.id === firstNode.id
                    ? { ...node, data: { ...node.data, status: 'in-progress' } }
                    : node
                ));
            }
        }
    }, [setNodes, processStatus, nodes]);

    const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
        setEdges((prevEdges) => updateEdge(oldEdge, newConnection, prevEdges));
    };

    const hasOutgoingEdges = useMemo(() => {
        if (!selectedNodeId) return false;
        return edges.some(edge => edge.source === selectedNodeId);
    }, [selectedNodeId, edges]);

    // Функция выравнивания узлов
    const arrangeLayout = useCallback(() => {
        setNodes((prevNodes) => layoutElements(prevNodes as ApprovalStep[], edges));
    }, [setNodes, edges]);

    //функция сохранения файла
    const saveToFile = (data: object, filename: string) => {
      const json = JSON.stringify(data, null, 2); // Формат JSON с отступами
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    // Функция сохранения процесса
    const handleSave = useCallback(async () => {
        try {
            setNodes((prevNodes) => {
                const arrangedNodes = layoutElements(prevNodes as ApprovalStep[], edges);

                const validationResult = validateFlow({ nodes: arrangedNodes, edges });
                if (!validationResult.isValid) {
                  message.error(validationResult.errors.join(', '));
                  return prevNodes;
                }

                if (mode === ProcessMode.TEMPLATE) {
                    if (!templateData) {
                      message.error('Отсутствуют данные шаблона');
                      return prevNodes;
                    }
                    const templatePayload = {
                          id: templateData.id,
                          name: templateData.name,
                          description: templateData.description,
                          templateType: templateData.templateType,
                          entityType: templateData.entityType,
                          nodes: arrangedNodes,
                          edges,
                    }
                    saveApprovalTemplate(templatePayload)
                    .then(() => {
                        message.success('Шаблон успешно сохранен');
                        saveToFile(templatePayload, `template-${templateData.id}.json`);
                    })
                    .catch(() => message.error('Ошибка сохранения шаблона'));
                } else {
                    if (!instanceData) {
                      message.error('Отсутствуют данные процесса');
                      return prevNodes;
                    }
                    const instancePayload={
                        id: instanceData.id,
                        entityId: instanceData.entityId,
                        templateId: instanceData.templateId,
                        status: instanceData.status,
                        nodes: arrangedNodes,
                        edges
                    }
                    saveApprovalInstance(instancePayload)
                    .then(() => {
                        message.success('Процесс успешно сохранен');
                        saveToFile(instancePayload, `process-${instanceData.entityId}.json`);
                    })
                    .catch(() => message.error('Ошибка сохранения процесса'));
                }

                return arrangedNodes;
            });
        } catch {
          message.error('Ошибка сохранения процесса');
        }
    }, [setNodes, edges, mode, instanceData, templateData]);

    // Функция добавления нового узла
    const addNode = useCallback((type: ApprovalStepType) => {
        setNodes((prevNodes) => {
            const lastNode = prevNodes.length > 0 ? prevNodes[prevNodes.length - 1] : null;
            const selectedNode = selectedNodeId ? prevNodes.find(node => node.id === selectedNodeId) : null;

            // 1. Копируем предыдущие узлы
            let updatedNodes = [...prevNodes];
            let parentNode = selectedNode || lastNode;

            // 2. Преобразование родителя до создания нового узла
            if (type === 'parallel' && parentNode?.type === 'sequential') {
                updatedNodes = updatedNodes.map(node =>
                    node.id === parentNode!.id
                    ? {
                        ...node,
                        type: 'parallel',
                        data: { ...node.data, label: 'Параллельный' }
                    }
                : node
                );

                // 3. Обновляем ссылку на родителя после изменения
                parentNode = updatedNodes.find(node => node.id === parentNode!.id)!;
            }

            // 4. Создаем новый узел с учетом обновленного родителя
            const newNode: ApprovalStep = {
                id: `node-${Date.now()}`,
                type,
                data: {
                    title: `Шаг ${updatedNodes.length + 1}`,
                    label: type === 'sequential' ? 'Последовательный' : 'Параллельный',
                    duration: 1,
                    status: 'pending',
                    responsible: users[0]?.id,
                    users,
                },
                position: parentNode
                ? type === 'parallel'
                    ? { x: parentNode.position.x, y: parentNode.position.y + nodeHeight + 50 }
                    : { x: parentNode.position.x + (parentNode.style?.width ?
                        parseInt(parentNode.style.width as string, 10) : nodeWidthStart)  + 100,
                        y: parentNode.position.y }
                : { x: 0, y: 0 },
            };

            // 5. Добавляем новый узел в обновлённый список узлов
            updatedNodes = [...updatedNodes, newNode];

            // 6. Обновляем соединения
            setEdges((prevEdges) => {
                let newEdges = [...prevEdges];

                if (parentNode) {
                    if (type === 'sequential') {
                        newEdges.push({
                            id: `${parentNode.id}-${newNode.id}-${Date.now()}`,
                            source: parentNode.id,
                            target: newNode.id,
                        });
                    } else {
                        const sourceId = edges.find(edge => edge.target === parentNode!.id)?.source;
                        if (sourceId) {
                            newEdges.push({
                                id: `${sourceId}-${newNode.id}-${Date.now()}`,
                                source: sourceId,
                                target: newNode.id,
                            });
                        }
                    }
                }

            return newEdges;
            });

        return updatedNodes; // Возвращаем обновленные узлы
        });
    }, [setNodes, setEdges, edges, users, selectedNodeId]);

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
    }, [setEdges]);

    return (
        <div className="workflow-editor">
            <div className="editor-toolbar">
                <Button
                    onClick={() => addNode('sequential')}
                    disabled={hasOutgoingEdges || processStatus === ProcessStatus.ACTIVE}
                    style={{
                        border: 'none',//'2px solid #52c41a',
                        height: controlHeight
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#52c41a'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'black'}
                >
                    <PlusOutlined /> Шаг
                </Button>

                <Button
                    onClick={() => addNode('parallel')}
                    disabled={ processStatus === ProcessStatus.ACTIVE}
                    style={{
                        border: 'none',//'2px solid #faad14',
                        height: controlHeight
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#faad14'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'black'}
                >
                    <PlusOutlined /> Ветка
                </Button>

                <Button
                    onClick={arrangeLayout}
                    disabled={ processStatus === ProcessStatus.ACTIVE}
                    style={{
                        border: 'none',
                        height: controlHeight
                    }}
                >
                    Выровнять схему
                </Button>

                <Button
                    type="default"
                    onClick={handleSave}
                    disabled={processStatus === ProcessStatus.ACTIVE}
                    style={{
                        border: 'none',
                        height: controlHeight
                    }}
                >
                    Сохранить
                </Button>
                {mode === ProcessMode.INSTANCE &&(
                    processStatus === ProcessStatus.ACTIVE ? (
                        <Tooltip title="Остановить">
                            <Button
                                onClick={onStopProcess}
                                danger
                                style={{
                                    border: 'none',
                                    height: controlHeight
                                }}
                                icon={<StopOutlined />}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Запустить">
                            <Button
                                onClick={onStartProcess}
                                style={{
                                    border: 'none',
                                    height: controlHeight
                                }}
                                type="primary"
                                icon={<CaretRightOutlined />}
                            />
                        </Tooltip>
                    )
                )}
            </div>
            <ApprovalProcessContext.Provider value={{ processStatus, mode }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={processStatus!==ProcessStatus.ACTIVE ? onNodesChange: undefined}
                    onEdgesChange={processStatus!==ProcessStatus.ACTIVE ? onEdgesChange: undefined}
                    onEdgeUpdate={processStatus!==ProcessStatus.ACTIVE ? onEdgeUpdate: undefined}  // Позволяет перетаскивать соединения
                    connectionMode={processStatus!==ProcessStatus.ACTIVE ? ConnectionMode.Loose: undefined}  // Позволяет соединять с любыми точками
                    onConnect={processStatus!==ProcessStatus.ACTIVE ? handleConnect: undefined} // Позволяет добавлять соединения вручную
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
            </ApprovalProcessContext.Provider>
        </div>
    );
};

export default ApprovalProcessEditor;