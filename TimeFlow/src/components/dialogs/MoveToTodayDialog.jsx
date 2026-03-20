import { useState } from "react";
import "../../App.css";

export default function MoveToTodayDialog({ task, onConfirm, onCancel }) {
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleConfirm = () => {
    if (!duration) return; // Duration is required
    onConfirm(parseInt(duration, 10), startTime || null);
  };

  return (
    <div className="modal-backdrop" style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div className="modal-content-scale" style={{
        background: "#fff",
        padding: 28,
        borderRadius: 20,
        width: "92%",
        maxWidth: 420,
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)"
      }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#123a12", marginBottom: 8 }}>
          Move to Today
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#3B6E3B", marginBottom: 24 }}>
          "{task.name}"
        </p>

        <label className="control" style={{ marginBottom: 16 }}>
          <div className="control-label">Duration (required)</div>
          <div className="time-input">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              min="1"
              autoFocus
              style={{ border: "none", outline: "none", flex: 1, background: "transparent", textAlign: "center" }}
            />
            <span style={{ color: "#6B8E6B", fontSize: "13px" }}>min</span>
          </div>
        </label>

        <label className="control" style={{ marginBottom: 24 }}>
          <div className="control-label">Start Time (optional)</div>
          <div className="time-input">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ border: "none", outline: "none", flex: 1, background: "transparent" }}
            />
          </div>
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleConfirm}
            disabled={!duration}
            className="btn primary"
            style={{
              flex: 1,
              opacity: !duration ? 0.5 : 1,
              cursor: !duration ? "not-allowed" : "pointer"
            }}
          >
            Add to Today →
          </button>
          <button
            onClick={onCancel}
            className="btn ghost"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
