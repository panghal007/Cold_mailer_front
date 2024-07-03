import React from 'react';
import { Handle, Position } from 'reactflow';

const ElseNode = ({ data }) => {
  return (
    <div className="else-node">
      <div>{data.label || 'Else'}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ElseNode;
