import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import Header from '../components/Header';
import PnLPage from '../pnl/pages/PnLPage';
import UnitPage from '../unit/pages/UnitPage';
const { Content, Sider } = Layout;

const Main: React.FC = () => {
  const [selectedReference, setSelectedReference] = useState<string | null>(null);

  const references = [
    { key: 'units', label: 'Единицы измерения' },
    { key: 'pnl', label: 'Статьи PNL' },
  ];

  const handleMenuClick = (key: string) => {
    setSelectedReference(key);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header />
      <Layout style={{ padding: '0 10px 10px', height: '90vh' , overflow: 'auto'}}>
        <Sider
        width={200}
        className="site-layout-background"
        style={{ height: '90vh', overflow: 'auto' }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedReference || '']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={({ key }) => handleMenuClick(key)}
          >
            {references.map(ref => (
              <Menu.Item key={ref.key}>{ref.label}</Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 10px 10px', height: '90vh' , overflow: 'auto'}}>
          <Content style={{ padding: 10, background: '#fff', height: '90%', overflow: 'auto' }}>
            {selectedReference === 'pnl' ? (
              <PnLPage />
            ) : selectedReference === 'units' ? (
              <UnitPage/>
            ) : (
              'Выберите справочник'
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;
