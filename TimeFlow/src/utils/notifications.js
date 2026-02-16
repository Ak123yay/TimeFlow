// src/utils/notifications.js
// Mobile notification system for task reminders

/**
 * Request notification permission from user
 * @returns {Promise<boolean>} True if permission granted
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Check if notifications are supported and enabled
 * @returns {boolean}
 */
export function areNotificationsEnabled() {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Schedule notification for a task
 * @param {Object} task - Task object with name and startTime
 * @param {number} minutesBefore - Minutes before task to notify (0 for task start, 5 for warning)
 */
export function scheduleTaskNotification(task, minutesBefore = 0) {
  if (!areNotificationsEnabled() || !task.startTime) {
    return;
  }

  // Parse task start time
  const [hours, minutes] = task.startTime.split(':').map(Number);
  const now = new Date();
  const taskTime = new Date();
  taskTime.setHours(hours, minutes, 0, 0);

  // If task time has passed today, skip
  if (taskTime <= now) {
    return;
  }

  // Calculate notification time
  const notificationTime = new Date(taskTime.getTime() - minutesBefore * 60 * 1000);
  const timeUntilNotification = notificationTime.getTime() - now.getTime();

  // Don't schedule if notification time has passed
  if (timeUntilNotification <= 0) {
    return;
  }

  // Schedule notification
  const timeoutId = setTimeout(() => {
    const title = minutesBefore === 0
      ? `⏰ Task Starting Now`
      : `⏰ Task Starting in ${minutesBefore} Minutes`;

    const body = minutesBefore === 0
      ? `"${task.name}" is starting now!`
      : `"${task.name}" starts at ${task.startTime}`;

    showNotification(title, body, task.id);
  }, timeUntilNotification);

  // Store timeout ID for potential cancellation
  return timeoutId;
}

/**
 * Show a notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} tag - Unique tag for the notification
 */
export function showNotification(title, body, tag = 'timeflow') {
  if (!areNotificationsEnabled()) {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag,
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200]
  });

  // Auto-close after 10 seconds
  setTimeout(() => notification.close(), 10000);

  // Focus app when notification clicked
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

/**
 * Schedule all notifications for a list of tasks
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Array of timeout IDs
 */
export function scheduleAllTaskNotifications(tasks) {
  const timeoutIds = [];

  tasks.forEach(task => {
    if (task.startTime && !task.completed) {
      // 5-minute warning
      const warningId = scheduleTaskNotification(task, 5);
      if (warningId) timeoutIds.push(warningId);

      // Task start notification
      const startId = scheduleTaskNotification(task, 0);
      if (startId) timeoutIds.push(startId);
    }
  });

  return timeoutIds;
}

/**
 * Cancel scheduled notifications
 * @param {Array} timeoutIds - Array of timeout IDs to cancel
 */
export function cancelNotifications(timeoutIds) {
  if (Array.isArray(timeoutIds)) {
    timeoutIds.forEach(id => clearTimeout(id));
  }
}

/**
 * Get notification preference from localStorage
 * @returns {boolean}
 */
export function getNotificationPreference() {
  const pref = localStorage.getItem('timeflow-notifications-enabled');
  return pref === 'true';
}

/**
 * Save notification preference to localStorage
 * @param {boolean} enabled
 */
export function setNotificationPreference(enabled) {
  localStorage.setItem('timeflow-notifications-enabled', enabled ? 'true' : 'false');
}
