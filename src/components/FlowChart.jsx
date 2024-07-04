import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Panel,
  useReactFlow,

} from 'reactflow';
import {
  Box,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  StepIcon,
  StepNumber,
  useToast,
  Button,
  Select,
  VStack,
  HStack,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import styled from 'styled-components';
import Joyride from 'react-joyride';

import ColdEmailNode from './NodeTypes/ColdEmailNode';
import WaitDelayNode from './NodeTypes/WaitDelayNode';
import LeadSourceNode from './NodeTypes/LeadSourceNode';
import Navbar from './Navbar';
import TemplateModal from './TemplateModal';
import UserDetailsModal from './UserDetailsModal'; 
import { useThemeContext } from './ThemeContext';
import 'reactflow/dist/style.css';
import './FlowChart.css';

const initialNodes = [
  {
    id: '1',
    type: 'leadSourceNode',
    data: { label: 'Lead Source' },
    position: { x: 0.5, y: 0.01 },
  },
];

const nodeTypes = {
  coldEmailNode: ColdEmailNode,
  waitDelayNode: WaitDelayNode,
  leadSourceNode: LeadSourceNode,
};

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => (props.colorMode === 'light' ? 'white' : '#1a202c')};
`;

const MiniMapLight = styled(MiniMap)`
  background-color: #ffffff;

  .react-flow__minimap-mask {
    fill: #f4f4f4;
  }

  .react-flow__minimap-node {
    fill: #6e6e6e;
    stroke: none;
  }
`;

const MiniMapDark = styled(MiniMap)`
  background-color: #1a202c;

  .react-flow__minimap-mask {
    fill:6e6e6e;
  }

  .react-flow__minimap-node {
    fill: #6e6e6e;
    stroke: none;
  }
