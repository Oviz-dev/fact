import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createObject } from '../services/objectService';
import { ObjectEntityDTO } from '../DTO/ObjectEntityDTO';

interface ObjectFormProps {
  onObjectCreated: () => void;
}

const ObjectForm: React.FC<ObjectFormProps> = ({ onObjectCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string }) => {
    setLoading(true);
    try {
      const newObject: Omit<ObjectEntityDTO, 'id'> = { name: values.name };
      await createObject(newObject);
      message.success('Объект добавлен');
      form.resetFields();
      onObjectCreated(); // Обновляем таблицу после добавления объекта
    } catch (error) {
      message.error('Ошибка добавления объекта');
    }
    setLoading(false);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="inline">
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Введите наименование объекта!' }]}
        style={{ width: '80%' }}
      >
        <Input placeholder="Наименование нового объекта" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />} />
      </Form.Item>
    </Form>
  );
};

export default ObjectForm;
