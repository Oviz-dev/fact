// ContractForm.tsx
import {  DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber } from 'antd';
import { ContractDTO, ContractStatus, ContractType, Contractor } from '../DTO/ContractDTO';
import moment from 'moment';

interface ContractFormProps {
  //initialValues: ContractDTO;
  onSubmit: (contractData: ContractDTO) => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  // Обработчик отправки формы
  const handleSubmit = async () => {
    try {
      // Валидация и получение значений формы
      const values = await form.validateFields();

      const contractData: ContractDTO = {
        ...values, // данные формы
        contractDate: values.contractDate ? values.contractDate.format('YYYY-MM-DD') : undefined,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
      };

      // Вызов onSubmit с данными контракта
      onSubmit(contractData);
    } catch (errorInfo) {
      console.error('Validation Failed:', errorInfo);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Наименование договора"
        name="name"
        rules={[{ required: true, message: 'Введите наименование договора' }]}
      >
        <Input placeholder="Введите наименование договора" />
      </Form.Item>

      <Form.Item
        label="Номер договора"
        name="contractNumber"
        rules={[{ required: true, message: 'Введите номер договора' }]}
      >
        <Input placeholder="Введите номер договора" />
      </Form.Item>

      <Form.Item
        label="Дата договора"
        name="contractDate"
        rules={[{ required: true, message: 'Выберите дату договора' }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        label="Плановая стоимость без НДС"
        name="plannedCostWithoutVAT"
        rules={[{ required: true, message: 'Введите плановую стоимость без НДС' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Введите плановую стоимость без НДС" />
      </Form.Item>

      <Form.Item
        label="Плановая НДС"
        name="plannedVAT"
        rules={[{ required: true, message: 'Введите плановую НДС' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Введите плановую НДС" />
      </Form.Item>

      <Form.Item
        label="Фактическая стоимость без НДС"
        name="actualCostWithoutVAT"
        rules={[{ required: true, message: 'Введите фактическую стоимость без НДС' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Введите фактическую стоимость без НДС" />
      </Form.Item>

      <Form.Item
        label="Фактический НДС"
        name="actualVAT"
        rules={[{ required: true, message: 'Введите фактический НДС' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Введите фактический НДС" />
      </Form.Item>

      <Form.Item
        label="Дата начала"
        name="startDate"
        rules={[{ required: true, message: 'Выберите дату начала' }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        label="Дата окончания"
        name="endDate"
        rules={[{ required: true, message: 'Выберите дату окончания' }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
        <Button type="primary" onClick={() => handleSubmit()} icon={<CheckOutlined />} style={{ marginRight: 10 }}/>
    </Form>
  );
};

export default ContractForm;
//        <Button onClick={cancel } icon={<CloseOutlined />} style={{ marginRight: 10 }}/>
//        <Button danger onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} style={{ marginRight: 10 }} />