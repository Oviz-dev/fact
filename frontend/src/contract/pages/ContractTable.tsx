import React, { useState } from 'react';
import { Table, Button, Input, Form, message } from 'antd';
import { SearchOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import ContractForm from './ContractForm';
import { fetchContracts, deleteContract, updateContract} from '../services/ContractService';
import { ContractDTO, ContractStatus, ContractType, Contractor } from '../DTO/ContractDTO';

interface ContractTableProps {
  contracts: ContractDTO[];
  refreshContracts: () => void;
}

const ContractTable: React.FC<ContractTableProps> = ({ contracts, refreshContracts }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<ContractDTO[]>([]);
  const isEditing = (record: ContractDTO) => record.id === editingId;

  const edit = (record: ContractDTO) => {
    form.setFieldsValue({ name: record.name });
    setEditingId(record.id);
  };

  const cancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContract(id); // Удаляем объект
      message.success('Объект удален');
      refreshContracts(); // Обновляем таблицу после удаления
    } catch (error) {
      message.error('Ошибка при удалении объекта');
    }
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      await updateContract(id, row);
      setEditingId(null);
      refreshContracts(); // Обновляем таблицу после обновления
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const columns = [
    {
      title: 'Наименование',
      width: '20%',
      dataIndex: 'name',
      key: 'name',
      sorter: (a:ContractDTO, b:ContractDTO) => a.name.localeCompare(b.name),
    },
    {
      title: 'Номер',
      width: '150px',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      sorter: (a:ContractDTO, b:ContractDTO) => a.contractNumber.localeCompare(b.contractNumber),
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
      width: '80px',
      dataIndex: 'status',
      key: 'status',
      sorter: (a:ContractDTO, b:ContractDTO) => a.status.localeCompare(b.status),
    },
    {
      title: 'Тип',
      width: '50px',
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
      title: 'Аванс (%)',
      width: '80px',
      dataIndex: 'plannedAdvancePercent',
      key: 'plannedAdvancePercent',
    },
    {
      title: 'Стоимость (план)',
      width: '200px',
      dataIndex: 'plannedCostWithoutVAT',
      key: 'plannedCostWithoutVAT',
    },
    {
      title: 'Стоимость (факт)',
      width: '200px',
      dataIndex: 'actualCostWithoutVAT',
      key: 'actualCostWithoutVAT',
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        columns={columns}
        dataSource={contracts}// переделать на FilteredData
        rowKey="id"
        pagination={{ pageSize: 50 }}
        scroll={{ y: 600 }}
        sticky
      />
    </Form>
  );
};

export default ContractTable;