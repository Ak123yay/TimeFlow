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

      // FIXED: Skip if either task is completed
      if (t1.completed || t2.completed) continue;

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

  // Parse deadline as local date (not UTC) to avoid timezone issues
  // task.deadline format: "YYYY-MM-DD"
  const [year, month, day] = task.deadline.split('-').map(Number);
  const deadline = new Date(year, month - 1, day); // month is 0-indexed
  deadline.setHours(0, 0, 0, 0);

  // Get today at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntil = Math.round((deadline - today) / (1000 * 60 * 60 * 24));

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

/**
 * Assess task health/risk level based on multiple factors
 * @param {Object} task - Task to assess
 * @param {Array} allTasks - All tasks for context (for conflict detection)
 * @param {Object} availability - User's availability window
 * @returns {Object} - {status: 'healthy'|'warning'|'critical', reasons: [], score: number}
 */
export const getTaskHealth = (task, allTasks = [], availability = null) => {
  const reasons = [];
  let riskScore = 0; // Higher score = higher risk

  // Factor 1: Reschedule attempts (0-40 points)
  const attempts = task.attempts || 0;
  if (attempts >= 5) {
    riskScore += 40;
    reasons.push('Rescheduled 5+ times - chronic procrastination');
  } else if (attempts >= 3) {
    riskScore += 25;
    reasons.push(`Rescheduled ${attempts} times - consider breaking down`);
  } else if (attempts >= 1) {
    riskScore += 10;
    reasons.push(`Rescheduled ${attempts} time(s)`);
  }

  // Factor 2: Deadline proximity (0-30 points)
  const urgency = getDeadlineUrgency(task);
  if (urgency) {
    if (urgency.level === 'overdue') {
      riskScore += 30;
      reasons.push('OVERDUE');
    } else if (urgency.level === 'today') {
      riskScore += 25;
      reasons.push('Due today');
    } else if (urgency.level === 'tomorrow') {
      riskScore += 15;
      reasons.push('Due tomorrow');
    } else if (urgency.level === 'soon') {
      riskScore += 8;
      reasons.push(urgency.message);
    }
  }

  // Factor 3: Conflicts with other tasks (0-20 points)
  if (task.startTime && allTasks.length > 0) {
    const conflicts = detectConflicts(allTasks.filter(t =>
      t.start && t.end && !t.completed
    ));
    const taskConflicts = conflicts.filter(c =>
      c.task1.id === task.id || c.task2.id === task.id
    );
    if (taskConflicts.length > 0) {
      riskScore += Math.min(20, taskConflicts.length * 10);
      reasons.push(`Conflicts with ${taskConflicts.length} other task(s)`);
    }
  }

  // Factor 4: Contributes to overflow (0-10 points)
  if (availability && allTasks.length > 0) {
    const overflow = calculateOverflow(
      allTasks.filter(t => !t.completed),
      availability
    );
    if (overflow.severity !== 'none') {
      const isAffected = overflow.affectedTasks.some(t => t.id === task.id);
      if (isAffected) {
        riskScore += overflow.severity === 'critical' ? 10 : 5;
        reasons.push('Contributes to schedule overflow');
      }
    }
  }

  // Determine status based on score
  let status = 'healthy';
  if (riskScore >= 50) {
    status = 'critical';
  } else if (riskScore >= 25) {
    status = 'warning';
  }

  return {
    status,
    score: riskScore,
    reasons,
    color: status === 'critical' ? '#dc2626' : status === 'warning' ? '#f59e0b' : '#6FAF6F'
  };
};

export const scheduler = {
  schedule: scheduleTasksSequentially,
  reschedule: rescheduleUnfinishedTasks,
  detectConflicts,
  calculateOverflow,
  prioritizeTasks,
  splitTaskAcrossDays,
  migrateTask,
  getTaskHealth,
  optimize: (schedule) => schedule
};

// ============================================================================
// ENERGY-AWARE INTELLIGENT SCHEDULING
// ============================================================================

import { getAllHourlyCompletionRates, getTaskCategory } from './analytics';
import {
  categorizeTask,
  predictCompletionProbability,
} from './smartReschedule';

/**
 * Score how well a task fits into a given hour based on the user's historical
 * energy/completion rates and the task's category.
 *
 * @param {Object} task - Task to evaluate
 * @param {number} hour - Hour of day (0-23)
 * @returns {{ score: number, reasons: string[] }}
 */
