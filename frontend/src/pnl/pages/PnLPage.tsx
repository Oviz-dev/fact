import React, { useEffect, useState } from 'react';
import { Layout, Space, Row, Col, Button, message } from 'antd';
import { PnLDTO } from '../DTO/PnLDTO';
import { fetchPnL, createPnL, deletePnL } from '../services/PnLService';
import PnLForm from './PnLForm';
import PnLTree from './PnLTree';
import { DeleteOutlined } from '@ant-design/icons';
import ControlPanel from '../../components/ControlPanel';

const { Content } = Layout;

const PnLPage: React.FC = () => {
  const [pnlList, setPnLList] = useState<PnLDTO[]>([]);
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | null>(null); // Для хранения выделенного узла

  const loadPnLs = async () => {
    const response = await fetchPnL();
    const modifiedResponse = response.map(item => ({
      ...item,
      parentId: item.parentId || null // Используем существующий parentId или null
    }));
    setPnLList(modifiedResponse);
  };

  useEffect(() => {
    loadPnLs();
  }, []);

  const handleCreatePnL = async (data: PnLDTO) => {
    await createPnL(data);
    loadPnLs(); // Обновляем список после создания новой статьи
  };

  // Удаление элемента
  const handleDelete = async () => {
    if (!selectedNodeKey) {
      message.warning('Пожалуйста, выберите статью для удаления');
      return;
    }

    try {
      await deletePnL(Number(selectedNodeKey));
      message.success('Статья удалена');
      loadPnLs(); // Обновляем список после удаления
      setSelectedNodeKey(null); // Сбрасываем выделенный узел
    } catch (error) {
      message.error('Не удалось удалить статью');
    }
  };

  // Кнопки для панели управления
  const controlButtons = [
    {
      //label: 'Удалить',
      danger: true,
      onClick: handleDelete,
      icon: <DeleteOutlined />,
      tooltip: 'Удалить статью',
      type: 'default' as const,
    },
  ];

  return (
    <Layout style={{ padding: '10px' }}>
      <Content style={{ margin: '10px 10px 0' }}>
        <Row gutter={10}>
          <Col >
            <PnLForm onSubmit={handleCreatePnL} refreshPnLs={loadPnLs} pnlList={pnlList} />
          </Col>
          <Col >
                <ControlPanel buttons={controlButtons} />
          </Col>
        </Row>
        <PnLTree pnlList={pnlList} refreshPnLs={loadPnLs} setSelectedNodeKey={setSelectedNodeKey} />
      </Content>
    </Layout>
  );
};

export default PnLPage;
