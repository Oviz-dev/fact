import { PlusOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { ControlButton } from '../components/ControlPanel';
import { importFile } from '../functions/importFile';

interface ShortTableButtonsProps {
  onCreate: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
}

interface FullTableButtonsProps {
  onCreate: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  onExport: () => Promise<void> | void;
  onImport: (file: File) => void;
}

export const ShortTableButtons = ({ onCreate, onDelete }: ShortTableButtonsProps): ControlButton[] => {
  return [
    {
      onClick: onCreate,
      icon: <PlusOutlined />,
      tooltip: 'Создать',
      type: 'primary',
    },
    {
      danger: true,
      onClick: onDelete,
      icon: <DeleteOutlined />,
      tooltip: 'Удалить',
      type: 'default',
    },
  ];
};

export const FullTableButtons = ({ onCreate, onDelete, onExport, onImport }: FullTableButtonsProps): ControlButton[] => {
  return [
    {
      onClick: onCreate,
      icon: <PlusOutlined />,
      tooltip: 'Создать',
      type: 'primary',
    },
    {
      danger: true,
      onClick: onDelete,
      icon: <DeleteOutlined />,
      tooltip: 'Удалить',
      type: 'default',
    },
    {
      onClick: onExport,
      icon: <DownloadOutlined />,
      tooltip: 'Выгрузить',
    },
    {
      icon: <UploadOutlined />,
      tooltip: 'Загрузить',
      upload: true,
      importHandler: onImport, // Используем importHandler для загрузки файлов
    },
  ];
};
