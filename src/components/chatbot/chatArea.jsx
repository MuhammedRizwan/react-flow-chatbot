export default function ChatArea({ started, startFlow, send, messages }) {
    return (
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
              background: "#25D366", 
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
    )
}