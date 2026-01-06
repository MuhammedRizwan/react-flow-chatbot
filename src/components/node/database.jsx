import { Handle, Position } from "@xyflow/react";

export default function DatabaseNode({ data, selected }) {
    const update = (field, value) => {
        data.onUpdate({
            ...data,
            [field]: value
        });
    };

    return (
        <div
            style={{
                padding: 12,
                borderRadius: 12,
                background: "#e3f2fd",
                border: selected ? "2px solid #42a5f5" : "1px solid #90caf9",
                width: 240
            }}
        >
            <Handle type="target" position={Position.Top} />

            <strong> Database</strong>

            <select
                value={data.mode || "set"}
                onChange={(e) => update("mode", e.target.value)}
                style={{ width: "90%", margin: 8 }}
            >
                <option value="set">Save Value</option>
                <option value="get">Get Value</option>
            </select>

            <input
                placeholder="key (e.g. user.name)"
                value={data.key || ""}
                onChange={(e) => update("key", e.target.value)}
                style={{ width: "87%", margin: 8 }}
            />

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}