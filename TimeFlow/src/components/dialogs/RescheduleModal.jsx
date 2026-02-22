import { useState, useEffect } from "react";
import { getDeadlineUrgency } from "../../utils/scheduler";
import { getRescheduleOptionFrequencies } from "../../utils/analytics";
import {
  generateSmartRecommendation,
  categorizeTask,
} from "../../utils/smartReschedule";
import "../../App.css";

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

  useEffect(() => {
    if (!task) return;
    try {
      const elapsed = task.startedAt
        ? Math.round((Date.now() - new Date(task.startedAt).getTime()) / 1000)
        : (task.duration || 30) * 60;
      const rec = generateSmartRecommendation({
        task, availability,
        existingTasks: existingTasks || [],
        elapsedSeconds: elapsed,
      });
      setAiRecommendation(rec);
    } catch (e) {
      console.error('Smart recommendation failed', e);
      setAiRecommendation(null);
    }
  }, [task, availability, existingTasks]);

  if (!task) return null;

  const attempts = task.attempts || 0;
  const remaining = task.remaining || task.duration;
  const urgency = getDeadlineUrgency(task);
  const category = categorizeTask(task.name);

  const procrastination = aiRecommendation?.analysis?.procrastination;
  const completionProb = aiRecommendation?.analysis?.completionProbability;
  const bestSlot = aiRecommendation?.analysis?.bestSlot;
  const bestDay = aiRecommendation?.analysis?.bestDay;
  const continueDuration = aiRecommendation?.analysis?.continueDuration;
  const rankedOptions = aiRecommendation?.ranked || [];
  const topOption = aiRecommendation?.primary?.option;

  const completedToday = (existingTasks || []).filter(t => t.completed).length;

  const showBreakTask = attempts >= 2 ||
    (task.duration || 0) >= 60 ||
    (procrastination && procrastination.severity !== 'none');

  // Colors
  const bg = isDark ? '#1E251E' : '#fff';
  const surface = isDark ? '#252D25' : '#F7FBF7';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#E8F0E8' : '#111';
  const textMuted = isDark ? '#7A8F7A' : '#8A9A8A';
  const green = isDark ? '#6FAF6F' : '#3B6E3B';
  const greenBg = isDark ? 'rgba(111,175,111,0.12)' : 'rgba(59,110,59,0.07)';

  // Urgency accent
  const urgentLevel = urgency?.level;
  const showUrgency = urgentLevel === 'overdue' || urgentLevel === 'today' || urgentLevel === 'tomorrow';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, animation: 'fadeIn 0.15s ease-out',
      padding: '12px',
    }}>
      <div
        className="reschedule-modal"
        style={{
          background: bg,
          borderRadius: 24,
          width: '100%', maxWidth: 420,
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
            : '0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06)',
          animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* ── HEADER ────────────────────────────────── */}
        <div style={{
          padding: '20px 20px 0',
          textAlign: 'center',
        }}>
          {/* urgency strip */}
          {showUrgency && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: urgentLevel === 'overdue' ? 'rgba(220,38,38,0.12)' : 'rgba(234,88,12,0.1)',
              color: urgentLevel === 'overdue' ? '#dc2626' : '#ea580c',
              fontSize: 12, fontWeight: 700, marginBottom: 10,
            }}>
              {urgentLevel === 'overdue' ? '🚨' : '⏰'}
              {urgency.message}
            </div>
          )}

          {/* Title + momentum */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: textPrimary }}>
              Time's up!
            </div>
            {completedToday >= 1 && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                background: completedToday >= 5 ? 'rgba(244,67,54,0.12)' : completedToday >= 3 ? 'rgba(255,152,0,0.12)' : 'rgba(76,175,80,0.1)',
                color: completedToday >= 5 ? '#dc2626' : completedToday >= 3 ? '#d97706' : '#3B8C3B',
              }}>
                {completedToday >= 5 ? '🔥 On fire' : completedToday >= 3 ? '⚡ Hot streak' : `✓ ${completedToday} done`}
              </span>
            )}
          </div>

          {/* Task name */}
          <div style={{
            fontSize: 16, fontWeight: 700,
            color: green, marginBottom: 6,
            lineHeight: 1.3,
          }}>
            "{task.name}"
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {category.primary !== 'other' && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                background: greenBg, color: green,
              }}>
                {category.primary}
              </span>
            )}
            <span style={{ fontSize: 12, color: textMuted }}>
              {remaining} min remaining
            </span>
            {attempts >= 2 && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                background: 'rgba(255,152,0,0.1)', color: '#d97706',
              }}>
                ⚠️ {attempts}× rescheduled
              </span>
            )}
          </div>

          {/* AI hint bar */}
          {topOption && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 12,
              background: greenBg,
              border: `1px solid ${isDark ? 'rgba(111,175,111,0.2)' : 'rgba(59,110,59,0.15)'}`,
              marginBottom: 16, textAlign: 'left',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '2px 5px',
                background: green, color: '#fff', borderRadius: 4,
                letterSpacing: 0.5, flexShrink: 0,
              }}>AI</span>
              <span style={{ fontSize: 12, color: isDark ? '#A8C8A8' : '#3B6B3B', lineHeight: 1.4 }}>
                {aiRecommendation?.summary || `Suggests: ${topOption.replace(/_/g, ' ')}`}
              </span>
            </div>
          )}
        </div>

        {/* ── BUTTONS ───────────────────────────────── */}
        <div style={{ padding: '0 14px 8px' }}>

          {/* Mark complete — full width primary */}
          <button
            onClick={onComplete}
            style={{
              width: '100%', height: 52,
              borderRadius: 14,
              background: topOption === 'complete'
                ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                : `linear-gradient(135deg, ${isDark ? '#3B6E3B' : '#3B6E3B'}, ${isDark ? '#6FAF6F' : '#6FAF6F'})`,
              color: '#fff',
              border: 'none',
              fontSize: 16, fontWeight: 800,
              cursor: 'pointer',
              marginBottom: 10,
              position: 'relative',
              boxShadow: topOption === 'complete'
                ? '0 4px 16px rgba(76,175,80,0.35)'
                : '0 4px 16px rgba(59,110,59,0.2)',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✓ Mark complete
            {topOption === 'complete' && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                fontSize: 9, fontWeight: 800, padding: '2px 5px',
                background: '#fff', color: '#2E7D32',
                borderRadius: 6,
              }}>AI ✦</span>
            )}
          </button>

          {/* 2×2 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>

            {/* Continue */}
            <GridButton
              onClick={() => onContinue(continueDuration?.suggestedMinutes > 1 ? continueDuration.suggestedMinutes : 1)}
              isTop={topOption === 'continue'}
              isDark={isDark}
              emoji="⏱️"
              label="Keep going"
              hint={continueDuration ? `+${continueDuration.suggestedMinutes} min` : '+1 min'}
            />

            {/* Later today */}
            <GridButton
              onClick={() => bestSlot && onLaterToday(bestSlot)}
              isTop={topOption === 'later_today'}
              isDark={isDark}
              disabled={!bestSlot}
              emoji="🕐"
              label="Later today"
              hint={bestSlot ? `${bestSlot.startTime}${bestSlot.score >= 70 ? ' ★' : ''}` : 'No slots'}
            />

            {/* Tomorrow */}
            <GridButton
              onClick={onTomorrow}
              isTop={topOption === 'tomorrow'}
              isDark={isDark}
              emoji="📅"
              label="Tomorrow"
              hint={urgentLevel === 'overdue' || urgentLevel === 'today' ? '⚠️ not ideal' : 'morning'}
              warn={urgentLevel === 'overdue' || urgentLevel === 'today'}
            />

            {/* Back to pool */}
            <GridButton
              onClick={onBackToPool}
              isTop={topOption === 'back_to_pool'}
              isDark={isDark}
              emoji="🌊"
              label="Back to Pool"
              hint="for later"
            />
          </div>

          {/* Tertiary row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <TertiaryButton onClick={onPickTime} isDark={isDark}>
              🎯 Pick a time
            </TertiaryButton>
            {showBreakTask && (
              <TertiaryButton
                onClick={onBreakTask}
                isDark={isDark}
                isTop={topOption === 'break_task'}
                warn
              >
                🔨 Break it up
              </TertiaryButton>
            )}
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────── */}
        <div style={{
          padding: '8px 14px 16px',
          borderTop: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={() => setShowDetails(v => !v)}
            style={{
              background: 'none', border: 'none',
              color: textMuted, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 0',
            }}
          >
            {showDetails ? '▾' : '▸'} AI analysis
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: textMuted, fontSize: 13, cursor: 'pointer',
              padding: '4px 0',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = textPrimary}
            onMouseLeave={e => e.currentTarget.style.color = textMuted}
          >
            Cancel
          </button>
        </div>

        {/* ── DETAILS PANEL ─────────────────────────── */}
        {showDetails && (
          <div style={{
            margin: '0 14px 16px',
            padding: 14,
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.025)',
            borderRadius: 12,
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* Completion probability */}
            {completionProb && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: green, marginBottom: 6 }}>
                  Completion Probability
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    flex: 1, height: 6, borderRadius: 3,
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${Math.round(completionProb.probability * 100)}%`,
                      height: '100%', borderRadius: 3,
                      background: completionProb.probability >= 0.6 ? '#4CAF50' : completionProb.probability >= 0.4 ? '#FF9800' : '#F44336',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: textPrimary, flexShrink: 0 }}>
                    {Math.round(completionProb.probability * 100)}% — {completionProb.label}
                  </span>
                </div>
                {completionProb.factors?.slice(0, 4).map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                    <div style={{
                      width: 28, height: 3, borderRadius: 2,
                      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      <div style={{
                        width: `${Math.round(f.value * 100)}%`, height: '100%', borderRadius: 2,
                        background: f.value >= 0.6 ? '#4CAF50' : f.value >= 0.4 ? '#FF9800' : '#F44336',
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: textMuted }}>{f.name}: {f.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Procrastination */}
            {procrastination && procrastination.severity !== 'none' && procrastination.severity !== 'mild' && (
              <div style={{
                padding: '8px 10px', borderRadius: 8, marginBottom: 10,
                background: procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.08)' : 'rgba(255,152,0,0.08)',
                border: `1px solid ${procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.2)' : 'rgba(255,152,0,0.2)'}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: procrastination.severity === 'chronic' ? '#dc2626' : '#d97706', marginBottom: 3 }}>
                  {procrastination.severity === 'chronic' ? '🚫 Chronic Avoidance' : procrastination.severity === 'severe' ? '⚡ Strong Avoidance' : '🔄 Building Avoidance'}
                  <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: 5 }}>{procrastination.score}/100</span>
                </div>
                {procrastination.interventions[0] && (
                  <div style={{ fontSize: 10, color: green }}>Tip: {procrastination.interventions[0].label}</div>
                )}
              </div>
            )}

            {/* Option ranking */}
            {rankedOptions.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: green, marginBottom: 6 }}>
                  Option Ranking
                </div>
                {rankedOptions.slice(0, 5).map((opt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, width: 18 }}>{opt.icon}</span>
                    <div style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${opt.score}%`, height: '100%', borderRadius: 2,
                        background: i === 0 ? '#4CAF50' : isDark ? '#444' : '#bbb',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: textMuted, minWidth: 24, textAlign: 'right', fontWeight: i === 0 ? 700 : 400 }}>
                      {opt.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GridButton({ onClick, isTop, isDark, disabled, emoji, label, hint, warn }) {
  const green = isDark ? '#6FAF6F' : '#3B6E3B';
  const base = isDark ? '#252D25' : '#F4F9F4';
  const borderColor = isTop
    ? `rgba(76,175,80,0.45)`
    : warn
    ? 'rgba(245,158,11,0.3)'
    : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: isTop
          ? (isDark ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.07)')
          : base,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 14,
        padding: '12px 8px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 3, minHeight: 72,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        position: 'relative',
        transition: 'transform 0.1s, box-shadow 0.1s',
        boxShadow: isTop ? '0 0 0 1px rgba(76,175,80,0.2)' : 'none',
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', lineHeight: 1.2 }}>
        {label}
      </span>
      <span style={{
        fontSize: 11, lineHeight: 1.2,
        color: warn ? '#d97706' : isDark ? '#7A8F7A' : '#8A9A8A',
      }}>
        {hint}
      </span>
      {isTop && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          fontSize: 9, fontWeight: 800, padding: '2px 5px',
          background: '#4CAF50', color: '#fff',
          borderRadius: 5, boxShadow: '0 1px 4px rgba(76,175,80,0.4)',
        }}>AI ✦</span>
      )}
    </button>
  );
}

function TertiaryButton({ onClick, isDark, isTop, warn, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, height: 40,
        borderRadius: 10,
        border: isTop
          ? '1.5px solid rgba(76,175,80,0.4)'
          : warn
          ? '1.5px dashed rgba(245,158,11,0.35)'
          : `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        background: isTop
          ? (isDark ? 'rgba(76,175,80,0.08)' : 'rgba(76,175,80,0.05)')
          : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        color: isTop
          ? (isDark ? '#8BC98B' : '#2E6B2E')
          : warn
          ? '#d97706'
          : isDark ? '#7A8F7A' : '#6B8A6B',
        fontSize: 13, fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform 0.1s',
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {children}
    </button>
  );
}
