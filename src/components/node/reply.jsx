import { Handle, Position } from "@xyflow/react";

export default function ReplyNode({ data }) {
    return (
        <div style={{ padding: 10, borderRadius: 10, background: '#e8f5e9', border: '1px solid #81c784' }}>
            <Handle type="target" position={Position.Top} />
            {data.label}
        </div>
    );
}