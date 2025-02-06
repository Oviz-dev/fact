import React, { useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Input, Select, InputNumber } from 'antd';
import { ApprovalStepData } from '../types';
import useUpdateNode from '../hooks/useUpdateNode'; // Импортируем хук

const { Option } = Select;

interface NodeContentProps {
  data: ApprovalStepData;
  isSelected: boolean;
  nodeId: string; // Добавляем nodeId
}

const NodeContent: React.FC<NodeContentProps> = ({ data, nodeId }) => {
  const { updateNodeData } = useUpdateNode(nodeId);
    const textRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(200); // Минимальная ширина узла

  return (
    <div ref={textRef} style={{ width: `${width}px` }} className="node-content">
      <Input
        value={data.title || ''}
        onChange={(e) => updateNodeData({ title: e.target.value })}
        placeholder="Название шага"
        style={{ marginBottom: '12px' }}
      />
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <InputNumber
          min={1}
          value={data.duration || 1}
          onChange={(value) => updateNodeData({ duration: value || 1 })}
          style={{ width: '30%' }} // 30% ширины
        />
        <span>дней</span>
      </div>
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
        nodeId={id} // Передаём nodeId
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
        nodeId={id} // Передаём nodeId
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