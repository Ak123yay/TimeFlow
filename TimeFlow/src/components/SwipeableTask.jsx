import { useState, useRef } from 'react';
import { haptic } from '../utils/haptics';

/**
 * SwipeableTask - iOS-style swipe-to-reveal actions
 * Swipe left to reveal Complete (✓) and Delete (

🗑️) buttons
 *
 * @param {Object} task - Task object
 * @param {Function} onComplete - Complete task handler
 * @param {Function} onDelete - Delete task handler
 * @param {ReactNode} children - Task card content
 */
export default function SwipeableTask({ task, onComplete, onDelete, children }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [actionsRevealed, setActionsRevealed] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isVerticalScroll = useRef(false);
  const hasTriggeredHaptic = useRef(false);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setIsSwiping(true);
    isVerticalScroll.current = false;
    hasTriggeredHaptic.current = false; // Reset haptic trigger
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;

    const diffX = e.touches[0].clientX - startX.current;
    const diffY = e.touches[0].clientY - startY.current;

    // Detect if this is vertical scroll vs horizontal swipe
    if (!isVerticalScroll.current && Math.abs(diffY) > Math.abs(diffX)) {
      isVerticalScroll.current = true;
      setSwipeOffset(0);
      return;
    }

    // Ignore vertical scrolls
    if (isVerticalScroll.current) return;

    // Left swipe only (diffX < 0), max -150px
    if (diffX < 0 && diffX > -150) {
      setSwipeOffset(diffX);
      e.preventDefault();  // Prevent scroll during horizontal swipe

      // Trigger haptic feedback at -80px threshold (once)
      if (diffX < -80 && !hasTriggeredHaptic.current) {
        haptic.selection();
        hasTriggeredHaptic.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    if (isVerticalScroll.current) {
      setIsSwiping(false);
      return;
    }

    // If swipe > 80px, snap to reveal actions
    if (swipeOffset < -80) {
      setSwipeOffset(-150);  // Snap to full reveal
      setActionsRevealed(true);
    } else {
      setSwipeOffset(0);  // Reset
      setActionsRevealed(false);
    }
    setIsSwiping(false);
  };

  const handleAction = (actionFn, actionType = 'default') => {
    // Trigger appropriate haptic feedback
    if (actionType === 'complete') {
      haptic.success();
    } else if (actionType === 'delete') {
      haptic.heavy();
    } else {
      haptic.light();
    }

    // Reset swipe first, then trigger action
    setSwipeOffset(0);
    setActionsRevealed(false);
    setTimeout(() => actionFn(), 200);  // Small delay for animation
  };

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      marginBottom: '12px'
    }}>
      {/* Action buttons revealed on swipe */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        gap: '2px',
        transform: actionsRevealed ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Complete button */}
        <button
          onClick={() => handleAction(onComplete, 'complete')}
          style={{
            width: '75px',
            background: 'var(--success)',
            color: 'white',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 600,
            cursor: 'pointer',
            gap: '4px',
            padding: '16px 8px'
          }}
        >
          <span>✓</span>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px' }}>
            Done
          </span>
        </button>

        {/* Delete button */}
        <button
          onClick={() => handleAction(onDelete, 'delete')}
          style={{
            width: '75px',
            background: 'var(--danger)',
            color: 'white',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            fontWeight: 600,
            cursor: 'pointer',
            gap: '4px',
            padding: '16px 8px'
          }}
        >
          <span>🗑️</span>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px' }}>
            Delete
          </span>
        </button>
      </div>

      {/* Task content - swipes to reveal actions */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 1,
          background: 'inherit'
        }}
      >
        {children}
      </div>
    </div>
  );
}
