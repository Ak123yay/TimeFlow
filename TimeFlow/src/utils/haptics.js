// src/utils/haptics.js
// Haptic feedback utility for mobile devices

/**
 * Trigger haptic feedback on mobile devices
 * Uses the Vibration API for tactile feedback
 */

/**
 * Light haptic feedback (10ms vibration)
 * Use for: button taps, toggle switches, minor interactions
 */
export function hapticLight() {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

/**
 * Medium haptic feedback (20ms vibration)
 * Use for: starting tasks, selecting items, moderate interactions
 */
export function hapticMedium() {
  if ('vibrate' in navigator) {
    navigator.vibrate(20);
  }
}

/**
 * Heavy haptic feedback (double pulse: 30ms, 10ms pause, 30ms)
 * Use for: deleting items, important actions, errors
 */
export function hapticHeavy() {
  if ('vibrate' in navigator) {
    navigator.vibrate([30, 10, 30]);
  }
}

/**
 * Success haptic feedback (triple pulse: 10ms, 30ms, 10ms with pauses)
 * Use for: task completion, successful operations
 */
export function hapticSuccess() {
  if ('vibrate' in navigator) {
    navigator.vibrate([10, 30, 10, 30, 10]);
  }
}

/**
 * Error haptic feedback (strong double pulse: 50ms, 20ms pause, 50ms)
 * Use for: failed operations, validation errors
 */
export function hapticError() {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 20, 50]);
  }
}

/**
 * Warning haptic feedback (gradual pulse: 20ms, 40ms, 20ms)
 * Use for: warnings, conflicts, attention-needed states
 */
export function hapticWarning() {
  if ('vibrate' in navigator) {
    navigator.vibrate([20, 15, 40, 15, 20]);
  }
}

/**
 * Selection haptic feedback (very light: 5ms)
 * Use for: swipe gestures, drag operations, continuous feedback
 */
export function hapticSelection() {
  if ('vibrate' in navigator) {
    navigator.vibrate(5);
  }
}

/**
 * Notification haptic feedback (distinctive pattern)
 * Use for: incoming notifications, alerts, reminders
 */
export function hapticNotification() {
  if ('vibrate' in navigator) {
    navigator.vibrate([30, 20, 30, 20, 50]);
  }
}

/**
 * Check if haptic feedback is available on this device
 * @returns {boolean} True if vibration API is supported
 */
export function isHapticsAvailable() {
  return 'vibrate' in navigator;
}

/**
 * Default haptic object for easier imports
 */
export const haptic = {
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
  success: hapticSuccess,
  error: hapticError,
  warning: hapticWarning,
  selection: hapticSelection,
  notification: hapticNotification,
  isAvailable: isHapticsAvailable
};

/**
 * Usage Examples:
 *
 * import { haptic } from '../utils/haptics';
 *
 * // On task completion
 * haptic.success();
 *
 * // On delete action
 * haptic.heavy();
 *
 * // On button tap
 * haptic.light();
 *
 * // On task start
 * haptic.medium();
 *
 * // On error
 * haptic.error();
 */
