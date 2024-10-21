import React, { useState, useEffect } from 'react';
import { Tree, Button, message } from 'antd';
import { PnLDTO } from '../DTO/PnLDTO';
import { deletePnL, updatePnL } from '../services/PnLService';
import { DeleteOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';

interface PnLTreeProps {
  pnlList: PnLDTO[];
  refreshPnLs: () => void;
    setSelectedNodeKey: (key: string | null) => void; // пропс для установки выделенного узла

}

const PnLTree: React.FC<PnLTreeProps> = ({ pnlList, refreshPnLs, setSelectedNodeKey}) => {
  const [gData, setGData] = useState<TreeDataNode[]>([]);

  // Функция для создания дерева, исключая дочерние элементы на верхнем уровне
const convertToTreeData = (data: PnLDTO[], parentId: number | null): TreeDataNode[] => {
  console.log('Processing data for parentId:', parentId);

  const filteredPnL = data.filter(pnl => pnl.parentId === parentId);
  console.log('Filtered PnL for parentId:', parentId, filteredPnL);

  const treeNodes = filteredPnL.map(pnl => ({
    title: pnl.name,
    key: pnl.id.toString(),
    children: convertToTreeData(data, pnl.id) // Рекурсивно строим дерево для детей
  }));

  console.log('Tree nodes for parentId:', parentId, treeNodes);
  return treeNodes;
};


useEffect(() => {
  console.log('Received pnlList:', pnlList);

  const buildTree = (data: PnLDTO[], parentId: number | null): TreeDataNode[] => {
    // Фильтрация элементов, проверяем на null или undefined
    const filteredPnL = data.filter(pnl => (pnl.parentId === parentId) || (parentId === null && pnl.parentId == null));
    console.log(`Filtered PnL for parentId: ${parentId}`, filteredPnL);

    return filteredPnL.map(pnl => ({
      title: pnl.name,
      key: pnl.id.toString(),
      children: buildTree(data, pnl.id),
    }));
  };

  const treeData = buildTree(pnlList, null);
  console.log('Converted treeData:', treeData);
  setGData(treeData);
}, [pnlList]);


  // Логика при перетаскивании
  const onDrop: TreeProps['onDrop'] = async (info) => {
    const dropKey = info.node.key; // Ключ узла, куда переносим
    const dragKey = info.dragNode.key; // Ключ перетаскиваемого узла
    const data = [...gData]; // Копируем данные для манипуляций

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
          const updatedPnL: PnLDTO = {
            ...draggedPnL,
            parentId: newParentId,
            direction: draggedPnL.direction
          };
          console.log('Отправка на сервер:', updatedPnL);
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
        onSelect={(selectedKeys) => {
          // Устанавливаем выделенный узел
          setSelectedNodeKey(selectedKeys.length > 0 ? selectedKeys[0].toString() : null);
        }}
      draggable
      checkable
      defaultExpandAll
      onDrop={onDrop} // Обработчик перетаскивания
      titleRender={(node: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{node.title}</span>
        </div>
      )}
    />
  );
};

export default PnLTree;
