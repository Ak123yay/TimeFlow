// src/utils/smartReschedule.js
// ============================================================================
// SMART RESCHEDULING ENGINE - AI-like behavioral intelligence
// ============================================================================
//
// This module powers TimeFlow's intelligent rescheduling by learning from
// user behavior patterns, predicting completion probability, detecting
// procrastination, scoring optimal time slots, and generating personalized
// multi-factor recommendations.
// ============================================================================

import {
  getRescheduleOptionFrequencies,
  getTaskHistoryByName,
  suggestDuration,
  getTaskCategory,
  getAllHourlyCompletionRates,
  getHourlyCompletionRate,
} from './analytics';
import { findNextFreeSlot, getDeadlineUrgency } from './scheduler';
import { loadTasksForDate, getAllTaskDates } from './storage';

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
  BEHAVIORAL_PROFILE: 'timeflow-behavioral-profile',
  RESCHEDULE_HISTORY: 'timeflow-reschedule-history',
  CATEGORY_STATS: 'timeflow-category-stats',
  DAY_OF_WEEK_STATS: 'timeflow-dow-stats',
  PROCRASTINATION_LOG: 'timeflow-procrastination-log',
  SESSION_LOG: 'timeflow-session-log',
};

const CATEGORY_KEYWORDS = {
  email: ['email', 'mail', 'inbox', 'reply', 'respond', 'message'],
  coding: ['code', 'program', 'debug', 'implement', 'develop', 'build', 'deploy', 'fix bug', 'refactor', 'test', 'review pr'],
  meetings: ['meeting', 'call', 'standup', 'sync', 'interview', 'presentation', 'demo', '1:1', 'one-on-one', 'retro'],
  admin: ['admin', 'paperwork', 'expense', 'invoice', 'report', 'file', 'organize', 'clean', 'update spreadsheet'],
  creative: ['write', 'design', 'create', 'brainstorm', 'sketch', 'prototype', 'draft', 'blog', 'article', 'plan'],
  health: ['exercise', 'workout', 'gym', 'run', 'walk', 'meditate', 'yoga', 'stretch', 'break'],
  learning: ['learn', 'study', 'read', 'course', 'tutorial', 'research', 'explore', 'practice'],
  personal: ['errand', 'appointment', 'grocery', 'cook', 'laundry', 'doctor', 'dentist', 'bank', 'shop'],
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ============================================================================
// HELPER: Safe localStorage access
// ============================================================================

function safeLoad(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`smartReschedule: failed to load ${key}`, e);
    return fallback;
  }
}

function safeSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`smartReschedule: failed to save ${key}`, e);
  }
}

// ============================================================================
// 1. ENHANCED TASK CATEGORIZATION
// ============================================================================

/**
 * Categorize a task with confidence scoring using keyword density analysis.
 * Returns primary and secondary categories with confidence scores.
 *
 * @param {string} taskName - The task name to categorize
 * @returns {{ primary: string, secondary: string|null, confidence: number }}
 */
export const categorizeTask = (taskName) => {
  const name = taskName.toLowerCase().trim();
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (name.includes(kw)) {
        // Longer keyword matches are more specific, so weight them higher
        score += kw.length;
      }
    }
    if (score > 0) {
      scores[category] = score;
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return { primary: 'other', secondary: null, confidence: 0.3 };
  }

  const topScore = sorted[0][1];
  const maxPossible = Math.max(name.length, 10);
  const confidence = Math.min(0.95, topScore / maxPossible + 0.3);

  return {
    primary: sorted[0][0],
    secondary: sorted.length > 1 ? sorted[1][0] : null,
    confidence: Math.round(confidence * 100) / 100,
  };
};

// ============================================================================
// 2. BEHAVIORAL PATTERN TRACKER
// ============================================================================

/**
 * Record a rescheduling decision with full context for pattern analysis.
 *
 * @param {Object} params
 * @param {Object} params.task - The task being rescheduled
 * @param {string} params.option - The option chosen (complete, continue, later_today, etc.)
 * @param {number} params.hour - Hour when decision was made (0-23)
 * @param {number} params.dayOfWeek - Day of week (0=Sun, 6=Sat)
 * @param {number} params.remainingMinutes - Minutes remaining on timer
 * @param {number} params.elapsedMinutes - Minutes elapsed since task started
 */
export const recordRescheduleDecision = ({
  task,
  option,
  hour,
  dayOfWeek,
  remainingMinutes,
  elapsedMinutes,
}) => {
  const history = safeLoad(STORAGE_KEYS.RESCHEDULE_HISTORY, []);
  const category = categorizeTask(task.name);

  const entry = {
    timestamp: new Date().toISOString(),
    taskName: task.name,
    taskId: task.id,
    category: category.primary,
    option,
    hour,
    dayOfWeek,
    dayName: DAY_NAMES[dayOfWeek],
    duration: task.duration || 0,
    remaining: remainingMinutes,
    elapsed: elapsedMinutes,
    attempts: task.attempts || 0,
    hadDeadline: !!task.deadline,
    wasCarriedOver: !!task.carriedOver,
    deadlineUrgency: task.deadline ? getDeadlineUrgency(task)?.level || null : null,
  };

  history.push(entry);

  // Keep last 500 entries
  while (history.length > 500) {
    history.shift();
  }

  safeSave(STORAGE_KEYS.RESCHEDULE_HISTORY, history);

  // Update aggregated stats
  _updateCategoryStats(entry);
  _updateDayOfWeekStats(entry);
  _updateBehavioralProfile(entry);
};

/**
 * Update per-category aggregated statistics.
 */
function _updateCategoryStats(entry) {
  const stats = safeLoad(STORAGE_KEYS.CATEGORY_STATS, {});

  if (!stats[entry.category]) {
    stats[entry.category] = {
      totalDecisions: 0,
      completions: 0,
      reschedules: 0,
      avgDuration: 0,
      avgAttempts: 0,
      optionCounts: {},
      totalDuration: 0,
      totalAttempts: 0,
    };
  }

  const cat = stats[entry.category];
  cat.totalDecisions += 1;
  cat.totalDuration += entry.duration;
  cat.totalAttempts += entry.attempts;
  cat.avgDuration = Math.round(cat.totalDuration / cat.totalDecisions);
  cat.avgAttempts = Math.round((cat.totalAttempts / cat.totalDecisions) * 10) / 10;

  if (entry.option === 'complete') {
    cat.completions += 1;
  } else {
    cat.reschedules += 1;
  }

  cat.optionCounts[entry.option] = (cat.optionCounts[entry.option] || 0) + 1;

  safeSave(STORAGE_KEYS.CATEGORY_STATS, stats);
}

/**
 * Update per-day-of-week aggregated statistics.
 */
