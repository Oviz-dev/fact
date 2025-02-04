
import React from 'react';
import { Card, Collapse, Layout, Typography } from 'antd';
import { UserProvider } from '../context/UserContext';
import ApprovalWorkflow from '../components/ApprovalProcessEditor';
import Header from '../../components/Header';

const { Panel } = Collapse;
const { Content } = Layout;
const { Text } = Typography;

// Моковые данные сущности
const Entity = {
  id: '123',
  name: 'Договор № ПИР 2025-01',
  author: 'Илья Муромец',
  created: '2025-02-03',
  status: 'Черновик'
};

const EntityApprovalPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Header />
      <Content style={{ padding: '0 24px', marginTop: 24 }}>
        <Card>
          <Collapse defaultActiveKey={['approval']}>
            <Panel
              header="Основная информация"
              key="info"
              style={{ marginBottom: 16 }}
            >
              <div style={{ display: 'grid', gap: 12 }}>
                <Text>ID: {Entity.id}</Text>
                <Text>Сущность: {Entity.name}</Text>
                <Text>Статус: {Entity.status}</Text>
                <Text>Дата: {Entity.created}</Text>
              </div>
            </Panel>

            <Panel
              header="Процесс согласования"
              key="approval"
              collapsible="header"
              style={{ background: '#fafafa' }}
            >
              <UserProvider>
                <ApprovalWorkflow
                  entityId={Entity.id}
                  initialNodes={[]}
                  initialEdges={[]}
                />
              </UserProvider>
            </Panel>
          </Collapse>
        </Card>
      </Content>
    </Layout>
  );
};

export default EntityApprovalPage;