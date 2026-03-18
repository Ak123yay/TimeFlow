import { useMemo } from 'react';
import { useDarkMode } from '../../utils/useDarkMode';
import SwipeableTask from '../SwipeableTask';
import {
  CheckmarkIcon,
  RepeatIcon,
  PlayIcon,
} from '../../icons';

/**
 * TaskCard - Clean minimal task card with full feature support
 * Shows: name, duration, time, deadline, conflicts, reschedule count
 */
export default function TaskCard({
  task,
  isActive = false,
  isUpNext = false,
  onStart,
  onComplete,
  onDelete,
  onEdit,
  showSwipeActions = true
}) {
  // Detect system color scheme
  const isDark = useDarkMode();

  // OPTIMIZED: Memoize deadline calculation - only recalculates when deadline changes
  const deadlineInfo = useMemo(() => {
    if (!task.deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(task.deadline + 'T00:00:00');
    const diffDays = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: '#DC2626' };
    if (diffDays === 0) return { text: 'Due today', color: '#D97706' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: '#D97706' };
    if (diffDays <= 3) return { text: `${diffDays}d left`, color: '#D97706' };
    return { text: `${diffDays}d left`, color: '#8E8E93' };
  }, [task.deadline]);

  const content = (
    <div
      onClick={() => onEdit && onEdit(task)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px 18px',
        minHeight: '60px',
        borderRadius: '18px',
        background: isActive
          ? (isDark ? 'rgba(59,110,59,0.15)' : 'rgba(59,110,59,0.07)')
          : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'),
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: isActive
          ? '2px solid #3B6E3B'
          : task.conflicts
            ? '1.5px solid rgba(220,38,38,0.3)'
            : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} `,
        boxShadow: isActive
          ? '0 2px 12px rgba(59,110,59,0.12)'
          : task.conflicts
            ? '0 1px 4px rgba(220,38,38,0.08)'
            : (isDark ? '0 1px 3px rgba(0,0,0,0.12)' : '0 1px 6px rgba(0,0,0,0.04)'),
        transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        color: isActive ? (isDark ? '#A8D4A8' : '#2E5E2E') : (isDark ? '#E8F0E8' : '#1A1A1A'),
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        opacity: task.completed ? 0.45 : 1
      }}
    >
      {/* Checkbox / Position Circle */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onComplete) onComplete();
        }}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: task.completed
            ? 'none'
            : isActive
              ? '2px solid #3B6E3B'
              : '2px solid #D1D5DB',
          background: task.completed
            ? '#3B6E3B'
            : isActive ? 'rgba(59,110,59,0.1)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '12px',
          fontWeight: 700,
          color: task.completed
            ? '#fff'
            : isActive ? '#3B6E3B' : '#9CA3AF',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          transition: 'all 0.15s ease',
          userSelect: 'none'
        }}
      >
        {task.completed ? <CheckmarkIcon size={14} /> : (task.position || '')}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 1.3,
          color: isActive
            ? (isDark ? '#A8D4A8' : '#1E3E1E')
            : task.completed
              ? (isDark ? '#6B7B6B' : '#9CA3AF')
              : (isDark ? '#E8F0E8' : '#1A1A1A'),
          textDecoration: task.completed ? 'line-through' : 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {task.name}
        </div>

        {/* Meta row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          marginTop: '2px',
          fontSize: '11px',
          color: isActive ? (isDark ? 'rgba(168,212,168,0.8)' : '#5A8A5A') : (isDark ? '#9CA59C' : '#8E8E93'),
          flexWrap: 'wrap'
        }}>
          <span>{task.duration}m</span>
          {isUpNext && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{
                fontSize: '9px',
                fontWeight: 700,
                color: isActive ? (isDark ? '#A8D4A8' : '#3B6E3B') : '#3B6E3B',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                <PlayIcon size={9} style={{ display: 'inline', marginRight: '2px', verticalAlign: 'middle' }} /> up next
              </span>
            </>
          )}
          {task.startTime && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{task.startTime}</span>
            </>
          )}
          {task.carriedOver && task.originalDate && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: isActive ? (isDark ? 'rgba(168,212,168,0.8)' : '#5A8A5A') : '#D97706' }}>
                from {new Date(task.originalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </>
          )}
          {task.rescheduleAttempts > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: isActive ? (isDark ? 'rgba(168,212,168,0.8)' : '#5A8A5A') : '#D97706' }}>
                <RepeatIcon size={12} style={{ display: 'inline', marginRight: '2px', verticalAlign: 'middle' }} />{task.rescheduleAttempts}x
              </span>
            </>
          )}
          {deadlineInfo && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{
                color: isActive ? (isDark ? 'rgba(168,212,168,0.8)' : '#5A8A5A') : deadlineInfo.color,
                fontWeight: deadlineInfo.color === '#DC2626' ? 700 : 500
              }}>
                {deadlineInfo.text}
              </span>
            </>
          )}
          {task.conflicts && !isActive && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: '#DC2626', fontWeight: 600 }}>overlap</span>
            </>
          )}
        </div>
      </div>

      {/* Start Button - iOS style circular */}
      {!task.completed && !isActive && onStart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(task);
          }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6FAF6F, #3B6E3B)',
            color: '#fff',
            border: 'none',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'manipulation',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(59,110,59,0.3)',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            fontWeight: 600
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 6px 16px rgba(59,110,59,0.4)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(59,110,59,0.3)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ▶
        </button>
      )}

      {/* Active pulse dot */}
      {isActive && (
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#3B6E3B',
          boxShadow: '0 0 6px rgba(59,110,59,0.5)',
          flexShrink: 0,
          animation: 'pulse 2s ease-in-out infinite'
        }} />
      )}
    </div>
  );

  if (showSwipeActions && !isActive && !task.completed) {
    return (
      <SwipeableTask task={task} onComplete={onComplete} onDelete={onDelete}>
        {content}
      </SwipeableTask>
    );
  }

  return content;
}
