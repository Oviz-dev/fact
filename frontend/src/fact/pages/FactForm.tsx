//FactForm
import { CheckOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Row, Col, Card,  message } from 'antd';
import { FactDTO} from '../DTO/FactDTO';
import DropdownWithSearch from '../../components/DropdownWithSearch';

import moment from 'moment';
const { Option } = Select;
interface FactFormProps {
  onSubmit: (FactData: FactDTO) => void;
  initialValues?: FactDTO | null;
  isEditing?: boolean;
  contracts: { id: number; name: string }[];
  units: { id: number; name: string }[];
  objects: { id: number; name: string }[];
}

const FactForm: React.FC<FactFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false,
  contracts,
  units,
  objects
}) => {
  const [form] = Form.useForm();
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
      setSelectedContractId(initialValues.contract?.id || null);
      setSelectedUnitId(initialValues.unit?.id || null);
      setSelectedObjectId(initialValues.object?.id || null);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);


  // Обработчик отправки формы
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const factData: FactDTO = {
        ...values,
        id: initialValues?.id,
        cost: values.cost ? Number(values.cost) : 0,
        amount: values.amount ? Number(values.amount) : 0,
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
        contract: contracts.find(contract => contract.id === selectedContractId) || undefined,
        unit: units.find(unit => unit.id === selectedUnitId) || undefined,
        object: objects.find(object => object.id === selectedObjectId) || undefined,
    };
    await onSubmit(factData);
      if (!isEditing) {
        form.resetFields();
      }
    } catch (errorInfo) {
      console.error('Validation Failed:', errorInfo);
      message.error('Ошибка');
    }
  };

  const handleContractChange = (contractId: number) => {
    setSelectedContractId(contractId);
  };

  const handleUnitChange = (unitId: number) => {
    setSelectedUnitId(unitId);
  };

  const handleObjectChange = (objectId: number) => {
      setSelectedObjectId(objectId);
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
                  style={{ marginBottom: 10, width: '625px'}}
                  rules={[{ required: true, message: 'Введите наименование ' }]}
                >
                  <Input placeholder="Введите наименование " style={{ marginBottom: 10, width: '500px' }}/>
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={24}>
                <Form.Item
                      label="Договор"
                      name="contract"
                      rules={[{ required: true, message: 'Выберите договор' }]}
                    >
                      <DropdownWithSearch
                        options={contracts}
                        placeholder="Выберите договор"
                        onChange={handleContractChange}
                      />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={24}>
                <Form.Item
                      label="Объект"
                      name="object"
                      rules={[{ required: false}]}
                    >
                      <DropdownWithSearch
                        options={objects}
                        placeholder="Выберите объект"
                        onChange={handleObjectChange}
                      />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                  label="№"
                  name="factNumber"
                  style={{ marginBottom: 10, width: '245px'}}
                  rules={[{ required: true, message: 'Введите номер' }]}
                >
                  <Input placeholder="Введите номер" style={{ marginBottom: 10, width: '150px' }}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                  label="Дата "
                  name="date"
                  style={{ marginBottom: 10, float: 'right'}}
                  rules={[{ required: true, message: 'Выберите дату ' }]}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ marginBottom: 10, width: '150px', float: 'right'}} />
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
              <Col span={24}>
                <Form.Item
                  label="Выполнение, руб. без НДС "
                  name="cost"
                  rules={[{ required: true,  message: 'Внесите стоимость ' }]}
                  style={{ float: 'right' }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '210px'}}
                    placeholder="Введите стоимость без НДС"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  label="Объём"
                  name="amount"
                  rules={[{ required: false }]}
                  style={{ float: 'right' }}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '150px' }}
                    placeholder="Введите количество"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                      label=""
                      name="unit"
                      rules={[{ required: true, message: 'Выберите единицу' }]}
                    >
                      <DropdownWithSearch
                        options={units}
                        placeholder="Выберите единицу"
                        onChange={handleUnitChange}
                      />
                </Form.Item>
              </Col>
          </Row>
      </Card>

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

export default FactForm;
