import axios from 'axios';

import { FactDTO } from '../DTO/FactDTO';
const API_URL = 'http://localhost:8080/api/facts';

// Получить всех
export const fetchFacts =async (): Promise<FactDTO[]> => {
    const response = await axios.get<FactDTO[]>(API_URL);
    return response.data;
};

// Получение  по ID
export const fetchFactById = async (id: number): Promise<FactDTO> => {
    const response = await axios.get<FactDTO>(`${API_URL}/${id}`);
    return response.data;
};

// Создание нового
export const createFact = async (fact: FactDTO): Promise<FactDTO> => {
    const response = await axios.post<FactDTO>(API_URL, fact);
    return response.data;
};
// Удаление существующего
export const deleteFact = async (id: number): Promise<void> => {
    await axios.delete (`${API_URL}/${id}`);
};

// Обновление существующего
export const updateFact = async (id: number, fact: FactDTO): Promise<FactDTO> => {
    const response = await axios.put<FactDTO>(`${API_URL}/${id}`, fact);
    return response.data;
};

export const fetchFactsByContract = async (contractId: number): Promise<FactDTO[]> => {
  const response = await axios.get(`${API_URL}/byContract/${contractId}`);
  return response.data;
};

// Обновление существующего статуса приёмки
export const updateFactAccept = async (id: number, accepted: boolean): Promise<void> => {
    await axios.put(`${API_URL}/${id}/accept`, JSON.stringify(accepted), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

