import React from 'react';
import { Handle } from 'reactflow';

const LeadSourceNode = ({ data }) => (
  <div style={styles.container}>
    <strong>{data.label}</strong>
    <Handle type="source" position="bottom" style={styles.handle} />
  </div>
);

const styles = {
  container: {
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  handle: {
    background: '#555',
  },
};

export default LeadSourceNode;
