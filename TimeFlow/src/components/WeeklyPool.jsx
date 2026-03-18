import { useState, useEffect } from "react";
import {
  loadWeeklyPool,
  addTaskToWeeklyPool,
  removeTaskFromWeeklyPool,
  loadTasksForDate,
  saveTasksForDate
} from "../utils/storage";
import { getDeadlineUrgency } from "../utils/scheduler";
import MoveToTodayDialog from "./dialogs/MoveToTodayDialog";
import MobileLayout from './mobile/MobileLayout';
import FirstTimeTooltip from './FirstTimeTooltip';
import { hasSeenTooltip, markTooltipSeen, TOOLTIP_CONTENT } from "../utils/firstTimeTooltips";
import { haptic } from "../utils/haptics";
import { useDarkMode } from "../utils/useDarkMode";
import SearchBar from './shared/SearchBar';
import "../App.css";
import {
  LeafIcon,
  WaterIcon,
  CalendarIcon,
} from '../icons';

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
  const isDark = useDarkMode();
  const [poolTasks, setPoolTasks] = useState(() => loadWeeklyPool());
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [taskToMove, setTaskToMove] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [showTooltip, setShowTooltip] = useState(() => !hasSeenTooltip('pool'));
  const [searchQuery, setSearchQuery] = useState('');

  // Filter function
  const filterTasksBySearch = (tasks) => {
    if (!searchQuery) return tasks;
    return tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery)
    );
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const addTaskToPool = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTaskName) return;

    haptic.success();
    const task = addTaskToWeeklyPool({
      name: newTaskName,
      deadline: newTaskDeadline || null
    });

    setPoolTasks([...poolTasks, task]);
    setNewTaskName("");
    setNewTaskDeadline("");
  };

  const handleMoveToToday = (task) => {
    haptic.light();
    setTaskToMove(task);
    setShowMoveDialog(true);
  };

  const confirmMoveToToday = (duration, startTime) => {
    removeTaskFromWeeklyPool(taskToMove.id);
    setPoolTasks(poolTasks.filter(t => t.id !== taskToMove.id));

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
    onNavigateToToday();
  };

  const deleteTask = (id) => {
    haptic.heavy();
    removeTaskFromWeeklyPool(id);
    setPoolTasks(poolTasks.filter(t => t.id !== id));
  };

  if (isMobile) {
    return (
      <MobileLayout showBottomNav={true} onNavigate={(tab) => {
        haptic.light();
        if (tab === 'today') onNavigateToToday();
        else if (tab === 'week') window.location.hash = '#/week';
        else if (tab === 'stats') window.location.hash = '#/reflection';
        else if (tab === 'streak') window.location.hash = '#/streak';
      }} activeTab="pool">

        {/* Header */}
        <div style={{ marginBottom: '12px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 2px', letterSpacing: '-0.3px' }}>
            Weekly Pool
          </h1>
          <p style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
            {poolTasks.length} tasks to work on this week
          </p>
        </div>

        {/* First-Time Tooltip */}
        {showTooltip && (
          <FirstTimeTooltip
            title={TOOLTIP_CONTENT.pool.title}
            description={TOOLTIP_CONTENT.pool.description}
            icon={TOOLTIP_CONTENT.pool.icon}
            onDismiss={() => {
              setShowTooltip(false);
              markTooltipSeen('pool');
            }}
          />
        )}

        {/* Add Task Form */}
        <div style={{
          background: isDark ? '#242B24' : '#fff', borderRadius: '18px', padding: '16px',
          marginBottom: '14px', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '44px',
            border: isDark ? '1.5px solid #6B7B6B' : '1.5px solid #E5E5E5',
            borderRadius: '14px',
            background: isDark ? '#1A1F1A' : '#FAFAFA',
            padding: '0 14px',
            boxSizing: 'border-box',
            marginBottom: '10px'
          }}>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="What do you want to work on?"
              style={{
                fontSize: '16px',
                padding: 0,
                border: 'none',
                outline: 'none',
                flex: 1,
                background: 'transparent',
                width: '100%',
                height: '100%',
                color: isDark ? '#E8F0E8' : '#1A1A1A'
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#9CA59C' : '#8E8E93', marginBottom: '6px', display: 'block' }}>
              Deadline (optional)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              border: isDark ? '1.5px solid #6B7B6B' : '1.5px solid #E5E5E5',
              borderRadius: '14px',
              background: isDark ? '#1A1F1A' : '#FAFAFA',
              padding: '0 12px',
              boxSizing: 'border-box'
            }}>
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                style={{
                  fontSize: '16px',
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  background: 'transparent',
                  width: '100%',
                  height: '100%',
                  color: isDark ? '#E8F0E8' : '#1A1A1A',
                  colorScheme: isDark ? 'dark' : 'light'
                }}
              />
            </div>
          </div>

          <button
            onClick={addTaskToPool}
            style={{
              width: '100%', padding: '12px',
              borderRadius: '14px', background: '#3B6E3B',
              color: '#fff', fontSize: '14px', fontWeight: 700,
              border: 'none', cursor: 'pointer', touchAction: 'manipulation'
            }}
          >
            + Add to Pool
          </button>
        </div>

        {/* SearchBar */}
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search pool tasks..."
        />

        {/* Pool Tasks List */}
        {filterTasksBySearch(poolTasks).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}><WaterIcon size={36} /></div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 4px' }}>
              {searchQuery ? 'No matching tasks' : 'Pool is empty'}
            </p>
            <p style={{ fontSize: '13px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
              {searchQuery ? 'Try a different search term' : 'Add tasks you want to work on this week'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filterTasksBySearch(poolTasks).map(task => {
              const urgency = task.deadline ? getDeadlineUrgency(task) : null;

              return (
                <div
                  key={task.id}
                  style={{
                    background: isDark ? '#242B24' : '#fff', borderRadius: '16px',
                    padding: '14px 16px', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
                    display: 'flex', flexDirection: 'column', gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', marginBottom: '4px' }}>
                      {task.name}
                    </div>
                    {urgency && (
                      <span style={{
                        fontSize: '10px', padding: '2px 8px',
                        background: urgency.color + '22',
                        color: urgency.color,
                        borderRadius: '99px', fontWeight: 600,
                        display: 'inline-block'
                      }}>
                        {urgency.message}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleMoveToToday(task)}
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: '12px',
                        background: '#3B6E3B', color: '#fff',
                        border: 'none', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', touchAction: 'manipulation'
                      }}
                    >
                      Move to Today →
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        background: '#FEE2E2', color: '#DC2626',
                        border: 'none', fontSize: '18px', fontWeight: 300,
                        cursor: 'pointer', touchAction: 'manipulation',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >×</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
      </MobileLayout>
    );
  }

  // Desktop render (unchanged)
  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card">
        <div className="setup-header" style={{ marginBottom: "22px" }}>
          <div className="header-left">
            <h1 className="title" style={{ fontSize: "24px", display: "flex", alignItems: "center", gap: "8px" }}>Weekly Pool <WaterIcon size={24} /></h1>
            <p className="muted" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <LeafIconLocal size={14} fill="#6B8E6B" />
              Tasks you want to work on this week ({poolTasks.length})
            </p>
          </div>
          <button onClick={onNavigateToToday} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 16px", borderRadius: "9999px",
            border: "1px solid rgba(111,175,111,0.3)",
            background: "linear-gradient(135deg, rgba(111,175,111,0.1), rgba(59,110,59,0.05))",
            color: "#3B6E3B", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(59,110,59,0.06)"
          }}>
            ← Back to Today
          </button>
        </div>

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

        <div className="controls-row" style={{ marginTop: "12px" }}>
          <label className="control">
            <div className="control-label">Deadline (optional)</div>
            <div className="time-input">
              <CalendarIcon size={16} />
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                style={{ border: "none", outline: "none", flex: 1, background: "transparent", fontSize: "14px" }}
              />
            </div>
          </label>
        </div>

        <button onClick={addTaskToPool} className="btn primary" style={{
          width: "100%", marginBottom: "18px", fontSize: "15px",
          position: "relative", overflow: "hidden"
        }}>
          + Add to Pool
        </button>

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
              {poolTasks.map(task => {
                const urgency = task.deadline ? getDeadlineUrgency(task) : null;

                return (
                  <div key={task.id} className="pool-task-card">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#3B6E3B" }}>
                        {task.name}
                      </div>
                      {urgency && (
                        <div style={{ marginTop: "4px" }}>
                          <span style={{
                            fontSize: "11px", padding: "3px 8px",
                            background: urgency.color + "22",
                            color: urgency.color,
                            borderRadius: "9999px", fontWeight: "600",
                            display: "inline-block"
                          }}>
                            {urgency.message}
                          </span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleMoveToToday(task)} className="btn primary" style={{
                      fontSize: 13, padding: "8px 16px"
                    }}>
                      Move to Today →
                    </button>
                    <button className="delete-button" onClick={() => deleteTask(task.id)}>
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
