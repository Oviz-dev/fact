// components/ControlPanel.tsx
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const ControlPanel = () => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Link to="/facts">
        <Button type="primary">Приёмка факта</Button>
      </Link>
      <Link to="/objects">
        <Button>Объекты</Button>
      </Link>
      {/* Добавляем кнопки для других сущностей */}
    </div>
  );
};

export default ControlPanel;
