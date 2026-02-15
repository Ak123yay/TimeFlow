import { useState } from "react";
import {
  loadWeeklyPool,
  addTaskToWeeklyPool,
  removeTaskFromWeeklyPool,
  loadTasksForDate,
  saveTasksForDate
} from "../utils/storage";
import MoveToTodayDialog from "./dialogs/MoveToTodayDialog";
import "../App.css";

function LeafIconLocal({ className = "", size = 18, fill = "#3B6E3B" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-45 12 12)" fill={fill} opacity="0.9" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="#2E6B2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

const getTodayString = () => new Date().toISOString().slice(0, 10);

const loadTasks = () => {
  try {
    return loadTasksForDate(getTodayString());
  } catch (e) {
    console.error("loadTasks", e);
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    saveTasksForDate(getTodayString(), tasks);
  } catch (e) {
    console.error("saveTasks", e);
  }
};

export default function WeeklyPool({ onNavigateToToday }) {
  const [poolTasks, setPoolTasks] = useState(() => loadWeeklyPool());
  const [newTaskName, setNewTaskName] = useState("");
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [taskToMove, setTaskToMove] = useState(null);

  const addTaskToPool = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTaskName) return;

    const task = addTaskToWeeklyPool({
      name: newTaskName
    });

    setPoolTasks([...poolTasks, task]);
    setNewTaskName("");
  };

  const handleMoveToToday = (task) => {
    setTaskToMove(task);
    setShowMoveDialog(true);
  };

  const confirmMoveToToday = (duration, startTime) => {
    // Remove from pool
    removeTaskFromWeeklyPool(taskToMove.id);
    setPoolTasks(poolTasks.filter(t => t.id !== taskToMove.id));

    // Add to today's tasks with user-specified duration
    const todayTasks = loadTasks();
    const newTask = {
      ...taskToMove,
      id: Date.now(),
      inWeeklyPool: false,
      duration: duration,
      startTime: startTime,
      remaining: duration,
      completed: false,
      movedToTodayCount: (taskToMove.movedToTodayCount || 0) + 1,
      attempts: 0,
      scheduledFor: startTime
        ? new Date(`${getTodayString()}T${startTime}`).toISOString()
        : null,
      lastRescheduled: null,
      rescheduledReasons: []
    };
    todayTasks.push(newTask);
    saveTasks(todayTasks);

    setShowMoveDialog(false);
    setTaskToMove(null);

    // Navigate to Today view
    onNavigateToToday();
  };

  const deleteTask = (id) => {
    removeTaskFromWeeklyPool(id);
    setPoolTasks(poolTasks.filter(t => t.id !== id));
  };

  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card">
        {/* Header */}
        <div className="setup-header" style={{ marginBottom: "22px" }}>
          <div className="header-left">
            <h1 className="title" style={{ fontSize: "24px" }}>Weekly Pool 🌊</h1>
            <p className="muted" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <LeafIconLocal size={14} fill="#6B8E6B" />
              Tasks you want to work on this week ({poolTasks.length})
            </p>
          </div>
          <button
            onClick={onNavigateToToday}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              border: "1px solid rgba(111,175,111,0.3)",
              background: "linear-gradient(135deg, rgba(111,175,111,0.1), rgba(59,110,59,0.05))",
              color: "#3B6E3B",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(59,110,59,0.06)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,110,59,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(59,110,59,0.06)";
            }}
          >
            ← Back to Today
          </button>
        </div>

        {/* Add Task Form */}
        <div className="controls-row">
          <label className="control" style={{ flex: 1 }}>
            <div className="control-label">Task Name</div>
            <div className="time-input">
              <LeafIconLocal size={18} fill="#4F7A4F" />
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="What do you want to work on?"
                style={{ border: "none", outline: "none", flex: 1, background: "transparent" }}
              />
            </div>
          </label>
        </div>

        <button
          onClick={addTaskToPool}
          className="btn primary"
          style={{
            width: "100%",
            marginBottom: "18px",
            fontSize: "15px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          + Add to Pool
        </button>

        {/* Pool Tasks List */}
        <div style={{ marginTop: 24 }}>
          {poolTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", opacity: 0.6 }}>
              <LeafIconLocal size={36} fill="#C5D9C5" />
              <p className="muted" style={{ marginTop: "12px", fontSize: "13px" }}>
                Your weekly task pool is empty. Add tasks you want to work on this week!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {poolTasks.map(task => (
                <div key={task.id} className="pool-task-card">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#3B6E3B" }}>
                      {task.name}
                    </div>
                  </div>
                  <button
                    onClick={() => handleMoveToToday(task)}
                    className="btn primary"
                    style={{
                      fontSize: 13,
                      padding: "8px 16px"
                    }}
                  >
                    Move to Today →
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "1px solid rgba(111,175,111,0.2)",
                      background: "#fff",
                      color: "#999",
                      fontSize: "16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee";
                      e.currentTarget.style.color = "#c00";
                      e.currentTarget.style.borderColor = "rgba(200,0,0,0.3)";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#999";
                      e.currentTarget.style.borderColor = "rgba(111,175,111,0.2)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Move to Today Dialog */}
        {showMoveDialog && taskToMove && (
          <MoveToTodayDialog
            task={taskToMove}
            onConfirm={confirmMoveToToday}
            onCancel={() => {
              setShowMoveDialog(false);
              setTaskToMove(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
