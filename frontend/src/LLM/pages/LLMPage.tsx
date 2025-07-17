import React, { useState } from 'react';
import Header from '../../components/Header';
import { ControlOutlined, EditOutlined } from '@ant-design/icons';

import { Form, Input, DatePicker, InputNumber, Button } from 'antd';
import type { DatePickerProps } from 'antd';

const { TextArea } = Input;

interface FormValues {
  textField: string;
  textArea: string;
  numberField: number;
}

const LLMPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: FormValues) => {
    setLoading(true);
    console.log('Form values:', {
      ...values,
    });

    // Здесь может быть ваш API вызов
    setTimeout(() => {
      setLoading(false);
      form.resetFields();
    }, 1000);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };



  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <Header />
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FormValues>
          label="Текстовое поле"
          name="textField"
          rules={[{ required: true, message: 'Пожалуйста, введите текст!' }]}
        >
          <Input placeholder="Введите текст" />
        </Form.Item>

        <Form.Item<FormValues>
          label="Текстовая область"
          name="textArea"
          rules={[{ required: true, message: 'Пожалуйста, введите текст!' }]}
        >
          <TextArea rows={4} placeholder="Введите многострочный текст" />
        </Form.Item>


        <Form.Item<FormValues>
          label="Числовое поле"
          name="numberField"
          rules={[{ required: true, message: 'Пожалуйста, введите число!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Введите число"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Ок
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LLMPage;
