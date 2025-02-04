import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Input, Select } from 'antd';
import { ApprovalStepData } from '../types';
import useUpdateNode from '../hooks/useUpdateNode'; // Импортируем хук

const { Option } = Select;

interface NodeContentProps {
  data: ApprovalStepData;
  isSelected: boolean;
  onDataChange: (newData: Partial<ApprovalStepData>) => void;
}

const NodeContent: React.FC<NodeContentProps> = ({ data, isSelected, onDataChange }) => {
  return (
    <div className="node-content">
      <Input
        value={data.title}
        onChange={(e) => onDataChange({ title: e.target.value })}
        placeholder="Название шага"
        style={{ marginBottom: 8 }}
      />

      <Select
        value={data.responsible}
        onChange={(value) => onDataChange({ responsible: value })}
        placeholder="Выберите ответственного"
        style={{ width: '100%' }}
      >
        {data.users?.map(user => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

const SequentialNode: React.FC<NodeProps<ApprovalStepData>> = ({ data, selected, id }) => {
  const { updateNodeData } = useUpdateNode(id);

  return (
    <div className={`node sequential-node ${selected ? 'selected' : ''}`}>
      <NodeContent
        data={data}
        isSelected={selected}
        onDataChange={updateNodeData}
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
  );
};

const ParallelNode: React.FC<NodeProps<ApprovalStepData>> = ({ data, selected, id }) => {
  const { updateNodeData } = useUpdateNode(id);

  return (
    <div className={`node parallel-node ${selected ? 'selected' : ''}`}>
      <NodeContent
        data={data}
        isSelected={selected}
        onDataChange={updateNodeData}
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
  );
};

const nodeTypes = {
  sequential: SequentialNode,
  parallel: ParallelNode,
};


export default nodeTypes;