

export interface FactDTO{
  id: number;
  accepted: boolean;
  name: string;
  factNumber: string;
  date: string;
  cost: number;
  actualVAT?: number;
  amount?: number;
  unit?: {
    id: number;
    name: string;
  };
  object?: {
    id: number;
    name: string;
  };
  contract?: {
    id: number;
    name: string;
    actualCostWithoutVAT?: number;
    actualVAT?: number;
    contractor?: string ;
  };
  pnl?: {
    id: number;
    name: string;
  };
  basis?: string;
  description?: string;

}
