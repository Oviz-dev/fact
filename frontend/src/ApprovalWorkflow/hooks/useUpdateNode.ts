import { useCallback } from 'react';
import { Node, useReactFlow } from 'react-flow-renderer';
import { ApprovalStepData, ApprovalStep, ApprovalConnection } from '../types';

// Функция для определения порядка узлов на основе связей
const getOrderedNodes = (nodes: ApprovalStep[], edges: ApprovalConnection[]): ApprovalStep[] => {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Инициализация графа и степени входа
    nodes.forEach(node => {
        graph.set(node.id, []);
        inDegree.set(node.id, 0);
    });

    // Построение графа и подсчёт степени входа
    edges.forEach(edge => {
        graph.get(edge.source)!.push(edge.target);
        inDegree.set(edge.target, inDegree.get(edge.target)! + 1);
    });

    // Топологическая сортировка
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
        if (degree === 0) {
            queue.push(nodeId);
        }
    });

    const orderedNodes: ApprovalStep[] = [];
    while (queue.length > 0) {
        const nodeId = queue.shift()!;
        const node = nodes.find(n => n.id === nodeId)!;
        orderedNodes.push(node);

        graph.get(nodeId)!.forEach(neighborId => {
            inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
            if (inDegree.get(neighborId)! === 0) {
                queue.push(neighborId);
            }
        });
    }

    return orderedNodes;
};

// Функция для обновления статусов узлов с учётом порядка
const updateNodeStatus = (nodeId: string, newStatus: string, nodes: ApprovalStep[], edges: ApprovalConnection[]) => {
    const orderedNodes = getOrderedNodes(nodes, edges);
    const nodeIndex = orderedNodes.findIndex(node => node.id === nodeId);

    if (nodeIndex === -1) return nodes;

    // Если узел завершён
    if (newStatus === 'completed') {
        // Обновляем статус текущего узла
        const updatedNodes = nodes.map(node => {
            if (node.id === nodeId) {
                return { ...node, data: { ...node.data, status: newStatus } };
            }
            return node;
        });

        // Находим всех потомков завершённого узла
        const children = edges
            .filter(edge => edge.source === nodeId)
            .map(edge => edge.target);

        // Для каждого потомка проверяем, можно ли перевести его в статус "в работе"
        return updatedNodes.map(node => {
            if (children.includes(node.id)) {
                // Находим всех родителей текущего потомка
                const parentNodes = edges
                    .filter(edge => edge.target === node.id)
                    .map(edge => updatedNodes.find(n => n.id === edge.source)!);

                // Проверяем, что все родители завершены
                const allParentsCompleted = parentNodes.every(parent => parent.data.status === 'completed');

                // Если все родители завершены, переводим потомка в статус "в работу"
                if (allParentsCompleted) {
                    return { ...node, data: { ...node.data, status: 'in-progress' } };
                }
            }
            return node;
        });
    }

    // Для других статусов просто обновляем текущий узел
    return nodes.map(node => {
        if (node.id === nodeId) {
            return { ...node, data: { ...node.data, status: newStatus } };
        }
        return node;
    });
};

const useUpdateNode = (nodeId: string) => {
    const { setNodes, getNodes, getEdges } = useReactFlow();

    const updateNodeData = useCallback((newData: Partial<ApprovalStepData>) => {
        setNodes((nodes) => {
            const currentNodes = getNodes();
            const edges = getEdges();

            // Если статус "canceled", прекращаем процесс, статусы не меняем
            if (newData.status === "canceled") {
                return nodes.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
                );
            }

            // Обновляем данные узла
            const updatedNodes = nodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
            );

            // Если статус изменился на "completed", обновляем порядок узлов
            if (newData.status === 'completed') {
                return updateNodeStatus(nodeId, newData.status, updatedNodes as ApprovalStep[], edges);
            }

            return updatedNodes;
        });
    }, [nodeId, setNodes, getNodes, getEdges]);

    return { updateNodeData };
};

export default useUpdateNode;