/**
 * Animation Utilities for TimeFlow
 * Provides reusable animation hooks and utilities for consistent, performant animations
 */

import { TIMINGS, STAGGER_CONFIG, DEVICE_TIMINGS, EASING, CSS_VARIABLES } from './animationConstants';

/**
 * Get stagger delay for list items (0.05s base, increasing by item index)
 * Creates cascading entrance effect for lists
 */
export const getStaggerDelay = (index, baseDelay = STAGGER_CONFIG.BASE_DELAY) => {
  return Math.min(index * baseDelay, STAGGER_CONFIG.MAX_DELAY);
};

/**
 * Get animation class based on component type
 * Centralizes animation class assignment for consistency
 */
export const getAnimationClass = (type, index = 0) => {
  const baseClasses = {
    'page-enter': 'page-transition-enter',
    'page-exit': 'page-transition-exit',
    'task-card': 'list-item',
    'mobile-card': 'mobile-card',
    'scroll-reveal': 'scroll-reveal',
    'section-header': 'section-header',
    'form-focus': 'swiftui-button'
  };

  return baseClasses[type] || '';
};

/**
 * Calculate animation timing based on device capabilities
 * Returns appropriate duration/delay for smooth 60fps performance
 */
export const getAnimationTiming = (deviceType = 'mobile') => {
  return DEVICE_TIMINGS[deviceType] || DEVICE_TIMINGS.mobile;
};

/**
 * Detect if user prefers reduced motion
 * Respect accessibility preferences by disabling complex animations
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration with accessibility consideration
 * Returns 0 if user prefers reduced motion, otherwise returns specified duration
 */
export const getAccessibleDuration = (duration) => {
  return prefersReducedMotion() ? 0 : duration;
};

/**
 * Generate inline style object for staggered animations
 * Useful for dynamically applying animations to list items
 */
export const getStaggerStyle = (index, baseDelay = 0.05) => {
  const delay = getStaggerDelay(index, baseDelay);
  return {
    animation: prefersReducedMotion() ? 'none' : `listItemStagger 0.3s ease-out both`,
    '--delay': `${delay}s`,
    animationDelay: `${delay}s`
  };
};

/**
 * Create CSS variable declarations for animation control
 * Allows tweaking animations via CSS without code changes
 */
export const getAnimationVars = (isDark = false) => {
  return {
    '--page-slide-duration': CSS_VARIABLES.PAGE_SLIDE_DURATION,
    '--page-slide-easing': CSS_VARIABLES.PAGE_SLIDE_EASING,
    '--task-completion-duration': CSS_VARIABLES.TASK_COMPLETION_DURATION,
    '--completion-scale': CSS_VARIABLES.COMPLETION_SCALE,
    '--button-ripple-duration': CSS_VARIABLES.BUTTON_RIPPLE_DURATION,
    '--input-focus-duration': CSS_VARIABLES.INPUT_FOCUS_DURATION,
    '--skeleton-pulse-duration': CSS_VARIABLES.SKELETON_PULSE_DURATION,
    '--list-stagger-base': CSS_VARIABLES.LIST_STAGGER_BASE,
    '--shadow-elevated': isDark
      ? CSS_VARIABLES.SHADOW_ELEVATED_DARK
      : CSS_VARIABLES.SHADOW_ELEVATED_LIGHT,
    '--success-glow-color': isDark
      ? CSS_VARIABLES.SUCCESS_GLOW_DARK
      : CSS_VARIABLES.SUCCESS_GLOW_LIGHT
  };
};

/**
 * Trigger haptic feedback alongside visual animation
 * Enhances perceived quality of interactions
 */
export const animateWithHaptic = (element, animationClass, hapticPattern = 'light') => {
  if (!element) return;

  // Apply animation
  element.classList.add(animationClass);

  // Trigger haptic if available
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [20, 10, 20],
      error: [30, 10, 30, 10, 30]
    };

    try {
      navigator.vibrate(patterns[hapticPattern] || patterns.light);
    } catch (e) {
      // Haptics not supported or blocked
    }
  }

  // Remove animation class after completion to allow re-triggering
  const animationDuration = getComputedStyle(element).animationDuration;
  const duration = parseFloat(animationDuration) * 1000;

  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
};

/**
 * Observe elements for scroll-triggered animations
 * Uses Intersection Observer for performant scroll animations
 */
export const setupScrollAnimations = (selector = '.scroll-reveal', callback = null) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal-active');
          if (callback) callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  return observer;
};

/**
 * Debounce animation-heavy callbacks to prevent jank
 * Useful for resize, scroll, input events
 */
export const debounceAnimation = (callback, delay = 100) => {
  let timeoutId;
  let animationFrameId;

  return function (...args) {
    clearTimeout(timeoutId);
    cancelAnimationFrame(animationFrameId);

    timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(() => {
        callback(...args);
      });
    }, delay);
  };
};

/**
 * Measure animation performance and log metrics
 * Debug animation jank and performance issues
 */
export const measureAnimationPerformance = (animationName, callback) => {
  const startTime = performance.now();
  const startMarks = performance.getEntriesByType('mark');

  performance.mark(`${animationName}-start`);

  callback();

  performance.mark(`${animationName}-end`);
  performance.measure(animationName, `${animationName}-start`, `${animationName}-end`);

  const duration = performance.now() - startTime;
  const measure = performance.getEntriesByName(animationName)[0];

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Animation] ${animationName}:`, {
      duration: `${duration.toFixed(2)}ms`,
      measureDuration: `${measure?.duration.toFixed(2)}ms`,
      fps: `${(1000 / duration).toFixed(1)} FPS`,
      performance: duration < 16.67 ? '✓ 60fps' : '⚠️ Below 60fps'
    });
  }

  return {
    duration,
    fps: 1000 / duration,
    is60fps: duration < 16.67
  };
};

/**
 * Batch multiple animations for better performance
 * Groups animation requests into single RAF
 */
export class AnimationBatcher {
  constructor() {
    this.animations = [];
    this.rafId = null;
  }

  add(callback) {
    this.animations.push(callback);
    this.schedule();
  }

  schedule() {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      this.animations.forEach((cb) => cb());
      this.animations = [];
      this.rafId = null;
    });
  }

  cancel() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.animations = [];
  }
}

/**
 * Create smooth scroll animation
 * Progressive enhancement for scroll-to-element
 */
export const smoothScrollTo = (element, options = {}) => {
  const {
    duration = 300,
    offset = 0,
    behavior = 'smooth'
  } = options;

  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;

  if ('scrollTo' in window) {
    window.scrollTo({
      top: targetPosition,
      behavior
    });
  } else {
    // Fallback for older browsers
    window.scrollY = targetPosition;
  }
};

/**
 * Configuration for animation timing curves
 * Centralized easing functions for consistency
 * Re-exported from animationConstants for backward compatibility
 */
export const ANIMATION_CURVES = EASING;

export default {
  getStaggerDelay,
  getAnimationClass,
  getAnimationTiming,
  prefersReducedMotion,
  getAccessibleDuration,
  getStaggerStyle,
  getAnimationVars,
  animateWithHaptic,
  setupScrollAnimations,
  debounceAnimation,
  measureAnimationPerformance,
  AnimationBatcher,
  smoothScrollTo,
  ANIMATION_CURVES
};