`;

const ControlsLight = styled(Controls)`
  button {
    background-color: white;
    color: black;
    border-bottom: 1px solid white;

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

const ControlsDark = styled(Controls)`
  button {
    background-color: #1a202c;
    color: white;
    border-bottom: 1px solid #1a202c;

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

const FlowChart = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [emailStatus, setEmailStatus] = useState([]);
  const [currentEmailId, setCurrentEmailId] = useState(null);
  const [menu, setMenu] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setLoading] = useState(true); // Loading state for fetching user profile
  const [userDetailsComplete, setUserDetailsComplete] = useState(false);
  const reactFlowWrapper = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { lightTheme, darkTheme } = useThemeContext();
  const { colorMode, toggleTheme } = useColorMode();
  const steps = [
    { title: "Scheduled", description: "Email is scheduled" },
    { title: "Sent", description: "Email has been sent" },
    { title: "Opened", description: "Email has been opened" },
  ];
  const { setViewport } = useReactFlow();

  const fetchEmailStatus = useCallback(async () => {
    try {
      const response = await fetch("https://cold-mailer-back.onrender.com/api/emails");
      const data = await response.json();
      setEmailStatus(data);
    } catch (error) {
      console.error("Error fetching email status:", error);
    }
  }, []);
 
  useEffect(() => {
    fetchEmailStatus();
    const interval = setInterval(fetchEmailStatus, 60000);
    const savedFlowchart = localStorage.getItem("flowchart");
    if (savedFlowchart) {
      const flowchartData = JSON.parse(savedFlowchart);
      setNodes(flowchartData.nodes || []);
      setEdges(flowchartData.edges || []);
      if (reactFlowInstance) {
        reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1.2 });
      }
    }
    const savedEmailId = localStorage.getItem("currentEmailId");
    if (savedEmailId) {
      setCurrentEmailId(savedEmailId);
    }
    const savedTemplate = localStorage.getItem("selectedTemplate");
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
    const savedActiveStep = localStorage.getItem("activeStep");
    if (savedActiveStep) {
      setActiveStep(parseInt(savedActiveStep, 10));
    }
    return () => clearInterval(interval);
  }, [fetchEmailStatus]);

  const fetchTemplates = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }
      const response = await axios.get(`https://cold-mailer-back.onrender.com/api/templates/${userId}`);
      const data = response.data;
      console.log(data);
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  }, []);
  const fetchUserProfile = useCallback(async () => {
    const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      const response = await axios.get(
        `https://cold-mailer-back.onrender.com/api/profile/${userId}`
      );
      if (response.status !== 200) {
        throw new Error("User profile fetch failed");
      }
      const data = response.data;
      if (data.emailFrom && data.emailPass) {
        // User has provided email details
        setUserDetailsComplete(true);
        setShowDetailsModal(false); // Close modal if open
      } else {
        // User details incomplete, show modal
        setUserDetailsComplete(false);
        // setShowDetailsModal(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchTemplates();
  }, [fetchUserProfile, fetchTemplates]);

  useEffect(() => {
    if (currentEmailId) {
      const currentEmail = emailStatus.find(
        (email) => email._id === currentEmailId
      );
      if (currentEmail) {
        const newStep = getActiveStep(currentEmail.status);
        setActiveStep(newStep);
        localStorage.setItem("activeStep", newStep.toString());
      }
    }
  }, [currentEmailId, emailStatus]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((rfi) => {
    setReactFlowInstance(rfi);
    rfi.setViewport({ x: 580, y: 150, zoom: 0.8 });
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
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
          delay: type === "waitDelayNode" ? 5 : undefined,
          onChange: (id, newDelay) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === id
                  ? { ...node, data: { ...node.data, delay: newDelay } }
                  : node
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
    event.dataTransfer.dropEffect = "move";
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

  const saveFlowchart = async () => {
    if (!reactFlowInstance) return;

    try {
      setSaving(true);

      const flowchartData = reactFlowInstance.toObject();
      localStorage.setItem("flowchart", JSON.stringify(flowchartData));
      let currentEmailId = null;

      for (const node of flowchartData.nodes) {
        if (node.type === "waitDelayNode") {
          const response = await fetch("https://cold-mailer-back.onrender.com/api/schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: "panghalunique@gmail.com",
              subject: "Scheduled Test Email",
              body: "This is a scheduled email based on the flowchart.",
              delay: node.data.delay || 0,
              templateId: selectedTemplate,
              userId: localStorage.getItem("userId"),
            }),
          });
          const data = await response.json();
          currentEmailId = data.emailId;
        }
      }

      setCurrentEmailId(currentEmailId);
      localStorage.setItem("currentEmailId", currentEmailId);
      toast({
        title: "Flowchart saved",
        description: "Flowchart saved and emails scheduled successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
        colorScheme: "teal",
      });

      fetchEmailStatus();
    } catch (error) {
      console.error("Error saving flowchart:", error);
      toast({
        title: "Error",
        description: "There was an error saving the flowchart.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSaving(false);
    }
  };
  const handleModalClose = () => {
    setShowDetailsModal(false);
  };

  const getActiveStep = (status) => {
    if (status === "opened") {
      return 3;
    } else if (status === "sent") {
      return 2;
    } else if (status === "scheduled") {
      return 1;
    } else {
      return 0;
    }
  };

  const currentEmail = emailStatus.find(
    (email) => email._id === currentEmailId
  );



  const handleStepperChange = (newStep) => {
    setActiveStep(newStep);
    localStorage.setItem("activeStep", newStep.toString());
  };
 

  const currentTheme = colorMode === "light" ? lightTheme : darkTheme;
  const MiniMapComponent = colorMode === "light" ? MiniMapLight : MiniMapDark;
  const ControlsComponent =
    colorMode === "light" ? ControlsLight : ControlsDark;


  const[{run,tourSteps},setState]=useState({

       run : true,
       tourSteps : [
        {
          target: ".reactflow-wrapper",
          disableBeacon: true,
          content: "This is where you can create and visualize your flowchart.",
        },
        {
          target: ".dndnode",
          disableBeacon: true,
          content: "Drag and drop nodes from here to the flowchart area.",
        },
        {
          target: ".modal",
          disableBeacon: true,
          content: "Create a template for your email.",
        },
        {
          target: ".sidebar select",
          disableBeacon: true,
          content: "Select a template for your email.",
        },
        {
          target: ".save-button",
          disableBeacon: true,
          content: "Add details and save your flowchart.",
        },
    
        // {
        //   target: '.chakra-stepper',
        //   content: 'Track the status of your scheduled emails here.',
        // },
      ]
  });


  return (
    <ReactFlowProvider>
      <Navbar />
      <Joyride
      
        run={run}
        steps={tourSteps}
        showbeacon={false}
        hideCloseButton
        showSkipButton
        scrollToFirstStep
        showProgress
        continuous
        styles={{
          options: {
            arrowColor: colorMode === "light" ? "#000" : "#fff",
            backgroundColor: colorMode === "light" ? "#fff" : "#171923",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            primaryColor: colorMode === "dark" ? "#379799" : "#379799",
            textColor: colorMode === "light" ? "#000" : "#fff",
            zIndex: 1000,
          },
        }}
      />
      
      <div className="dndflow">
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlowStyled
            colorMode={colorMode}
            nodes={nodes}
            edges={edges}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMapComponent
              nodeColor={(n) => {
                switch (n.type) {
                  case "coldEmailNode":
                    return "red";
                  case "waitDelayNode":
                    return "blue";
                  case "leadSourceNode":
                    return "green";
                  default:
                    return "#eee";
                }
              }}
            />
            <ControlsComponent
              theme={colorMode === "light" ? lightTheme : darkTheme}
            />
            <Background
              color={colorMode === "light" ? "#aaa" : "#888"}
              gap={16}
            />
            <Panel
              position="top-left"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Add any content here */}
            </Panel>
          </ReactFlowStyled>
          {menu && (
            <div
              className="context-menu"
              style={{ top: menu.top, left: menu.left }}
            >
              <button
                onClick={() =>
                  setNodes((nds) =>
                    nds.filter((node) => node.id !== menu.nodeId)
                  )
                }
              >
                Delete Node
              </button>
            </div>
          )}
          {userDetailsComplete ? (
            <button
              className="save-button"
              colorScheme="teal"
              onClick={saveFlowchart}
              isLoading={isSaving}
            >
              Save Flowchart
            </button>
          ) : (
            <button
              className="save-button"
              colorScheme="blue"
              onClick={() => setShowDetailsModal(true)}
            >
              Add Details to Continue
            </button>
          )}
        </div>
        <aside
          className="sidebar"
          style={{
            background: currentTheme.nodeBg,
            color: currentTheme.nodeColor,
          }}
        >
          <div className="description">
            Drag these nodes to the panel on the left:
          </div>
          <div
            className="dndnode"
            onDragStart={(event) =>
              event.dataTransfer.setData(
                "application/reactflow",
                "leadSourceNode"
              )
            }
            draggable
          >
            Lead Source Node
          </div>
          <div
            className="dndnode"
            onDragStart={(event) =>
              event.dataTransfer.setData(
                "application/reactflow",
                "waitDelayNode"
              )
            }
            draggable
          >
            Wait Delay Node
          </div>
          <div
            className="dndnode"
            onDragStart={(event) =>
              event.dataTransfer.setData(
                "application/reactflow",
                "coldEmailNode"
              )
            }
            draggable
          >
            Cold Email Node
          </div>
          <div className='modal'>
            <TemplateModal onTemplateCreated={fetchTemplates} />
          </div>
          <Select
            bg={colorMode === "light" ? "white" : "black"}
            color={colorMode === "light" ? "black" : "white"}
            placeholder="Select Template"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </Select>
        </aside>
      </div>
      {currentEmailId && (
        <Box width="80%" marginTop="50px" marginLeft="140px" marginRight="20px">
          <Stepper
            size="md"
            colorScheme="teal"
            index={activeStep}
            onChange={handleStepperChange}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
      <UserDetailsModal
        isOpen={showDetailsModal}
        onClose={handleModalClose}
        onDetailsSaved={() => {
          setShowDetailsModal(false);
          setLoading(true); // Trigger loading to fetch user details again
          fetchUserProfile();
        }}
      />
    </ReactFlowProvider>
  );
};

export default () => (
  <ReactFlowProvider>
    <FlowChart />
  </ReactFlowProvider>
);


// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ReactFlow, {
//   ReactFlowProvider,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   Panel,
// } from 'reactflow';
// import {
//   Box,
//   Stepper,
//   Step,
//   StepIndicator,
//   StepStatus,
//   StepTitle,
//   StepDescription,
//   StepSeparator,
//   StepIcon,
//   StepNumber,
//   useToast,
//   Button,
//   Select,
//   VStack,
//   HStack,
//   useColorMode,
//   useColorModeValue,
  
// } from '@chakra-ui/react';

// import styled from 'styled-components';

// import ColdEmailNode from './NodeTypes/ColdEmailNode';
// import WaitDelayNode from './NodeTypes/WaitDelayNode';
// import LeadSourceNode from './NodeTypes/LeadSourceNode';
// import Navbar from './Navbar';
// import TemplateModal from './TemplateModal';
// import { useThemeContext } from './ThemeContext';
// import 'reactflow/dist/style.css';
// import './FlowChart.css';

// const initialNodes = [
//   {
//     id: '1',
//     type: 'leadSourceNode',
//     data: { label: 'Lead Source' },
//     position: { x: 250, y: 5 },
//   },
// ];

// const nodeTypes = {
//   coldEmailNode: ColdEmailNode,
//   waitDelayNode: WaitDelayNode,
//   leadSourceNode: LeadSourceNode,
// };

// const ReactFlowStyled = styled(ReactFlow)`
//   background-color: ${(props) => (props.colorMode === 'light' ? 'white' : '#1a202c')};
// `;

// const MiniMapLight = styled(MiniMap)`
//   background-color: #ffffff;

//   .react-flow__minimap-mask {
//     fill: #f4f4f4;
//   }

//   .react-flow__minimap-node {
//     fill: #6e6e6e;
//     stroke: none;
//   }
// `;

// const MiniMapDark = styled(MiniMap)`
//   background-color: #1a202c;

//   .react-flow__minimap-mask {
//     fill:6e6e6e;
//   }

//   .react-flow__minimap-node {
//     fill: #6e6e6e;
//     stroke: none;
//   }
// `;

// const ControlsLight = styled(Controls)`
//   button {
//     background-color: white;
//     color: black;
//     border-bottom: 1px solid white;

//     &:hover {
//       background-color: ${(props) => props.theme.controlsBgHover};
//     }

//     path {
//       fill: currentColor;
//     }
//   }
// `;

// const ControlsDark = styled(Controls)`
//   button {
//     background-color: #1a202c;
//     color: white;
//     border-bottom: 1px solid #1a202c;

//     &:hover {
//       background-color: ${(props) => props.theme.controlsBgHover};
//     }

//     path {
//       fill: currentColor;
//     }
//   }
// `;

// const FlowChart = ({ children }) => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [reactFlowInstance, setReactFlowInstance] = useState(null);
//   const [isSaving, setSaving] = useState(false);
//   const [emailStatus, setEmailStatus] = useState([]);
//   const [currentEmailId, setCurrentEmailId] = useState(null);
//   const [menu, setMenu] = useState(null);
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState('');
//   const reactFlowWrapper = useRef(null);
//   const navigate = useNavigate();
//   const toast = useToast();
//   const {  lightTheme, darkTheme } = useThemeContext();
//   const { colorMode, toggleTheme } = useColorMode();
//   const steps = [
//         { title: 'Scheduled', description: 'Email is scheduled' },
//         { title: 'Sent', description: 'Email has been sent' },
//         { title: 'Opened', description: 'Email has been opened' },
//       ];

//   const fetchEmailStatus = useCallback(async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/emails');
//       const data = await response.json();
//       setEmailStatus(data);
//     } catch (error) {
//       console.error('Error fetching email status:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEmailStatus();
//     const interval = setInterval(fetchEmailStatus, 60000);
    
//     // Load flowchart from local storage
//     const savedFlowchart = localStorage.getItem('flowchart');
//     if (savedFlowchart) {
//       const flowchartData = JSON.parse(savedFlowchart);
//       setNodes(flowchartData.nodes || []);
//       setEdges(flowchartData.edges || []);
//     }

//     return () => clearInterval(interval);
//   }, [fetchEmailStatus]);

//   const fetchTemplates = useCallback(async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/templates');
//       const data = await response.json();
//       setTemplates(data);
//     } catch (error) {
//       console.error('Error fetching templates:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTemplates();
//   }, [fetchTemplates]);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const onInit = useCallback((rfi) => setReactFlowInstance(rfi), []);

//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();
//       const type = event.dataTransfer.getData('application/reactflow');
//       const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
//       const position = reactFlowInstance.project({
//         x: event.clientX - reactFlowBounds.left,
//         y: event.clientY - reactFlowBounds.top,
//       });

//       const newNode = {
//         id: `${+new Date()}`,
//         type,
//         position,
//         data: {
//           label: `${type} node`,
//           delay: type === 'waitDelayNode' ? 5 : undefined,
//           onChange: (id, newDelay) => {
//             setNodes((nds) =>
//               nds.map((node) =>
//                 node.id === id ? { ...node, data: { ...node.data, delay: newDelay } } : node
//               )
//             );
//           },
//         },
//       };

//       setNodes((nds) => nds.concat(newNode));
//     },
//     [reactFlowInstance, setNodes]
//   );

//   const onDragOver = useCallback((event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   const saveFlowchart = async () => {
//     if (!reactFlowInstance) return;

//     try {
//       setSaving(true);
//       const flowchartData = reactFlowInstance.toObject();
//       localStorage.setItem('flowchart', JSON.stringify(flowchartData)); // Save flowchart to local storage

//       let currentEmailId = null;

//       for (const node of flowchartData.nodes) {
//         if (node.type === 'waitDelayNode') {
//           const response = await fetch('http://localhost:5000/api/schedule', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               to: 'panghalunique@gmail.com',
//               subject: 'Scheduled Test Email',
//               body: 'This is a scheduled email based on the flowchart.',
//               delay: node.data.delay || 0,
//               templateId: selectedTemplate,
//             }),
//           });
//           const data = await response.json();
//           currentEmailId = data.emailId;
//           console.log(currentEmailId);
//         }
//       }

//       setCurrentEmailId(currentEmailId);
//       toast({
//         title: 'Flowchart saved',
//         description: 'Flowchart saved and emails scheduled successfully!',
//         status: 'success',
//         duration: 4000,
//         isClosable: true,
//         position: 'top',
//         colorScheme:'teal',
//       });

//       fetchEmailStatus();
//     } catch (error) {
//       console.error('Error saving flowchart:', error);
//       toast({
//         title: 'Error',
//         description: 'There was an error saving the flowchart.',
//         status: 'error',
//         duration: 9000,
//         isClosable: true,
//         position: 'top',
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const clearFlowchart = () => {
//     setNodes([]);
//     setEdges([]);
//     localStorage.removeItem('flowchart'); // Clear flowchart from local storage
//     toast({
//       title: 'Flowchart cleared',
//       description: 'Flowchart cleared successfully!',
//       status: 'info',
//       duration: 4000,
//       isClosable: true,
//       position: 'top',
//     });
//   };

//   const navigateToCampaign = () => {
//     navigate('/campaign');
//   };

//   const handleMenuOpen = (event) => {
//     setMenu(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenu(null);
//   };
//   const getActiveStep = (status) => {
//         if (status === 'opened') {
//           return 3;
//         } else if (status === 'sent') {
//           return 2;
//         } else if (status === 'scheduled') {
//           return 1;
//         } else {
//           return 0;
//         }
//       };
    
//       const currentEmail = emailStatus.find(email => email._id === currentEmailId);
//       const activeStep = currentEmail ? getActiveStep(currentEmail.status) : 0;

//   const MiniMapComponent = colorMode === 'light' ? MiniMapLight : MiniMapDark;
//   const ControlsComponent = colorMode === 'light' ? ControlsLight : ControlsDark;

//   return (
//     <VStack spacing={4} align="stretch">
//       <Navbar onMenuOpen={handleMenuOpen} />
//       <HStack spacing={4}>
//         <Box width="200px" height="calc(100vh - 100px)" bg={useColorModeValue('gray.100', 'gray.700')} p={4} overflowY="auto">
//           <VStack spacing={4} align="stretch">
//             <Button onClick={saveFlowchart} colorScheme="teal" isLoading={isSaving} loadingText="Saving">
//               Save Flowchart
//             </Button>
//             <Button onClick={clearFlowchart} colorScheme="red">
//               Clear Flowchart
//             </Button>
//             <Button onClick={navigateToCampaign} colorScheme="blue">
//               Go to Campaigns
//             </Button>
//             <Select placeholder="Select Template" value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
//               {templates.map((template) => (
//                 <option key={template.id} value={template.id}>
//                   {template.name}
//                 </option>
//               ))}
//             </Select>
//           </VStack>
//         </Box>
//         <Box ref={reactFlowWrapper} width="calc(100vw - 240px)" height="calc(100vh - 100px)" bg={useColorModeValue('gray.50', 'gray.800')}>
//           <ReactFlowProvider>
//             <ReactFlowStyled
//               nodes={nodes}
//               edges={edges}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               onConnect={onConnect}
//               nodeTypes={nodeTypes}
//               onInit={onInit}
//               onDrop={onDrop}
//               onDragOver={onDragOver}
//               fitView
//               colorMode={colorMode}
//             >
//               <MiniMapComponent nodeColor={(n) => {
//                 switch (n.type) {
//                   case 'coldEmailNode':
//                     return 'red';
//                   case 'waitDelayNode':
//                     return 'blue';
//                   case 'leadSourceNode':
//                     return 'green';
//                   default:
//                     return '#eee';
//                 }
//               }} />
//               <ControlsComponent theme={colorMode === 'light' ? lightTheme : darkTheme} />
//               <Background color={colorMode === 'light' ? '#aaa' : '#888'} gap={16} />
//               <Panel position="top-left" style={{ display: 'flex', flexDirection: 'column' }}>
                
//               </Panel>
//             </ReactFlowStyled>
            
//           </ReactFlowProvider>
//         </Box>
//       </HStack>
//       {currentEmailId && (
//         <Box width="80%" marginTop="50px" marginLeft="140px" marginRight="20px">
//           <Stepper
//             size="md"
//             index={activeStep}
//           >            {steps.map((step, index) => (
//               <Step key={index}>
//                 <StepIndicator>
//                   <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
//                 </StepIndicator>
//                 <Box flexShrink="0">
//                   <StepTitle>{step.title}</StepTitle>
//                   <StepDescription>{step.description}</StepDescription>
//                 </Box>
//                 <StepSeparator />
//               </Step>
//             ))}
//           </Stepper>
//         </Box>
//       )}
//     </VStack>
//   );
// };


// export default FlowChart;
