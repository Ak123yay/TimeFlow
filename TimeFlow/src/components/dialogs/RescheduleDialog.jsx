import { useState } from "react";
import DialogBase from "./DialogBase";
import "../../App.css";

export default function RescheduleDialog({ isOpen, onClose, overflowData, tasks, onReschedule }) {
  const [selectedActions, setSelectedActions] = useState({});

  const handleActionChange = (taskId, action) => {
    setSelectedActions(prev => ({
      ...prev,
      [taskId]: action
    }));
  };

  const handleApply = () => {
    onReschedule(selectedActions);
    onClose();
  };

  const affectedTasks = overflowData?.affectedTasks || [];

  return (
    <DialogBase isOpen={isOpen} onClose={onClose} title="Schedule Overflow" maxWidth="600px">
      <div>
        <p style={{ color: "#4B6B4B", fontSize: 15, lineHeight: 1.5, marginBottom: "20px" }}>
          Your tasks exceed available time by{" "}
          <strong style={{ color: "#dc2626" }}>{overflowData?.minutes} minutes</strong>.
          Choose how to handle these tasks:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          {affectedTasks.map((task) => {
            const action = selectedActions[task.id] || 'flexible';

            return (
              <div
                key={task.id}
                style={{
                  background: "linear-gradient(135deg, rgba(255,220,220,0.15), rgba(255,230,230,0.08))",
                  border: "1px solid rgba(220,38,38,0.2)",
                  borderRadius: "12px",
                  padding: "14px 16px"
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#3B6E3B", marginBottom: "8px" }}>
                  {task.name}
                </div>
                <div style={{ fontSize: "13px", color: "#6B8E6B", marginBottom: "12px" }}>
                  {task.duration} minutes
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleActionChange(task.id, 'flexible')}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: action === 'flexible' ? "2px solid #3B6E3B" : "1px solid rgba(111,175,111,0.2)",
                      background: action === 'flexible' ? "rgba(59,110,59,0.1)" : "#fff",
                      cursor: "pointer",
                      fontWeight: "600",
                      color: action === 'flexible' ? "#3B6E3B" : "#6B8E6B",
                      transition: "all 0.2s"
                    }}
                  >
                    Keep (Flexible)
                  </button>
                  <button
                    onClick={() => handleActionChange(task.id, 'tomorrow')}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: action === 'tomorrow' ? "2px solid #f59e0b" : "1px solid rgba(111,175,111,0.2)",
                      background: action === 'tomorrow' ? "rgba(245,158,11,0.1)" : "#fff",
                      cursor: "pointer",
                      fontWeight: "600",
                      color: action === 'tomorrow' ? "#d97706" : "#6B8E6B",
                      transition: "all 0.2s"
                    }}
                  >
                    Move to Tomorrow
                  </button>
                  <button
                    onClick={() => handleActionChange(task.id, 'delete')}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: action === 'delete' ? "2px solid #dc2626" : "1px solid rgba(111,175,111,0.2)",
                      background: action === 'delete' ? "rgba(220,38,38,0.1)" : "#fff",
                      cursor: "pointer",
                      fontWeight: "600",
                      color: action === 'delete' ? "#dc2626" : "#6B8E6B",
                      transition: "all 0.2s"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            className="btn ghost"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="btn primary"
            style={{ flex: 1 }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </DialogBase>
  );
}
