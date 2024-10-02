import React, { useState } from 'react';
import { Table, Button, Input, Form, message } from 'antd';
import { SearchOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import ContractForm from './ContractForm';
import { fetchContracts, deleteContract, updateContract} from '../services/ContractService';
import { ContractDTO, ContractStatus, ContractType, Contractor } from '../DTO/ContractDTO';
import Header from '../components/Header';

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

      render: (_: any, record: ContractDTO) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="name"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Введите наименование!' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          <div onClick={() => edit(record)}>{record.name}</div>
        );
      },
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
      width: '150px',
      dataIndex: 'contractDate',
      key: 'contractDate',
      sorter: (a:ContractDTO, b:ContractDTO) => a.contractDate.localeCompare(b.contractDate),
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
