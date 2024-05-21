import React from 'react';
import { Handle } from 'reactflow';

const ColdEmailNode = ({ data }) => (
  <div style={styles.container}>
    <Handle type="target" position="top" style={styles.handle} />
    <label>Cold Email</label>
  </div>
);

const styles = {
  container: {
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  handle: {
    background: '#555'
  }
};

export default ColdEmailNode;
