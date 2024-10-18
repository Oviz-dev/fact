export const formatNumber = (value: number | null | undefined) => {
    return value != null ? new Intl.NumberFormat('ru-RU').format(value) : '';
};