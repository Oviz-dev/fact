//ContractTable
import React, { useState } from 'react';
import { Table, Form, message } from 'antd';
import { fetchContracts, deleteContract, updateContract} from '../services/ContractService';
import { ContractDTO} from '../DTO/ContractDTO';
import {formatNumber} from '../../functions/formatNumber'

interface ContractTableProps {
  contracts: ContractDTO[];
  refreshContracts: () => void;
  onEdit: (contract: ContractDTO) => void;
  SelectedContract: ContractDTO | null;
}

const ContractTable: React.FC<ContractTableProps> = ({
    contracts,
    refreshContracts,
    onEdit,
    SelectedContract
    }) => {
  const [form] = Form.useForm();

  const handleDelete = async (id: number) => {
    try {
      await deleteContract(id); // Удаляем объект
      message.success('Объект удален');
      refreshContracts(); // Обновляем таблицу после удаления
    } catch (error) {
      message.error('Ошибка при удалении');
    }
  };


  const columns = [
    {
      title: 'Наименование',
      width: '300px',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Номер',
      width: '150px',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
    },
    {
      title: 'Дата',
      width: '100px',
      dataIndex: 'contractDate',
      key: 'contractDate',
      sorter: (a:ContractDTO, b:ContractDTO) => a.contractDate.localeCompare(b.contractDate),
    },
    {
      title: 'Статус',
      width: '100px',
      dataIndex: 'status',
      key: 'status',
      sorter: (a:ContractDTO, b:ContractDTO) => a.status.localeCompare(b.status),
    },
    {
      title: 'Тип',
      width: '100px',
      dataIndex: 'type',
      key: 'type',
      sorter: (a:ContractDTO, b:ContractDTO) => a.type.localeCompare(b.type),
    },
    {
      title: 'Подрядчик',
      width: '150px',
      dataIndex: 'contractor',
      key: 'contractor',
      sorter: (a:ContractDTO, b:ContractDTO) => a.contractor.localeCompare(b.contractor),
    },
    {
      title: 'Стоимость, руб. без НДС',
      width: '200px',
      dataIndex: 'plannedCostWithoutVAT',
      key: 'plannedCostWithoutVAT',
      render: (value: number) => formatNumber(value),
      sorter: (a: ContractDTO, b: ContractDTO) =>
          (a.plannedCostWithoutVAT ?? 0) - (b.plannedCostWithoutVAT ?? 0)
    },
    {
      title: 'Аванс, %',
      width: '100px',
      dataIndex: 'plannedAdvancePercent',
      key: 'plannedAdvancePercent',
    },
    {
      title: 'Выполнение, руб. без НДС',
      width: '200px',
      dataIndex: 'actualCostWithoutVAT',
      key: 'actualCostWithoutVAT',
      render: (value: number) => formatNumber(value),
      sorter: (a: ContractDTO, b: ContractDTO) =>
            (a.actualCostWithoutVAT ?? 0) - (b.actualCostWithoutVAT ?? 0)
    },
  ];

  return (
    <Form form={form} component={false} >
      <Table
        columns={columns}
        dataSource={contracts}// переделать на FilteredData
        rowKey="id"
        pagination={{ pageSize: 50 }}
        scroll={{ y: 600 }}
        sticky
        onRow={(record) => ({
          onClick: () => {
            onEdit(record);
          },
        style: {
          background: SelectedContract?.id === record.id ? '#e6f7ff' : undefined,
        },
        })}
      />
    </Form>
  );
};

export default ContractTable;