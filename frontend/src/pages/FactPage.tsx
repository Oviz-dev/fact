// pages/FactPage.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { fetchFacts } from '../services/factService';
import { FactDTO } from '../types/FactDTO';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/facts';


const FactPage = () => {
  const [facts, setFacts] = useState<FactDTO[]>([]);

useEffect(() => {
  const fetchFacts = async () => {
    try {
      const response = await axios.get<FactDTO[]>(API_URL);
      setFacts(response.data); // Используем response.data, чтобы получить фактические данные
    } catch (error) {
      console.error("Error fetching facts:", error);
    }
  };

  fetchFacts();
}, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Cost', dataIndex: 'cost', key: 'cost' },
    // другие поля
  ];

  return (
    <>
      <h1>Facts</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        Create Fact
      </Button>
      <Table dataSource={facts} columns={columns} rowKey="id" />
    </>
  );
};

export default FactPage;
