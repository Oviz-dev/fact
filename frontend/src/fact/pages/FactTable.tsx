// FactTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Form, message } from 'antd';
import { fetchFacts,  deleteFact, updateFact } from '../services/factService';
import { FactDTO } from '../DTO/FactDTO';  // Импортируем FactDto

interface FactTableProps {
  facts: FactDTO[];
  refreshFacts: () => void;
  onEdit: (fact: FactDTO) => void;
  SelectedFact: FactDTO | null;
}

const FactTable: React.FC<FactTableProps> = ({
    facts,
    refreshFacts,
    onEdit,
    SelectedFact
    }) => {
  const [form] = Form.useForm();

  const handleDelete = async (id: number) => {
    try {
      await deleteFact(id); // Удаляем
      message.success('Факт удален');
      refreshFacts(); // Обновляем таблицу после удаления
    } catch (error) {
      message.error('Ошибка при удалении');
    }
  };

  // Функция форматирования чисел
   const formatNumber = (value: number | null | undefined) => {
      return value != null ? new Intl.NumberFormat('ru-RU').format(value) : '';
  };

  const columns = [
    {
      title: 'Наименование',
      width: '300px',
      dataIndex: 'name',
      key: 'name',
      sorter: (a:FactDTO, b:FactDTO) => a.name.localeCompare(b.name),
    },
    {
      title: 'Номер',
      width: '150px',
      dataIndex: 'factNumber',
      key: 'factNumber',
      sorter: (a:FactDTO, b:FactDTO) => a.factNumber.localeCompare(b.factNumber),
    },
    {
      title: 'Дата',
      width: '100px',
      dataIndex: 'date',
      key: 'factDate',
      sorter: (a:FactDTO, b:FactDTO) => a.date.localeCompare(b.date),
    },
    {
      title: 'Стоимость, руб. без НДС',
      width: '200px',
      dataIndex: 'cost',
      key: 'cost',
      render: (value: number) => formatNumber(value),
      sorter: (a: FactDTO, b: FactDTO) =>
          (a.cost ?? 0) - (b.cost ?? 0)
    },
  ];

  return (
    <Form form={form} component={false} >
      <Table
        columns={columns}
        dataSource={facts}// переделать на FilteredData
        rowKey="id"
        pagination={{ pageSize: 50 }}
        scroll={{ y: 600 }}
        sticky
        onRow={(record) => ({
          onClick: () => {
            onEdit(record);
          },
        style: {
          background: SelectedFact?.id === record.id ? '#e6f7ff' : undefined,
        },
        })}
      />
    </Form>
  );
};

export default FactTable;