function _updateDayOfWeekStats(entry) {
  const stats = safeLoad(STORAGE_KEYS.DAY_OF_WEEK_STATS, {});

  const dayKey = String(entry.dayOfWeek);
  if (!stats[dayKey]) {
    stats[dayKey] = {
      dayName: entry.dayName,
      totalDecisions: 0,
      completions: 0,
      reschedules: 0,
      hourlyBreakdown: {},
    };
  }

  const day = stats[dayKey];
  day.totalDecisions += 1;

  if (entry.option === 'complete') {
    day.completions += 1;
  } else {
    day.reschedules += 1;
  }

  const hourKey = String(entry.hour).padStart(2, '0');
  if (!day.hourlyBreakdown[hourKey]) {
    day.hourlyBreakdown[hourKey] = { completions: 0, reschedules: 0 };
  }
  if (entry.option === 'complete') {
    day.hourlyBreakdown[hourKey].completions += 1;
  } else {
    day.hourlyBreakdown[hourKey].reschedules += 1;
  }

  safeSave(STORAGE_KEYS.DAY_OF_WEEK_STATS, stats);
}

/**
 * Update the user's behavioral profile with running averages.
 */
function _updateBehavioralProfile(entry) {
  const profile = safeLoad(STORAGE_KEYS.BEHAVIORAL_PROFILE, {
    totalDecisions: 0,
    preferredOptions: {},
    avgDecisionHour: 0,
    completionTendency: 0.5, // 0 = always reschedule, 1 = always complete
    procrastinationScore: 0, // 0-100
    consistencyScore: 50,    // 0-100
    _sumHours: 0,
    _completions: 0,
    _reschedules: 0,
    lastUpdated: null,
  });

  profile.totalDecisions += 1;
  profile._sumHours += entry.hour;
  profile.avgDecisionHour = Math.round(profile._sumHours / profile.totalDecisions);

  if (entry.option === 'complete') {
    profile._completions += 1;
  } else {
    profile._reschedules += 1;
  }

  profile.completionTendency =
    Math.round((profile._completions / profile.totalDecisions) * 100) / 100;

  // Track option preferences
  profile.preferredOptions[entry.option] =
    (profile.preferredOptions[entry.option] || 0) + 1;

  // Update procrastination score (rolling average of attempts)
  const avgAttempts = entry.attempts;
  const procWeight = 0.1; // Exponential smoothing factor
  profile.procrastinationScore = Math.round(
    profile.procrastinationScore * (1 - procWeight) +
    Math.min(100, avgAttempts * 20) * procWeight
  );

  profile.lastUpdated = new Date().toISOString();
  safeSave(STORAGE_KEYS.BEHAVIORAL_PROFILE, profile);
}

// ============================================================================
// 3. PROCRASTINATION DETECTOR
// ============================================================================

/**
 * Analyze a task for procrastination patterns. Returns detailed analysis
 * with severity, patterns detected, and intervention suggestions.
 *
 * @param {Object} task - The task to analyze
 * @returns {Object} Procrastination analysis
 */
export const detectProcrastination = (task) => {
  const attempts = task.attempts || 0;
  const category = categorizeTask(task.name);
  const categoryStats = safeLoad(STORAGE_KEYS.CATEGORY_STATS, {});
  const history = safeLoad(STORAGE_KEYS.RESCHEDULE_HISTORY, []);

  const analysis = {
    severity: 'none',      // none | mild | moderate | severe | chronic
    score: 0,              // 0-100
    patterns: [],          // Detected pattern descriptions
    interventions: [],     // Suggested actions
    categoryAvoidance: 0,  // How much this category is avoided (0-1)
    taskSpecificRate: 0,   // Reschedule rate for this specific task name
    dayOfWeekFactor: 0,    // How much today's day affects things
  };

  // ---- Factor 1: Raw attempt count (0-35 points) ----
  if (attempts >= 7) {
    analysis.score += 35;
    analysis.patterns.push(`Rescheduled ${attempts} times - chronic avoidance pattern`);
  } else if (attempts >= 5) {
    analysis.score += 28;
    analysis.patterns.push(`Rescheduled ${attempts} times - strong avoidance`);
  } else if (attempts >= 3) {
    analysis.score += 18;
    analysis.patterns.push(`Rescheduled ${attempts} times - building avoidance`);
  } else if (attempts >= 1) {
    analysis.score += 6;
  }

  // ---- Factor 2: Category avoidance rate (0-25 points) ----
  const catStats = categoryStats[category.primary];
  if (catStats && catStats.totalDecisions >= 5) {
    const rescheduleRate = catStats.reschedules / catStats.totalDecisions;
    analysis.categoryAvoidance = Math.round(rescheduleRate * 100) / 100;

    if (rescheduleRate > 0.7) {
      analysis.score += 25;
      analysis.patterns.push(
        `${category.primary} tasks rescheduled ${Math.round(rescheduleRate * 100)}% of the time`
      );
    } else if (rescheduleRate > 0.5) {
      analysis.score += 15;
      analysis.patterns.push(
        `${category.primary} tasks often rescheduled (${Math.round(rescheduleRate * 100)}%)`
      );
    } else if (rescheduleRate > 0.3) {
      analysis.score += 8;
    }
  }

  // ---- Factor 3: Task-specific repetition (0-20 points) ----
  const taskHistory = history.filter(
    (h) => h.taskName.toLowerCase() === task.name.toLowerCase()
  );
  if (taskHistory.length >= 3) {
    const taskReschedules = taskHistory.filter((h) => h.option !== 'complete').length;
    const taskRate = taskReschedules / taskHistory.length;
    analysis.taskSpecificRate = Math.round(taskRate * 100) / 100;

    if (taskRate > 0.8) {
      analysis.score += 20;
      analysis.patterns.push(
        `"${task.name}" specifically rescheduled ${Math.round(taskRate * 100)}% of the time`
      );
    } else if (taskRate > 0.5) {
      analysis.score += 12;
    }
  }

  // ---- Factor 4: Day-of-week effect (0-10 points) ----
  const today = new Date().getDay();
  const dowStats = safeLoad(STORAGE_KEYS.DAY_OF_WEEK_STATS, {});
  const todayStats = dowStats[String(today)];
  if (todayStats && todayStats.totalDecisions >= 5) {
    const todayRescheduleRate = todayStats.reschedules / todayStats.totalDecisions;
    analysis.dayOfWeekFactor = Math.round(todayRescheduleRate * 100) / 100;

    if (todayRescheduleRate > 0.6) {
      analysis.score += 10;
      analysis.patterns.push(
        `${DAY_NAMES[today]}s have high reschedule rate (${Math.round(todayRescheduleRate * 100)}%)`
      );
    } else if (todayRescheduleRate > 0.4) {
      analysis.score += 5;
    }
  }

  // ---- Factor 5: Duration mismatch (0-10 points) ----
  const durationSuggestion = suggestDuration(task.name);
  if (durationSuggestion && task.duration) {
    const ratio = task.duration / durationSuggestion.suggested;
    if (ratio < 0.6) {
      // User is significantly underestimating
      analysis.score += 10;
      analysis.patterns.push(
        `Estimated ${task.duration}min but usually takes ~${durationSuggestion.suggested}min`
      );
    } else if (ratio < 0.8) {
      analysis.score += 5;
      analysis.patterns.push(
        `Slightly underestimated (${task.duration}min vs usual ~${durationSuggestion.suggested}min)`
      );
    }
  }

  // ---- Determine severity ----
  if (analysis.score >= 70) {
    analysis.severity = 'chronic';
  } else if (analysis.score >= 50) {
    analysis.severity = 'severe';
  } else if (analysis.score >= 30) {
    analysis.severity = 'moderate';
  } else if (analysis.score >= 15) {
    analysis.severity = 'mild';
  } else {
    analysis.severity = 'none';
  }

  // ---- Generate interventions ----
  if (analysis.severity === 'chronic' || analysis.severity === 'severe') {
    analysis.interventions.push({
      type: 'break_task',
      label: 'Break into 2-3 smaller tasks',
      reason: 'Large or vague tasks trigger avoidance. Smaller tasks feel achievable.',
      priority: 1,
    });
    analysis.interventions.push({
      type: 'reduce_duration',
      label: `Try a ${Math.max(5, Math.round((task.duration || 30) * 0.3))}min chunk`,
      reason: 'Start with a tiny portion to break the avoidance cycle.',
      priority: 2,
    });
    if (attempts >= 5) {
      analysis.interventions.push({
        type: 'eliminate',
        label: 'Consider removing this task',
        reason: 'After 5+ reschedules, this task may no longer be needed.',
        priority: 3,
      });
    }
  } else if (analysis.severity === 'moderate') {
    analysis.interventions.push({
      type: 'break_task',
      label: 'Break into smaller pieces',
      reason: 'Smaller tasks are easier to start and complete.',
      priority: 1,
    });
    if (durationSuggestion) {
      analysis.interventions.push({
        type: 'adjust_duration',
        label: `Set duration to ${durationSuggestion.suggested}min`,
        reason: `Based on ${durationSuggestion.confidence}% confidence from past completions.`,
        priority: 2,
      });
    }
  } else if (analysis.severity === 'mild') {
    if (durationSuggestion && task.duration < durationSuggestion.suggested) {
      analysis.interventions.push({
        type: 'adjust_duration',
        label: `Adjust to ${durationSuggestion.suggested}min`,
        reason: 'More realistic duration reduces the need to reschedule.',
        priority: 1,
      });
    }
  }

  return analysis;
};

