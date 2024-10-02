import { Layout, Space,  Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import ContractForm from './ContractForm';
import ContractTable from './ContractTable';
import { fetchContracts } from '../services/ContractService';
import { ContractDTO, ContractStatus, ContractType, Contractor } from '../DTO/ContractDTO';
import Header from '../components/Header';

const { Content } = Layout;

const ContractPage = () => {
  const [contracts, setContracts] = useState<ContractDTO[]>([]);

    // Функция обновления объектов
    const refreshContracts = async () => {
      try {
        const response = await fetchContracts();
        setContracts(response);
      } catch (error) {
        console.error('Ошибка загрузки договоров:', error);
      }
    };

    useEffect(() => {
        refreshContracts();
    }, []);

  //  обрабатывает данные формы
  const handleSubmit = (contractData: ContractDTO) => {
    console.log('Contract data submitted:', contractData);
    // Здесь можно отправить данные на бэкенд или выполнить другие действия
  };

  return (
    <Layout style={{ padding: '10px' }}>
      <Header/>
      <Content style={{ margin: '10px 10px 0' }}>
        <Row gutter={10}>
          <Col flex="60%">
            <ContractForm  onSubmit={handleSubmit} />
          </Col>
        </Row>
        <ContractTable contracts={contracts} refreshContracts={refreshContracts}/>
      </Content>
    </Layout>
  );
};

export default ContractPage