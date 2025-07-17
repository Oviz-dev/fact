import React, { useState } from 'react';
import { Card, Collapse, Layout, Button, Popover, Form, InputNumber, Checkbox, Radio,Select, Row, Col, Tag, Tooltip } from 'antd';
import Header from '../../components/Header';
import { ControlOutlined, EditOutlined } from '@ant-design/icons';
import SimpleForm from '../components/SimpleForm';

const { Panel } = Collapse;
const { Content } = Layout;
const controlHeight = 30;


const distributeValue = (value: number, periods: string[]) => {
    const n = periods.length;
    const baseValue = Math.floor(value / n);
    const remainder = value % n;

    return periods.map((period, index) => ({
        period,
        value: index < remainder ? baseValue + 1 : baseValue
    }));
};


const NewPage: React.FC = () => {
    const [isPanelVisible, setPanelVisible] = useState(false);
    const [isFormVisible, setFormVisible] = useState(false);
    const [sumYear, setSumYear] = useState<number | null>(null);
    const [sumQuarter, setSumQuarter] = useState<number | null>(null);
    const [distribution, setDistribution] = useState<{ period: string; value: number }[]>([]);

    const togglePanel = () => {
        setPanelVisible(!isPanelVisible);
    };

    const handleFormVisibility = (visible: boolean) => {
        setFormVisible(visible);
    };

    const handleDistribute = () => {
        let result: { period: string; value: number }[] = [];

        if (sumYear !== null) {
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            const quarterlyDistribution = distributeValue(sumYear, quarters);

            quarterlyDistribution.forEach(q => {
                const months = [`${q.period} M1`, `${q.period} M2`, `${q.period} M3`];
                result.push(...distributeValue(q.value, months));
            });
        } else if (sumQuarter !== null) {
            const months = ['M1', 'M2', 'M3'];
            result = distributeValue(sumQuarter, months);
        }

        setDistribution(result);
    };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '0 8px', marginTop: 8 }}>
        <Card>
          <Button
            type="text"
            onClick={togglePanel}
            style={{ margin: '5px', border: 'none', color: 'green', width:24, height: 24 }}
            icon={<ControlOutlined />}
          />
          <Popover
            content={<SimpleForm onClose={() => handleFormVisibility(false)} />} // Передаем форму в Popover
            trigger="click"
            visible={isFormVisible}
            onVisibleChange={handleFormVisibility} // Управляем видимостью Popover
            placement="bottom" // Форма появится под кнопкой
          >
            <Button
              type="text"
              style={{ margin: '5px', border: 'none', color: 'gray', width:24, height: 24 }}
              icon={<EditOutlined />}
            />
          </Popover>
          <Collapse style={{ border: 'none' }} activeKey={isPanelVisible ? ['info'] : []}>
            {isPanelVisible && (
              <Panel
                    header="Инвестиционные показатели"
                    key="info"
                    showArrow={false}
                    style={{
                        backgroundColor: 'white',
                    }}
              >
                    <Form
                        layout="horizontal"
                    >
                        <Row gutter={[16, 16]}>
                            <Col md={24} lg={8} xl={4}>
                                <Form.Item
                                    label="Чистая прибыль:"
                                    tooltip="Прибыль после уплаты налогов, процентов и амортизации"
                                >
                                    <InputNumber
                                        value={"100 000"}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>

                            <Col md={24} lg={8} xl={4}>
                              <Form.Item
                                label="NPV:"
                                tooltip="Чистая приведённая стоимость"
                              >
                                  <InputNumber
                                      value={"80 000"}
                                      disabled
                                  />
                              </Form.Item>
                            </Col>

                            <Col md={24} lg={8} xl={4}>
                              <Form.Item
                                    label="EBIDTA:"
                                    tooltip="Прибыль до уплаты налогов, процентов и амортизации"
                              >
                                  <InputNumber
                                      value={"120 000"}
                                      disabled
                                  />
                              </Form.Item>
                            </Col>

                            <Col md={24} lg={8} xl={4}>
                              <Form.Item
                                  label="IRR:"
                                  tooltip="Внутренняя норма доходности"
                              >
                                  <InputNumber
                                      placeholder={"%"}
                                      //disabled
                                  />
                              </Form.Item>
                            </Col>

                            <Col md={24} lg={8} xl={4}>
                              <Form.Item
                                label="ROI:"
                                tooltip="Рентабельность инвестиций"
                            >
                                  <InputNumber
                                      placeholder={"%"}
                                      //disabled
                                  />
                              </Form.Item>
                            </Col>

                            <Col md={24} lg={8} xl={4}>
                              <Form.Item
                                label="PBP:"
                                tooltip="Простой срок окупаемости"
                              >
                                  <InputNumber
                                      placeholder={"мес"}
                                      //disabled
                                  />
                              </Form.Item>
                            </Col>
                        </Row>
                    </Form>
              </Panel>
            )}
          </Collapse>

        </Card>

        <Card>

                              <Form
                                  layout="horizontal"
                              >
                                  <Row>
                                      <Col md={24} lg={8} xl={4}>
                                        <Form.Item label="Сумма в год" tooltip="SumYear">
                                            <InputNumber
                                                placeholder="Вводим сюда сумму в год"
                                                value={sumYear}
                                                onChange={setSumYear}
                                            />
                                        </Form.Item>
                                      </Col>
                                      <Col md={24} lg={8} xl={4}>
                                        <Form.Item label="Сумма в квартал" tooltip="SumQuarter">
                                            <InputNumber
                                                placeholder="Вводим сюда сумму в квартал"
                                                value={sumQuarter}
                                                onChange={setSumQuarter}
                                            />
                                        </Form.Item>
                                      </Col>
                                  </Row>
                                  <Button type="primary" onClick={handleDistribute}>
                                    Распределить
                                  </Button>
                              </Form>

                            <p>Результат распределения:</p>
                            <ul>
                                {distribution.map((item, index) => (
                                    <li key={index}>
                                        {item.period}: {item.value}
                                    </li>
                                ))}
                            </ul>
        </Card>
      </Content>
    </Layout>
  );
};

export default NewPage;