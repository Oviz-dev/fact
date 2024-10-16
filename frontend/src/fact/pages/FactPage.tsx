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
import { fetchContracts } from '../../contract/services/ContractService';
import { fetchUnits } from '../../unit/services/unitService';
import { fetchObjects } from '../../object/services/objectService';
import { fetchPnL } from '../../pnl/services/PnLService';

const { Content } = Layout;

const FactPage = () => {
  const [facts, setFacts] = useState<FactDTO[]>([]);
  const [contracts, setContracts] = useState<{ id: number; name: string }[]>([]); // Добавлено состояние для контрактов
  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);
  const [objects, setObjects] = useState<{ id: number; name: string }[]>([]);
  const [pnls, setPnls] = useState<{ id: number; name: string ; parentId: number | null }[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedFact, setSelectedFact] = useState<FactDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Функция обновления реестра
  const refreshFacts = async () => {
    try {
      const response = await fetchFacts();
      setFacts(response);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  // Получение списка контрактов при загрузке страницы
  const loadContracts = async () => {
    try {
      const contractsData = await fetchContracts(); // Получаем данные контрактов
      setContracts(contractsData); // Устанавливаем список контрактов в состояние
    } catch (error) {
      console.error('Ошибка загрузки контрактов:', error);
    }
  };

  // Получение списка еи при загрузке страницы
    const loadUnits = async () => {
      try {
        const response = await fetchUnits(); // Получаем данные через Axios
        const unitsData = response.data; // Извлекаем данные из объекта AxiosResponse
        setUnits(unitsData); // Устанавливаем список units в состояние
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    };

  // Получение списка объектов при загрузке страницы
    const loadObjects = async () => {
      try {
        const response = await fetchObjects(); // Получаем данные через Axios
        const objectsData = response.data; // Извлекаем данные из объекта AxiosResponse
        setObjects(objectsData); // Устанавливаем список Objects в состояние
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    };

  // Получение списка статей при загрузке страницы
    const loadPnls = async () => {
      try {
        const response = await fetchPnL(); // Получаем данные через Axios
        const pnlsData = response; // Извлекаем данные из объекта AxiosResponse
        setPnls(pnlsData); // Устанавливаем список PnLs в состояние
      } catch (error) {
        console.error('Ошибка загрузки:', error);
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
        await updateFact(selectedFact.id, factData);
        message.success('Факт успешно обновлен');
      } else {
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
    loadContracts();
    loadUnits();
    loadObjects();
    loadPnls();
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
          title={isEditing ? "Редактировать" : "Создать"}
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
            contracts={contracts}
            units={units}
            objects={objects}
            pnls={pnls}
          />
        </Drawer>
      </Content>
    </Layout>
  );
};

export default FactPage;