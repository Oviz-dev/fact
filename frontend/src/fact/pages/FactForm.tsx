import { CheckOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, Row, Col, Card, message } from 'antd';
import { FactDTO } from '../DTO/FactDTO';
import DropdownWithSearch from '../../components/DropdownWithSearch';
import HierarchicalDropdown from '../../components/HierarchicalDropdown';
import moment from 'moment';
import axios from 'axios';
import {updateFactAccept} from '../services/factService';

const { Option } = Select;
const API_URL = 'http://localhost:8080/api/facts';

interface FactFormProps {
  onSubmit: (FactData: FactDTO) => void;
  initialValues?: FactDTO | null;
  isEditing?: boolean;
  contracts: { id: number; name: string; contractor?: string }[];
  units: { id: number; name: string }[];
  objects: { id: number; name: string }[];
  pnls: { id: number; name: string; parentId: number | null }[];
}

const FactForm: React.FC<FactFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false,
  contracts,
  units,
  objects,
  pnls
}) => {
  const [form] = Form.useForm();

  const [accepted, setAccepted] = useState<boolean>(() => {
    return initialValues?.accepted || false;
  });

  const [selectedContractId, setSelectedContractId] = useState<number | undefined>(undefined);
  const [selectedContractor, setSelectedContractor] = useState<string | undefined>(undefined);
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(undefined);
  const [selectedObjectId, setSelectedObjectId] = useState<number | undefined>(undefined);
  const [selectedPnlId, setSelectedPnlId] = useState<number | undefined>(undefined);
  const [contractor, setContractor] = useState<string | undefined>(undefined);

    const toggleAcceptance = async () => {
      if (!initialValues) return;
      try {
        await updateFactAccept(initialValues.id, !accepted);
        setAccepted(!accepted);
      } catch (error) {
        message.error('Ошибка при обновлении состояния');
      }
    };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        accepted: initialValues.accepted,
        contract: initialValues.contract?.id || undefined,
        //contractor: initialValues.contract?.contractor || undefined,
        unit: initialValues.unit?.id || undefined,
        object: initialValues.object?.id || undefined,
        pnl: initialValues.pnl?.id || undefined,
        date: initialValues.date ? moment(initialValues.date, 'YYYY-MM-DD') : null,
      });
      setSelectedContractId(initialValues.contract?.id || undefined);
      //setSelectedContractor(initialValues.contract?.contractor || undefined);
      setSelectedUnitId(initialValues.unit?.id || undefined);
      setSelectedObjectId(initialValues.object?.id || undefined);
      setSelectedPnlId(initialValues.pnl?.id || undefined);
      setAccepted(initialValues.accepted || false);

      const initialContract = contracts.find(contract => contract.id === initialValues.contract?.id);
      if (initialContract) {
        setContractor(initialContract.contractor);
      }
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (selectedContractId) {
      const selectedContract = contracts.find(contract => contract.id === selectedContractId);
      setContractor(selectedContract?.contractor);
    } else {
      setContractor(undefined);
    }
  }, [selectedContractId, contracts]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const factData: FactDTO = {
        ...values,
        id: initialValues?.id,
        cost: values.cost ? Number(values.cost) : 0,
        actualVAT: values.actualVAT ? Number(values.actualVAT) : 0,
        amount: values.amount ? Number(values.amount) : 0,
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
        contract: contracts.find(contract => contract.id === selectedContractId) || undefined,
        unit: units.find(unit => unit.id === selectedUnitId) || undefined,
        object: objects.find(object => object.id === selectedObjectId) || undefined,
        pnl: pnls.find(pnl => pnl.id === selectedPnlId) || undefined,
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
    const selectedContract = contracts.find(contract => contract.id === contractId);
    setSelectedContractor(selectedContract?.contractor);
  };

  const handleUnitChange = (unitId: number) => {
    setSelectedUnitId(unitId);
  };

  const handleObjectChange = (objectId: number) => {
    setSelectedObjectId(objectId);
  };

  const handlePnlChange = (pnlId: number) => {
    setSelectedPnlId(pnlId);
  };

  const isFieldDisabled = () => accepted;

  return (
    <Form form={form} layout="horizontal" onFinish={handleSubmit}>
      <Card
        title="Общая информация"
        style={{ marginBottom: 10 }}
        headStyle={{ backgroundColor: '#d9ffe0', color: '#1c6900' }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Наименование"
              name="name"
              style={{ marginBottom: 10, width: '625px' }}
              rules={[{ required: true, message: 'Введите наименование ' }]}
            >
              <Input
                placeholder="Введите наименование"
                style={{ marginBottom: 10, width: '500px' }}
                disabled={isFieldDisabled()}
              />
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
                value={selectedContractId}
                placeholder="Выберите договор"
                onChange={handleContractChange}
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
        </Row>
        {contractor && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Подрядчик">
                <Input
                  value={selectedContractor}
                  disabled
                  style={{ width: '500px' }}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Объект"
              name="object"
              rules={[{ required: true, message: 'Выберите объект' }]}
            >
              <DropdownWithSearch
                options={objects}
                value={selectedObjectId}
                placeholder="Выберите объект"
                onChange={handleObjectChange}
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Статья учёта"
              name="pnl"
              rules={[{ required: true, message: 'Выберите статью' }]}
            >
              <DropdownWithSearch
                options={pnls}
                value={selectedPnlId}
                placeholder="Выберите статью"
                onChange={handlePnlChange}
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="№"
              name="factNumber"
              style={{ marginBottom: 10, width: '245px' }}
              rules={[{ required: true, message: 'Введите номер' }]}
            >
              <Input
                placeholder="Введите номер"
                style={{ marginBottom: 10, width: '150px' }}
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Дата "
              name="date"
              style={{ marginBottom: 10, float: 'right' }}
              rules={[{ required: true, message: 'Выберите дату ' }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                value={initialValues?.date ? moment(initialValues.date, 'YYYY-MM-DD') : null}
                style={{ marginBottom: 10, width: '150px', float: 'right' }}
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card
        title="Фактические показатели"
        style={{ marginBottom: 10 }}
        headStyle={{ backgroundColor: '#ffe8d9', color: '#000' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Сумма, руб. без НДС"
              name="cost"
              rules={[{ required: true, message: 'Внесите стоимость' }]}
              style={{ float: 'right' }}
            >
              <InputNumber
                min={0}
                style={{ width: '150px' }}
                placeholder="Введите стоимость без НДС"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="НДС, руб."
              name="actualVAT"
              rules={[{ required: false }]}
              style={{ float: 'right' }}
            >
              <InputNumber
                min={0}
                style={{ width: '150px' }}
                placeholder="Введите НДС"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
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
                disabled={isFieldDisabled()}
              />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              label=""
              name="unit"
              rules={[{ required: true, message: 'Выберите единицу' }]}
            >
              <DropdownWithSearch
                options={units}
                placeholder="Выберите единицу"
                onChange={handleUnitChange}
                disabled={isFieldDisabled()}
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
        disabled={isFieldDisabled()}
      >
        {isEditing ? 'Сохранить' : 'Создать'}
      </Button>

      <Button
        type="default"
        onClick={toggleAcceptance}
        style={{ marginTop: 20, marginLeft: 10 }}
      >
        {accepted ? 'Отменить' : 'Принять'}
      </Button>
    </Form>
  );
};

export default FactForm;