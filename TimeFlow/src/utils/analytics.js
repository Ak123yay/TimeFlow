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

    // Keep only last 300 entries AND entries within last 90 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const pruned = history.filter(e => e.date >= cutoffStr);
    const final = pruned.length > 300 ? pruned.slice(-300) : pruned;

    localStorage.setItem('timeflow-task-history', JSON.stringify(final));
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

// ============================================================================
// WEIGHTED DURATION SUGGESTION (recency-biased moving average)
// ============================================================================

/**
 * Suggest duration using exponentially weighted moving average so that
 * recent completions count more than older ones.
 *
 * @param {string} taskName
 * @returns {Object|null} { suggested, min, max, confidence, recentTrend }
 */
export const suggestDurationWeighted = (taskName) => {
  const history = getTaskHistoryByName(taskName);
  if (history.length < 2) return null;

  const durations = history
    .filter(t => t.actualDuration && t.actualDuration > 0)
    .map(t => t.actualDuration);

  if (durations.length < 2) return null;

  // Exponentially weighted average (decay = 0.8, most recent = most weight)
  const decay = 0.8;
  let weightedSum = 0;
  let weightSum = 0;
  for (let i = 0; i < durations.length; i++) {
    const weight = Math.pow(decay, durations.length - 1 - i);
    weightedSum += durations[i] * weight;
    weightSum += weight;
  }
  const weightedAvg = weightedSum / weightSum;

  // Standard deviation
  const stdDev = calculateStdDev(durations);

  // Trend: compare last 3 vs overall
  let recentTrend = 'stable';
  if (durations.length >= 5) {
    const recentAvg = durations.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const overallAvg = durations.reduce((a, b) => a + b, 0) / durations.length;
    if (recentAvg > overallAvg * 1.15) recentTrend = 'increasing';
    else if (recentAvg < overallAvg * 0.85) recentTrend = 'decreasing';
  }

  return {
    suggested: Math.round(weightedAvg),
    min: Math.round(Math.max(1, weightedAvg - stdDev)),
    max: Math.round(weightedAvg + stdDev),
    confidence: Math.min(100, durations.length * 12),
    recentTrend,
    dataPoints: durations.length,
  };
};

// ============================================================================
// STREAK ANALYSIS (completion streaks within a day)
// ============================================================================

/**
 * Calculate the user's current in-day completion streak and longest ever.
 *
 * @param {Array} tasks - Today's tasks in chronological completion order
 * @returns {{ current: number, longest: number, momentum: string }}
 */
export const getCompletionMomentum = (tasks) => {
  const completedInOrder = tasks
    .filter(t => t.completed && t.completedAt)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

  if (completedInOrder.length === 0) {
    return { current: 0, longest: 0, momentum: 'cold' };
  }

  // Current streak = consecutive completions from the most recent decisions
  // Check all tasks in order: completed = streak continues, any in-between
  // reschedule = streak breaks
  let current = completedInOrder.length; // Simple: all completed so far today
  const longest = current;

  let momentum;
  if (current >= 5) momentum = 'on_fire';
  else if (current >= 3) momentum = 'hot';
  else if (current >= 1) momentum = 'warm';
  else momentum = 'cold';

  return { current, longest, momentum };
};

// ============================================================================
// ESTIMATION BIAS DETECTOR
// ============================================================================

/**
 * Analyze whether the user tends to over- or under-estimate durations,
 * and by how much. Useful for auto-correcting future estimates.
 *
 * @returns {{ bias: string, avgDiffPercent: number, suggestion: string, sampleSize: number }}
 */
export const getEstimationBias = () => {
  try {
    const history = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');
    const withBoth = history.filter(
      h => h.estimatedDuration && h.actualDuration &&
           h.estimatedDuration > 0 && h.actualDuration > 0
    );

    if (withBoth.length < 5) {
      return { bias: 'unknown', avgDiffPercent: 0, suggestion: 'Need more data', sampleSize: withBoth.length };
    }

    const diffs = withBoth.map(h => (h.actualDuration - h.estimatedDuration) / h.estimatedDuration);
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const avgDiffPercent = Math.round(avgDiff * 100);

    let bias, suggestion;
    if (avgDiffPercent > 20) {
      bias = 'underestimate';
      suggestion = `You underestimate by ~${avgDiffPercent}%. Try adding ${Math.round(avgDiffPercent * 0.7)}% buffer.`;
    } else if (avgDiffPercent < -20) {
      bias = 'overestimate';
      suggestion = `You overestimate by ~${Math.abs(avgDiffPercent)}%. You can schedule tighter.`;
    } else {
      bias = 'accurate';
      suggestion = 'Your estimates are generally accurate. Keep it up!';
    }

    return { bias, avgDiffPercent, suggestion, sampleSize: withBoth.length };
  } catch (e) {
    return { bias: 'unknown', avgDiffPercent: 0, suggestion: 'Error loading data', sampleSize: 0 };
  }
};

// ============================================================================
// PRODUCTIVITY SCORE (daily rolling score)
// ============================================================================

/**
 * Calculate a 0-100 productivity score for the current day based on
 * completions, timing accuracy, and consistency.
 *
 * @param {Array} tasks - Today's tasks
 * @returns {{ score: number, breakdown: Object, label: string }}
 */
export const calculateProductivityScore = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return { score: 0, breakdown: {}, label: 'No tasks yet' };
  }

  const completed = tasks.filter(t => t.completed);
  const total = tasks.length;

  // Factor 1: Completion rate (0-40 points)
  const completionRate = completed.length / total;
  const completionScore = Math.round(completionRate * 40);

  // Factor 2: Duration accuracy (0-25 points)
  const withAccuracy = completed.filter(t => t.durationAccuracy != null);
  let accuracyScore = 12; // default middle
  if (withAccuracy.length > 0) {
    const avgAccuracy = withAccuracy.reduce((s, t) => s + t.durationAccuracy, 0) / withAccuracy.length;
    accuracyScore = Math.round((avgAccuracy / 100) * 25);
  }

  // Factor 3: Low reschedule count (0-20 points)
  const totalAttempts = tasks.reduce((s, t) => s + (t.attempts || 0), 0);
  const avgAttempts = totalAttempts / total;
  let rescheduleScore;
  if (avgAttempts <= 0.5) rescheduleScore = 20;
  else if (avgAttempts <= 1) rescheduleScore = 15;
  else if (avgAttempts <= 2) rescheduleScore = 10;
  else if (avgAttempts <= 3) rescheduleScore = 5;
  else rescheduleScore = 0;

  // Factor 4: On-time starts (0-15 points)
  const withStartTime = completed.filter(t => t.startTime && t.startedAt);
  let onTimeScore = 8; // default neutral
  if (withStartTime.length > 0) {
    const onTime = withStartTime.filter(t => {
      const planned = _hhmmToMin(t.startTime);
      const actual = new Date(t.startedAt).getHours() * 60 + new Date(t.startedAt).getMinutes();
      return Math.abs(planned - actual) <= 10; // Within 10 minutes
    });
    onTimeScore = Math.round((onTime.length / withStartTime.length) * 15);
  }

  const score = Math.min(100, completionScore + accuracyScore + rescheduleScore + onTimeScore);

  let label;
  if (score >= 80) label = 'Excellent';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Developing';
  else if (score >= 20) label = 'Getting started';
  else label = 'Just beginning';

  return {
    score,
    breakdown: {
      completion: completionScore,
      accuracy: accuracyScore,
      consistency: rescheduleScore,
      punctuality: onTimeScore,
    },
    label,
  };
};

function _hhmmToMin(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
