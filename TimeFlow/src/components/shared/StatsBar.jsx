import React from 'react';

/**
 * StatsBar - Display daily task statistics
 *
 * Shows:
 * - Total number of tasks
 * - Total scheduled time
 * - Free time or overflow warning
 */
export default function StatsBar({
  taskCount = 0,
  totalMinutes = 0,
  freeTime = 0,
  overflowData = { severity: 'none' }
}) {
  const isOverflowing = freeTime < 0;
  const severity = overflowData.severity || 'none';

  return (
    <div
      className="presets horizontal-scroll stats-bar"
      role="list"
      style={{ marginBottom: "20px" }}
    >
      {/* Task Count */}
      <StatCard
        value={`${taskCount} Tasks`}
        label="Planned"
      />

      {/* Total Scheduled Time */}
      <StatCard
        value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
        label="Scheduled"
      />

      {/* Free Time / Overflow */}
      <StatCard
        value={`${Math.floor(Math.abs(freeTime) / 60)}h ${Math.abs(freeTime) % 60}m`}
        label={isOverflowing ? `Overflow (${severity})` : "Free Time"}
        severity={severity}
      />
    </div>
  );
}

/**
 * StatCard - Individual stat display card
 */
function StatCard({ value, label, severity = 'none' }) {
  const getBackgroundColor = () => {
    if (severity === 'critical') {
      return "linear-gradient(180deg, rgba(255,200,200,0.2), rgba(255,220,220,0.1))";
    }
    if (severity === 'warning') {
      return "linear-gradient(180deg, rgba(255,230,200,0.15), rgba(255,240,220,0.08))";
    }
    return undefined;
  };

  const getTextColor = () => {
    if (severity === 'critical') return "#b91c1c";
    if (severity === 'warning') return "#ea580c";
    return undefined;
  };

  return (
    <div
      className="preset-pill stat-card"
      style={{
        cursor: "default",
        minWidth: "140px",
        background: getBackgroundColor(),
        boxShadow: "0 2px 8px rgba(59,110,59,0.04)"
      }}
      role="listitem"
    >
      <div
        className="preset-text"
        style={{ color: getTextColor() }}
      >
        {value}
      </div>
      <div className="preset-sub">{label}</div>
    </div>
  );
}

/**
 * OverflowWarning - Warning banner for schedule overflow
 *
 * Displayed below StatsBar when tasks exceed available time
 */
export function OverflowWarning({ overflowData, freeTime }) {
  if (!overflowData || freeTime >= 0) return null;

  const { severity, message, overflowMinutes } = overflowData;

  const getWarningStyle = () => {
    const baseStyle = {
      marginBottom: "20px",
      padding: "14px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      animation: "fadeIn 0.3s ease-out"
    };

    if (severity === 'critical') {
      return {
        ...baseStyle,
        background: "linear-gradient(90deg, rgba(255,200,200,0.15), rgba(255,220,220,0.1))",
        border: "1px solid rgba(220,38,38,0.3)",
        color: "#b91c1c"
      };
    }

    return {
      ...baseStyle,
      background: "linear-gradient(90deg, rgba(255,230,200,0.12), rgba(255,240,220,0.08))",
      border: "1px solid rgba(234,88,12,0.25)",
      color: "#ea580c"
    };
  };

  return (
    <div style={getWarningStyle()} role="alert">
      <span style={{ fontSize: "20px" }} aria-hidden="true">
        {severity === 'critical' ? '⚠️' : '⏰'}
      </span>
      <div style={{ flex: 1 }}>
        <div>{message || `You have ${Math.abs(overflowMinutes)} minutes of overflow`}</div>
        <div style={{
          fontSize: "12px",
          marginTop: "4px",
          opacity: 0.8
        }}>
          Consider rescheduling some tasks or reducing durations
        </div>
      </div>
    </div>
  );
}
