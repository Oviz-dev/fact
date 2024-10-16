import React from 'react';
import { Select } from 'antd';

interface HierarchicalOption {
  id: number;
  name: string;
  children?: HierarchicalOption[];
}

interface HierarchicalDropdownProps {
  options: HierarchicalOption[];
  placeholder?: string;
  onChange: (value: number) => void;
  value?: number;
}

const HierarchicalDropdown: React.FC<HierarchicalDropdownProps> = ({ options, placeholder, onChange, value }) => {
  const renderOptions = (opts: HierarchicalOption[]) => {
    return opts.map(option => (
      <Select.Option key={option.id} value={option.id}>
        {option.name}
        {option.children && option.children.length > 0 && (
          <Select.OptGroup label={option.name}>
            {renderOptions(option.children)}
          </Select.OptGroup>
        )}
      </Select.Option>
    ));
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      style={{ width: '100%' }}
    >
      {renderOptions(options)}
    </Select>
  );
};

export default HierarchicalDropdown;
