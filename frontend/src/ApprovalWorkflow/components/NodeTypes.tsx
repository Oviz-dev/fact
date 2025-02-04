import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Input, Select } from 'antd';
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

  return (
    <div className="node-content">
      <Input
        value={data.title || ''}
        onChange={(e) => updateNodeData({ title: e.target.value })}
        placeholder="Название шага"
      />
      <Select
        value={data.responsible || undefined}
        onChange={(value) => updateNodeData({ responsible: value })}
        placeholder="Выберите ответственного"
        style={{ width: '100%' }}
      >
        {data.users?.map(user => (
          <Select.Option key={user.id} value={user.id}>
            {user.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};


const nodeTypes = {
  sequential: ({ data, selected, id }: NodeProps<ApprovalStepData>) => (
    <div className={`node sequential-node ${selected ? 'selected' : ''}`}>
      <NodeContent
        data={data}
        isSelected={selected}
        nodeId={id} // Передаём nodeId
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  ),

  parallel: ({ data, selected, id }: NodeProps<ApprovalStepData>) => (
    <div className={`node parallel-node ${selected ? 'selected' : ''}`}>
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
          width: '8px',
          height: '8px'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          top: '70%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px'
        }}
      />
    </div>
  )
};

export default nodeTypes;