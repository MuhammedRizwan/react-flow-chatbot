import { Handle, Position } from "@xyflow/react";

export default function AiNode({ data, selected }) {
    const handleChange = (e) => {
        data.onUpdate({
            ...data,
            prompt: e.target.value
        });
    };

    return (
        <div
            style={{
                padding: 12,
                borderRadius: 12,
                background: "#f3e5f5",
                border: selected ? "2px solid #ab47bc" : "1px solid #ce93d8",
                width: 220
            }}
        >
            <Handle type="target" position={Position.Top} />

            <strong> AI Response</strong>

            <textarea
                value={data.prompt || ""}
                onChange={handleChange}
                placeholder="e.g. Answer politely using user.name"
                style={{ width: "90%", margin: 8, height: 50 }}
            />

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}