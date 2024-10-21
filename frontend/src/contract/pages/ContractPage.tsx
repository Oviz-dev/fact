import { Layout, Drawer , message} from 'antd';
import React, { useState, useEffect } from 'react';
import ContractForm from './ContractForm';
import ContractTable from './ContractTable';
import { fetchContracts, createContract, deleteContract, updateContract } from '../services/ContractService';
import { ContractDTO } from '../DTO/ContractDTO';
import Header from '../../components/Header';
import ControlPanel from '../../components/ControlPanel';
import { FullTableButtons } from '../../components/Buttons';

import { exportFile } from '../../functions/exportFile';
import { importFile } from '../../functions/importFile';

const { Content } = Layout;

const ContractPage = () => {
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
  const handleExport = () => exportFile(contracts,'contracts_file');


  // Функция для импорта данных
  const handleImport = (file: File) => {
    importFile(file, 'contract', refreshContracts);
  };

  const handleCreate = () => {
    setSelectedContract(null);
    setIsEditing(false);
    setIsDrawerVisible(true);
  };

  const handleEdit = (contract: ContractDTO) => {
    setSelectedContract(contract);
    setIsEditing(true);
    setIsDrawerVisible(true);
  };

  const handleSelect = (contract: ContractDTO) => {
    setSelectedContract(contract);
    setIsEditing(true);
    setIsDrawerVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedContract) {
      message.warning('Выберите контракт для удаления');
      return;
    }

    try {
      // Вызов сервиса для удаления контракта
      await deleteContract(selectedContract.id);
      message.success('Контракт успешно удалён');
      setIsDrawerVisible(false);
      setSelectedContract(null);
      await refreshContracts();
    } catch (error) {
      message.error('Ошибка при удалении контракта');
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setSelectedContract(null);
    setIsEditing(false);
  };

  const handleFormSubmit = async (contractData: ContractDTO) => {
    try {
      if (isEditing && selectedContract) {
        // Обновление существующего контракта
        await updateContract(selectedContract.id, contractData);
        message.success('Контракт успешно обновлен');
      } else {
        // Создание нового контракта
        await createContract(contractData);
        message.success('Контракт успешно создан');
      }

      setIsDrawerVisible(false);
      setSelectedContract(null);
      setIsEditing(false);
      await refreshContracts();
    } catch (error) {
      message.error('Ошибка при сохранении контракта');
    }
  };
  // Кнопки для панели управления
  const controlButtons = FullTableButtons({
    onCreate: handleCreate,
    onDelete: handleDelete,
    onExport: handleExport,
    onImport: handleImport
  });

  useEffect(() => {
    refreshContracts();
  }, []);

  return (
    <Layout style={{height: '100vh' }}>
      <Header />
      <Content style={{ margin: '10px 10px 0' }}>
        <ControlPanel buttons={controlButtons} />
        <ContractTable 
          contracts={contracts} 
          refreshContracts={refreshContracts}
          onEdit={handleEdit}
          SelectedContract={selectedContract}
        />

        <Drawer
          title={isEditing ? "Редактировать контракт" : "Создать контракт"}
          width={'40%'}
          onClose={handleDrawerClose}
          visible={isDrawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
          mask={false}
          getContainer={false}  // Привязываем Drawer к текущему контейнеру
          style={{ position: 'absolute' }}  // Отключаем движение вместе со страницей

        >
          <ContractForm 
            onSubmit={handleFormSubmit}
            initialValues={selectedContract}
            isEditing={isEditing}
          />
        </Drawer>
      </Content>
    </Layout>
  );
};

export default ContractPage;