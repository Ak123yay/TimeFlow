// First-time tooltip tracking
const TOOLTIP_KEY = 'timeflow-tooltips-seen';

export const getTooltipsSeen = () => {
  try {
    const seen = localStorage.getItem(TOOLTIP_KEY);
    return seen ? JSON.parse(seen) : {};
  } catch (e) {
    return {};
  }
};

export const markTooltipSeen = (tabName) => {
  try {
    const seen = getTooltipsSeen();
    seen[tabName] = true;
    localStorage.setItem(TOOLTIP_KEY, JSON.stringify(seen));
  } catch (e) {
    console.error('Failed to save tooltip state', e);
  }
};

export const hasSeenTooltip = (tabName) => {
  const seen = getTooltipsSeen();
  return seen[tabName] === true;
};

export const TOOLTIP_CONTENT = {
  today: {
    title: "Today's Flow",
    description: "Your daily task timeline starts here. Add tasks, set times, and track your progress throughout the day. Tap the timer icon to start working on a task.",
    icon: "🌿"
  },
  week: {
    title: "Weekly Overview",
    description: "See your entire week at a glance. Track completed tasks, view reflections, and switch to month view to see the full calendar.",
    icon: "📅"
  },
  pool: {
    title: "Task Pool",
    description: "Your backlog of tasks waiting to be scheduled. Drag tasks to today when you're ready to work on them, or schedule them for specific days.",
    icon: "🌊"
  },
  stats: {
    title: "Day Reflection",
    description: "Review your daily progress and reflect on what went well. Track your mood and decide what to do with unfinished tasks.",
    icon: "📊"
  },
  streak: {
    title: "Growth Streak",
    description: "Watch your plant grow as you maintain consistency. The streak has grace periods, so missing a day won't break your progress.",
    icon: "🔥"
  }
};
