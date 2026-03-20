/**
 * ANIMATION INTEGRATION GUIDE FOR TIMEFLOW COMPONENTS
 *
 * This file documents how to integrate the animation system into TimeFlow components
 * for consistent, performant animations across all views and interactions.
 */

// ============================================
// TASK CARD ANIMATIONS
// Apply stagger entrance to task lists
// ============================================

import { useStaggerAnimation } from '../utils/useAnimations';
import { getStaggerDelay } from '../utils/animationUtils';

// In TaskList.jsx or Today.jsx:
// <div ref={containerRef} className="task-list">
//   {tasks.map((task, index) => (
//     <div
//       key={task.id}
//       data-stagger-item
//       style={{ '--stagger-delay': `${getStaggerDelay(index)}s` }}
//       className="list-item"
//     >
//       <TaskCard task={task} />
//     </div>
//   ))}
// </div>

// ============================================
// SCROLL ANIMATIONS
// Reveal elements as they scroll into view
// ============================================

import { useScrollReveal } from '../utils/useAnimations';

// In any component that needs scroll reveal:
// const ref = useScrollReveal({ threshold: 0.2 });
// return <section ref={ref} className="scroll-reveal">Content</section>

// Add to CSS: .scroll-reveal { animation: scrollReveal 0.5s ease-out forwards; }

// ============================================
// PAGE TRANSITIONS
// Smooth navigation between TimeFlow views
// ============================================

// In App.jsx or MobileLayout.jsx:
// Wrap page content with transition class:
// <div className="page-transition-enter">
//   {/* Page content */}
// </div>

// When navigating away:
// element.classList.add('page-transition-exit');

// ============================================
// TASK COMPLETION CELEBRATION
// Visual feedback when completing tasks
// ============================================

import { useTaskCompletionAnimation } from '../utils/useAnimations';

// In TaskCard.jsx when marking task complete:
// const { elementRef, triggerCelebration } = useTaskCompletionAnimation();
//
// const handleComplete = () => {
//   completeTask(taskId);
//   triggerCelebration(); // Animate!
// };
//
// return <div ref={elementRef} className="task-card">{/* ... */}</div>

// ============================================
// FORM FOCUS ANIMATIONS
// Enhanced input focus feedback
// ============================================

// CSS already includes inputFocusRing and inputInvalidShake
// Just ensure inputs have these classes applied:
// <input className="form-input" />
// Style in CSS: input:focus { animation: inputFocusRing 0.3s ease-out; }

// ============================================
// BUTTON HOVER/PRESS ANIMATIONS
// Refined micro-interactions
// ============================================

// SwiftUI buttons are pre-configured with:
// - swiftuiButtonHover (0.2s on hover)
// - swiftuiButtonPress (0.2s on press)
//
// Just apply class: <button className="swiftui-button primary">Click me</button>

// ============================================
// LOADING STATE ANIMATIONS
// Professional loading feedback
// ============================================

// Use skeleton loaders during data loading:
// <div className="skeleton-loading">Loading...</div>
// OR with shimmer effect:
// <div className="skeleton-shimmer">Loading...</div>

// ============================================
// COMPONENT ANIMATION TEMPLATES
// Copy-paste ready for common patterns
// ============================================

/**
 * Template 1: Animated Task List Component
 */
export const AnimatedTaskList = ({ tasks }) => {
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          data-stagger-item
          style={{ '--stagger-delay': `${getStaggerDelay(index)}s` }}
          className="list-item"
        >
          {/* Task card here */}
        </div>
      ))}
    </div>
  );
};

/**
 * Template 2: Scroll-Reveal Section
 */
export const ScrollRevealSection = ({ children, className = '' }) => {
  const ref = useScrollReveal({ threshold: 0.1 });
  return (
    <section ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </section>
  );
};

/**
 * Template 3: Page Transition Wrapper
 */
export const PageTransition = ({ children, className = '' }) => {
  const { ref } = usePageTransition();
  return (
    <div ref={ref} className={`page-transition-enter ${className}`}>
      {children}
    </div>
  );
};

/**
 * Template 4: Animated Button
 */
