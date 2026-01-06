import { useState, useCallback, useMemo, useEffect } from 'react';
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
import UserInputNode from './components/node/userInput';
import { createRunner } from './runner/runner';

const nodeTypes = {
  ask: AskNode,
  userInput: UserInputNode,
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
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);

  const onUpdateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: newData } : n))
    );
  };

  useEffect(() => {
    setNodes([
      { id: "start1", type: "input", position: { x: 60, y: 40 }, data: { label: "start" } },

      {
        id: "ask1",
        type: "ask",
        position: { x: 60, y: 140 },
        data: {
          question: "What is your name?",
          variable: "user.name",
          onUpdate: (d) => onUpdateNodeData("ask1", d)
        }
      },
      {
        id: "input1",
        type: "userInput",
        position: { x: 60, y: 320 },
        data: { variable: "user.name" }
      },
      {
        id: "validate1",
        type: "validation",
        position: { x: 700, y: 320 },
        data: { variable: "user.name" }
      },

      {
        id: "db1",
        type: "database",
        position: { x: 60, y: 450 },
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
        position: { x: 700, y: 450 },
        data: {}
      },
      {
        id: "ai1",
        type: "ai",
        position: { x: 60, y: 650 },
        data: {
          prompt: "Greet the user using user.name",
          onUpdate: (d) => onUpdateNodeData("ai1", d)
        }
      },
      {
        id: "fallback1",
        type: "fallback",
        position: { x: 700, y: 650 },
        data: {}
      },
      { id: "reply", type: "output", position: { x: 60, y: 850 }, data: { label: "end" } },
    ]);

    setEdges([
      { id: "e1", source: "start1", target: "ask1", style: { stroke: '#044b1aff' } },

      // ask → validation
      { id: "e2", source: "ask1", target: "input1", style: { stroke: '#044b1aff' } },
      // user input → validation
      { id: "e2-2", source: "input1", target: "validate1", style: { stroke: '#044b1aff' } },

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
      { id: "e9", source: "fallback1", target: "ask1", style: { stroke: '#9aaa41ff' } },

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

  const runner = useMemo(() => {
    if (!nodes.length || !edges.length) return null;
    return createRunner(nodes, edges);
  }, [nodes, edges]);

  async function send(input) {
    if (!runner) return;

    const result = await runner.step(input);
    if (!result) return;

    // if runner returned multiple messages
    if (Array.isArray(result)) {
      setMessages(m => [...m, ...result.filter(Boolean)]);
    } else {
      setMessages(m => [...m, result]);
    }
    if (result.type === "end") {
      setStarted(false);
    }
  }


  async function startFlow() {
    setMessages([]);
    setStarted(true);

    // trigger first step (ask node)
    const first = await runner.step();
    setMessages([first]);
  }

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
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 20,
          width: 300,
          background: "#fff",
          padding: 12,
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}
      >
        <div style={{ height: 200, overflowY: "auto", marginBottom: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <strong>{m.type}</strong>: {m.text}
            </div>
          ))}
        </div>

        {!started ? (
          <button
            onClick={startFlow}
            style={{
              display: "block",
              margin: "0 auto",
              padding: "10px 22px",
              borderRadius: 30,
              border: "none",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              background: "#25D366",      // WhatsApp green
              color: "#fff",
              transition: "transform .15s ease, box-shadow .15s ease"
            }}
            onMouseOver={e => (e.target.style.boxShadow = "0 6px 14px rgba(37,211,102,.35)")}
            onMouseOut={e => (e.target.style.boxShadow = "none")}
          >
            Start
          </button>
        ) : (
          <input
            placeholder="type..."
            style={{
              width: "90%",
              padding: "10px",
              margin: 8,
              borderRadius: 18,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: 14
            }}
            onKeyDown={e => e.key === "Enter" && send(e.target.value)}
          />
        )}
      </div>

    </div>
  );
}
