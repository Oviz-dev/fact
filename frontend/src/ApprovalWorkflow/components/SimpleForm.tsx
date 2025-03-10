import React, { useState } from 'react';
import { Input, Checkbox, Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

interface SimpleFormProps {
  onClose?: () => void; // Опционально, если нужно закрыть Popover изнутри
}

const SimpleForm: React.FC<SimpleFormProps> = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleOk = () => {
    console.log('Input Value:', inputValue);
    if (onClose) onClose(); // Закрываем Popover, если передан onClose
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Input
        placeholder="Наименование бюджета"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      <Checkbox
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      >
        Действующий
      </Checkbox>

      <Button
        type="primary"
        icon={<CaretRightOutlined style={{ fontSize: 14}} />}
        onClick={handleOk}
        style={{ flexShrink: 0 ,padding: '0 8px', width:24, height: 24 }}
      />

    </div>
  );
};

export default SimpleForm;