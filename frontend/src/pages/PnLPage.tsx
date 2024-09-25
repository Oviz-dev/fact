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
    setPnLList(response);
  };

  useEffect(() => {
    loadPnLs();
  }, []);

  const handleCreatePnL = async (data: PnLDTO) => {
    await createPnL(data);
    await loadPnLs(); // Обновляем список после создания
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
