import React from 'react';
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

interface Option {
  id: number;
  name: string;
}

interface DropdownWithSearchProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: number) => void;
}

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({ options, placeholder, onChange }) => {
  return (
    <Select
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={(value) => onChange(value)}
      filterOption={(input, option) => {
        // Проверяем, что option?.children это строка
        const children = option?.children as unknown as string;
        return children?.toLowerCase().includes(input.toLowerCase());
      }}
      style={{ width: '100%' }}
    >
      {options.map(option => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DropdownWithSearch;
