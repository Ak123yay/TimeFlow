// src/utils/scheduler.js

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper: convert HH:MM to minutes
function hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Helper: convert minutes to HH:MM
function minutesToHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Helper: migrate old tasks to include new fields
export const migrateTask = (task) => ({
  priority: 3,              // default medium priority
  deadline: null,
  isFlexible: true,        // tasks can be moved by default
  conflicts: [],
  splitFrom: null,
  ...task                  // existing fields override defaults
});

// ============================================================================
// CORE SCHEDULING INTELLIGENCE
// ============================================================================

/**
 * Detect conflicts between tasks with overlapping time blocks
 * @param {Array} tasks - Tasks with start and end times (in minutes)
 * @returns {Array} - Array of conflict pairs: [{task1, task2, overlapMinutes}]
 */
export const detectConflicts = (tasks) => {
  const conflicts = [];

  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      const t1 = tasks[i];
      const t2 = tasks[j];

      // Skip if either task doesn't have timing info
      if (!t1.start || !t1.end || !t2.start || !t2.end) continue;

      // Check for overlap: t1 starts before t2 ends AND t1 ends after t2 starts
      const overlaps = t1.start < t2.end && t1.end > t2.start;

      if (overlaps) {
        const overlapStart = Math.max(t1.start, t2.start);
        const overlapEnd = Math.min(t1.end, t2.end);
        const overlapMinutes = overlapEnd - overlapStart;

        conflicts.push({
          task1: t1,
          task2: t2,
          overlapMinutes
        });
      }
    }
  }

  return conflicts;
};

/**
 * Calculate overflow when tasks exceed available time
 * @param {Array} tasks - All tasks for the day
 * @param {Object} availability - User's availability window {start, end}
 * @returns {Object} - {minutes: number, severity: 'none'|'warning'|'critical', affectedTasks: []}
 */
export const calculateOverflow = (tasks, availability) => {
  if (!availability) return { minutes: 0, severity: 'none', affectedTasks: [] };

  const startM = hhmmToMinutes(availability.start);
  const endM = hhmmToMinutes(availability.end);
  const availableMinutes = endM - startM;

  const totalTaskTime = tasks.reduce((sum, t) => {
    const time = t.remaining || t.duration || 0;
    return sum + time;
  }, 0);

  const overflowMinutes = Math.max(0, totalTaskTime - availableMinutes);

  let severity = 'none';
  if (overflowMinutes > 0 && overflowMinutes <= 60) severity = 'warning';  // < 1 hour
  if (overflowMinutes > 60) severity = 'critical';  // > 1 hour

  // Find tasks that push us over the limit
  const affectedTasks = [];
  let accTime = 0;
  for (const task of tasks) {
    const taskTime = task.remaining || task.duration || 0;
    if (accTime + taskTime > availableMinutes) {
      affectedTasks.push(task);
    }
    accTime += taskTime;
  }

  return {
    minutes: overflowMinutes,
    severity,
    affectedTasks
  };
};

/**
 * Prioritize tasks based on multiple criteria
 * @param {Array} tasks - Tasks to sort
 * @returns {Array} - Sorted tasks (highest priority first)
 */
export const prioritizeTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    // 1. Carried-over tasks come first
    const aCarried = a.carriedOver ? 1 : 0;
    const bCarried = b.carriedOver ? 1 : 0;
    if (aCarried !== bCarried) return bCarried - aCarried;

    // 2. Then by deadline (earlier deadlines first)
    if (a.deadline && b.deadline) {
      const aDL = new Date(a.deadline).getTime();
      const bDL = new Date(b.deadline).getTime();
      if (aDL !== bDL) return aDL - bDL;
    }
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;

    // 3. Then by priority (higher priority first)
    const aPriority = a.priority || 3;
    const bPriority = b.priority || 3;
    if (aPriority !== bPriority) return bPriority - aPriority;

    // 4. Finally by creation time (earlier first)
    const aTime = a.id || 0;
    const bTime = b.id || 0;
    return aTime - bTime;
  });
};

