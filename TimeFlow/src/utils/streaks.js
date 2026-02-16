/**
 * Gentle Streaks & Mindful Gamification
 *
 * A non-toxic streak system that encourages consistency over perfection.
 * Features grace periods, supportive messaging, and nature-themed visuals.
 */

// Get today's date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().slice(0, 10);

// Get yesterday's date string
const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
};

// Calculate days between two dates
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Default streak object structure
 */
const getDefaultStreak = () => ({
  current: 0,
  longest: 0,
  lastActiveDate: null,
  graceAvailable: true,
  paused: false,
  totalActiveDays: 0,
  createdAt: new Date().toISOString(),
  plantStage: 'seed', // seed, seedling, sprout, plant, vine, flower
  lastGraceReset: getTodayString()
});

/**
 * Load streak data from localStorage
 */
export const loadStreak = () => {
  try {
    const data = localStorage.getItem('timeflow-streak');
    if (data) {
      const streak = JSON.parse(data);

      // Reset grace token weekly (every Monday)
      const today = new Date();
      const lastReset = new Date(streak.lastGraceReset);
      const daysSinceReset = daysBetween(lastReset, today);

      if (daysSinceReset >= 7) {
        streak.graceAvailable = true;
        streak.lastGraceReset = getTodayString();
      }

      return streak;
    }
    return getDefaultStreak();
  } catch (e) {
    console.error('Failed to load streak', e);
    return getDefaultStreak();
  }
};

/**
 * Save streak data to localStorage
 */
export const saveStreak = (streak) => {
  try {
    localStorage.setItem('timeflow-streak', JSON.stringify(streak));
  } catch (e) {
    console.error('Failed to save streak', e);
  }
};

/**
 * Check if user performed a meaningful action today
 * This is tracked separately and called when actions happen
 */
export const markMeaningfulAction = () => {
  const today = getTodayString();
  try {
    const actions = JSON.parse(localStorage.getItem('timeflow-daily-actions') || '{}');
    actions[today] = true;
    localStorage.setItem('timeflow-daily-actions', JSON.stringify(actions));
  } catch (e) {
    console.error('Failed to mark action', e);
  }
};

/**
 * Check if user had a meaningful action on a given date
 */
const hadMeaningfulAction = (date) => {
  try {
    const actions = JSON.parse(localStorage.getItem('timeflow-daily-actions') || '{}');
    return actions[date] === true;
  } catch (e) {
    return false;
  }
};

/**
 * Update streak based on current date
 * This should be called when:
 * - App loads
 * - User completes a task
 * - User starts focus mode
 * - User interacts with timeline
 */
export const updateStreak = () => {
  const streak = loadStreak();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Already processed today
  if (streak.lastActiveDate === today) {
    return streak;
  }

  // Check if user did something meaningful today
  const actionToday = hadMeaningfulAction(today);

  if (!actionToday) {
    // No action yet today, just return current streak
    return streak;
  }

  // User did something meaningful today
  streak.totalActiveDays += 1;

  // Check streak continuity
  if (streak.lastActiveDate === yesterday) {
    // Continuing streak from yesterday
    streak.current += 1;
    streak.lastActiveDate = today;
    streak.paused = false;

    // Update longest streak
    if (streak.current > streak.longest) {
      streak.longest = streak.current;
    }
  } else if (streak.lastActiveDate === null) {
    // First time using streak system
    streak.current = 1;
    streak.lastActiveDate = today;
    streak.longest = 1;
  } else {
    // Missed at least one day
    const daysMissed = daysBetween(streak.lastActiveDate, today) - 1;

    if (daysMissed === 1 && streak.graceAvailable) {
      // Missed exactly 1 day, use grace token
      streak.current += 1;
      streak.lastActiveDate = today;
      streak.graceAvailable = false;
      streak.paused = false;

      if (streak.current > streak.longest) {
        streak.longest = streak.current;
      }
    } else if (daysMissed === 1 && !streak.graceAvailable) {
      // Missed 1 day, no grace - pause streak
      streak.paused = true;
      streak.lastActiveDate = today;
      // Don't reset yet, give them one more day
    } else {
      // Missed 2+ days or already paused - reset streak
      streak.current = 1;
      streak.lastActiveDate = today;
      streak.paused = false;
    }
  }

  // Update plant stage based on streak
  streak.plantStage = getPlantStage(streak.current);

  saveStreak(streak);
  return streak;
};

/**
 * Determine plant growth stage based on streak length
 */
const getPlantStage = (streakDays) => {
  if (streakDays === 0) return 'seed';
  if (streakDays <= 3) return 'seedling';
  if (streakDays <= 7) return 'sprout';
  if (streakDays <= 14) return 'plant';
  if (streakDays <= 30) return 'vine';
  return 'flower';
};

/**
 * Get plant emoji based on stage
 */
export const getPlantEmoji = (stage) => {
  const emojis = {
    seed: '🌰',
    seedling: '🌱',
    sprout: '🌿',
    plant: '🪴',
    vine: '🌿🌿',
    flower: '🌸'
  };
  return emojis[stage] || '🌱';
};

/**
 * Get supportive message based on streak and context
 */
export const getStreakMessage = (streak) => {
  const { current, paused, graceAvailable } = streak;

  if (paused) {
    return "Your plant is resting today 🌙\nPick it up when you're ready.";
  }

  if (current === 1) {
    return "Every season starts with a seed 🌱";
  }

  if (current <= 3) {
    return "Your habit is taking root";
  }

  if (current <= 7) {
    return "Growing steadily 🌿";
  }

  if (current <= 14) {
    return "Strong roots, steady growth";
  }

  if (current <= 30) {
    return "Your practice is flourishing 🌿";
  }

  return "Beautiful growth 🌸";
};

/**
 * Get milestone message for special streak numbers
 */
export const getMilestoneMessage = (streakDays) => {
  const milestones = {
    1: "🌱 First day! You showed up.",
    3: "🌿 Three days of growth!",
    7: "🪴 One week! Your habit is rooting.",
    14: "🌿 Two weeks! Steady progress.",
    30: "🌸 One month! Your practice blooms.",
    60: "🌳 Two months! Strong and thriving.",
    100: "🌳✨ 100 days! Incredible dedication."
  };

  return milestones[streakDays] || null;
};

/**
 * Get color scheme for current plant stage
 */
export const getPlantColors = (stage) => {
  const colors = {
    seed: { primary: '#8B7355', secondary: '#A0826D' },
    seedling: { primary: '#9BC49B', secondary: '#7CAF7C' },
    sprout: { primary: '#6FAF6F', secondary: '#4F8F4F' },
    plant: { primary: '#5FA05F', secondary: '#3B8E3B' },
    vine: { primary: '#4F9F4F', secondary: '#2E7E2E' },
    flower: { primary: '#E8A5E8', secondary: '#C77DC7' }
  };

  return colors[stage] || colors.seedling;
};
