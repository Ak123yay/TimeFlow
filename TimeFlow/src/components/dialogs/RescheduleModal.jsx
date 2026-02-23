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
@keyframes aiPulse {
  0%   { box-shadow: 0 0 0 0 rgba(110,175,110,0); }
  50%  { box-shadow: 0 0 0 6px rgba(110,175,110,0.12); }
  100% { box-shadow: 0 0 0 0 rgba(110,175,110,0); }
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
`;

const CAT_EMOJI = {
  coding: '💻', meetings: '🤝', creative: '🎨',
  email: '📧', admin: '📋', health: '🏃',
  learning: '📚', personal: '🌱',
};

// Material-style icon using emoji fallbacks
const TILE_ICONS = {
  continue: { icon: '▶', label: 'Continue' },
  later_today: { icon: '🕐', label: 'Later Today' },
  tomorrow: { icon: '📅', label: 'Tomorrow' },
  back_to_pool: { icon: '📥', label: 'Back to Pool' },
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
  const [isDark, setIsDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 640px)');
    const hMobile = e => setIsMobile(e.matches);
    mqMobile.addEventListener('change', hMobile);
    return () => mqMobile.removeEventListener('change', hMobile);
  }, []);

  useEffect(() => {
    const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
    const hDark = e => setIsDark(e.matches);
    mqDark.addEventListener('change', hDark);
    return () => mqDark.removeEventListener('change', hDark);
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

  const attempts = task.attempts || 0;
  const remaining = task.remaining || task.duration;
  const urgency = getDeadlineUrgency(task);
  const category = categorizeTask(task.name);
  const urgentLevel = urgency?.level;

  const procrastination = aiRec?.analysis?.procrastination;
  const completionProb = aiRec?.analysis?.completionProbability;
  const bestSlot = aiRec?.analysis?.bestSlot;
  const continueDur = aiRec?.analysis?.continueDuration;
  const rankedOptions = aiRec?.ranked || [];
  const topOption = aiRec?.primary?.option;

  const showBreakTask = attempts >= 2 ||
    (task.duration || 0) >= 60 ||
    (procrastination && procrastination.severity !== 'none');

  // ── derived AI labels ──────────────────────────────────────────────────────
  const probPct = completionProb ? Math.round(completionProb.probability * 100) : null;
  const probCol = completionProb
    ? completionProb.probability >= 0.6 ? '#4CAF50'
      : completionProb.probability >= 0.4 ? '#F59E0B' : '#EF4444'
    : '#888';

  const procLabel = procrastination
    ? { none: 'None', mild: 'Mild', moderate: 'Moderate', severe: 'Severe', chronic: 'Chronic' }[procrastination.severity] || 'Unknown'
    : null;
  const procColor = procrastination
    ? { none: '#4CAF50', mild: '#8BC98B', moderate: '#F59E0B', severe: '#EF4444', chronic: '#DC2626' }[procrastination.severity] || '#888'
    : '#888';

  const catLabel = category?.primary && category.primary !== 'other' ? category.primary : null;
  const taskEmoji = CAT_EMOJI[category?.primary] || '⏰';

  // ── theme palette ──────────────────────────────────────────────────────────
  const glassBg = isDark
    ? 'linear-gradient(180deg, rgba(28,36,28,0.97) 0%, rgba(18,22,18,0.99) 100%)'
    : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,250,245,1) 100%)';
  const surface = isDark
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(0,0,0,0.03)';
  const border = isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(0,0,0,0.08)';
  const greenBorder = isDark
    ? 'rgba(110,175,110,0.38)'
    : 'rgba(59,110,59,0.35)';
  const textPrimary = isDark ? '#E8F0E8' : '#0F2B0F';
  const textMuted = isDark ? '#7A8A7A' : '#6B8070';
  const green = isDark ? '#6FAF6F' : '#3B7A3B';
  const greenDark = isDark ? '#4e8f4e' : '#2D622D';
  const divider = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  const sheetStyle = isMobile
    ? {
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: glassBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px 24px 0 0',
      maxHeight: '96dvh', overflowY: 'auto',
      paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
      animation: 'slideUpSheet 0.32s cubic-bezier(0.32,0.72,0,1)',
      boxShadow: isDark
        ? '0 -24px 80px rgba(0,0,0,0.7)'
        : '0 -12px 48px rgba(0,0,0,0.15)',
    }
    : {
      background: glassBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 24,
      width: '100%', maxWidth: 420,
      maxHeight: '92vh', overflowY: 'auto',
      boxShadow: isDark
        ? '0 32px 80px rgba(0,0,0,0.7)'
        : '0 20px 56px rgba(0,0,0,0.14)',
      animation: 'scaleIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
    };

  const px = isMobile ? 18 : 22;

  return (
    <>
      <style>{ANIM_CSS}</style>

      {/* backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
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
                background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              }} />
            </div>
          )}

          {/* ─── HEADER CHIPS ─────────────────────────────────────────────── */}
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            padding: `${isMobile ? 14 : 22}px ${px}px 0`,
            flexWrap: 'wrap',
          }}>
            {/* category chip */}
            {catLabel && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 9999,
                background: surface,
                border: `1px solid ${greenBorder}`,
              }}>
                <span style={{ fontSize: 14 }}>{taskEmoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: green, textTransform: 'capitalize' }}>
                  {catLabel}
                </span>
              </div>
            )}

            {/* streak chip */}
            {attempts >= 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', borderRadius: 9999,
                background: surface,
                border: '1px solid rgba(245,158,11,0.3)',
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#F59E0B' }}>
                  ↩ {attempts}× rescheduled
                </span>
              </div>
            )}

            {/* urgency chip */}
            {(urgentLevel === 'overdue' || urgentLevel === 'today') && (
              <div style={{
                padding: '5px 12px', borderRadius: 9999,
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.3)',
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>
                  {urgentLevel === 'overdue' ? '🔴 Overdue' : '🔥 Due today'}
                </span>
              </div>
            )}

            {/* close */}
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto', background: 'none', border: 'none',
                cursor: 'pointer', color: textMuted, fontSize: 18,
                lineHeight: 1, padding: '4px 6px', borderRadius: 8,
              }}
            >✕</button>
          </div>

          {/* ─── TITLE ────────────────────────────────────────────────────── */}
          <div style={{ padding: `14px ${px}px 0` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: textMuted, marginBottom: 4 }}>
              Time's up:
            </div>
            <div style={{
              fontSize: isMobile ? 26 : 30, fontWeight: 900,
              color: green, lineHeight: 1.15,
              wordBreak: 'break-word', marginBottom: 18,
            }}>
              {task.name}
            </div>
          </div>

          {/* ─── STAT CARDS ───────────────────────────────────────────────── */}
          {(probPct !== null || procLabel) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: (probPct !== null && procLabel) ? '1fr 1fr' : '1fr',
              gap: 10,
              padding: `0 ${px}px 16px`,
            }}>
              {probPct !== null && (
                <div style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: 16, padding: '14px 14px 12px',
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}>
                  {/* mini donut-style ring via border trick */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: `3px solid ${probCol}`,
                    marginBottom: 6, opacity: isDark ? 0.85 : 1,
                  }} />
                  <div style={{ fontSize: 22, fontWeight: 800, color: textPrimary, lineHeight: 1 }}>
                    {probPct}%
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 }}>
                    Completion Prob.
                  </div>
                  {/* mini bar */}
                  <div style={{
                    marginTop: 8, height: 3, borderRadius: 2,
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${probPct}%`, height: '100%',
                      background: probCol, borderRadius: 2,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              )}

              {procLabel && (
                <div style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: 16, padding: '14px 14px 12px',
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>
                    {procrastination?.severity === 'none' ? '😊'
                      : procrastination?.severity === 'mild' ? '🙂'
                        : procrastination?.severity === 'moderate' ? '😐'
                          : procrastination?.severity === 'severe' ? '😬'
                            : '😰'}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: procColor, lineHeight: 1 }}>
                    {procLabel}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 }}>
                    Procrastination
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── AI RECOMMENDATION CARD ───────────────────────────────────── */}
          {aiRec?.summary && (
            <div style={{
              margin: `0 ${px}px 16px`,
              position: 'relative', overflow: 'hidden',
              borderRadius: 18,
              background: isDark
                ? 'linear-gradient(135deg, rgba(110,175,110,0.18) 0%, rgba(110,175,110,0.06) 100%)'
                : 'linear-gradient(135deg, rgba(59,122,59,0.1) 0%, rgba(59,122,59,0.03) 100%)',
              border: `1px solid rgba(110,175,110,0.3)`,
              padding: '16px 16px 14px',
              animation: 'aiPulse 3s infinite ease-in-out',
            }}>
              {/* decorative star */}
              <div style={{
                position: 'absolute', top: 8, right: 10,
                fontSize: 52, opacity: 0.12, lineHeight: 1,
                userSelect: 'none', pointerEvents: 'none',
              }}>✨</div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 800, letterSpacing: 0.5,
                  background: green, color: '#fff',
                  padding: '2px 6px', borderRadius: 4,
                }}>AI</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: green,
                  textTransform: 'uppercase', letterSpacing: 0.8,
                }}>Recommendation</span>
              </div>
              <div style={{ fontSize: 14, color: isDark ? textPrimary : '#1A3A1A', lineHeight: 1.55, fontWeight: 500 }}>
                {aiRec.summary}
              </div>
            </div>
          )}

          {/* procrastination warning banner (severe/chronic) */}
          {procrastination && procrastination.severity !== 'none' && procrastination.severity !== 'mild' && (
            <div style={{
              margin: `0 ${px}px 14px`,
              padding: '10px 14px', borderRadius: 12,
              background: procrastination.severity === 'chronic'
                ? 'rgba(220,38,38,0.1)' : 'rgba(245,158,11,0.1)',
              border: `1px solid ${procrastination.severity === 'chronic'
                ? 'rgba(220,38,38,0.25)' : 'rgba(245,158,11,0.25)'}`,
            }}>
              <div style={{
                fontSize: 12, fontWeight: 700, marginBottom: 2,
                color: procrastination.severity === 'chronic' ? '#ef4444' : '#d97706',
              }}>
                {procrastination.severity === 'chronic' ? '⚠️ Chronic avoidance detected'
                  : procrastination.severity === 'severe' ? '⚠️ Strong avoidance pattern'
                    : '⚠️ Avoidance building'}
              </div>
              {procrastination.interventions?.[0] && (
                <div style={{ fontSize: 11, color: textMuted }}>
                  {procrastination.interventions[0].reason}
                </div>
              )}
            </div>
          )}

          {/* ─── ACTION GRID (2x2) ────────────────────────────────────────── */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 10, padding: `0 ${px}px 10px`,
          }}>
            <ActionCard
              onClick={() => onContinue(continueDur?.suggestedMinutes > 1 ? continueDur.suggestedMinutes : 1)}
              isTop={topOption === 'continue'}
              icon="▶"
              label="Continue"
              hint={continueDur ? `+${continueDur.suggestedMinutes} min` : '+1 min'}
              green={green} greenBorder={greenBorder} surface={surface}
              border={border} textPrimary={textPrimary} textMuted={textMuted}
            />
            <ActionCard
              onClick={() => bestSlot && onLaterToday(bestSlot)}
              isTop={topOption === 'later_today'}
              disabled={!bestSlot}
              icon="🕐"
              label="Later Today"
              hint={bestSlot ? `${bestSlot.startTime}${bestSlot.score >= 70 ? ' ★' : ''}` : 'No slots'}
              green={green} greenBorder={greenBorder} surface={surface}
              border={border} textPrimary={textPrimary} textMuted={textMuted}
            />
            <ActionCard
              onClick={onTomorrow}
              isTop={topOption === 'tomorrow'}
              warn={urgentLevel === 'overdue' || urgentLevel === 'today'}
              icon="📅"
              label="Tomorrow"
              hint={urgentLevel === 'overdue' || urgentLevel === 'today' ? '⚠ risky' : 'fresh start'}
              green={green} greenBorder={greenBorder} surface={surface}
              border={border} textPrimary={textPrimary} textMuted={textMuted}
            />
            <ActionCard
              onClick={onBackToPool}
              isTop={topOption === 'back_to_pool'}
              icon="📥"
              label="Back to Pool"
              hint="save for later"
              green={green} greenBorder={greenBorder} surface={surface}
              border={border} textPrimary={textPrimary} textMuted={textMuted}
            />
          </div>

          {/* ─── SECONDARY BUTTONS ────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 8, padding: `0 ${px}px 16px` }}>
            <GhostBtn onClick={onPickTime} green={green} textMuted={textMuted}>
              🎯 Pick a time
            </GhostBtn>
            {showBreakTask && (
              <GhostBtn
                onClick={onBreakTask}
                green={green} textMuted={textMuted}
                highlight={topOption === 'break_task'}
              >
                🔨 Break it up
              </GhostBtn>
            )}
          </div>

          {/* ─── MARK COMPLETE (full-width pill) ──────────────────────────── */}
          <div style={{ padding: `0 ${px}px 16px` }}>
            <button
              onClick={onComplete}
              style={{
                width: '100%', height: 58,
                borderRadius: 9999,
                background: `linear-gradient(135deg, ${greenDark}, ${green})`,
                color: '#fff',
                border: topOption === 'complete'
                  ? '2px solid rgba(255,255,255,0.25)'
                  : '2px solid transparent',
                fontSize: 16, fontWeight: 800,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: topOption === 'complete'
                  ? '0 6px 24px rgba(78,143,78,0.5), 0 0 0 3px rgba(110,175,110,0.2)'
                  : '0 4px 16px rgba(78,143,78,0.3)',
                transition: 'transform 0.12s, box-shadow 0.12s',
                position: 'relative',
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span style={{ fontSize: 22 }}>✓</span>
              <span>Mark Complete</span>
              {topOption === 'complete' && (
                <span style={{
                  position: 'absolute', top: -7, right: 12,
                  fontSize: 8, fontWeight: 800, padding: '2px 6px',
                  background: '#fff', color: greenDark,
                  borderRadius: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  letterSpacing: 0.4,
                }}>AI</span>
              )}
            </button>
          </div>

          {/* ─── AI ANALYSIS FOOTER ───────────────────────────────────────── */}
          <div style={{
            borderTop: `1px solid ${divider}`,
            padding: `8px ${px}px ${isMobile ? 10 : 16}px`,
          }}>
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{
                background: 'none', border: 'none',
                color: textMuted, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 0',
              }}
            >
              <span style={{ fontSize: 14 }}>{showDetails ? '▾' : '▸'}</span>
              AI analysis breakdown
            </button>

            {showDetails && (
              <div style={{
                marginTop: 8, padding: 14,
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                borderRadius: 12,
                animation: 'fadeIn 0.18s ease-out',
              }}>
                {/* factor list */}
                {completionProb?.factors?.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: green,
                      marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6,
                    }}>
                      Probability factors
                    </div>
                    {completionProb.factors.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 0', fontSize: 11, color: textMuted,
                        borderBottom: i < completionProb.factors.length - 1
                          ? `1px solid ${divider}` : 'none',
                      }}>
                        <span>{f.name}</span>
                        <span style={{ fontWeight: 700, color: textPrimary }}>
                          {Math.round(f.value * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* option ranking */}
                {rankedOptions.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: green,
                      marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6,
                    }}>
                      Option ranking
                    </div>
                    {rankedOptions.slice(0, 5).map((opt, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 6,
                      }}>
                        <span style={{ fontSize: 13, width: 20, textAlign: 'center' }}>{opt.icon}</span>
                        <div style={{
                          flex: 1, height: 4, borderRadius: 2,
                          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${opt.score}%`, height: '100%', borderRadius: 2,
                            background: i === 0 ? green : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'),
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 10, minWidth: 24, textAlign: 'right',
                          fontWeight: i === 0 ? 700 : 400,
                          color: i === 0 ? textPrimary : textMuted,
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

// ── Sub-components ─────────────────────────────────────────────────────────────

function ActionCard({
  onClick, isTop, disabled, warn,
  icon, label, hint,
  green, greenBorder, surface, border, textPrimary, textMuted,
}) {
  const cardBorder = isTop ? greenBorder
    : warn ? 'rgba(245,158,11,0.3)'
      : border;

  const cardBg = isTop
    ? 'rgba(110,175,110,0.08)'
    : warn
      ? 'rgba(245,158,11,0.05)'
      : surface;

  const iconBg = isTop
    ? 'rgba(110,175,110,0.2)'
    : warn
      ? 'rgba(245,158,11,0.12)'
      : 'rgba(255,255,255,0.06)';

  const iconColor = isTop ? green
    : warn ? '#d97706'
      : textMuted;

  // recommended green dot
  const showDot = isTop;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: cardBg,
        border: `1.5px solid ${cardBorder}`,
        borderRadius: 18,
        padding: '16px 14px 14px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'space-between',
        minHeight: 110,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        position: 'relative',
        transition: 'transform 0.12s, border-color 0.15s',
        boxShadow: isTop ? '0 0 18px rgba(110,175,110,0.1)' : 'none',
        textAlign: 'left',
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* icon circle */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, color: iconColor,
        marginBottom: 8, flexShrink: 0,
      }}>
        {icon}
      </div>

      <div>
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: isTop ? '#fff' : textPrimary,
          lineHeight: 1.2, marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 500,
          color: isTop ? green : warn ? '#d97706' : textMuted,
          lineHeight: 1.2,
        }}>
          {hint}
        </div>
      </div>

      {/* recommended dot */}
      {showDot && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: '50%',
          background: green,
          animation: 'dotPulse 2s infinite ease-in-out',
        }} />
      )}

      {/* AI badge */}
      {isTop && (
        <span style={{
          position: 'absolute', top: -7, right: -7,
          fontSize: 8, fontWeight: 800, padding: '2px 6px',
          background: green, color: '#fff',
          borderRadius: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          letterSpacing: 0.4,
        }}>AI</span>
      )}
    </button>
  );
}

function GhostBtn({ onClick, green, textMuted, highlight, children }) {
  const borderStyle = highlight
    ? '1.5px solid rgba(234,88,12,0.4)'
    : '1.5px dashed rgba(255,255,255,0.12)';
  const color = highlight ? '#ea580c' : textMuted;
  const bgStyle = highlight ? 'rgba(234,88,12,0.08)' : 'transparent';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, height: 42,
        background: bgStyle, border: borderStyle, borderRadius: 12,
        color, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        transition: 'border-color 0.15s, color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!highlight) {
          e.currentTarget.style.borderColor = green;
          e.currentTarget.style.color = green;
        }
      }}
      onMouseLeave={e => {
        if (!highlight) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = textMuted;
        }
      }}
    >
      {children}
      {highlight && (
        <span style={{
          position: 'absolute', top: -7, right: -7,
          fontSize: 8, fontWeight: 800, padding: '2px 6px',
          background: '#ea580c', color: '#fff',
          borderRadius: 5, letterSpacing: 0.3,
        }}>AI</span>
      )}
    </button>
  );
}
