import { Node, Edge } from 'react-flow-renderer';

export type ApprovalStepType = 'sequential' | 'parallel';

export interface User {
  id: string;
  name: string;
}

export interface ApprovalStepData {
  title: string;
  label: string;
  responsible?: string;
  users?: User[]; // Добавляем пользователей в данные узла
  duration: number; // Длительность шага
}

export type ApprovalStep = Node<ApprovalStepData> & {
  type: ApprovalStepType;
};

export interface ApprovalConnection extends Edge {
  source: string;
  target: string;
}

export type FlowElement = ApprovalStep | ApprovalConnection;