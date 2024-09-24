import axios from 'axios';

import { FactDTO } from '../types/FactDTO';  // Импортируем FactDto
const API_URL = 'http://localhost:8080/api/facts';

export const fetchFacts = async () => {
  return axios.get<FactDTO[]>(API_URL);
};

export const createFact = async (data: any) => {
  return axios.post(API_URL, data);
};

export const deleteFact = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
