  // Функция для выгрузки файла
import { exportData } from '../functions/exportData';

export const exportFile = (objects: any[],fileName: string) => {
  if (objects.length === 0) return; // Проверяем, есть ли данные для экспорта

  // Динамически получаем все ключи (поля) из первого объекта
  const headers = Object.keys(objects[0]);

  // Преобразуем объекты в массив массивов, используя динамические поля
  const data = objects.map(obj => headers.map(header => (obj as any)[header]));

  // Экспортируем данные, передавая динамические заголовки и данные
  exportData(data, fileName, headers);
};