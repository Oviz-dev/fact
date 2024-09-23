import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, DatePicker, message, Select } from 'antd';
import { createFact, fetchFacts } from '../services/factService';
import moment from 'moment';

const { Option } = Select;

interface ObjectEntity {
  id: number;
  name: string;
}

const FactForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState<ObjectEntity[]>([]);

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      const response = await fetchFacts();
      setObjects(response.data);
    } catch (error) {
      message.error('Failed to load objects');
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await createFact({
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        objectId: values.objectId, // Привязываем объект через objectId
      });
      message.success('Fact added successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to add fact');
    }
    setLoading(false);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="inline">
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please input fact name!' }]}
      >
        <Input placeholder="Fact Name" />
      </Form.Item>

      <Form.Item
        name="date"
        rules={[{ required: true, message: 'Please select date!' }]}
      >
        <DatePicker defaultValue={moment()} />
      </Form.Item>

      <Form.Item
        name="cost"
        rules={[{ required: true, message: 'Please input cost!' }]}
      >
        <InputNumber placeholder="Cost" min={0} />
      </Form.Item>

      <Form.Item
        name="objectId"
        rules={[{ required: true, message: 'Please select an object!' }]}
      >
        <Select placeholder="Select Object" style={{ width: 200 }}>
          {objects.map((object) => (
            <Option key={object.id} value={object.id}>
              {object.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add Fact
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FactForm;
