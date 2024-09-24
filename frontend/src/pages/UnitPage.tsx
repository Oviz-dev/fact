import { Layout, Space, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import UnitForm from './UnitForm';
import UnitTable from './UnitTable';
import { UnitDTO } from '../types/UnitDTO';
import { fetchUnits, importUnits } from '../services/unitService';
import Header from '../components/Header';
import ControlPanel from '../components/ControlPanel';

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
    const csvContent = units.map(unt => `${unt.id},${unt.name}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'units.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Функция для импорта данных
  const handleImport = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target?.result as string;

      // Здесь можно добавить проверку и обработку CSV
      const rows = csvData.split('\n').map(row => row.split(','));
      const importedUnits = rows.map(row => ({ name: row[1] })); // Предполагаем, что вторая колонка - это name

      try {
        await importUnits(importedUnits); // Сохраняем  в базе данных
        refreshUnits(); // Обновляем список
      } catch (error) {
        console.error('Ошибка импорта:', error);
      }
    };

    reader.readAsText(file); // Читаем файл как текст
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
