//ContractForm
import { CheckOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Row, Col, Card, Tabs,  message } from 'antd';
import FactTable from '../../fact/pages/FactContractTable';
import { ContractDTO, ContractStatus, ContractType, Contractor } from '../DTO/ContractDTO';
import { fetchFactsByContract } from '../../fact/services/factService';
import { FactDTO } from '../../fact/DTO/FactDTO';

import moment from 'moment';


const { Option } = Select;
const { TabPane } = Tabs;
const widthValue = 150;

interface ContractFormProps {
  onSubmit: (contractData: ContractDTO) => void;
  initialValues?: ContractDTO | null;
  isEditing?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false
}) => {
  const [form] = Form.useForm();
  const [facts, setFacts] = useState<FactDTO[]>([]);
  const [plannedCostWithoutVAT, setPlannedCostWithoutVAT] = useState<number>(0);
  const [plannedVAT, setPlannedVAT] = useState<number>(0);

    useEffect(() => {
      const calculatedPlannedCost = plannedCostWithoutVAT + plannedVAT;
      form.setFieldsValue({ plannedCost: calculatedPlannedCost });
    }, [plannedCostWithoutVAT, plannedVAT, form]);

  useEffect(() => {
    if (initialValues?.id) {
      fetchFactsByContract(initialValues.id).then(setFacts);
    }
  }, [initialValues?.id]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        contractDate: initialValues.contractDate ? moment(initialValues.contractDate) : undefined,
        startDate: initialValues.startDate ? moment(initialValues.startDate) : undefined,
        endDate: initialValues.endDate ? moment(initialValues.endDate) : undefined,
        plannedCost: initialValues.plannedCostWithoutVAT + initialValues.plannedVAT,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);


  // Обработчик отправки формы
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const contractData: ContractDTO = {
        ...values,
        id: initialValues?.id,
        plannedCostWithoutVAT: values.plannedCostWithoutVAT ? Number(values.plannedCostWithoutVAT) : 0,
        plannedVAT: values.plannedVAT ? Number(values.plannedVAT) : 0,
        plannedCost: plannedCostWithoutVAT + plannedVAT,
        actualCostWithoutVAT: values.actualCostWithoutVAT ? Number(values.actualCostWithoutVAT) : 0,
        actualVAT: values.actualVAT ? Number(values.actualVAT) : 0,
        warrantyReserve: values.warrantyReserve ? Number(values.warrantyReserve) : undefined,
        plannedAdvancePercent: values.plannedAdvancePercent ? Number(values.plannedAdvancePercent) : 0,
        actualAdvance: values.actualAdvance ? Number(values.actualAdvance) : 0,
        contractDate: values.contractDate ? values.contractDate.format('YYYY-MM-DD') : undefined,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
    };
    await onSubmit(contractData);
      if (!isEditing) {
        form.resetFields();
      }
    } catch (errorInfo) {
      console.error('Validation Failed:', errorInfo);
      message.error('Ошибка');
    }
  };

  return (
    <Form form={form} layout="horizontal" onFinish={handleSubmit}>
    <Tabs defaultActiveKey="1">
        <TabPane tab="Основные сведения" key="1">
          <Card
          title="Общая информация"
          style={{ marginBottom: 10}}
          headStyle={{ backgroundColor:'#d9ffe0', color: '#1c6900' }}
          >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                      label="Наименование"
                      name="name"
                      style={{ marginBottom: 10}}
                      rules={[{ required: true, message: 'Введите наименование договора' }]}
                    >
                      <Input placeholder="Введите наименование договора" style={{ marginBottom: 10}}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
            <Col span={24}>
                <Form.Item
                  label="Подрядчик"
                  name="contractor"
                  style={{ marginBottom: 10}}
                  rules={[{ required: true, message: 'Выберите подрядчика' }]}
                >
                  <Select placeholder="Выберите подрядчика" style={{ marginBottom: 10}}>
                    {Object.values(Contractor).map(contractor => (
                      <Option key={contractor} value={contractor}>
                        {contractor}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                      label="Номер "
                      name="contractNumber"
                      style={{ marginBottom: 10}}
                      rules={[{ required: true, message: 'Введите номер' }]}
                    >
                      <Input placeholder="Введите номер" style={{ marginBottom: 10, width: widthValue }}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                      label="Дата "
                      name="contractDate"
                      style={{ marginBottom: 10}}
                      rules={[{ required: true, message: 'Выберите дату ' }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ marginBottom: 10, width: widthValue}} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                      label="Статус "
                      name="status"
                      style={{ marginBottom: 10}}
                      rules={[{ required: true, message: 'Выберите статус ' }]}
                    >
                      <Select placeholder="Выберите статус" style={{ marginBottom: 10, width: widthValue}}>
                        {Object.values(ContractStatus).map(status => (
                          <Option key={status} value={status}>
                            {status}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                      label="Тип"
                      name="type"
                      rules={[{ required: true, message: 'Выберите тип ' }]}
                      style={{ marginBottom: 10}}
                    >
                      <Select placeholder="Выберите тип" style={{ marginBottom: 10, width: widthValue}}>
                        {Object.values(ContractType).map(type => (
                          <Option key={type} value={type}>
                            {type}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                </Col>
            </Row>
          </Card>

          <Card
              title="Плановые показатели"
              style={{ marginBottom: 10}}
              headStyle={{ backgroundColor: '#ddbfdd', color: '#333752' }}
          >
              <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label="Стоимость без НДС"
                      name="plannedCostWithoutVAT"
                      style={{ marginBottom: 10}}
                      rules={[{ required: true, message: 'Введите плановую стоимость без НДС' }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ marginBottom: 10, width:widthValue } }
                        placeholder="Введите плановую стоимость без НДС"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        onChange={value => setPlannedCostWithoutVAT(value || 0)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="НДС, руб."
                      name="plannedVAT"
                      style={{ marginBottom: 10, float: 'right'}}
                      rules={[{ required: false}]}
                    >
                      <InputNumber
                        min={0}
                        style={{ marginBottom: 10, width: widthValue } }
                        placeholder="Введите НДС"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        onChange={value => setPlannedVAT(value || 0)}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      label="Стоимость с НДС"
                      name="plannedCost"
                    >
                      <InputNumber
                        disabled style={{ marginBottom: 10, width: widthValue } }
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      />
                    </Form.Item>
                  </Col>
              </Row>
              <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label="Гарантийный резерв, %"
                      name="warrantyReserve"
                      style={{ marginBottom: 10, width: '345px'}}
                      rules={[{ required: false }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ marginBottom: 10, width: widthValue, float: 'right'} }
                        placeholder="Введите %"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label=" Аванс, %"
                      name="plannedAdvancePercent"
                      rules={[{ required: false }]}
                      style={{ marginBottom: 10, float: 'right'}}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ marginBottom: 10, width: widthValue , float: 'right'} }
                        placeholder="Введите %"
                      />
                    </Form.Item>
                  </Col>
                  </Row>
          </Card>

          <Card
            title="Фактические показатели"
            style={{ marginBottom: 10}}
            headStyle={{ backgroundColor:'#ffe8d9', color: '#000' }}
          >
              <Row gutter={16}>
                  <Col span={12}>

                    <Form.Item
                      label="Выполнение, руб. без НДС "
                      name="actualCostWithoutVAT"
                      rules={[{ required: false }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '150px' }}
                        placeholder="Введите стоимость без НДС"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="НДС, руб."
                      name="actualVAT"
                      rules={[{ required: false }]}
                      style={{ marginBottom: 10, float: 'right'}}
                    >
                      <InputNumber
                        min={0}
                        placeholder="Введите НДС"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        style={{ marginBottom: 10, width: widthValue , float: 'right'} }
                      />
                    </Form.Item>
                  </Col>
              </Row>
                <Form.Item
                  label="Выплаченный аванс, руб."
                  name="actualAdvance"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '150px' }}
                    placeholder="Введите фактический аванс"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
          </Card>
        </TabPane>
        <TabPane tab="Выполнение" key="2">
              {initialValues?.id ? (
                <FactTable
                  facts={facts}
                  refreshFacts={() => fetchFactsByContract(initialValues.id).then(setFacts)}
                  onEdit={() => {}}
                  SelectedFact={null}
                />
              ) : (
                <p>Нет контракта</p>
              )}
        </TabPane>
    </Tabs>
      <Button
        type="primary"
        htmlType="submit"
        icon={<CheckOutlined />}
        style={{ marginTop: 20 }}
      >
        {isEditing ? 'Сохранить' : 'Создать'}
      </Button>

    </Form>
  );
};

export default ContractForm;
