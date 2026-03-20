/**
 * React Hook for Scroll-Triggered Animations
 * Applies animations to elements as they enter the viewport
 * Highly efficient with Intersection Observer API
 */

import { useEffect, useRef, useCallback } from 'react';
import { INTERSECTION_OBSERVER_CONFIG, STAGGER_CONFIG, TIMINGS, ANIMATION_CLASSES } from './animationConstants';

/**
 * Hook to add scroll-reveal animations to an element
 * Usage: const ref = useScrollReveal(); return <div ref={ref}>Content</div>
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const config = INTERSECTION_OBSERVER_CONFIG.DEFAULT;
  const { threshold = config.threshold, rootMargin = config.rootMargin, delay = 0 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay if specified
            if (delay > 0) {
              setTimeout(() => {
                entry.target.classList.add(ANIMATION_CLASSES.SCROLL_REVEAL_ACTIVE);
              }, delay);
            } else {
              entry.target.classList.add(ANIMATION_CLASSES.SCROLL_REVEAL_ACTIVE);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay]);

  return ref;
};

/**
 * Hook for staggered list animations
 * Animates list items in sequence as they become visible
 */
export const useStaggerAnimation = (itemCount = 0, baseDelay = STAGGER_CONFIG.BASE_DELAY) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;

    items.forEach((item, index) => {
      const delay = Math.min(index * baseDelay, STAGGER_CONFIG.MAX_DELAY);
      item.style.setProperty('--stagger-delay', `${delay}s`);
      item.classList.add(ANIMATION_CLASSES.TASK_CARD);
    });
  }, [itemCount, baseDelay]);

  return containerRef;
};

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if @media (prefers-reduced-motion: reduce) matches
 */
export const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced.current;
};

/**
 * Hook for task completion celebration animation
 * Triggers visual feedback when a task is completed
 */
export const useTaskCompletionAnimation = () => {
  const elementRef = useRef(null);

  const triggerCelebration = useCallback(() => {
    if (!elementRef.current) return;

    // Add glow effect
    elementRef.current.classList.add(ANIMATION_CLASSES.TASK_COMPLETE_GLOW);

    // Add scale animation
    elementRef.current.classList.add(ANIMATION_CLASSES.TASK_COMPLETE_SCALE);

    // Remove classes after animation completes
    const timer = setTimeout(() => {
      elementRef.current?.classList.remove(ANIMATION_CLASSES.TASK_COMPLETE_GLOW, ANIMATION_CLASSES.TASK_COMPLETE_SCALE);
    }, TIMINGS.CELEBRATION * 1000);

    return () => clearTimeout(timer);
  }, []);

  return { elementRef, triggerCelebration };
};

/**
 * Hook for page transition animations
 * Manages enter/exit animations when navigating between pages
 */
export const usePageTransition = () => {
  const ref = useRef(null);
  const isEntering = useRef(true);

  const startExit = useCallback(() => {
    if (ref.current) {
      ref.current.classList.remove(ANIMATION_CLASSES.PAGE_ENTER);
      ref.current.classList.add(ANIMATION_CLASSES.PAGE_EXIT);
      isEntering.current = false;
    }
  }, []);

  const startEnter = useCallback(() => {
    if (ref.current) {
      ref.current.classList.remove(ANIMATION_CLASSES.PAGE_EXIT);
      ref.current.classList.add(ANIMATION_CLASSES.PAGE_ENTER);
      isEntering.current = true;
    }
  }, []);

  useEffect(() => {
    startEnter();
  }, [startEnter]);

  return { ref, startExit, startEnter };
};

/**
 * Hook to throttle animation-heavy events
 * Prevents jank from rapid scroll/resize events
 */
export const useAnimationThrottle = (callback, delay = 100) => {
  const timeoutRef = useRef(null);
  const lastCallRef = useRef(Date.now());

  const throttled = useCallback((...args) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;

    if (timeSinceLastCall >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - timeSinceLastCall);
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return throttled;
};

export default {
  useScrollReveal,
  useStaggerAnimation,
  usePrefersReducedMotion,
  useTaskCompletionAnimation,
  usePageTransition,
  useAnimationThrottle
};
