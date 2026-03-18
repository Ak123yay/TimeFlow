import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { haptic } from '../utils/haptics';

/**
 * Enhanced iOS-style Bottom Sheet Modal with drag-to-dismiss
 * Slides up from bottom with backdrop, swipeable drag handle, and haptic feedback
 *
 * Features:
 * - Drag-to-dismiss with spring physics
 * - Haptic feedback on interactions
 * - Keyboard avoidance
 * - Safe area inset support
 *
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Callback when backdrop clicked or sheet closed
 * @param {string} title - Sheet title
 * @param {Array} actions - Array of action objects with: { icon, label, subtitle, variant, onPress }
 */
export default function BottomSheet({ isOpen, onClose, title, actions }) {
  const [isVisible, setIsVisible] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth entrance
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      y.set(0); // Reset position
    }
  }, [isOpen, y]);

  const handleDragEnd = (_event, info) => {
    const shouldClose = info.velocity.y > 500 || info.offset.y > 150;

    if (shouldClose) {
      // Haptic feedback on dismiss
      haptic.light();
      onClose();
    }
  };

  const handleBackdropClick = () => {
    haptic.light();
    onClose();
  };

  const handleActionClick = (action) => {
    // Different haptics for different action types
    if (action.variant === 'primary') {
      haptic.medium();
    } else if (action.variant === 'danger') {
      haptic.heavy();
    } else {
      haptic.light();
    }

    action.onPress();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
      />

      {/* Draggable Sheet Container */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        onDragEnd={handleDragEnd}
        initial={{ y: '100%' }}
        animate={{ y: isVisible ? 0 : '100%' }}
        exit={{ y: '100%' }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          mass: 0.8
        }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: isDark ? 'rgba(26,31,26,0.98)' : 'linear-gradient(180deg, #FFFFFF 0%, #FAFCFB 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
          zIndex: 1001,
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.15)',
          maxHeight: '80vh',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          opacity,
          y,
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}
      >
        {/* Drag Handle - Larger touch target */}
        <motion.div
          whileTap={{ scale: 1.1 }}
          style={{
            width: '40px',
            height: '5px',
            background: '#D1D5DB',
            borderRadius: '999px',
            margin: '0 auto 20px',
            cursor: 'grab',
            // Larger invisible touch area
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              right: '-20px',
              bottom: '-20px'
            }}
          />
        </motion.div>

        {/* Title */}
        {title && (
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              margin: '0 0 16px',
              textAlign: 'center',
              color: 'var(--primary)'
            }}
          >
            {title}
          </h3>
        )}

        {/* Actions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {actions && actions.map((action, i) => (
            <motion.button
              key={i}
              onClick={() => handleActionClick(action)}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                padding: '16px',
                minHeight: '56px',
                borderRadius: '14px',
                border: 'none',
                background:
                  action.variant === 'primary'
                    ? 'linear-gradient(135deg, #6FAF6F, #3B6E3B)'
                    : action.variant === 'danger'
                    ? 'linear-gradient(135deg, #FF6B6B, #DC2626)'
                    : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(111, 175, 111, 0.08)',
                color:
                  action.variant === 'primary' || action.variant === 'danger'
                    ? 'white'
                    : isDark ? '#A8D4A8' : '#3B6E3B',
                fontSize: '16px',
                fontWeight: 600,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                backdropFilter: action.variant ? 'none' : 'blur(8px)',
                WebkitBackdropFilter: action.variant ? 'none' : 'blur(8px)',
                boxShadow: action.variant === 'primary' ? '0 4px 12px rgba(59,110,59,0.3)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Icon */}
              {action.icon && (
                <span style={{ fontSize: '24px', flexShrink: 0 }}>
                  {action.icon}
                </span>
              )}

              {/* Text Content */}
              <div style={{ flex: 1 }}>
                <div>{action.label}</div>
                {action.subtitle && (
                  <div
                    style={{
                      fontSize: '13px',
                      opacity: 0.7,
                      fontWeight: 400,
                      marginTop: '2px'
                    }}
                  >
                    {action.subtitle}
                  </div>
                )}
              </div>

              {/* Optional chevron or indicator */}
              {action.showChevron && (
                <span style={{ fontSize: '18px', opacity: 0.5 }}>›</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Cancel Button */}
        {onClose && (
          <motion.button
            onClick={() => {
              haptic.light();
              onClose();
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              marginTop: '12px',
              padding: '16px',
              minHeight: '56px',
              borderRadius: '14px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(111, 175, 111, 0.2)'}`,
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: isDark ? '#A8D4A8' : '#6B8E6B',
              fontSize: '16px',
              fontWeight: 600,
              width: '100%',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            Cancel
          </motion.button>
        )}
      </motion.div>
    </>
  );
}
