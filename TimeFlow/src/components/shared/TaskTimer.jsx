import React from 'react';

/**
 * TaskTimer - Clean mobile-friendly active task timer
 */
export default function TaskTimer({
  activeTask,
  secondsLeft,
  totalSeconds,
  onFinishEarly,
}) {
  if (!activeTask) return null;

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
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        Now Working On
      </div>

      {/* Task Name */}
      <div style={{
        fontSize: '17px',
        fontWeight: 700,
        color: '#1A1A1A',
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
          color: timerColor,
          lineHeight: 1,
          flexShrink: 0
        }}>
          {timeDisplay}
        </div>

        {/* Progress Bar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            height: '6px',
            background: '#F0F0F0',
            borderRadius: '99px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: timerColor,
              borderRadius: '99px',
              transition: 'width 1s linear'
            }} />
          </div>
          <div style={{
            fontSize: '11px',
            color: '#8E8E93',
            marginTop: '4px',
            fontWeight: 500
          }}>
            {elapsedMinutes} / {totalMinutesDisplay} min
          </div>
        </div>
      </div>

      {/* Finish Early button */}
      <button
        onClick={onFinishEarly}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '10px',
          border: '1.5px solid #E5E5E5',
          background: '#fff',
          color: '#1A1A1A',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          touchAction: 'manipulation'
        }}
      >
        Finish Early
      </button>
    </div>
  );
}
