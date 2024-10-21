import React, { useState } from 'react';
import { Table, Button, Input, Form, message } from 'antd';
import { SearchOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { UnitDTO } from '../DTO/UnitDTO';
import { deleteUnit, updateUnit } from '../services/unitService';

interface UnitProps {
  units: UnitDTO[];
  refreshUnits: () => void;
}

const UnitTable: React.FC<UnitProps> = ({ units, refreshUnits }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<UnitDTO[]>([]);
  const isEditing = (record: UnitDTO) => record.id === editingId;

  const edit = (record: UnitDTO) => {
    form.setFieldsValue({ name: record.name });
    setEditingId(record.id);
  };

  const cancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUnit(id);
      message.success('Единица измерения удалена');
      refreshUnits();
    } catch (error) {
      message.error('Ошибка при удалении');
    }
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      await updateUnit(id, row);
      setEditingId(null);
      refreshUnits();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);
      setFilteredData(
        units.filter((obj) =>
          obj.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    };

  const columns = [
    {
      title: 'Наименование',
      width: '60%',
      dataIndex: 'name',
      key: 'name',
      sorter: (a:UnitDTO, b:UnitDTO) => a.name.localeCompare(b.name),

      filterDropdown: () => (
        <Input
          placeholder="Поиск по наименованию"
          value={searchText}
          onChange={handleSearch}
          style={{ marginBottom: 0 }}
        />
      ),
      filterIcon: <SearchOutlined />,

      render: (_: any, record: UnitDTO) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="name"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Введите название единицы измерения' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          <div onClick={() => edit(record)}>{record.name}</div>
        );
      },
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_: any, record: UnitDTO) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button type="primary" onClick={() => save(record.id)} icon={<CheckOutlined />} style={{ marginRight: 10 }}/>
            <Button onClick={cancel } icon={<CloseOutlined />} style={{ marginRight: 10 }}/>
            <Button danger onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} style={{ marginRight: 10 }} />
          </>
        ) : null;
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        columns={columns}
        dataSource={units}// переделать на FilteredData
        rowKey="id"
        pagination={{ pageSize: 50 }}
        scroll={{ y: 600 }}
        sticky
      />
    </Form>
  );
};

export default UnitTable;
