import React, { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../../utils/useDarkMode';
import { PauseIcon, PlayIcon, CloseIcon } from '../../icons';

/**
 * TaskTimer - Clean mobile-friendly active task timer
 */
export default function TaskTimer({
  activeTask,
  secondsLeft,
  totalSeconds,
  onFinishEarly,
  onPauseResume,
  onCancel,
  isPaused = false
}) {
  if (!activeTask) return null;

  const isDark = useDarkMode();

  const progressPct = totalSeconds > 0
    ? ((totalSeconds - secondsLeft) / totalSeconds) * 100
    : 0;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const elapsedMinutes = Math.max(0, Math.floor((totalSeconds - secondsLeft) / 60));
  const totalMinutesDisplay = Math.ceil(totalSeconds / 60);

  // Color based on time remaining
  const percentLeft = (secondsLeft / totalSeconds) * 100;
  const timerColor = percentLeft > 50 ? '#3B6E3B' : percentLeft > 25 ? '#D97706' : '#DC2626';

  return (
    <div>
      {/* Label */}
      <div style={{
        fontSize: '11px',
        fontWeight: 700,
        color: isDark ? '#9CA59C' : '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        Now Working On {isPaused && <span style={{ color: '#D97706' }}><PauseIcon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Paused</span>}
      </div>

      {/* Task Name */}
      <div style={{
        fontSize: '17px',
        fontWeight: 700,
        color: isDark ? '#E8F0E8' : '#1A1A1A',
        marginBottom: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {activeTask.name}
      </div>

      {/* Timer + Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        {/* Countdown */}
        <div style={{
          fontSize: '28px',
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          color: isPaused ? (isDark ? '#9CA59C' : '#8E8E93') : timerColor,
          lineHeight: 1,
          flexShrink: 0
        }}>
          {timeDisplay}
        </div>

        {/* Progress Bar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            height: '6px',
            background: isDark ? '#6B7B6B' : '#F0F0F0',
            borderRadius: '99px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: isPaused ? (isDark ? '#9CA59C' : '#8E8E93') : timerColor,
              borderRadius: '99px',
              transition: isPaused ? 'none' : 'width 1s linear'
            }} />
          </div>
          <div style={{
            fontSize: '11px',
            color: isDark ? '#9CA59C' : '#8E8E93',
            marginTop: '4px',
            fontWeight: 500
          }}>
            {elapsedMinutes} / {totalMinutesDisplay} min
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Pause/Resume button */}
        <button
          onClick={onPauseResume}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
            background: isDark ? '#242B24' : '#fff',
            color: isDark ? '#E8F0E8' : '#1A1A1A',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            touchAction: 'manipulation',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {isPaused ? <><PlayIcon size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Resume</> : <><PauseIcon size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Pause</>}
        </button>

        {/* Finish Early button */}
        <button
          onClick={onFinishEarly}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: '1.5px solid #3B6E3B',
            background: isDark ? '#242B24' : '#fff',
            color: '#3B6E3B',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            touchAction: 'manipulation'
          }}
        >
          Finish
        </button>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1.5px solid #DC2626',
            background: isDark ? '#242B24' : '#fff',
            color: '#DC2626',
            fontSize: '16px',
            cursor: 'pointer',
            touchAction: 'manipulation',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <CloseIcon size={20} />
        </button>
      </div>
    </div>
  );
}
