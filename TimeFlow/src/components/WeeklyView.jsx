import { useState, useEffect } from "react";
import { getWeekData, getCurrentWeekStart } from "../utils/storage";
import "../App.css";

function LeafIcon({ size = 18, fill = "#3B6E3B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-45 12 12)" fill={fill} opacity="0.9" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="#2E6B2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function WeeklyView({ onBackToToday }) {
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    const data = getWeekData(weekStart);
    setWeekData(data);
  }, [weekStart]);

  const goToPreviousWeek = () => {
    const start = new Date(weekStart);
    start.setDate(start.getDate() - 7);
    setWeekStart(start.toISOString().slice(0, 10));
  };

  const goToNextWeek = () => {
    const start = new Date(weekStart);
    start.setDate(start.getDate() + 7);
    setWeekStart(start.toISOString().slice(0, 10));
  };

  const goToCurrentWeek = () => {
    setWeekStart(getCurrentWeekStart());
  };

  const isCurrentWeek = weekStart === getCurrentWeekStart();

  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card" style={{ maxWidth: "1200px", animation: "fadeInUp 0.3s ease-out" }}>

        {/* Header */}
        <div className="setup-header" style={{ marginBottom: "24px" }}>
          <div className="header-left">
            <h1 className="title" style={{ fontSize: "24px" }}>Weekly Overview</h1>
            <p className="muted" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <LeafIcon size={14} fill="#6B8E6B" />
              Your week at a glance
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={onBackToToday}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid rgba(111,175,111,0.3)",
                background: "linear-gradient(135deg, rgba(111,175,111,0.1), rgba(59,110,59,0.05))",
                color: "#3B6E3B",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 6px rgba(59,110,59,0.06)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,110,59,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(59,110,59,0.06)";
              }}
            >
              <span>←</span>
              <span>Back to Today</span>
            </button>
            <div className="header-decor" aria-hidden>
              <LeafIcon size={40} fill="#3B6E3B" />
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          padding: "12px 16px",
          background: "linear-gradient(135deg, rgba(167,211,167,0.1), rgba(111,175,111,0.05))",
          borderRadius: "12px",
          border: "1px solid rgba(111,175,111,0.15)"
        }}>
          <button
            onClick={goToPreviousWeek}
            className="btn ghost"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            ← Previous Week
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#3B6E3B" }}>
              {weekData[0]?.month} {weekData[0]?.dayOfMonth} - {weekData[6]?.month} {weekData[6]?.dayOfMonth}
            </span>
            {!isCurrentWeek && (
              <button
                onClick={goToCurrentWeek}
                className="btn ghost"
                style={{ padding: "6px 12px", fontSize: "13px" }}
              >
                Today
              </button>
            )}
          </div>

          <button
            onClick={goToNextWeek}
            className="btn ghost"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            Next Week →
          </button>
        </div>

        {/* Week Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {weekData.map((day) => {
            const cardBackground = day.isToday
              ? "linear-gradient(135deg, rgba(167,211,167,0.2), rgba(111,175,111,0.1))"
              : day.isPast
              ? "linear-gradient(135deg, rgba(200,200,200,0.08), rgba(180,180,180,0.04))"
              : "linear-gradient(135deg, rgba(220,240,220,0.12), rgba(200,230,200,0.06))";

            const borderColor = day.isToday
              ? "rgba(111,175,111,0.4)"
              : day.isPast
              ? "rgba(150,150,150,0.15)"
              : "rgba(111,175,111,0.2)";

            const completionColor = day.completionRate === 100
              ? "#10b981"
              : day.completionRate >= 75
              ? "#6FAF6F"
              : day.completionRate >= 50
              ? "#fbbf24"
              : day.completionRate > 0
              ? "#f59e0b"
              : "#cbd5e1";

            return (
              <div
                key={day.date}
                style={{
                  background: cardBackground,
                  border: `2px solid ${borderColor}`,
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  boxShadow: day.isToday ? "0 4px 16px rgba(111,175,111,0.15)" : "0 2px 8px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,110,59,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = day.isToday ? "0 4px 16px rgba(111,175,111,0.15)" : "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                {/* Day header */}
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
                    <div style={{
                      padding: "4px 8px",
                      background: "rgba(111,175,111,0.2)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#3B6E3B"
                    }}>
                      TODAY
                    </div>
                  )}
                  {day.isFuture && (
                    <div style={{
                      padding: "4px 8px",
                      background: "rgba(167,211,167,0.15)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#6B8E6B"
                    }}>
                      UPCOMING
                    </div>
                  )}
                </div>

                {/* Stats */}
                {day.hasTasks ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "13px", color: "#6B8E6B" }}>Tasks</span>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "#3B6E3B" }}>
                          {day.completedCount}/{day.taskCount}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{
                        height: "6px",
                        background: "rgba(200,200,200,0.2)",
                        borderRadius: "9999px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${day.completionRate}%`,
                          background: completionColor,
                          transition: "width 0.3s ease"
                        }} />
                      </div>

                      <div style={{ fontSize: "13px", color: "#6B8E6B" }}>
                        {day.completionRate}% complete
                      </div>
                    </div>

                    {/* Carried over badge */}
                    {day.carriedOverCount > 0 && (
                      <div style={{
                        padding: "4px 8px",
                        background: "rgba(255,165,0,0.1)",
                        border: "1px solid rgba(255,165,0,0.2)",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#d97706",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <span>🍂</span>
                        <span>{day.carriedOverCount} carried</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    padding: "16px 0",
                    textAlign: "center",
                    color: "#9CA3AF",
                    fontSize: "13px"
                  }}>
                    No tasks
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div style={{
          background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(111,175,111,0.2)"
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
      </div>
    </div>
  );
}
