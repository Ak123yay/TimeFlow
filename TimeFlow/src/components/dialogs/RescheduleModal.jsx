import { useState, useEffect } from "react";
import { getDeadlineUrgency } from "../../utils/scheduler";
import { getRescheduleOptionFrequencies } from "../../utils/analytics";
import {
  generateSmartRecommendation,
  categorizeTask,
} from "../../utils/smartReschedule";
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
  const continueDuration = aiRecommendation?.analysis?.continueDuration;
  const bestDay = aiRecommendation?.analysis?.bestDay;
  const rankedOptions = aiRecommendation?.ranked || [];
  const topOption = aiRecommendation?.primary?.option;

  const completedToday = (existingTasks || []).filter(t => t.completed).length;
  const urgentLevel = urgency?.level;
  const showUrgency = urgentLevel === 'overdue' || urgentLevel === 'today' || urgentLevel === 'tomorrow';

  const showBreakTask = attempts >= 2 ||
    (task.duration || 0) >= 60 ||
    (procrastination && procrastination.severity !== 'none');

  // Design tokens matching the rest of the app
  const cardBg = isDark ? '#242B24' : '#fff';
  const labelColor = isDark ? '#8BC98B' : '#3B6E3B';
  const mutedColor = isDark ? '#9CA59C' : '#6B8E6B';
  const titleColor = isDark ? '#E8F0E8' : '#123a12';
  const divider = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const tileBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(111,175,111,0.06)';
  const tileBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(111,175,111,0.2)';
  const tileTopBorder = isDark ? 'rgba(111,175,111,0.5)' : 'rgba(59,110,59,0.5)';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, animation: 'fadeIn 0.2s ease-out',
      padding: '16px',
    }}>
      <div
        className="reschedule-modal"
        style={{
          background: cardBg,
          borderRadius: 20,
          width: '100%', maxWidth: 440,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: isDark
            ? '0 30px 80px rgba(0,0,0,0.5)'
            : '0 30px 80px rgba(0,0,0,0.25)',
          animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>

          {/* Urgency pill */}
          {showUrgency && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 12px', borderRadius: 99, marginBottom: 12,
              background: urgentLevel === 'overdue' ? 'rgba(220,38,38,0.1)' : 'rgba(234,88,12,0.09)',
              border: `1px solid ${urgentLevel === 'overdue' ? 'rgba(220,38,38,0.3)' : 'rgba(234,88,12,0.25)'}`,
              color: urgentLevel === 'overdue' ? '#dc2626' : '#ea580c',
              fontSize: 12, fontWeight: 700,
            }}>
              {urgentLevel === 'overdue' ? '🚨' : '⏰'} {urgency.message}
            </div>
          )}

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: titleColor }}>
              Time's up!
            </h2>
            {completedToday >= 1 && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                background: completedToday >= 5 ? 'rgba(244,67,54,0.1)' : completedToday >= 3 ? 'rgba(255,152,0,0.1)' : 'rgba(76,175,80,0.1)',
                color: completedToday >= 5 ? '#dc2626' : completedToday >= 3 ? '#d97706' : '#3B8C3B',
              }}>
                {completedToday >= 5 ? '🔥 On fire' : completedToday >= 3 ? '⚡ Hot streak' : `✓ ${completedToday} done`}
              </span>
            )}
          </div>

          {/* Task name */}
          <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: labelColor, lineHeight: 1.3 }}>
            "{task.name}"
          </p>

          {/* Meta chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {category.primary !== 'other' && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                background: isDark ? 'rgba(111,175,111,0.15)' : 'rgba(111,175,111,0.12)',
                color: labelColor,
              }}>{category.primary}</span>
            )}
            <span style={{ fontSize: 12, color: mutedColor }}>{remaining} min left</span>
            {attempts >= 2 && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                background: 'rgba(255,152,0,0.1)', color: '#d97706',
              }}>⚠️ {attempts}× rescheduled</span>
            )}
          </div>

          {/* AI summary bar */}
          {topOption && aiRecommendation?.summary && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '10px 12px', borderRadius: 10, marginBottom: 20, textAlign: 'left',
              background: isDark ? 'rgba(111,175,111,0.08)' : 'rgba(111,175,111,0.08)',
              border: `1px solid ${isDark ? 'rgba(111,175,111,0.18)' : 'rgba(59,110,59,0.15)'}`,
            }}>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '2px 5px',
                background: isDark ? '#6FAF6F' : '#3B6E3B', color: '#fff',
                borderRadius: 4, letterSpacing: 0.5, flexShrink: 0, marginTop: 1,
              }}>AI</span>
              <span style={{ fontSize: 12, color: isDark ? '#A8C8A8' : '#3B5E3B', lineHeight: 1.45 }}>
                {aiRecommendation.summary}
              </span>
            </div>
          )}
        </div>

        {/* ── BUTTONS ── */}
        <div style={{ padding: '0 20px 20px' }}>

          {/* Mark complete — primary */}
          <button
            onClick={onComplete}
            className="btn primary"
            style={{
              width: '100%', marginBottom: 10,
              fontSize: 15, fontWeight: 700,
              position: 'relative',
              ...(topOption === 'complete' && {
                boxShadow: '0 0 0 2px rgba(76,175,80,0.4), 0 4px 14px rgba(59,110,59,0.2)',
              }),
            }}
          >
            ✓ Mark complete
            {topOption === 'complete' && <AiBadge />}
          </button>

          {/* 2×2 option grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <OptionTile
              onClick={() => onContinue(continueDuration?.suggestedMinutes > 1 ? continueDuration.suggestedMinutes : 1)}
              isTop={topOption === 'continue'}
              isDark={isDark}
              tileBg={tileBg} tileBorder={tileBorder} tileTopBorder={tileTopBorder}
              titleColor={titleColor} mutedColor={mutedColor}
              emoji="⏱️"
              label="Keep going"
              hint={continueDuration ? `+${continueDuration.suggestedMinutes} min` : '+1 min'}
            />
            <OptionTile
              onClick={() => bestSlot && onLaterToday(bestSlot)}
              isTop={topOption === 'later_today'}
              disabled={!bestSlot}
              isDark={isDark}
              tileBg={tileBg} tileBorder={tileBorder} tileTopBorder={tileTopBorder}
              titleColor={titleColor} mutedColor={mutedColor}
              emoji="🕐"
              label="Later today"
              hint={bestSlot ? `${bestSlot.startTime}${bestSlot.score >= 70 ? ' ★' : ''}` : 'No slots'}
            />
            <OptionTile
              onClick={onTomorrow}
              isTop={topOption === 'tomorrow'}
              warn={urgentLevel === 'overdue' || urgentLevel === 'today'}
              isDark={isDark}
              tileBg={tileBg} tileBorder={tileBorder} tileTopBorder={tileTopBorder}
              titleColor={titleColor} mutedColor={mutedColor}
              emoji="📅"
              label="Tomorrow"
              hint={urgentLevel === 'overdue' || urgentLevel === 'today' ? '⚠️ not ideal' : 'morning'}
            />
            <OptionTile
              onClick={onBackToPool}
              isTop={topOption === 'back_to_pool'}
              isDark={isDark}
              tileBg={tileBg} tileBorder={tileBorder} tileTopBorder={tileTopBorder}
              titleColor={titleColor} mutedColor={mutedColor}
              emoji="🌊"
              label="Back to Pool"
              hint="for later"
            />
          </div>

          {/* Tertiary row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onPickTime}
              className="btn ghost"
              style={{ flex: 1, fontSize: 13, fontWeight: 600 }}
            >
              🎯 Pick a time
            </button>
            {showBreakTask && (
              <button
                onClick={onBreakTask}
                className="btn ghost"
                style={{
                  flex: 1, fontSize: 13, fontWeight: 600,
                  position: 'relative',
                  ...(topOption === 'break_task' && {
                    border: '1.5px solid rgba(76,175,80,0.4)',
                    background: isDark ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.07)',
                  }),
                  ...(!topOption || topOption !== 'break_task' ? {
                    borderStyle: 'dashed',
                    color: '#d97706',
                    borderColor: 'rgba(245,158,11,0.35)',
                    background: isDark ? 'rgba(255,165,0,0.06)' : 'rgba(255,165,0,0.04)',
                  } : {}),
                }}
              >
                🔨 Break it up
                {topOption === 'break_task' && <AiBadge />}
              </button>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          borderTop: `1px solid ${divider}`,
          padding: '10px 20px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={() => setShowDetails(v => !v)}
            style={{
              background: 'none', border: 'none',
              color: mutedColor, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 0',
            }}
          >
            {showDetails ? '▾' : '▸'} AI analysis
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: mutedColor, fontSize: 13,
              cursor: 'pointer', padding: '4px 0',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = titleColor}
            onMouseLeave={e => e.currentTarget.style.color = mutedColor}
          >
            Cancel
          </button>
        </div>

        {/* ── DETAILS PANEL ── */}
        {showDetails && (
          <div style={{
            margin: '0 20px 20px',
            padding: 14,
            background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
            borderRadius: 12,
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* Completion probability */}
            {completionProb && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 6 }}>
                  Completion Probability
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{
                    flex: 1, height: 5, borderRadius: 3,
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
                  <span style={{ fontSize: 12, fontWeight: 700, color: titleColor, flexShrink: 0 }}>
                    {Math.round(completionProb.probability * 100)}% — {completionProb.label}
                  </span>
                </div>
                {completionProb.factors?.slice(0, 4).map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{
                      width: 28, height: 3, borderRadius: 2,
                      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      <div style={{
                        width: `${Math.round(f.value * 100)}%`, height: '100%',
                        borderRadius: 2,
                        background: f.value >= 0.6 ? '#4CAF50' : f.value >= 0.4 ? '#FF9800' : '#F44336',
                      }} />
                    </div>
                    <span style={{ fontSize: 10, color: mutedColor }}>{f.name}: {f.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Procrastination */}
            {procrastination && procrastination.severity !== 'none' && procrastination.severity !== 'mild' && (
              <div style={{
                padding: '8px 10px', borderRadius: 8, marginBottom: 10,
                background: procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.07)' : 'rgba(255,152,0,0.07)',
                border: `1px solid ${procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.2)' : 'rgba(255,152,0,0.2)'}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2, color: procrastination.severity === 'chronic' ? '#dc2626' : '#d97706' }}>
                  {procrastination.severity === 'chronic' ? '🚫 Chronic Avoidance' : procrastination.severity === 'severe' ? '⚡ Strong Avoidance' : '🔄 Building Avoidance'}
                  <span style={{ fontWeight: 400, opacity: 0.6, marginLeft: 5 }}>{procrastination.score}/100</span>
                </div>
                {procrastination.interventions[0] && (
                  <div style={{ fontSize: 10, color: labelColor }}>Tip: {procrastination.interventions[0].label}</div>
                )}
              </div>
            )}

            {/* Option ranking */}
            {rankedOptions.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 6 }}>
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
                    <span style={{ fontSize: 10, color: mutedColor, minWidth: 24, textAlign: 'right', fontWeight: i === 0 ? 700 : 400 }}>
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

// ── Shared sub-components ────────────────────────────────────────────────────

function AiBadge() {
  return (
    <span style={{
      position: 'absolute', top: -6, right: -6,
      fontSize: 9, fontWeight: 800, padding: '2px 5px',
      background: '#4CAF50', color: '#fff',
      borderRadius: 5, boxShadow: '0 1px 4px rgba(76,175,80,0.35)',
      letterSpacing: 0.3,
    }}>AI ✦</span>
  );
}

function OptionTile({ onClick, isTop, disabled, warn, isDark, tileBg, tileBorder, tileTopBorder, titleColor, mutedColor, emoji, label, hint }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: isTop
          ? (isDark ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.08)')
          : tileBg,
        border: `1.5px solid ${isTop ? tileTopBorder : warn ? 'rgba(245,158,11,0.35)' : tileBorder}`,
        borderRadius: 12,
        padding: '11px 6px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 3, minHeight: 70,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        position: 'relative',
        transition: 'opacity 0.15s, transform 0.1s',
        boxShadow: isTop
          ? `0 0 0 1px ${isDark ? 'rgba(111,175,111,0.2)' : 'rgba(76,175,80,0.15)'}`
          : 'none',
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: titleColor, lineHeight: 1.2 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: warn ? '#d97706' : mutedColor, lineHeight: 1.2 }}>
        {hint}
      </span>
      {isTop && <AiBadge />}
    </button>
  );
}
