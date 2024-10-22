import React, { useEffect, useState } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Form, Input, Button, DatePicker, Select, InputNumber, Card, Tabs, message, Collapse, Row, Col} from 'antd';
import { ContractDTO, ContractStatus, ContractType, Contractor } from '../DTO/ContractDTO';
import { fetchFactsByContract } from '../../fact/services/factService';
import { FactDTO } from '../../fact/DTO/FactDTO';
import FactTable from '../../fact/pages/FactContractTable';
import moment from 'moment';

const { Option } = Select;
const { TabPane } = Tabs;

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

    // Функция для расчета общей стоимости
    const calculateTotalCost = (withoutVAT: number | null, vat: number | null) => {
     return (withoutVAT || 0) + (vat || 0);
    };

    // Общие обработчики изменения полей
    const handleFieldChange = (fieldName: string, value: number | null) => {
     const currentFormValues = form.getFieldsValue();
     const withoutVAT = fieldName === 'plannedCostWithoutVAT' ? value : currentFormValues.plannedCostWithoutVAT;
     const vat = fieldName === 'plannedVAT' ? value : currentFormValues.plannedVAT;

     form.setFieldsValue({
       [fieldName]: value,
       plannedCost: calculateTotalCost(withoutVAT, vat)
     });
    };

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
        plannedCost: (initialValues.plannedCostWithoutVAT || 0) + (initialValues.plannedVAT || 0),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const contractData: ContractDTO = {
        ...values,
        id: initialValues?.id,
        plannedCostWithoutVAT: values.plannedCostWithoutVAT ? Number(values.plannedCostWithoutVAT) : 0,
        plannedVAT: values.plannedVAT ? Number(values.plannedVAT) : 0,
        plannedCost: (plannedCostWithoutVAT||0) + (plannedVAT||0),
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

  // Общий стиль для всех InputNumber
  const inputNumberStyle = { width: '100%' };

  // Общий стиль для карточек
  const cardStyle = { marginBottom: '1rem' };

  return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Button
          type="primary"
          htmlType="submit"
          icon={<CheckOutlined />}
        >
          {isEditing ? 'Сохранить' : 'Создать'}
        </Button>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Основные сведения" key="1">
              <Collapse defaultActiveKey={['1','2','3']}>
                  <Collapse.Panel
                    header="Общая информация"
                    key="1"
                    style={{
                      backgroundColor: '#d9ffe0',
                      color: '#1c6900',
                      cursor: 'pointer'
                    }}
                    showArrow={true}
                    collapsible="header"
                  >
                      <Card
                      >
                        <Form.Item
                          label="Наименование"
                          name="name"
                          rules={[{ required: true, message: 'Введите наименование договора' }]}
                        >
                          <Input placeholder="Введите наименование договора" />
                        </Form.Item>

                        <Form.Item
                          label="Подрядчик"
                          name="contractor"
                          rules={[{ required: true, message: 'Выберите подрядчика' }]}
                        >
                          <Select placeholder="Выберите подрядчика">
                            {Object.values(Contractor).map(contractor => (
                              <Option key={contractor} value={contractor}>{contractor}</Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Row gutter={[16, 8]}>
                            <Col xs={24} md={12} lg={6}>
                              <Form.Item
                                label="Номер"
                                name="contractNumber"
                                rules={[{ required: true, message: 'Введите номер' }]}
                              >
                                <Input placeholder="Введите номер" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                              <Form.Item
                                label="Дата"
                                name="contractDate"
                                rules={[{ required: true, message: 'Выберите дату' }]}
                              >
                                <DatePicker format="YYYY-MM-DD" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                              <Form.Item
                                label="Статус"
                                name="status"
                                rules={[{ required: true, message: 'Выберите статус' }]}
                              >
                                <Select placeholder="Выберите статус">
                                  {Object.values(ContractStatus).map(status => (
                                    <Option key={status} value={status}>{status}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                              <Form.Item
                                label="Тип"
                                name="type"
                                rules={[{ required: true, message: 'Выберите тип' }]}
                              >
                                <Select placeholder="Выберите тип">
                                  {Object.values(ContractType).map(type => (
                                    <Option key={type} value={type}>{type}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                        </Row>
                      </Card>
                  </Collapse.Panel>
                  <Collapse.Panel
                    header="Плановые показатели"
                    key="2"
                    style={{
                      backgroundColor: '#ddbfdd',
                      color: '#333752',
                      cursor: 'pointer'
                    }}
                    showArrow={true}
                    collapsible="header"
                  >
                      <Card>
                        <Row gutter={[16, 8]}>
                            <Col md={24} lg={8}>
                                <Form.Item
                                    label="Стоимость без НДС"
                                    name="plannedCostWithoutVAT"
                                    rules={[{ required: true, message: 'Введите плановую стоимость без НДС' }]}
                                >
                                    <InputNumber
                                        style={inputNumberStyle}
                                        min={0}
                                        placeholder="Введите стоимость"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                        onChange={value => handleFieldChange('plannedCostWithoutVAT', value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24} lg={8}>
                                <Form.Item
                                    label="Сумма НДС"
                                    name="plannedVAT"
                                >
                                    <InputNumber
                                        style={inputNumberStyle}
                                        min={0}
                                        placeholder="Введите НДС"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                        onChange={value => handleFieldChange('plannedVAT', value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24} lg={8}>
                                <Form.Item
                                    label="Стоимость с НДС"
                                    name="plannedCost"
                                >
                                    <InputNumber
                                        style={inputNumberStyle}
                                        disabled
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16, 8]}>
                            <Col md={24} lg={12}>
                              <Form.Item
                                label="Гарантийный резерв, %"
                                name="warrantyReserve"
                              >
                                <InputNumber
                                  style={inputNumberStyle}
                                  min={0}
                                  max={100}
                                  placeholder="Введите %"
                                />
                              </Form.Item>
                            </Col>
                            <Col md={24} lg={12}>
                              <Form.Item
                                label="Аванс, %"
                                name="plannedAdvancePercent"
                              >
                                <InputNumber
                                  style={inputNumberStyle}
                                  min={0}
                                  max={100}
                                  placeholder="Введите %"
                                />
                              </Form.Item>
                            </Col>
                        </Row>
                      </Card>
                  </Collapse.Panel>
                  <Collapse.Panel
                    header="Фактические показатели"
                    key="3"
                    style={{
                      backgroundColor: '#ffe8d9',
                      color: '#000',
                      cursor: 'pointer'
                    }}
                    showArrow={true}
                    collapsible="header"
                  >
                      {/* Фактические показатели */}
                      <Card>
                        <Row gutter={[16, 8]}>
                            <Col md={24} lg={8}>
                              <Form.Item
                                label="Выполнение без НДС"
                                name="actualCostWithoutVAT"
                              >
                                <InputNumber
                                  style={inputNumberStyle}
                                  min={0}
                                  disabled
                                  placeholder="Введите стоимость без НДС"
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                />
                              </Form.Item>
                            </Col>
                            <Col md={24} lg={8}>
                              <Form.Item
                                label="Сумма НДС"
                                name="actualVAT"
                              >
                                <InputNumber
                                  style={inputNumberStyle}
                                  min={0}
                                  placeholder="Введите НДС"
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                                />
                              </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                          label="Выплаченный аванс"
                          name="actualAdvance"
                        >
                          <InputNumber
                            style={inputNumberStyle}
                            min={0}
                            placeholder="Введите фактический аванс"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                          />
                        </Form.Item>
                      </Card>
                  </Collapse.Panel>
              </Collapse>
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
      </Form>
  );
};

export default ContractForm;