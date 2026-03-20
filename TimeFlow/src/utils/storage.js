// src/utils/storage.js
// OPTIMIZED: Import caching utilities for better performance
import { getCached, setCached, removeCached } from './storageCache';

// ============================================================================
// TASK DATE MANIFEST - Efficient Tracking of All Task Dates
// ============================================================================
const MANIFEST_KEY = 'timeflow-dates-manifest';

// Helper: Add date to manifest
const addDateToManifest = (dateString) => {
  try {
    const manifest = getCached(MANIFEST_KEY, true) || [];
    if (!manifest.includes(dateString)) {
      manifest.push(dateString);
      manifest.sort();
      setCached(MANIFEST_KEY, manifest, true, false); // Batched write
    }
  } catch (e) {
    console.error('addDateToManifest', e);
  }
};

// Helper: Remove date from manifest
const removeDateFromManifest = (dateString) => {
  try {
    const manifest = getCached(MANIFEST_KEY, true) || [];
    const filtered = manifest.filter(d => d !== dateString);
    if (filtered.length !== manifest.length) {
      setCached(MANIFEST_KEY, filtered, true, false);
    }
  } catch (e) {
    console.error('removeDateFromManifest', e);
  }
};

// ============================================================================
// AVAILABILITY SETTINGS
// ============================================================================

export const saveAvailability = (availability) => {
  localStorage.setItem("availability", JSON.stringify(availability));
};

export const loadAvailability = () => {
  try {
    const data = localStorage.getItem("availability");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load availability", e);
    return null;
  }
};

export const clearAvailability = () => {
  localStorage.removeItem("availability");
};

// ============================================================================
// TASK MANAGEMENT - OPTIMIZED WITH MANIFEST
// ============================================================================

export const getTasksKeyForDate = (dateString) => `timeflow-tasks-${dateString}`;

export const loadTasksForDate = (dateString) => {
  try {
    const raw = localStorage.getItem(getTasksKeyForDate(dateString));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("loadTasksForDate", e);
    return [];
  }
};

export const saveTasksForDate = (dateString, tasks) => {
  try {
    localStorage.setItem(getTasksKeyForDate(dateString), JSON.stringify(tasks));
    // Update manifest to track this date
    if (tasks && tasks.length > 0) {
      addDateToManifest(dateString);
    } else {
      removeDateFromManifest(dateString);
    }
  } catch (e) {
    console.error("saveTasksForDate", e);
  }
};

export const loadTasks = () => {
  const today = new Date().toISOString().slice(0, 10);
  return loadTasksForDate(today);
};

export const saveTasks = (tasks) => {
  const today = new Date().toISOString().slice(0, 10);
  saveTasksForDate(today, tasks);
};

// OPTIMIZED: Get all stored task dates using manifest (O(1) instead of O(n))
export const getAllTaskDates = () => {
  try {
    const manifest = getCached(MANIFEST_KEY, true);
    if (manifest && Array.isArray(manifest)) {
      return manifest;
    }
    // Fallback: rebuild manifest from localStorage (migration path)
    return rebuildManifest();
  } catch (e) {
    console.error('getAllTaskDates', e);
    return [];
  }
};

// Rebuild manifest by scanning localStorage (only needed once for migration)
const rebuildManifest = () => {
  const dates = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('timeflow-tasks-')) {
        dates.push(key.replace('timeflow-tasks-', ''));
      }
    }
    dates.sort();
    // Save manifest for future use
    setCached(MANIFEST_KEY, dates, true, true); // Immediate write
    return dates;
  } catch (e) {
    console.error('rebuildManifest', e);
    return dates;
  }
};

// OPTIMIZED: Get unfinished tasks with early termination
export const getUnfinishedTasksFromPreviousDays = () => {
  const today = new Date().toISOString().slice(0, 10);
  const allDates = getAllTaskDates();
  const unfinished = [];

  for (const date of allDates) {
    // Only check past dates
    if (date >= today) continue;

    const tasks = loadTasksForDate(date);
    tasks.forEach(task => {
      // Skip tasks that were already moved to another day to prevent duplicate carry-overs
      if (task.movedToTodayCount && task.movedToTodayCount > 0) return;
      if (task.carriedMarked) return;

      if (!task.completed && task.remaining > 0) {
        unfinished.push({
          ...task,
          originalDate: date,
          originalTaskId: task.id,  // FIX: Store original task ID for proper deletion tracking
          carriedOver: true,
          attempts: (task.attempts || 0) + 1 // Track reschedule attempts
        });
      }
    });
  }

  return unfinished;
};

