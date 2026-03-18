import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDarkMode } from "../../utils/useDarkMode";
import { getDeadlineUrgency } from "../../utils/scheduler";
import {
  generateSmartRecommendation,
  categorizeTask,
} from "../../utils/smartReschedule";
import {
  ComputerIcon,
  TeamworkIcon,
  CreativeIcon,
  EmailIcon,
  AdminIcon,
  HealthIcon,
  LearningIcon,
  SproutIcon,
  CheckmarkIcon,
  PlayIcon,
  ClockIcon,
  CalendarIcon,
  InboxIcon,
  TargetIcon,
  HammerIcon,
  HappyIcon,
  ContentIcon,
  NeutralIcon,
  UneasyIcon,
  WorriedIcon,
  WarningIcon,
  DangerStatusIcon,
  FireIcon,
  CloseIcon,
  StopwatchIcon,
} from "../../icons";
import "../../App.css";

const ANIM_CSS = `
@keyframes slideUpSheet {
  from { transform: translateY(80px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.94) translateY(12px); opacity: 0; }
  to   { transform: scale(1)    translateY(0);    opacity: 1; }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}
@keyframes recommendedGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(110,175,110,0); }
  50%       { box-shadow: 0 0 0 4px rgba(110,175,110,0.18); }
}
`;

const CAT_EMOJI = {
  coding: '💻', meetings: '🤝', creative: '🎨',
  email: '📧', admin: '📋', health: '🏃',
  learning: '📚', personal: '🌱',
};

