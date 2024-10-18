// FactTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Form, message } from 'antd';
import { fetchFacts,  deleteFact, updateFact } from '../services/factService';
import { FactDTO } from '../DTO/FactDTO';
import {formatNumber} from '../../functions/formatNumber'

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


  const columns = [
    {
      title: '№',
      width: '50px',
      dataIndex: 'factNumber',
      key: 'factNumber',
    },
    {
      title: 'Наименование',
      width: '200px',
      dataIndex: 'name',
      key: 'name',
      sorter: (a:FactDTO, b:FactDTO) => a.name.localeCompare(b.name),
    },
    {
      title: 'Дата',
      width: '100px',
      dataIndex: 'date',
      key: 'factDate',
      sorter: (a:FactDTO, b:FactDTO) => a.date.localeCompare(b.date),
    },
    {
      title: 'Принят',
      width: '50px',
      dataIndex: 'accepted',
      key: 'accepted',
    },
    {
      title: 'Статья',
      width: '150px',
      dataIndex: 'pnl',
      key: 'pnl',
      sorter: (a:FactDTO, b:FactDTO) => a.date.localeCompare(b.date),
      render: (pnl: FactDTO['pnl']) => pnl?.name || '—',
    },
    {
      title: 'Сумма, руб. без НДС',
      width: '100px',
      dataIndex: 'cost',
      key: 'cost',
      render: (value: number) => formatNumber(value),
      sorter: (a: FactDTO, b: FactDTO) =>
          (a.cost ?? 0) - (b.cost ?? 0)
    },
    {
      title: 'Договор',
      width: '100px',
      dataIndex: 'contract',
      key: 'contract',
      sorter: (a:FactDTO, b:FactDTO) => a.date.localeCompare(b.date),
      render: (contract: FactDTO['contract']) => contract?.name || '—',
    },
    {
      title: 'Объект',
      width: '100px',
      dataIndex: 'object',
      key: 'object',
      sorter: (a:FactDTO, b:FactDTO) => a.date.localeCompare(b.date),
      render: (object: FactDTO['object']) => object?.name || '—',
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