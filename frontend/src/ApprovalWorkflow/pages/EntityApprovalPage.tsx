import React, { useState } from 'react';
import { Card, Collapse, Layout, Typography, Radio, Input, Form,Select } from 'antd';
import { ReactFlowProvider } from 'react-flow-renderer';
import { UserProvider } from '../context/UserContext';
import ApprovalProcessEditor from '../components/ApprovalProcessEditor';
import Header from '../../components/Header';
import {ProcessMode, TemplateType, EntityType, ProcessStatus } from '../types';

const { Panel } = Collapse;
const { Content } = Layout;
const { Text } = Typography;

// Моковые данные сущности
const Entity = {
  id: Date.now(),
  templatename: 'шаблон №1', // в будущем вытаскивать по id шаблона название
  entityid: '123',
  name: 'Договор № ПИР 2025-01',
  status: ProcessStatus.DRAFT,
};

const EntityApprovalPage: React.FC = () => {
  const [mode, setMode] = useState<ProcessMode>(ProcessMode.INSTANCE);
  const [templateData, setTemplateData] = useState({
    id: '',
    name: '',
    description: '',
    templateType: '',
    entityType: '',
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '0 24px', marginTop: 24 }}>
        <Card>
          <Collapse defaultActiveKey={['info', 'approval']}>
            {/* Основная информация */}
            <Panel header="Основная информация" key="info">

              {/* Переключатель режима */}
              <Radio.Group
                value={mode}
                onChange={e => setMode(e.target.value)}
                style={{ marginBottom: 16 }}
              >
                <Radio.Button value={ProcessMode.INSTANCE}>Экземпляр</Radio.Button>
                <Radio.Button value={ProcessMode.TEMPLATE}>Шаблон</Radio.Button>
              </Radio.Group>

              {/* Форма для экземпляра */}
              {mode === ProcessMode.INSTANCE && (
                <Form
                  layout="vertical"
                  initialValues={templateData}
                  onValuesChange={(_, values) => setTemplateData(values)}
                >
                    <Form.Item label="ID процесса" >
                      <Text>ID: {Entity.id}</Text>
                    </Form.Item>
                    <Form.Item label="Экземпляр сущности">
                      <Text>ID {Entity.entityid}, {Entity.name}</Text>
                    </Form.Item>
                    <Form.Item label="Название шаблона">
                      <Text>{Entity.templatename}</Text>
                    </Form.Item>
                    <Form.Item label="Статус процесса">
                      <Text>{Entity.status}</Text>
                    </Form.Item>
                </Form>
              )}

              {/* Форма для шаблона */}
              {mode === ProcessMode.TEMPLATE && (
                <Form
                  layout="vertical"
                  initialValues={templateData}
                  onValuesChange={(_, values) => setTemplateData(values)}
                >
                    <Form.Item label="ID шаблона">
                      <Text>{Date.now()}</Text>
                    </Form.Item>
                    <Form.Item label="Название шаблона" name="name">
                      <Input placeholder="Введите название шаблона" />
                    </Form.Item>

                    <Form.Item label="Описание шаблона" name="description">
                      <Input.TextArea placeholder="Введите описание" />
                    </Form.Item>

                    <Form.Item label="Тип согласования" name="templateType">
                      <Select placeholder="Выберите тип согласования">
                        {Object.values(TemplateType).map(type => (
                          <Select.Option key={type} value={type}>
                            {type}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Тип сущности" name="entityType">
                      <Select placeholder="Выберите тип сущности">
                        {Object.values(EntityType).map(type => (
                          <Select.Option key={type} value={type}>
                            {type}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                </Form>
              )}
            </Panel>

            {/* Процесс согласования */}
            <Panel header="Процесс согласования" key="approval" collapsible="header" style={{ background: '#fafafa' }}>
              <UserProvider>
                <ReactFlowProvider>
                  <ApprovalProcessEditor
                    entityId={mode === ProcessMode.INSTANCE ? Entity.entityid : undefined}
                    mode={mode}
                    templateData={mode === ProcessMode.TEMPLATE ? templateData : undefined}
                    initialNodes={[]} 
                    initialEdges={[]} 
                  />
                </ReactFlowProvider>
              </UserProvider>
            </Panel>
          </Collapse>
        </Card>
      </Content>
    </Layout>
  );
};

export default EntityApprovalPage;
