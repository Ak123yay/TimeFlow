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

