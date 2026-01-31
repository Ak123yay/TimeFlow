// src/utils/scheduler.js

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
  
  // Calculate total time needed for today's tasks
  const todayTasksTime = todayTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
  
  // Calculate total time needed for unfinished tasks
  const unfinishedTime = unfinishedTasks.reduce((sum, t) => sum + (t.remaining || t.duration || 0), 0);
  
  // Check if everything fits
  const totalTime = todayTasksTime + unfinishedTime;
  
  if (totalTime <= availableMinutes) {
    // Everything fits - place unfinished tasks first
    return [...unfinishedTasks, ...todayTasks];
  } else {
    // Not everything fits - prioritize unfinished tasks
    const fitsInToday = [];
    let usedTime = 0;
    
    // Add unfinished tasks first
    for (const task of unfinishedTasks) {
      const taskTime = task.remaining || task.duration || 0;
      if (usedTime + taskTime <= availableMinutes) {
        fitsInToday.push(task);
        usedTime += taskTime;
      } else {
        // This task doesn't fit today - would need to move to tomorrow
        // For v1, we just won't schedule it
      }
    }
    
    // Add today's tasks if there's space
    for (const task of todayTasks) {
      const taskTime = task.duration || 0;
      if (usedTime + taskTime <= availableMinutes) {
        fitsInToday.push(task);
        usedTime += taskTime;
      }
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

export const scheduler = {
  schedule: scheduleTasksSequentially,
  reschedule: rescheduleUnfinishedTasks,
  optimize: (schedule) => schedule
};