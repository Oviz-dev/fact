import { Layout, Drawer , message} from 'antd';
import React, { useState, useEffect } from 'react';
import FactForm from './FactForm';
import FactTable from './FactTable';
import { fetchFacts, createFact, deleteFact, updateFact } from '../services/factService';
import { FactDTO } from '../DTO/FactDTO';
import Header from '../../components/Header';
import ControlPanel from '../../components/ControlPanel';
import { ShortTableButtons } from '../../components/Buttons';
import { exportData } from '../../functions/exportData';
import { importFile } from '../../functions/importFile';

const { Content } = Layout;

const FactPage = () => {
  const [facts, setFacts] = useState<FactDTO[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedFact, setSelectedFact] = useState<FactDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Функция обновления реестра
  const refreshFacts = async () => {
    try {
      const response = await fetchFacts();
      setFacts(response);
    } catch (error) {
      console.error('Ошибка загрузки договоров:', error);
    }
  };

  // Функция для выгрузки данных
  const handleExport = () => {
    const headers = ['ID', 'Name'];
    const data = facts.map(obj => [obj.id, obj.name]);
    exportData(data, 'facts', headers);
  };

  // Функция для импорта данных
  const handleImport = (file: File) => {
    importFile(file, 'fact', refreshFacts);
  };

  const handleCreate = () => {
    setSelectedFact(null);
    setIsEditing(false);
    setIsDrawerVisible(true);
  };

  const handleEdit = (fact: FactDTO) => {
    setSelectedFact(fact);
    setIsEditing(true);
    setIsDrawerVisible(true);
  };

  const handleSelect = (fact: FactDTO) => {
    setSelectedFact(fact);
    setIsEditing(true);
    setIsDrawerVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedFact) {
      message.warning('Выберите строку для удаления');
      return;
    }

    try {
      // Вызов сервиса для удаления контракта
      await deleteFact(selectedFact.id);
      message.success('Факт успешно удалён');
      setIsDrawerVisible(false);
      setSelectedFact(null);
      await refreshFacts();
    } catch (error) {
      message.error('Ошибка при удалении');
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setSelectedFact(null);
    setIsEditing(false);
  };

  const handleFormSubmit = async (factData: FactDTO) => {
    try {
      if (isEditing && selectedFact) {
        // Обновление существующего контракта
        await updateFact(selectedFact.id, factData);
        message.success('Факт успешно обновлен');
      } else {
        // Создание нового контракта
        await createFact(factData);
        message.success('Факт успешно создан');
      }

      setIsDrawerVisible(false);
      setSelectedFact(null);
      setIsEditing(false);
      await refreshFacts();
    } catch (error) {
      message.error('Ошибка при сохранении');
    }
  };
  // Кнопки для панели управления
  const controlButtons = ShortTableButtons({
    onCreate: handleCreate,
    onDelete: handleDelete,
  });

  useEffect(() => {
    refreshFacts();
  }, []);

  return (
    <Layout style={{ padding: '10px' }}>
      <Header />
      <Content style={{ margin: '10px 10px 0' }}>
        <ControlPanel buttons={controlButtons} />
        <FactTable
          facts={facts}
          refreshFacts={refreshFacts}
          onEdit={handleEdit}
          SelectedFact={selectedFact}
        />

        <Drawer
          title={isEditing ? "Редактировать контракт" : "Создать контракт"}
          width={'750px'}
          onClose={handleDrawerClose}
          visible={isDrawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
          mask={false}
          getContainer={false}  // Привязываем Drawer к текущему контейнеру
          style={{ position: 'absolute' }}  // Отключаем движение вместе со страницей

        >
          <FactForm
            onSubmit={handleFormSubmit}
            initialValues={selectedFact}
            isEditing={isEditing}
          />
        </Drawer>
      </Content>
    </Layout>
  );
};

export default FactPage;