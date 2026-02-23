import React, { useMemo } from 'react';
import SwipeableTask from '../SwipeableTask';

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
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

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
        background: isActive ? '#3B6E3B' : (isDark ? '#242B24' : '#fff'),
        boxShadow: isActive
          ? '0 4px 12px rgba(59,110,59,0.15), 0 12px 32px rgba(59,110,59,0.2)'
          : task.conflicts ? '0 1px 4px rgba(220,38,38,0.08), 0 4px 12px rgba(220,38,38,0.1)' : (isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'),
        transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        color: isActive ? '#fff' : (isDark ? '#E8F0E8' : '#1A1A1A'),
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
              ? '2px solid rgba(255,255,255,0.5)'
              : '2px solid #D1D5DB',
          background: task.completed
            ? isActive ? 'rgba(255,255,255,0.3)' : '#3B6E3B'
            : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '12px',
          fontWeight: 700,
          color: task.completed
            ? '#fff'
            : isActive ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          transition: 'all 0.15s ease',
          userSelect: 'none'
        }}
      >
        {task.completed ? '✓' : (task.position || '')}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {isUpNext && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '9px',
            fontWeight: 700,
            color: '#3B6E3B',
            background: 'rgba(59,110,59,0.1)',
            padding: '2px 7px',
            borderRadius: '99px',
            marginBottom: '4px',
            letterSpacing: '0.4px',
            textTransform: 'uppercase'
          }}>
            ▶ Up Next
          </div>
        )}
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 1.3,
          color: isActive ? '#fff' : task.completed ? (isDark ? '#6B7B6B' : '#9CA3AF') : (isDark ? '#E8F0E8' : '#1A1A1A'),
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
          color: isActive ? 'rgba(255,255,255,0.7)' : (isDark ? '#9CA59C' : '#8E8E93'),
          flexWrap: 'wrap'
        }}>
          <span>{task.duration}m</span>
          {task.startTime && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{task.startTime}</span>
            </>
          )}
          {task.carriedOver && task.originalDate && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: isActive ? 'rgba(255,255,255,0.7)' : '#D97706' }}>
                from {new Date(task.originalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </>
          )}
          {task.rescheduleAttempts > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: isActive ? 'rgba(255,255,255,0.7)' : '#D97706' }}>
                🔁{task.rescheduleAttempts}x
              </span>
            </>
          )}
          {deadlineInfo && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{
                color: isActive ? 'rgba(255,255,255,0.8)' : deadlineInfo.color,
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

      {/* Start Button */}
      {!task.completed && !isActive && onStart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(task);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            background: '#3B6E3B',
            color: '#fff',
            border: 'none',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            touchAction: 'manipulation',
            whiteSpace: 'nowrap',
            minHeight: '32px',
            flexShrink: 0
          }}
        >
          Start
        </button>
      )}

      {/* Active indicator */}
      {isActive && (
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#6FAF6F',
          boxShadow: '0 0 8px rgba(111,175,111,0.6)',
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
