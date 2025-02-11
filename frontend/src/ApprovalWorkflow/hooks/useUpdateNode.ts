import { useCallback } from 'react';
import { Node, useReactFlow } from 'react-flow-renderer';
import { ApprovalStepData } from '../types';

const useUpdateNode = (nodeId: string) => {
  const { setNodes, getNodes } = useReactFlow(); // Добавляем getNodes

  const updateNodeData = useCallback((newData: Partial<ApprovalStepData>) => {
    setNodes((nodes) => {
      const currentNodes = getNodes();
      return nodes.map((node: Node<ApprovalStepData>, index) => {
        if (node.id === nodeId) {
          console.log(`✅ Завершаем узел ${nodeId}`);
          return { ...node, data: { ...node.data, ...newData } };
        }
        if (newData.status === "completed") {
          // Если узел завершен, находим следующий узел
          const currentIndex = currentNodes.findIndex((n) => n.id === nodeId);
          const nextNode = currentNodes[currentIndex + 1];

          if (nextNode && node.id === nextNode.id) {
            console.log(`➡️ Переводим узел ${nextNode.id} в "in-progress"`);
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
