import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ControlButton} from '../components/ControlPanel'; // предполагаем, что у вас есть тип ControlButton

interface ShortTableButtonsProps {
  onCreate: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
}

export const ShortTableButtons = ({ onCreate, onDelete }: ShortTableButtonsProps): ControlButton[] => {
  return [
    {
      //label: 'Создать',
      onClick: onCreate,
      icon: <PlusOutlined />,
      tooltip: 'Создать',
      type: 'primary',
    },
    {
      //label: 'Удалить',
      danger: true,
      onClick: onDelete,
      icon: <DeleteOutlined />,
      tooltip: 'Удалить',
      type: 'default',
    },
  ];
};
