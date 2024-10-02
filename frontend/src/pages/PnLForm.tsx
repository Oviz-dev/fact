import React, { useState } from 'react';
import { TreeSelect, Button, Form, Input, Select } from 'antd';
import { PnLDTO } from '../types/PnLDTO';
import { PlusOutlined } from '@ant-design/icons';

interface PnLFormProps {
  onSubmit: (data: PnLDTO) => void;
  pnlList: PnLDTO[];
  refreshPnLs: () => Promise<void>; // Пропс для обновления списка PnLs
}

const { Option } = Select;

const PnLForm: React.FC<PnLFormProps> = ({ onSubmit, refreshPnLs, pnlList }) => {
  const [form] = Form.useForm();
  const [name, setName] = useState<string>('');
  const [parentId, setParentId] = useState<number | undefined>(undefined);

const handleFinish = async (values: PnLDTO) => {
  await onSubmit({
    ...values,
    parentId: parentId ?? null // Если parentId undefined, присваиваем null
  });
  await refreshPnLs(); // Обновляем данные после отправки формы
  setName('');  // Сбрасываем форму
  setParentId(undefined);  // Сбрасываем выбранного родителя
};

  // Исправленная функция для преобразования данных в формат для TreeSelect
  const convertToTreeSelectData = (data: PnLDTO[], parentId: number | null = null): any[] => {
    return data
      .filter(pnl => pnl.parentId === parentId) // Находим элементы, относящиеся к родителю
      .map((pnl) => ({
        title: pnl.name,
        value: pnl.id,
        key: pnl.id,
        children: convertToTreeSelectData(data, pnl.id), // Рекурсивно добавляем детей
      }));
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFinish}>
      <Form.Item label="Наименование статьи" name="name" rules={[{ required: true }]}
      style={{  width: '30%' }} >
        <Input value={name} placeholder="Название новой статьи" onChange={(e) => setName(e.target.value)} />
      </Form.Item>

      <Form.Item label="Корневая статья" name="parent" rules={[{ required: false }]}>
        {/* Используем TreeSelect для отображения дерева в выпадающем списке */}
        <TreeSelect
          style={{ width: '100%' }}
          value={parentId}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto', width: '50%' }}
          treeData={convertToTreeSelectData(pnlList)} // Передаём данные в TreeSelect
          placeholder="Выберите родительскую статью"
          treeDefaultExpandAll
          showSearch
          filterTreeNode={(searchValue, treeNode) => treeNode.name}
          onChange={(value) => setParentId(value)} // Обработчик выбора родительской статьи
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
