/**
 * Icon System Constants
 * Central reference for emoji→icon mapping and icon metadata
 */

/**
 * Comprehensive emoji to icon name mapping
 * Used for reference and search functionality
 */
export const EMOJI_TO_ICON = {
  // Growth/Nature icons
  '🌿': 'leaf',
  '🌱': 'sprout',
  '🌊': 'water',
  '🌸': 'flower',
  '🌰': 'nut',
  '🪴': 'plant',
  '🌙': 'moon',
  '🌳': 'tree',
  '🍂': 'leafFall',
  '🍃': 'leafDrift',

  // Status/Action icons
  '✓': 'checkmark',
  '✕': 'close',
  '⏱️': 'stopwatch',
  '🕐': 'clock',
  '📅': 'calendar',
  '🔨': 'hammer',
  '🎯': 'target',
  '🔄': 'refresh',
  '🔁': 'repeat',
  '📥': 'inbox',

  // Emotion/Mood icons
  '🌟': 'star',
  '😊': 'happy',
  '🙂': 'content',
  '😐': 'neutral',
  '😬': 'uneasy',
  '😰': 'worried',
  '😔': 'sad',

  // UI Control icons
  '⏸': 'pause',
  '▶️': 'play',
  '🔍': 'search',
  '🗑️': 'trash',
  '⚠️': 'warning',
  '🚨': 'alert',
  '🔴': 'dangerStatus',
  '🟡': 'warningStatus',
  '⚡': 'bolt',
  '🔥': 'fire',

  // Category icons
  '💻': 'computer',
  '🤝': 'teamwork',
  '🎨': 'creative',
  '📧': 'email',
  '📋': 'admin',
  '🏃': 'health',
  '📚': 'learning',
  '🌱': 'personal',

  // Achievement icons
  '🏆': 'trophy',
  '🎉': 'celebration',
  '✨': 'spark',

  // Platform icons
  '📱': 'phone',
  '🍎': 'apple',
  '💻': 'computer',
  '🖥️': 'desktop',
  '✈️': 'airplane',

  // Misc icons
  '💡': 'bulb',
  '🛟': 'lifering',
  '📊': 'chart',
  '🔔': 'bell',
  '🔕': 'bellMuted',
  '👁️': 'eye',
};

/**
 * Icon metadata categorized by type
 * Useful for organizing and managing icons by category
 */
export const ICON_CATEGORIES = {
  growth: [
    'leaf',
    'sprout',
    'water',
    'flower',
    'nut',
    'plant',
    'moon',
    'tree',
    'leafFall',
    'leafDrift',
  ],
  status: [
    'checkmark',
    'close',
    'timer',
    'stopwatch',
    'clock',
    'calendar',
    'hammer',
    'target',
    'refresh',
    'repeat',
    'inbox',
  ],
  emotions: [
    'star',
    'happy',
    'content',
    'neutral',
    'uneasy',
    'worried',
    'sad',
  ],
  uiControls: [
    'pause',
    'play',
    'search',
    'trash',
    'warning',
    'alert',
    'dangerStatus',
    'warningStatus',
    'bolt',
    'fire',
  ],
  categories: [
    'computer',
    'teamwork',
    'creative',
    'email',
    'admin',
    'health',
    'learning',
    'personal',
  ],
  achievements: ['trophy', 'celebration', 'spark'],
  platform: ['phone', 'apple', 'computer', 'desktop', 'airplane'],
  misc: ['bulb', 'lifering', 'chart', 'bell', 'bellMuted', 'eye'],
};

/**
 * Icon size presets for consistent sizing
 */
export const ICON_SIZE_PRESETS = {
  xs: 16,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
};

/**
 * Color palette for icons
 * Maps to design tokens in App.css
 */
export const ICON_COLORS = {
  // Light mode colors
  light: {
    primary: '#3B6E3B', // Forest green
    secondary: '#7C9A73', // Moss green
    accent: '#52B788', // Fresh leaf green
    success: '#52B788',
    warning: '#F9C74F', // Golden
    danger: '#FF6B6B', // Red
    info: '#90E0EF', // Blue
    earth: '#8B7355', // Brown
    warm: '#D4A574', // Warm tan
    fire: '#FF4500', // Orange red
  },
  // Dark mode colors (brighter variants)
  dark: {
    primary: '#6FAF6F', // Lighter green
    secondary: '#8BC98B', // Lighter moss
    accent: '#6FAF6F',
    success: '#6FAF6F',
    warning: '#F9C74F', // Keep bright
    danger: '#FF9999', // Lighter red
    info: '#A8D8E8', // Lighter blue
    earth: '#A68875', // Lighter brown
    warm: '#E8C99E', // Lighter tan
    fire: '#FF6B47', // Lighter orange-red
  },
};

/**
 * Default SVG viewBox for all icons
 * Standard 24x24 grid for consistency
 */
export const ICON_VIEWBOX = '0 0 24 24';

/**
 * Category to icon mapping for task categories
 * Used in RescheduleModal and similar components
 */
export const CATEGORY_ICON_MAP = {
  coding: 'computer',
  meetings: 'teamwork',
  creative: 'creative',
  email: 'email',
  admin: 'admin',
  health: 'health',
  learning: 'learning',
  personal: 'personal',
};
