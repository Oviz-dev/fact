import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий маршрут
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  useEffect(() => {
    // Обновляем выбранный элемент меню при изменении маршрута
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <AntHeader>
      <Menu
        //theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]} // Устанавливаем текущий выбранный элемент
        onClick={handleMenuClick}
      >
        <Menu.Item key="/">Главная</Menu.Item>
        <Menu.Item key="/objects">Объекты</Menu.Item>
        <Menu.Item key="/contracts">Договора</Menu.Item>
        <Menu.Item key="/facts">Приёмка факта</Menu.Item>
        <Menu.Item key="/pnl">Статьи учёта</Menu.Item>
        <Menu.Item key="/units">Е.И.</Menu.Item>
      </Menu>
    </AntHeader>
  );
};

export default Header;
