import { useState, useEffect } from "react";
import { findNextFreeSlot } from "../../utils/scheduler";
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

  // ANALYTICS: Calculate smart recommendation based on user patterns
  useEffect(() => {
    if (!task) return;

    const frequencies = getRescheduleOptionFrequencies();
    const attempts = task.attempts || 0;

    // Priority-based recommendation logic
    let recommendation = null;

    // High-attempt tasks (>= 3): Strongly suggest breaking
    if (attempts >= 3) {
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

  const attempts = task.attempts || 0;
  const remaining = task.remaining || task.duration;

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
        background: "#fff",
        padding: 28,
        borderRadius: 20,
        width: "92%",
        maxWidth: 480,
        textAlign: "center",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#123a12", marginBottom: 8 }}>
          Task finished?
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#3B6E3B", marginBottom: 12 }}>
          "{task.name}"
        </p>

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
              color: "#3B6E3B",
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
            <div style={{ fontSize: 12, color: "#4B6B4B", lineHeight: 1.4 }}>
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
          color: "#6B8E6B",
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
            style={{
              fontSize: 14
            }}
          >
            📅 Tomorrow
            <div style={{ fontSize: 11, opacity: 0.7 }}>morning</div>
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
