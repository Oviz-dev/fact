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
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Общая информация */}
      <Card title="Общая информация" style={{ marginBottom: 20 }}>
        <Row gutter={10}>
          <Col span={5}>
            <Form.Item
              label="Наименование договора"
              name="name"
              rules={[{ required: true, message: 'Введите наименование договора' }]}
            >
              <Input placeholder="Введите наименование договора" />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label="Номер договора"
              name="contractNumber"
              rules={[{ required: true, message: 'Введите номер договора' }]}
            >
              <Input placeholder="Введите номер договора" />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label="Дата договора"
              name="contractDate"
              rules={[{ required: true, message: 'Выберите дату договора' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label="Статус договора"
              name="status"
              rules={[{ required: true, message: 'Выберите статус договора' }]}
            >
              <Select placeholder="Выберите статус">
                {Object.values(ContractStatus).map(status => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label="Тип договора"
              name="type"
              rules={[{ required: true, message: 'Выберите тип договора' }]}
            >
              <Select placeholder="Выберите тип">
                {Object.values(ContractType).map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={5}>
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
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* Плановые показатели */}
        <Col span={12}>
          <Card title="Плановые показатели">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Стоимость без НДС (план)"
                  name="plannedCostWithoutVAT"
                  rules={[{ required: true, message: 'Введите плановую стоимость без НДС' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Введите плановую стоимость без НДС"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="НДС (план)"
                  name="plannedVAT"
                  rules={[{ required: true, message: 'Введите плановую НДС' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Введите плановую НДС"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Гарантийный резерв (%)"
                  name="warrantyReserve"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="Введите гарантийный резерв (%)"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Плановый аванс (%)"
                  name="plannedAdvancePercent"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="Введите плановый аванс (%)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Фактические показатели */}
        <Col span={12}>
          <Card title="Фактические показатели">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Стоимость без НДС (факт)"
                  name="actualCostWithoutVAT"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Введите фактическую стоимость без НДС"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="НДС (факт)"
                  name="actualVAT"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Введите фактический НДС"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Фактический аванс"
                  name="actualAdvance"
                  rules={[{ required: false }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="Введите фактический аванс"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Кнопка отправки */}
      <Button type="primary" htmlType="submit" icon={<CheckOutlined />} style={{ marginTop: 20 }}/>
    </Form>
  );
};

export default ContractForm;