/**
 * Split a task across days when it doesn't fit
 * @param {Object} task - Task to split
 * @param {number} availableTime - Minutes available to allocate today
 * @returns {Object} - {todayPortion, tomorrowPortion}
 */
export const splitTaskAcrossDays = (task, availableTime) => {
  const taskTime = task.remaining || task.duration || 0;

  // Don't split if task fits or is too small to split meaningfully
  if (taskTime <= availableTime || availableTime < 15) {
    return {
      todayPortion: task,
      tomorrowPortion: null
    };
  }

  // Split the task
  const todayTime = Math.floor(availableTime);
  const tomorrowTime = taskTime - todayTime;

  const todayPortion = {
    ...task,
    id: task.id, // Keep same ID for today
    duration: todayTime,
    remaining: todayTime,
    name: `${task.name} (Part 1)`
  };

  const tomorrowPortion = {
    ...task,
    id: Date.now() + 1, // New ID for tomorrow's portion
    duration: tomorrowTime,
    remaining: tomorrowTime,
    name: `${task.name} (Part 2)`,
    splitFrom: task.id,
    carriedOver: true
  };

  return {
    todayPortion,
    tomorrowPortion
  };
};

/**
 * Reschedule unfinished tasks into available time slots
 * @param {Array} unfinishedTasks - Tasks carried over from previous days
 * @param {Array} todayTasks - Tasks already planned for today
 * @param {Object} availability - User's availability window {start, end}
 * @returns {Array} - Combined and scheduled tasks
 */
export const rescheduleUnfinishedTasks = (unfinishedTasks, todayTasks, availability) => {
  if (!availability) return todayTasks;

  const startM = hhmmToMinutes(availability.start);
  const endM = hhmmToMinutes(availability.end);
  const availableMinutes = endM - startM;

  // Prioritize all tasks (unfinished + today's tasks)
  const allTasks = prioritizeTasks([...unfinishedTasks, ...todayTasks]);

  // Calculate total time needed
  const totalTime = allTasks.reduce((sum, t) => sum + (t.remaining || t.duration || 0), 0);

  if (totalTime <= availableMinutes) {
    // Everything fits - return prioritized list
    return allTasks;
  } else {
    // Not everything fits - use intelligent selection
    const fitsInToday = [];
    let usedTime = 0;

    for (const task of allTasks) {
      const taskTime = task.remaining || task.duration || 0;
      if (usedTime + taskTime <= availableMinutes) {
        fitsInToday.push(task);
        usedTime += taskTime;
      }
      // Tasks that don't fit will be handled by overflow detection in UI
    }

    return fitsInToday;
  }
};

/**
 * Schedule tasks sequentially into time blocks
 * @param {Array} tasks - All tasks to schedule
 * @param {Object} availability - User's availability window {start, end}
 * @returns {Array} - Tasks with start and end times
 */
export const scheduleTasksSequentially = (tasks, availability) => {
  if (!availability) return tasks;
  
  const startM = hhmmToMinutes(availability.start);
  let currentTime = startM;
  
  return tasks.map(task => {
    const start = task.startTime ? hhmmToMinutes(task.startTime) : currentTime;
    const duration = task.remaining || task.duration || 0;
    const end = start + duration;
    
    if (!task.startTime) {
      currentTime = end;
    }
    
    return {
      ...task,
      start,
      end,
      startTime: task.startTime || minutesToHHMM(start),
      duration
    };
  });
};

/**
 * Find the next available time slot that fits a task
 * @param {number} taskDuration - Duration in minutes
 * @param {Array} existingTasks - Scheduled tasks with start/end times (in minutes)
 * @param {Object} availability - User's availability window {start: "HH:MM", end: "HH:MM"}
 * @param {boolean} onlyToday - Restrict to today only (default true)
 * @returns {Object|null} - {date, startTime, endTime} or null if none found
 */
