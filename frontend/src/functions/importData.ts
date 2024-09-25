export const importData = async (
  file: File,
  importFunction: (data: any[]) => Promise<void>,
  refreshFunction?: () => void
) => {
  const reader = new FileReader();

  reader.onload = async (e) => {
    const csvData = e.target?.result as string;

    // Разбиваем строки и колонки CSV
    const rows = csvData.split('\n').map(row => row.split(','));

    // Преобразуем строки в массив объектов
    const importedData = rows.map(row => ({
      name: row[1], // вторая колонка — это имя
      // можно добавить другие поля по необходимости
    }));

    try {
      await importFunction(importedData); // Вызываем функцию для сохранения данных
      if (refreshFunction) {
        refreshFunction(); // Обновляем список, если функция передана
      }
    } catch (error) {
      console.error('Ошибка импорта данных:', error);
    }
  };

  reader.readAsText(file); // Читаем файл как текст
};
