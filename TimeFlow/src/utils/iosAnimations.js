/**
 * iOS Animation Utilities - Spring animations, gestures, and transitions
 * Based on Apple's design system with smooth, natural motion
 */

// iOS-style spring animation configurations
export const iosSpringAnimations = {
  // Subtle spring for quick interactions
  subtle: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 1,
  },

  // Standard spring for most UI elements
  standard: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    mass: 1,
  },

  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring',
    stiffness: 200,
    damping: 15,
    mass: 1,
  },

  // Smooth easing for transitions
  smooth: {
    type: 'tween',
    duration: 0.3,
    ease: 'easeInOut',
  },
};

// iOS-style transition durations
export const iosDurations = {
  instant: 0.1,
  quick: 0.2,
  standard: 0.3,
  slow: 0.5,
};

// iOS gesture thresholds
export const iosGestures = {
  swipeThreshold: 50,
  dragThreshold: 5,
  tapDuration: 300,
  longPressDuration: 500,
};

// iOS-style scale effects for interactions
export const iosScales = {
  press: 0.95,
  hover: 1.02,
  active: 0.93,
};

// iOS opacity transitions
export const iosOpacity = {
  disabled: 0.5,
  dimmed: 0.6,
  normal: 1,
  highlighted: 0.7,
};

// Common iOS transitions
export const iosTransitions = {
  // Sheet slide up animation
  sheetSlideUp: {
    initial: { y: 500, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 500, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  },

  // Modal fade in with scale
  modalFadeScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },

  // Smooth fade transition
  fadeSmoothly: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  // Slide in from right
  slideInRight: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },

  // Slide in from left
  slideInLeft: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

// Gesture handler utilities
export const createGestureHandlers = (callbacks) => {
  return {
    whileHover: {
      scale: iosScales.hover,
      transition: iosSpringAnimations.subtle,
    },
    whileTap: {
      scale: iosScales.press,
      transition: iosSpringAnimations.subtle,
    },
    initial: false,
    onHoverStart: callbacks?.onHoverStart,
    onHoverEnd: callbacks?.onHoverEnd,
    onTap: callbacks?.onTap,
  };
};
