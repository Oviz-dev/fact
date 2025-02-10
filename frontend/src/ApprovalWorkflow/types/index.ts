import { Node, Edge } from 'react-flow-renderer';

// типы узлов
export type ApprovalStepType = 'sequential' | 'parallel';
export type ApprovalStep = Node<ApprovalStepData> & {
  type: ApprovalStepType;
};

export interface ApprovalStepData {
  title: string;
  label: string;
  responsible?: string; // ответственный
  users?: User[]; // пользователь данные узла
  duration: number; // Длительность шага
  status?: 'pending' | 'in-progress' | 'completed'; // статус узла при выполнении процесса
}

export interface User {
  id: string;
  name: string;
}

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

//статус всего процесса после запуска
export enum ProcessStatus {
  DRAFT = 'Черновик',
  ACTIVE = 'В работе',
  COMPLETE = 'Выполнен'
}

//шаблон процесса
export interface ApprovalTemplate {
  id: string; //ID шаблона
  name: string; // Название шаблона
  description: string; // Описание шаблона
  templateType: TemplateType; // Тип согласования в шаблоне
  entityType: EntityType; // Типы сущностей, для которых применим шаблон
  nodes: ApprovalStep[]; // Узлы
  edges: ApprovalConnection[]; //Связи
}

//экземпляр процесса для сущности
export interface ApprovalInstance {
  id: string; //ID экземпляра процесса
  entityId: string; // ID привязанной сущности
  templateId?: string; // ID шаблона
  nodes: ApprovalStep[]; // узлы
  edges: ApprovalConnection[]; // связи
  status: ProcessStatus; // статус
}

export interface ApprovalProcessEditorProps {
  mode: ProcessMode;
  entityId?: string;
  templateId?: string;
  initialNodes: ApprovalStep[];
  initialEdges: ApprovalConnection[];
}