export const findNextFreeSlot = (taskDuration, existingTasks, availability, onlyToday = true) => {
  if (!availability) return null;

  const startM = hhmmToMinutes(availability.start);
  const endM = hhmmToMinutes(availability.end);
  const now = new Date();
  const currentM = now.getHours() * 60 + now.getMinutes();

  // Sort existing tasks by start time
  const scheduled = existingTasks
    .filter(t => t.start && t.end)
    .sort((a, b) => a.start - b.start);

  // Find gaps in today's schedule
  let searchStart = Math.max(startM, currentM + 15); // At least 15 min from now

  for (let i = 0; i < scheduled.length; i++) {
    const task = scheduled[i];
    const gapSize = task.start - searchStart;

    if (gapSize >= taskDuration) {
      // Found a slot!
      return {
        date: new Date().toISOString().slice(0, 10),
        startTime: minutesToHHMM(searchStart),
        endTime: minutesToHHMM(searchStart + taskDuration)
      };
    }

    searchStart = task.end; // Move to end of this task
  }

  // Check final gap (between last task and end of day)
  const finalGap = endM - searchStart;
  if (finalGap >= taskDuration) {
    return {
      date: new Date().toISOString().slice(0, 10),
      startTime: minutesToHHMM(searchStart),
      endTime: minutesToHHMM(searchStart + taskDuration)
    };
  }

  // No slot today - suggest tomorrow morning if allowed
  if (!onlyToday) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      date: tomorrow.toISOString().slice(0, 10),
      startTime: availability.start,
      endTime: minutesToHHMM(hhmmToMinutes(availability.start) + taskDuration)
    };
  }

  return null; // No slot found
};

/**
 * Get deadline urgency level for a task
 * @param {Object} task - Task with deadline field
 * @returns {Object|null} - Urgency info or null if no deadline
 */
export const getDeadlineUrgency = (task) => {
  if (!task.deadline) return null;

  const daysUntil = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) {
    return { level: 'overdue', message: 'OVERDUE', color: '#dc2626', shouldBlock: true };
  } else if (daysUntil === 0) {
    return { level: 'today', message: 'DUE TODAY', color: '#ea580c', shouldBlock: true };
  } else if (daysUntil === 1) {
    return { level: 'tomorrow', message: 'Due tomorrow', color: '#f59e0b', shouldBlock: false };
  } else if (daysUntil <= 3) {
    return { level: 'soon', message: `${daysUntil} days left`, color: '#fbbf24', shouldBlock: false };
  } else if (daysUntil <= 7) {
    return { level: 'upcoming', message: `${daysUntil} days left`, color: '#6FAF6F', shouldBlock: false };
  }

  return null;
};

/**
 * Detect potential scheduling conflicts when adding a new task
 * @param {Object} newTask - Task being added with startTime and duration
 * @param {Array} existingTasks - Already scheduled tasks
 * @returns {Object|null} - {conflicts: [], warnings: []} or null if no startTime
 */
export const detectPotentialConflicts = (newTask, existingTasks) => {
  if (!newTask.startTime) return null;

  const conflicts = [];
  const warnings = [];

  const newStart = hhmmToMinutes(newTask.startTime);
  const newEnd = newStart + (newTask.duration || 0);

  existingTasks.forEach(task => {
    if (!task.startTime || task.completed) return;

    const start = hhmmToMinutes(task.startTime);
    const end = start + (task.remaining || task.duration || 0);

    // Direct overlap: new task starts before existing ends AND new task ends after existing starts
    if (newStart < end && newEnd > start) {
      conflicts.push({
        type: 'overlap',
        task,
        message: `Overlaps with "${task.name}"`
      });
    }

    // Back-to-back (no buffer) - within 5 minutes
    if (Math.abs(newEnd - start) < 5 || Math.abs(end - newStart) < 5) {
      warnings.push({
        type: 'no-buffer',
        task,
        message: `Back-to-back with "${task.name}" - add 5-10 min buffer?`
      });
    }
  });

  return { conflicts, warnings };
};

export const scheduler = {
  schedule: scheduleTasksSequentially,
  reschedule: rescheduleUnfinishedTasks,
  detectConflicts,
  calculateOverflow,
  prioritizeTasks,
  splitTaskAcrossDays,
  migrateTask,
  optimize: (schedule) => schedule
};