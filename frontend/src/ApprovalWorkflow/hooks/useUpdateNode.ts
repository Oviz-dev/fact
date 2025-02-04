import { useCallback } from 'react';
import { Node, useReactFlow } from 'react-flow-renderer';
import { ApprovalStepData } from '../types';

const useUpdateNode = (nodeId: string) => {
  const { setNodes } = useReactFlow(); // Берем setNodes из ReactFlow

  const updateNodeData = useCallback((newData: Partial<ApprovalStepData>) => {
    setNodes((nds) =>
      nds.map((node: Node<ApprovalStepData>) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } } // Обновляем data
          : node
      )
    );
  }, [nodeId, setNodes]);

  return { updateNodeData };
};

export default useUpdateNode;
