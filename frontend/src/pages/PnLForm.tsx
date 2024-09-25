// pages/PnLForm.tsx
import React, { useState } from 'react';
import { TreeSelect, Button, Form, Input, Select } from 'antd';
import { PnLDTO } from '../types/PnLDTO';
import { PlusOutlined } from '@ant-design/icons';

interface PnLFormProps {
  onSubmit: (data: PnLDTO) => void;
  pnlList: PnLDTO[];
  refreshPnLs: () => Promise<void>; // Добавляем пропс для обновления списка PnLs
}

const { Option } = Select;

const PnLForm: React.FC<PnLFormProps> = ({ onSubmit, refreshPnLs, pnlList }) => {
  const [form] = Form.useForm();
    const [name, setName] = useState<string>('');
    const [parentId, setParentId] = useState<number | undefined>(undefined);

  const handleFinish = async (values: PnLDTO) => {
    await onSubmit(values);
    await refreshPnLs(); // Обновляем данные после отправки формы
  };

  const convertToTreeData = (data: PnLDTO[]): any[] => {
    return data.map((pnl) => ({
      title: pnl.name,
      value: pnl.id,
      parent: pnl.parentId,
      children: pnl.children ? convertToTreeData(pnl.children) : [],
    }));
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFinish}>
      <Form.Item label="Наименование статьи" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Корневая статья" name="parent" rules={[{ required: true }]}>
            <TreeSelect
              style={{ width: '100%', marginBottom: '10px' }}
              value={parentId}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={convertToTreeData(pnlList)}
              placeholder="Выберите родительскую статью"
              treeDefaultExpandAll
              onChange={(value) => setParentId(value)}
            />
      </Form.Item>

      <Form.Item label="Направление учёта" name="direction" rules={[{ required: true }]}>
        <Select placeholder="Выберите направление">
          <Option value="INCOME">Доходы</Option>
          <Option value="EXPENSE">Расходы</Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit" icon={<PlusOutlined />} />
    </Form>
  );
};

export default PnLForm;
