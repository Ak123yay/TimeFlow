// src/utils/storage.js
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

// Task management functions
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

// Get all stored task dates
export const getAllTaskDates = () => {
  const dates = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('timeflow-tasks-')) {
      dates.push(key.replace('timeflow-tasks-', ''));
    }
  }
  return dates.sort();
};

// Get unfinished tasks from previous days
export const getUnfinishedTasksFromPreviousDays = () => {
  const today = new Date().toISOString().slice(0, 10);
  const allDates = getAllTaskDates();
  const unfinished = [];
  
  for (const date of allDates) {
    if (date < today) {
      const tasks = loadTasksForDate(date);
      tasks.forEach(task => {
        if (!task.completed && task.remaining > 0) {
          unfinished.push({
            ...task,
            originalDate: date,
            carriedOver: true
          });
        }
      });
    }
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

// ============================================================================
// WEEKLY VIEW DATA
// ============================================================================

export const getWeekData = (startDate) => {
  const start = new Date(startDate);
  const weekData = [];
  const today = new Date().toISOString().slice(0, 10);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateString = date.toISOString().slice(0, 10);

    const tasks = loadTasksForDate(dateString);
    const completed = tasks.filter(t => t.completed);
    const unfinished = tasks.filter(t => !t.completed);

    // Calculate how many tasks are/will be carried over to this day
    // Count tasks with carriedOver flag that are currently on this day
    let carriedOverCount = tasks.filter(t => t.carriedOver && !t.completed).length;

    // For all days (not just future), count unfinished tasks from ALL previous days
    // that would/will carry over to this day
    for (let j = 0; j < i; j++) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() + j);
      const prevDateString = prevDate.toISOString().slice(0, 10);
      const prevTasks = loadTasksForDate(prevDateString);

      // Count tasks that are incomplete and not already marked as carried over
      // (to avoid double counting)
      const prevUnfinished = prevTasks.filter(t =>
        !t.completed &&
        !t.carriedOver &&
        (t.remaining > 0 || t.duration > 0)
      );
      carriedOverCount += prevUnfinished.length;
    }

    weekData.push({
      date: dateString,
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      taskCount: tasks.length,
      completedCount: completed.length,
      completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
      carriedOverCount,
      unfinishedCount: unfinished.length,
      isToday: dateString === today,
      isPast: dateString < today,
      isFuture: dateString > today,
      hasTasks: tasks.length > 0 || carriedOverCount > 0
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

