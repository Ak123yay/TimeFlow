import { useState, useEffect, useMemo } from "react";
import { findNextFreeSlot, getDeadlineUrgency } from "../../utils/scheduler";
import { getRescheduleOptionFrequencies } from "../../utils/analytics";
import {
  generateSmartRecommendation,
  detectProcrastination,
  predictCompletionProbability,
  findScoredSlots,
  estimateContinueDuration,
  analyzeWeekdayWorkload,
  categorizeTask,
  getTodaySessionStats,
} from "../../utils/smartReschedule";
import "../../App.css";

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/** Compact probability meter */
function ProbabilityMeter({ probability, label, confidence }) {
  const pct = Math.round(probability * 100);
  const color = pct >= 60 ? '#4CAF50' : pct >= 40 ? '#FF9800' : '#F44336';
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 10,
      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      marginBottom: 10,
    }}>
      {/* Mini bar */}
      <div style={{
        width: 60, height: 6, borderRadius: 3,
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 3,
          background: color, transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{ flex: 1 }}>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: isDark ? '#E8F0E8' : '#1A1A1A',
        }}>
          {pct}% {label}
        </span>
        {confidence < 0.5 && (
          <span style={{
            fontSize: 10, color: isDark ? '#666' : '#999',
            marginLeft: 6,
          }}>
            (learning)
          </span>
        )}
      </div>
    </div>
  );
}

/** Procrastination warning banner */
function ProcrastinationBanner({ analysis }) {
  if (analysis.severity === 'none' || analysis.severity === 'mild') return null;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const severityConfig = {
    moderate: { bg: 'rgba(255,165,0,0.1)', border: 'rgba(255,165,0,0.3)', icon: '🔄', color: '#d97706' },
    severe:   { bg: 'rgba(244,67,54,0.08)', border: 'rgba(244,67,54,0.3)', icon: '⚡', color: '#ef4444' },
    chronic:  { bg: 'rgba(244,67,54,0.12)', border: 'rgba(244,67,54,0.4)', icon: '🚫', color: '#dc2626' },
  };

  const config = severityConfig[analysis.severity] || severityConfig.moderate;

  return (
    <div style={{
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 10, padding: '8px 12px',
      marginBottom: 10, fontSize: 12,
      animation: 'fadeIn 0.3s ease-out',
    }}>
      <div style={{
        fontWeight: 700, color: config.color,
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
      }}>
        <span>{config.icon}</span>
        <span>
          {analysis.severity === 'chronic' ? 'Chronic Avoidance' :
           analysis.severity === 'severe' ? 'Strong Avoidance' :
           'Building Avoidance'}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 600, padding: '1px 5px',
          background: `${config.color}22`, borderRadius: 3,
          color: config.color,
        }}>
          {analysis.score}/100
        </span>
      </div>
      {analysis.patterns.slice(0, 2).map((p, i) => (
        <div key={i} style={{
          fontSize: 11, color: isDark ? '#9CA59C' : '#666',
          lineHeight: 1.4, paddingLeft: 4,
        }}>
          {p}
        </div>
      ))}
      {analysis.interventions.length > 0 && (
        <div style={{
          marginTop: 4, fontSize: 11, fontWeight: 600,
          color: isDark ? '#8BC98B' : '#3B6E3B',
        }}>
          Tip: {analysis.interventions[0].label}
        </div>
      )}
    </div>
  );
}

/** AI recommendation card with ranked options */
function AIRecommendationCard({ recommendation }) {
  if (!recommendation) return null;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const { primary, confidence, summary } = recommendation;

  const confColor = confidence === 'high' ? '#4CAF50' : confidence === 'moderate' ? '#FF9800' : '#9E9E9E';
  const confLabel = confidence === 'high' ? 'HIGH' : confidence === 'moderate' ? 'MODERATE' : 'LOW';

  return (
    <div style={{
      background: isDark
        ? 'linear-gradient(135deg, rgba(111,175,111,0.12), rgba(59,110,59,0.06))'
        : 'linear-gradient(135deg, rgba(111,175,111,0.15), rgba(59,110,59,0.08))',
      border: `1px solid ${isDark ? 'rgba(111,175,111,0.2)' : 'rgba(59,110,59,0.2)'}`,
      borderRadius: 12, padding: '10px 14px',
      marginBottom: 12, animation: 'fadeIn 0.4s ease-out',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 14 }}>{primary.icon}</span>
        <span style={{
          fontSize: 13, fontWeight: 700,
          color: isDark ? '#8BC98B' : '#2E6B2E',
        }}>
          AI Recommendation
        </span>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '1px 6px',
          background: `${confColor}22`, color: confColor,
          borderRadius: 4, letterSpacing: 0.5,
        }}>
          {confLabel}
        </span>
        {primary.tag && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '1px 6px',
            background: 'rgba(244,67,54,0.15)', color: '#ef4444',
            borderRadius: 4,
          }}>
            {primary.tag}
          </span>
        )}
      </div>
      <div style={{
        fontSize: 12, lineHeight: 1.5,
        color: isDark ? '#B8C8B8' : '#4B6B4B',
      }}>
        {summary}
      </div>
    </div>
  );
}

