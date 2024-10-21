import React, { useState } from 'react';
import { Table, Button, Input, Form, message } from 'antd';
import { SearchOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { ObjectEntityDTO } from '../DTO/ObjectEntityDTO';
import { deleteObject, updateObject } from '../services/objectService';

interface ObjectTableProps {
  objects: ObjectEntityDTO[];
  refreshObjects: () => void;
}

const ObjectTable: React.FC<ObjectTableProps> = ({ objects, refreshObjects }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<ObjectEntityDTO[]>([]);
  const isEditing = (record: ObjectEntityDTO) => record.id === editingId;

  const edit = (record: ObjectEntityDTO) => {
    form.setFieldsValue({ name: record.name });
    setEditingId(record.id);
  };

  const cancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteObject(id);
      message.success('Объект удален');
      refreshObjects();
    } catch (error) {
      message.error('Ошибка при удалении объекта');
    }
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      await updateObject(id, row);
      setEditingId(null);
      refreshObjects();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);
      setFilteredData(
        objects.filter((obj) =>
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
      sorter: (a:ObjectEntityDTO, b:ObjectEntityDTO) => a.name.localeCompare(b.name),

      filterDropdown: () => (
        <Input
          placeholder="Поиск по наименованию"
          value={searchText}
          onChange={handleSearch}
          style={{ marginBottom: 0 }}
        />
      ),
      filterIcon: <SearchOutlined />,

      render: (_: any, record: ObjectEntityDTO) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="name"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Введите наименование объекта!' }]}
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
      render: (_: any, record: ObjectEntityDTO) => {
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
        dataSource={objects}// переделать на FilteredData
        rowKey="id"
        pagination={{ pageSize: 50 }}
        scroll={{ y: 600 }}
        sticky
      />
    </Form>
  );
};

export default ObjectTable;
