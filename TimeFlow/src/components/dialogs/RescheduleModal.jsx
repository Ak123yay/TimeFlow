import { useState, useEffect } from "react";
import { findNextFreeSlot, getDeadlineUrgency } from "../../utils/scheduler";
import { getRescheduleOptionFrequencies } from "../../utils/analytics";
import "../../App.css";

export default function RescheduleModal({
  task,
  availability,
  existingTasks,
  onComplete,
  onContinue,
  onLaterToday,
  onTomorrow,
  onBackToPool,
  onPickTime,
  onBreakTask,
  onClose
}) {
  const [suggestedSlot, setSuggestedSlot] = useState(null);
  const [smartRecommendation, setSmartRecommendation] = useState(null);

  useEffect(() => {
    if (task && availability && existingTasks) {
      const slot = findNextFreeSlot(
        task.remaining || task.duration,
        existingTasks,
        availability,
        true // Only today
      );
      setSuggestedSlot(slot);
    }
  }, [task, availability, existingTasks]);

  // ANALYTICS: Calculate smart recommendation based on user patterns + deadlines
  useEffect(() => {
    if (!task) return;

    const frequencies = getRescheduleOptionFrequencies();
    const attempts = task.attempts || 0;
    const urgency = getDeadlineUrgency(task);

    // Priority-based recommendation logic
    let recommendation = null;

    // CRITICAL: Overdue or due today - strong warning
    if (urgency && (urgency.level === 'overdue' || urgency.level === 'today')) {
      recommendation = {
        option: 'complete',
        reason: urgency.level === 'overdue'
          ? '🚨 This task is OVERDUE! Completing it now prevents further delays.'
          : '⏰ This task is due TODAY! Best to finish it now.',
        confidence: 'high',
        icon: '🔴'
      };
    }
    // HIGH: Due tomorrow - discourage rescheduling to tomorrow
    else if (urgency && urgency.level === 'tomorrow') {
      if (suggestedSlot) {
        recommendation = {
          option: 'later_today',
          reason: `📅 Due tomorrow! Free time available at ${suggestedSlot.startTime} - finish it today.`,
          confidence: 'high',
          icon: '⚠️'
        };
      } else {
        recommendation = {
          option: 'complete',
          reason: '📅 Due tomorrow! Best to complete it now to avoid rushing.',
          confidence: 'moderate',
          icon: '⚠️'
        };
      }
    }
    // High-attempt tasks (>= 3): Strongly suggest breaking
    else if (attempts >= 3) {
      recommendation = {
        option: 'break',
        reason: 'This task has been rescheduled multiple times. Breaking it into smaller pieces might help.',
        confidence: 'high',
        icon: '🔨'
      };
    }
    // If user historically reschedules to tomorrow frequently (>40% of the time)
    else if (frequencies.tomorrow && frequencies.tomorrow > (frequencies.complete || 0) * 0.4) {
      recommendation = {
        option: 'tomorrow',
        reason: 'You often move tasks to tomorrow. This gives you a fresh start.',
        confidence: 'moderate',
        icon: '📅'
      };
    }
    // If later today slot is available and user uses it sometimes
    else if (suggestedSlot && frequencies.later_today > 0) {
      recommendation = {
        option: 'later_today',
        reason: `Free time available at ${suggestedSlot.startTime}. Finish it today while it's fresh.`,
        confidence: 'high',
        icon: '🕐'
      };
    }
    // Default: Encourage completion
    else {
      recommendation = {
        option: 'complete',
        reason: 'You\'re making progress! Mark it done to build momentum.',
        confidence: 'moderate',
        icon: '✓'
      };
    }

    setSmartRecommendation(recommendation);
  }, [task, suggestedSlot]);

  if (!task) return null;

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const attempts = task.attempts || 0;
  const remaining = task.remaining || task.duration;
  const urgency = getDeadlineUrgency(task);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease-out"
    }}>
      <div style={{
        background: isDark ? "#242B24" : "#fff",
        padding: 28,
        borderRadius: 20,
        width: "92%",
        maxWidth: 480,
        textAlign: "center",
        boxShadow: isDark ? "0 30px 80px rgba(0,0,0,0.5)" : "0 30px 80px rgba(0,0,0,0.25)",
        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: isDark ? "#E8F0E8" : "#123a12", marginBottom: 8 }}>
          Task finished?
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: isDark ? "#8BC98B" : "#3B6E3B", marginBottom: 12 }}>
          "{task.name}"
        </p>

        {/* Deadline Urgency Warning - PRIORITY BANNER */}
        {urgency && (urgency.level === 'overdue' || urgency.level === 'today' || urgency.level === 'tomorrow') && (
          <div style={{
            background: urgency.level === 'overdue'
              ? "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(185,28,28,0.08))"
              : urgency.level === 'today'
              ? "linear-gradient(135deg, rgba(234,88,12,0.15), rgba(234,88,12,0.08))"
              : "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))",
            border: `2px solid ${urgency.color}`,
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 700,
            color: urgency.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            animation: urgency.level === 'overdue' || urgency.level === 'today'
              ? "focusPulse 2s ease-in-out infinite"
              : "fadeIn 0.3s ease-out"
          }}>
            {urgency.level === 'overdue' ? '🚨' : urgency.level === 'today' ? '⏰' : '📅'}
            <span>{urgency.message}</span>
          </div>
        )}

        {/* Smart Recommendation Banner */}
        {smartRecommendation && (
          <div style={{
            background: smartRecommendation.confidence === 'high'
              ? "linear-gradient(135deg, rgba(111,175,111,0.15), rgba(59,110,59,0.08))"
              : "linear-gradient(135deg, rgba(167,211,167,0.12), rgba(111,175,111,0.06))",
            border: `1px solid ${smartRecommendation.confidence === 'high' ? 'rgba(59,110,59,0.25)' : 'rgba(111,175,111,0.2)'}`,
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
            textAlign: "left",
            animation: "fadeIn 0.3s ease-out"
          }}>
            <div style={{
              fontWeight: 700,
              color: isDark ? '#8BC98B' : '#3B6E3B',
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <span>{smartRecommendation.icon}</span>
              <span>Recommendation</span>
              {smartRecommendation.confidence === 'high' && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 6px",
                  background: "rgba(59,110,59,0.2)",
                  borderRadius: 4,
                  color: "#2E6B2E"
                }}>
                  HIGH CONFIDENCE
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: isDark ? '#9CA59C' : '#4B6B4B', lineHeight: 1.4 }}>
              {smartRecommendation.reason}
            </div>
          </div>
        )}

        {/* Warning badge for multiple reschedules */}
        {attempts >= 2 && (
          <div style={{
            background: "linear-gradient(135deg, rgba(255,165,0,0.15), rgba(255,165,0,0.08))",
            border: "1px solid rgba(255,165,0,0.3)",
            borderRadius: 10,
            padding: "8px 12px",
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 600,
            color: "#d97706",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6
          }}>
            ⚠️ Rescheduled {attempts} time{attempts > 1 ? 's' : ''}
          </div>
        )}

        <div style={{
          fontSize: 14,
          color: isDark ? '#9CA59C' : '#6B8E6B',
          marginBottom: 20
        }}>
          {remaining} minutes remaining
        </div>

        {/* Primary action - Mark complete */}
        <button
          onClick={onComplete}
          className="btn primary"
          style={{
            width: "100%",
            marginBottom: 16,
            fontSize: 16,
            fontWeight: 700
          }}
        >
          ✓ Mark complete
        </button>

        {/* Secondary actions - Rescheduling */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12
        }}>
          <button
            onClick={onContinue}
            className="btn ghost"
            style={{
              fontSize: 14
            }}
          >
            ⏱️ Continue
            <div style={{ fontSize: 11, opacity: 0.7 }}>(+1 min)</div>
          </button>

          <button
            onClick={() => onLaterToday(suggestedSlot)}
            disabled={!suggestedSlot}
            className="btn ghost"
            title={!suggestedSlot ? "No free time left today" : `Available at ${suggestedSlot.startTime}`}
            style={{
              fontSize: 14,
              opacity: !suggestedSlot ? 0.5 : 1,
              cursor: !suggestedSlot ? "not-allowed" : "pointer"
            }}
          >
            🕐 Later today
            {suggestedSlot && (
              <div style={{ fontSize: 11, opacity: 0.7 }}>({suggestedSlot.startTime})</div>
            )}
          </button>

          <button
            onClick={onTomorrow}
            className="btn ghost"
            title={urgency && (urgency.level === 'overdue' || urgency.level === 'today')
              ? `⚠️ Warning: This task is ${urgency.message}. Consider completing it today.`
              : "Move to tomorrow morning"}
            style={{
              fontSize: 14,
              ...(urgency && (urgency.level === 'overdue' || urgency.level === 'today') && {
                border: '1px solid rgba(245,158,11,0.5)',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))'
              })
            }}
          >
            📅 Tomorrow
            {urgency && (urgency.level === 'overdue' || urgency.level === 'today') ? (
              <div style={{ fontSize: 11, opacity: 0.8, color: '#d97706' }}>⚠️ not ideal</div>
            ) : (
              <div style={{ fontSize: 11, opacity: 0.7 }}>morning</div>
            )}
          </button>

          <button
            onClick={onBackToPool}
            className="btn ghost"
            style={{
              fontSize: 14
            }}
          >
            🌊 Back to Pool
            <div style={{ fontSize: 11, opacity: 0.7 }}>for later</div>
          </button>

          <button
            onClick={onPickTime}
            className="btn ghost"
            style={{
              fontSize: 14
            }}
          >
            🎯 Pick time
          </button>
        </div>

        {/* Break task suggestion for highly rescheduled tasks */}
        {attempts >= 3 && (
          <button
            onClick={onBreakTask}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "2px dashed rgba(245,158,11,0.4)",
              background: "linear-gradient(135deg, rgba(255,165,0,0.08), rgba(255,165,0,0.04))",
              color: "#d97706",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: 12
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,165,0,0.15), rgba(255,165,0,0.08))";
              e.currentTarget.style.borderColor = "rgba(245,158,11,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,165,0,0.08), rgba(255,165,0,0.04))";
              e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
            }}
          >
            🔨 Break into smaller tasks
          </button>
        )}

        {/* Cancel button */}
        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            background: "transparent",
            border: "none",
            color: "#666",
            cursor: "pointer",
            fontSize: 14,
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#333"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
