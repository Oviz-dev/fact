import { Layout, Space, Row, Col, Drawer, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import ContractForm from './ContractForm';
import ContractTable from './ContractTable';
import { fetchContracts, createContract, deleteContract } from '../services/ContractService';
import { ContractDTO } from '../DTO/ContractDTO';
import Header from '../../components/Header';
import ControlPanel from '../../components/ControlPanel';
import { ShortTableButtons } from '../../components/Buttons';
import { exportData } from '../../functions/exportData';
import { importFile } from '../../functions/importFile';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Content } = Layout;

const ContractPage = () => {
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false); // Состояние для управления видимостью Drawer

  // Функция обновления реестра
  const refreshContracts = async () => {
    try {
      const response = await fetchContracts();
      setContracts(response);
    } catch (error) {
      console.error('Ошибка загрузки договоров:', error);
    }
  };

  // Функция для выгрузки данных
  const handleExport = () => {
    const headers = ['ID', 'Name'];
    const data = contracts.map(obj => [obj.id, obj.name]); // Преобразуем объекты в массив массивов
    exportData(data, 'contracts', headers);
  };

  // Функция для импорта данных
  const handleImport = (file: File) => {
    importFile(file, 'contract', refreshContracts); // Вызываем универсальную функцию импорта
  };

  const handleCreate = () => {
    setIsDrawerVisible(true); // Открываем Drawer
  };

  const handleDelete = async () => {
    // Логика удаления контракта
    // await deleteContract();
    refreshContracts();
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false); // Закрываем Drawer
  };

  const handleFormSubmit = (contractData: ContractDTO) => {
    console.log('Contract data submitted:', contractData);
    setIsDrawerVisible(false); // Закрываем Drawer после отправки формы
    refreshContracts(); // Обновляем список контрактов
  };

  // Кнопки для панели управления
  const controlButtons = ShortTableButtons({
    onCreate: handleCreate,
    onDelete: handleDelete,
  });

  useEffect(() => {
    refreshContracts();
  }, []);

  return (
    <Layout style={{ padding: '10px' }}>
      <Header />
      <Content style={{ margin: '10px 10px 0' }}>
        <ControlPanel buttons={controlButtons} />
        <ContractTable contracts={contracts} refreshContracts={refreshContracts} />

        {/* Drawer с формой для создания контракта */}
        <Drawer
          title="Создать контракт"
          width={'50%'} // Можно настроить ширину Drawer
          onClose={handleDrawerClose}
          visible={isDrawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <ContractForm onSubmit={handleFormSubmit} />
        </Drawer>
      </Content>
    </Layout>
  );
};

export default ContractPage;