export const AnimatedButton = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`swiftui-button primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================
// ANIMATION BEST PRACTICES
// ============================================

/**
 * DO:
 * ✓ Use CSS animations (hardware accelerated)
 * ✓ Keep animations under 500ms for UI feedback
 * ✓ Use CSS variables for easy tweaking
 * ✓ Respect @media (prefers-reduced-motion)
 * ✓ Test animations on real mobile devices
 * ✓ Use easing curves consistently
 * ✓ Group related animations logically
 * ✓ Measure animation performance
 */

/**
 * DON'T:
 * ✗ Animate position or size (use transform instead)
 * ✗ Add animations to every interaction (restraint is key)
 * ✗ Use long animation durations (>600ms)
 * ✗ Animate opacity excessively
 * ✗ Ignore reduced motion preferences
 * ✗ Use setTimeout for timing (use CSS)
 * ✗ Create janky animations (always profile)
 * ✗ Hardcode animation values
 */

// ============================================
// ANIMATION PERFORMANCE TIPS
// ============================================

/**
 * 1. Use transform and opacity (GPU accelerated):
 *    ✓ transform: translateX(), scale(), rotate()
 *    ✓ opacity
 *    ✗ position, width, height, margin, padding
 */

/**
 * 2. Use requestAnimationFrame for JS animations:
 *    Syncs with browser refresh rate (60fps)
 */

/**
 * 3. Reduce paint operations:
 *    - Batch DOM changes
 *    - Use CSS classes instead of inline styles
 *    - Avoid layout thrashing
 */

/**
 * 4. Profile in Chrome DevTools:
 *    - Performance tab → Record → Run animation
 *    - Look for dropped frames or long tasks
 *    - Target 60fps (frame budget: 16.67ms)
 */

// ============================================
// ANIMATION TESTING CHECKLIST
// ============================================

/**
 * Before committing animations, verify:
 * [ ] Animation works in light mode
 * [ ] Animation works in dark mode
 * [ ] Animation respects prefers-reduced-motion
 * [ ] Animation maintains 60fps on mobile (iPhone SE, Android mid-range)
 * [ ] Animation looks smooth at various zoom levels
 * [ ] No jank or stuttering observed
 * [ ] Animation duration feels natural (not too slow/fast)
 * [ ] No console errors or warnings
 * [ ] Haptic feedback triggers alongside animation (if applicable)
 * [ ] Touch feedback feels responsive
 * [ ] Desktop hover states work correctly
 * [ ] Mobile touch states work correctly
 * [ ] Cross-browser compatible (if needed)
 */

// ============================================
// ANIMATION TIMING CONSTANTS
// ============================================

export const ANIMATION_TIMING = {
  // Fast interactions (button clicks, hovers)
  QUICK: 0.15,
  // Standard UI transitions
  STANDARD: 0.25,
  // Page transitions
  MODERATE: 0.35,
  // Complex animations
  MEDIUM: 0.5,
  // Loading states, streaming
  SLOW: 1.0,
  // Multi-second animations (rare)
  VERY_SLOW: 2.0
};

// ============================================
// ANIMATION EASING CURVES
// ============================================

export const EASING_CURVES = {
  // Linear progression
  linear: 'linear',

  // Quick start, slow end
  easeIn: 'ease-in',
  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',

  // Slow start, quick end
  easeOut: 'ease-out',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',

  // Slow start and end, fast middle
  easeInOut: 'ease-in-out',

  // iOS spring physics
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // iOS standard easing
  iosEase: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Page slide transitions
  pageSlide: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};

// ============================================
// ANIMATION ACCESSIBILITY
// ============================================

/**
 * Always respect user motion preferences:
 * 1. Detect @media (prefers-reduced-motion: reduce)
 * 2. Either disable animations or make instant
 * 3. Ensure content is still accessible
 * 4. Test with accessibility tools
 */

/*
Example in CSS:
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
*/

// ============================================
// FURTHER READING
// ============================================

/**
 * - MDN: Web Animations API
 * - Chrome DevTools: Performance profiling
 * - Framer Motion: Advanced animation library
 * - Web.dev: Animation performance guide
 * - WCAG 2.1: Animation and motion guidelines
 */

export default {
  AnimatedTaskList,
  ScrollRevealSection,
  PageTransition,
  AnimatedButton,
  ANIMATION_TIMING,
  EASING_CURVES
};
