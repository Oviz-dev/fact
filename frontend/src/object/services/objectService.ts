import axios from 'axios';
import { ObjectEntityDTO } from '../DTO/ObjectEntityDTO';

const API_URL = 'http://localhost:8080/api/objects';

// Получение всех объектов
export const fetchObjects = async () => {
  return axios.get<ObjectEntityDTO[]>(API_URL);
};

// Создание объекта
export const createObject = async (object: Omit<ObjectEntityDTO, 'id'>) => {
  return axios.post(API_URL, object);
};

// Удаление объекта
export const deleteObject = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Обновление объекта
export const updateObject = async (id: number, object: ObjectEntityDTO) => {
  return axios.put(`${API_URL}/${id}`, object);
};

// Импорт объектов
export const importObjects = async (objects: { name: string }[]) => {
  await axios.post(API_URL, objects);
};