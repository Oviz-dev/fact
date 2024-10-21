import React from 'react';
import { Layout} from 'antd';
import Header from '../components/Header';
const { Content } = Layout;

const Main: React.FC = () => {
  return (
    <Layout style={{marginBottom: 10, width: '100%', height: '90vh' }}>
      <Header />
      <Content >
        <div style={{ background: '#fff', padding: 10, minHeight: 380 }}>
          Добро пожаловать на главную страницу! Выберите раздел в меню.
        </div>
      </Content>
    </Layout>
  );
};

export default Main;
