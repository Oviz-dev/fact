import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import moment from 'moment';
import { FactDTO } from '../DTO/FactDTO';
import { fetchFacts } from '../services/factService';
import { PnLDTO } from '../../pnl/DTO/PnLDTO';
import { formatNumber } from '../../functions/formatNumber';

const { Title } = Typography;

interface FactSummaryProps {
  facts: FactDTO[];
  pnls: PnLDTO[];
}

const FactSummary: React.FC<FactSummaryProps> = ({ pnls }) => {
  const [facts, setFacts] = useState<FactDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [monthsRange, setMonthsRange] = useState<string[]>([]);

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

  // Рекурсивная функция для расчёта сумм с учётом иерархии
  const calculatePnLSums = (facts: FactDTO[], pnl: PnLDTO, months: string[]) => {
    let pnlSums = months.reduce((acc, month) => {
      acc[month] = facts
        .filter(fact => fact.pnl?.id === pnl.id && moment(fact.date).format('YYYY-MM') === month)
        .reduce((sum, fact) => sum + fact.cost, 0);
      return acc;
    }, {} as Record<string, number>);

    // Добавляем суммы дочерних статей
    if (pnl.subPnL && pnl.subPnL.length > 0) {
      pnl.subPnL.forEach(subPnl => {
        const subPnLSums = calculatePnLSums(facts, subPnl, months);
        months.forEach(month => {
          pnlSums[month] += subPnLSums[month];
        });
      });
    }

    return pnlSums;
  };

const generateTableData = (
  facts: FactDTO[],
  pnls: PnLDTO[],
  months: string[],
  parentId: number | null = null
): Array<{ key: number; name: string; [month: string]: number | string }> =>{
  return pnls
    .filter(pnl => pnl.parentId === parentId)
    .map(pnl => {
      const pnlSums = calculatePnLSums(facts, pnl, months);
      const row = {
        key: pnl.id,
        name: pnl.name,
        ...pnlSums,
      };
      const subRows = generateTableData(facts, pnls, months, pnl.id);
      return [row, ...subRows];
    })
    .flat();
};

  const loadFacts = async () => {
    setLoading(true);
    try {
      const data = await fetchFacts();
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
      dataIndex: 'name',
      key: 'name',
    },
    ...monthsRange.map(month => ({
      title: moment(month, 'YYYY-MM').format('MMMM YYYY'),
      dataIndex: month,
      key: month,
      render: (value: number) => formatNumber(value),
    })),
  ];

  // Данные для таблицы с учётом иерархии
  const tableData = generateTableData(facts, pnls, monthsRange);

  return (
    <div>
      <Title level={2}>Факт по статьям учёта</Title>
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        rowKey="key"
        pagination={false}
        summary={pageData => {
          const totalByMonth = monthsRange.reduce((acc, month) => {
            acc[month] = pageData.reduce((sum, row) => sum + (Number(row[month as keyof typeof row]) || 0), 0);
            return acc;
          }, {} as Record<string, number>);

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Итого</Table.Summary.Cell>
              {monthsRange.map((month, index) => (
                <Table.Summary.Cell key={month} index={index + 1}>
                  <Typography.Text>
                    {formatNumber(totalByMonth[month])}
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
