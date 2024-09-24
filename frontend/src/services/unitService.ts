//unitService

import axios from 'axios';
import { UnitDTO } from '../types/UnitDTO';

const API_URL = 'http://localhost:8080/api/units';

// Получение всех еи
export const fetchUnits = async () => {
  return axios.get<UnitDTO[]>(API_URL);
};

// Создание еи
export const createUnit = async (unit: Omit<UnitDTO, 'id'>) => {
  return axios.post(API_URL, unit);
};

// Удаление еи
export const deleteUnit = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Обновление еи
export const updateUnit = async (id: number, unit: UnitDTO) => {
  return axios.put(`${API_URL}/${id}`, unit);
};

// Импорт
export const importUnits = async (units: { name: string }[]) => {
  await axios.post(API_URL, units);
};