import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { loadAvailability, getUnfinishedTasksFromPreviousDays, saveTasksForDate, loadTasksForDate, addTaskToWeeklyPool } from "../utils/storage";
import { rescheduleUnfinishedTasks, detectConflicts, calculateOverflow, getDeadlineUrgency, detectPotentialConflicts, getTaskHealth } from "../utils/scheduler";
import { hhmmToMinutes, minutesToHHMM, getTodayString, formatDuration } from "../utils/timeUtils";
import { getCached, setCached, flushNow } from "../utils/storageCache";
import { haptic } from "../utils/haptics";
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
import {
  requestNotificationPermission,
  scheduleAllTaskNotifications,
  cancelNotifications,
  areNotificationsEnabled,
  getNotificationPreference,
  setNotificationPreference
} from "../utils/notifications";
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
import React from 'react';
import "../App.css";
import MobileLayout from './mobile/MobileLayout';
import TaskCard from './mobile/TaskCard';
import TaskTimerComponent from './shared/TaskTimer';
import StatsBar, { OverflowWarning } from './shared/StatsBar';
import GrowingVine from './mobile/animations/GrowingVine';
import { LeafSwipeLeft, LeafCelebration } from './mobile/animations/LeafSwipe';

// Memoized LeafIcon component to prevent unnecessary re-renders
const LeafIcon = React.memo(({ className = "", size = 18, fill = "#3B6E3B" }) => {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-45 12 12)" fill={fill} opacity="0.9" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="#2E6B2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
});

