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

// Режим шаблона и режим процесса для экземпляра сущности
export enum ProcessMode {
  TEMPLATE = 'Шаблон',
  INSTANCE = 'Экземпляр'
}

//обсудить необходимость вводить тип схемы согласования
export enum TemplateType {
  ALL = 'Все',
  ANY = 'Любой',
}
//типы доступных для согласования сущностей
export enum EntityType {
  BUDGET = 'Бюджет',
  GANT = 'График',
  DOCUMENT = 'Документ'
}

export enum ProcessStatus {
  DRAFT = 'Черновик',
  ACTIVE = 'В работе',
  COMPLETE = 'Выполнен'
}

export interface ApprovalTemplate {
  id: string; //ID шаблона
  name: string; // Название шаблона
  description: string; // Описание шаблона
  templateType: TemplateType; // Тип согласования в шаблоне
  entityType: EntityType; // Типы сущностей, для которых применим шаблон
  nodes: ApprovalStep[]; // Узлы
  edges: ApprovalConnection[]; //Связи
}

export interface ApprovalInstance {
  id: string; //ID экземпляра процесса
  entityId: string; // ID привязанной сущности
  templateId?: string; // ID шаблона
  nodes: ApprovalStep[]; // узлы
  edges: ApprovalConnection[]; // связи
  status: ProcessStatus; // статус
}

// Обновляем пропсы компонента
export interface ApprovalProcessEditorProps {
  mode: ProcessMode;
  entityId?: string;
  templateId?: string;
  initialNodes: ApprovalStep[];
  initialEdges: ApprovalConnection[];
}