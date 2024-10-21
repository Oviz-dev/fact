import React from 'react';
import { Button, Space, Tooltip, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

export interface ControlButton {
  label?: string;
  danger?: boolean;
  onClick?: () => void | Promise<void>;  // Учитываем возможность Promise
  icon?: React.ReactNode;
  tooltip?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';  // Тип кнопки
  upload?: boolean;
  importHandler?: (file: File) => void;
}

interface ControlPanelProps {
  buttons: ControlButton[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({ buttons }) => {
  return (
    <Space style={{ margin: '0 10px 10px'  }}>
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          {button.upload ? (
            <Tooltip title={button.tooltip}>
              <Upload
                accept=".csv"
                showUploadList={false}
                beforeUpload={(file) => {
                  if (button.importHandler) {
                    button.importHandler(file);
                  }
                  return false;
                }}
              >
                <Button icon={button.icon} type={button.type || 'default'} style={{ marginRight: 5 }}>
                  {button.label}
                </Button>
              </Upload>
            </Tooltip>
          ) : (
            <Tooltip title={button.tooltip}>
              <Button danger={button.danger} onClick={button.onClick} icon={button.icon} type={button.type || 'default'} style={{ marginRight: 5 }}>
                {button.label}
              </Button>
            </Tooltip>
          )}
        </React.Fragment>
      ))}
    </Space>
  );
};

export default ControlPanel;