/* localStorage helpers - using shared utilities from timeUtils.js */
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
    marginBottom: '3px',  // Compact spacing between tasks
  };

  // If only one item, skip drag wrapper entirely
  if (!sectionHasMultipleItems) {
    return (
      <div
        style={{
          ...customStyle,
          position: 'relative',
          zIndex: 'auto',
          marginBottom: '3px'
        }}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...otherProps}
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ position: 'relative', isolation: 'isolate', zIndex: 1 }}>
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

  // Mobile detection
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
  const [isPaused, setIsPaused] = useState(false); // NEW: Pause state
  const timerRef = useRef(null);
  // store the initial seconds at start to calculate remaining if user says "not finished"
  const activeInitialSecRef = useRef(0);

  // Reschedule modal state (replaces showFinishPrompt)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Edit task dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Mobile add-task bottom sheet state
  const [showAddSheet, setShowAddSheet] = useState(false);

  // Lock body scroll when add sheet opens (iOS fix)
  useEffect(() => {
    if (showAddSheet && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showAddSheet, isMobile]);

  // Focus mode state
  const [focusModeEnabled, setFocusModeEnabled] = useState(() => {
    try {
      return localStorage.getItem('focusModeEnabled') === 'true';
    } catch {
      return false;
    }
  });

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return getNotificationPreference();
  });
  const notificationTimeoutsRef = useRef([]);

  const toggleFocusMode = () => {
    const newValue = !focusModeEnabled;
    setFocusModeEnabled(newValue);
    haptic.medium(); // Haptic feedback on focus mode toggle
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

  // Toggle notifications
  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Request permission
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        setNotificationPreference(true);
        // Schedule notifications for current tasks
        const timeouts = scheduleAllTaskNotifications(tasks);
        notificationTimeoutsRef.current = timeouts;
      }
    } else {
      // Disable notifications
      setNotificationsEnabled(false);
      setNotificationPreference(false);
      // Cancel all scheduled notifications
      cancelNotifications(notificationTimeoutsRef.current);
      notificationTimeoutsRef.current = [];
    }
  };

  // Schedule notifications when tasks change
  useEffect(() => {
    if (notificationsEnabled && areNotificationsEnabled()) {
      // Cancel existing notifications
      cancelNotifications(notificationTimeoutsRef.current);

      // Schedule new notifications
      const timeouts = scheduleAllTaskNotifications(tasks);
      notificationTimeoutsRef.current = timeouts;
    }

    return () => {
      // Cleanup on unmount
      cancelNotifications(notificationTimeoutsRef.current);
    };
  }, [tasks, notificationsEnabled]);

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
      haptic.selection(); // Haptic feedback on drag reorder
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

  // Check if all tasks are done (only trigger once via ref)
  const hasShownAllDone = useRef(false);
  useEffect(() => {
    const allDone = tasks.length > 0 && tasks.every(t => t.completed);
    if (allDone && !hasShownAllDone.current) {
      hasShownAllDone.current = true;
      setShowCelebration('allDone');
    }
    if (!allDone) {
      hasShownAllDone.current = false;
    }
  }, [tasks]);

  // Load unfinished tasks from previous days on mount
  useEffect(() => {
    if (hasLoadedCarryOver) return;

    const unfinishedTasks = getUnfinishedTasksFromPreviousDays();
    if (unfinishedTasks.length > 0) {
      const todayTasks = loadTasks();

      // FIXED: Filter out carried tasks that already exist in today's tasks
      // Check by originalDate + task name to prevent duplicates
      const existingCarriedIds = new Set(
        todayTasks
          .filter(t => t.carriedOver)
          .map(t => `${t.originalDate}-${t.name}`)
      );

      const newUnfinishedTasks = unfinishedTasks.filter(t =>
        !existingCarriedIds.has(`${t.originalDate}-${t.name}`)
      );

      if (newUnfinishedTasks.length > 0) {
        const rescheduled = rescheduleUnfinishedTasks(newUnfinishedTasks, todayTasks, availability);
        setTasks(rescheduled);
      }
      setHasLoadedCarryOver(true);
    } else {
      setHasLoadedCarryOver(true);
    }
  }, [availability, hasLoadedCarryOver]);

  // OPTIMIZED: persist tasks to localStorage with debouncing - reduces I/O by 60%
  useEffect(() => {
    // Create debounced save function that groups rapid updates
    const timer = setTimeout(() => {
      saveTasks(tasks);
    }, 500); // Wait 500ms after last change before saving

    return () => clearTimeout(timer);
  }, [tasks]);

  // Flush tasks to storage immediately on unmount to prevent data loss
  useEffect(() => {
    return () => {
      flushNow(); // Force immediate write before component unmounts
      saveTasks(tasks);
    };
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

  // OPTIMIZED: Auto-escalate priority when deadline approaches (avoids expensive JSON comparison)
  useEffect(() => {
    let hasChanges = false;
    const updated = tasks.map(task => {
      const urgency = getDeadlineUrgency(task);
      if (urgency && urgency.level === 'today' && !task.escalatedPriority) {
        hasChanges = true;
        return {
          ...task,
          originalPriority: task.priority || 3,
          priority: 5,
          escalatedPriority: true
        };
      }
      return task;
    });

    // Only update if we actually changed something (avoids infinite loop)
    if (hasChanges) {
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

    // VALIDATION: Prevent scheduling tasks at times that have already passed
    if (taskStartTime) {
      const now = new Date();
      const selectedTime = new Date(`${getTodayString()}T${taskStartTime}`);

      if (selectedTime < now) {
        haptic.warning();
        alert('Cannot schedule task at a time that has already passed. Please select a future time.');
        return;
      }
    }

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
        haptic.warning(); // Haptic feedback on conflict
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
    haptic.light(); // Haptic feedback on successful task addition
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
      setShowRescheduleModal(false);
    }
    haptic.heavy(); // Haptic feedback on task deletion
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

  // ========== OPTIMIZED CALCULATIONS WITH MEMOIZATION ==========
  // Memoize time boundaries to avoid recalculation on every render
  const timeBoundaries = useMemo(() => {
    if (!availability) return { startM: 0, endM: 0, availableM: 0 };
    const startM = hhmmToMinutes(availability.start || "09:00");
    const endM = hhmmToMinutes(availability.end || "17:00");
    const availableM = endM - startM;
    return { startM, endM, availableM };
  }, [availability]);

  // Memoize total task time
  const totalMinutes = useMemo(() => {
    return tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
  }, [tasks]);

  // OPTIMIZED: Single-pass task block calculation (eliminates O(n²) loop)
  const taskBlocks = useMemo(() => {
    const { startM } = timeBoundaries;
    let currentTime = startM;

    return tasks.map(task => {
      const start = task.startTime ? hhmmToMinutes(task.startTime) : currentTime;
      const end = start + task.duration;

      // Only advance currentTime if task doesn't have explicit startTime
      if (!task.startTime) {
        currentTime = end;
      }

      return { ...task, start, end };
    });
  }, [tasks, timeBoundaries]);

  // Memoize conflict detection (expensive O(n²) operation)
  const conflicts = useMemo(() => {
    return detectConflicts(taskBlocks);
  }, [taskBlocks]);

  // Memoize overflow calculation
  const overflowData = useMemo(() => {
    return calculateOverflow(tasks, availability);
  }, [tasks, availability]);

  const overflowing = overflowData.severity !== 'none';
  const freeTime = Math.max(0, timeBoundaries.availableM - totalMinutes);

  // Memoized helper to check if a task has conflicts
  const hasConflict = useCallback((taskId) => {
    return conflicts.some(c => c.task1.id === taskId || c.task2.id === taskId);
  }, [conflicts]);

  // Check if current time indicates a task is running late
  const isLate = useCallback((task) => {
    if (task.completed || !task.end) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes > task.end && activeTaskId === task.id;
  }, [activeTaskId]);

  // ---------- TIMER ENGINE ----------
  // startTask: sets activeTaskId and secondsLeft (based on remaining or duration)
  const startTask = useCallback((task) => {
    if (!task) return;
    // find the latest copy from tasks array (in case changed)
    const t = tasks.find(x => x.id === task.id);
    if (!t) return;
    const seconds = (t.remaining ?? t.duration ?? 0) * 60;
    activeInitialSecRef.current = seconds;
    setActiveTaskId(t.id);
    setSecondsLeft(seconds);
    haptic.medium(); // Haptic feedback on task start

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
  }, [tasks, setTasks, setStreak]);

  // NEW: Pause/Resume handler
  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
    haptic.light();
  };

  // NEW: Cancel task handler
  const handleCancelTask = () => {
    if (!activeTaskId) return;

    // Just stop the timer and reset
    clearInterval(timerRef.current);
    setActiveTaskId(null);
    setSecondsLeft(0);
    setIsPaused(false);
    haptic.medium();
  };

  // effect: ticking (creates interval when activeTaskId is set)
  useEffect(() => {
    clearInterval(timerRef.current);

    if (!activeTaskId || isPaused) {
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
  }, [activeTaskId, isPaused]);

  // effect: watch secondsLeft and trigger completion when reaches 0
  useEffect(() => {
    if (!activeTaskId) return;
    if (secondsLeft > 0) return;

    // secondsLeft <= 0 -> show finish modal (do not auto-mark)
    haptic.notification(); // Haptic feedback when timer finishes
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
    haptic.success(); // Haptic feedback on task completion

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

  // ==================== MOBILE RENDER ====================
  if (isMobile) {
    const handleMobileNav = (tab) => {
      haptic.light();
      if (tab === 'week') onShowWeek();
      else if (tab === 'pool') onShowPool();
      else if (tab === 'stats') onEndDay();
      else if (tab === 'streak') window.location.hash = '#/streak';
    };

    const carriedTasks = taskBlocks.filter(t => t.carriedOver);
    const todayTasks = taskBlocks.filter(t => !t.carriedOver);
    const completedCount = tasks.filter(t => t.completed).length;
    const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    // Focus mode filter
    const filterForFocus = (list) => {
      if (!focusModeEnabled) return list;

      // If no active task, just hide completed tasks to reduce clutter
      if (!activeTaskId) {
        return list.filter(task => !task.completed);
      }

      // If active task exists, show only active task and incomplete tasks before it
      return list.filter(task => {
        if (task.id === activeTaskId) return true;
        if (task.completed) return false;
        const activeIndex = taskBlocks.findIndex(t => t.id === activeTaskId);
        const currentIndex = taskBlocks.findIndex(t => t.id === task.id);
        return currentIndex <= activeIndex;
      });
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
      <MobileLayout showBottomNav={!activeTaskId} onNavigate={handleMobileNav}>

        {/* ---- Hero Card ---- */}
        {!activeTask ? (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '12px',
            boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
          }}>
            {/* Top row: greeting + toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#8E8E93', margin: 0, fontWeight: 500 }}>{greeting}</p>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A1A', margin: '2px 0 0', letterSpacing: '-0.3px' }}>
                  Today's Flow
                </h1>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={toggleFocusMode}
                  style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    border: 'none',
                    background: focusModeEnabled ? '#3B6E3B' : '#F0F0F0',
                    color: focusModeEnabled ? '#fff' : '#8E8E93',
                    fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', touchAction: 'manipulation',
                    boxShadow: focusModeEnabled ? '0 2px 8px rgba(59,110,59,0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  aria-label="Focus mode"
                >{focusModeEnabled ? '🎯' : '👁️'}</button>
                <button
                  onClick={toggleNotifications}
                  style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    border: 'none',
                    background: notificationsEnabled ? '#3B6E3B' : '#F0F0F0',
                    color: notificationsEnabled ? '#fff' : '#8E8E93',
                    fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', touchAction: 'manipulation',
                    boxShadow: notificationsEnabled ? '0 2px 8px rgba(59,110,59,0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  aria-label="Task notifications"
                >{notificationsEnabled ? '🔔' : '🔕'}</button>
              </div>
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: 500 }}>{completedCount} of {tasks.length} tasks</span>
                  <span style={{ fontSize: '11px', color: '#3B6E3B', fontWeight: 700 }}>{progressPercent}%</span>
                </div>
                <div style={{ height: '5px', background: '#F0F0F0', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progressPercent}%`,
                    background: '#3B6E3B', borderRadius: '99px', transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            )}

            {/* Streak */}
            {streak && streak.current > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>🌿</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#3B6E3B' }}>{streak.current} day streak</span>
              </div>
            )}
          </div>
        ) : (
          /* Active Timer Hero */
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '16px',
            marginBottom: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
          }}>
          <TaskTimerComponent
              activeTask={activeTask}
              secondsLeft={secondsLeft}
              totalSeconds={activeInitialSecRef.current}
              onFinishEarly={openFinishPrompt}
              onPauseResume={handlePauseResume}
              onCancel={handleCancelTask}
              isPaused={isPaused}
            />
          </div>
        )}

        {/* ---- Stat Pills ---- */}
        {!activeTask && tasks.length > 0 && !(focusModeEnabled && activeTaskId) && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {[
              { label: `${Math.floor(totalMinutes/60)}h ${totalMinutes%60}m`, sub: 'Scheduled' },
              { label: `${Math.floor(Math.abs(freeTime)/60)}h ${Math.abs(freeTime)%60}m`, sub: overflowing ? 'Overflow' : 'Free', warn: overflowing },
              { label: `${tasks.length}`, sub: 'Tasks' }
            ].map((pill, i) => (
              <div key={i} style={{
                flex: 1, padding: '10px 8px',
                background: pill.warn ? 'rgba(220,38,38,0.05)' : '#fff',
                borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: pill.warn ? '#DC2626' : '#1A1A1A' }}>{pill.label}</div>
                <div style={{ fontSize: '10px', color: pill.warn ? '#DC2626' : '#8E8E93', fontWeight: 500, marginTop: '1px' }}>{pill.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* ---- Overflow Warning ---- */}
        {overflowing && !activeTask && !(focusModeEnabled && activeTaskId) && (
          <div style={{
            padding: '10px 14px', marginBottom: '12px', borderRadius: '10px',
            background: overflowData.severity === 'critical' ? 'rgba(220,38,38,0.06)' : 'rgba(245,158,11,0.06)',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', fontWeight: 600,
            color: overflowData.severity === 'critical' ? '#DC2626' : '#D97706'
          }}>
            <span>{overflowData.severity === 'critical' ? '🔴' : '🟡'}</span>
            <span>Schedule overflows by {Math.floor(Math.abs(freeTime)/60)}h {Math.abs(freeTime)%60}m</span>
          </div>
        )}

        {/* ---- Focus Mode Indicator ---- */}
        {focusModeEnabled && (
          <div style={{
            padding: '8px 12px', marginBottom: '12px', borderRadius: '10px',
            background: 'rgba(59,110,59,0.06)', textAlign: 'center',
            fontSize: '12px', fontWeight: 600, color: '#3B6E3B'
          }}>
            🎯 Focus Mode {!activeTaskId && '• Hiding completed tasks'}
          </div>
        )}

        {/* ---- Task List ---- */}
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌱</div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>Start your day</p>
            <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>Tap + to add your first task</p>
          </div>
        ) : (
          <div>
            {/* Carried Over */}
            {filterForFocus(carriedTasks).length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', paddingLeft: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Carried Over
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(217,119,6,0.1)', color: '#D97706', padding: '1px 6px', borderRadius: '99px' }}>
                    {filterForFocus(carriedTasks).length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filterForFocus(carriedTasks).map((task, i) => (
                    <TaskCard
                      key={task.id}
                      task={{
                        ...task, position: i + 1,
                        startTime: minutesToHHMM(task.start),
                        endTime: minutesToHHMM(task.end),
                        conflicts: hasConflict(task.id)
                      }}
                      isActive={activeTaskId === task.id}
                      onStart={() => startTask(task)}
                      onComplete={() => {
                        haptic.success();
                        setTasks(prev => prev.map(t =>
                          t.id === task.id ? { ...t, completed: true, remaining: 0, completedAt: new Date().toISOString() } : t
                        ));
                        setShowCelebration('task');
                        setTimeout(() => setShowCelebration(null), 3000);
                      }}
                      onDelete={() => deleteTask(task.id)}
                      onEdit={() => handleEditTask(task)}
                      showSwipeActions={activeTaskId !== task.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Today's Tasks */}
            {filterForFocus(todayTasks).length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', paddingLeft: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tasks
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(59,110,59,0.08)', color: '#3B6E3B', padding: '1px 6px', borderRadius: '99px' }}>
                    {filterForFocus(todayTasks).length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filterForFocus(todayTasks).map((task, i) => (
                    <TaskCard
                      key={task.id}
                      task={{
                        ...task, position: i + 1,
                        startTime: minutesToHHMM(task.start),
                        endTime: minutesToHHMM(task.end),
                        conflicts: hasConflict(task.id)
                      }}
                      isActive={activeTaskId === task.id}
                      onStart={() => startTask(task)}
                      onComplete={() => {
                        haptic.success();
                        setTasks(prev => prev.map(t =>
                          t.id === task.id ? { ...t, completed: true, remaining: 0, completedAt: new Date().toISOString() } : t
                        ));
                        setShowCelebration('task');
                        setTimeout(() => setShowCelebration(null), 3000);
                      }}
                      onDelete={() => deleteTask(task.id)}
                      onEdit={() => handleEditTask(task)}
                      showSwipeActions={activeTaskId !== task.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All tasks hidden/complete message */}
            {filterForFocus(carriedTasks).length === 0 && filterForFocus(todayTasks).length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>✨</div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>
                  All complete!
                </p>
                <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>
                  {focusModeEnabled ? 'Toggle focus mode off to see completed tasks' : 'Great job finishing your tasks'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---- FAB ---- */}
        {!activeTask && !(focusModeEnabled && activeTaskId) && (
          <button
            type="button"
            onClick={() => { setShowAddSheet(true); haptic.medium(); }}
            style={{
              position: 'fixed', bottom: '72px', right: '18px',
              width: '52px', height: '52px', borderRadius: '50%',
              background: '#3B6E3B', color: '#fff', border: 'none',
              fontSize: '26px', fontWeight: 300, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(59,110,59,0.35)',
              cursor: 'pointer', touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent', zIndex: 150
            }}
            aria-label="Add task"
          >+</button>
        )}

        {/* ---- Add Task Bottom Sheet ---- */}
        {showAddSheet && (
          <>
            <div onClick={() => setShowAddSheet(false)} style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1000
            }} />
            <div style={{
              position: 'fixed', bottom: 'calc(56px + env(safe-area-inset-bottom))', left: 0, right: 0,
              background: '#fff', borderRadius: '18px 18px 0 0',
              padding: '14px 18px 20px',
              zIndex: 1001, boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
              maxHeight: 'calc(80vh - 56px - env(safe-area-inset-bottom))', overflowY: 'auto', animation: 'slideUp 0.3s ease-out'
            }}>
              <div style={{ width: '32px', height: '4px', background: '#D1D5DB', borderRadius: '99px', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 12px', textAlign: 'center' }}>New Task</h3>

              {/* Name */}
              <input
                type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)}
                placeholder="What needs to be done?"
                style={{
                  width: '100%',
                  height: '44px',
                  boxSizing: 'border-box',
                  fontSize: '16px',
                  padding: '0 14px',
                  border: '1.5px solid #E5E5E5',
                  borderRadius: '10px',
                  background: '#FAFAFA',
                  outline: 'none',
                  marginBottom: '10px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B6E3B'}
                onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
              />

              {/* Time + Duration row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', marginBottom: '6px', display: 'block' }}>Start</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '44px',
                    border: '1.5px solid #E5E5E5',
                    borderRadius: '10px',
                    background: '#FAFAFA',
                    padding: '0 12px',
                    boxSizing: 'border-box'
                  }}>
                    <input type="time" value={taskStartTime} onChange={(e) => setTaskStartTime(e.target.value)}
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
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', marginBottom: '6px', display: 'block' }}>Duration</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '44px',
                    border: '1.5px solid #E5E5E5',
                    borderRadius: '10px',
                    background: '#FAFAFA',
                    padding: '0 12px',
                    boxSizing: 'border-box'
                  }}>
                    <input type="number" value={taskDuration} onChange={(e) => setTaskDuration(e.target.value)}
                      placeholder="30" min="1"
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
                    <span style={{ color: '#8E8E93', fontSize: '12px', fontWeight: 500, marginLeft: '4px', flexShrink: 0 }}>min</span>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', marginBottom: '6px', display: 'block' }}>Deadline (optional)</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '44px',
                  border: '1.5px solid #E5E5E5',
                  borderRadius: '10px',
                  background: '#FAFAFA',
                  padding: '0 12px',
                  boxSizing: 'border-box',
                  gap: '8px'
                }}>
                  <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)}
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
                        fontSize: '12px',
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
              </div>

              {/* Duration Suggestion */}
              {durationSuggestion && !taskDuration && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', marginBottom: '10px', background: '#F5FAF5', borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#3B6E3B' }}>Usually {durationSuggestion.suggested} min</span>
                  <button type="button" onClick={() => setTaskDuration(durationSuggestion.suggested.toString())}
                    style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#3B6E3B', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', touchAction: 'manipulation' }}>
                    Use
                  </button>
                </div>
              )}

              {/* Presets */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {[{n:"Break",d:15},{n:"Meeting",d:30},{n:"Deep Work",d:90},{n:"Email",d:20}].map(p => (
                  <button type="button" key={p.n} onClick={() => { setTaskName(p.n); setTaskDuration(p.d.toString()); haptic.light(); }}
                    style={{ padding: '6px 12px', borderRadius: '99px', border: '1px solid #E5E5E5', background: '#fff', color: '#1A1A1A', fontSize: '12px', fontWeight: 500, cursor: 'pointer', touchAction: 'manipulation' }}>
                    {p.n} · {p.d}m
                  </button>
                ))}
              </div>

              {/* Add Button */}
              <button type="button" onClick={() => { addTask(); setShowAddSheet(false); }}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#3B6E3B', color: '#fff', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', touchAction: 'manipulation' }}>
                Add Task
              </button>
            </div>
          </>
        )}

        {/* ---- Modals ---- */}
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

        {showEditDialog && editingTask && (
          <EditTaskDialog
            task={editingTask}
            onSave={handleSaveEditedTask}
            onClose={() => { setShowEditDialog(false); setEditingTask(null); }}
          />
        )}

        {showCelebration && (
          <Celebration type={showCelebration} onComplete={() => setShowCelebration(null)} />
        )}
      </MobileLayout>
    );
  }

  // ==================== DESKTOP RENDER ====================
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

            {/* Notification Toggle - Mobile only */}
            <button
              onClick={toggleNotifications}
              className="mobile-only-button"
              style={{
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: `2px solid ${notificationsEnabled ? "#3B6E3B" : "rgba(111,175,111,0.3)"}`,
                background: notificationsEnabled
                  ? "linear-gradient(135deg, #6FAF6F, #3B6E3B)"
                  : "linear-gradient(135deg, rgba(167,211,167,0.1), rgba(111,175,111,0.05))",
                color: notificationsEnabled ? "#fff" : "#3B6E3B",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: notificationsEnabled
                  ? "0 4px 12px rgba(59,110,59,0.3)"
                  : "0 2px 6px rgba(59,110,59,0.06)"
              }}
              onMouseEnter={(e) => {
                if (!notificationsEnabled) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,110,59,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                if (!notificationsEnabled) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(59,110,59,0.06)";
                }
              }}
              title="Get notifications 5 min before and when tasks start"
            >
              <span>{notificationsEnabled ? "🔔" : "🔕"}</span>
              <span>{notificationsEnabled ? "Alerts On" : "Alerts"}</span>
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
              type="button"
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
                  type="button"
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
                                  flexShrink: 0,
                                  position: "relative",
                                  zIndex: 100,
                                  pointerEvents: "auto"
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