const getCategoryIcon = (category) => {
  switch(category?.primary) {
    case 'coding': return <ComputerIcon size={22} />;
    case 'meetings': return <TeamworkIcon size={22} />;
    case 'creative': return <CreativeIcon size={22} />;
    case 'email': return <EmailIcon size={22} />;
    case 'admin': return <AdminIcon size={22} />;
    case 'health': return <HealthIcon size={22} />;
    case 'learning': return <LearningIcon size={22} />;
    case 'personal': return <SproutIcon size={22} />;
    default: return <ClockIcon size={22} />;
  }
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
    () => window.matchMedia('(max-width: 768px)').matches
  );
  const [dragY, setDragY] = useState(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(null);
  const sheetRef = useRef(null);
  const isDark = useDarkMode();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = e => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Non-passive touchmove to allow preventDefault during swipe
  useEffect(() => {
    const el = sheetRef.current;
    if (!el || !isMobile) return;
    const onTouchMove = (e) => {
      if (!isDragging.current || dragStartY.current === null) return;
      const delta = e.touches[0].clientY - dragStartY.current;
      if (delta > 0) {
        setDragY(delta);
        e.preventDefault();
      }
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [isMobile]);

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

  const handleSheetTouchStart = (e) => {
    if (sheetRef.current?.scrollTop === 0) {
      dragStartY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };
  const handleSheetTouchEnd = () => {
    isDragging.current = false;
    if (dragY > 80) {
      onClose();
    } else {
      setDragY(0);
    }
    dragStartY.current = null;
  };

  const attempts = task.attempts || 0;
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

  // ── Theme ───────────────────────────────────────────────────────────────────
  const bg = isDark ? '#161D16' : '#FFFFFF';
  const surface = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(0,0,0,0.03)';
  const border = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)';
  const green = isDark ? '#6FAF6F' : '#3B7A3B';
  const greenDark = isDark ? '#4e8f4e' : '#2D622D';
  const greenBg = isDark ? 'rgba(110,175,110,0.12)' : 'rgba(59,122,59,0.08)';
  const greenBorder = isDark ? 'rgba(110,175,110,0.3)' : 'rgba(59,110,59,0.28)';
  const textPrimary = isDark ? '#E8F0E8' : '#0D200D';
  const textSecondary = isDark ? '#9CAA9C' : '#4A5A4A';
  const divider = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  const px = isMobile ? 16 : 24;

  const sheetStyle = isMobile
    ? {
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: bg,
      borderRadius: '20px 20px 0 0',
      maxHeight: '95dvh', overflowY: 'auto',
      paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      animation: dragY > 0 ? 'none' : 'slideUpSheet 0.3s cubic-bezier(0.32,0.72,0,1)',
      transform: `translateY(${dragY}px)`,
      transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
      zIndex: 10000,
      boxShadow: isDark
        ? '0 -32px 80px rgba(0,0,0,0.8)'
        : '0 -8px 40px rgba(0,0,0,0.12)',
    }
    : {
      background: bg,
      borderRadius: 20,
      width: '100%', maxWidth: 480,
      maxHeight: '90vh', overflowY: 'auto',
      boxShadow: isDark
        ? '0 40px 100px rgba(0,0,0,0.75)'
        : '0 24px 64px rgba(0,0,0,0.16)',
      animation: 'scaleIn 0.22s cubic-bezier(0.34,1.1,0.64,1)',
    };

  // ── Action rows config ───────────────────────────────────────────────────────
  const actionRows = [
    {
      key: 'complete',
      icon: '✓',
      label: 'Mark Complete',
      hint: 'Done for today',
      onClick: onComplete,
      primary: true,
    },
    {
      key: 'continue',
      icon: '▶',
      label: 'Continue now',
      hint: continueDur ? `+${continueDur.suggestedMinutes} min` : '+1 min',
      onClick: () => onContinue(continueDur?.suggestedMinutes > 1 ? continueDur.suggestedMinutes : 1),
    },
    {
      key: 'later_today',
      icon: '🕐',
      label: 'Later today',
      hint: bestSlot ? `${bestSlot.startTime}${bestSlot.score >= 70 ? ' · best slot' : ''}` : 'No free slots',
      onClick: () => bestSlot && onLaterToday(bestSlot),
      disabled: !bestSlot,
    },
    {
      key: 'tomorrow',
      icon: '📅',
      label: 'Move to tomorrow',
      hint: (urgentLevel === 'overdue' || urgentLevel === 'today') ? '⚠ risky — deadline near' : 'Fresh start',
      onClick: onTomorrow,
      warn: urgentLevel === 'overdue' || urgentLevel === 'today',
    },
    {
      key: 'back_to_pool',
      icon: '📥',
      label: 'Back to pool',
      hint: 'Save for later',
      onClick: onBackToPool,
    },
  ];

  const sheetContent = (
    <>
      {/* Drag handle */}
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6, paddingBottom: 4 }}>
          <div style={{
            width: 32, height: 4, borderRadius: 2,
            background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)',
          }} />
        </div>
      )}

      {/* ─── TOP BAR ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${isMobile ? 6 : 10}px ${px}px 0`,
      }}>
        {/* Left: "Time's up" label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 700, color: textSecondary,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          <StopwatchIcon size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Time&apos;s up
        </div>

        {/* Right chips + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {attempts >= 1 && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#d97706',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.25)',
              padding: '3px 8px', borderRadius: 9999,
            }}>
              ↩ {attempts}×
            </span>
          )}
          {(urgentLevel === 'overdue' || urgentLevel === 'today') && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#ef4444',
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.25)',
              padding: '3px 8px', borderRadius: 9999,
            }}>
              {urgentLevel === 'overdue' ? <><DangerStatusIcon size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} /> Overdue</> : <><FireIcon size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} /> Due today</>}
            </span>
          )}
          <button onClick={onClose} style={{
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
            border: 'none', cursor: 'pointer',
            color: textSecondary, fontSize: 14,
            width: 28, height: 28, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CloseIcon size={14} />
          </button>
        </div>
      </div>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <div style={{
        padding: `4px ${px}px 10px`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: isMobile ? 20 : 24, fontWeight: 900,
          color: textPrimary, lineHeight: 1.25,
          wordBreak: 'break-word', marginBottom: catLabel ? 8 : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          {getCategoryIcon(category)}
          {task.name}
        </div>
        {catLabel && (
          <span style={{
            display: 'inline-block', marginTop: 6,
            fontSize: 11, fontWeight: 700, color: green,
            background: greenBg, border: `1px solid ${greenBorder}`,
            padding: '3px 10px', borderRadius: 9999,
            textTransform: 'capitalize', letterSpacing: 0.4,
          }}>
            {catLabel}
          </span>
        )}
      </div>

      {/* ─── STAT PILLS ──────────────────────────────────────────────────── */}
      {(probPct !== null || procLabel) && (
        <div style={{
          display: 'flex', gap: 8, justifyContent: 'center',
          padding: `0 ${px}px 14px`,
          flexWrap: 'wrap',
        }}>
          {probPct !== null && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: surface, border: `1px solid ${border}`,
              borderRadius: 12, padding: '8px 14px',
              minWidth: 110, flex: '0 0 auto',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `conic-gradient(${probCol} ${probPct * 3.6}deg, ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'} 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: isDark ? '#161D16' : '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: probCol,
                }}>
                  {probPct}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: textPrimary, lineHeight: 1.2 }}>
                  {probPct}%
                </div>
                <div style={{ fontSize: 9, color: textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Completion
                </div>
              </div>
            </div>
          )}
          {procLabel && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: surface, border: `1px solid ${border}`,
              borderRadius: 12, padding: '8px 14px',
              minWidth: 110, flex: '0 0 auto',
            }}>
              <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>
                {procrastination?.severity === 'none' ? <HappyIcon size={22} />
                  : procrastination?.severity === 'mild' ? <ContentIcon size={22} />
                  : procrastination?.severity === 'moderate' ? <NeutralIcon size={22} />
                  : procrastination?.severity === 'severe' ? <UneasyIcon size={22} /> : <WorriedIcon size={22} />}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: procColor, lineHeight: 1.2 }}>
                  {procLabel}
                </div>
                <div style={{ fontSize: 9, color: textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Tendency
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── AI RECOMMENDATION ───────────────────────────────────────────── */}
      {aiRec?.summary && (
        <div style={{
          margin: `0 ${px}px 14px`,
          borderRadius: 14,
          background: greenBg,
          border: `1px solid ${greenBorder}`,
          padding: '10px 14px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            marginBottom: 5,
          }}>
            <span style={{
              fontSize: 8, fontWeight: 800, letterSpacing: 0.5,
              background: green, color: '#fff',
              padding: '2px 6px', borderRadius: 4,
            }}>AI</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: green, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Suggestion
            </span>
          </div>
          <div style={{
            fontSize: 13, color: isDark ? textPrimary : '#1A3A1A',
            lineHeight: 1.5, fontWeight: 500,
          }}>
            {aiRec.summary}
          </div>
        </div>
      )}

      {/* Procrastination warning */}
      {procrastination && procrastination.severity !== 'none' && procrastination.severity !== 'mild' && (
        <div style={{
          margin: `0 ${px}px 12px`, padding: '8px 14px', borderRadius: 10,
          background: procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${procrastination.severity === 'chronic' ? 'rgba(220,38,38,0.22)' : 'rgba(245,158,11,0.22)'}`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, marginBottom: 2,
            color: procrastination.severity === 'chronic' ? '#ef4444' : '#d97706',
          }}>
            {procrastination.severity === 'chronic' ? <><WarningIcon size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} /> Chronic avoidance detected</>
              : procrastination.severity === 'severe' ? <><WarningIcon size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} /> Strong avoidance pattern</>
              : <><WarningIcon size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} /> Avoidance building</>}
          </div>
          {procrastination.interventions?.[0] && (
            <div style={{ fontSize: 11, color: textSecondary }}>{procrastination.interventions[0].reason}</div>
          )}
        </div>
      )}

      {/* ─── ACTION LIST ─────────────────────────────────────────────────── */}
      <div style={{ padding: `0 ${px}px`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {actionRows.map((row) => {
          const isTop = topOption === row.key;
          const isPrimary = row.primary;

          if (isPrimary) {
            // Mark Complete — full-width green pill
            return (
              <button
                key={row.key}
                onClick={row.onClick}
                style={{
                  width: '100%', height: 54, borderRadius: 14,
                  background: `linear-gradient(135deg, ${greenDark} 0%, ${green} 100%)`,
                  color: '#fff', border: isTop
                    ? '2px solid rgba(255,255,255,0.3)'
                    : '2px solid transparent',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(78,143,78,0.35)',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  position: 'relative',
                  padding: 0,
                }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <CheckmarkIcon size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Mark Complete
                {isTop && (
                  <span style={{
                    position: 'absolute', top: -7, right: 12,
                    fontSize: 8, fontWeight: 800, padding: '2px 6px',
                    background: '#fff', color: greenDark,
                    borderRadius: 5, boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                    letterSpacing: 0.4,
                  }}>AI</span>
                )}
              </button>
            );
          }

          // Regular action row
          const rowBg = isTop ? greenBg : surface;
          const rowBorder = isTop ? greenBorder : (row.warn ? 'rgba(245,158,11,0.25)' : border);

          return (
            <button
              key={row.key}
              onClick={row.onClick}
              disabled={row.disabled}
              style={{
                width: '100%', borderRadius: 12,
                background: rowBg,
                border: `1.5px solid ${rowBorder}`,
                padding: '11px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: row.disabled ? 'not-allowed' : 'pointer',
                opacity: row.disabled ? 0.35 : 1,
                transition: 'background 0.12s, transform 0.1s',
                position: 'relative',
                animation: isTop ? 'recommendedGlow 3s infinite ease-in-out' : 'none',
              }}
              onMouseDown={e => { if (!row.disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              onTouchStart={e => { if (!row.disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: isTop ? (isDark ? '#D4EDD4' : '#0D200D') : textPrimary,
                lineHeight: 1.3, textAlign: 'center', width: '100%',
              }}>
                {row.label}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 500,
                color: row.warn ? '#d97706' : (isTop ? green : textSecondary),
                lineHeight: 1.3, marginTop: 1, textAlign: 'center', width: '100%',
              }}>
                {row.hint}
              </div>

              {/* Recommended badge — pinned right */}
              {isTop && (
                <div style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%', background: green,
                    animation: 'dotPulse 2s infinite ease-in-out',
                  }} />
                  <span style={{
                    fontSize: 8, fontWeight: 800, color: '#fff',
                    background: green, padding: '2px 6px', borderRadius: 5,
                    letterSpacing: 0.4,
                  }}>AI</span>
                </div>
              )}

            </button>
          );
        })}
      </div>

      {/* ─── SECONDARY ACTIONS ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 8, padding: `10px ${px}px 4px`,
        justifyContent: 'center',
      }}>
        <SecondaryBtn onClick={onPickTime} isDark={isDark} textSecondary={textSecondary} green={green} border={border}>
          <TargetIcon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Pick a time
        </SecondaryBtn>
        {showBreakTask && (
          <SecondaryBtn onClick={onBreakTask} isDark={isDark} textSecondary={textSecondary} green={green} border={border} highlight={topOption === 'break_task'}>
            <HammerIcon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Break it up
          </SecondaryBtn>
        )}
      </div>

      {/* ─── AI ANALYSIS FOOTER ──────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${divider}`,
        margin: `12px ${px}px 0`,
        paddingTop: 8,
        paddingBottom: isMobile ? 4 : 8,
      }}>
        <button
          onClick={() => setShowDetails(v => !v)}
          style={{
            width: '100%', background: 'none', border: 'none',
            color: textSecondary, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 5, padding: '6px 0',
          }}
        >
          <span style={{ fontSize: 12 }}>{showDetails ? '▾' : '▸'}</span>
          AI analysis details
        </button>

        {showDetails && (
          <div style={{
            marginTop: 8, padding: 12,
            background: isDark ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.025)',
            borderRadius: 10, animation: 'fadeIn 0.15s ease-out',
          }}>
            {completionProb?.factors?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: green, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Probability factors
                </div>
                {completionProb.factors.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '4px 0', fontSize: 11, color: textSecondary,
                    borderBottom: i < completionProb.factors.length - 1 ? `1px solid ${divider}` : 'none',
                  }}>
                    <span>{f.name}</span>
                    <span style={{ fontWeight: 700, color: textPrimary }}>{Math.round(f.value * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
            {rankedOptions.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: green, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Option ranking
                </div>
                {rankedOptions.slice(0, 5).map((opt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, width: 18, textAlign: 'center' }}>{opt.icon}</span>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                      <div style={{ width: `${opt.score}%`, height: '100%', borderRadius: 2, background: i === 0 ? green : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'), transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: 10, minWidth: 22, textAlign: 'right', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? textPrimary : textSecondary }}>
                      {opt.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(
    <>
      <style>{ANIM_CSS}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
          zIndex: 9999,
          animation: 'fadeIn 0.15s ease-out',
          ...(isMobile ? {} : {
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }),
        }}
        onClick={onClose}
      >
        {/* Desktop: centered sheet inside backdrop */}
        {!isMobile && (
          <div
            ref={sheetRef}
            className="reschedule-modal"
            style={sheetStyle}
            onClick={e => e.stopPropagation()}
          >
            {sheetContent}
          </div>
        )}
      </div>

      {/* Mobile: sibling fixed element — not inside backdrop so width stays full */}
      {isMobile && (
        <div
          ref={sheetRef}
          className="reschedule-modal"
          style={sheetStyle}
          onTouchStart={handleSheetTouchStart}
          onTouchEnd={handleSheetTouchEnd}
        >
          {sheetContent}
        </div>
      )}
    </>,
    document.body
  );
}

// ── SecondaryBtn ────────────────────────────────────────────────────────────

function SecondaryBtn({ onClick, isDark, textSecondary, green, border, highlight, children }) {
  const bg = highlight ? 'rgba(234,88,12,0.08)' : 'transparent';
  const borderStyle = highlight
    ? '1.5px solid rgba(234,88,12,0.35)'
    : `1.5px dashed ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'}`;
  const color = highlight ? '#ea580c' : textSecondary;

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, height: 40,
        background: bg, border: borderStyle, borderRadius: 10,
        color, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.12s, color 0.12s',
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
          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)';
          e.currentTarget.style.color = textSecondary;
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
