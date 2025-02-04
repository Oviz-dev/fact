import { useCallback } from 'react';
import { useNodesState } from 'react-flow-renderer';
import { ApprovalStepData } from '../types';

const useUpdateNode = (nodeId: string) => {
  const [, setNodes] = useNodesState<ApprovalStepData>([]);

  const updateNodeData = useCallback((newData: Partial<ApprovalStepData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [nodeId, setNodes]);

  return { updateNodeData };
};

export default useUpdateNode;