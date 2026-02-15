import { useState } from "react";
import "../../App.css";

export default function EditTaskDialog({ task, onSave, onClose }) {
  const [taskName, setTaskName] = useState(task?.name || "");
  const [taskDuration, setTaskDuration] = useState(task?.duration || "");
  const [taskStartTime, setTaskStartTime] = useState(task?.startTime || "");

  if (!task) return null;

  const handleSave = () => {
    if (!taskName || !taskDuration) return;

    const updatedTask = {
      ...task,
      name: taskName,
      duration: parseInt(taskDuration, 10),
      remaining: parseInt(taskDuration, 10),
      startTime: taskStartTime || null,
      scheduledFor: taskStartTime
        ? new Date(`${new Date().toISOString().slice(0, 10)}T${taskStartTime}`).toISOString()
        : null
    };

    onSave(updatedTask);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease-out"
    }}>
      <div style={{
        background: "#fff",
        padding: 28,
        borderRadius: 20,
        width: "92%",
        maxWidth: 480,
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#123a12", marginBottom: 20 }}>
          Edit Task
        </div>

        {/* Task Name */}
        <label style={{ display: "block", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6E3B", marginBottom: 6 }}>
            Task Name
          </div>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="What needs to be done?"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(111,175,111,0.3)",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(111,175,111,0.6)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(111,175,111,0.3)"}
          />
        </label>

        {/* Start Time */}
        <label style={{ display: "block", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6E3B", marginBottom: 6 }}>
            Start Time (optional)
          </div>
          <input
            type="time"
            value={taskStartTime}
            onChange={(e) => setTaskStartTime(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(111,175,111,0.3)",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(111,175,111,0.6)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(111,175,111,0.3)"}
          />
        </label>

        {/* Duration */}
        <label style={{ display: "block", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6E3B", marginBottom: 6 }}>
            Duration (minutes)
          </div>
          <input
            type="number"
            value={taskDuration}
            onChange={(e) => setTaskDuration(e.target.value)}
            placeholder="30"
            min="1"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(111,175,111,0.3)",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(111,175,111,0.6)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(111,175,111,0.3)"}
          />
        </label>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            className="btn ghost"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn primary"
            style={{ flex: 1 }}
            disabled={!taskName || !taskDuration}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
