// src/utils/analytics.js
// Analytics tracking and pattern detection for advanced rescheduling

/**
 * Get task history by name pattern (for duration learning)
 * @param {string} taskName - Name of the task
 * @returns {Array} - Array of historical task completions with duration data
 */
export const getTaskHistoryByName = (taskName) => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');

    // Simple fuzzy matching - tasks with similar names
    const normalizedName = taskName.toLowerCase().trim();
    return analytics.filter(entry => {
      const entryName = entry.name.toLowerCase().trim();
      return entryName.includes(normalizedName) || normalizedName.includes(entryName);
    });
  } catch (e) {
    console.error('Failed to load task history', e);
    return [];
  }
};

/**
 * Save completed task to history for future duration predictions
 * @param {Object} task - Completed task with actualDuration
 */
export const saveTaskToHistory = (task) => {
  try {
    const history = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');

    const entry = {
      name: task.name,
      estimatedDuration: task.estimatedDuration || task.duration,
      actualDuration: task.actualDuration,
      completedAt: task.completedAt || new Date().toISOString(),
      date: new Date().toISOString().slice(0, 10)
    };

    history.push(entry);

    // Keep only last 100 entries to prevent localStorage bloat
    if (history.length > 100) {
      history.shift();
    }

    localStorage.setItem('timeflow-task-history', JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save task history', e);
  }
};

/**
 * Calculate standard deviation for duration predictions
 * @param {Array} values - Array of numbers
 * @returns {number} - Standard deviation
 */
const calculateStdDev = (values) => {
  if (values.length === 0) return 0;

  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squareDiffs = values.map(val => Math.pow(val - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;

  return Math.sqrt(avgSquareDiff);
};

/**
 * Suggest duration based on historical data
 * @param {string} taskName - Name of the task
 * @returns {Object|null} - {suggested, min, max, confidence} or null if insufficient data
 */
export const suggestDuration = (taskName) => {
  const history = getTaskHistoryByName(taskName);

  if (history.length < 3) return null; // Need at least 3 data points

  const durations = history.map(t => t.actualDuration);
  const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const stdDev = calculateStdDev(durations);

  return {
    suggested: Math.round(avg),
    min: Math.round(Math.max(1, avg - stdDev)), // At least 1 minute
    max: Math.round(avg + stdDev),
    confidence: Math.min(100, history.length * 10) // 10% per data point, max 100%
  };
};

/**
 * Calculate duration accuracy percentage
 * @param {number} estimated - Estimated duration
 * @param {number} actual - Actual duration
 * @returns {number} - Accuracy percentage (0-100)
 */
export const calculateDurationAccuracy = (estimated, actual) => {
  if (!estimated || !actual) return null;

  const diff = Math.abs(estimated - actual);
  const accuracy = Math.max(0, 100 - (diff / estimated) * 100);

  return Math.round(accuracy);
};

/**
 * Track reschedule option frequency
 * @param {string} option - The option chosen ('complete', 'continue', 'later_today', etc.)
 */
export const trackRescheduleOption = (option) => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-reschedule-analytics') || '{}');

    if (!analytics.optionFrequency) {
      analytics.optionFrequency = {};
    }

    analytics.optionFrequency[option] = (analytics.optionFrequency[option] || 0) + 1;

    localStorage.setItem('timeflow-reschedule-analytics', JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to track reschedule option', e);
  }
};

/**
 * Get reschedule option frequencies
 * @returns {Object} - Map of option -> frequency
 */
export const getRescheduleOptionFrequencies = () => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-reschedule-analytics') || '{}');
    return analytics.optionFrequency || {};
  } catch (e) {
    console.error('Failed to load reschedule analytics', e);
    return {};
  }
};

/**
 * Determine task category based on name (for context-aware suggestions)
 * @param {string} taskName - Name of the task
 * @returns {string} - Category: 'email', 'coding', 'meetings', 'admin', 'creative', 'other'
 */
export const getTaskCategory = (taskName) => {
  const name = taskName.toLowerCase();

  if (name.includes('email') || name.includes('mail') || name.includes('inbox')) {
    return 'email';
  } else if (name.includes('code') || name.includes('program') || name.includes('debug') || name.includes('implement')) {
    return 'coding';
  } else if (name.includes('meeting') || name.includes('call') || name.includes('standup') || name.includes('sync')) {
    return 'meetings';
  } else if (name.includes('admin') || name.includes('paperwork') || name.includes('expense') || name.includes('invoice')) {
    return 'admin';
  } else if (name.includes('write') || name.includes('design') || name.includes('create') || name.includes('brainstorm')) {
    return 'creative';
  }

  return 'other';
};

/**
 * Track task completion by hour for energy pattern analysis
 * @param {Object} task - Completed task with completedAt timestamp
 */
export const trackCompletionByHour = (task) => {
  try {
    if (!task.completedAt || !task.completed) return;

    const analytics = JSON.parse(localStorage.getItem('timeflow-energy-patterns') || '{}');

    if (!analytics.hourlyCompletionRates) {
      analytics.hourlyCompletionRates = {};
    }

    const hour = new Date(task.completedAt).getHours();
    const hourKey = String(hour).padStart(2, '0');

    if (!analytics.hourlyCompletionRates[hourKey]) {
      analytics.hourlyCompletionRates[hourKey] = { completed: 0, total: 0 };
    }

    analytics.hourlyCompletionRates[hourKey].completed += 1;
    analytics.hourlyCompletionRates[hourKey].total += 1;

    localStorage.setItem('timeflow-energy-patterns', JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to track completion by hour', e);
  }
};

/**
 * Track task attempt by hour (for failure rate tracking)
 * @param {string} time - ISO timestamp when task was attempted
 */
export const trackAttemptByHour = (time) => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-energy-patterns') || '{}');

    if (!analytics.hourlyCompletionRates) {
      analytics.hourlyCompletionRates = {};
    }

    const hour = new Date(time).getHours();
    const hourKey = String(hour).padStart(2, '0');

    if (!analytics.hourlyCompletionRates[hourKey]) {
      analytics.hourlyCompletionRates[hourKey] = { completed: 0, total: 0 };
    }

    analytics.hourlyCompletionRates[hourKey].total += 1;

    localStorage.setItem('timeflow-energy-patterns', JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to track attempt by hour', e);
  }
};

/**
 * Get completion rate for a specific hour
 * @param {number} hour - Hour of day (0-23)
 * @returns {number} - Completion rate (0-1) or null if no data
 */
export const getHourlyCompletionRate = (hour) => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-energy-patterns') || '{}');
    const hourKey = String(hour).padStart(2, '0');

    const data = analytics.hourlyCompletionRates?.[hourKey];
    if (!data || data.total === 0) return null;

    return data.completed / data.total;
  } catch (e) {
    console.error('Failed to get hourly completion rate', e);
    return null;
  }
};

/**
 * Get all hourly completion rates
 * @returns {Object} - Map of hour -> completion rate
 */
export const getAllHourlyCompletionRates = () => {
  try {
    const analytics = JSON.parse(localStorage.getItem('timeflow-energy-patterns') || '{}');

    if (!analytics.hourlyCompletionRates) return {};

    const rates = {};
    Object.entries(analytics.hourlyCompletionRates).forEach(([hour, data]) => {
      rates[hour] = data.total > 0 ? data.completed / data.total : 0;
    });

    return rates;
  } catch (e) {
    console.error('Failed to get all hourly completion rates', e);
    return {};
  }
};
