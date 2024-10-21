import { Layout, Space, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import UnitForm from './UnitForm';
import UnitTable from './UnitTable';
import { UnitDTO } from '../DTO/UnitDTO';
import { fetchUnits, importUnits } from '../services/unitService';
import ControlPanel from '../../components/ControlPanel';
import { exportFile } from '../../functions/exportFile';
import { importFile } from '../../functions/importFile';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

const { Content } = Layout;

const UnitPage: React.FC = () => {
  const [units, setUnits] = useState<UnitDTO[]>([]);

  // Функция обновления
  const refreshUnits = async () => {
    try {
      const response = await fetchUnits();
      setUnits(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

    const handleExport = () => exportFile(units, 'units_file');

    const handleImport = (file: File) => {
      importFile(file, 'unit', refreshUnits);
    };

  // Список кнопок для панели управления
    const controlButtons = [
          {
            //label: 'Выгрузить',
            onClick: handleExport,
            icon: <DownloadOutlined />,
            tooltip: 'Выгрузить',
          },
          {
            //label: 'Загрузить',
            icon: <UploadOutlined />,
            tooltip: 'Загрузить',
            upload: true, // Флаг для загрузки файлов
            importHandler: handleImport,
          },
    ];

  useEffect(() => {
    refreshUnits();
  }, []);

  return (
    <Layout style={{ height: '85vh'}}>
      <Content style={{ margin: '10px 10px 0' }}>
          <Row gutter={10}>
            <Col flex="60%">
                <UnitForm onUnitCreated={refreshUnits} />
            </Col>
            <Col flex="40%">
                <ControlPanel buttons={controlButtons} />
            </Col>
          </Row>
        <UnitTable units={units} refreshUnits={refreshUnits} />
      </Content>
    </Layout>
  );
};

export default UnitPage;
