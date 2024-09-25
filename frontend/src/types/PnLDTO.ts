export interface PnLDTO {
  id: number;            // Добавляем id
  name: string;
  parentId: number | null;
  direction: string;
  children?: PnLDTO[];    // Добавляем поле children для иерархических данных
}
