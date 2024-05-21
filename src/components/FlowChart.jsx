import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import ColdEmailNode from './NodeTypes/ColdEmailNode';
import WaitDelayNode from './NodeTypes/WaitDelayNode';
import LeadSourceNode from './NodeTypes/LeadSourceNode';
import 'reactflow/dist/style.css';
import './FlowChart.css';

const initialNodes = [
  {
    id: '1',
    type: 'leadSourceNode',
    data: { label: 'Lead Source' },
    position: { x: 250, y: 5 },
  },
];

const nodeTypes = {
  coldEmailNode: ColdEmailNode,
  waitDelayNode: WaitDelayNode,
  leadSourceNode: LeadSourceNode,
};

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [emailStatus, setEmailStatus] = useState([]);
  const [currentEmailId, setCurrentEmailId] = useState(null);
  const [menu, setMenu] = useState(null);
  const reactFlowWrapper = useRef(null);
  const navigate = useNavigate();

  const fetchEmailStatus = useCallback(async () => {
    try {
      const response = await fetch('https://cold-mailer-back.onrender.com/api/emails');
      const data = await response.json();
      setEmailStatus(data);
    } catch (error) {
      console.error('Error fetching email status:', error);
    }
  }, []);

  useEffect(() => {
    fetchEmailStatus();
    const interval = setInterval(fetchEmailStatus, 60000); // Fetch status every 60 seconds
    return () => clearInterval(interval);
  }, [fetchEmailStatus]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((rfi) => setReactFlowInstance(rfi), []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data: {
          label: `${type} node`,
          delay: type === 'waitDelayNode' ? 5 : undefined, // Default delay for demonstration
          onChange: (id, newDelay) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, delay: newDelay } } : node
              )
            );
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      const rect = reactFlowWrapper.current.getBoundingClientRect();
      setMenu({
        top: event.clientY - rect.top,
        left: event.clientX - rect.left,
        nodeId: node.id,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const saveFlowchart = async () => {
    if (!reactFlowInstance) return;

    try {
      setSaving(true);
      const flowchartData = reactFlowInstance.toObject();
      let currentEmailId = null;

      // Schedule emails based on the flowchart data
      for (const node of flowchartData.nodes) {
        if (node.type === 'waitDelayNode') {
          const response = await fetch('https://cold-mailer-back.onrender.com/api/schedule', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: '20ucc125@lnmiit.ac.in',
              subject: 'Scheduled Test Email',
              body: 'This is a scheduled email based on the flowchart.',
              delay: node.data.delay || 0, // Default to 0 if no delay
            }),
          });
          const data = await response.json();
          currentEmailId = data.emailId; // assuming the response contains the scheduled email's ID
          console.log(currentEmailId);
        }
      }

      // Store the current email ID in local state or context
      setCurrentEmailId(currentEmailId);
      alert('Flowchart saved and emails scheduled successfully!');
      
      // Fetch email status after saving the flowchart
      fetchEmailStatus();
    } catch (error) {
      console.error('Error saving flowchart:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="dndflow">
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
          {menu && (
            <div
              className="context-menu"
              style={{ top: menu.top, left: menu.left }}
            >
              <button
                onClick={() => setNodes((nds) => nds.filter((node) => node.id !== menu.nodeId))}
              >
                Delete Node
              </button>
            </div>
          )}
          <button className="save-button" onClick={saveFlowchart} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Flowchart'}
          </button>
        </div>
        <aside className="sidebar">
          <div className="description">Drag these nodes to the panel on the right:</div>
          <div
            className="dndnode"
            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'coldEmailNode')}
            draggable
          >
            Cold Email Node
          </div>
          <div
            className="dndnode"
            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'waitDelayNode')}
            draggable
          >
            Wait Delay Node
          </div>
          <div
            className="dndnode"
            onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'leadSourceNode')}
            draggable
          >
            Lead Source Node
          </div>
          <div className="email-status">
            <h3>Email Status</h3>
            <ul>
              {emailStatus
                .filter((email) => email._id === currentEmailId) // assuming the unique identifier is _id
                .map((email) => (
                  <li key={email._id}>
                    <strong>{email.subject}</strong> - {email.status}
                  </li>
                ))}
            </ul>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </aside>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;
