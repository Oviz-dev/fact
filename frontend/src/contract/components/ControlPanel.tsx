// components/ControlPanel.tsx
import React from 'react';
import { Button, Space,Tooltip, Upload} from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

interface ControlPanelProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onExport, onImport }) => {
  // Функция обработки импорта
  const handleImport = (file: File) => {
    onImport(file);
    return false; // Предотвращаем автоматическую загрузку файла
  };
  return (
    <Space style={{ margin: '5px 0' }}>
      <Tooltip title="Выгрузить">
      <Button onClick={onExport} icon={<DownloadOutlined />} style={{ marginRight: 5 }}/>
      </Tooltip>
      <Tooltip title="Загрузить">
        <Upload
          accept=".csv"
          showUploadList={false} // Скрыть список загруженных файлов
          beforeUpload={handleImport}
        >
            <Button icon={<UploadOutlined />} style={{ marginRight: 5 }}/>
        </Upload>
      </Tooltip>
    </Space>
  );
};

export default ControlPanel;
