import { Handle, Position } from "@xyflow/react";

export default function UserInputNode({ data }) {
  return (
    <div style={{ padding: 10, borderRadius: 10, background: "#f1f8e9", border: "1px solid #aed581" }}>
      <Handle type="target" position={Position.Top} />

      <strong> User Input</strong>
      <p style={{ fontSize: 12 }}>Wait for the user to reply</p>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
