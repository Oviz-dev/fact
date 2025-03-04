import React, { useState } from 'react';
import { Card, Collapse, Layout, Typography, Radio, Input, Form,Select, Row, Col, message, Button, Tag} from 'antd';
import { ReactFlowProvider } from 'react-flow-renderer';
import { UserProvider } from '../context/UserContext';
import ApprovalProcessEditor from '../components/ApprovalProcessEditor';
import Header from '../../components/Header';
import {ProcessMode, TemplateType, EntityType, ProcessStatus, ApprovalStep, ApprovalConnection } from '../types';
import {controlHeight} from '../components/UIKit';
import { ControlOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Content } = Layout;
const { Text } = Typography;

// Моковые данные сущности
const Entity = {
    id: Date.now(), // ID экземпляра процесса
    templateId: '555', // ID шаблона согласования
    entityId: '333', // ID сущности по которой требуется согласование
    templateName: 'Процесс согласования бюджета', // в будущем вытаскивать по id шаблона название
    name: 'Бюджет проекта "Космопорт". версия 1', // делать выбор экземпляра либо подставлять сущность из карточки
    status: ProcessStatus.DRAFT, // стартовый статус
};

const ApprovalPage: React.FC = () => {
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

    const handleStopProcess = () => {
        setInstanceData(prev => ({
            ...prev,
            status: ProcessStatus.CANCEL, // Меняем статус процесса на "отменен"
            }));
        message.error('Процесс отменен');
    };

    const handleCompleteProcess = () => {
        setInstanceData(prev => ({
            ...prev,
            status: ProcessStatus.COMPLETE, // Меняем статус процесса на "Выполнен"
            }));
        message.success('Процесс завершён');
    };
    const [loadedNodes, setLoadedNodes] = useState<ApprovalStep[]>([]);
    const [loadedEdges, setLoadedEdges] = useState<ApprovalConnection[]>([]);

    //функция загрузки из файла
    const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);

                if (!json.nodes || !json.edges) {
                    message.error("Файл не содержит корректных данных процесса.");
                    return;
                }

                if (json.templateType) {
                    // Загружаем шаблон
                    setTemplateData({
                        id: json.id,
                        name: json.name,
                        description: json.description,
                        templateType: json.templateType,
                        entityType: json.entityType,
                    });
                    setMode(ProcessMode.TEMPLATE);
                    setLoadedNodes(json.nodes);
                    setLoadedEdges(json.edges);
                    message.success("Шаблон загружен.");

                } else if (json.status) {
                    // Загружаем экземпляр
                    setInstanceData({
                        id: json.id,
                        entityId: json.entityId,
                        templateId: json.templateId,
                        status: json.status,
                    });
                    setMode(ProcessMode.INSTANCE);
                    setLoadedNodes(json.nodes);
                    setLoadedEdges(json.edges);
                    message.success("Процесс загружен.");
                } else {
                    message.error("Файл не содержит корректных данных.");
                }
            } catch (error) {
                message.error("Ошибка при загрузке файла. Проверьте формат JSON.");
            }
        };
        reader.readAsText(file);
    };

    const [isPanelVisible, setPanelVisible] = useState(false);

    const togglePanel = () => {
        setPanelVisible(!isPanelVisible);
    };



    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Content style={{ padding: '0 8px', marginTop: 8 }}>
                <Card>
                    <div style={{ marginBottom: 8 }}>
                        <input
                            type="file"
                            accept="application/json"
                            onChange={handleLoadFromFile}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <Button
                            type="default"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            style={{ height: controlHeight}}
                        >
                            Загрузить процесс
                        </Button>

                        <Button //расположить справа на экране
                            onClick={togglePanel} //определяет видимость панели с основной информацией (при нажатии раскрывает панель на экране или скрывает панель с экрана)
                            style={{border: 'none', color: 'gray' , height: controlHeight}}
                            icon={<ControlOutlined />}

                        />

                    </div>
                    <Collapse style={{border:'none'}} activeKey={isPanelVisible ? ['info'] : []}>
                        {/* Основная информация */}
                        {isPanelVisible && (
                        <Panel
                            header="Основная информация"
                            key="info"
                            showArrow={false}
                        >
                            {/* Переключатель режима */}
                            <Radio.Group
                                value={mode}
                                onChange={e => setMode(e.target.value)}
                                style={{ marginBottom: 8 , height: controlHeight}}
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
                                            <Form.Item label="Экземпляр сущности:">
                                                <Tag key="entityId"> {instanceData.entityId}</Tag>
                                                <Text> {Entity.name}</Text>
                                            </Form.Item>
                                        </Col>
                                        <Col md={24} lg={12} xl={6}>
                                            <Form.Item label="Шаблон:">
                                                <Tag key="templateId"> {instanceData.templateId}</Tag>
                                                <Text>{Entity.templateName}</Text>
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
                                                    instanceData.status === ProcessStatus.CANCEL ? 'red' :
                                                    'green'
                                                    }
                                                >
                                                    {instanceData.status}
                                                </Tag>
                                            ]}
                                            </Form.Item>
                                        </Col>
                                        <Col md={24} lg={12} xl={6}>
                                            <Form.Item label="ID процесса">
                                                <Tag key="id"> {instanceData.id}</Tag>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            )}

                            {/* Форма для шаблона */}
                            {mode === ProcessMode.TEMPLATE && (
                                <Form
                                    layout="horizontal"
                                    initialValues={templateData}
                                    onValuesChange={(_, values) => setTemplateData(values)}
                                >
                                    <Row gutter={[16, 16]}>
                                        <Col md={24} lg={12} xl={6}>
                                            <Form.Item label="Название" name="name">
                                                <Input placeholder="Введите название" />
                                            </Form.Item>

                                            <Form.Item label="Описание" name="description">
                                                <Input.TextArea placeholder="Введите описание" />
                                            </Form.Item>
                                        </Col>
                                        <Col md={24} lg={12} xl={6}>
                                            <Form.Item label="Тип сущности" name="entityType">
                                                <Select placeholder="Выберите тип сущности">
                                                {Object.values(EntityType).map(type => (
                                                    <Select.Option
                                                        key={type}
                                                        value={type}>
                                                        {type}
                                                    </Select.Option>
                                                ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col md={24} lg={12} xl={6}>
                                            <Form.Item label="Тип согласования" name="templateType">
                                                <Select placeholder="Выберите тип согласования">
                                                {Object.values(TemplateType).map(type => (
                                                    <Select.Option
                                                        key={type}
                                                        value={type}>
                                                        {type}
                                                    </Select.Option>
                                                ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col md={24} lg={12} xl={6}>
                                            <Form.Item label="ID шаблона">
                                                <Tag key="id"> {Date.now()}</Tag>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Panel>
                        )}
                    </Collapse>
                    <Collapse style={{border:'none'}} defaultActiveKey={['approval']}>
                        {/* Процесс согласования */}
                        <Panel
                            header="Процесс согласования"
                            key="approval"
                            collapsible="header"
                            style={{ background: '#fafafa' }}
                        >
                            <UserProvider>
                                <ReactFlowProvider>
                                    <ApprovalProcessEditor
                                        processStatus={mode === ProcessMode.INSTANCE ? instanceData.status: undefined}
                                        onStartProcess={mode === ProcessMode.INSTANCE ?handleStartProcess: undefined}
                                        onStopProcess={mode === ProcessMode.INSTANCE ?handleStopProcess: undefined}
                                        onCompleteProcess={mode === ProcessMode.INSTANCE ?handleCompleteProcess:undefined}
                                        mode={mode}
                                        instanceData={mode === ProcessMode.INSTANCE ? instanceData: undefined}
                                        templateData={mode === ProcessMode.TEMPLATE ? templateData : undefined}
                                        initialNodes={loadedNodes}
                                        initialEdges={loadedEdges}
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

export default ApprovalPage;
