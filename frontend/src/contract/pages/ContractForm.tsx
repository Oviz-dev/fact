import { CheckOutlined } from '@ant-design/icons';
import React from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Row, Col, Card,  message } from 'antd';
import { ContractDTO, ContractStatus, ContractType, Contractor } from '../DTO/ContractDTO';
import { createContract, deleteContract, updateContract} from '../services/ContractService';
const { Option } = Select;

interface ContractFormProps {
  onSubmit: (contractData: ContractDTO) => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  // Обработчик отправки формы
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
    const contractData: ContractDTO = {
      ...values,
      plannedCostWithoutVAT: values.plannedCostWithoutVAT ? values.plannedCostWithoutVAT.toFixed(2) : undefined,
      plannedVAT: values.plannedVAT ? values.plannedVAT.toFixed(2) : undefined,
      actualCostWithoutVAT: values.actualCostWithoutVAT ? values.actualCostWithoutVAT.toFixed(2) : undefined,
      actualVAT: values.actualVAT ? values.actualVAT.toFixed(2) : undefined,
      warrantyReserve: values.warrantyReserve ? values.warrantyReserve.toFixed(2) : undefined,
      plannedAdvancePercent: values.plannedAdvancePercent ? values.plannedAdvancePercent.toFixed(2) : undefined,
      actualAdvance: values.actualAdvance ? values.actualAdvance.toFixed(2) : undefined,
      contractDate: values.contractDate ? values.contractDate.format('YYYY-MM-DD') : undefined,
      startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : undefined,
      endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
    };

      await createContract(contractData);
      message.success('Контракт добавлен');
      form.resetFields();
      onSubmit(contractData);
    } catch (errorInfo) {
      console.error('Validation Failed:', errorInfo);
      message.error('Ошибка');
    }
  };

  return (
    <Form form={form} layout="horizontal" onFinish={handleSubmit}>
      {/* Общая информация */}
      <Card title="Общая информация" style={{ marginBottom: 10 }}>
        <Row gutter={20}>
            <Form.Item
              label="Наименование договора"
              name="name"
              rules={[{ required: true, message: 'Введите наименование договора' }]}
            >
              <Input placeholder="Введите наименование договора" />
            </Form.Item>

            <Form.Item
              label="Номер договора"
              name="contractNumber"
              rules={[{ required: true, message: 'Введите номер договора' }]}
            >
              <Input placeholder="Введите номер договора" />
            </Form.Item>

            <Form.Item
              label="Дата договора"
              name="contractDate"
              rules={[{ required: true, message: 'Выберите дату договора' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '150px' }} />
            </Form.Item>

            <Form.Item
              label="Статус договора"
              name="status"
              rules={[{ required: true, message: 'Выберите статус договора' }]}
            >
              <Select placeholder="Выберите статус" style={{ width: '150px' }}>
                {Object.values(ContractStatus).map(status => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Тип договора"
              name="type"
              rules={[{ required: true, message: 'Выберите тип договора' }]}
            >
              <Select placeholder="Выберите тип" style={{ width: '150px' }}>
                {Object.values(ContractType).map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Подрядчик"
              name="contractor"
              rules={[{ required: true, message: 'Выберите подрядчика' }]}
            >
              <Select placeholder="Выберите подрядчика">
                {Object.values(Contractor).map(contractor => (
                  <Option key={contractor} value={contractor}>
                    {contractor}
                  </Option>
                ))}
              </Select>
            </Form.Item>
        </Row>
      </Card>

      <Row gutter={10}>
                    {/* Плановые показатели */}
                    <Col span={10}>
                      <Card title="Плановые показатели" >
                        <Form.Item
                          label="Стоимость без НДС"
                          name="plannedCostWithoutVAT"
                          rules={[{ required: true, message: 'Введите плановую стоимость без НДС' }]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: '150px' }}
                            placeholder="Введите плановую стоимость без НДС"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                          />
                        </Form.Item>

                        <Form.Item
                          label="НДС"
                          name="plannedVAT"
                          rules={[{ required: true, message: 'Введите плановую НДС' }]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: '150px' }}
                            placeholder="Введите НДС"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Гарантийный резерв (%)"
                          name="warrantyReserve"
                          rules={[{ required: false }]}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            style={{ width: '150px' }}
                            placeholder="Введите %"
                          />
                        </Form.Item>

                        <Form.Item
                          label=" Аванс (%)"
                          name="plannedAdvancePercent"
                          rules={[{ required: false }]}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            style={{ width: '150px' }}
                            placeholder="Введите %"
                          />
                        </Form.Item>
                      </Card>
                    </Col>
        {/* Фактические показатели */}
                    <Col span={10}>
                      <Card title="Фактические показатели">

                            <Form.Item
                              label="Стоимость без НДС "
                              name="actualCostWithoutVAT"
                              rules={[{ required: false }]}
                            >
                              <InputNumber
                                min={0}
                                style={{ width: '150px' }}
                                placeholder="Введите стоимость без НДС"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                              />
                            </Form.Item>

                            <Form.Item
                              label="НДС "
                              name="actualVAT"
                              rules={[{ required: false }]}
                            >
                              <InputNumber
                                min={0}
                                style={{ width: '150px' }}
                                placeholder="Введите НДС"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                              />
                            </Form.Item>

                            <Form.Item
                              label=" Аванс"
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
                    </Col>
      </Row>

      {/* Кнопка отправки */}
      <Button type="primary" htmlType="submit" icon={<CheckOutlined />} style={{ marginTop: 20 }}/>
    </Form>
  );
};

export default ContractForm;
