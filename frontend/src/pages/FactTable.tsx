// FactTable.tsx

import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { fetchFacts } from '../services/factService';
import { FactDTO } from '../types/FactDTO';  // Импортируем FactDto

const FactTable: React.FC = () => {
  const [facts, setFacts] = useState<FactDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFacts();
  }, []);

  const loadFacts = async () => {
    setLoading(true);
    try {
      const response = await fetchFacts();
      setFacts(response.data);
    } catch (error) {
      message.error('Failed to load facts');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: FactDTO, b: FactDTO) => a.name.localeCompare(b.name),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: FactDTO, b: FactDTO) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      sorter: (a: FactDTO, b: FactDTO) => a.cost - b.cost,
    },
    {
      title: 'Object',  // Новый столбец для отображения объекта
      dataIndex: ['object', 'name'],  // Используем вложенный объект
      key: 'object',
      sorter: (a: FactDTO, b: FactDTO) => a.object.name.localeCompare(b.object.name),
    },
    // Добавьте другие столбцы, если нужно
  ];

  return (
    <Table
      columns={columns}
      dataSource={facts}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ y: 240 }}  // Фиксированный заголовок при прокрутке
    />
  );
};

export default FactTable;
