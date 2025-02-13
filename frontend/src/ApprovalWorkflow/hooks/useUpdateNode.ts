import { useCallback } from 'react';
import { Node, useReactFlow } from 'react-flow-renderer';
import { ApprovalStepData } from '../types';

const useUpdateNode = (nodeId: string) => {
    const { setNodes, getNodes } = useReactFlow(); // Добавляем getNodes

    const updateNodeData = useCallback((newData: Partial<ApprovalStepData>) => {
        setNodes((nodes) => {
            const currentNodes = getNodes();

            // Если статус "canceled", прекращаем процесс, статусы не меняем
            if (newData.status === "canceled") {
                return nodes.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
                );
            }

            // Если узел завершен, переводим следующий в "in-progress"
            return nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } };
                }

                if (newData.status === "completed") {
                    const currentIndex = currentNodes.findIndex((n) => n.id === nodeId);
                    const nextNode = currentNodes[currentIndex + 1];

                    if (nextNode && node.id === nextNode.id) {
                        return { ...node, data: { ...node.data, status: "in-progress" } };
                    }
                }
                return node;
            });

        });
    }, [nodeId, setNodes, getNodes]);

    return { updateNodeData };
};

export default useUpdateNode;
