import { useState, useEffect } from "react";
import { getDeadlineUrgency } from "../../utils/scheduler";
import { getRescheduleOptionFrequencies } from "../../utils/analytics";
import {
  generateSmartRecommendation,
  categorizeTask,
} from "../../utils/smartReschedule";
import "../../App.css";

const SLIDE_UP_CSS = `
@keyframes slideUpSheet {
  from { transform: translateY(60px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
`;

const CAT_EMOJI = {
  coding: '💻', meetings: '🤝', creative: '🎨',
  email: '📧', admin: '📋', health: '🏃',
  learning: '📚', personal: '🌱',
};

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
  onClose,
}) {
  const [aiRec, setAiRec] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 640px)').matches
  );

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const h = e => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

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
      setAiRec(rec);
    } catch (e) {
      console.error('Smart recommendation failed', e);
    }
  }, [task, availability, existingTasks]);

  if (!task) return null;

  const attempts      = task.attempts || 0;
  const remaining     = task.remaining || task.duration;
  const urgency       = getDeadlineUrgency(task);
  const category      = categorizeTask(task.name);
  const urgentLevel   = urgency?.level;
  const showUrgency   = urgentLevel === 'overdue' || urgentLevel === 'today' || urgentLevel === 'tomorrow';

  const procrastination = aiRec?.analysis?.procrastination;
  const completionProb  = aiRec?.analysis?.completionProbability;
  const bestSlot        = aiRec?.analysis?.bestSlot;
  const continueDur     = aiRec?.analysis?.continueDuration;
  const rankedOptions   = aiRec?.ranked || [];
  const topOption       = aiRec?.primary?.option;
  const completedToday  = (existingTasks || []).filter(t => t.completed).length;

  const showBreakTask = attempts >= 2 ||
    (task.duration || 0) >= 60 ||
    (procrastination && procrastination.severity !== 'none');

  // ── tokens ──────────────────────────────────────────────────────────────────
  const cardBg    = isDark ? '#242B24' : '#ffffff';
  const titleCol  = isDark ? '#E8F0E8' : '#0F2B0F';
  const labelCol  = isDark ? '#8BC98B' : '#2E5E2E';
  const mutedCol  = isDark ? '#7A8A7A' : '#7A947A';
  const divider   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const chipBg    = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';

  const taskEmoji = CAT_EMOJI[category?.primary] || '⏰';
  const px        = isMobile ? 16 : 22;

  // ── sheet styles ─────────────────────────────────────────────────────────────
  const sheetStyle = isMobile
    ? {
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: cardBg,
        borderRadius: '24px 24px 0 0',
        maxHeight: '92dvh',
        overflowY: 'auto',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        animation: 'slideUpSheet 0.32s cubic-bezier(0.32,0.72,0,1)',
        boxShadow: isDark
          ? '0 -24px 70px rgba(0,0,0,0.6)'
          : '0 -12px 48px rgba(0,0,0,0.16)',
      }
    : {
        background: cardBg,
        borderRadius: 24,
        width: '100%', maxWidth: 430,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: isDark
          ? '0 32px 80px rgba(0,0,0,0.6)'
          : '0 24px 64px rgba(0,0,0,0.18)',
        animation: 'scaleIn 0.28s cubic-bezier(0.34,1.2,0.64,1)',
      };

  return (
    <>
      <style>{SLIDE_UP_CSS}</style>

      {/* backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.48)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.18s ease-out',
          padding: isMobile ? 0 : 16,
        }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div className="reschedule-modal" style={sheetStyle}>

          {/* ── drag handle ─────────────────────────────────────────────────── */}
          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 6px' }}>
              <div style={{
                width: 40, height: 4, borderRadius: 2,
                background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              }} />
            </div>
          )}

          {/* ── HEADER ──────────────────────────────────────────────────────── */}
          <div style={{ padding: `${isMobile ? 12 : 24}px ${px}px 0` }}>

            {/* top row: icon + badges */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 }}>
              {/* category icon bubble */}
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: isDark ? 'rgba(111,175,111,0.14)' : 'rgba(59,110,59,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                {taskEmoji}
              </div>

              {/* badges */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', paddingTop: 2 }}>
                {completedToday >= 1 && (
                  <Pill
                    color={completedToday >= 5 ? '#ef4444' : completedToday >= 3 ? '#d97706' : '#16a34a'}
                    bg={completedToday >= 5 ? 'rgba(239,68,68,0.1)' : completedToday >= 3 ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)'}
                  >
                    {completedToday >= 5 ? '🔥 On fire' : completedToday >= 3 ? '⚡ Streak' : `✓ ${completedToday} done`}
                  </Pill>
                )}
                {showUrgency && (
                  <Pill
                    color={urgentLevel === 'overdue' ? '#ef4444' : '#d97706'}
                    bg={urgentLevel === 'overdue' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'}
                  >
                    {urgentLevel === 'overdue' ? '🚨 Overdue' : `⏰ ${urgency.message}`}
                  </Pill>
                )}
              </div>
            </div>

            {/* title block + meta chips inline */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: aiRec?.summary ? 14 : 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: mutedCol, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 }}>
                  Time's up
                </div>
                <div style={{
                  fontSize: isMobile ? 20 : 22, fontWeight: 900,
                  color: titleCol, lineHeight: 1.25, wordBreak: 'break-word',
                }}>
                  {task.name}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0, paddingTop: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: mutedCol, background: chipBg, padding: '3px 9px', borderRadius: 7 }}>
                  {remaining} min left
                </span>
                {attempts >= 2 && (
                  <span style={{ fontSize: 12, fontWeight: 600, background: 'rgba(245,158,11,0.1)', color: '#b45309', padding: '3px 9px', borderRadius: 7 }}>
                    ↩ {attempts}× rescheduled
                  </span>
                )}
                {category.primary !== 'other' && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: labelCol, background: isDark ? 'rgba(111,175,111,0.12)' : 'rgba(59,110,59,0.07)', padding: '3px 9px', borderRadius: 7 }}>
                    {category.primary}
                  </span>
                )}
                {completionProb && (
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 7,
                    color: completionProb.probability >= 0.6 ? '#16a34a' : completionProb.probability >= 0.4 ? '#b45309' : '#dc2626',
                    background: completionProb.probability >= 0.6 ? 'rgba(34,197,94,0.1)' : completionProb.probability >= 0.4 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  }}>
                    {Math.round(completionProb.probability * 100)}% likely
                  </span>
                )}
                {procrastination && procrastination.severity !== 'none' && procrastination.severity !== 'mild' && (
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 7,
                    color: procrastination.severity === 'chronic' ? '#dc2626' : '#d97706',
                    background: procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.1)' : 'rgba(255,152,0,0.1)',
                  }}>
                    {procrastination.severity === 'chronic' ? '🚫 Avoided' : procrastination.severity === 'severe' ? '⚡ Avoiding' : '🔄 Drifting'}
                  </span>
                )}
              </div>
            </div>

            {/* AI hint bar */}
            {aiRec?.summary && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 11, marginBottom: 20,
                background: isDark ? 'rgba(111,175,111,0.07)' : 'rgba(59,110,59,0.05)',
                border: `1px solid ${isDark ? 'rgba(111,175,111,0.16)' : 'rgba(59,110,59,0.12)'}`,
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                  background: labelCol, color: '#fff',
                  padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                }}>AI</span>
                <span style={{ fontSize: 12, color: isDark ? '#A8C8A8' : '#2E5E2E', lineHeight: 1.45 }}>
                  {aiRec.summary}
                </span>
              </div>
            )}
          </div>

          {/* ── ACTIONS ─────────────────────────────────────────────────────── */}
          <div style={{ padding: `0 ${px}px 18px` }}>

            {/* Mark complete — hero CTA */}
            <BigCompleteBtn
              onClick={onComplete}
              isTop={topOption === 'complete'}
              isDark={isDark}
              labelCol={labelCol}
            />

            {/* 2 × 2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <ActionTile
                onClick={() => onContinue(continueDur?.suggestedMinutes > 1 ? continueDur.suggestedMinutes : 1)}
                isTop={topOption === 'continue'}
                isDark={isDark} labelCol={labelCol} titleCol={titleCol} mutedCol={mutedCol}
                emoji="⏱️" label="Keep going"
                hint={continueDur ? `+${continueDur.suggestedMinutes} min` : '+1 min'}
              />
              <ActionTile
                onClick={() => bestSlot && onLaterToday(bestSlot)}
                isTop={topOption === 'later_today'}
                disabled={!bestSlot}
                isDark={isDark} labelCol={labelCol} titleCol={titleCol} mutedCol={mutedCol}
                emoji="🕐" label="Later today"
                hint={bestSlot ? `${bestSlot.startTime}${bestSlot.score >= 70 ? ' ★' : ''}` : 'No slots'}
              />
              <ActionTile
                onClick={onTomorrow}
                isTop={topOption === 'tomorrow'}
                warn={urgentLevel === 'overdue' || urgentLevel === 'today'}
                isDark={isDark} labelCol={labelCol} titleCol={titleCol} mutedCol={mutedCol}
                emoji="📅" label="Tomorrow"
                hint={urgentLevel === 'overdue' || urgentLevel === 'today' ? '⚠ not ideal' : 'next morning'}
              />
              <ActionTile
                onClick={onBackToPool}
                isTop={topOption === 'back_to_pool'}
                isDark={isDark} labelCol={labelCol} titleCol={titleCol} mutedCol={mutedCol}
                emoji="🌊" label="Back to Pool"
                hint="save for later"
              />
            </div>

            {/* tertiary row */}
            <div style={{ display: 'flex', gap: 8 }}>
              <GhostBtn onClick={onPickTime} isDark={isDark} mutedCol={mutedCol} labelCol={labelCol}>
                🎯 Pick a time
              </GhostBtn>
              {showBreakTask && (
                <GhostBtn
                  onClick={onBreakTask}
                  isDark={isDark} mutedCol={mutedCol} labelCol={labelCol}
                  accent={topOption === 'break_task'}
                  aiBadge={topOption === 'break_task'}
                >
                  🔨 Break it up
                </GhostBtn>
              )}
            </div>
          </div>

          {/* ── FOOTER ──────────────────────────────────────────────────────── */}
          <div style={{
            borderTop: `1px solid ${divider}`,
            padding: `10px ${px}px ${isMobile ? 12 : 16}px`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{
                background: 'none', border: 'none',
                color: mutedCol, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 0',
              }}
            >
              {showDetails ? '▾' : '▸'} AI analysis
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', color: mutedCol,
                fontSize: 13, cursor: 'pointer', padding: '4px 10px', borderRadius: 6,
              }}
              onMouseEnter={e => e.currentTarget.style.color = titleCol}
              onMouseLeave={e => e.currentTarget.style.color = mutedCol}
            >
              Cancel
            </button>
          </div>

          {/* ── AI DETAILS ──────────────────────────────────────────────────── */}
          {showDetails && (
            <div style={{
              margin: `0 ${px}px 20px`,
              padding: 14,
              background: isDark ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.02)',
              borderRadius: 12,
              animation: 'fadeIn 0.2s ease-out',
            }}>
              {completionProb && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: labelCol, marginBottom: 6 }}>
                    Completion probability
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
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
                    <span style={{ fontSize: 12, fontWeight: 700, color: titleCol, flexShrink: 0 }}>
                      {Math.round(completionProb.probability * 100)}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: mutedCol }}>{completionProb.label}</div>
                </div>
              )}

              {procrastination && procrastination.severity !== 'none' && procrastination.severity !== 'mild' && (
                <div style={{
                  padding: '8px 10px', borderRadius: 8, marginBottom: 10,
                  background: procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.07)' : 'rgba(255,152,0,0.07)',
                  border: `1px solid ${procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.2)' : 'rgba(255,152,0,0.2)'}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 3, color: procrastination.severity === 'chronic' ? '#dc2626' : '#d97706' }}>
                    {procrastination.severity === 'chronic' ? '🚫 Chronic Avoidance' : procrastination.severity === 'severe' ? '⚡ Strong Avoidance' : '🔄 Building Avoidance'}
                  </div>
                  {procrastination.interventions?.[0] && (
                    <div style={{ fontSize: 10, color: labelCol }}>Tip: {procrastination.interventions[0].label}</div>
                  )}
                </div>
              )}

              {rankedOptions.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: labelCol, marginBottom: 6 }}>Option ranking</div>
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
                      <span style={{ fontSize: 10, color: mutedCol, minWidth: 24, textAlign: 'right', fontWeight: i === 0 ? 700 : 400 }}>
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
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Pill({ children, color, bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 9px',
      borderRadius: 99, color, background: bg,
    }}>
      {children}
    </span>
  );
}

function BigCompleteBtn({ onClick, isTop, isDark, labelCol }) {
  const grad = isDark
    ? 'linear-gradient(135deg, #2E5A2E, #4A9B4A)'
    : 'linear-gradient(135deg, #2D622D, #4A9B4A)';
  const shadow = isTop
    ? '0 4px 22px rgba(59,110,59,0.45), 0 0 0 3px rgba(111,175,111,0.28)'
    : '0 2px 12px rgba(59,110,59,0.25)';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', height: 54,
        background: grad,
        color: '#fff',
        border: isTop ? '2px solid rgba(255,255,255,0.22)' : '2px solid transparent',
        borderRadius: 15,
        fontSize: 16, fontWeight: 800,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        marginBottom: 10,
        boxShadow: shadow,
        transition: 'transform 0.1s, box-shadow 0.15s',
        position: 'relative',
        letterSpacing: 0.2,
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ fontSize: 19 }}>✓</span>
      Mark complete
      {isTop && (
        <span style={{
          position: 'absolute', top: -7, right: -7,
          fontSize: 9, fontWeight: 800, padding: '2px 6px',
          background: '#fff', color: '#2D622D',
          borderRadius: 6, boxShadow: '0 1px 6px rgba(0,0,0,0.15)',
          letterSpacing: 0.5,
        }}>AI ✦</span>
      )}
    </button>
  );
}

function ActionTile({ onClick, isTop, disabled, warn, isDark, labelCol, titleCol, mutedCol, emoji, label, hint }) {
  const border = isTop
    ? `1.5px solid ${isDark ? 'rgba(111,175,111,0.45)' : 'rgba(59,110,59,0.38)'}`
    : warn
    ? '1.5px solid rgba(245,158,11,0.3)'
    : `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)'}`;

  const bg = isTop
    ? (isDark ? 'rgba(111,175,111,0.11)' : 'rgba(59,110,59,0.06)')
    : warn
    ? (isDark ? 'rgba(245,158,11,0.07)' : 'rgba(245,158,11,0.05)')
    : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)');

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg, border,
        borderRadius: 14,
        padding: '14px 8px 12px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4, minHeight: 82,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        position: 'relative',
        transition: 'transform 0.1s',
        boxShadow: isTop
          ? `0 2px 10px ${isDark ? 'rgba(0,0,0,0.25)' : 'rgba(59,110,59,0.08)'}`
          : 'none',
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.95)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.95)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: isTop ? labelCol : titleCol, lineHeight: 1.2 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: warn ? '#b45309' : mutedCol, lineHeight: 1.2 }}>
        {hint}
      </span>
      {isTop && (
        <span style={{
          position: 'absolute', top: -7, right: -7,
          fontSize: 9, fontWeight: 800, padding: '2px 5px',
          background: isDark ? '#5aA05A' : '#3B6E3B', color: '#fff',
          borderRadius: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          letterSpacing: 0.3,
        }}>AI ✦</span>
      )}
    </button>
  );
}

function GhostBtn({ onClick, isDark, mutedCol, labelCol, accent, aiBadge, children }) {
  const borderStyle = accent ? '1.5px solid rgba(234,88,12,0.38)' : `1.5px dashed ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`;
  const color = accent ? '#ea580c' : mutedCol;
  const bg = accent
    ? (isDark ? 'rgba(234,88,12,0.1)' : 'rgba(234,88,12,0.06)')
    : 'transparent';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, height: 42,
        background: bg, border: borderStyle, borderRadius: 11,
        color, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        transition: 'border-color 0.15s, color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!accent) {
          e.currentTarget.style.borderColor = labelCol;
          e.currentTarget.style.color = labelCol;
        }
      }}
      onMouseLeave={e => {
        if (!accent) {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
          e.currentTarget.style.color = mutedCol;
        }
      }}
    >
      {children}
      {aiBadge && (
        <span style={{
          position: 'absolute', top: -7, right: -7,
          fontSize: 9, fontWeight: 800, padding: '2px 5px',
          background: '#ea580c', color: '#fff',
          borderRadius: 5, letterSpacing: 0.3,
        }}>AI ✦</span>
      )}
    </button>
  );
}
