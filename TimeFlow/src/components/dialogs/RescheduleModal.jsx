import { useState, useEffect } from "react";
import { getDeadlineUrgency } from "../../utils/scheduler";
import {
  generateSmartRecommendation,
  categorizeTask,
} from "../../utils/smartReschedule";
import "../../App.css";

const ANIM_CSS = `
@keyframes slideUpSheet {
  from { transform: translateY(60px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
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

  const procrastination = aiRec?.analysis?.procrastination;
  const completionProb  = aiRec?.analysis?.completionProbability;
  const bestSlot        = aiRec?.analysis?.bestSlot;
  const continueDur     = aiRec?.analysis?.continueDuration;
  const rankedOptions   = aiRec?.ranked || [];
  const topOption       = aiRec?.primary?.option;

  const showBreakTask = attempts >= 2 ||
    (task.duration || 0) >= 60 ||
    (procrastination && procrastination.severity !== 'none');

  // ── colors ────────────────────────────────────────────────────────────────
  const bg       = isDark ? '#1E241E' : '#FAFCFA';
  const cardBg   = isDark ? '#262E26' : '#ffffff';
  const titleCol = isDark ? '#E8F0E8' : '#0F2B0F';
  const labelCol = isDark ? '#8BC98B' : '#2E5E2E';
  const mutedCol = isDark ? '#7A8A7A' : '#7A947A';
  const divider  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const chipBg   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const chipBrd  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const taskEmoji = CAT_EMOJI[category?.primary] || '⏰';
  const px = isMobile ? 18 : 24;

  // probability bar color
  const probCol = completionProb
    ? completionProb.probability >= 0.6 ? '#4CAF50'
      : completionProb.probability >= 0.4 ? '#F59E0B' : '#EF4444'
    : '#888';

  // ── sheet ─────────────────────────────────────────────────────────────────
  const sheetStyle = isMobile
    ? {
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: bg,
        borderRadius: '22px 22px 0 0',
        maxHeight: '94dvh', overflowY: 'auto',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        animation: 'slideUpSheet 0.3s cubic-bezier(0.32,0.72,0,1)',
        boxShadow: isDark ? '0 -20px 60px rgba(0,0,0,0.55)' : '0 -10px 40px rgba(0,0,0,0.12)',
      }
    : {
        background: bg,
        borderRadius: 22,
        width: '100%', maxWidth: 400,
        maxHeight: '88vh', overflowY: 'auto',
        boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.55)' : '0 20px 56px rgba(0,0,0,0.14)',
        animation: 'scaleIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
      };

  return (
    <>
      <style>{ANIM_CSS}</style>

      {/* backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.15s ease-out',
          padding: isMobile ? 0 : 16,
        }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div style={sheetStyle}>

          {/* drag handle */}
          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
              }} />
            </div>
          )}

          {/* ─── HEADER ───────────────────────────────────────────────────── */}
          <div style={{ padding: `${isMobile ? 14 : 26}px ${px}px 0` }}>

            {/* label row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 20 }}>{taskEmoji}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
                  textTransform: 'uppercase', color: mutedCol,
                }}>Time's up</span>
              </div>

              {/* close X */}
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: mutedCol, fontSize: 18, lineHeight: 1,
                  padding: '4px 6px', borderRadius: 8,
                }}
              >
                ✕
              </button>
            </div>

            {/* task name */}
            <div style={{
              fontSize: isMobile ? 20 : 22, fontWeight: 800,
              color: titleCol, lineHeight: 1.3, marginBottom: 12,
              wordBreak: 'break-word',
            }}>
              {task.name}
            </div>

            {/* chip row - horizontal, wrapping */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16,
            }}>
              <Chip isDark={isDark}>{remaining} min left</Chip>
              {category.primary !== 'other' && (
                <Chip isDark={isDark} accent>{category.primary}</Chip>
              )}
              {attempts >= 2 && (
                <Chip isDark={isDark} warn>↩ {attempts}× rescheduled</Chip>
              )}
              {(urgentLevel === 'overdue' || urgentLevel === 'today') && (
                <Chip isDark={isDark} danger>
                  {urgentLevel === 'overdue' ? 'Overdue' : 'Due today'}
                </Chip>
              )}
              {urgentLevel === 'tomorrow' && (
                <Chip isDark={isDark} warn>Due tomorrow</Chip>
              )}
            </div>

            {/* completion probability bar */}
            {completionProb && (
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: mutedCol }}>
                    Completion likelihood
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: probCol }}>
                    {Math.round(completionProb.probability * 100)}% — {completionProb.label}
                  </span>
                </div>
                <div style={{
                  height: 4, borderRadius: 2, width: '100%',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${Math.round(completionProb.probability * 100)}%`,
                    height: '100%', borderRadius: 2,
                    background: probCol,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            )}

            {/* AI summary */}
            {aiRec?.summary && (
              <div style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '10px 12px', borderRadius: 10, marginBottom: 18,
                background: isDark ? 'rgba(111,175,111,0.06)' : 'rgba(46,94,46,0.04)',
                border: `1px solid ${isDark ? 'rgba(111,175,111,0.12)' : 'rgba(46,94,46,0.08)'}`,
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 800, letterSpacing: 0.5,
                  background: labelCol, color: '#fff',
                  padding: '2px 5px', borderRadius: 3, flexShrink: 0, marginTop: 1,
                }}>AI</span>
                <span style={{ fontSize: 12, color: isDark ? '#A8C8A8' : '#2E5E2E', lineHeight: 1.5 }}>
                  {aiRec.summary}
                </span>
              </div>
            )}

            {/* procrastination warning */}
            {procrastination && procrastination.severity !== 'none' && procrastination.severity !== 'mild' && (
              <div style={{
                padding: '8px 12px', borderRadius: 9, marginBottom: 16,
                background: procrastination.severity === 'chronic'
                  ? (isDark ? 'rgba(220,38,38,0.08)' : 'rgba(220,38,38,0.04)')
                  : (isDark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.04)'),
                border: `1px solid ${procrastination.severity === 'chronic'
                  ? 'rgba(220,38,38,0.15)' : 'rgba(245,158,11,0.15)'}`,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, marginBottom: 2,
                  color: procrastination.severity === 'chronic' ? '#dc2626' : '#d97706',
                }}>
                  {procrastination.severity === 'chronic' ? 'Chronic avoidance detected'
                    : procrastination.severity === 'severe' ? 'Strong avoidance pattern'
                    : 'Avoidance building'}
                </div>
                {procrastination.interventions?.[0] && (
                  <div style={{ fontSize: 11, color: mutedCol }}>
                    {procrastination.interventions[0].reason}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── ACTIONS ──────────────────────────────────────────────────── */}
          <div style={{ padding: `0 ${px}px 20px` }}>

            {/* Mark complete */}
            <CompleteBtn
              onClick={onComplete}
              isTop={topOption === 'complete'}
              isDark={isDark}
            />

            {/* 2x2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <Tile
                onClick={() => onContinue(continueDur?.suggestedMinutes > 1 ? continueDur.suggestedMinutes : 1)}
                isTop={topOption === 'continue'}
                isDark={isDark} titleCol={titleCol} mutedCol={mutedCol} labelCol={labelCol}
                emoji="⏱️" label="Keep going"
                hint={continueDur ? `+${continueDur.suggestedMinutes} min` : '+1 min'}
              />
              <Tile
                onClick={() => bestSlot && onLaterToday(bestSlot)}
                isTop={topOption === 'later_today'}
                disabled={!bestSlot}
                isDark={isDark} titleCol={titleCol} mutedCol={mutedCol} labelCol={labelCol}
                emoji="🕐" label="Later today"
                hint={bestSlot ? `${bestSlot.startTime}${bestSlot.score >= 70 ? ' ★' : ''}` : 'No slots'}
              />
              <Tile
                onClick={onTomorrow}
                isTop={topOption === 'tomorrow'}
                warn={urgentLevel === 'overdue' || urgentLevel === 'today'}
                isDark={isDark} titleCol={titleCol} mutedCol={mutedCol} labelCol={labelCol}
                emoji="📅" label="Tomorrow"
                hint={urgentLevel === 'overdue' || urgentLevel === 'today' ? '⚠ risky' : 'fresh start'}
              />
              <Tile
                onClick={onBackToPool}
                isTop={topOption === 'back_to_pool'}
                isDark={isDark} titleCol={titleCol} mutedCol={mutedCol} labelCol={labelCol}
                emoji="🌊" label="Back to Pool"
                hint="save for later"
              />
            </div>

            {/* tertiary */}
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryBtn onClick={onPickTime} isDark={isDark} mutedCol={mutedCol} labelCol={labelCol}>
                🎯 Pick a time
              </SecondaryBtn>
              {showBreakTask && (
                <SecondaryBtn
                  onClick={onBreakTask}
                  isDark={isDark} mutedCol={mutedCol} labelCol={labelCol}
                  highlight={topOption === 'break_task'}
                >
                  🔨 Break it up
                </SecondaryBtn>
              )}
            </div>
          </div>

          {/* ─── FOOTER ───────────────────────────────────────────────────── */}
          <div style={{
            borderTop: `1px solid ${divider}`,
            padding: `8px ${px}px ${isMobile ? 10 : 14}px`,
          }}>
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{
                background: 'none', border: 'none',
                color: mutedCol, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 0',
              }}
            >
              {showDetails ? '▾' : '▸'} AI analysis
            </button>

            {/* expanded details */}
            {showDetails && (
              <div style={{
                marginTop: 8, padding: 12,
                background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
                borderRadius: 10,
                animation: 'fadeIn 0.18s ease-out',
              }}>
                {/* factor list */}
                {completionProb?.factors?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: labelCol, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                      Probability factors
                    </div>
                    {completionProb.factors.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '3px 0', fontSize: 11, color: mutedCol,
                      }}>
                        <span>{f.name}</span>
                        <span style={{ fontWeight: 600, color: titleCol }}>
                          {Math.round(f.value * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* option ranking */}
                {rankedOptions.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: labelCol, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                      Option ranking
                    </div>
                    {rankedOptions.slice(0, 5).map((opt, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 5,
                      }}>
                        <span style={{ fontSize: 12, width: 18, textAlign: 'center' }}>{opt.icon}</span>
                        <div style={{
                          flex: 1, height: 4, borderRadius: 2,
                          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${opt.score}%`, height: '100%', borderRadius: 2,
                            background: i === 0 ? '#4CAF50' : (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)'),
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 10, color: i === 0 ? titleCol : mutedCol,
                          minWidth: 22, textAlign: 'right',
                          fontWeight: i === 0 ? 700 : 400,
                        }}>
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
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────────

function Chip({ children, isDark, accent, warn, danger }) {
  let color = isDark ? '#9CA59C' : '#6B7B6B';
  let bgColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  let border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  if (accent) {
    color = isDark ? '#8BC98B' : '#2E5E2E';
    bgColor = isDark ? 'rgba(111,175,111,0.1)' : 'rgba(46,94,46,0.06)';
    border = isDark ? 'rgba(111,175,111,0.18)' : 'rgba(46,94,46,0.12)';
  } else if (warn) {
    color = '#b45309';
    bgColor = 'rgba(245,158,11,0.08)';
    border = 'rgba(245,158,11,0.18)';
  } else if (danger) {
    color = '#dc2626';
    bgColor = 'rgba(220,38,38,0.08)';
    border = 'rgba(220,38,38,0.18)';
  }

  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 10px',
      borderRadius: 6, color, background: bgColor,
      border: `1px solid ${border}`,
      lineHeight: 1.3,
    }}>
      {children}
    </span>
  );
}

function CompleteBtn({ onClick, isTop, isDark }) {
  const grad = isDark
    ? 'linear-gradient(135deg, #2E5A2E, #4A9B4A)'
    : 'linear-gradient(135deg, #2D622D, #4A9B4A)';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', height: 50,
        background: grad, color: '#fff',
        border: isTop ? '2px solid rgba(255,255,255,0.2)' : '2px solid transparent',
        borderRadius: 14,
        fontSize: 15, fontWeight: 700,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginBottom: 10,
        boxShadow: isTop
          ? '0 4px 18px rgba(59,110,59,0.4), 0 0 0 2px rgba(111,175,111,0.25)'
          : '0 2px 10px rgba(59,110,59,0.2)',
        transition: 'transform 0.1s',
        position: 'relative',
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      ✓ Mark complete
      {isTop && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          fontSize: 8, fontWeight: 800, padding: '2px 5px',
          background: '#fff', color: '#2D622D',
          borderRadius: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          letterSpacing: 0.4,
        }}>AI</span>
      )}
    </button>
  );
}

function Tile({ onClick, isTop, disabled, warn, isDark, titleCol, mutedCol, labelCol, emoji, label, hint }) {
  const borderColor = isTop
    ? (isDark ? 'rgba(111,175,111,0.4)' : 'rgba(59,110,59,0.3)')
    : warn
    ? 'rgba(245,158,11,0.25)'
    : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)');

  const tileBg = isTop
    ? (isDark ? 'rgba(111,175,111,0.08)' : 'rgba(59,110,59,0.04)')
    : warn
    ? (isDark ? 'rgba(245,158,11,0.05)' : 'rgba(245,158,11,0.03)')
    : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)');

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: tileBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 12,
        padding: '14px 8px 12px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 3, minHeight: 78,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        position: 'relative',
        transition: 'transform 0.1s',
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
      <span style={{
        fontSize: 13, fontWeight: 700,
        color: isTop ? labelCol : titleCol, lineHeight: 1.2,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 11, color: warn ? '#b45309' : mutedCol, lineHeight: 1.2,
      }}>
        {hint}
      </span>
      {isTop && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          fontSize: 8, fontWeight: 800, padding: '2px 5px',
          background: isDark ? '#5aA05A' : '#3B6E3B', color: '#fff',
          borderRadius: 5, boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          letterSpacing: 0.3,
        }}>AI</span>
      )}
    </button>
  );
}

function SecondaryBtn({ onClick, isDark, mutedCol, labelCol, highlight, children }) {
  const borderStyle = highlight
    ? '1.5px solid rgba(234,88,12,0.3)'
    : `1.5px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`;
  const color = highlight ? '#ea580c' : mutedCol;
  const bgStyle = highlight
    ? (isDark ? 'rgba(234,88,12,0.08)' : 'rgba(234,88,12,0.04)')
    : 'transparent';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, height: 40,
        background: bgStyle, border: borderStyle, borderRadius: 10,
        color, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        transition: 'border-color 0.15s, color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!highlight) {
          e.currentTarget.style.borderColor = labelCol;
          e.currentTarget.style.color = labelCol;
        }
      }}
      onMouseLeave={e => {
        if (!highlight) {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
          e.currentTarget.style.color = mutedCol;
        }
      }}
    >
      {children}
      {highlight && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          fontSize: 8, fontWeight: 800, padding: '2px 5px',
          background: '#ea580c', color: '#fff',
          borderRadius: 5, letterSpacing: 0.3,
        }}>AI</span>
      )}
    </button>
  );
}
