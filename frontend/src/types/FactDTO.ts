

export interface FactDTO{
  id: number;
  name: string;
  date: string;
  cost: number;
  object: {  // Связанный объект
    id: number;
    name: string;
  };
}
