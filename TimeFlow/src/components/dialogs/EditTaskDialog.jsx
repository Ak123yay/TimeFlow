import { useState } from "react";
import "../../App.css";
import { haptic } from "../../utils/haptics";

export default function EditTaskDialog({ task, onSave, onClose }) {
  const [taskName, setTaskName] = useState(task?.name || "");
  const [taskDuration, setTaskDuration] = useState(task?.duration || "");
  const [taskStartTime, setTaskStartTime] = useState(task?.startTime || "");
  const [taskDeadline, setTaskDeadline] = useState(task?.deadline || "");

  if (!task) return null;

  const handleSave = () => {
    if (!taskName || !taskDuration) return;

    // VALIDATION: Prevent scheduling tasks at times that have already passed
    if (taskStartTime) {
      const now = new Date();
      const today = new Date().toISOString().slice(0, 10);
      const selectedTime = new Date(`${today}T${taskStartTime}`);

      if (selectedTime < now) {
        haptic.warning();
        alert('Cannot schedule task at a time that has already passed. Please select a future time.');
        return;
      }
    }

    const updatedTask = {
      ...task,
      name: taskName,
      duration: parseInt(taskDuration, 10),
      remaining: parseInt(taskDuration, 10),
      startTime: taskStartTime || null,
      deadline: taskDeadline || null,
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
    }}
     className="modal-backdrop">
      <div style={{
        background: "#fff",
        padding: 28,
        borderRadius: 20,
        width: "92%",
        maxWidth: 480,
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
      }}
      className="modal-content-scale">
        <div style={{ fontSize: 24, fontWeight: 900, color: "#123a12", marginBottom: 20 }}>
          Edit Task
        </div>

        {/* Task Name */}
        <label style={{ display: "block", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6E3B", marginBottom: 6 }}>
            Task Name
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '44px',
            border: '1px solid rgba(111,175,111,0.3)',
            borderRadius: '10px',
            background: '#fff',
            padding: '0 12px',
            boxSizing: 'border-box'
          }}>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What needs to be done?"
              style={{
                fontSize: '16px',
                padding: 0,
                border: 'none',
                outline: 'none',
                flex: 1,
                background: 'transparent',
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </label>

        {/* Start Time and Duration row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: 16 }}>
          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6E3B", marginBottom: 6 }}>
              Start Time
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              border: '1px solid rgba(111,175,111,0.3)',
              borderRadius: '10px',
              background: '#fff',
              padding: '0 12px',
              boxSizing: 'border-box'
            }}>
              <input
                type="time"
                value={taskStartTime}
                onChange={(e) => setTaskStartTime(e.target.value)}
                style={{
                  fontSize: '16px',
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  background: 'transparent',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          </label>

          <label style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6E3B", marginBottom: 6 }}>
              Duration
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              border: '1px solid rgba(111,175,111,0.3)',
              borderRadius: '10px',
              background: '#fff',
              padding: '0 12px',
              boxSizing: 'border-box'
            }}>
              <input
                type="number"
                value={taskDuration}
                onChange={(e) => setTaskDuration(e.target.value)}
                placeholder="30"
                min="1"
                style={{
                  fontSize: '16px',
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  background: 'transparent',
                  textAlign: 'center',
                  width: '100%',
                  height: '100%'
                }}
              />
              <span style={{ color: '#6B8E6B', fontSize: '12px', fontWeight: 500, marginLeft: '4px', flexShrink: 0 }}>min</span>
            </div>
          </label>
        </div>

        {/* Deadline */}
        <label style={{ display: "block", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#3B6E3B", marginBottom: 6 }}>
            Deadline (optional)
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '44px',
            border: '1px solid rgba(111,175,111,0.3)',
            borderRadius: '10px',
            background: '#fff',
            padding: '0 12px',
            boxSizing: 'border-box',
            gap: '8px'
          }}>
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              style={{
                fontSize: '16px',
                padding: 0,
                border: 'none',
                outline: 'none',
                flex: 1,
                background: 'transparent',
                width: '100%',
                height: '100%'
              }}
            />
            {taskDeadline && (
              <button
                onClick={() => setTaskDeadline('')}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#D1D5DB',
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  padding: 0,
                  lineHeight: 1
                }}
                aria-label="Clear deadline"
              >×</button>
            )}
          </div>
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
