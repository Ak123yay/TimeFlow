/**
 * Centralized Animation Constants for TimeFlow
 * Single source of truth for all animation timings, easing curves, and delays
 */

// =====================================================
// TIMING CONSTANTS (in seconds)
// =====================================================

// UI Interaction Timings
export const TIMINGS = {
  // Quick interactions (button clicks, hovers, immediate feedback)
  QUICK: 0.15,

  // Standard UI transitions (form focus, card appear)
  STANDARD: 0.25,

  // Page transitions and navigation
  PAGE_TRANSITION: 0.35,

  // Complex animations (task completion, scroll reveals)
  MEDIUM: 0.5,

  // Celebration and special effects
  CELEBRATION: 0.6,

  // Loading states and continuous animations
  SLOW: 1.0,

  // Multi-second animations (floating leaves, etc)
  VERY_SLOW: 2.0,

  // Reduced motion (accessibility)
  REDUCED_MOTION: 0.01,

  // Stagger increments for list items
  STAGGER_BASE: 0.05,
  STAGGER_MAX: 0.3,
};

// Device-specific timings
export const DEVICE_TIMINGS = {
  mobile: {
    cardEntrance: 0.35,
    buttonHover: 0.2,
    formFocus: 0.3,
    staggerDelay: 0.05,
  },
  tablet: {
    cardEntrance: 0.35,
    buttonHover: 0.22,
    formFocus: 0.32,
    staggerDelay: 0.06,
  },
  desktop: {
    cardEntrance: 0.35,
    buttonHover: 0.25,
    formFocus: 0.35,
    staggerDelay: 0.08,
  },
};

// =====================================================
// EASING CURVES (Timing Functions)
// =====================================================

export const EASING = {
  // Linear (no acceleration)
  linear: 'linear',

  // Standard easing
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Cubic variations
  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',

  // Quad variations
  easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
  easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',

  // iOS Spring Physics (overshoot on entrance)
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  iosSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  iosEase: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Page slide transitions (smooth acceleration/deceleration)
  pageSlide: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// =====================================================
// CSS VARIABLE MAPPINGS
// =====================================================

export const CSS_VARIABLES = {
  PAGE_SLIDE_DURATION: '0.35s',
  PAGE_SLIDE_EASING: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

  TASK_COMPLETION_DURATION: '0.5s',
  COMPLETION_SCALE: '1.08',

  BUTTON_RIPPLE_DURATION: '0.6s',
  INPUT_FOCUS_DURATION: '0.3s',

  SKELETON_PULSE_DURATION: '2s',
  LIST_STAGGER_BASE: '0.05s',

  SHADOW_ELEVATED_LIGHT: '0 10px 15px rgba(0, 0, 0, 0.1)',
  SHADOW_ELEVATED_DARK: '0 10px 40px rgba(0, 0, 0, 0.4)',

  SUCCESS_GLOW_LIGHT: 'rgba(82, 183, 136, 0.3)',
  SUCCESS_GLOW_DARK: 'rgba(82, 183, 136, 0.5)',
};

// =====================================================
// ANIMATION CLASS NAMES
// =====================================================

export const ANIMATION_CLASSES = {
  // Page transitions
  PAGE_ENTER: 'page-transition-enter',
  PAGE_EXIT: 'page-transition-exit',

  // Task animations
  TASK_CARD: 'list-item',
  TASK_FOCUSED: 'task-focused',
  TASK_COMPLETE_GLOW: 'task-complete-glow',
  TASK_COMPLETE_SCALE: 'task-complete-scale',

  // Mobile animations
  MOBILE_CARD: 'mobile-card',
  MOBILE_TOUCH_PRESS: 'mobile-touch-press',

  // Scroll animations
  SCROLL_REVEAL: 'scroll-reveal',
  SCROLL_REVEAL_ACTIVE: 'scroll-reveal-active',

  // Component animations
  SECTION_HEADER: 'section-header',
  BUTTON_RIPPLE: 'button-ripple',

  // Input animations
  INPUT_FOCUS_RING: 'input-focus-ring',
  INPUT_INVALID_SHAKE: 'input-invalid-shake',

  // Loading animations
  SKELETON_LOADING: 'skeleton-loading',
  SKELETON_SHIMMER: 'skeleton-shimmer',
};

// =====================================================
// INTERSECTION OBSERVER CONFIG
// =====================================================

export const INTERSECTION_OBSERVER_CONFIG = {
  DEFAULT: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  },
  EAGER: {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px',
  },
  LAZY: {
    threshold: 0.25,
    rootMargin: '0px 0px 0px 0px',
  },
};

// =====================================================
// STAGGER DELAY BOUNDARIES
// =====================================================

export const STAGGER_CONFIG = {
  BASE_DELAY: 0.05,  // 50ms per item
  MAX_DELAY: 0.3,    // Cap at 300ms
  MOBILE_DELAY: 0.05,
  DESKTOP_DELAY: 0.08,
  TABLET_DELAY: 0.06,
};

export default {
  TIMINGS,
  DEVICE_TIMINGS,
  EASING,
  CSS_VARIABLES,
  ANIMATION_CLASSES,
  INTERSECTION_OBSERVER_CONFIG,
  STAGGER_CONFIG,
};
