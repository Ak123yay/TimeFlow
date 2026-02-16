import { useEffect, useState, useRef } from "react";
import { loadAvailability, getUnfinishedTasksFromPreviousDays, saveTasksForDate, loadTasksForDate, addTaskToWeeklyPool } from "../utils/storage";
import { rescheduleUnfinishedTasks, detectConflicts, calculateOverflow, getDeadlineUrgency, detectPotentialConflicts, getTaskHealth } from "../utils/scheduler";
import TaskHealthIndicator from "./TaskHealthIndicator";
import {
  saveTaskToHistory,
  calculateDurationAccuracy,
  trackRescheduleOption,
  trackCompletionByHour,
  trackAttemptByHour,
  suggestDuration
} from "../utils/analytics";
import { updateStreak, markMeaningfulAction, loadStreak } from "../utils/streaks";
import DetailedTimeline from "./DetailedTimeline";
import Celebration from "./Celebration";
import RescheduleModal from "./dialogs/RescheduleModal";
import EditTaskDialog from "./dialogs/EditTaskDialog";
import StreakDisplay from "./StreakDisplay";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// Sortable Task Item Component
function SortableTaskItem({ task, children, onClick, style: customStyle, className, onMouseEnter, onMouseLeave, sectionHasMultipleItems = true, ...otherProps }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: !sectionHasMultipleItems });

  const style = {
    transform: isDragging
      ? `${CSS.Transform.toString(transform)} scale(1.02)`
      : CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
    zIndex: isDragging ? 1000 : 'auto',
    boxShadow: isDragging
      ? '0 10px 40px rgba(59, 110, 59, 0.25), 0 0 0 1px rgba(111, 175, 111, 0.4)'
      : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ position: 'relative' }}>
        {/* Drag Handle - only show if section has multiple items */}
        {sectionHasMultipleItems && (
          <div
            {...attributes}
            {...listeners}
            style={{
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: isDragging ? 'grabbing' : 'grab',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              opacity: 0.4,
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.4';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: '#6FAF6F',
                }}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: '#6FAF6F',
                }}
              />
            ))}
          </div>
        )}

        {/* Task Content - Apply custom props here */}
        <div
          style={{
            paddingLeft: sectionHasMultipleItems ? '20px' : '0px',
            pointerEvents: 'auto',  // Ensure clicks work even when sortable is disabled
            ...customStyle
          }}
          className={className}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          {...otherProps}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Today({ onEndDay, onShowWeek, onShowPool }) {
  const availability = loadAvailability();

  // View mode state
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('preferredView') || 'list';
    } catch {
      return 'list';
    }
  });

  // Streak state
  const [streak, setStreak] = useState(() => loadStreak());

  // --- keep original UI state names ---
  const [tasks, setTasks] = useState(() => loadTasks());
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [durationSuggestion, setDurationSuggestion] = useState(null);
  const [hasLoadedCarryOver, setHasLoadedCarryOver] = useState(false);

  // --- TIMER STATE (non-UI changes) ---
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);
  // store the initial seconds at start to calculate remaining if user says "not finished"
  const activeInitialSecRef = useRef(0);

  // Reschedule modal state (replaces showFinishPrompt)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Edit task dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Focus mode state
  const [focusModeEnabled, setFocusModeEnabled] = useState(() => {
    try {
      return localStorage.getItem('focusModeEnabled') === 'true';
    } catch {
      return false;
    }
  });

  const toggleFocusMode = () => {
    const newValue = !focusModeEnabled;
    setFocusModeEnabled(newValue);
    try {
      localStorage.setItem('focusModeEnabled', newValue.toString());
    } catch (e) {
      console.error('Failed to save focus mode preference', e);
    }

    // STREAK: Mark meaningful action when activating focus mode
    if (newValue) {
      markMeaningfulAction();
      const updatedStreak = updateStreak();
      setStreak(updatedStreak);
    }

    // Show toast notification
    setShowFocusModeToast(true);
    setTimeout(() => setShowFocusModeToast(false), 2000);
  };

  // Keyboard shortcut for focus mode (F key)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        // Only if not typing in an input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          toggleFocusMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [focusModeEnabled]);

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(null); // null | 'task' | 'allDone'

  // Focus mode toast state
  const [showFocusModeToast, setShowFocusModeToast] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);

        // Persist to localStorage
        saveTasks(reordered);

        return reordered;
      });
    }
  };

  // Check if all tasks are done
  useEffect(() => {
    const allDone = tasks.length > 0 && tasks.every(t => t.completed);
    if (allDone && !showCelebration) {
      setShowCelebration('allDone');
    }
  }, [tasks, showCelebration]);

  // Load unfinished tasks from previous days on mount
  useEffect(() => {
    if (hasLoadedCarryOver) return;
    
    const unfinishedTasks = getUnfinishedTasksFromPreviousDays();
    if (unfinishedTasks.length > 0) {
      const todayTasks = loadTasks();
      const rescheduled = rescheduleUnfinishedTasks(unfinishedTasks, todayTasks, availability);
      setTasks(rescheduled);
      setHasLoadedCarryOver(true);
    } else {
      setHasLoadedCarryOver(true);
    }
  }, [availability, hasLoadedCarryOver]);

  // persist tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // ANALYTICS: Get duration suggestion when task name changes
  useEffect(() => {
    if (taskName.trim().length >= 3) {
      const suggestion = suggestDuration(taskName);
      setDurationSuggestion(suggestion);
    } else {
      setDurationSuggestion(null);
    }
  }, [taskName]);

  // DEADLINE: Auto-escalate priority when deadline approaches
  useEffect(() => {
    const updated = tasks.map(task => {
      const urgency = getDeadlineUrgency(task);
      if (urgency && urgency.level === 'today' && !task.escalatedPriority) {
        return {
          ...task,
          originalPriority: task.priority || 3,
          priority: 5,
          escalatedPriority: true
        };
      }
      return task;
    });
    if (JSON.stringify(updated) !== JSON.stringify(tasks)) {
      setTasks(updated);
    }
  }, [tasks]);

  // STREAK: Update streak on mount and refresh periodically
  useEffect(() => {
    const refreshStreak = () => {
      const updatedStreak = updateStreak();
      setStreak(updatedStreak);
    };

    // Update on mount
    refreshStreak();

    // Refresh every hour to check for day changes
    const interval = setInterval(refreshStreak, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
      // NEW: Add rescheduling tracking fields
      attempts: 0,
      scheduledFor: startTime
        ? new Date(`${getTodayString()}T${startTime}`).toISOString()
        : null,
      lastRescheduled: null,
      rescheduledReasons: [],
      // ANALYTICS: Duration tracking fields
      estimatedDuration: parseInt(taskDuration, 10), // Original user estimate
      actualDuration: null,                          // Set when completed
      durationHistory: [],                           // Last 5 completions (populated from history)
      durationAccuracy: null,                        // Calculated after completion
      startedAt: null,                               // When timer starts
      completedAt: null,                             // When task completes
      // DEADLINE: Escalation tracking fields
      deadline: taskDeadline || null,                // ISO date string
      deadlineWarnings: [],                          // History of warnings shown
      escalatedPriority: false,                      // Auto-increased priority?
      originalPriority: 3                            // Priority before escalation (default: 3)
    };

    // CONFLICT PREVENTION: Check for scheduling conflicts
    const conflictCheck = detectPotentialConflicts(newTask, tasks);

    if (conflictCheck) {
      // Handle direct overlaps - block task addition
      if (conflictCheck.conflicts.length > 0) {
        alert(`Cannot add task: ${conflictCheck.conflicts[0].message}\n\nPlease choose a different time or adjust the conflicting task.`);
        return; // Block task addition
      }

      // Handle buffer warnings - show warning but allow
      if (conflictCheck.warnings.length > 0) {
        const proceed = confirm(`⚠️ ${conflictCheck.warnings[0].message}\n\nAdd task anyway?`);
        if (!proceed) return;
      }
    }

    setTasks(prev => [...prev, newTask]);
    setTaskName("");
    setTaskDuration("");
    setTaskStartTime("");
    setTaskDeadline("");
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

  const toggleView = () => {
    const newView = viewMode === 'list' ? 'calendar' : 'list';
    setViewMode(newView);
    try {
      localStorage.setItem('preferredView', newView);
    } catch (e) {
      console.error('Failed to save view preference', e);
    }
  };

  // compute simple sequential scheduling (unchanged UI behavior)
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const startM = hhmmToMinutes(availability?.start || "09:00");
  const endM = hhmmToMinutes(availability?.end || "17:00");
  const availableM = endM - startM;
//hi
  const taskBlocks = tasks.map((task, index) => {
    let currentTime = startM;
    // Calculate start time by summing all previous tasks
    for (let i = 0; i < index; i++) {
      if (!tasks[i].startTime) {
        currentTime += tasks[i].duration;
      }
    }
    const start = task.startTime ? hhmmToMinutes(task.startTime) : currentTime;
    const end = start + task.duration;
    return { ...task, start, end };
  });

  // Detect conflicts and overflow using enhanced scheduler
  const conflicts = detectConflicts(taskBlocks);
  const overflowData = calculateOverflow(tasks, availability);
  const overflowing = overflowData.severity !== 'none';
  const freeTime = Math.max(0, availableM - totalMinutes);

  // Helper to check if a task has conflicts
  const hasConflict = (taskId) => {
    return conflicts.some(c => c.task1.id === taskId || c.task2.id === taskId);
  };

  // Check if current time indicates a task is running late
  const isLate = (task) => {
    if (task.completed || !task.end) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes > task.end && activeTaskId === task.id;
  };

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

    // ANALYTICS: Track when task starts
    setTasks(prev => prev.map(x =>
      x.id === t.id ? { ...x, startedAt: new Date().toISOString() } : x
    ));
    trackAttemptByHour(new Date().toISOString());

    // STREAK: Mark meaningful action when starting a task
    markMeaningfulAction();
    const updatedStreak = updateStreak();
    setStreak(updatedStreak);

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
      setShowRescheduleModal(true);
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
    setShowRescheduleModal(true);
  }, [secondsLeft, activeTaskId]);

  // NEW: Handler for marking task complete
  const handleComplete = () => {
    const completedTask = tasks.find(t => t.id === activeTaskId);
    if (!completedTask) return;

    // ANALYTICS: Calculate actual duration and accuracy
    const completedAt = new Date().toISOString();
    const startedAt = completedTask.startedAt || completedAt; // Fallback if not tracked
    const actualDuration = Math.round((new Date(completedAt) - new Date(startedAt)) / (1000 * 60));
    const durationAccuracy = calculateDurationAccuracy(
      completedTask.estimatedDuration || completedTask.duration,
      actualDuration
    );

    // Update task with completion data
    setTasks(prev => prev.map(t =>
      t.id === activeTaskId
        ? {
            ...t,
            completed: true,
            remaining: 0,
            completedAt,
            actualDuration,
            durationAccuracy
          }
        : t
    ));

    // ANALYTICS: Save to history for future duration predictions
    const taskToSave = {
      ...completedTask,
      completedAt,
      actualDuration,
      durationAccuracy
    };
    saveTaskToHistory(taskToSave);
    trackCompletionByHour(taskToSave);
    trackRescheduleOption('complete');

    // STREAK: Mark meaningful action when completing a task
    markMeaningfulAction();
    const updatedStreak = updateStreak();
    setStreak(updatedStreak);

    clearInterval(timerRef.current);
    setActiveTaskId(null);
    setSecondsLeft(0);
    setShowRescheduleModal(false);

    // Trigger celebration
    const willAllBeDone = tasks.filter(t => t.id !== activeTaskId).every(t => t.completed);
    if (!willAllBeDone) {
      setShowCelebration('task');
      setTimeout(() => setShowCelebration(null), 3000);
    }
  };

  // NEW: Handler for continuing task (+1 min)
  const handleContinue = () => {
    const remainingMinutes = Math.ceil(secondsLeft / 60);
    setTasks(prev => prev.map(t =>
      t.id === activeTaskId ? { ...t, remaining: remainingMinutes } : t
    ));
    setSecondsLeft(60);
    setShowRescheduleModal(false);

    // ANALYTICS: Track option selection
    trackRescheduleOption('continue');

    // Resume timer
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);
  };

  // NEW: Handler for rescheduling to later today
  const handleLaterToday = (slot) => {
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task || !slot) return;

    // Update task with new time and increment attempts
    setTasks(prev => prev.map(t =>
      t.id === activeTaskId
        ? {
            ...t,
            startTime: slot.startTime,
            scheduledFor: new Date(`${getTodayString()}T${slot.startTime}`).toISOString(),
            attempts: (t.attempts || 0) + 1,
            lastRescheduled: new Date().toISOString(),
            rescheduledReasons: [...(t.rescheduledReasons || []), 'later_today']
          }
        : t
    ));

    // ANALYTICS: Track option selection
    trackRescheduleOption('later_today');

    // Stop timer and close modal
    clearInterval(timerRef.current);
    setActiveTaskId(null);
    setSecondsLeft(0);
    setShowRescheduleModal(false);
  };

  // NEW: Handler for rescheduling to tomorrow
  const handleTomorrow = () => {
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().slice(0, 10);
    const tomorrowTasks = loadTasksForDate(tomorrowDate);

    const rescheduledTask = {
      ...task,
      id: Date.now() + Math.random(),
      carriedOver: true,
      originalDate: getTodayString(),
      remaining: task.remaining || task.duration,
      attempts: (task.attempts || 0) + 1,
      lastRescheduled: new Date().toISOString(),
      rescheduledReasons: [...(task.rescheduledReasons || []), 'tomorrow'],
      startTime: null,
      scheduledFor: null
    };

    tomorrowTasks.push(rescheduledTask);
    saveTasksForDate(tomorrowDate, tomorrowTasks);
    setTasks(prev => prev.filter(t => t.id !== activeTaskId));

    // ANALYTICS: Track option selection
    trackRescheduleOption('tomorrow');

    clearInterval(timerRef.current);
    setActiveTaskId(null);
    setSecondsLeft(0);
    setShowRescheduleModal(false);
  };

  // NEW: Handler for moving task back to weekly pool
  const handleBackToPool = () => {
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    // Add to weekly pool
    const poolTask = {
      name: task.name,
      duration: task.remaining || task.duration,
      inWeeklyPool: true,
      createdAt: new Date().toISOString(),
      movedToTodayCount: task.movedToTodayCount || 0
    };
    addTaskToWeeklyPool(poolTask);

    // Remove from today's tasks
    setTasks(prev => prev.filter(t => t.id !== activeTaskId));

    // ANALYTICS: Track option selection
    trackRescheduleOption('back_to_pool');

    // Stop timer and close modal
    clearInterval(timerRef.current);
    setActiveTaskId(null);
    setSecondsLeft(0);
    setShowRescheduleModal(false);
  };

  // NEW: Handler for picking a specific time (opens edit dialog)
  const handlePickTime = () => {
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    setShowRescheduleModal(false);
    clearInterval(timerRef.current);
    setActiveTaskId(null);
    setSecondsLeft(0);

    // ANALYTICS: Track option selection
    trackRescheduleOption('pick_time');

    // Open edit dialog
    setEditingTask(task);
    setShowEditDialog(true);
  };

  // Handler for saving edited task
  const handleSaveEditedTask = (updatedTask) => {
    setTasks(prev => prev.map(t =>
      t.id === updatedTask.id ? updatedTask : t
    ));
    setShowEditDialog(false);
    setEditingTask(null);
  };

  // Handler for clicking on a task to edit it
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditDialog(true);
  };

  // NEW: Handler for breaking task into smaller pieces
  const handleBreakTask = () => {
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    // Split into 2 tasks of half duration
    const halfDuration = Math.ceil((task.remaining || task.duration) / 2);

    // Part 1: Keeps the original time slot
    const part1 = {
      ...task,
      id: Date.now(),
      name: `${task.name} (Part 1)`,
      duration: halfDuration,
      remaining: halfDuration,
      attempts: 0, // Reset attempts for new tasks
      splitFrom: task.id
    };

    // Part 2: Unscheduled (no time assigned to avoid conflict)
    const part2 = {
      ...task,
      id: Date.now() + 1,
      name: `${task.name} (Part 2)`,
      duration: halfDuration,
      remaining: halfDuration,
      attempts: 0,
      splitFrom: task.id,
      // Clear timing info so it doesn't conflict with part1
      startTime: null,
      start: null,
      end: null,
      scheduledFor: null
    };

    // Remove original task and add two new ones
    setTasks(prev => [
      ...prev.filter(t => t.id !== activeTaskId),
      part1,
      part2
    ]);

    // ANALYTICS: Track option selection
    trackRescheduleOption('break_task');

    clearInterval(timerRef.current);
    setActiveTaskId(null);
    setSecondsLeft(0);
    setShowRescheduleModal(false);
  };

  // "Finish early" button behaviour: open modal (we pause timer)
  const openFinishPrompt = () => {
    clearInterval(timerRef.current);
    setShowRescheduleModal(true);
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={onEndDay}
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
              <span>🌙</span>
              <span>End Day</span>
            </button>
            <button
              onClick={onShowWeek}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid rgba(111,175,111,0.3)",
                background: "linear-gradient(135deg, rgba(167,211,167,0.1), rgba(111,175,111,0.05))",
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
              <span>📅</span>
              <span>Week</span>
            </button>
            <button
              onClick={onShowPool}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid rgba(111,175,111,0.3)",
                background: "linear-gradient(135deg, rgba(167,211,167,0.1), rgba(111,175,111,0.05))",
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
              <span>🌊</span>
              <span>Pool</span>
            </button>

            {/* Focus Mode Toggle */}
            <button
              onClick={toggleFocusMode}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: `2px solid ${focusModeEnabled ? "#3B6E3B" : "rgba(111,175,111,0.3)"}`,
                background: focusModeEnabled
                  ? "linear-gradient(135deg, #6FAF6F, #3B6E3B)"
                  : "linear-gradient(135deg, rgba(167,211,167,0.1), rgba(111,175,111,0.05))",
                color: focusModeEnabled ? "#fff" : "#3B6E3B",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: focusModeEnabled
                  ? "0 4px 12px rgba(59,110,59,0.3)"
                  : "0 2px 6px rgba(59,110,59,0.06)"
              }}
              onMouseEnter={(e) => {
                if (!focusModeEnabled) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,110,59,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                if (!focusModeEnabled) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(59,110,59,0.06)";
                }
              }}
              title="Press F to toggle (hides everything except active task)"
            >
              <span>{focusModeEnabled ? "🎯" : "👁️"}</span>
              <span>{focusModeEnabled ? "Focus On" : "Focus"}</span>
            </button>

            <button
              onClick={toggleView}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid rgba(111,175,111,0.3)",
                background: "linear-gradient(135deg, rgba(167,211,167,0.1), rgba(111,175,111,0.05))",
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
              <span>{viewMode === 'list' ? '📋' : '📅'}</span>
              <span>{viewMode === 'list' ? 'List' : 'Calendar'}</span>
            </button>
            <div className="header-decor" aria-hidden>
              <LeafIcon size={40} fill="#3B6E3B" />
            </div>
          </div>
        </div>

        {/* Streak Display (compact mode in header) */}
        {streak && streak.current > 0 && (
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
            <StreakDisplay streak={streak} compact={true} />
          </div>
        )}

        {/* Conditionally hide stats, form, and presets in full focus mode */}
        {!(focusModeEnabled && activeTaskId) && (
          <>
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
              <div className="preset-pill" style={{
                cursor: "default",
                minWidth: "140px",
                background: overflowData.severity === 'critical'
                  ? "linear-gradient(180deg, rgba(255,200,200,0.2), rgba(255,220,220,0.1))"
                  : overflowData.severity === 'warning'
                  ? "linear-gradient(180deg, rgba(255,230,200,0.15), rgba(255,240,220,0.08))"
                  : undefined,
                boxShadow: "0 2px 8px rgba(59,110,59,0.04)"
              }}>
                <div className="preset-text" style={{
                  color: overflowData.severity === 'critical'
                    ? "#b91c1c"
                    : overflowData.severity === 'warning'
                    ? "#ea580c"
                    : undefined
                }}>
                  {Math.floor(Math.abs(freeTime)/60)}h {Math.abs(freeTime)%60}m
                </div>
                <div className="preset-sub">
                  {overflowing ? `Overflow (${overflowData.severity})` : "Free Time"}
                </div>
              </div>
            </div>

            {/* Overflow Warning Banner */}
            {overflowing && (
              <div style={{
                marginBottom: "20px",
                padding: "14px 16px",
                background: overflowData.severity === 'critical'
                  ? "linear-gradient(135deg, rgba(185,28,28,0.12), rgba(185,28,28,0.06))"
                  : "linear-gradient(135deg, rgba(234,88,12,0.12), rgba(234,88,12,0.06))",
                border: overflowData.severity === 'critical'
                  ? "2px solid rgba(185,28,28,0.3)"
                  : "2px solid rgba(234,88,12,0.3)",
                borderRadius: "14px",
                animation: "fadeIn 0.3s ease-out"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  justifyContent: "space-between",
                  flexWrap: "wrap"
                }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: overflowData.severity === 'critical' ? "#b91c1c" : "#ea580c",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span>{overflowData.severity === 'critical' ? '🚨' : '⚠️'}</span>
                      <span>
                        {overflowData.severity === 'critical'
                          ? "Critical: Day overbooked!"
                          : "Warning: Schedule is tight"}
                      </span>
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: overflowData.severity === 'critical' ? "#7f1d1d" : "#7c2d12",
                      lineHeight: 1.4
                    }}>
                      {overflowData.overflowMinutes > 0
                        ? `You've scheduled ${Math.floor(overflowData.overflowMinutes / 60)}h ${overflowData.overflowMinutes % 60}m more than available time.`
                        : `Your schedule is at ${Math.round((totalMinutes / availableM) * 100)}% capacity.`
                      }
                      {overflowData.severity === 'critical' && ' Some tasks need to be rescheduled.'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: In future, this could open an OverflowWizard dialog
                      // For now, just scroll to the task list
                      alert('Suggestion: Review your task list and consider:\n• Moving less urgent tasks to tomorrow\n• Breaking large tasks into smaller pieces\n• Moving flexible tasks to the Weekly Pool');
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background: overflowData.severity === 'critical'
                        ? "linear-gradient(135deg, #b91c1c, #7f1d1d)"
                        : "linear-gradient(135deg, #ea580c, #c2410c)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                    }}
                  >
                    Help me fix this →
                  </button>
                </div>
              </div>
            )}

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
                {/* Duration Suggestion */}
                {durationSuggestion && !taskDuration && (
                  <div style={{
                    marginTop: "6px",
                    padding: "6px 10px",
                    background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
                    borderRadius: "8px",
                    border: "1px solid rgba(111,175,111,0.2)",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", color: "#3B6E3B", marginBottom: "2px" }}>
                        💡 Usually {durationSuggestion.suggested} min
                      </div>
                      <div style={{ fontSize: "11px", color: "#6B8E6B" }}>
                        Based on {Math.round(durationSuggestion.confidence)}% confidence ({durationSuggestion.min}-{durationSuggestion.max} min range)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTaskDuration(durationSuggestion.suggested.toString())}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid rgba(111,175,111,0.3)",
                        background: "#fff",
                        color: "#3B6E3B",
                        fontSize: "11px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #6FAF6F, #3B6E3B)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#3B6E3B";
                      }}
                    >
                      Use this
                    </button>
                  </div>
                )}
              </label>
            </div>

            {/* Deadline Field */}
            <div className="controls-row" style={{ marginTop: "12px" }}>
              <label className="control">
                <div className="control-label">Deadline (optional)</div>
                <div className="time-input">
                  <span style={{ fontSize: "16px" }}>📅</span>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    style={{ border: "none", outline: "none", flex: 1, background: "transparent", fontSize: "14px" }}
                  />
                </div>
              </label>
            </div>

            <button
              onClick={addTask}
              className="btn primary"
              style={{
                width: "100%",
                marginBottom: "18px",
                fontSize: "15px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              + Add Task
            </button>

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
          </>
        )}

        {/* Focus Mode Active Indicator */}
        {focusModeEnabled && activeTaskId && (
          <div style={{
            marginBottom: "24px",
            marginTop: "12px",
            padding: "12px 20px",
            background: "linear-gradient(135deg, rgba(111,175,111,0.15), rgba(59,110,59,0.08))",
            borderRadius: "12px",
            border: "1px solid rgba(111,175,111,0.3)",
            fontSize: "14px",
            fontWeight: "600",
            color: "#3B6E3B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            animation: "fadeIn 0.3s ease-out"
          }}>
            <span>🎯</span>
            <span>Focus Mode Active</span>
            <span style={{ fontSize: "12px", opacity: 0.7, fontWeight: "500" }}>(Press F or click button to exit)</span>
          </div>
        )}

        {/* ----- Active Task Timer Panel (added, small UI block) ----- */}
        {activeTask && (
          <div style={{
            marginTop: 12,
            marginBottom: 18,
            padding: "18px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
            border: "2px solid rgba(111,175,111,0.2)",
            boxShadow: "0 4px 16px rgba(59,110,59,0.08)",
            animation: "fadeIn 0.3s ease-out"
          }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#3B6E3B", textTransform: "uppercase", letterSpacing: "0.5px" }}>🌿 Current Task</div>
            <div style={{ fontSize: "20px", fontWeight: 900, marginTop: 8, color: "#123a12" }}>{activeTask.name}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
              <div style={{ 
                fontSize: "32px", 
                fontWeight: 900, 
                letterSpacing: "1px",
                fontVariantNumeric: "tabular-nums",
                color: "#3B6E3B",
                textShadow: "0 2px 4px rgba(59,110,59,0.1)"
              }}>
                {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ 
                  height: 10, 
                  background: "#eaf7ea", 
                  borderRadius: 9999, 
                  overflow: "hidden",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg,#4F7A4F,#6FAF6F)",
                    transition: "width 0.3s ease-out",
                    boxShadow: "0 0 8px rgba(79,122,79,0.3)"
                  }} />
                </div>
                <div style={{ fontSize: 13, color: "#4B6B4B", marginTop: 8, fontWeight: 600 }}>
                  {Math.max(0, Math.floor((activeInitialSecRef.current - secondsLeft) / 60))} / {Math.ceil((activeInitialSecRef.current || 1) / 60)} min
                </div>
              </div>

              <div>
                <button
                  onClick={openFinishPrompt}
                  className="btn ghost"
                  style={{
                    fontSize: 13,
                    padding: "10px 16px"
                  }}
                >
                  Finish early
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conditionally hide timeline and task lists in full focus mode */}
        {!(focusModeEnabled && activeTaskId) && (
          <>
            {/* Timeline */}
            <div className="timeline-wrap">
              <div className="timeline-scale">
                <span>{availability?.start || "09:00"}</span>
                <span>{viewMode === 'list' ? 'Your Timeline' : 'Calendar View'}</span>
                <span>{availability?.end || "17:00"}</span>
              </div>

          {viewMode === 'calendar' ? (
            <div style={{
              borderRadius: "14px",
              border: "1px solid rgba(111,175,111,0.15)",
              overflow: "hidden",
              background: "#fff",
              animation: "fadeIn 0.3s ease-out"
            }}>
              <DetailedTimeline tasks={taskBlocks} availability={availability} />
            </div>
          ) : (
          <div className="timeline-bar" style={{ height: "auto", minHeight: "120px", padding: "16px 12px" }}>
            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 20px", opacity: 0.6 }}>
                <LeafIcon size={36} fill="#C5D9C5" />
                <p className="muted" style={{ marginTop: "12px", fontSize: "13px" }}>Add tasks to see your timeline</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Carried Over Tasks Section */}
                {taskBlocks.filter(t => t.carriedOver).length > 0 && (
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      padding: "8px 12px",
                      background: "linear-gradient(90deg, rgba(255,165,0,0.08), rgba(255,165,0,0.04))",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,165,0,0.2)"
                    }}>
                      <span style={{ fontSize: "16px" }}>🍂</span>
                      <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#d97706" }}>
                        Carried from previous days ({taskBlocks.filter(t => t.carriedOver).length})
                      </h3>
                    </div>
                    <SortableContext
                      items={taskBlocks.filter(t => t.carriedOver).map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {(() => {
                        const carriedTasks = taskBlocks.filter(task => task.carriedOver).filter(task => {
                          if (focusModeEnabled && activeTaskId) {
                            if (task.id === activeTaskId) return true;
                            if (task.completed) return false;
                            const activeIndex = taskBlocks.findIndex(t => t.id === activeTaskId);
                            const currentIndex = taskBlocks.findIndex(t => t.id === task.id);
                            return currentIndex <= activeIndex;
                          }
                          return true;
                        });
                        const hasMultiple = carriedTasks.length > 1;

                        return carriedTasks.map((task, i) => {
                          const isActiveTask = activeTaskId === task.id;
                          const shouldDim = activeTaskId && !isActiveTask;
                          const health = getTaskHealth(task, tasks, availability);

                          return (
                            <SortableTaskItem
                              task={task}
                              key={task.id}
                              sectionHasMultipleItems={hasMultiple}
                              className={isActiveTask ? 'task-focused' : ''}
                            style={{
                              background: "linear-gradient(90deg, rgba(255,200,150,0.12), rgba(255,210,160,0.08))",
                              border: `2px solid ${health.color}`,
                              borderRadius: "12px",
                              padding: "14px 16px",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              position: "relative",
                              overflow: "hidden",
                              opacity: shouldDim ? 0.4 : (task.completed ? 0.6 : 1),
                              transition: "all 0.3s ease",
                              animation: "slideInFromLeft 0.4s ease-out",
                              boxShadow: hasConflict(task.id)
                                ? "0 2px 12px rgba(245,158,11,0.15)"
                                : isActiveTask
                                ? "0 0 0 3px rgba(111,175,111,0.3)"
                                : "0 2px 8px rgba(255,165,0,0.08)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,165,0,0.15)";
                              e.currentTarget.style.transform = "translateX(4px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(255,165,0,0.08)";
                              e.currentTarget.style.transform = "translateX(0)";
                            }}
                          >
                            <div style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "3px",
                              background: "linear-gradient(180deg, #f59e0b, #d97706)"
                            }} />

                            <div style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #f59e0b, #d97706)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: "700",
                              flexShrink: 0,
                              boxShadow: "0 4px 10px rgba(245,158,11,0.2)"
                            }}>
                              🍂
                            </div>

                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "15px", fontWeight: "700", color: "#c2410c", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                <span>{task.name}{task.completed ? " (done)" : ""}</span>
                                <button
                                  className="delete-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(task.id);
                                  }}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "50%",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    padding: 0,
                                    marginLeft: "4px"
                                  }}
                                >
                                  ×
                                </button>
                                {task.attempts > 0 && (
                                  <span style={{
                                    fontSize: "11px",
                                    padding: "2px 6px",
                                    background: "rgba(245,158,11,0.2)",
                                    color: "#d97706",
                                    borderRadius: "4px",
                                    fontWeight: "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px"
                                  }}>
                                    🔁 {task.attempts}x
                                  </span>
                                )}
                                {hasConflict(task.id) && (
                                  <span style={{
                                    fontSize: "11px",
                                    padding: "2px 6px",
                                    background: "rgba(245,158,11,0.15)",
                                    color: "#d97706",
                                    borderRadius: "4px",
                                    fontWeight: "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px"
                                  }}>
                                    ⚠️ Conflict
                                  </span>
                                )}
                                {(() => {
                                  const urgency = getDeadlineUrgency(task);
                                  if (!urgency) return null;
                                  return (
                                    <span style={{
                                      fontSize: "11px",
                                      padding: "2px 6px",
                                      background: urgency.level === 'overdue' || urgency.level === 'today'
                                        ? "rgba(220, 38, 38, 0.15)"
                                        : urgency.level === 'tomorrow'
                                        ? "rgba(245, 158, 11, 0.15)"
                                        : "rgba(251, 191, 36, 0.12)",
                                      color: urgency.color,
                                      borderRadius: "4px",
                                      fontWeight: "700",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "3px",
                                      animation: urgency.shouldBlock ? "focusPulse 2s ease-in-out infinite" : "none"
                                    }}>
                                      {urgency.level === 'overdue' ? "🔴" : urgency.level === 'today' ? "🔴" : urgency.level === 'tomorrow' ? "⚠️" : "📅"} {urgency.message}
                                    </span>
                                  );
                                })()}
                                <span style={{ fontSize: "11px", padding: "2px 6px", background: "rgba(255,165,0,0.2)", color: "#c2410c", borderRadius: "4px", fontWeight: "600" }}>from {task.originalDate}</span>
                                <TaskHealthIndicator health={health} compact={true} />
                              </div>
                              <div style={{ fontSize: "12px", color: "#92400e" }}>
                                {minutesToHHMM(task.start)} — {minutesToHHMM(task.end)} • {renderBlockTimeText(task)}
                              </div>
                              {task.attempts >= 3 && (
                                <div style={{
                                  fontSize: "11px",
                                  color: "#d97706",
                                  marginTop: "6px",
                                  padding: "4px 8px",
                                  background: "rgba(255,165,0,0.1)",
                                  borderRadius: "6px",
                                  border: "1px dashed rgba(245,158,11,0.3)"
                                }}>
                                  ⚠️ Consider breaking this into smaller steps
                                </div>
                              )}
                            </div>

                            {!task.completed && activeTaskId !== task.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startTask(task);
                                }}
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  border: "1px solid rgba(245,158,11,0.3)",
                                  background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))",
                                  color: "#c2410c",
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  boxShadow: "0 2px 4px rgba(245,158,11,0.1)",
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.2))";
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(245,158,11,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))";
                                  e.currentTarget.style.transform = "translateY(0)";
                                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(245,158,11,0.1)";
                                }}
                              >
                                Start →
                              </button>
                            )}
                          </SortableTaskItem>
                        );
                      });
                    })()}
                    </div>
                    </SortableContext>
                  </div>
                )}

                {/* Today's Tasks Section */}
                {taskBlocks.filter(t => !t.carriedOver).length > 0 && (
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      padding: "8px 12px",
                      background: "linear-gradient(90deg, rgba(111,175,111,0.08), rgba(111,175,111,0.04))",
                      borderRadius: "8px",
                      border: "1px solid rgba(111,175,111,0.2)"
                    }}>
                      <span style={{ fontSize: "16px" }}>🌿</span>
                      <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#3B6E3B" }}>
                        Today's tasks ({taskBlocks.filter(t => !t.carriedOver).length})
                      </h3>
                    </div>
                    <SortableContext
                      items={taskBlocks.filter(t => !t.carriedOver).map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {(() => {
                  const todayTasks = taskBlocks.filter(task => !task.carriedOver).filter(task => {
                    // In focus mode, hide completed tasks and future tasks (but show active task)
                    if (focusModeEnabled && activeTaskId) {
                      if (task.id === activeTaskId) return true;
                      if (task.completed) return false;
                      // Hide tasks after the active task
                      const activeIndex = taskBlocks.findIndex(t => t.id === activeTaskId);
                      const currentIndex = taskBlocks.findIndex(t => t.id === task.id);
                      return currentIndex <= activeIndex;
                    }
                    return true;
                  });
                  const hasMultiple = todayTasks.length > 1;

                  return todayTasks.map((task, i) => {
                    const isActiveTask = activeTaskId === task.id;
                    const shouldDim = activeTaskId && !isActiveTask;
                    const health = getTaskHealth(task, tasks, availability);

                    return (
                    <SortableTaskItem
                      task={task}
                      key={task.id}
                      sectionHasMultipleItems={hasMultiple}
                      className={isActiveTask ? 'task-focused' : ''}
                    style={{
                      background: "linear-gradient(90deg, rgba(167,211,167,0.12), rgba(111,175,111,0.08))",
                      border: `2px solid ${health.color}`,
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      position: "relative",
                      overflow: "hidden",
                      opacity: shouldDim ? 0.4 : (task.completed ? 0.6 : 1),
                      transition: "all 0.3s ease",
                      animation: "slideInFromLeft 0.4s ease-out",
                      boxShadow: hasConflict(task.id)
                        ? "0 2px 12px rgba(245,158,11,0.15)"
                        : isActiveTask
                        ? "0 0 0 3px rgba(111,175,111,0.3)"
                        : "0 2px 8px rgba(59,110,59,0.05)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,110,59,0.12)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(59,110,59,0.05)";
                      e.currentTarget.style.transform = "translateX(0)";
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
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span>{task.name}{task.completed ? " (done)" : ""}</span>
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            padding: 0,
                            marginLeft: "4px"
                          }}
                        >
                          ×
                        </button>
                        {task.attempts > 0 && (
                          <span style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            background: "rgba(245,158,11,0.2)",
                            color: "#d97706",
                            borderRadius: "4px",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px"
                          }}>
                            🔁 {task.attempts}x
                          </span>
                        )}
                        {hasConflict(task.id) && (
                          <span style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            background: "rgba(245,158,11,0.15)",
                            color: "#d97706",
                            borderRadius: "4px",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px"
                          }}>
                            ⚠️ Conflict
                          </span>
                        )}
                        {(() => {
                          const urgency = getDeadlineUrgency(task);
                          if (!urgency) return null;
                          return (
                            <span style={{
                              fontSize: "11px",
                              padding: "2px 6px",
                              background: urgency.level === 'overdue' || urgency.level === 'today'
                                ? "rgba(220, 38, 38, 0.15)"
                                : urgency.level === 'tomorrow'
                                ? "rgba(245, 158, 11, 0.15)"
                                : "rgba(251, 191, 36, 0.12)",
                              color: urgency.color,
                              borderRadius: "4px",
                              fontWeight: "700",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              animation: urgency.shouldBlock ? "focusPulse 2s ease-in-out infinite" : "none"
                            }}>
                              {urgency.level === 'overdue' ? "🔴" : urgency.level === 'today' ? "🔴" : urgency.level === 'tomorrow' ? "⚠️" : "📅"} {urgency.message}
                            </span>
                          );
                        })()}
                        {task.carriedOver && <span style={{ fontSize: "11px", padding: "2px 6px", background: "rgba(255,165,0,0.15)", color: "#d97706", borderRadius: "4px", fontWeight: "600" }}>from {task.originalDate}</span>}
                        <TaskHealthIndicator health={health} compact={true} />
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B8E6B" }}>
                        {minutesToHHMM(task.start)} — {minutesToHHMM(task.end)} • {renderBlockTimeText(task)}
                      </div>
                      {task.attempts >= 3 && (
                        <div style={{
                          fontSize: "11px",
                          color: "#d97706",
                          marginTop: "6px",
                          padding: "4px 8px",
                          background: "rgba(255,165,0,0.1)",
                          borderRadius: "6px",
                          border: "1px dashed rgba(245,158,11,0.3)"
                        }}>
                          ⚠️ Consider breaking this into smaller steps
                        </div>
                      )}
                    </div>

                    {!task.completed && activeTaskId !== task.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startTask(task);
                        }}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: "1px solid rgba(111,175,111,0.3)",
                          background: "linear-gradient(135deg, rgba(111,175,111,0.15), rgba(59,110,59,0.1))",
                          color: "#3B6E3B",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(111,175,111,0.1)",
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, rgba(111,175,111,0.25), rgba(59,110,59,0.2))";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(111,175,111,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, rgba(111,175,111,0.15), rgba(59,110,59,0.1))";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(111,175,111,0.1)";
                        }}
                      >
                        Start →
                      </button>
                    )}
                  </SortableTaskItem>
                  );
                });
              })()}
                    </div>
                    </SortableContext>
                  </div>
                )}
              </div>
              </DndContext>
            )}
          </div>
          )}
        </div>

          </>
        )}

        {/* ---------- Reschedule Modal ---------- */}
        {showRescheduleModal && activeTask && (
          <RescheduleModal
            task={activeTask}
            availability={availability}
            existingTasks={taskBlocks}
            onComplete={handleComplete}
            onContinue={handleContinue}
            onLaterToday={handleLaterToday}
            onTomorrow={handleTomorrow}
            onBackToPool={handleBackToPool}
            onPickTime={handlePickTime}
            onBreakTask={handleBreakTask}
            onClose={() => setShowRescheduleModal(false)}
          />
        )}

        {/* ---------- Edit Task Dialog ---------- */}
        {showEditDialog && editingTask && (
          <EditTaskDialog
            task={editingTask}
            onSave={handleSaveEditedTask}
            onClose={() => {
              setShowEditDialog(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* ---------- Celebration Animation ---------- */}
        {showCelebration && (
          <Celebration
            type={showCelebration}
            onComplete={() => setShowCelebration(null)}
          />
        )}

        {/* Focus Mode Toast */}
        {showFocusModeToast && (
          <div style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            background: focusModeEnabled
              ? "linear-gradient(135deg, #6FAF6F, #3B6E3B)"
              : "linear-gradient(135deg, rgba(167,211,167,0.95), rgba(111,175,111,0.9))",
            color: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            fontSize: "14px",
            fontWeight: "600",
            zIndex: 10000,
            animation: "fadeInToast 0.2s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>{focusModeEnabled ? "🎯" : "👁️"}</span>
            <span>{focusModeEnabled ? "Focus Mode ON" : "Focus Mode OFF"}</span>
            <span style={{ fontSize: "12px", opacity: 0.8 }}>
              {focusModeEnabled ? "(Press F to exit)" : "(Press F to enable)"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
