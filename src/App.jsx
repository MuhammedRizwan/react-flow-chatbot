import { useState, useCallback } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import AskNode from './components/node/ask';
import DatabaseNode from './components/node/database';
import AiNode from './components/node/ai';
import ReplyNode from './components/node/reply';
import ValidationNode from './components/node/validation';
import FallbackNode from './components/node/fallback';
import ErrorNode from './components/node/error';

const nodeTypes = {
  ask: AskNode,
  reply: ReplyNode,
  ai: AiNode,
  database: DatabaseNode,
  validation: ValidationNode,
  fallback: FallbackNode,
  error: ErrorNode,
};

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onUpdateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: newData } : n))
    );
  };

  useState(() => {
    setNodes([
      { id: "start1", type: "input", position: { x: 60, y: 40 }, data: { label: "start" } },

      {
        id: "ask1",
        type: "ask",
        position: { x: 60, y: 170 },
        data: {
          question: "What is your name?",
          variable: "user.name",
          onUpdate: (d) => onUpdateNodeData("ask1", d)
        }
      },
      {
        id: "validate1",
        type: "validation",
        position: { x: 700, y: 170 },
        data: {}
      },

      {
        id: "db1",
        type: "database",
        position: { x: 60, y: 380 },
        data: {
          mode: "set",
          key: "user.name",
          value: "",
          onUpdate: (d) => onUpdateNodeData("db1", d)
        }
      },
      {
        id: "error1",
        type: "error",
        position: { x: 700, y: 380 },
        data: {}
      },
      {
        id: "ai1",
        type: "ai",
        position: { x: 60, y: 620 },
        data: {
          prompt: "Greet the user using user.name",
          onUpdate: (d) => onUpdateNodeData("ai1", d)
        }
      },
      {
        id: "fallback1",
        type: "fallback",
        position: { x: 700, y: 620 },
        data: {}
      },
      { id: "reply", type: "output", position: { x: 60, y: 850 }, data: { label: "end" } },
    ]);

    setEdges([
      { id: "e1", source: "start1", target: "ask1",style: { stroke: '#044b1aff' } },

      // ask → validation
      { id: "e2", source: "ask1", target: "validate1", style: { stroke: '#044b1aff' } },

      // validation pass → db
      { id: "e3", source: "validate1", sourceHandle: "pass", target: "db1", style: { stroke: '#044b1aff' } },

      // validation fail → ask again
      { id: "e4", source: "validate1", sourceHandle: "fail", target: "ask1", style: { stroke: '#9aaa41ff' } },

      // db success → AI
      { id: "e5", source: "db1", target: "ai1", style: { stroke: '#044b1aff' } },

      // db error → error node
      { id: "e6", source: "db1", target: "error1", style: { stroke: '#b30b0bff' } },
      // error node → end
      { id: "e7", source: "error1", target: "ask1", style: { stroke: '#9aaa41ff' } },

      // fallback route (AI confused)
      { id: "e8", source: "ai1", target: "fallback1", style: { stroke: '#b30b0bff' } },

      // fallback → ask again
      { id: "e9", source: "fallback1", target: "ask1" , style: { stroke: '#9aaa41ff' } },

      // normal end
      { id: "e10", source: "ai1", target: "reply", style: { stroke: '#044b1aff' } },
    ]);

  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((es) => addEdge(params, es)),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