// ============================================================================
// 4. COMPLETION PROBABILITY PREDICTOR
// ============================================================================

/**
 * Predict the probability that a task will be completed on this attempt.
 * Uses a multi-factor weighted model based on historical data.
 *
 * @param {Object} task - Task to predict
 * @param {Object} availability - User's availability window
 * @returns {{ probability: number, confidence: number, factors: Object[], label: string }}
 */
export const predictCompletionProbability = (task, availability) => {
  const factors = [];
  let weightedSum = 0;
  let totalWeight = 0;

  const category = categorizeTask(task.name);
  const categoryStats = safeLoad(STORAGE_KEYS.CATEGORY_STATS, {});
  const profile = safeLoad(STORAGE_KEYS.BEHAVIORAL_PROFILE, {});
  const dowStats = safeLoad(STORAGE_KEYS.DAY_OF_WEEK_STATS, {});

  // ---- Factor 1: Base completion tendency (weight: 3) ----
  const baseTendency = profile.completionTendency || 0.5;
  factors.push({
    name: 'Base completion rate',
    value: baseTendency,
    weight: 3,
    description: `You complete ${Math.round(baseTendency * 100)}% of tasks on first try`,
  });
  weightedSum += baseTendency * 3;
  totalWeight += 3;

  // ---- Factor 2: Attempt decay (weight: 4) ----
  // Each reschedule reduces probability significantly
  const attempts = task.attempts || 0;
  const attemptFactor = Math.max(0.05, 1 - attempts * 0.18);
  factors.push({
    name: 'Reschedule history',
    value: attemptFactor,
    weight: 4,
    description: attempts === 0
      ? 'First attempt - best chance'
      : `${attempts} prior reschedule(s) reduce likelihood`,
  });
  weightedSum += attemptFactor * 4;
  totalWeight += 4;

  // ---- Factor 3: Category success rate (weight: 2) ----
  const catStats = categoryStats[category.primary];
  if (catStats && catStats.totalDecisions >= 3) {
    const catRate = catStats.completions / catStats.totalDecisions;
    factors.push({
      name: `${category.primary} category rate`,
      value: catRate,
      weight: 2,
      description: `${category.primary} tasks completed ${Math.round(catRate * 100)}% of the time`,
    });
    weightedSum += catRate * 2;
    totalWeight += 2;
  }

  // ---- Factor 4: Time-of-day energy (weight: 2) ----
  const currentHour = new Date().getHours();
  const hourlyRate = getHourlyCompletionRate(currentHour);
  if (hourlyRate !== null) {
    factors.push({
      name: 'Current hour productivity',
      value: hourlyRate,
      weight: 2,
      description: `${Math.round(hourlyRate * 100)}% completion rate at ${currentHour}:00`,
    });
    weightedSum += hourlyRate * 2;
    totalWeight += 2;
  }

  // ---- Factor 5: Day-of-week performance (weight: 1.5) ----
  const today = new Date().getDay();
  const todayDow = dowStats[String(today)];
  if (todayDow && todayDow.totalDecisions >= 3) {
    const dowRate = todayDow.completions / todayDow.totalDecisions;
    factors.push({
      name: `${DAY_NAMES[today]} performance`,
      value: dowRate,
      weight: 1.5,
      description: `${Math.round(dowRate * 100)}% completion rate on ${DAY_NAMES[today]}s`,
    });
    weightedSum += dowRate * 1.5;
    totalWeight += 1.5;
  }

  // ---- Factor 6: Deadline urgency boost (weight: 2) ----
  const urgency = getDeadlineUrgency(task);
  if (urgency) {
    let urgencyBoost = 0.5;
    if (urgency.level === 'overdue') urgencyBoost = 0.7; // Overdue tasks DO get done
    else if (urgency.level === 'today') urgencyBoost = 0.8;
    else if (urgency.level === 'tomorrow') urgencyBoost = 0.65;
    else if (urgency.level === 'soon') urgencyBoost = 0.55;

    factors.push({
      name: 'Deadline urgency',
      value: urgencyBoost,
      weight: 2,
      description: `${urgency.message} adds urgency motivation`,
    });
    weightedSum += urgencyBoost * 2;
    totalWeight += 2;
  }

  // ---- Factor 7: Duration realism (weight: 1.5) ----
  const durationSuggestion = suggestDuration(task.name);
  if (durationSuggestion && task.duration) {
    const ratio = Math.min(task.duration, durationSuggestion.suggested) /
                  Math.max(task.duration, durationSuggestion.suggested);
    factors.push({
      name: 'Duration accuracy',
      value: ratio,
      weight: 1.5,
      description: ratio > 0.8
        ? 'Duration estimate is realistic'
        : `Estimate may be off (usually takes ~${durationSuggestion.suggested}min)`,
    });
    weightedSum += ratio * 1.5;
    totalWeight += 1.5;
  }

  // ---- Factor 8: Carried-over penalty (weight: 1) ----
  if (task.carriedOver) {
    factors.push({
      name: 'Carried over',
      value: 0.4,
      weight: 1,
      description: 'Carried tasks have lower completion rates',
    });
    weightedSum += 0.4 * 1;
    totalWeight += 1;
  }

  // ---- Calculate final probability ----
  const probability = totalWeight > 0
    ? Math.round((weightedSum / totalWeight) * 100) / 100
    : 0.5;

  // Confidence based on how many data points we have
  const dataPoints = (profile.totalDecisions || 0) +
    (catStats?.totalDecisions || 0) +
    (todayDow?.totalDecisions || 0);
  const confidence = Math.min(0.95, Math.max(0.2, dataPoints / 50));

  // Human-readable label
  let label;
  if (probability >= 0.8) label = 'Very likely';
  else if (probability >= 0.6) label = 'Likely';
  else if (probability >= 0.4) label = 'Uncertain';
  else if (probability >= 0.2) label = 'Unlikely';
  else label = 'Very unlikely';

  return {
    probability: Math.max(0.05, Math.min(0.95, probability)),
    confidence: Math.round(confidence * 100) / 100,
    factors,
    label,
  };
};

