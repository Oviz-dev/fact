import React, { useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Input, Select, InputNumber, Button, Tag, Tooltip } from 'antd';
import { ApprovalStepData,  ProcessMode} from '../types';
import useUpdateNode from '../hooks/useUpdateNode';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';



const { Option } = Select;

interface NodeContentProps {
  data: ApprovalStepData;
  isSelected: boolean;
  nodeId: string;
  onCompleteStep?: (nodeId: string) => void;
  onCancelStep?: (nodeId: string) => void;
}

const NodeContent: React.FC<NodeContentProps> = ({ data, nodeId, onCompleteStep, onCancelStep }) => {
  const { updateNodeData } = useUpdateNode(nodeId);
  const textRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(200); // Минимальная ширина узла

  const handleCompleteStep = () => {
    updateNodeData({ status: 'completed' });
    onCompleteStep?.(nodeId); // Вызываем колбэк завершения шага
    //console.log(`Вызываем onCompleteStep для узла ${nodeId}`); // Для отладки
  };

  const handleCanceleStep = () => {
    updateNodeData({ status: 'canceled' });
    onCancelStep?.(nodeId); // Вызываем колбэк отмены шага
    //console.log(`Вызываем onCancelStep для узла ${nodeId}`); // Для отладки
  };



  return (
    <div ref={textRef} style={{ width: `${width}px` }} className="node-content">
      {/* Поле названия шага */}
      <Input
        value={data.title || ''}
        onChange={(e) => updateNodeData({ title: e.target.value })}
        placeholder="Название шага"
        style={{ marginBottom: '12px' }}
      />

      {/* Поле выбора ответственного */}
      <Select
        value={data.responsible || undefined}
        onChange={(value) => updateNodeData({ responsible: value })}
        placeholder="Выберите ответственного"
        style={{ width: '100%', marginBottom: '12px' }}
      >
        {data.users?.map(user => (
          <Select.Option key={user.id} value={user.id}>
            {user.name}
          </Select.Option>
        ))}
      </Select>

      {/* Поле длительности */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <InputNumber
          min={1}
          value={data.duration || 1}
          onChange={(value) => updateNodeData({ duration: value || 1 })}
          style={{ width: '30%' }} // 30% ширины
        />
        <span>дней</span>
      </div>

      {data.status && (
        <div className="step-status">
          <Tag
            key={data.status}
            color={
                data.status === 'pending' ? 'default' :
                data.status === 'in-progress' ? 'blue' :
                data.status === 'canceled' ? 'red' :
                'green'
            }
          >
            {data.status === 'pending' && 'Ожидает'}
            {data.status === 'in-progress' && 'В работе'}
            {data.status === 'completed' && 'Завершен'}
            {data.status === 'canceled' && 'Отменён'}
          </Tag>
          {data.status === 'in-progress' && (
              <>
        <Tooltip title="Завершить">
          <Button
            size="small"
            onClick={handleCompleteStep}
            style={{ marginLeft: 8, color: 'green', borderColor: 'green' }}
            icon={<CheckOutlined />}
          />
        </Tooltip>
        <Tooltip title="Отменить">
          <Button
            size="small"
            onClick={handleCanceleStep}
            style={{ marginLeft: 8, color: 'red', borderColor: 'red' }}
            icon={<CloseOutlined />}
          />
        </Tooltip>
            </>
          )}
        </div>
      )}


    </div>
  );
};

const nodeTypes = {
  sequential: ({ data, selected, id }: NodeProps<ApprovalStepData>) => (
    <div
        className={`node sequential-node ${selected ? 'selected' : ''}`}
        style={{ width: '100%' }}
    >
      <NodeContent
        data={data}
        isSelected={selected}
        nodeId={id}
        onCompleteStep= {(nodeId) => console.log(`Шаг ${nodeId} завершен`)}
        onCancelStep= {(nodeId) => console.log(`Шаг ${nodeId} отменён`)}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px'
        }}
      />
    </div>
  ),

  parallel: ({ data, selected, id }: NodeProps<ApprovalStepData>) => (
    <div
        className={`node parallel-node ${selected ? 'selected' : ''}`}
        style={{ width: '100%' }}
    >
      <NodeContent
        data={data}
        isSelected={selected}
        nodeId={id}
        onCompleteStep={(nodeId) => console.log(`Шаг ${nodeId} завершен`)}
        onCancelStep= {(nodeId) => console.log(`Шаг ${nodeId} отменён`)}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: '30%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          top: '70%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px'
        }}
      />
    </div>
  )
};

export default nodeTypes;