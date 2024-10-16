import React from 'react';
import { TreeSelect } from 'antd';

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
  // Функция для преобразования иерархических данных в формат, поддерживаемый TreeSelect
  const convertToTreeData = (opts: HierarchicalOption[]): any[] => {
    return opts.map(option => ({
      title: option.name,
      value: option.id,
      key: option.id,
      children: option.children ? convertToTreeData(option.children) : [],
    }));
  };

  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder={placeholder}
      treeDefaultExpandAll
      treeData={convertToTreeData(options)}
      onChange={onChange}
    />
  );
};

export default HierarchicalDropdown;
