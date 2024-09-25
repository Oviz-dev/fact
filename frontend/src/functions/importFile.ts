import axios from 'axios';
import {  message } from 'antd';

export const importFile = async (file: File, entityType: string, refreshList?: () => void) => {
  const formData = new FormData();
  formData.append('file', file); // Добавляем файл
  try {
    const response = await axios.post(`/api/import/${entityType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Импорт успешно завершен:', response.data);
    message.success('Импорт успешно завершен');
     if (refreshList) {
         refreshList(); // Обновляем список, если функция передана
     }
  } catch (error:any) {
    console.error('Ошибка импорта:', error.response?.data || error.message);
    message.error('Ошибка импорта');
  }

};