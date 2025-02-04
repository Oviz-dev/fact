import { ApprovalStep, ApprovalConnection } from '../types';

interface FlowElements {
  nodes: ApprovalStep[];
  edges: ApprovalConnection[];
}

export const validateFlow = ({ nodes, edges }: FlowElements) => {
  const errors: string[] = [];
  nodes.forEach(node => {
    if (!node.data.responsible) {
      errors.push(`Шаг ${node.id} не имеет ответственного`);
    }
    if (!node.data.title?.trim()) {
      errors.push(`Шаг ${node.id} не имеет названия`);
    }
    if (edges.length < nodes.length - 1) {
        errors.push('Шаги не связаны');
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};