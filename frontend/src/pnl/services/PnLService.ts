import axios from 'axios';
import { PnLDTO } from '../DTO/PnLDTO';

const API_URL = 'http://localhost:8080/api/pnl';

// Получить все статьи иерархически
export const fetchPnL = async (): Promise<PnLDTO[]> => {
  const response = await axios.get<PnLDTO[]>(API_URL);
  return response.data;
};

// Создать новую статью
export const createPnL = async (pnl: PnLDTO): Promise<PnLDTO> => {
  const response = await axios.post<PnLDTO>(API_URL, pnl);
  return response.data;
};

// Обновить статью
export const updatePnL = async (id: number, pnl: PnLDTO): Promise<PnLDTO> => {
  const response = await axios.put<PnLDTO>(`${API_URL}/${id}`, pnl);
  return response.data;
};

// Удалить статью
export const deletePnL = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
