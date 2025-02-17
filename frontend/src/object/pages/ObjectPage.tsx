import { Layout, Space,  Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import ObjectForm from './ObjectForm';
import ObjectTable from './ObjectTable';
import { ObjectEntityDTO } from '../DTO/ObjectEntityDTO';
import { fetchObjects, importObjects } from '../services/objectService';
import Header from '../../components/Header';
import ControlPanel from '../../components/ControlPanel';
import { importFile } from '../../functions/importFile';
import { exportFile } from '../../functions/exportFile';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

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
  // Функция для выгрузки данных
    const handleExport = () =>exportFile(objects,'objects_file');
  // Функция для импорта данных
    const handleImport = (file: File) => {
      importFile(file, 'object', refreshObjects); // Вызываем универсальную функцию импорта
    };

  // Кнопки для панели управления
    const controlButtons = [
      {
        //label: 'Выгрузить',
        onClick: handleExport, // onClick присутствует
        icon: <DownloadOutlined />,
        tooltip: 'Выгрузить',
      },
      {
        //label: 'Загрузить',
        icon: <UploadOutlined />,
        tooltip: 'Загрузить',
        upload: true, // Флаг для загрузки файлов
        importHandler: handleImport, // Используем importHandler вместо onClick
      },
    ];

  useEffect(() => {
    refreshObjects();
  }, []);

  return (
    <Layout style={{height: '100vh' }}>
      <Header/>
      <Content style={{ margin: '10px 10px 0' }}>
        <Row gutter={10}>
          <Col flex="60%">
                <ObjectForm onObjectCreated={refreshObjects} />
            </Col>
            <Col flex="40%">
                <ControlPanel buttons={controlButtons} />
            </Col>
          </Row>
        <ObjectTable objects={objects} refreshObjects={refreshObjects} />
      </Content>
    </Layout>
  );
};

export default ObjectPage;
