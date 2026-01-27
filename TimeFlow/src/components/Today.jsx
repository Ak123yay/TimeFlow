import { useState } from "react";
import { loadAvailability } from "../utils/storage";
import "../App.css";

function LeafIcon({ className = "", size = 18, fill = "#3B6E3B" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-45 12 12)" fill={fill} opacity="0.9" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="#2E6B2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function Today() {
  const availability = loadAvailability();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (!taskName || !taskDuration) return;
    const startTime = taskStartTime || null;
    setTasks([...tasks, { id: Date.now(), name: taskName, duration: parseInt(taskDuration), startTime }]);
    setTaskName("");
    setTaskDuration("");
    setTaskStartTime("");
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const totalMinutes = tasks.reduce((sum, t) => sum + t.duration, 0);
  const startM = hhmmToMinutes(availability?.start || "09:00");
  const endM = hhmmToMinutes(availability?.end || "17:00");
  const availableM = endM - startM;

  let currentTime = startM;
  const taskBlocks = tasks.map(task => {
    const start = task.startTime ? hhmmToMinutes(task.startTime) : currentTime;
    const end = start + task.duration;
    if (!task.startTime) currentTime = end;
    return { ...task, start, end };
  });

  const overflowing = taskBlocks.some(t => t.end > endM);
  const freeTime = Math.max(0, availableM - totalMinutes);

  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card">
        
        {/* Header */}
        <div className="setup-header" style={{ marginBottom: "22px" }}>
          <div className="header-left">
            <h1 className="title" style={{ fontSize: "24px" }}>Today's Flow</h1>
            <p className="muted" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <LeafIcon size={14} fill="#6B8E6B" />
              Plan your day with time blocks
            </p>
          </div>
          <div className="header-decor" aria-hidden>
            <LeafIcon size={40} fill="#3B6E3B" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="presets horizontal-scroll" role="list" style={{ marginBottom: "20px" }}>
          <div className="preset-pill" style={{ cursor: "default", minWidth: "140px", boxShadow: "0 2px 8px rgba(59,110,59,0.04)" }}>
            <div className="preset-text">{tasks.length} Tasks</div>
            <div className="preset-sub">Planned</div>
          </div>
          <div className="preset-pill" style={{ cursor: "default", minWidth: "140px", boxShadow: "0 2px 8px rgba(59,110,59,0.04)" }}>
            <div className="preset-text">{Math.floor(totalMinutes/60)}h {totalMinutes%60}m</div>
            <div className="preset-sub">Scheduled</div>
          </div>
          <div className="preset-pill" style={{ cursor: "default", minWidth: "140px", background: overflowing ? "linear-gradient(180deg, rgba(255,200,200,0.15), rgba(255,220,220,0.08))" : undefined, boxShadow: "0 2px 8px rgba(59,110,59,0.04)" }}>
            <div className="preset-text" style={{ color: overflowing ? "#b91c1c" : undefined }}>{Math.floor(Math.abs(freeTime)/60)}h {Math.abs(freeTime)%60}m</div>
            <div className="preset-sub">{overflowing ? "Overflow" : "Free Time"}</div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="controls-row">
          <label className="control" style={{ flex: 2 }}>
            <div className="control-label">Task Name</div>
            <div className="time-input">
              <LeafIcon size={18} fill="#4F7A4F" />
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What needs to be done?"
                style={{ border: "none", outline: "none", flex: 1, background: "transparent" }}
              />
            </div>
          </label>

          <label className="control">
            <div className="control-label">Start Time</div>
            <div className="time-input">
              <input
                type="time"
                value={taskStartTime}
                onChange={(e) => setTaskStartTime(e.target.value)}
                style={{ border: "none", outline: "none", flex: 1, background: "transparent" }}
              />
            </div>
          </label>

          <label className="control">
            <div className="control-label">Duration</div>
            <div className="time-input">
              <input
                type="number"
                value={taskDuration}
                onChange={(e) => setTaskDuration(e.target.value)}
                placeholder="30"
                min="1"
                style={{ border: "none", outline: "none", flex: 1, background: "transparent", textAlign: "center" }}
              />
              <span style={{ color: "#6B8E6B", fontSize: "13px" }}>min</span>
            </div>
          </label>
        </div>

        <button onClick={addTask} style={{ width: "100%", marginBottom: "18px", padding: "13px 18px", borderRadius: "9999px", fontWeight: "800", background: "linear-gradient(90deg, #4F7A4F, #6FAF6F)", color: "white", border: "none", boxShadow: "0 10px 24px rgba(59,110,59,0.14)", cursor: "pointer", letterSpacing: "0.3px" }}>+ Add Task</button>

        {/* Quick Add Presets */}
        <div className="presets horizontal-scroll" role="list">
          {[{n:"Break",d:15},{n:"Meeting",d:30},{n:"Deep Work",d:90},{n:"Email",d:20}].map(p => (
            <button
              key={p.n}
              onClick={() => { setTaskName(p.n); setTaskDuration(p.d.toString()); }}
              className="preset-pill"
              aria-label={`Quick add ${p.n}`}
            >
              <div className="preset-text">{p.n}</div>
              <div className="preset-sub">{p.d} min</div>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="timeline-wrap">
          <div className="timeline-scale">
            <span>{availability?.start || "09:00"}</span>
            <span>Your Timeline</span>
            <span>{availability?.end || "17:00"}</span>
          </div>

          <div className="timeline-bar" style={{ height: "auto", minHeight: "120px", padding: "16px 12px", maxHeight: "400px", overflowY: "auto" }}>
            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 20px", opacity: 0.6 }}>
                <LeafIcon size={36} fill="#C5D9C5" />
                <p className="muted" style={{ marginTop: "12px", fontSize: "13px" }}>Add tasks to see your timeline</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {taskBlocks.map((task, i) => (
                  <div
                    key={task.id}
                    style={{
                      background: "linear-gradient(90deg, rgba(167,211,167,0.12), rgba(111,175,111,0.08))",
                      border: "1px solid rgba(111,175,111,0.15)",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      background: `linear-gradient(180deg, ${i % 2 === 0 ? "#6FAF6F" : "#3B6E3B"}, ${i % 2 === 0 ? "#3B6E3B" : "#6FAF6F"})`
                    }} />

                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${i % 2 === 0 ? "#6FAF6F" : "#3B6E3B"}, ${i % 2 === 0 ? "#3B6E3B" : "#6FAF6F"})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "700",
                      flexShrink: 0,
                      boxShadow: "0 4px 10px rgba(59,110,59,0.12)"
                    }}>
                      {i + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px" }}>
                        {task.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B8E6B" }}>
                        {minutesToHHMM(task.start)} — {minutesToHHMM(task.end)} • {task.duration} min
                      </div>
                    </div>

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
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="actions-row">
            <button className="btn primary">Start First Task →</button>
          </div>
        )}
      </div>
    </div>
  );
}