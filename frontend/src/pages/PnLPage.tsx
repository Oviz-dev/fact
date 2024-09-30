// pages/PnLPage.tsx
import React, { useEffect, useState } from 'react';
import { Layout, Space, Row, Col } from 'antd';
import { PnLDTO } from '../types/PnLDTO';
import { fetchPnL, createPnL } from '../services/PnLService';
import PnLForm from './PnLForm';
import PnLTree from './PnLTree';
import Header from '../components/Header';

const { Content } = Layout;

const PnLPage: React.FC = () => {
  const [pnlList, setPnLList] = useState<PnLDTO[]>([]);

const loadPnLs = async () => {
  const response = await fetchPnL();

  const modifiedResponse = response.map(item => ({
    ...item,
    parentId: item.parentId || null // Используем существующий parentId или null
  }));

  setPnLList(modifiedResponse);
  console.log('Данные с бэка:', response);
  console.log('Мод Данные с бэка:', modifiedResponse);
};



  useEffect(() => {
    loadPnLs();
  }, []);

  const handleCreatePnL = async (data: PnLDTO) => {
    await createPnL(data);
  };

  return (
    <Layout style={{ padding: '10px' }}>
      <Header/>
      <Content style={{ margin: '10px 10px 0' }}>
          <Row gutter={10}>
            <Col flex="100%">
                <PnLForm onSubmit={handleCreatePnL} refreshPnLs={loadPnLs} pnlList={pnlList}/>
            </Col>
          </Row>
        <PnLTree pnlList={pnlList} refreshPnLs={loadPnLs} />
      </Content>
    </Layout>
  );
};

export default PnLPage;
