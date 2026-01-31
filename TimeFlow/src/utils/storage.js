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
