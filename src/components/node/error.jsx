import { Handle, Position } from "@xyflow/react";

export default function ErrorNode() {
    return (
        <div style={{ padding: 10, borderRadius: 10, background: "#ffebee", border: "1px solid #ef5350" }}>
            <Handle type="target" position={Position.Top} />
            <strong>Error</strong>
            <p style={{ fontSize: 12 }}>Apologize + continue safely</p>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}