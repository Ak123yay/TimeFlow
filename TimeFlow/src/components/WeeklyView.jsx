import { useState, useEffect, lazy, Suspense } from "react";
import { getWeekData, getCurrentWeekStart, loadReflection, loadTasksForDate, saveTasksForDate } from "../utils/storage";
import ReflectionViewer from "./dialogs/ReflectionViewer";
import MobileLayout from './mobile/MobileLayout';
import CalendarView from './CalendarView';
import FirstTimeTooltip from './FirstTimeTooltip';
import { hasSeenTooltip, markTooltipSeen, TOOLTIP_CONTENT } from "../utils/firstTimeTooltips";
import { haptic } from "../utils/haptics";
import { useDarkMode } from "../utils/useDarkMode";
import { usePageTransition, useScrollReveal } from "../utils/useAnimations";
import "../App.css";
import {
  LeafIcon,
  LeafFallIcon,
  NoteIcon,
  PlusIcon,
} from '../icons';

const AddTaskModal = lazy(() => import("./dialogs/AddTaskModal"));

export default function WeeklyView({ onBackToToday }) {
  const isDark = useDarkMode();
  const { ref: pageRef } = usePageTransition();
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [weekData, setWeekData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [showTooltip, setShowTooltip] = useState(() => !hasSeenTooltip('week'));
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedDateForTask, setSelectedDateForTask] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const data = getWeekData(weekStart);
    const dataWithReflections = data.map(day => ({
      ...day,
      reflection: loadReflection(day.date)
    }));
    setWeekData(dataWithReflections);
  }, [weekStart]);

  const goToPreviousWeek = () => {
    haptic.light();
    const start = new Date(weekStart);
    start.setDate(start.getDate() - 7);
    setWeekStart(start.toISOString().slice(0, 10));
  };

  const goToNextWeek = () => {
    haptic.light();
    const start = new Date(weekStart);
    start.setDate(start.getDate() + 7);
    setWeekStart(start.toISOString().slice(0, 10));
  };

  const goToCurrentWeek = () => {
    haptic.light();
    setWeekStart(getCurrentWeekStart());
  };

  const isCurrentWeek = weekStart === getCurrentWeekStart();

  // Handle add task from calendar
  const handleAddTaskClick = (dateString) => {
    haptic.light();
    setSelectedDateForTask(dateString);
    setShowAddTaskModal(true);
  };

  // Handle save new task from modal
  const handleAddTask = (newTask) => {
    if (!selectedDateForTask) return;

    try {
      const tasks = loadTasksForDate(selectedDateForTask);
      tasks.push(newTask);
      saveTasksForDate(selectedDateForTask, tasks);

      // Refresh week data
      const data = getWeekData(weekStart);
      const dataWithReflections = data.map(day => ({
        ...day,
        reflection: loadReflection(day.date)
      }));
      setWeekData(dataWithReflections);

      haptic.light();
      setShowAddTaskModal(false);
      setSelectedDateForTask(null);
    } catch (e) {
      console.error('Error adding task:', e);
      haptic.warning();
    }
  };

  if (isMobile) {
    return (
      <MobileLayout showBottomNav={true} onNavigate={(tab) => {
        haptic.light();
        if (tab === 'today') onBackToToday();
        else if (tab === 'pool') window.location.hash = '#/pool';
        else if (tab === 'stats') window.location.hash = '#/reflection';
        else if (tab === 'streak') window.location.hash = '#/streak';
      }} activeTab="week">

        {/* Header */}
        <div style={{ marginBottom: '12px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 2px', letterSpacing: '-0.3px' }}>
            Weekly Overview
          </h1>
          <p style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>Your week at a glance</p>
        </div>

        {/* First-Time Tooltip */}
        {showTooltip && (
          <FirstTimeTooltip
            title={TOOLTIP_CONTENT.week.title}
            description={TOOLTIP_CONTENT.week.description}
            icon={TOOLTIP_CONTENT.week.icon}
            onDismiss={() => {
              setShowTooltip(false);
              markTooltipSeen('week');
            }}
          />
        )}

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '14px',
          background: isDark ? '#1A1F1A' : '#F0F0F0', padding: '4px', borderRadius: '14px'
        }}>
          <button
            onClick={() => { haptic.light(); setViewMode('week'); }}
            style={{
              flex: 1, padding: '8px 14px', borderRadius: '12px',
              border: 'none', background: viewMode === 'week' ? (isDark ? '#242B24' : '#fff') : 'transparent',
              color: viewMode === 'week' ? (isDark ? '#E8F0E8' : '#1A1A1A') : (isDark ? '#9CA59C' : '#8E8E93'),
              fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', touchAction: 'manipulation',
              boxShadow: viewMode === 'week' ? (isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)') : 'none',
              transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            Week
          </button>
          <button
            onClick={() => { haptic.light(); setViewMode('month'); }}
            style={{
              flex: 1, padding: '8px 14px', borderRadius: '12px',
              border: 'none', background: viewMode === 'month' ? (isDark ? '#242B24' : '#fff') : 'transparent',
              color: viewMode === 'month' ? (isDark ? '#E8F0E8' : '#1A1A1A') : (isDark ? '#9CA59C' : '#8E8E93'),
              fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', touchAction: 'manipulation',
              boxShadow: viewMode === 'month' ? (isDark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)') : 'none',
              transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            Month
          </button>
        </div>

        {/* Month View - Calendar */}
        {viewMode === 'month' && (
          <CalendarView
            selectedDate={selectedDay?.date}
            onDaySelect={(date) => {
              // Navigate to that date in today view or show reflection if available
              const reflection = loadReflection(date);
              if (reflection) {
                const dayData = {
                  date,
                  reflection
                };
                setSelectedDay(dayData);
              }
            }}
          />
        )}

        {/* Week View */}
        {viewMode === 'week' && (
          <>
            {/* Week Navigation */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '14px', padding: '10px 14px',
              background: isDark ? '#242B24' : '#fff', borderRadius: '16px', boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
            }}>
              <button onClick={goToPreviousWeek} style={{
                padding: '6px 10px', borderRadius: '12px', border: 'none',
                background: isDark ? '#1A1F1A' : '#F0F0F0', color: isDark ? '#E8F0E8' : '#1A1A1A', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', touchAction: 'manipulation'
              }}>←</button>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
                  {weekData[0]?.month} {weekData[0]?.dayOfMonth} - {weekData[6]?.month} {weekData[6]?.dayOfMonth}
                </div>
                {!isCurrentWeek && (
                  <button onClick={goToCurrentWeek} style={{
                    marginTop: '2px', padding: '2px 10px', borderRadius: '6px',
                    border: 'none', background: 'rgba(59,110,59,0.08)', color: '#3B6E3B',
                    fontSize: '10px', fontWeight: 600, cursor: 'pointer', touchAction: 'manipulation'
                  }}>Today</button>
                )}
              </div>

              <button onClick={goToNextWeek} style={{
                padding: '6px 10px', borderRadius: '12px', border: 'none',
                background: isDark ? '#1A1F1A' : '#F0F0F0', color: isDark ? '#E8F0E8' : '#1A1A1A', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', touchAction: 'manipulation'
              }}>→</button>
            </div>

            {/* Day Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {weekData.map((day) => {
                const completionColor = day.completionRate === 100 ? '#10b981'
                  : day.completionRate >= 75 ? '#6FAF6F'
                    : day.completionRate >= 50 ? '#fbbf24'
                      : day.completionRate > 0 ? '#f59e0b' : '#cbd5e1';

                return (
                  <div
                    key={day.date}
                    onClick={() => { if (day.reflection) { setSelectedDay(day); haptic.light(); } }}
                    style={{
                      background: day.isToday ? (isDark ? 'rgba(111,175,111,0.15)' : 'rgba(59,110,59,0.04)') : (isDark ? '#242B24' : '#fff'),
                      border: day.isToday ? (isDark ? '1.5px solid #6FAF6F' : '1.5px solid #3B6E3B') : (isDark ? '1.5px solid #6B7B6B' : '1.5px solid #E5E5E5'),
                      borderRadius: '16px', padding: '14px 16px',
                      cursor: day.reflection ? 'pointer' : 'default',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: day.hasTasks ? '10px' : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: isDark ? '#9CA59C' : '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {day.dayOfWeek}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
                            {day.dayOfMonth}
                          </div>
                        </div>
                        {day.isToday && (
                          <div style={{
                            padding: '3px 8px', background: 'rgba(59,110,59,0.1)',
                            borderRadius: '6px', fontSize: '9px', fontWeight: 700, color: '#3B6E3B'
                          }}>TODAY</div>
                        )}
                        {day.isFuture && !day.isToday && (
                          <div style={{
                            padding: '3px 8px', background: isDark ? '#1A1F1A' : '#F0F0F0',
                            borderRadius: '6px', fontSize: '9px', fontWeight: 600, color: isDark ? '#9CA59C' : '#8E8E93'
                          }}>UPCOMING</div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {day.reflection && (
                          <div style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #A7D3A7, #6FAF6F)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', border: isDark ? '1.5px solid #242B24' : '1.5px solid #fff'
                          }}><NoteIcon size={10} /></div>
                        )}
                        {day.hasTasks && (
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#3B6E3B' }}>
                            {day.completedCount}/{day.taskCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {day.hasTasks && (
                      <>
                        <div style={{
                          height: '4px', background: isDark ? '#1A1F1A' : '#F0F0F0', borderRadius: '99px',
                          overflow: 'hidden', marginBottom: '6px'
                        }}>
                          <div style={{
                            height: '100%', width: `${day.completionRate}%`,
                            background: completionColor, transition: 'width 0.3s ease'
                          }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93' }}>
                            {day.completionRate}% complete
                          </span>
                          {day.carriedOverCount > 0 && (
                            <span style={{ fontSize: '10px', fontWeight: 600, color: '#D97706' }}>
                              <LeafFallIcon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> {day.carriedOverCount} carried
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {!day.hasTasks && (
                      <div style={{ padding: '8px 0', textAlign: 'center', color: isDark ? '#6B7B6B' : '#D1D5DB', fontSize: '11px' }}>
                        No tasks
                      </div>
                    )}

                    {/* Add Task Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTaskClick(day.date);
                      }}
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        padding: '10px',
                        background: isDark ? '#1A1F1A' : '#F8F8F8',
                        color: isDark ? '#9CA59C' : '#666',
                        border: `1.5px dashed ${isDark ? '#4B5B4B' : '#D1D5DB'}`,
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight:600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        touchAction: 'manipulation'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = isDark ? '#242B24' : '#F0F0F0';
                        e.target.style.borderColor = isDark ? '#6FAF6F' : '#3B6E3B';
                        e.target.style.color = isDark ? '#6FAF6F' : '#3B6E3B';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = isDark ? '#1A1F1A' : '#F8F8F8';
                        e.target.style.borderColor = isDark ? '#4B5B4B' : '#D1D5DB';
                        e.target.style.color = isDark ? '#9CA59C' : '#666';
                      }}
                    >
                      <PlusIcon size={14} />
                      Add Task
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div style={{
              background: isDark ? '#242B24' : '#fff', borderRadius: '18px', padding: '16px',
              boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B6E3B' }}>
                    {weekData.reduce((sum, day) => sum + day.completedCount, 0)}/{weekData.reduce((sum, day) => sum + day.taskCount, 0)}
                  </div>
                  <div style={{ fontSize: '10px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>Tasks</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B6E3B' }}>
                    {weekData.filter(d => d.hasTasks).length}/7
                  </div>
                  <div style={{ fontSize: '10px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>Active</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B6E3B' }}>
                    {weekData.reduce((sum, day) => sum + day.carriedOverCount, 0)}
                  </div>
                  <div style={{ fontSize: '10px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>Carried</div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedDay && selectedDay.reflection && (
          <ReflectionViewer
            date={selectedDay.date}
            reflection={selectedDay.reflection}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </MobileLayout>
    );
  }

  // Desktop render (unchanged)
  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card" style={{ maxWidth: "1200px", animation: "fadeInUp 0.3s ease-out" }}>
        <div className="setup-header" style={{ marginBottom: "24px" }}>
          <div className="header-left">
            <h1 className="title" style={{ fontSize: "24px" }}>Weekly Overview</h1>
            <p className="muted" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <LeafIcon size={14} fill="#6B8E6B" />
              Your week at a glance
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={onBackToToday} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 16px", borderRadius: "9999px",
              border: "1px solid rgba(111,175,111,0.3)",
              background: "linear-gradient(135deg, rgba(111,175,111,0.1), rgba(59,110,59,0.05))",
              color: "#3B6E3B", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(59,110,59,0.06)"
            }}>
              <span>←</span><span>Back to Today</span>
            </button>
            <div className="header-decor"><LeafIcon size={40} fill="#3B6E3B" /></div>
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "20px", padding: "12px 16px",
          background: "linear-gradient(135deg, rgba(167,211,167,0.1), rgba(111,175,111,0.05))",
          borderRadius: "16px", border: "1.5px solid rgba(111,175,111,0.15)"
        }}>
          <button onClick={goToPreviousWeek} className="btn ghost" style={{ padding: "8px 16px", fontSize: "14px" }}>
            ← Previous Week
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#3B6E3B" }}>
              {weekData[0]?.month} {weekData[0]?.dayOfMonth} - {weekData[6]?.month} {weekData[6]?.dayOfMonth}
            </span>
            {!isCurrentWeek && (
              <button onClick={goToCurrentWeek} className="btn ghost" style={{ padding: "6px 12px", fontSize: "13px" }}>
                Today
              </button>
            )}
          </div>
          <button onClick={goToNextWeek} className="btn ghost" style={{ padding: "8px 16px", fontSize: "14px" }}>
            Next Week →
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {weekData.map((day) => {
            const cardBackground = day.isToday
              ? "linear-gradient(135deg, rgba(167,211,167,0.2), rgba(111,175,111,0.1))"
              : day.isPast ? "linear-gradient(135deg, rgba(200,200,200,0.08), rgba(180,180,180,0.04))"
                : "linear-gradient(135deg, rgba(220,240,220,0.12), rgba(200,230,200,0.06))";
            const borderColor = day.isToday ? "rgba(111,175,111,0.4)"
              : day.isPast ? "rgba(150,150,150,0.15)" : "rgba(111,175,111,0.2)";
            const completionColor = day.completionRate === 100 ? "#10b981"
              : day.completionRate >= 75 ? "#6FAF6F"
                : day.completionRate >= 50 ? "#fbbf24"
                  : day.completionRate > 0 ? "#f59e0b" : "#cbd5e1";

            return (
              <div key={day.date} onClick={() => setSelectedDay(day)} style={{
                background: cardBackground, border: `2px solid ${borderColor}`,
                borderRadius: "18px", padding: "18px", display: "flex", flexDirection: "column",
                gap: "12px", position: "relative", overflow: "hidden",
                transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)", cursor: "pointer",
                boxShadow: day.isToday ? "0 4px 12px rgba(111,175,111,0.12), 0 12px 32px rgba(111,175,111,0.1)" : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#6B8E6B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {day.dayOfWeek}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "900", color: "#3B6E3B", marginTop: "2px" }}>
                      {day.dayOfMonth}
                    </div>
                  </div>
                  {day.isToday && (
                    <div style={{ padding: "4px 8px", background: "rgba(111,175,111,0.2)", borderRadius: "8px", fontSize: "11px", fontWeight: "700", color: "#3B6E3B" }}>
                      TODAY
                    </div>
                  )}
                  {day.isFuture && (
                    <div style={{ padding: "4px 8px", background: "rgba(167,211,167,0.15)", borderRadius: "8px", fontSize: "11px", fontWeight: "600", color: "#6B8E6B" }}>
                      UPCOMING
                    </div>
                  )}
                </div>

                {day.reflection && (
                  <div style={{
                    position: "absolute", top: "12px", right: "12px",
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #A7D3A7, #6FAF6F)",
                    border: "2px solid #fff", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "12px",
                    boxShadow: "0 2px 6px rgba(59,110,59,0.2)"
                  }}><NoteIcon size={12} /></div>
                )}

                {day.hasTasks ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "13px", color: "#6B8E6B" }}>Tasks</span>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "#3B6E3B" }}>
                          {day.completedCount}/{day.taskCount}
                        </span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(200,200,200,0.2)", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${day.completionRate}%`, background: completionColor, transition: "width 0.3s ease" }} />
                      </div>
                      <div style={{ fontSize: "13px", color: "#6B8E6B" }}>{day.completionRate}% complete</div>
                    </div>
                    {day.carriedOverCount > 0 && (
                      <div style={{
                        padding: "4px 8px", background: "rgba(255,165,0,0.1)",
                        border: "1px solid rgba(255,165,0,0.2)", borderRadius: "6px",
                        fontSize: "11px", fontWeight: "600", color: "#d97706",
                        display: "flex", alignItems: "center", gap: "4px"
                      }}>
                        <LeafFallIcon size={11} /><span>{day.carriedOverCount} carried</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: "16px 0", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
                    No tasks
                  </div>
                )}
                {day.reflection && (
                  <div style={{ fontSize: 11, color: "#6B8E6B", textAlign: "center", marginTop: 4, opacity: 0.7 }}>
                    Click to view reflection
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
          borderRadius: "20px", padding: "22px", border: "1.5px solid rgba(111,175,111,0.2)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#3B6E3B" }}>
                {weekData.reduce((sum, day) => sum + day.completedCount, 0)}/{weekData.reduce((sum, day) => sum + day.taskCount, 0)}
              </div>
              <div style={{ fontSize: "13px", color: "#6B8E6B", marginTop: "4px" }}>Tasks This Week</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#3B6E3B" }}>
                {weekData.filter(d => d.hasTasks).length}/7
              </div>
              <div style={{ fontSize: "13px", color: "#6B8E6B", marginTop: "4px" }}>Active Days</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#3B6E3B" }}>
                {weekData.reduce((sum, day) => sum + day.carriedOverCount, 0)}
              </div>
              <div style={{ fontSize: "13px", color: "#6B8E6B", marginTop: "4px" }}>Carried Over</div>
            </div>
          </div>
        </div>

        {selectedDay && selectedDay.reflection && (
          <ReflectionViewer
            date={selectedDay.date}
            reflection={selectedDay.reflection}
            onClose={() => setSelectedDay(null)}
          />
        )}

        {/* Add Task Modal */}
        <Suspense fallback={null}>
          <AddTaskModal
            isOpen={showAddTaskModal}
            onClose={() => {
              setShowAddTaskModal(false);
              setSelectedDateForTask(null);
            }}
            onAddTask={handleAddTask}
            prefilledDate={selectedDateForTask}
          />
        </Suspense>
      </div>
    </div>
  );
}
