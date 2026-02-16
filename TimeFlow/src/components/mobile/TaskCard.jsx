import React from 'react';
import SwipeableTask from '../SwipeableTask';

/**
 * TaskCard - Clean minimal task card with full feature support
 * Shows: name, duration, time, deadline, conflicts, reschedule count
 */
export default function TaskCard({
  task,
  isActive = false,
  onStart,
  onComplete,
  onDelete,
  onEdit,
  showSwipeActions = true
}) {
  // Deadline urgency helper
  const getDeadlineInfo = () => {
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
  };

  const deadlineInfo = getDeadlineInfo();

  const content = (
    <div
      onClick={() => onEdit && onEdit(task)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        minHeight: '60px',
        borderRadius: '14px',
        background: isActive ? '#3B6E3B' : '#fff',
        boxShadow: isActive
          ? '0 4px 16px rgba(59,110,59,0.25)'
          : task.conflicts ? '0 1px 8px rgba(220,38,38,0.12)' : '0 1px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        color: isActive ? '#fff' : '#1A1A1A',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        opacity: task.completed ? 0.5 : 1
      }}
    >
      {/* Checkbox / Position Circle */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!task.completed && onComplete) onComplete();
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
          cursor: 'pointer'
        }}
      >
        {task.completed ? '✓' : (task.position || '')}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 1.3,
          color: isActive ? '#fff' : task.completed ? '#9CA3AF' : '#1A1A1A',
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
          color: isActive ? 'rgba(255,255,255,0.7)' : '#8E8E93',
          flexWrap: 'wrap'
        }}>
          <span>{task.duration}m</span>
          {task.startTime && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{task.startTime}</span>
            </>
          )}
          {task.carriedOver && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: isActive ? 'rgba(255,255,255,0.7)' : '#D97706' }}>carried</span>
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
            borderRadius: '18px',
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
