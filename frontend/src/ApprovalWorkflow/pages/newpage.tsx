import React, { useState } from 'react';
import { Card, Collapse, Layout, Button} from 'antd';
import Header from '../../components/Header';
import { ControlOutlined, EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Content } = Layout;
const controlHeight=30;

const NewPage: React.FC = () => {

    const [isPanelVisible, setPanelVisible] = useState(false);

    const togglePanel = () => {
        setPanelVisible(!isPanelVisible);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Content style={{ padding: '0 8px', marginTop: 8 }}>
                <Card >

                    <Button
                        onClick={togglePanel} //определяет видимость панели (при нажатии раскрывает панель на экране или скрывает панель с экрана)
                        style={{margin: '5px', border: 'none', color: 'blue', height: controlHeight}}
                        icon={<ControlOutlined />}

                    />
                    <Button
                        onClick={togglePanel} //определяет видимость панели (при нажатии раскрывает панель на экране или скрывает панель с экрана)
                        style={{margin: '5px', border: 'none', color: 'gray', height: controlHeight}}
                        icon={<EditOutlined />}

                    />
                    <Collapse style={{border:'none'}} activeKey={isPanelVisible ? ['info'] : []}>
                        {isPanelVisible && (
                            <Panel
                                header="Инвестиционные показатели"
                                key="info"
                                showArrow={false}
                            >
                            <p>
                                Здесь содержимое панели с инвестиционными показателями
                            </p>
                            </Panel>
                        )}
                    </Collapse>
                    <p>
                        Здесь основная рабочая область
                    </p>
                </Card>
        </Content>
    </Layout>
    );
};

export default NewPage;