// ============================================================================
// REFLECTION DATA
// ============================================================================

export const saveReflection = (date, reflectionData) => {
  try {
    const reflections = JSON.parse(localStorage.getItem('timeflow-reflections') || '{}');
    reflections[date] = {
      ...reflectionData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('timeflow-reflections', JSON.stringify(reflections));
  } catch (e) {
    console.error('saveReflection', e);
  }
};

export const loadReflection = (date) => {
  try {
    const reflections = JSON.parse(localStorage.getItem('timeflow-reflections') || '{}');
    return reflections[date] || null;
  } catch (e) {
    console.error('loadReflection', e);
    return null;
  }
};

export const getAllReflections = () => {
  try {
    return JSON.parse(localStorage.getItem('timeflow-reflections') || '{}');
  } catch (e) {
    console.error('getAllReflections', e);
    return {};
  }
};

export const getReflectionHistory = () => {
  try {
    const reflections = JSON.parse(localStorage.getItem('timeflow-reflections') || '{}');
    // Convert to array and sort by date descending
    return Object.entries(reflections)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.error('getReflectionHistory', e);
    return [];
  }
};

// ============================================================================
// WEEKLY VIEW DATA - OPTIMIZED (eliminates O(n²) nested loops)
// ============================================================================

export const getWeekData = (startDate) => {
  const start = new Date(startDate);
  const weekData = [];
  const today = new Date().toISOString().slice(0, 10);

  // Build week data array
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateString = date.toISOString().slice(0, 10);

    const tasks = loadTasksForDate(dateString);
    const completed = tasks.filter(t => t.completed);
    const unfinished = tasks.filter(t => !t.completed);

    // FIXED: Count only tasks that were carried TO this specific day
    const carriedToThisDay = tasks.filter(t => t.carriedOver && !t.completed).length;

    weekData.push({
      date: dateString,
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      taskCount: tasks.length,
      completedCount: completed.length,
      completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
      carriedOverCount: carriedToThisDay,
      unfinishedCount: unfinished.length,
      isToday: dateString === today,
      isPast: dateString < today,
      isFuture: dateString > today,
      hasTasks: tasks.length > 0 || carriedToThisDay > 0
    });
  }

  return weekData;
};

// Get the start of the current week (Monday)
export const getCurrentWeekStart = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(today.setDate(diff));
  return monday.toISOString().slice(0, 10);
};

// ============================================================================
// SETTINGS
// ============================================================================

const DEFAULT_SETTINGS = {
  theme: 'green',
  soundEnabled: false,
  breakReminders: true,
  weekStartDay: 1, // Monday
  focusModeDuration: 25,
  celebrationsEnabled: true
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem('timeflow-settings', JSON.stringify(settings));
  } catch (e) {
    console.error('saveSettings', e);
  }
};

