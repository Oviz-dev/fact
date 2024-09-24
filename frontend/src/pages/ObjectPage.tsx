import { Layout, Space,  Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import ObjectForm from './ObjectForm';
import ObjectTable from './ObjectTable';
import { ObjectEntityDTO } from '../types/ObjectEntityDTO';
import { fetchObjects } from '../services/objectService';
import Header from '../components/Header'; // Импортируем наш компонент Header
import ControlPanel from '../components/ControlPanel';

const { Content } = Layout;

const ObjectPage: React.FC = () => {
  const [objects, setObjects] = useState<ObjectEntityDTO[]>([]);

  // Функция обновления объектов
  const refreshObjects = async () => {
    try {
      const response = await fetchObjects();
      setObjects(response.data);
    } catch (error) {
      console.error('Ошибка загрузки объектов:', error);
    }
  };

  // Загружаем объекты при первом рендере
  useEffect(() => {
    refreshObjects();
  }, []);

  return (
    <Layout style={{ padding: '10px' }}>
      <Header/>
      <Content style={{ margin: '10px 10px 0' }}>
        <Row gutter={10}>
          <Col flex="60%">
                <ObjectForm onObjectCreated={refreshObjects} />
            </Col>
            <Col flex="40%">
                <ControlPanel />
            </Col>
          </Row>
        <ObjectTable objects={objects} refreshObjects={refreshObjects} />
      </Content>
    </Layout>
  );
};

export default ObjectPage;
