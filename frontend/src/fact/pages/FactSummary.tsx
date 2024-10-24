import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import moment from 'moment';
import { FactDTO } from '../DTO/FactDTO';
import { fetchFacts } from '../services/factService';
import { PnLDTO } from '../../pnl/DTO/PnLDTO';
import {formatNumber} from '../../functions/formatNumber';

const { Title } = Typography;

interface FactSummaryProps {
  facts: FactDTO[];
  pnls: { id: number; name: string; parentId: number | null }[];
}

const FactSummary: React.FC<FactSummaryProps> = ({ pnls }) => {
  const [facts, setFacts] = useState<FactDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [monthsRange, setMonthsRange] = useState<string[]>([]); // Массив для хранения всех месяцев в формате YYYY-MM

  // Функция для получения минимального и максимального месяца
  const getMonthsRange = (facts: FactDTO[]) => {
    if (facts.length === 0) return [];

    const minDate = moment.min(facts.map(fact => moment(fact.date))).startOf('month');
    const maxDate = moment.max(facts.map(fact => moment(fact.date))).startOf('month');

    const months = [];
    let currentMonth = minDate;
    while (currentMonth <= maxDate) {
      months.push(currentMonth.format('YYYY-MM'));
      currentMonth = currentMonth.add(1, 'month');
    }

    return months;
  };



//переделать на иерархию
  const calculatePnLSums = (facts: FactDTO[], pnl: PnLDTO, months: string[]) => {
    // Суммируем cost для текущей статьи PnL
    let pnlSums = months.reduce((acc, month) => {
      acc[month] = facts
        .filter(fact => fact.pnl?.id === pnl.id && moment(fact.date).format('YYYY-MM') === month)
        .reduce((sum, fact) => sum + fact.cost, 0);
      return acc;
    }, {} as Record<string, number>);

    // Если есть дочерние PnL статьи, рекурсивно добавляем их значения
    if (pnl.subPnL && pnl.subPnL.length > 0) {
      pnl.subPnL.forEach(subPnl => {
        const subPnLSums = calculatePnLSums(facts, subPnl, months);
        months.forEach(month => {
          pnlSums[month] += subPnLSums[month];  // Добавляем суммы дочерних статей
        });
      });
    }

    return pnlSums;
  };

const generateTableData = (facts: FactDTO[], pnls: PnLDTO[], months: string[]) => {
  return pnls.map(pnl => {
    const pnlSums = calculatePnLSums(facts, pnl, months);

    return {
      key: pnl.id,
      name: pnl.name,
      ...pnlSums // добавляем данные по месяцам
    };
  });
};

//переделать на иерархию




  // Сгруппировать факты по статьям и месяцам
  const groupFactsByPnlAndMonth = (facts: FactDTO[], months: string[]) => {
    const data: any[] = pnls.map(pnl => ({
      pnl: pnl.name,
      ...months.reduce((acc, month) => {
        acc[month] = facts
          .filter(fact => fact.pnl?.id === pnl.id && moment(fact.date).format('YYYY-MM') === month)
          .reduce((sum, fact) => sum + fact.cost, 0);
        return acc;
      }, {} as Record<string, number>),
    }));

    return data;
  };

  // Загрузка всех фактов
  const loadFacts = async () => {
    setLoading(true);
    try {
      const data = await fetchFacts(); // Получение всех фактов
      setFacts(data);
      const months = getMonthsRange(data);
      setMonthsRange(months);
    } catch (error) {
      console.error('Ошибка при загрузке фактов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacts();
  }, []);

  // Колонки таблицы
  const columns = [
    {
      title: 'Статья учёта',
      dataIndex: 'pnl',
      key: 'pnl',
    },
    ...monthsRange.map(month => ({
      title: moment(month, 'YYYY-MM').format('MMMM YYYY'),
      dataIndex: month,
      key: month,
      render: (value: number) => value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }),
    })),
  ];

  // Данные для таблицы
  const tableData = groupFactsByPnlAndMonth(facts, monthsRange);

  return (
    <div>
      <Title level={2}>Факт по статьям учёта</Title>
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        rowKey="pnl"
        pagination={false}
        summary={(pageData) => {
          const totalByMonth = monthsRange.reduce((acc, month) => {
            acc[month] = pageData.reduce((sum, row) => sum + (row[month] || 0), 0);
            return acc;
          }, {} as Record<string, number>);

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Итого</Table.Summary.Cell>
              {monthsRange.map((month, index) => (
                <Table.Summary.Cell key={month} index={index + 1}>
                  <Typography.Text>
                    {totalByMonth[month]?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) || '0,00 ₽'}
                  </Typography.Text>
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default FactSummary;
