import { Handle, Position } from "@xyflow/react";

export default function AskNode({ data }) {
  const handleChange = (e) => {
    data.onUpdate({
      ...data,
      question: e.target.value
    });
  };

  const handleVar = (e) => {
    data.onUpdate({
      ...data,
      variable: e.target.value
    });
  };

  return (
    <div style={{ padding: 10, borderRadius: 10, background: '#e0f2ff', border: '1px solid #90caf9' }}>
      <Handle type="target" position={Position.Top} />

      <strong> Ask Question</strong>

      <input
        value={data.question || ""}
        onChange={handleChange}
        placeholder="What is your name?"
        style={{ width: "95%", margin: 8 }}
      />

      <small>Save answer to:</small>
      <input
        value={data.variable || ""}
        onChange={handleVar}
        style={{ width: "95%", margin: 8 }}
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}