export const scoreTaskHourFit = (task, hour) => {
  const reasons = [];
  let score = 50; // neutral baseline

  // Energy pattern match
  const hourlyRates = getAllHourlyCompletionRates();
  const hourKey = String(hour).padStart(2, '0');
  const completionRate = hourlyRates[hourKey];

  if (completionRate !== undefined) {
    if (completionRate >= 0.75) {
      score += 25;
      reasons.push(`Peak productivity at ${hour}:00 (${Math.round(completionRate * 100)}%)`);
    } else if (completionRate >= 0.5) {
      score += 12;
      reasons.push(`Good productivity at ${hour}:00`);
    } else if (completionRate < 0.3) {
      score -= 15;
      reasons.push(`Low completion rate at ${hour}:00 (${Math.round(completionRate * 100)}%)`);
    }
  }

  // Category-time fit
  const category = categorizeTask(task.name);
  const categoryTimeFit = getCategoryTimePreference(category.primary, hour);
  score += categoryTimeFit.points;
  if (categoryTimeFit.reason) {
    reasons.push(categoryTimeFit.reason);
  }

  // Deadline urgency: urgent tasks should go in high-energy slots
  const urgency = getDeadlineUrgency(task);
  if (urgency && (urgency.level === 'overdue' || urgency.level === 'today')) {
    if (completionRate !== undefined && completionRate >= 0.6) {
      score += 10;
      reasons.push('Urgent task in high-energy slot');
    }
  }

  // Task duration vs remaining energy: long tasks need high-energy hours
  const duration = task.remaining || task.duration || 30;
  if (duration >= 60) {
    if (completionRate !== undefined && completionRate >= 0.6) {
      score += 8;
      reasons.push('Long task placed in high-energy window');
    } else if (completionRate !== undefined && completionRate < 0.4) {
      score -= 10;
      reasons.push('Long task in low-energy window');
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons,
  };
};

/**
 * Get category-time preference score for a task category at a given hour.
 * Based on common productivity research (creative work in morning, admin in afternoon, etc.)
 *
 * @param {string} category - Task category
 * @param {number} hour - Hour of day
 * @returns {{ points: number, reason: string|null }}
 */
export const getCategoryTimePreference = (category, hour) => {
  const preferences = {
    creative: {
      peak: [8, 9, 10, 11],
      good: [14, 15],
      bad:  [16, 17, 18, 19],
      peakReason: 'Creative tasks do best in the morning',
    },
    coding: {
      peak: [9, 10, 11, 14, 15],
      good: [8, 16],
      bad:  [12, 13, 17, 18],
      peakReason: 'Deep work tasks peak mid-morning & early afternoon',
    },
    meetings: {
      peak: [10, 11, 14, 15],
      good: [9, 16],
      bad:  [8, 12, 17, 18],
      peakReason: 'Meetings fit well in late morning & early afternoon',
    },
    email: {
      peak: [8, 9, 16, 17],
      good: [12, 13],
      bad:  [10, 11, 14, 15],
      peakReason: 'Email batching works best early morning or late afternoon',
    },
    admin: {
      peak: [13, 14, 15, 16],
      good: [11, 12],
      bad:  [8, 9, 10],
      peakReason: 'Admin tasks fit low-energy afternoon slots',
    },
    health: {
      peak: [7, 8, 12, 17, 18],
      good: [6, 13],
      bad:  [9, 10, 14, 15, 16],
      peakReason: 'Exercise/health breaks are great transitions',
    },
    learning: {
      peak: [8, 9, 10, 19, 20],
      good: [14, 15],
      bad:  [12, 13, 16, 17],
      peakReason: 'Learning works best when mind is fresh',
    },
    personal: {
      peak: [12, 13, 17, 18],
      good: [8, 9],
      bad:  [10, 11, 14, 15],
      peakReason: 'Personal errands fit lunch or end of day',
    },
  };

  const prefs = preferences[category];
  if (!prefs) return { points: 0, reason: null };

  if (prefs.peak.includes(hour)) {
    return { points: 15, reason: prefs.peakReason };
  }
  if (prefs.good.includes(hour)) {
    return { points: 8, reason: null };
  }
  if (prefs.bad.includes(hour)) {
    return { points: -8, reason: `${category} tasks are less effective at ${hour}:00` };
  }
  return { points: 0, reason: null };
};

/**
 * Sort tasks into an energy-optimized order for the day. Places demanding
 * tasks in high-energy hours and routine tasks in low-energy hours.
 *
 * @param {Array} tasks - Unordered tasks for the day
 * @param {Object} availability - { start: "HH:MM", end: "HH:MM" }
 * @returns {Array} Tasks reordered for optimal energy alignment
 */
export const optimizeTaskOrder = (tasks, availability) => {
  if (!availability || tasks.length <= 1) return tasks;

  const startM = hhmmToMinutes(availability.start);
  const hourlyRates = getAllHourlyCompletionRates();

  // Only reorder tasks without explicit start times
  const fixed = tasks.filter(t => t.startTime && !t.completed);
  const flexible = tasks.filter(t => !t.startTime && !t.completed);
  const completed = tasks.filter(t => t.completed);

  if (flexible.length <= 1) return tasks;

  // Score each flexible task in each possible hour
  const scored = flexible.map(task => {
    const category = categorizeTask(task.name);
    const urgency = getDeadlineUrgency(task);
    const duration = task.remaining || task.duration || 30;

    // Base priority for ordering
    let basePriority = 0;
    if (urgency?.level === 'overdue') basePriority = 100;
    else if (urgency?.level === 'today') basePriority = 80;
    else if (urgency?.level === 'tomorrow') basePriority = 60;
    else if (task.carriedOver) basePriority = 50;

    // Does this task need high energy?
    const needsHighEnergy = duration >= 45 || category.primary === 'creative' || category.primary === 'coding' || category.primary === 'learning';

    return {
      ...task,
      _basePriority: basePriority,
      _needsHighEnergy: needsHighEnergy,
      _category: category.primary,
    };
  });

  // Find peak and low-energy hours from user data
  const hourEntries = Object.entries(hourlyRates)
    .map(([h, rate]) => ({ hour: parseInt(h), rate }))
    .sort((a, b) => b.rate - a.rate);

  const peakHours = hourEntries.slice(0, 4).map(e => e.hour);

  // Sort: urgent first, then high-energy-need tasks (for peak hours), then rest
  scored.sort((a, b) => {
    // Urgent tasks always first
    if (a._basePriority !== b._basePriority) return b._basePriority - a._basePriority;
    // High-energy tasks next (they'll fill peak hours)
    if (a._needsHighEnergy !== b._needsHighEnergy) return b._needsHighEnergy ? 1 : -1;
    // Then by priority
    return (b.priority || 3) - (a.priority || 3);
  });

  // Clean up internal fields
  const reordered = scored.map(({ _basePriority, _needsHighEnergy, _category, ...task }) => task);

  return [...completed, ...fixed, ...reordered];
};

/**
 * Enhanced task prioritization that factors in energy, category, and
 * procrastination patterns on top of the base priority logic.
 *
 * @param {Array} tasks - Tasks to sort
 * @param {Object} availability - User availability
 * @returns {Array} Tasks sorted by smart priority
 */
export const smartPrioritize = (tasks, availability) => {
  if (!tasks || tasks.length === 0) return [];

  const startM = availability ? hhmmToMinutes(availability.start) : 0;

  return [...tasks].sort((a, b) => {
    // 1. Urgency (overdue/today deadlines)
    const aUrg = getDeadlineUrgency(a);
    const bUrg = getDeadlineUrgency(b);
    const urgencyOrder = { overdue: 5, today: 4, tomorrow: 3, soon: 2, upcoming: 1 };
    const aUrgScore = aUrg ? (urgencyOrder[aUrg.level] || 0) : 0;
    const bUrgScore = bUrg ? (urgencyOrder[bUrg.level] || 0) : 0;
    if (aUrgScore !== bUrgScore) return bUrgScore - aUrgScore;

    // 2. Carried-over tasks
    const aCarried = a.carriedOver ? 1 : 0;
    const bCarried = b.carriedOver ? 1 : 0;
    if (aCarried !== bCarried) return bCarried - aCarried;

    // 3. High-attempt tasks (chronic procrastination = higher priority)
    const aAttempts = a.attempts || 0;
    const bAttempts = b.attempts || 0;
    if (aAttempts >= 3 && bAttempts < 3) return -1;
    if (bAttempts >= 3 && aAttempts < 3) return 1;

    // 4. Explicit priority
    const aPri = a.priority || 3;
    const bPri = b.priority || 3;
    if (aPri !== bPri) return bPri - aPri;

    // 5. Shorter tasks first (quick wins build momentum)
    const aDur = a.remaining || a.duration || 30;
    const bDur = b.remaining || b.duration || 30;
    if (Math.abs(aDur - bDur) > 15) return aDur - bDur;

    // 6. Creation time
    return (a.id || 0) - (b.id || 0);
  });
};

/**
 * Suggest an optimized schedule for a set of tasks. Places each task
 * in its best time slot considering energy, category, conflicts, and urgency.
 *
 * @param {Array} tasks - Tasks to schedule (without start times)
 * @param {Array} fixedTasks - Tasks already scheduled (with start times)
 * @param {Object} availability - { start: "HH:MM", end: "HH:MM" }
 * @returns {Array} Tasks with suggested startTime assignments
 */
export const suggestOptimalSchedule = (tasks, fixedTasks, availability) => {
  if (!availability || tasks.length === 0) return tasks;

  const startM = hhmmToMinutes(availability.start);
  const endM = hhmmToMinutes(availability.end);

  // Build occupied time ranges from fixed tasks
  const occupied = fixedTasks
    .filter(t => t.startTime && !t.completed)
    .map(t => ({
      start: hhmmToMinutes(t.startTime),
      end: hhmmToMinutes(t.startTime) + (t.remaining || t.duration || 30),
    }))
    .sort((a, b) => a.start - b.start);

  // Prioritize tasks for scheduling
  const prioritized = smartPrioritize(tasks, availability);

  const scheduled = [];
  const usedRanges = [...occupied];

  for (const task of prioritized) {
    const duration = task.remaining || task.duration || 30;

    // Find best available slot
    const bestSlot = _findBestSlot(task, duration, usedRanges, startM, endM);

    if (bestSlot) {
      scheduled.push({
        ...task,
        startTime: minutesToHHMM(bestSlot.start),
        _suggestedSlot: true,
        _slotScore: bestSlot.score,
      });
      usedRanges.push({ start: bestSlot.start, end: bestSlot.start + duration });
      usedRanges.sort((a, b) => a.start - b.start);
    } else {
      // No slot found, leave unscheduled
      scheduled.push(task);
    }
  }

  return scheduled;
};

/**
 * Find the best time slot for a task considering energy and category fit.
 */
function _findBestSlot(task, duration, usedRanges, dayStart, dayEnd) {
  const now = new Date();
  const currentM = now.getHours() * 60 + now.getMinutes();
  const searchStart = Math.max(dayStart, currentM + 5);

  // Generate candidate slots in 15-minute increments
  const candidates = [];

  for (let start = searchStart; start + duration <= dayEnd; start += 15) {
    // Check for conflicts with used ranges
    const end = start + duration;
    const hasConflict = usedRanges.some(
      r => start < r.end && end > r.start
    );

    if (!hasConflict) {
      const hour = Math.floor(start / 60);
      const fit = scoreTaskHourFit(task, hour);
      candidates.push({
        start,
        end,
        score: fit.score,
        reasons: fit.reasons,
      });
    }
  }

  if (candidates.length === 0) return null;

  // Return highest-scoring slot
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0];
}

