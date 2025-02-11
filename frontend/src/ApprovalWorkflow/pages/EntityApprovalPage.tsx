import React, { useState } from 'react';
import { Card, Collapse, Layout, Typography, Radio, Input, Form,Select, Row, Col, message, Tag} from 'antd';
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
  templateId: '234',
  entityId: '123',
  templateName: 'Процесс согласования договоров', // в будущем вытаскивать по id шаблона название
  name: 'Договор № ПИР 2025-01', // делать выбор экземпляра либо подставлять сущность из карточки
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

    const [instanceData, setInstanceData] = useState({
        id: String(Entity.id),
        entityId: Entity.entityId,
        templateId: Entity.templateId,
        status: Entity.status,
    });

  const handleStartProcess = () => {
    setInstanceData(prev => ({
      ...prev,
      status: ProcessStatus.ACTIVE, // Меняем статус процесса на "В работе"
    }));
    message.success('Процесс запущен');
  };

  const handleCompleteProcess = () => {
    setInstanceData(prev => ({
      ...prev,
      status: ProcessStatus.COMPLETE, // Меняем статус процесса на "Выполнен"
    }));
    message.success('Процесс завершён');
  };

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
                  layout="horizontal"
                  initialValues={instanceData}
                  onValuesChange={(_, values) => setInstanceData(values)}
                >

                    <Row gutter={[16, 16]}>
                      <Col md={24} lg={12} xl={6}>
                        <Form.Item label="ID процесса">
                            <Text>{instanceData.id}</Text>
                        </Form.Item>
                      </Col>
                      <Col md={24} lg={12} xl={6}>
                        <Form.Item label="Экземпляр сущности:">
                            <Text> {instanceData.entityId} {Entity.name}</Text>
                        </Form.Item>
                      </Col>
                      <Col md={24} lg={12} xl={6}>
                        <Form.Item label="Шаблон:">
                            <Text>{instanceData.templateId} {Entity.templateName}</Text>
                        </Form.Item>
                      </Col>
                      <Col md={24} lg={12} xl={6}>
                        <Form.Item label="Статус процесса">
                          {[
                            <Tag
                              key="status"
                              color={
                                instanceData.status === ProcessStatus.DRAFT ? 'default' :
                                instanceData.status === ProcessStatus.ACTIVE ? 'blue' :
                                'green'
                              }
                            >
                              {instanceData.status}
                            </Tag>
                          ]}
                        </Form.Item>
                      </Col>
                    </Row>
                </Form>
              )}

              {/* Форма для шаблона */}
              {mode === ProcessMode.TEMPLATE && (
                <Form
                  layout="vertical"
                  initialValues={templateData}
                  onValuesChange={(_, values) => setTemplateData(values)}
                >
                    <Row gutter={[16, 16]}>
                      <Col md={24} lg={12} xl={6}>
                        <Form.Item label="Название шаблона" name="name">
                          <Input placeholder="Введите название шаблона" />
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

                      </Col>
                      <Col md={24} lg={12} xl={6}>
                          <Form.Item label="Описание шаблона" name="description">
                            <Input.TextArea placeholder="Введите описание" />
                          </Form.Item>

                        </Col>
                        <Col md={24} lg={12} xl={6}>
                            <Form.Item label="ID шаблона">
                              <Text>{Date.now()}</Text>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
              )}
            </Panel>

            {/* Процесс согласования */}
            <Panel header="Процесс согласования" key="approval" collapsible="header" style={{ background: '#fafafa' }}>
              <UserProvider>
                <ReactFlowProvider>
                  <ApprovalProcessEditor
                    processStatus={mode === ProcessMode.INSTANCE ? instanceData.status: undefined}
                    onStartProcess={mode === ProcessMode.INSTANCE ?handleStartProcess: undefined}
                    onCompleteProcess={mode === ProcessMode.INSTANCE ?handleCompleteProcess:undefined}
                    mode={mode}
                    instanceData={mode === ProcessMode.INSTANCE ? instanceData: undefined}
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
