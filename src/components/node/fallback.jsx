import { Handle, Position } from "@xyflow/react";

export default function FallbackNode() {
    return (
        <div style={{ padding: 10, borderRadius: 10, background: "#fdecea", border: "1px solid #e57373" }}>
            <Handle type="target" position={Position.Top} />
            <strong>Fallback</strong>
            <p style={{ fontSize: 12 }}>“Sorry — I didn’t catch that.”</p>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}