// components/ControlPanel.tsx
import React from 'react';
import { Button, Space,Tooltip } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

const ControlPanel: React.FC = () => {
  const handleExport = () => {
    // Логика для выгрузки
    console.log('Выгрузка данных');
  };

  const handleImport = () => {
    // Логика для загрузки
    console.log('Загрузка данных');
  };

  return (
    <Space style={{ margin: '5px 0' }}>
      <Tooltip title="Выгрузить">
      <Button onClick={handleExport} icon={<DownloadOutlined />} style={{ marginRight: 5 }}/>
      </Tooltip>
      <Tooltip title="Загрузить">
      <Button onClick={handleImport} icon={<UploadOutlined />} style={{ marginRight: 5 }}/>
      </Tooltip>
    </Space>
  );
};

export default ControlPanel;
