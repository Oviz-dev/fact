export const exportData = (data: any[], filename: string, headers: string[]) => {
  // Формируем CSV-контент
  const csvContent = [
    headers.join(','), // Добавляем заголовки
    ...data.map(row => row.join(',')) // Преобразуем данные в строки CSV
  ].join('\n');

  // Создаём Blob для CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Создаём временный элемент <a> для скачивания файла
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
