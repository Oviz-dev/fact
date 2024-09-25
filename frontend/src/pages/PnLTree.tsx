import React from 'react';
import { Tree, Button, message } from 'antd';
import { PnLDTO } from '../types/PnLDTO';
import { deletePnL } from '../services/PnLService';
import { SearchOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';

interface PnLTreeProps {
  pnlList: PnLDTO[];
  refreshPnLs: () => void;
}

const PnLTree: React.FC<PnLTreeProps> = ({ pnlList, refreshPnLs }) => {
  // Конвертируем данные в формат дерева
  const convertToTreeData = (data: PnLDTO[]): any[] => {
    return data.map((pnl) => ({
      title: pnl.name,
      key: pnl.id,
      children: pnl.children ? convertToTreeData(pnl.children) : [],
    }));
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePnL(id);
      message.success('Статья удалена');
      refreshPnLs();
    } catch (error) {
      message.error('Не удалось удалить статью');
    }
  };

  const treeData = convertToTreeData(pnlList);

  return (
    <Tree
      treeData={treeData}
      draggable
      defaultExpandAll
      titleRender={(node) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{node.title}</span>
          <Button size="small" danger onClick={() => handleDelete(node.key)} icon={<DeleteOutlined />} style={{ marginRight: 10 }} />
        </div>
      )}
    />
  );
};

export default PnLTree;
