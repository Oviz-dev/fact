import { Layout, Space, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import UnitForm from './UnitForm';
import UnitTable from './UnitTable';
import { UnitDTO } from '../types/UnitDTO';
import { fetchUnits, importUnits } from '../services/unitService';
import Header from '../components/Header';
import ControlPanel from '../components/ControlPanel';
import { exportData} from '../functions/exportData';
import { importFile } from '../functions/importFile';

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

  // Функция для выгрузки данных
    const handleExport = () => {
      const headers = ['ID', 'Name'];
      const data = units.map(unit => [unit.id, unit.name]); // Преобразуем юниты в массив массивов
      exportData(data, 'units', headers);
    };

  // Функция для импорта данных
    const handleImport = (file: File) => {
      importFile(file, 'unit', refreshUnits); // Вызываем универсальную функцию импорта
      //refreshUnits();
    };

  // Загружаем при первом рендере
  useEffect(() => {
    refreshUnits();
  }, []);

  return (
    <Layout style={{ padding: '10px' }}>
      <Header/>
      <Content style={{ margin: '10px 10px 0' }}>
          <Row gutter={10}>
            <Col flex="60%">
                <UnitForm onUnitCreated={refreshUnits} />
            </Col>
            <Col flex="40%">
                <ControlPanel onExport={handleExport} onImport={handleImport} />
            </Col>
          </Row>
        <UnitTable units={units} refreshUnits={refreshUnits} />
      </Content>
    </Layout>
  );
};

export default UnitPage;