/** Workload preview for tomorrow/best day */
function WorkloadPreview({ bestDay }) {
  if (!bestDay) return null;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div style={{
      fontSize: 10, color: isDark ? '#777' : '#999',
      display: 'flex', alignItems: 'center', gap: 4, marginTop: 2,
    }}>
      <span>{bestDay.dayName}:</span>
      <span>{bestDay.taskCount} tasks</span>
      <span>·</span>
      <span>{bestDay.freeMinutes}min free</span>
      <div style={{
        width: 30, height: 3, borderRadius: 2,
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${bestDay.loadPercent}%`, height: '100%',
          borderRadius: 2,
          background: bestDay.loadPercent > 80 ? '#F44336' : bestDay.loadPercent > 50 ? '#FF9800' : '#4CAF50',
        }} />
      </div>
    </div>
  );
}

/** Session momentum badge */
function MomentumBadge({ tasks }) {
  const completedToday = (tasks || []).filter(t => t.completed).length;
  if (completedToday === 0) return null;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let label, color;
  if (completedToday >= 5) { label = 'On fire!'; color = '#F44336'; }
  else if (completedToday >= 3) { label = 'Hot streak'; color = '#FF9800'; }
  else { label = `${completedToday} done today`; color = '#4CAF50'; }

  return (
    <span style={{
      fontSize: 10, fontWeight: 600,
      padding: '2px 8px', borderRadius: 99,
      background: `${color}18`, color,
      display: 'inline-flex', alignItems: 'center', gap: 3,
    }}>
      <span style={{ fontSize: 8 }}>●</span>
      {label}
    </span>
  );
}


// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Run full AI analysis when modal opens
  useEffect(() => {
    if (!task) return;

    try {
      const elapsed = task.startedAt
        ? Math.round((Date.now() - new Date(task.startedAt).getTime()) / 1000)
        : (task.duration || 30) * 60;

      const rec = generateSmartRecommendation({
        task,
        availability,
        existingTasks: existingTasks || [],
        elapsedSeconds: elapsed,
      });
      setAiRecommendation(rec);
    } catch (e) {
      console.error('Smart recommendation failed, using fallback', e);
      setAiRecommendation(null);
    }
  }, [task, availability, existingTasks]);

  if (!task) return null;

  const attempts = task.attempts || 0;
  const remaining = task.remaining || task.duration;
  const urgency = getDeadlineUrgency(task);
  const category = categorizeTask(task.name);

  // Extract AI analysis data
  const procrastination = aiRecommendation?.analysis?.procrastination;
  const completionProb = aiRecommendation?.analysis?.completionProbability;
  const bestSlot = aiRecommendation?.analysis?.bestSlot;
  const bestDay = aiRecommendation?.analysis?.bestDay;
  const continueDuration = aiRecommendation?.analysis?.continueDuration;
  const rankedOptions = aiRecommendation?.ranked || [];

  // Find specific option scores for button highlighting
  const getOptionScore = (option) => {
    const found = rankedOptions.find(o => o.option === option);
    return found ? found.score : 0;
  };

  const isTopRecommended = (option) =>
    aiRecommendation?.primary?.option === option;

  const showBreakTask = attempts >= 2 ||
    (task.duration || 0) >= 60 ||
    (procrastination && procrastination.severity !== 'none');

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, animation: "fadeIn 0.2s ease-out",
    }}>
      <div style={{
        background: isDark ? "#242B24" : "#fff",
        padding: 24, borderRadius: 20,
        width: "92%", maxWidth: 480,
        textAlign: "center",
        boxShadow: isDark
          ? "0 30px 80px rgba(0,0,0,0.5)"
          : "0 30px 80px rgba(0,0,0,0.25)",
        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 6,
        }}>
          <div style={{
            fontSize: 22, fontWeight: 900,
            color: isDark ? "#E8F0E8" : "#123a12",
          }}>
            Task finished?
          </div>
          <MomentumBadge tasks={existingTasks} />
        </div>

        <p style={{
          fontSize: 15, fontWeight: 600,
          color: isDark ? "#8BC98B" : "#3B6E3B",
          marginBottom: 4,
        }}>
          "{task.name}"
        </p>

        {/* Category tag */}
        {category.primary !== 'other' && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            padding: '2px 8px', borderRadius: 99,
            background: isDark ? 'rgba(111,175,111,0.15)' : 'rgba(111,175,111,0.12)',
            color: isDark ? '#8BC98B' : '#4B7B4B',
            display: 'inline-block', marginBottom: 8,
          }}>
            {category.primary}
          </span>
        )}

        {/* Deadline Urgency Warning */}
        {urgency && (urgency.level === 'overdue' || urgency.level === 'today' || urgency.level === 'tomorrow') && (
          <div style={{
            background: urgency.level === 'overdue'
              ? "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(185,28,28,0.08))"
              : urgency.level === 'today'
              ? "linear-gradient(135deg, rgba(234,88,12,0.15), rgba(234,88,12,0.08))"
              : "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))",
            border: `2px solid ${urgency.color}`,
            borderRadius: 12, padding: "10px 14px",
            marginBottom: 10, fontSize: 13, fontWeight: 700,
            color: urgency.color,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            animation: urgency.level === 'overdue' || urgency.level === 'today'
              ? "focusPulse 2s ease-in-out infinite"
              : "fadeIn 0.3s ease-out",
          }}>
            {urgency.level === 'overdue' ? '🚨' : urgency.level === 'today' ? '⏰' : '📅'}
            <span>{urgency.message}</span>
          </div>
        )}

        {/* Completion Probability */}
        {completionProb && (
          <ProbabilityMeter
            probability={completionProb.probability}
            label={completionProb.label}
            confidence={completionProb.confidence}
          />
        )}

        {/* AI Recommendation Card */}
        <AIRecommendationCard recommendation={aiRecommendation} />

        {/* Procrastination Banner */}
        {procrastination && <ProcrastinationBanner analysis={procrastination} />}

        {/* Reschedule count warning */}
        {attempts >= 2 && !procrastination?.severity?.match(/severe|chronic/) && (
          <div style={{
            background: "linear-gradient(135deg, rgba(255,165,0,0.12), rgba(255,165,0,0.06))",
            border: "1px solid rgba(255,165,0,0.25)",
            borderRadius: 10, padding: "6px 12px",
            marginBottom: 10, fontSize: 12, fontWeight: 600,
            color: "#d97706",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            ⚠️ Rescheduled {attempts} time{attempts > 1 ? 's' : ''}
          </div>
        )}

        {/* Time remaining */}
        <div style={{
          fontSize: 13, color: isDark ? '#9CA59C' : '#6B8E6B',
          marginBottom: 14,
        }}>
          {remaining} minutes remaining
        </div>

        {/* ===================== ACTION BUTTONS ===================== */}

        {/* Primary: Mark complete */}
        <button
          onClick={onComplete}
          className="btn primary"
          style={{
            width: "100%", marginBottom: 12,
            fontSize: 15, fontWeight: 700,
            position: 'relative',
            ...(isTopRecommended('complete') && {
              boxShadow: '0 0 0 2px rgba(76,175,80,0.4), 0 4px 12px rgba(76,175,80,0.15)',
            }),
          }}
        >
          ✓ Mark complete
          {isTopRecommended('complete') && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              fontSize: 9, fontWeight: 700, padding: '2px 6px',
              background: '#4CAF50', color: '#fff',
              borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}>
              AI
            </span>
          )}
        </button>

        {/* Grid of secondary options */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 8, marginBottom: 10,
        }}>
          {/* Continue */}
          <button
            onClick={() => {
              if (continueDuration && continueDuration.suggestedMinutes > 1) {
                // Pass suggested minutes through the continue handler
                onContinue(continueDuration.suggestedMinutes);
              } else {
                onContinue(1);
              }
            }}
            className="btn ghost"
            style={{
              fontSize: 13, position: 'relative',
              ...(isTopRecommended('continue') && {
                border: '2px solid rgba(76,175,80,0.4)',
              }),
            }}
          >
            ⏱️ Continue
            <div style={{ fontSize: 10, opacity: 0.7 }}>
              {continueDuration
                ? `+${continueDuration.suggestedMinutes}min`
                : '+1 min'}
            </div>
            {continueDuration && continueDuration.confidence !== 'low' && (
              <div style={{
                fontSize: 9, opacity: 0.6, marginTop: 1,
                maxWidth: '100%', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {continueDuration.reason.substring(0, 40)}
              </div>
            )}
            {isTopRecommended('continue') && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                fontSize: 8, fontWeight: 700, padding: '1px 4px',
                background: '#4CAF50', color: '#fff',
                borderRadius: 4,
              }}>AI</span>
            )}
          </button>

          {/* Later today */}
          <button
            onClick={() => {
              if (bestSlot) {
                onLaterToday(bestSlot);
              }
            }}
            disabled={!bestSlot}
            className="btn ghost"
            title={!bestSlot ? "No free time left today" : `Best slot: ${bestSlot.startTime} (score: ${bestSlot.score})`}
            style={{
              fontSize: 13, position: 'relative',
              opacity: !bestSlot ? 0.5 : 1,
              cursor: !bestSlot ? "not-allowed" : "pointer",
              ...(isTopRecommended('later_today') && {
                border: '2px solid rgba(76,175,80,0.4)',
              }),
            }}
          >
            🕐 Later today
            {bestSlot && (
              <div style={{ fontSize: 10, opacity: 0.7 }}>
                {bestSlot.startTime}
                {bestSlot.score >= 70 && ' ★'}
              </div>
            )}
            {bestSlot && bestSlot.reasons.length > 0 && (
              <div style={{
                fontSize: 9, opacity: 0.6, marginTop: 1,
                maxWidth: '100%', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {bestSlot.reasons[0]}
              </div>
            )}
            {isTopRecommended('later_today') && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                fontSize: 8, fontWeight: 700, padding: '1px 4px',
                background: '#4CAF50', color: '#fff',
                borderRadius: 4,
              }}>AI</span>
            )}
          </button>

          {/* Tomorrow */}
          <button
            onClick={onTomorrow}
            className="btn ghost"
            title={urgency && (urgency.level === 'overdue' || urgency.level === 'today')
              ? `Warning: ${urgency.message}`
              : "Move to tomorrow"}
            style={{
              fontSize: 13, position: 'relative',
              ...(urgency && (urgency.level === 'overdue' || urgency.level === 'today') && {
                border: '1px solid rgba(245,158,11,0.5)',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))',
              }),
              ...(isTopRecommended('tomorrow') && {
                border: '2px solid rgba(76,175,80,0.4)',
              }),
            }}
          >
            📅 Tomorrow
            {urgency && (urgency.level === 'overdue' || urgency.level === 'today') ? (
              <div style={{ fontSize: 10, opacity: 0.8, color: '#d97706' }}>⚠️ not ideal</div>
            ) : (
              <div style={{ fontSize: 10, opacity: 0.7 }}>morning</div>
            )}
            <WorkloadPreview bestDay={bestDay} />
            {isTopRecommended('tomorrow') && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                fontSize: 8, fontWeight: 700, padding: '1px 4px',
                background: '#4CAF50', color: '#fff',
                borderRadius: 4,
              }}>AI</span>
            )}
          </button>

          {/* Back to Pool */}
          <button
            onClick={onBackToPool}
            className="btn ghost"
            style={{
              fontSize: 13, position: 'relative',
              ...(isTopRecommended('back_to_pool') && {
                border: '2px solid rgba(76,175,80,0.4)',
              }),
            }}
          >
            🌊 Back to Pool
            <div style={{ fontSize: 10, opacity: 0.7 }}>for later</div>
            {isTopRecommended('back_to_pool') && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                fontSize: 8, fontWeight: 700, padding: '1px 4px',
                background: '#4CAF50', color: '#fff',
                borderRadius: 4,
              }}>AI</span>
            )}
          </button>

          {/* Pick time */}
          <button
            onClick={onPickTime}
            className="btn ghost"
            style={{ fontSize: 13 }}
          >
            🎯 Pick time
          </button>
        </div>

        {/* Break Task - shown for avoidance patterns or high-attempt or long tasks */}
        {showBreakTask && (
          <button
            onClick={onBreakTask}
            style={{
              width: "100%", padding: "10px",
              borderRadius: "12px",
              border: isTopRecommended('break_task')
                ? "2px solid rgba(76,175,80,0.4)"
                : "2px dashed rgba(245,158,11,0.4)",
              background: isTopRecommended('break_task')
                ? "linear-gradient(135deg, rgba(76,175,80,0.1), rgba(76,175,80,0.05))"
                : "linear-gradient(135deg, rgba(255,165,0,0.08), rgba(255,165,0,0.04))",
              color: isTopRecommended('break_task') ? "#2E6B2E" : "#d97706",
              fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s ease",
              marginBottom: 10, position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🔨 Break into smaller tasks
            {procrastination && procrastination.interventions.length > 0 && (
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                {procrastination.interventions[0].reason.substring(0, 50)}
              </div>
            )}
            {isTopRecommended('break_task') && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                fontSize: 8, fontWeight: 700, padding: '1px 4px',
                background: '#4CAF50', color: '#fff',
                borderRadius: 4,
              }}>AI</span>
            )}
          </button>
        )}

        {/* Details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'transparent', border: 'none',
            color: isDark ? '#666' : '#999',
            cursor: 'pointer', fontSize: 11,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 4,
            width: '100%', padding: '4px 0',
            marginBottom: showDetails ? 8 : 0,
          }}
        >
          {showDetails ? '▾ Hide analysis' : '▸ Show AI analysis'}
        </button>

        {/* Expanded analysis details */}
        {showDetails && (
          <div style={{
            background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
            borderRadius: 10, padding: 12,
            marginBottom: 10, textAlign: 'left',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* Completion factors */}
            {completionProb && completionProb.factors.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: isDark ? '#8BC98B' : '#3B6E3B',
                  marginBottom: 6,
                }}>
                  Completion Factors
                </div>
                {completionProb.factors.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 4,
                  }}>
                    <div style={{
                      width: 36, height: 4, borderRadius: 2,
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      <div style={{
                        width: `${Math.round(f.value * 100)}%`,
                        height: '100%', borderRadius: 2,
                        background: f.value >= 0.6 ? '#4CAF50' : f.value >= 0.4 ? '#FF9800' : '#F44336',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 10, color: isDark ? '#999' : '#666',
                      flex: 1,
                    }}>
                      {f.name}: {f.description}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Ranked options */}
            {rankedOptions.length > 0 && (
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: isDark ? '#8BC98B' : '#3B6E3B',
                  marginBottom: 6,
                }}>
                  Option Ranking
                </div>
                {rankedOptions.slice(0, 5).map((opt, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 4, padding: '3px 0',
                    opacity: i === 0 ? 1 : 0.7,
                  }}>
                    <span style={{ fontSize: 12, width: 20 }}>{opt.icon}</span>
                    <div style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${opt.score}%`, height: '100%',
                        borderRadius: 2,
                        background: i === 0 ? '#4CAF50' : isDark ? '#555' : '#999',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: i === 0 ? 700 : 400,
                      color: isDark ? '#999' : '#666',
                      minWidth: 26, textAlign: 'right',
                    }}>
                      {opt.score}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Category & session stats */}
            <div style={{
              marginTop: 8, fontSize: 10,
              color: isDark ? '#666' : '#aaa',
              display: 'flex', gap: 12, flexWrap: 'wrap',
            }}>
              {category.primary !== 'other' && (
                <span>Category: {category.primary} ({Math.round(category.confidence * 100)}%)</span>
              )}
              {procrastination && (
                <span>Avoidance: {procrastination.severity} ({procrastination.score}/100)</span>
              )}
            </div>
          </div>
        )}

        {/* Cancel */}
        <button
          onClick={onClose}
          style={{
            marginTop: 4, background: "transparent",
            border: "none", color: isDark ? '#555' : "#666",
            cursor: "pointer", fontSize: 13,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#999' : '#333'}
          onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#555' : '#666'}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
