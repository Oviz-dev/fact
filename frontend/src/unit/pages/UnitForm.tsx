import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createUnit } from '../services/unitService';
import { UnitDTO } from '../DTO/UnitDTO';

interface UnitFormProps {
  onUnitCreated: () => void;
}

const UnitForm: React.FC<UnitFormProps> = ({ onUnitCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string }) => {
    setLoading(true);
    try {
      const newUnit: Omit<UnitDTO, 'id'> = { name: values.name };
      await createUnit(newUnit);
      message.success('Добавлена новая единица измерения');
      form.resetFields();
      onUnitCreated(); // Обновляем таблицу после добавления объекта
    } catch (error) {
      message.error('Ошибка добавления единицы измерения');
    }
    setLoading(false);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="inline">
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Введите название единицы измерения' }]}
        style={{ width: '80%' }}
      >
        <Input placeholder="Название новой единицы измерения" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />} />
      </Form.Item>
    </Form>
  );
};

export default UnitForm;