export const loadSettings = () => {
  try {
    const settings = JSON.parse(localStorage.getItem('timeflow-settings') || '{}');
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch (e) {
    console.error('loadSettings', e);
    return DEFAULT_SETTINGS;
  }
};

// ============================================================================
// HABITS (skeleton for future implementation)
// ============================================================================

export const saveHabit = (habit) => {
  try {
    const habits = JSON.parse(localStorage.getItem('timeflow-habits') || '[]');
    const existingIndex = habits.findIndex(h => h.id === habit.id);

    if (existingIndex >= 0) {
      habits[existingIndex] = habit;
    } else {
      habits.push(habit);
    }

    localStorage.setItem('timeflow-habits', JSON.stringify(habits));
  } catch (e) {
    console.error('saveHabit', e);
  }
};

export const loadHabits = () => {
  try {
    return JSON.parse(localStorage.getItem('timeflow-habits') || '[]');
  } catch (e) {
    console.error('loadHabits', e);
    return [];
  }
};

export const deleteHabit = (habitId) => {
  try {
    const habits = JSON.parse(localStorage.getItem('timeflow-habits') || '[]');
    const filtered = habits.filter(h => h.id !== habitId);
    localStorage.setItem('timeflow-habits', JSON.stringify(filtered));
  } catch (e) {
    console.error('deleteHabit', e);
  }
};

// ============================================================================
// MOOD TRACKING (skeleton for future implementation)
// ============================================================================

export const saveMood = (date, mood) => {
  try {
    const moods = JSON.parse(localStorage.getItem('timeflow-moods') || '{}');
    moods[date] = {
      ...mood,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('timeflow-moods', JSON.stringify(moods));
  } catch (e) {
    console.error('saveMood', e);
  }
};

export const loadMood = (date) => {
  try {
    const moods = JSON.parse(localStorage.getItem('timeflow-moods') || '{}');
    return moods[date] || null;
  } catch (e) {
    console.error('loadMood', e);
    return null;
  }
};

export const getAllMoods = () => {
  try {
    return JSON.parse(localStorage.getItem('timeflow-moods') || '{}');
  } catch (e) {
    console.error('getAllMoods', e);
    return {};
  }
};

// ============================================================================
// WEEKLY POOL - Tasks that haven't been scheduled for a specific day yet
// ============================================================================

export const loadWeeklyPool = () => {
  try {
    const raw = localStorage.getItem('timeflow-weekly-pool');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("loadWeeklyPool", e);
    return [];
  }
};

export const saveWeeklyPool = (tasks) => {
  try {
    localStorage.setItem('timeflow-weekly-pool', JSON.stringify(tasks));
  } catch (e) {
    console.error("saveWeeklyPool", e);
  }
};

export const addTaskToWeeklyPool = (task) => {
  const pool = loadWeeklyPool();
  const newTask = {
    ...task,
    id: task.id || Date.now(),
    inWeeklyPool: true,
    createdAt: task.createdAt || new Date().toISOString()
  };
  pool.push(newTask);
  saveWeeklyPool(pool);
  return newTask;
};

export const removeTaskFromWeeklyPool = (taskId) => {
  const pool = loadWeeklyPool();
  const filtered = pool.filter(t => t.id !== taskId);
  saveWeeklyPool(filtered);
};

export const updateTaskInWeeklyPool = (taskId, updates) => {
  const pool = loadWeeklyPool();
  const updated = pool.map(t => t.id === taskId ? { ...t, ...updates } : t);
  saveWeeklyPool(updated);
};

// ============================================================================
// ANALYTICS
// ============================================================================

export const aggregateDailyStats = (tasks) => {
  const completed = tasks.filter(t => t.completed);
  const totalFocusTime = completed.reduce((sum, t) => sum + (t.duration || 0), 0);
  const totalPlannedTime = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);

  return {
    totalFocusTime,
    tasksCompleted: completed.length,
    tasksPlanned: tasks.length,
    completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
    averageTaskDuration: completed.length > 0 ? Math.round(totalFocusTime / completed.length) : 0
  };
};

export const saveDailyAnalytics = (date, tasks) => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-analytics') || '{}');
    analytics[date] = {
      ...aggregateDailyStats(tasks),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('timeflow-analytics', JSON.stringify(analytics));
  } catch (e) {
    console.error('saveDailyAnalytics', e);
  }
};

export const loadAnalytics = (date) => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-analytics') || '{}');
    return analytics[date] || null;
  } catch (e) {
    console.error('loadAnalytics', e);
    return null;
  }
};

export const getAllAnalytics = () => {
  try {
    return JSON.parse(localStorage.getItem('timeflow-analytics') || '{}');
  } catch (e) {
    console.error('getAllAnalytics', e);
    return {};
  }
};

// ============================================================================
// DAILY INSIGHTS - Productivity Score & Metrics
// ============================================================================

/**
 * Calculate productivity score for a given date
 * Factors in task completion and reschedule attempts (outcomes of reschedule modal)
 * Score = (totalPoints / maxPoints) * 100
 *
 * Scoring Logic:
 * - Task completed with 0 reschedules: 100 points
 * - Task completed with 1-2 reschedules: 80-90 points
 * - Task completed with 3+ reschedules: 50-70 points
 * - Task not completed: 0 points
 *
 * @param {string} dateString - YYYY-MM-DD format
 * @returns {number} Productivity score (0-100)
 */