// ============================================================================
// 5. OPTIMAL TIME SLOT SCORER
// ============================================================================

/**
 * Find and score all available time slots for a task, then return them
 * ranked by suitability based on energy patterns and category fit.
 *
 * @param {Object} task - Task to schedule
 * @param {Array} existingTasks - Already scheduled tasks (with start/end in minutes)
 * @param {Object} availability - { start: "HH:MM", end: "HH:MM" }
 * @returns {Array<{ startTime: string, endTime: string, score: number, reasons: string[] }>}
 */
export const findScoredSlots = (task, existingTasks, availability) => {
  if (!availability) return [];

  const startM = _hhmmToMinutes(availability.start);
  const endM = _hhmmToMinutes(availability.end);
  const now = new Date();
  const currentM = now.getHours() * 60 + now.getMinutes();
  const taskDuration = task.remaining || task.duration || 30;
  const category = categorizeTask(task.name);
  const hourlyRates = getAllHourlyCompletionRates();

  // Collect all free slots
  const scheduled = existingTasks
    .filter((t) => t.start != null && t.end != null && !t.completed && t.id !== task.id)
    .sort((a, b) => a.start - b.start);

  const freeSlots = [];
  let cursor = Math.max(startM, currentM + 10);

  for (const t of scheduled) {
    if (t.start > cursor) {
      const gap = t.start - cursor;
      if (gap >= taskDuration) {
        freeSlots.push({ start: cursor, end: cursor + taskDuration });
      }
    }
    cursor = Math.max(cursor, t.end);
  }

  // Final gap after last task
  if (endM - cursor >= taskDuration) {
    freeSlots.push({ start: cursor, end: cursor + taskDuration });
  }

  if (freeSlots.length === 0) return [];

  // Score each slot
  const scored = freeSlots.map((slot) => {
    let score = 50; // baseline
    const reasons = [];
    const slotHour = Math.floor(slot.start / 60);

    // Energy match (0-25 points)
    const hourKey = String(slotHour).padStart(2, '0');
    const completionRate = hourlyRates[hourKey];
    if (completionRate !== undefined) {
      const energyScore = Math.round(completionRate * 25);
      score += energyScore;
      if (completionRate >= 0.7) {
        reasons.push(`High productivity hour (${Math.round(completionRate * 100)}%)`);
      }
    }

    // Category-time fit (0-15 points)
    const categoryTimeScore = _getCategoryTimeFit(category.primary, slotHour);
    score += categoryTimeScore;
    if (categoryTimeScore >= 10) {
      reasons.push(`Good time for ${category.primary} tasks`);
    }

    // Proximity to current time (0-10 points, sooner = better for urgent)
    const urgency = getDeadlineUrgency(task);
    if (urgency && (urgency.level === 'overdue' || urgency.level === 'today')) {
      const proximityScore = Math.max(0, 10 - Math.floor((slot.start - currentM) / 30));
      score += proximityScore;
      if (proximityScore > 5) {
        reasons.push('Sooner is better for urgent tasks');
      }
    }

    // Buffer quality (0-10 points, slots with breathing room before/after)
    const prevEnd = _findPrevTaskEnd(slot.start, scheduled);
    const nextStart = _findNextTaskStart(slot.end, scheduled);
    const bufferBefore = slot.start - (prevEnd || startM);
    const bufferAfter = (nextStart || endM) - slot.end;
    if (bufferBefore >= 15 && bufferAfter >= 15) {
      score += 10;
      reasons.push('Good buffer time before and after');
    } else if (bufferBefore >= 10 || bufferAfter >= 10) {
      score += 5;
    }

    return {
      startTime: _minutesToHHMM(slot.start),
      endTime: _minutesToHHMM(slot.end),
      startMinutes: slot.start,
      score: Math.min(100, Math.max(0, score)),
      reasons,
      hour: slotHour,
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  return scored;
};

/**
 * Category-time fit heuristic. Certain tasks are better at certain times.
 */
function _getCategoryTimeFit(category, hour) {
  const timePreferences = {
    creative: { peak: [8, 9, 10, 11], good: [14, 15], bad: [16, 17, 18] },
    coding: { peak: [9, 10, 11, 14, 15], good: [8, 16], bad: [12, 13, 17] },
    meetings: { peak: [10, 11, 14, 15], good: [9, 16], bad: [8, 12, 17, 18] },
    email: { peak: [8, 9, 16, 17], good: [12, 13], bad: [10, 11, 14, 15] },
    admin: { peak: [13, 14, 15, 16], good: [11, 12], bad: [8, 9] },
    health: { peak: [7, 8, 12, 17, 18], good: [6, 13], bad: [9, 10, 14, 15] },
    learning: { peak: [8, 9, 10, 19, 20], good: [14, 15], bad: [12, 13, 16] },
    personal: { peak: [12, 13, 17, 18], good: [8, 9], bad: [10, 11, 14, 15] },
  };

  const prefs = timePreferences[category];
  if (!prefs) return 5; // neutral for 'other'

  if (prefs.peak.includes(hour)) return 15;
  if (prefs.good.includes(hour)) return 10;
  if (prefs.bad.includes(hour)) return 0;
  return 5; // neutral
}

function _findPrevTaskEnd(beforeMinute, scheduled) {
  for (let i = scheduled.length - 1; i >= 0; i--) {
    if (scheduled[i].end <= beforeMinute) return scheduled[i].end;
  }
  return null;
}

function _findNextTaskStart(afterMinute, scheduled) {
  for (const t of scheduled) {
    if (t.start >= afterMinute) return t.start;
  }
  return null;
}

// ============================================================================
// 6. SMART CONTINUE DURATION ESTIMATOR
// ============================================================================

/**
 * Instead of always "+1 min", suggest how much more time the task actually
 * needs based on historical duration data and how much time has elapsed.
 *
 * @param {Object} task - Active task
 * @param {number} elapsedSeconds - Seconds elapsed so far
 * @returns {{ suggestedMinutes: number, reason: string, confidence: string }}
 */
export const estimateContinueDuration = (task, elapsedSeconds) => {
  const elapsedMin = Math.ceil(elapsedSeconds / 60);
  const estimatedDuration = task.duration || 30;

  // Check historical data
  const durationSuggestion = suggestDuration(task.name);

  if (durationSuggestion && durationSuggestion.confidence >= 50) {
    const usualDuration = durationSuggestion.suggested;
    const remaining = Math.max(1, usualDuration - elapsedMin);

    if (remaining <= 5) {
      return {
        suggestedMinutes: remaining,
        reason: `Usually done in ~${usualDuration}min, ~${remaining}min left`,
        confidence: 'high',
      };
    }
    return {
      suggestedMinutes: Math.min(remaining, 15),
      reason: `Usually takes ~${usualDuration}min total, suggesting ${Math.min(remaining, 15)}min more`,
      confidence: 'moderate',
    };
  }

  // Fallback: estimate based on how far over we are
  const overBy = elapsedMin - estimatedDuration;
  if (overBy <= 0) {
    return { suggestedMinutes: 5, reason: 'Timer ended, adding 5 more minutes', confidence: 'low' };
  }
  if (overBy < 10) {
    return { suggestedMinutes: 5, reason: 'Slightly over, 5 more minutes should do', confidence: 'low' };
  }
  if (overBy < 30) {
    return { suggestedMinutes: 10, reason: 'Significantly over estimate, adding 10 minutes', confidence: 'low' };
  }
  return {
    suggestedMinutes: 15,
    reason: 'Well over original estimate. Consider breaking this task down.',
    confidence: 'low',
  };
};

// ============================================================================
// 7. WORKLOAD BALANCE ANALYZER
// ============================================================================

/**
 * Analyze workload distribution across the upcoming week and suggest
 * which day would be best to reschedule a task to.
 *
 * @param {Object} task - Task to reschedule
 * @param {Object} availability - User's availability
 * @returns {Array<{ date: string, dayName: string, load: number, capacity: number, score: number }>}
 */
export const analyzeWeekdayWorkload = (task, availability) => {
  if (!availability) return [];

  const startM = _hhmmToMinutes(availability.start);
  const endM = _hhmmToMinutes(availability.end);
  const totalCapacity = endM - startM;

  const today = new Date();
  const results = [];

  // Look at next 6 days (tomorrow through +6)
  for (let i = 1; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);
    const dayOfWeek = date.getDay();
    const dayName = DAY_NAMES[dayOfWeek];

    // Skip weekends if most work is on weekdays (heuristic)
    const dowStats = safeLoad(STORAGE_KEYS.DAY_OF_WEEK_STATS, {});
    const dayData = dowStats[String(dayOfWeek)];

    const dayTasks = loadTasksForDate(dateStr);
    const totalLoad = dayTasks.reduce(
      (sum, t) => sum + (t.completed ? 0 : (t.remaining || t.duration || 0)),
      0
    );

    const freeMinutes = Math.max(0, totalCapacity - totalLoad);
    const taskDuration = task.remaining || task.duration || 30;

    // Score this day (higher = better fit)
    let score = 50;

    // Free capacity fit (0-30 points)
    if (freeMinutes >= taskDuration * 2) {
      score += 30; // Plenty of room
    } else if (freeMinutes >= taskDuration) {
      score += 20; // Fits
    } else if (freeMinutes >= taskDuration * 0.5) {
      score += 5;  // Tight
    } else {
      score -= 20; // Doesn't fit well
    }

    // Day-of-week completion rate (0-15 points)
    if (dayData && dayData.totalDecisions >= 3) {
      const completionRate = dayData.completions / dayData.totalDecisions;
      score += Math.round(completionRate * 15);
    }

    // Deadline proximity (0-10 points, push towards earlier if deadline)
    const urgency = getDeadlineUrgency(task);
    if (urgency) {
      score += Math.max(0, 10 - i * 2); // Earlier days score higher
    }

    // Balance preference: avoid days already heavy (-10 to +5)
    const loadRatio = totalLoad / totalCapacity;
    if (loadRatio > 0.8) {
      score -= 10; // Already overloaded
    } else if (loadRatio < 0.3) {
      score += 5; // Light day - good target
    }

    results.push({
      date: dateStr,
      dayName,
      dayOfWeek,
      loadMinutes: totalLoad,
      freeMinutes,
      capacityMinutes: totalCapacity,
      loadPercent: Math.round((totalLoad / totalCapacity) * 100),
      taskCount: dayTasks.filter((t) => !t.completed).length,
      fits: freeMinutes >= taskDuration,
      score: Math.max(0, Math.min(100, score)),
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
};

// ============================================================================
// 8. MASTER RECOMMENDATION ENGINE
// ============================================================================

/**
 * Generate the master recommendation for the reschedule modal. This combines
 * ALL intelligence signals into a ranked list of options with explanations.
 *
 * @param {Object} params
 * @param {Object} params.task - Task being rescheduled
 * @param {Object} params.availability - User availability
 * @param {Array}  params.existingTasks - Today's tasks with start/end
 * @param {number} params.elapsedSeconds - Seconds task has been running
 * @returns {Object} Full recommendation analysis
 */
export const generateSmartRecommendation = ({
  task,
  availability,
  existingTasks,
  elapsedSeconds,
}) => {
  const now = new Date();
  const urgency = getDeadlineUrgency(task);
  const procrastination = detectProcrastination(task);
  const completionProb = predictCompletionProbability(task, availability);
  const scoredSlots = findScoredSlots(task, existingTasks, availability);
  const continueDuration = estimateContinueDuration(task, elapsedSeconds || 0);
  const weekdayWorkload = analyzeWeekdayWorkload(task, availability);
  const profile = safeLoad(STORAGE_KEYS.BEHAVIORAL_PROFILE, {});
  const category = categorizeTask(task.name);

  const bestSlot = scoredSlots.length > 0 ? scoredSlots[0] : null;
  const bestDay = weekdayWorkload.length > 0 ? weekdayWorkload[0] : null;

  // ---- Contextual signals ----
  const currentHour = now.getHours();
  const elapsedMin = elapsedSeconds ? Math.round(elapsedSeconds / 60) : 0;
  const estimatedDuration = task.duration || 30;
  const remaining = task.remaining ?? Math.max(0, estimatedDuration - elapsedMin);
  const workedFullDuration = elapsedMin >= estimatedDuration * 0.85;
  const isShortTask = estimatedDuration <= 15;
  const isMorning = currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 17;
  const isEvening = currentHour >= 17 && currentHour < 20;
  const isNight = currentHour >= 20;
  const attempts = task.attempts || 0;

  // Duration insight from historical data (only if enough history exists)
  const durationInsight = suggestDuration(task.name);
  const hasDurationInsight = durationInsight && durationInsight.confidence >= 30;
  // How far off is the user's estimate? >1 = underestimated, <1 = overestimated
  const durationRatio = hasDurationInsight
    ? durationInsight.suggested / estimatedDuration
    : 1;

  // ---- Score each option ----
  const optionScores = [];

  // --- COMPLETE ---
  // Timer ending ≠ task done. Only recommend when there's real evidence.
  let completeScore = 15;
  let completeReason = 'Mark as done if you actually finished.';

  // Short tasks that ran full duration are likely done
  if (isShortTask && workedFullDuration) {
    completeScore += 20;
    completeReason = 'Short task and you worked the full duration - likely done!';
  } else if (workedFullDuration) {
    completeScore += 8;
  }

  // Urgency pushes toward completion
  if (urgency?.level === 'overdue') {
    completeScore += 30;
    completeReason = 'This task is OVERDUE. Completing now prevents further delays.';
  } else if (urgency?.level === 'today') {
    completeScore += 22;
    completeReason = 'Due today - finishing now avoids deadline stress.';
  } else if (urgency?.level === 'tomorrow') {
    completeScore += 12;
    completeReason = 'Due tomorrow - completing today gives you breathing room.';
  }

  if (attempts >= 4) {
    completeScore += 10;
    completeReason += ' Time to break the reschedule cycle.';
  } else if (attempts >= 2) {
    completeScore += 5;
  }

  // Duration insight: if user overestimated (task usually shorter), more likely done
  if (hasDurationInsight && durationRatio < 0.75) {
    completeScore += 12;
    completeReason = `This usually takes ~${durationInsight.suggested}min (shorter than your ${estimatedDuration}min estimate). Probably done!`;
  } else if (hasDurationInsight && durationRatio < 0.9) {
    completeScore += 5;
  }

  optionScores.push({
    option: 'complete',
    score: completeScore,
    label: 'Mark complete',
    icon: '✓',
    reason: completeReason,
    tag: urgency?.level === 'overdue' ? 'URGENT' : null,
  });

  // --- CONTINUE ---
  // Default best option: timer ended = user was working and needs more time.
  let continueScore = 42;
  let continueReason = `Add ${continueDuration.suggestedMinutes} more minutes. ${continueDuration.reason}`;

  // Almost done → strong push to continue
  if (continueDuration.suggestedMinutes <= 5) {
    continueScore += 18;
    continueReason = `Almost done! Just ~${continueDuration.suggestedMinutes} more minutes.`;
  } else if (continueDuration.confidence === 'high') {
    continueScore += 12;
  } else if (continueDuration.confidence === 'moderate') {
    continueScore += 6;
  }

  // User was actually working (spent most of the time) → in flow
  if (workedFullDuration) {
    continueScore += 8;
    continueReason = `You've been focused. ${continueDuration.suggestedMinutes} more minutes to finish.`;
  }

  // Time of day affects energy to continue
  if (isNight) {
    continueScore -= 15; // Tired, don't push it
  } else if (isEvening) {
    continueScore -= 5;
  }

  // Chronic avoidance: continuing won't help, user needs a different approach
  if (procrastination.severity === 'chronic' || procrastination.severity === 'severe') {
    continueScore -= 12;
  }

  // User historically prefers to continue
  const continuePreferRate = _getOptionPreferenceRate('continue', profile);
  if (continuePreferRate > 0.25) {
    continueScore += 5;
  }

  // Duration insight: if user underestimated (task usually takes longer), push to continue
  if (hasDurationInsight && durationRatio > 1.3) {
    continueScore += 12;
    continueReason = `This usually takes ~${durationInsight.suggested}min (you estimated ${estimatedDuration}min). Keep going!`;
  } else if (hasDurationInsight && durationRatio > 1.1) {
    continueScore += 5;
  }

  optionScores.push({
    option: 'continue',
    score: continueScore,
    label: `Continue (+${continueDuration.suggestedMinutes}min)`,
    icon: '⏱️',
    reason: continueReason,
    suggestedMinutes: continueDuration.suggestedMinutes,
  });

  // --- LATER TODAY ---
  // Good when user needs a break but can come back today.
  if (bestSlot) {
    let laterScore = 32;
    let laterReason = `Free slot at ${bestSlot.startTime}`;

    if (bestSlot.score >= 75) {
      laterScore += 18;
      laterReason += ' - optimal time for this type of task.';
    } else if (bestSlot.score >= 50) {
      laterScore += 10;
      laterReason += ' - good fit.';
    } else {
      laterReason += '.';
    }

    // Time of day: plenty of day left → good option; evening → less viable
    if (isMorning || isAfternoon) {
      laterScore += 8;
    } else if (isEvening) {
      laterScore -= 5;
    } else if (isNight) {
      laterScore -= 15; // Slots at night are bad
    }

    if (urgency?.level === 'today') {
      laterScore += 15; // Must stay today if due today
    }

    // User historically picks this
    const preferRate = _getOptionPreferenceRate('later_today', profile);
    if (preferRate > 0.2) {
      laterScore += 8;
    }

    // Duration insight: task usually takes longer → rescheduling to a dedicated slot makes sense
    if (hasDurationInsight && durationRatio > 1.3) {
      laterScore += 8;
      laterReason += ` This usually takes ~${durationInsight.suggested}min — a fresh slot helps.`;
    }

    if (bestSlot.reasons.length > 0) {
      laterReason += ` ${bestSlot.reasons[0]}.`;
    }

    optionScores.push({
      option: 'later_today',
      score: laterScore,
      label: `Later today (${bestSlot.startTime})`,
      icon: '🕐',
      reason: laterReason,
      slot: bestSlot,
    });
  }

  // --- TOMORROW ---
  // Best when the day is winding down or there's no deadline pressure.
  let tomorrowScore = 25;
  let tomorrowReason = 'Move to tomorrow for a fresh start.';

  // Time of day: THE biggest factor for choosing tomorrow
  if (isNight) {
    tomorrowScore += 25;
    tomorrowReason = 'It\'s late. A fresh start tomorrow will be more productive.';
  } else if (isEvening) {
    tomorrowScore += 15;
    tomorrowReason = 'Day is winding down. Tomorrow you\'ll have more energy.';
  } else if (isMorning) {
    tomorrowScore -= 8; // It's morning! Don't give up on today yet.
  }

  // Urgency: penalize for urgent, boost for no deadline
  if (urgency?.level === 'overdue' || urgency?.level === 'today') {
    tomorrowScore -= 20;
    tomorrowReason = 'Not ideal - this task is due today or overdue!';
  } else if (urgency?.level === 'tomorrow') {
    tomorrowScore -= 10;
    tomorrowReason = 'Risky - due tomorrow, you\'ll be under pressure.';
  } else if (!urgency) {
    tomorrowScore += 8;
    tomorrowReason = 'No deadline pressure. A fresh start tomorrow often helps.';
  }

  // Best day analysis
  if (bestDay && bestDay.score > 60 && bestDay.dayName !== DAY_NAMES[(now.getDay() + 1) % 7]) {
    tomorrowReason += ` (${bestDay.dayName} might be even better)`;
  }
  if (bestDay && bestDay.freeMinutes >= (task.remaining || task.duration || 30) * 2) {
    tomorrowScore += 5;
  }

  // User tendency
  const tomorrowPreferRate = _getOptionPreferenceRate('tomorrow', profile);
  if (tomorrowPreferRate > 0.25) {
    tomorrowScore += 6;
  }

  // Duration insight: big underestimate → plan a proper time block tomorrow
  if (hasDurationInsight && durationRatio > 1.5) {
    tomorrowScore += 8;
    tomorrowReason += ` Usually takes ~${durationInsight.suggested}min — schedule a proper block.`;
  }

  optionScores.push({
    option: 'tomorrow',
    score: Math.max(0, tomorrowScore),
    label: 'Tomorrow',
    icon: '📅',
    reason: tomorrowReason,
    tag: urgency?.level === 'overdue' || urgency?.level === 'today' ? 'NOT IDEAL' : null,
    bestDay,
  });

  // --- BACK TO POOL ---
  // Honest option for low-priority / chronically-avoided tasks.
  let poolScore = 18;
  let poolReason = 'Return to the pool for later. No pressure.';
  if (urgency) {
    poolScore -= 12;
    poolReason = 'Has a deadline - pool might cause you to miss it.';
  } else {
    poolScore += 8; // No deadline → pool is perfectly fine
  }
  if (attempts >= 5) {
    poolScore += 15;
    poolReason = 'Rescheduled 5+ times. Maybe this task doesn\'t need to happen right now.';
  } else if (attempts >= 3) {
    poolScore += 7;
    poolReason = 'Been put off multiple times. Pool lets you revisit when you\'re ready.';
  }
  // User preference
  const poolPreferRate = _getOptionPreferenceRate('back_to_pool', profile);
  if (poolPreferRate > 0.15) {
    poolScore += 5;
  }

  optionScores.push({
    option: 'back_to_pool',
    score: Math.max(0, poolScore),
    label: 'Back to Pool',
    icon: '🌊',
    reason: poolReason,
  });

  // --- BREAK TASK ---
  // Only surfaces strongly when there's real avoidance or the task is huge.
  let breakScore = 10;
  let breakReason = 'Split into smaller, more manageable pieces.';
  if (procrastination.severity === 'chronic' || procrastination.severity === 'severe') {
    breakScore += 40;
    breakReason = 'Strong avoidance detected. Breaking it down makes each piece achievable.';
  } else if (procrastination.severity === 'moderate') {
    breakScore += 22;
    breakReason = 'You\'ve been putting this off. Smaller tasks are easier to start.';
  } else if (attempts >= 3) {
    breakScore += 15;
    breakReason = `Rescheduled ${attempts} times. Smaller pieces may be easier.`;
  }
  if ((task.duration || 30) >= 60) {
    breakScore += 12;
    breakReason += ` At ${task.duration}min, it's a big block.`;
  } else if ((task.duration || 30) >= 45) {
    breakScore += 5;
  }
  optionScores.push({
    option: 'break_task',
    score: breakScore,
    label: 'Break into smaller tasks',
    icon: '🔨',
    reason: breakReason,
    show: attempts >= 2 || (task.duration || 0) >= 45 || procrastination.severity !== 'none',
  });

  // --- PICK TIME ---
  let pickTimeScore = 12;
  optionScores.push({
    option: 'pick_time',
    score: pickTimeScore,
    label: 'Pick custom time',
    icon: '🎯',
    reason: 'Choose your own time manually.',
  });

  // ---- Sort by score ----
  optionScores.sort((a, b) => b.score - a.score);

  // ---- Build final recommendation ----
  const topOption = optionScores[0];
  const runnerUp = optionScores[1];

  let confidence;
  const scoreDiff = topOption.score - (runnerUp?.score || 0);
  if (scoreDiff >= 25) confidence = 'high';
  else if (scoreDiff >= 10) confidence = 'moderate';
  else confidence = 'low';

  return {
    primary: topOption,
    ranked: optionScores,
    confidence,
    analysis: {
      procrastination,
      completionProbability: completionProb,
      bestSlot,
      bestDay,
      continueDuration,
      category,
      urgency,
    },
    summary: _buildSummaryMessage(topOption, procrastination, completionProb, urgency),
  };
};

/**
 * Build a human-readable summary message.
 */
function _buildSummaryMessage(topOption, procrastination, completionProb, urgency) {
  const parts = [];

  if (urgency?.level === 'overdue') {
    parts.push('This task is overdue.');
  } else if (urgency?.level === 'today') {
    parts.push('Due today.');
  }

  if (procrastination.severity === 'chronic') {
    parts.push('Chronic avoidance detected.');
  } else if (procrastination.severity === 'severe') {
    parts.push('Strong avoidance pattern.');
  } else if (procrastination.severity === 'moderate') {
    parts.push('Some avoidance building.');
  }

  if (completionProb.probability < 0.3) {
    parts.push(`Completion probability: ${Math.round(completionProb.probability * 100)}%.`);
  }

  parts.push(topOption.reason);

  return parts.join(' ');
}

function _getOptionPreferenceRate(option, profile) {
  if (!profile.preferredOptions || !profile.totalDecisions) return 0;
  return (profile.preferredOptions[option] || 0) / profile.totalDecisions;
}

// ============================================================================
// 9. PATTERN INSIGHTS GENERATOR
// ============================================================================

/**
 * Generate human-readable insights about the user's rescheduling patterns.
 * Useful for the insights dashboard and reschedule modal context.
 *
 * @returns {Array<{ type: string, message: string, severity: string, data: any }>}
 */
export const generatePatternInsights = () => {
  const insights = [];
  const profile = safeLoad(STORAGE_KEYS.BEHAVIORAL_PROFILE, {});
  const categoryStats = safeLoad(STORAGE_KEYS.CATEGORY_STATS, {});
  const dowStats = safeLoad(STORAGE_KEYS.DAY_OF_WEEK_STATS, {});
  const history = safeLoad(STORAGE_KEYS.RESCHEDULE_HISTORY, []);

  if (profile.totalDecisions < 5) {
    return [{
      type: 'info',
      message: 'Keep using TimeFlow! Insights will appear after a few more tasks.',
      severity: 'info',
      data: { decisionsNeeded: 5 - (profile.totalDecisions || 0) },
    }];
  }

  // ---- Insight 1: Completion tendency ----
  const tendency = profile.completionTendency || 0.5;
  if (tendency >= 0.7) {
    insights.push({
      type: 'positive',
      message: `You complete ${Math.round(tendency * 100)}% of tasks on first try. Strong execution!`,
      severity: 'good',
      data: { rate: tendency },
    });
  } else if (tendency < 0.4) {
    insights.push({
      type: 'concern',
      message: `Only ${Math.round(tendency * 100)}% of tasks completed on first try. Consider shorter durations or breaking tasks down.`,
      severity: 'warning',
      data: { rate: tendency },
    });
  }

  // ---- Insight 2: Most avoided category ----
  const categoryEntries = Object.entries(categoryStats)
    .filter(([, stats]) => stats.totalDecisions >= 5)
    .map(([cat, stats]) => ({
      category: cat,
      avoidanceRate: stats.reschedules / stats.totalDecisions,
      total: stats.totalDecisions,
    }))
    .sort((a, b) => b.avoidanceRate - a.avoidanceRate);

  if (categoryEntries.length > 0 && categoryEntries[0].avoidanceRate > 0.5) {
    const worst = categoryEntries[0];
    insights.push({
      type: 'pattern',
      message: `${worst.category} tasks are rescheduled ${Math.round(worst.avoidanceRate * 100)}% of the time. Try shorter sessions or different scheduling.`,
      severity: 'warning',
      data: worst,
    });
  }

  // ---- Insight 3: Best and worst days ----
  const dayEntries = Object.entries(dowStats)
    .filter(([, stats]) => stats.totalDecisions >= 3)
    .map(([day, stats]) => ({
      day: stats.dayName,
      completionRate: stats.completions / stats.totalDecisions,
      total: stats.totalDecisions,
    }))
    .sort((a, b) => b.completionRate - a.completionRate);

  if (dayEntries.length >= 2) {
    const best = dayEntries[0];
    const worst = dayEntries[dayEntries.length - 1];
    if (best.completionRate - worst.completionRate > 0.2) {
      insights.push({
        type: 'pattern',
        message: `${best.day}s are your most productive (${Math.round(best.completionRate * 100)}% completion). ${worst.day}s are toughest (${Math.round(worst.completionRate * 100)}%).`,
        severity: 'info',
        data: { best, worst },
      });
    }
  }

  // ---- Insight 4: Preferred reschedule option ----
  if (profile.preferredOptions) {
    const sorted = Object.entries(profile.preferredOptions)
      .filter(([opt]) => opt !== 'complete')
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length > 0) {
      const topNonComplete = sorted[0];
      const pref = topNonComplete[0].replace(/_/g, ' ');
      insights.push({
        type: 'habit',
        message: `When rescheduling, you most often choose "${pref}" (${topNonComplete[1]} times).`,
        severity: 'info',
        data: { option: topNonComplete[0], count: topNonComplete[1] },
      });
    }
  }

  // ---- Insight 5: Duration accuracy ----
  const taskHistory = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');
  if (taskHistory.length >= 5) {
    const recent = taskHistory.slice(-20);
    const overEstimates = recent.filter(
      (h) => h.actualDuration && h.estimatedDuration && h.actualDuration < h.estimatedDuration * 0.7
    ).length;
    const underEstimates = recent.filter(
      (h) => h.actualDuration && h.estimatedDuration && h.actualDuration > h.estimatedDuration * 1.3
    ).length;

    if (underEstimates > recent.length * 0.4) {
      insights.push({
        type: 'concern',
        message: `You underestimate task duration ${Math.round((underEstimates / recent.length) * 100)}% of the time. Try adding 30% buffer to estimates.`,
        severity: 'warning',
        data: { underEstimates, total: recent.length },
      });
    } else if (overEstimates > recent.length * 0.4) {
      insights.push({
        type: 'positive',
        message: `You often finish faster than estimated. Consider tighter time blocks to fit more tasks.`,
        severity: 'good',
        data: { overEstimates, total: recent.length },
      });
    }
  }

  // ---- Insight 6: Peak productivity window ----
  const hourlyRates = getAllHourlyCompletionRates();
  const hourEntries = Object.entries(hourlyRates)
    .filter(([, rate]) => rate > 0)
    .sort((a, b) => b[1] - a[1]);

  if (hourEntries.length >= 3) {
    const peakHour = parseInt(hourEntries[0][0]);
    const peakRate = hourEntries[0][1];
    const period = peakHour < 12 ? 'morning' : peakHour < 17 ? 'afternoon' : 'evening';
    insights.push({
      type: 'positive',
      message: `Your peak productivity is at ${peakHour}:00 (${Math.round(peakRate * 100)}% completion rate). Schedule important tasks in the ${period}.`,
      severity: 'good',
      data: { peakHour, peakRate, period },
    });
  }

  // ---- Insight 7: Chronic procrastination tasks ----
  const taskCounts = {};
  history.forEach((h) => {
    if (h.option !== 'complete') {
      taskCounts[h.taskName] = (taskCounts[h.taskName] || 0) + 1;
    }
  });
  const chronicTasks = Object.entries(taskCounts)
    .filter(([, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1]);

  if (chronicTasks.length > 0) {
    const worstTask = chronicTasks[0];
    insights.push({
      type: 'concern',
      message: `"${worstTask[0]}" has been rescheduled ${worstTask[1]} times. Consider breaking it down or removing it.`,
      severity: 'warning',
      data: { taskName: worstTask[0], count: worstTask[1] },
    });
  }

  return insights;
};

// ============================================================================
// 10. SESSION PERFORMANCE TRACKER
// ============================================================================

/**
 * Track a completed focus session for trend analysis.
 *
 * @param {Object} params
 * @param {Object} params.task - The task
 * @param {boolean} params.completed - Whether the task was completed
 * @param {number} params.durationMinutes - Session length in minutes
 * @param {string} params.outcome - The reschedule option chosen
 */
export const trackSession = ({ task, completed, durationMinutes, outcome }) => {
  const sessions = safeLoad(STORAGE_KEYS.SESSION_LOG, []);
  const category = categorizeTask(task.name);

  sessions.push({
    timestamp: new Date().toISOString(),
    taskName: task.name,
    category: category.primary,
    completed,
    durationMinutes,
    outcome,
    hour: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
  });

  // Keep last 200 sessions
  while (sessions.length > 200) {
    sessions.shift();
  }

  safeSave(STORAGE_KEYS.SESSION_LOG, sessions);
};

/**
 * Get session statistics for the current day.
 *
 * @returns {{ totalSessions: number, completedSessions: number, totalMinutes: number, completionRate: number, streak: number }}
 */
export const getTodaySessionStats = () => {
  const sessions = safeLoad(STORAGE_KEYS.SESSION_LOG, []);
  const today = new Date().toISOString().slice(0, 10);

  const todaySessions = sessions.filter(
    (s) => s.timestamp && s.timestamp.startsWith(today)
  );

  const completed = todaySessions.filter((s) => s.completed);
  const totalMinutes = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  // Current completion streak (consecutive completions from most recent)
  let streak = 0;
  for (let i = todaySessions.length - 1; i >= 0; i--) {
    if (todaySessions[i].completed) streak++;
    else break;
  }

  return {
    totalSessions: todaySessions.length,
    completedSessions: completed.length,
    totalMinutes,
    completionRate: todaySessions.length > 0
      ? Math.round((completed.length / todaySessions.length) * 100) / 100
      : 0,
    streak,
  };
};

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

function _hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function _minutesToHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
