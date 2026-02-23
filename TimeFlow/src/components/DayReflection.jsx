import { useState, useEffect } from "react";
import { loadTasksForDate, saveTasksForDate, saveReflection } from "../utils/storage";
import MobileLayout from './mobile/MobileLayout';
import FirstTimeTooltip from './FirstTimeTooltip';
import { hasSeenTooltip, markTooltipSeen, TOOLTIP_CONTENT } from "../utils/firstTimeTooltips";
import { haptic } from "../utils/haptics";
import { useDarkMode } from "../utils/useDarkMode";
import "../App.css";

function LeafIcon({ className = "", size = 18, fill = "#3B6E3B" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-45 12 12)" fill={fill} opacity="0.9" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="#2E6B2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function DayReflection({ todayDate, onComplete }) {
  const tasks = loadTasksForDate(todayDate);
  const completedTasks = tasks.filter(t => t.completed);
  const unfinishedTasks = tasks.filter(t => !t.completed);

  const totalTime = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const completedTime = completedTasks.reduce((sum, t) => sum + (t.duration || 0), 0);

  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState(null);
  const [unfinishedActions, setUnfinishedActions] = useState({});
  const [showCelebration, setShowCelebration] = useState(completedTasks.length === tasks.length && tasks.length > 0);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [showTooltip, setShowTooltip] = useState(() => !hasSeenTooltip('stats'));

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleSave = () => {
    // Process unfinished tasks based on user actions
    const updatedTasks = tasks.map(task => {
      if (task.completed) return task;

      const action = unfinishedActions[task.id];
      if (action === 'completed') {
        return { ...task, completed: true, remaining: 0 };
      } else if (action === 'delete') {
        return null; // Will be filtered out
      }
      // 'carry' or undefined - leave as is, will be picked up by carry-over logic
      return task;
    }).filter(Boolean);

    saveTasksForDate(todayDate, updatedTasks);

    // Save reflection
    saveReflection(todayDate, {
      completedCount: completedTasks.length,
      totalCount: tasks.length,
      timeSpent: completedTime,
      reflection,
      mood,
      unfinishedActions
    });

    onComplete();
  };

  const handleUnfinishedAction = (taskId, action) => {
    setUnfinishedActions(prev => ({
      ...prev,
      [taskId]: action
    }));
  };

  const moodOptions = [
    { value: 'great', emoji: '🌟', label: 'Great', color: '#10b981' },
    { value: 'good', emoji: '😊', label: 'Good', color: '#6FAF6F' },
    { value: 'okay', emoji: '😐', label: 'Okay', color: '#fbbf24' },
    { value: 'rough', emoji: '😔', label: 'Rough', color: '#f59e0b' }
  ];

  if (isMobile) {
    return (
      <MobileLayout showBottomNav={true} onNavigate={(tab) => {
        haptic.light();
        if (tab === 'today') onComplete();
        else if (tab === 'week') window.location.hash = '#/week';
        else if (tab === 'pool') window.location.hash = '#/pool';
        else if (tab === 'stats') window.location.hash = '#/reflection';
        else if (tab === 'streak') window.location.hash = '#/streak';
      }} activeTab="stats">{/* Header */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Day Complete ✨
          </h1>
          <p style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
            {todayDate} • Reflect on your progress
          </p>
        </div>

        {/* First-Time Tooltip */}
        {showTooltip && (
          <FirstTimeTooltip
            title={TOOLTIP_CONTENT.stats.title}
            description={TOOLTIP_CONTENT.stats.description}
            icon={TOOLTIP_CONTENT.stats.icon}
            onDismiss={() => {
              setShowTooltip(false);
              markTooltipSeen('stats');
            }}
          />
        )}

        {/* Celebration */}
        {showCelebration && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: "none", zIndex: 1, overflow: "hidden"
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: "absolute", top: "-50px", left: `${Math.random() * 100}%`,
                width: "20px", height: "20px",
                animation: `fallingLeaf ${3 + Math.random() * 2}s linear ${Math.random() * 0.5}s infinite`,
                opacity: 0.6
              }}>
                <LeafIcon size={20} fill="#6FAF6F" />
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div style={{
          background: isDark ? '#242B24' : '#fff', borderRadius: '14px', padding: '16px',
          marginBottom: '14px', boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B6E3B' }}>
                {completedTasks.length}/{tasks.length}
              </div>
              <div style={{ fontSize: '10px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>Tasks</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B6E3B' }}>
                {Math.floor(completedTime / 60)}h {completedTime % 60}m
              </div>
              <div style={{ fontSize: '10px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>Time</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B6E3B' }}>
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </div>
              <div style={{ fontSize: '10px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>Done</div>
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
            How was your day?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {moodOptions.map(option => (
              <button
                key={option.value}
                onClick={() => { setMood(option.value); haptic.light(); }}
                style={{
                  padding: '12px 10px',
                  borderRadius: '12px',
                  border: mood === option.value ? `2px solid ${option.color}` : `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
                  background: mood === option.value ? `${option.color}15` : (isDark ? '#242B24' : '#fff'),
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '28px' }}>{option.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: option.color }}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Unfinished Tasks */}
        {unfinishedTasks.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
              Unfinished tasks ({unfinishedTasks.length})
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {unfinishedTasks.map(task => {
                const action = unfinishedActions[task.id];
                return (
                  <div key={task.id} style={{
                    background: isDark ? '#242B24' : '#fff', borderRadius: '12px', padding: '10px 12px',
                    boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.04)',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>{task.name}</div>
                      <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93' }}>{task.duration} min</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => { handleUnfinishedAction(task.id, 'completed'); haptic.light(); }}
                        style={{
                          flex: 1, padding: '6px 10px', fontSize: '11px', borderRadius: '8px',
                          border: action === 'completed' ? '2px solid #10b981' : `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
                          background: action === 'completed' ? 'rgba(16,185,129,0.1)' : (isDark ? '#242B24' : '#fff'),
                          cursor: 'pointer', touchAction: 'manipulation', fontWeight: 600,
                          color: action === 'completed' ? '#10b981' : (isDark ? '#9CA59C' : '#8E8E93')
                        }}
                      >
                        ✓ Done
                      </button>
                      <button
                        onClick={() => { handleUnfinishedAction(task.id, 'carry'); haptic.light(); }}
                        style={{
                          flex: 1, padding: '6px 10px', fontSize: '11px', borderRadius: '8px',
                          border: action === 'carry' || !action ? '2px solid #3B6E3B' : `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
                          background: action === 'carry' || !action ? 'rgba(59,110,59,0.1)' : (isDark ? '#242B24' : '#fff'),
                          cursor: 'pointer', touchAction: 'manipulation', fontWeight: 600,
                          color: action === 'carry' || !action ? '#3B6E3B' : (isDark ? '#9CA59C' : '#8E8E93')
                        }}
                      >
                        📅 Carry
                      </button>
                      <button
                        onClick={() => { handleUnfinishedAction(task.id, 'delete'); haptic.heavy(); }}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          border: action === 'delete' ? '2px solid #DC2626' : `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
                          background: action === 'delete' ? 'rgba(220,38,38,0.1)' : (isDark ? '#242B24' : '#fff'),
                          cursor: 'pointer', touchAction: 'manipulation', fontSize: '16px',
                          color: action === 'delete' ? '#DC2626' : (isDark ? '#9CA59C' : '#8E8E93'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reflection */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
            What went well today? (Optional)
          </label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Reflect on your day, celebrate wins, or note what you learned..."
            style={{
              width: '100%', boxSizing: 'border-box', minHeight: '80px',
              padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
              fontSize: '16px', lineHeight: '1.5', fontFamily: 'inherit',
              resize: 'vertical', background: isDark ? '#1A1F1A' : '#FAFAFA', outline: 'none',
              color: isDark ? '#E8F0E8' : '#1A1A1A'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { haptic.light(); onComplete(); }}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', border: `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
              background: isDark ? '#242B24' : '#fff', color: isDark ? '#E8F0E8' : '#1A1A1A', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', touchAction: 'manipulation'
            }}
          >
            Skip
          </button>
          <button
            onClick={() => { haptic.success(); handleSave(); }}
            style={{
              flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
              background: '#3B6E3B', color: '#fff', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', touchAction: 'manipulation'
            }}
          >
            Save & Continue →
          </button>
        </div>

        <style>{`
          @keyframes fallingLeaf {
            0% {
              transform: translate(0, -50px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.4;
            }
            100% {
              transform: translate(0, 100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </MobileLayout>
    );
  }

  // Desktop render (unchanged)
  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card" style={{ maxWidth: "700px", animation: "fadeInUp 0.5s ease-out" }}>

        {/* Celebration for 100% completion */}
        {showCelebration && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden"
          }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "-50px",
                  left: `${Math.random() * 100}%`,
                  width: "24px",
                  height: "24px",
                  animation: `fallingLeaf ${3 + Math.random() * 2}s linear ${Math.random() * 0.5}s infinite`,
                  opacity: 0.6,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              >
                <LeafIcon size={24} fill="#6FAF6F" />
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="setup-header" style={{ marginBottom: "28px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <LeafIcon size={48} fill="#3B6E3B" />
            <h1 className="title" style={{ fontSize: "28px", margin: 0 }}>Day Complete</h1>
            <LeafIcon size={48} fill="#3B6E3B" />
          </div>
          <p className="muted" style={{ fontSize: "15px", color: "#6B8E6B" }}>
            {todayDate} • Reflect on your progress
          </p>
        </div>

        {/* Stats Summary */}
        <div style={{
          background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          border: "1px solid rgba(111,175,111,0.2)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#3B6E3B" }}>
                {completedTasks.length}/{tasks.length}
              </div>
              <div style={{ fontSize: "13px", color: "#6B8E6B", marginTop: "4px" }}>Tasks Done</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#3B6E3B" }}>
                {Math.floor(completedTime / 60)}h {completedTime % 60}m
              </div>
              <div style={{ fontSize: "13px", color: "#6B8E6B", marginTop: "4px" }}>Time Spent</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#3B6E3B" }}>
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </div>
              <div style={{ fontSize: "13px", color: "#6B8E6B", marginTop: "4px" }}>Completion</div>
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "15px", fontWeight: "700", color: "#3B6E3B" }}>
            How was your day?
          </label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {moodOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setMood(option.value)}
                style={{
                  flex: "1",
                  minWidth: "100px",
                  padding: "16px 12px",
                  borderRadius: "12px",
                  border: mood === option.value ? `2px solid ${option.color}` : "1px solid rgba(111,175,111,0.2)",
                  background: mood === option.value ? `${option.color}15` : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span style={{ fontSize: "32px" }}>{option.emoji}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: option.color }}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Unfinished Tasks */}
        {unfinishedTasks.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "15px", fontWeight: "700", color: "#3B6E3B" }}>
              Unfinished tasks ({unfinishedTasks.length})
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {unfinishedTasks.map(task => {
                const action = unfinishedActions[task.id];
                return (
                  <div
                    key={task.id}
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(111,175,111,0.15)",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#3B6E3B" }}>{task.name}</div>
                      <div style={{ fontSize: "12px", color: "#6B8E6B" }}>{task.duration} min</div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => handleUnfinishedAction(task.id, 'completed')}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          borderRadius: "8px",
                          border: action === 'completed' ? "2px solid #10b981" : "1px solid rgba(111,175,111,0.2)",
                          background: action === 'completed' ? "rgba(16,185,129,0.1)" : "#fff",
                          cursor: "pointer",
                          fontWeight: "600",
                          color: action === 'completed' ? "#10b981" : "#6B8E6B"
                        }}
                      >
                        ✓ Done
                      </button>
                      <button
                        onClick={() => handleUnfinishedAction(task.id, 'carry')}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          borderRadius: "8px",
                          border: action === 'carry' || !action ? "2px solid #3B6E3B" : "1px solid rgba(111,175,111,0.2)",
                          background: action === 'carry' || !action ? "rgba(59,110,59,0.1)" : "#fff",
                          cursor: "pointer",
                          fontWeight: "600",
                          color: action === 'carry' || !action ? "#3B6E3B" : "#6B8E6B"
                        }}
                      >
                        📅 Carry
                      </button>
                      <button
                        onClick={() => handleUnfinishedAction(task.id, 'delete')}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          borderRadius: "8px",
                          border: action === 'delete' ? "2px solid #ef4444" : "1px solid rgba(111,175,111,0.2)",
                          background: action === 'delete' ? "rgba(239,68,68,0.1)" : "#fff",
                          cursor: "pointer",
                          fontWeight: "600",
                          color: action === 'delete' ? "#ef4444" : "#6B8E6B"
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reflection */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "15px", fontWeight: "700", color: "#3B6E3B" }}>
            What went well today? (Optional)
          </label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Reflect on your day, celebrate wins, or note what you learned..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(111,175,111,0.2)",
              fontSize: "14px",
              lineHeight: "1.5",
              fontFamily: "inherit",
              resize: "vertical",
              background: "#fff"
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => onComplete()}
            className="btn ghost"
            style={{ flex: 1 }}
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="btn primary"
            style={{ flex: 2 }}
          >
            Save &amp; Continue →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fallingLeaf {
          0% {
            transform: translate(0, -50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translate(calc(var(--drift, 0) * 1px), 100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
