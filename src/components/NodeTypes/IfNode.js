import React from 'react';
import { Handle, Position } from 'reactflow';

const IfNode = ({ data }) => {
  return (
    <div className="if-node">
      <div>{data.label || 'If Email Opened'}</div>
      <Handle type="source" position={Position.Bottom} id="opened" style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="notOpened" style={{ left: '75%' }} />
    </div>
  );
};

export default IfNode;
