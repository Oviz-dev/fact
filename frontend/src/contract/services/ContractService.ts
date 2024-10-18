import axios from 'axios';

import { ContractDTO } from '../DTO/ContractDTO';
const API_URL = 'http://localhost:8080/api/contracts';

// Получение всех контрактов
export const fetchContracts = async (): Promise<ContractDTO[]> => {
    const response = await axios.get<ContractDTO[]>(API_URL);
    return response.data;
};

// Получение контракта по ID
export const fetchContractById = async (id: number): Promise<ContractDTO> => {
    const response = await axios.get<ContractDTO>(`${API_URL}/${id}`);
    return response.data;
};

// Создание нового контракта
export const createContract = async (contract: ContractDTO): Promise<ContractDTO> => {
    const response = await axios.post<ContractDTO>(API_URL, contract);
    return response.data;
};

// Обновление существующего контракта
export const updateContract = async (id: number, contract: ContractDTO): Promise<ContractDTO> => {
    const response = await axios.put<ContractDTO>(`${API_URL}/${id}`, contract);
    return response.data;
};

// Удаление контракта
export const deleteContract = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const updateContractFact = async (id: number, actualCostWithoutVAT: number | string): Promise<void> => {
    if (typeof actualCostWithoutVAT !== 'number' && typeof actualCostWithoutVAT !== 'string') {
        console.error("Invalid actualCostWithoutVAT: ", actualCostWithoutVAT);
        throw new Error("actualCostWithoutVAT must be a number or string");
    }

    await axios.patch(`${API_URL}/${id}/fact`, { actualCostWithoutVAT });
};