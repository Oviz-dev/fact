//ContractForm
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
      plannedCostWithoutVAT: values.plannedCostWithoutVAT ? values.plannedCostWithoutVAT.toFixed(2) : '0',
      plannedVAT: values.plannedVAT ? values.plannedVAT.toFixed(2) : '0',
      actualCostWithoutVAT: values.actualCostWithoutVAT ? values.actualCostWithoutVAT.toFixed(2) : '0',
      actualVAT: values.actualVAT ? values.actualVAT.toFixed(2) : '0',
      warrantyReserve: values.warrantyReserve ? values.warrantyReserve.toFixed(2) : undefined,
      plannedAdvancePercent: values.plannedAdvancePercent ? values.plannedAdvancePercent.toFixed(2) : '0',
      actualAdvance: values.actualAdvance ? values.actualAdvance.toFixed(2) : '0',
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
                  style={{ marginBottom: 10, width: '625px' , float: 'right' }}
                  rules={[{ required: true, message: 'Введите наименование договора' }]}
                >
                  <Input placeholder="Введите наименование договора" style={{ marginBottom: 10, width: '500px' }}/>
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
        <Col span={24}>
            <Form.Item
              label="Подрядчик"
              name="contractor"
              style={{ marginBottom: 10, width: '600px' , float: 'right' }}
              rules={[{ required: true, message: 'Выберите подрядчика' }]}
            >
              <Select placeholder="Выберите подрядчика" style={{ marginBottom: 10, width: '500px' }}>
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
                  style={{ marginBottom: 10, width: '245px', float: 'right' }}
                  rules={[{ required: true, message: 'Введите номер' }]}
                >
                  <Input placeholder="Введите номер" style={{ marginBottom: 10, width: '150px' }}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                  label="Дата "
                  name="contractDate"
                  style={{ marginBottom: 10, float: 'right'}}
                  rules={[{ required: true, message: 'Выберите дату ' }]}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ marginBottom: 10, width: '150px', float: 'right'}} />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                  label="Статус "
                  name="status"
                  style={{ marginBottom: 20, width: '245px', float: 'right' }}
                  rules={[{ required: true, message: 'Выберите статус ' }]}
                >
                  <Select placeholder="Выберите статус" style={{ marginBottom: 10, width: '150px' }}>
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
                  style={{ marginBottom: 10, float: 'right'}}
                >
                  <Select placeholder="Выберите тип" style={{ marginBottom: 10, width: '150px', float: 'right'}}>
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
              <Col span={12}>
                <Form.Item
                  label="Стоимость, руб. без НДС"
                  name="plannedCostWithoutVAT"
                  style={{ marginBottom: 10}}
                  rules={[{ required: true, message: 'Введите плановую стоимость без НДС' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ marginBottom: 10, width: '150px' } }
                    placeholder="Введите плановую стоимость без НДС"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="НДС, руб."
                  name="plannedVAT"
                  style={{ marginBottom: 10, float: 'right'}}
                  rules={[{ required: false}]}
                >
                  <InputNumber
                    min={0}
                    style={{ marginBottom: 10, width: '150px' , float: 'right'} }
                    placeholder="Введите НДС"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Гарантийный резерв, %"
                  name="warrantyReserve"
                  style={{ marginBottom: 10, width: '345px'}}
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ marginBottom: 10, width: '150px' , float: 'right'} }
                    placeholder="Введите %"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label=" Аванс, %"
                  name="plannedAdvancePercent"
                  rules={[{ required: false }]}
                  style={{ marginBottom: 10, float: 'right'}}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ marginBottom: 10, width: '150px' , float: 'right'} }
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
                    style={{ marginBottom: 10, width: '150px' , float: 'right'} }
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

      {/* Кнопка отправки */}
      <Button type="primary" htmlType="submit" icon={<CheckOutlined />} style={{ marginTop: 20 }}/>
    </Form>
  );
};

export default ContractForm;
