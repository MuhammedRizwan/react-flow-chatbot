import { Handle, Position } from "@xyflow/react";

export default function ValidationNode({ data }) {
    return (
        <div style={{ padding: 10, borderRadius: 10, background: "#fff3cd", border: "1px solid #ffcc00" }}>
            <Handle type="target" position={Position.Top} />
            <strong>Validate</strong>
            <p style={{ fontSize: 12 }}>Check name: not empty, no numbers</p>
            <Handle type="source" id="pass" position={Position.Bottom} />
            <Handle type="source" id="fail" position={Position.Right} />
        </div>
    );
}
