import { useState, useEffect } from "react";
import "../../App.css";
import { haptic } from "../../utils/haptics";

/**
 * Reusable Add Task Modal - Can be used from Today view, Weekly Calendar, or anywhere
 * Supports pre-filled date for cross-day task creation
 */
export default function AddTaskModal({ isOpen, onClose, onAddTask, prefilledDate = null }) {
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(prefilledDate || "");
  const [taskNotes, setTaskNotes] = useState("");

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setTaskName("");
      setTaskDuration("");
      setTaskStartTime("");
      setTaskDeadline(prefilledDate || "");
      setTaskNotes("");
    }
  }, [isOpen, prefilledDate]);

  if (!isOpen) return null;

  const handleAddTask = () => {
    if (!taskName.trim() || !taskDuration) {
      haptic.warning();
      alert("Please enter task name and duration");
      return;
    }

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: taskName.trim(),
      duration: parseInt(taskDuration, 10),
      startTime: taskStartTime || null,
      deadline: taskDeadline || null,
      notes: taskNotes || null,
      completed: false,
      createdAt: new Date().toISOString(),
      remaining: parseInt(taskDuration, 10),
      category: 'personal', // Default category
      attempts: 0
    };

    haptic.light();
    onAddTask(newTask);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "flex-end",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease-out"
    }}>
      <div style={{
        background: "var(--tf-bg)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: "28px 20px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        animation: "slideUp 0.3s ease-out",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--tf-text)",
            margin: 0
          }}>Add Task</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 28,
              cursor: "pointer",
              color: "var(--tf-muted)",
              lineHeight: 1,
              padding: 0
            }}
          >×</button>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Task Name */}
          <div>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--tf-muted)",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}>
              Task Name*
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What do you need to do?"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid var(--tf-border)",
                borderRadius: 12,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                background: "var(--tf-surface)",
                color: "var(--tf-text)",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--tf-accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--tf-border)"}
            />
          </div>

          {/* Duration */}
          <div>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--tf-muted)",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}>
              Duration (minutes)*
            </label>
            <input
              type="number"
              value={taskDuration}
              onChange={(e) => setTaskDuration(e.target.value)}
              placeholder="30"
              min="5"
              max="480"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid var(--tf-border)",
                borderRadius: 12,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                background: "var(--tf-surface)",
                color: "var(--tf-text)",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          {/* Start Time */}
          <div>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--tf-muted)",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}>
              Start Time (Optional)
            </label>
            <input
              type="time"
              value={taskStartTime}
              onChange={(e) => setTaskStartTime(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid var(--tf-border)",
                borderRadius: 12,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                background: "var(--tf-surface)",
                color: "var(--tf-text)",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Deadline/Date */}
          <div>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--tf-muted)",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}>
              Target Date (Optional)
            </label>
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid var(--tf-border)",
                borderRadius: 12,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                background: "var(--tf-surface)",
                color: "var(--tf-text)",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--tf-muted)",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}>
              Notes (Optional)
            </label>
            <textarea
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="Add any notes or context..."
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid var(--tf-border)",
                borderRadius: 12,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                background: "var(--tf-surface)",
                color: "var(--tf-text)",
                boxSizing: "border-box",
                minHeight: 80,
                resize: "none"
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{
            display: "flex",
            gap: 12,
            marginTop: 8
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: 14,
                background: "var(--tf-surface)",
                color: "var(--tf-text)",
                border: "1.5px solid var(--tf-border)",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "var(--tf-border)"}
              onMouseOut={(e) => e.target.style.background = "var(--tf-surface)"}
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              style={{
                flex: 1,
                padding: 14,
                background: "var(--tf-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.opacity = 0.9}
              onMouseOut={(e) => e.target.style.opacity = 1}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}