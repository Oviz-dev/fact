export interface PnLDTO {
  id: number;
  name: string;
  parentId: number | null;
  direction: string;
  subPnL?: PnLDTO[];
}