import { Layout, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import ObjectForm from './ObjectForm';
import ObjectTable from './ObjectTable';
import { ObjectEntityDTO } from '../types/ObjectEntityDTO';
import { fetchObjects } from '../services/objectService';
import Header from '../components/Header'; // Импортируем наш компонент Header

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
    <Layout style={{ padding: '24px' }}>
      <Header/>
      <Content style={{ margin: '24px 16px 0' }}>
        <ObjectForm onObjectCreated={refreshObjects} />
        <ObjectTable objects={objects} refreshObjects={refreshObjects} />
      </Content>
    </Layout>
  );
};

export default ObjectPage;
