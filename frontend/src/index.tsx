import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './routes'; // Импортируем маршрутизацию
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppRoutes /> {/* Используем маршрутизацию */}
  </React.StrictMode>
);

// Если хотите начать измерять производительность в приложении,
// можно передать функцию для логирования результатов.
// Узнайте больше: https://bit.ly/CRA-vitals
reportWebVitals();

