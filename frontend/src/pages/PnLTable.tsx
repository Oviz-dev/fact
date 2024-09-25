import React from 'react';
import { Table } from 'antd';
import { PnLDTO } from '../types/PnLDTO';

interface PnLTableProps {
  data: PnLDTO[];
}

const PnLTable: React.FC<PnLTableProps> = ({ data }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Direction',
      dataIndex: 'direction',
      key: 'direction',
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default PnLTable;
