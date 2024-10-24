export const formatNumber = (value: number | null | undefined) => {
  return value != null
    ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value)
    : '';
}