/**
 * Detect if today's schedule has problematic patterns and suggest fixes.
 *
 * @param {Array} tasks - Today's tasks
 * @param {Object} availability - User availability
 * @returns {Array<{ type: string, message: string, severity: string, fix: Object|null }>}
 */
export const detectScheduleIssues = (tasks, availability) => {
  const issues = [];
  if (!tasks || tasks.length === 0 || !availability) return issues;

  const activeTasks = tasks.filter(t => !t.completed);
  const startM = hhmmToMinutes(availability.start);
  const endM = hhmmToMinutes(availability.end);
  const totalCapacity = endM - startM;

  // Issue 1: Overloaded schedule
  const totalLoad = activeTasks.reduce((s, t) => s + (t.remaining || t.duration || 0), 0);
  if (totalLoad > totalCapacity) {
    const overBy = totalLoad - totalCapacity;
    issues.push({
      type: 'overload',
      message: `Schedule is overloaded by ${overBy} minutes. Consider moving ${Math.ceil(overBy / 30)} task(s) to another day.`,
      severity: overBy > 60 ? 'critical' : 'warning',
      fix: { action: 'move_tasks', minutes: overBy },
    });
  }

  // Issue 2: No buffer between tasks
  const scheduled = activeTasks
    .filter(t => t.startTime)
    .sort((a, b) => hhmmToMinutes(a.startTime) - hhmmToMinutes(b.startTime));

  for (let i = 0; i < scheduled.length - 1; i++) {
    const current = scheduled[i];
    const next = scheduled[i + 1];
    const currentEnd = hhmmToMinutes(current.startTime) + (current.remaining || current.duration || 0);
    const nextStart = hhmmToMinutes(next.startTime);
    const buffer = nextStart - currentEnd;

    if (buffer >= 0 && buffer < 5) {
      issues.push({
        type: 'no_buffer',
        message: `No break between "${current.name}" and "${next.name}". Add a 5-10min buffer.`,
        severity: 'info',
        fix: { action: 'add_buffer', task1: current.id, task2: next.id },
      });
    }
  }

  // Issue 3: Chronically rescheduled tasks
  activeTasks.forEach(task => {
    if ((task.attempts || 0) >= 4) {
      issues.push({
        type: 'chronic_reschedule',
        message: `"${task.name}" rescheduled ${task.attempts} times. Consider breaking it down or removing it.`,
        severity: 'warning',
        fix: { action: 'break_task', taskId: task.id },
      });
    }
  });

  // Issue 4: Long tasks in late slots
  scheduled.forEach(task => {
    const duration = task.remaining || task.duration || 0;
    const startMin = hhmmToMinutes(task.startTime);
    if (duration >= 60 && (endM - startMin) < duration + 30) {
      issues.push({
        type: 'late_long_task',
        message: `"${task.name}" (${duration}min) is scheduled near end of day. It may overflow.`,
        severity: 'info',
        fix: { action: 'move_earlier', taskId: task.id },
      });
    }
  });

  return issues;
};