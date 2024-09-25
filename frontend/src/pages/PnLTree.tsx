import React, { useState, useEffect } from 'react';
import { Tree, Button, message } from 'antd';
import { PnLDTO } from '../types/PnLDTO';
import { deletePnL, updatePnL } from '../services/PnLService';
import { DeleteOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';

interface PnLTreeProps {
  pnlList: PnLDTO[];
  refreshPnLs: () => void;
}

const PnLTree: React.FC<PnLTreeProps> = ({ pnlList, refreshPnLs }) => {
  const [gData, setGData] = useState<TreeDataNode[]>([]);

  // Преобразование PnLDTO в формат TreeDataNode
  useEffect(() => {
    const convertToTreeData = (data: PnLDTO[]): TreeDataNode[] => {
      return data.map((pnl) => ({
        title: pnl.name,
        key: pnl.id.toString(),
        children: pnl.children ? convertToTreeData(pnl.children) : [],
      }));
    };

    const treeData = convertToTreeData(pnlList);
    setGData(treeData); // Устанавливаем данные дерева
  }, [pnlList]); // Обновление данных при изменении pnlList

  // Логика при перетаскивании
  const onDrop: TreeProps['onDrop'] = async (info) => {
    const dropKey = info.node.key; // Ключ узла, куда переносим
    const dragKey = info.dragNode.key; // Ключ перетаскиваемого узла

    // Копируем данные для дальнейших манипуляций
    const data = [...gData];

    // Вспомогательная функция для поиска элемента и выполнения действий над ним
    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    let dragObj: TreeDataNode | null = null;

    // Удаление перетаскиваемого элемента
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (dragObj) {
      // Добавление элемента в новый узел
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });

      setGData(data); // Обновляем дерево на фронте

      // Определяем новый parentId
      const newParentId = info.dropToGap ? null : parseInt(dropKey.toString(), 10);

      // Найти перетаскиваемый элемент в исходном списке pnlList
      const draggedPnL = pnlList.find((pnl) => pnl.id === Number(dragKey));

      if (draggedPnL) {
        try {
          // Обновляем parentId и отправляем на сервер
          const updatedPnL: PnLDTO = { ...draggedPnL, parentId: newParentId };
          await updatePnL(updatedPnL.id, updatedPnL);

          message.success('Структура успешно обновлена');
          refreshPnLs(); // Обновляем данные с сервера после сохранения
        } catch (error) {
          message.error('Не удалось обновить структуру');
        }
      }
    }
  };

  // Удаление элемента
  const handleDelete = async (id: number) => {
    try {
      await deletePnL(id);
      message.success('Статья удалена');
      refreshPnLs();
    } catch (error) {
      message.error('Не удалось удалить статью');
    }
  };

  return (
    <Tree
      treeData={gData}
      draggable
      defaultExpandAll
      onDrop={onDrop} // Обработчик перетаскивания
      titleRender={(node: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{node.title}</span>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(Number(node.key))}
            icon={<DeleteOutlined />}
            style={{ marginRight: 10 }}
          />
        </div>
      )}
    />
  );
};

export default PnLTree;