export const calculateProductivityScore = (dateString) => {
  try {
    const tasks = loadTasksForDate(dateString);
    if (tasks.length === 0) return 0;

    let totalPoints = 0;
    let maxPoints = 0;

    tasks.forEach(task => {
      // Max points per task = 100
      maxPoints += 100;

      if (task.completed) {
        // Calculate points based on reschedule attempts
        const attempts = task.attempts || 0;

        if (attempts === 0) {
          // No rescheduling needed - full credit
          totalPoints += 100;
        } else if (attempts === 1) {
          // One reschedule - 90% credit (10% penalty)
          totalPoints += 90;
        } else if (attempts === 2) {
          // Two reschedules - 80% credit (20% penalty)
          totalPoints += 80;
        } else if (attempts === 3 || attempts === 4) {
          // Three-four reschedules - 65% credit (35% penalty)
          totalPoints += 65;
        } else {
          // Five+ reschedules - 50% credit (50% penalty)
          totalPoints += 50;
        }
      }
      // Uncompleted tasks contribute 0 points
    });

    // Calculate final score capped at 100%
    const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
    return Math.min(100, score); // Cap at 100%
  } catch (e) {
    console.error('calculateProductivityScore', e);
    return 0;
  }
};

/**
 * Record daily insight/reflection data with productivity score
 * @param {string} dateString - YYYY-MM-DD format
 * @param {object} insightData - Insight data to record
 */
export const recordDailyInsight = (dateString, insightData = {}) => {
  try {
    const insights = JSON.parse(localStorage.getItem('timeflow-daily-insights') || '{}');
    const tasks = loadTasksForDate(dateString);
    const completed = tasks.filter(t => t.completed).length;

    insights[dateString] = {
      date: dateString,
      tasksCreated: tasks.length,
      tasksCompleted: completed,
      tasksSkipped: tasks.length - completed,
      productivityScore: calculateProductivityScore(dateString),
      totalTimeTracked: tasks.reduce((sum, t) => sum + (t.duration || 0), 0),
      ...insightData,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('timeflow-daily-insights', JSON.stringify(insights));
  } catch (e) {
    console.error('recordDailyInsight', e);
  }
};

/**
 * Load insight data for a specific date
 * @param {string} dateString - YYYY-MM-DD format
 * @returns {object|null} Insight data or null
 */
export const loadDailyInsight = (dateString) => {
  try {
    const insights = JSON.parse(localStorage.getItem('timeflow-daily-insights') || '{}');
    return insights[dateString] || null;
  } catch (e) {
    console.error('loadDailyInsight', e);
    return null;
  }
};

/**
 * Load all daily insights
 * @returns {object} All insights keyed by date
 */
export const getAllDailyInsights = () => {
  try {
    return JSON.parse(localStorage.getItem('timeflow-daily-insights') || '{}');
  } catch (e) {
    console.error('getAllDailyInsights', e);
    return {};
  }
};

/**
 * Get productivity trend for the last N days
 * @param {number} days - Number of days to analyze (default 7)
 * @returns {string} Trend: 'improving', 'stable', 'declining'
 */
export const getProductivityTrend = (days = 7) => {
  try {
    const insights = getAllDailyInsights();
    const today = new Date();
    const scores = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      const insight = insights[dateString];
      if (insight) {
        scores.unshift(insight.productivityScore);
      }
    }

    if (scores.length < 5) return 'neutral';

    const recent = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const older = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;

    if (recent - older > 10) return 'improving';
    if (older - recent > 10) return 'declining';
    return 'stable';
  } catch (e) {
    console.error('getProductivityTrend', e);
    return 'neutral';
  }
};

/**
 * Get productivity score history (array format for charts)
 * @param {number} days - Number of days to retrieve
 * @returns {array} Array of { date, score } objects
 */
export const getProductivityScoreHistory = (days = 30) => {
  try {
    const insights = getAllDailyInsights();
    const today = new Date();
    const history = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      const insight = insights[dateString];

      history.push({
        date: dateString,
        score: insight ? insight.productivityScore : 0,
        completed: insight ? insight.tasksCompleted : 0,
        created: insight ? insight.tasksCreated : 0
      });
    }

    return history;
  } catch (e) {
    console.error('getProductivityScoreHistory', e);
    return [];
  }
};

