//FactForm
import { CheckOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Row, Col, Card,  message } from 'antd';
import { FactDTO} from '../DTO/FactDTO';

import moment from 'moment';
const { Option } = Select;
interface FactFormProps {
  onSubmit: (FactData: FactDTO) => void;
  initialValues?: FactDTO | null;
  isEditing?: boolean;
}

const FactForm: React.FC<FactFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
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
                  rules={[{ required: true, message: 'Введите наименование ' }]}
                >
                  <Input placeholder="Введите наименование " style={{ marginBottom: 10, width: '500px' }}/>
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                  label="Номер "
                  name="factNumber"
                  style={{ marginBottom: 10, width: '245px', float: 'right' }}
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
              <Col span={12}>
                <Form.Item
                  label="Выполнение, руб. без НДС "
                  name="cost"
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
