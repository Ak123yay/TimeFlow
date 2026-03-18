import { motion } from 'framer-motion';
import { LeafDriftIcon } from '../../../icons';

/**
 * LeafSwipe - Flying leaf particle animation
 *
 * Features:
 * - 8 leaf particles that fly off screen
 * - Organic rotation and movement
 * - Staggered timing for natural feel
 * - Used on task completion and deletion
 *
 * @param {string} origin - Starting side: 'left', 'right', or 'center'
 * @param {number} count - Number of leaves (default: 8, max 16 for celebration)
 * @param {function} onComplete - Callback when animation finishes
 */
export default function LeafSwipe({ origin = 'center', count = 8, onComplete }) {
  const leaves = Array(count).fill(null);

  const getInitialPosition = () => {
    switch (origin) {
      case 'left':
        return { x: -50, y: 0 };
      case 'right':
        return { x: 50, y: 0 };
      default: // center
        return { x: 0, y: 0 };
    }
  };

  const getTargetX = (index) => {
    const baseDistance = origin === 'left' ? 200 : origin === 'right' ? -200 : 0;
    const spread = (Math.random() - 0.5) * 100; // Random spread
    return baseDistance + spread;
  };

  const initial = getInitialPosition();

  return (
    <div
      className="leaf-swipe-container"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {leaves.map((_, i) => (
        <motion.div
          key={i}
          className="leaf-particle"
          initial={{
            x: initial.x,
            y: initial.y,
            rotate: 0,
            opacity: 1,
            scale: 0.8
          }}
          animate={{
            x: getTargetX(i),
            y: [0, -40 - Math.random() * 30, -20, 10, 30 + Math.random() * 20],
            rotate: [0, 180, 360, 540, 720],
            opacity: [1, 1, 0.9, 0.5, 0],
            scale: [0.8, 1.2, 1, 0.9, 0.7]
          }}
          transition={{
            duration: 1.4,
            delay: i * 0.08,
            ease: [0.4, 0, 0.2, 1]
          }}
          onAnimationComplete={() => {
            if (i === leaves.length - 1 && onComplete) {
              onComplete();
            }
          }}
          style={{
            position: 'absolute',
            fontSize: '20px',
            willChange: 'transform, opacity'
          }}
        >
          <LeafDriftIcon size={20} />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * LeafSwipeLeft - Preset for left swipe actions
 */
export function LeafSwipeLeft({ onComplete }) {
  return <LeafSwipe origin="left" count={6} onComplete={onComplete} />;
}

/**
 * LeafSwipeRight - Preset for right swipe actions
 */
export function LeafSwipeRight({ onComplete }) {
  return <LeafSwipe origin="right" count={6} onComplete={onComplete} />;
}

/**
 * LeafCelebration - Enhanced animation for all tasks complete
 */
export function LeafCelebration({ onComplete }) {
  return <LeafSwipe origin="center" count={16} onComplete={onComplete} />;
}
