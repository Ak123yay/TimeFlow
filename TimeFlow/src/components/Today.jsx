import { useEffect, useState, useRef } from "react";
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

/* localStorage helpers */
const tasksKeyForToday = () => `timeflow-tasks-${new Date().toISOString().slice(0, 10)}`;
const loadTasks = () => {
  try {
    const raw = localStorage.getItem(tasksKeyForToday());
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("loadTasks", e);
    return [];
  }
};
const saveTasks = (tasks) => {
  try {
    localStorage.setItem(tasksKeyForToday(), JSON.stringify(tasks));
  } catch (e) {
    console.error("saveTasks", e);
  }
};

export default function Today() {
  const availability = loadAvailability();
  // --- keep original UI state names ---
  const [tasks, setTasks] = useState(() => loadTasks());
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");

  // --- TIMER STATE (non-UI changes) ---
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);
  // store the initial seconds at start to calculate remaining if user says "not finished"
  const activeInitialSecRef = useRef(0);

  // UI modal state
  const [showFinishPrompt, setShowFinishPrompt] = useState(false);

  // persist tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!taskName || !taskDuration) return;
    const startTime = taskStartTime || null;
    const newTask = {
      id: Date.now(),
      name: taskName,
      duration: parseInt(taskDuration, 10),
      startTime,
      remaining: parseInt(taskDuration, 10),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
    setTaskName("");
    setTaskDuration("");
    setTaskStartTime("");
  };

  const deleteTask = (id) => {
    // if deleting active task, stop timer
    if (activeTaskId === id) {
      clearInterval(timerRef.current);
      setActiveTaskId(null);
      setSecondsLeft(0);
      setShowFinishPrompt(false);
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // compute simple sequential scheduling (unchanged UI behavior)
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
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

  // ---------- TIMER ENGINE ----------
  // startTask: sets activeTaskId and secondsLeft (based on remaining or duration)
  const startTask = (task) => {
    if (!task) return;
    // find the latest copy from tasks array (in case changed)
    const t = tasks.find(x => x.id === task.id);
    if (!t) return;
    const seconds = (t.remaining ?? t.duration ?? 0) * 60;
    activeInitialSecRef.current = seconds;
    setActiveTaskId(t.id);
    setSecondsLeft(seconds);
    // ensure any previous interval is cleared — effect below will set a new one
    clearInterval(timerRef.current);
  };

  // effect: ticking (creates interval when activeTaskId is set)
  useEffect(() => {
    clearInterval(timerRef.current);

    if (!activeTaskId) {
      return;
    }
    // if secondsLeft already <= 0, show prompt immediately
    if (secondsLeft <= 0) {
      setShowFinishPrompt(true);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTaskId]);

  // effect: watch secondsLeft and trigger completion when reaches 0
  useEffect(() => {
    if (!activeTaskId) return;
    if (secondsLeft > 0) return;

    // secondsLeft <= 0 -> show finish modal (do not auto-mark)
    clearInterval(timerRef.current);
    setShowFinishPrompt(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, activeTaskId]);

  // user selects "Yes, done" in modal
  const finishTaskConfirmed = () => {
    const id = activeTaskId;
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: true, remaining: 0 } : t)));
    setActiveTaskId(null);
    setSecondsLeft(0);
    setShowFinishPrompt(false);
  };

  // user selects "Not yet" in modal — give 1 minute and resume
  const finishTaskContinue = () => {
    // give 60s more and resume
    const id = activeTaskId;
    const give = 60;
    setSecondsLeft(give);
    setShowFinishPrompt(false);
    // restart interval
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);
  };

  // "Finish early" button behaviour: open modal (we pause timer)
  const openFinishPrompt = () => {
    clearInterval(timerRef.current);
    setShowFinishPrompt(true);
  };

  // helper to render time text for a block (minimal UI change)
  const renderBlockTimeText = (task) => {
    if (activeTaskId === task.id) {
      const mm = Math.floor(secondsLeft / 60);
      const ss = secondsLeft % 60;
      return `${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")} left`;
    }
    if (task.completed) return "done";
    return `${task.duration} min`;
  };

  // Start-first-button behavior (keeps UI same, just hooks functionality)
  const startFirstTask = () => {
    if (!tasks || tasks.length === 0) return;
    const first = tasks[0];
    startTask(first);
  };

  // compute activeTask object for UI
  const activeTask = tasks.find(t => t.id === activeTaskId) ?? null;
  const progressPct = activeTask ? Math.max(0, Math.min(100, (secondsLeft / ((activeInitialSecRef.current || 1))) * 100)) : 0;

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

        {/* ----- Active Task Timer Panel (added, small UI block) ----- */}
        {activeTask && (
          <div style={{
            marginTop: 12,
            marginBottom: 18,
            padding: "14px",
            borderRadius: "14px",
            background: "linear-gradient(90deg, rgba(167,211,167,0.14), rgba(111,175,111,0.10))",
            border: "1px solid rgba(111,175,111,0.12)"
          }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#3B6E3B" }}>🌿 Current Task</div>
            <div style={{ fontSize: "18px", fontWeight: 800, marginTop: 6 }}>{activeTask.name}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "1px" }}>
                {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: "#eaf7ea", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg,#4F7A4F,#6FAF6F)",
                    transition: "width 0.4s linear"
                  }} />
                </div>
                <div style={{ fontSize: 12, color: "#4B6B4B", marginTop: 6 }}>
                  {Math.max(0, Math.floor((activeInitialSecRef.current - secondsLeft) / 60))} / {Math.ceil((activeInitialSecRef.current || 1) / 60)} min
                </div>
              </div>

              <div>
                <button
                  onClick={openFinishPrompt}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 9999,
                    border: "1px solid rgba(59,110,59,0.14)",
                    background: "#fff",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Finish early
                </button>
              </div>
            </div>
          </div>
        )}

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
                      overflow: "hidden",
                      opacity: task.completed ? 0.6 : 1
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
                        {task.name}{task.completed ? " (done)" : ""}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B8E6B" }}>
                        {minutesToHHMM(task.start)} — {minutesToHHMM(task.end)} • {renderBlockTimeText(task)}
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
            <button className="btn primary" onClick={startFirstTask}>
              Start First Task →
            </button>
          </div>
        )}

        {/* ---------- Finish Modal (in-app) ---------- */}
        {showFinishPrompt && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "#fff",
              padding: 22,
              borderRadius: 16,
              width: "92%",
              maxWidth: 420,
              textAlign: "center",
              boxShadow: "0 30px 80px rgba(0,0,0,0.25)"
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#123a12" }}>Task finished?</div>
              <p style={{ marginTop: 8, color: "#4B6B4B" }}>
                Did you complete <strong>{activeTask?.name}</strong>?
              </p>

              <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                <button
                  onClick={() => {
                    // Not yet: give a minute and resume
                    finishTaskContinue();
                  }}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 9999,
                    border: "1px solid #ddd",
                    background: "#fff",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Not yet
                </button>

                <button
                  onClick={() => {
                    // Yes done
                    finishTaskConfirmed();
                  }}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 9999,
                    border: "none",
                    background: "linear-gradient(90deg,#4F7A4F,#6FAF6F)",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer"
                  }}
                >
                  Yes, done
                </button>
              </div>

              <button
                onClick={() => {
                  // close modal and resume with small extra time if user accidentally opened it
                  setShowFinishPrompt(false);
                  if (activeTaskId) {
                    setSecondsLeft(prev => Math.max(1, prev));
                    timerRef.current = setInterval(() => setSecondsLeft(s => s - 1), 1000);
                  }
                }}
                style={{ marginTop: 12, background: "transparent", border: "none", color: "#666", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
