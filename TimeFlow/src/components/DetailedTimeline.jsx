import React, { useState, useEffect } from "react";
import { minutesToHHMM } from "../utils/timeUtils";
import { throttle } from "../utils/timeUtils";
import "../App.css";

export default function DetailedTimeline({ tasks = [], availability = { start: "09:00", end: "17:00" } }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // OPTIMIZED: Throttle resize handler to prevent excessive re-renders
  useEffect(() => {
    const handleResize = throttle(() => setWindowWidth(window.innerWidth), 200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate task blocks with positioning
  const hourHeight = 60; // pixels per hour

  // Responsive left offset for mobile
  const timelinePadding = windowWidth < 640 ? 40 : 60;
  const widthCalc = `calc(100% - ${timelinePadding + 10}px)`;

  // Calculate start hour from availability
  const startHour = availability.start ? parseInt(availability.start.split(":")[0]) : 9;
  const endHour = availability.end ? parseInt(availability.end.split(":")[0]) : 17;

  const blocks = tasks.map(task => {
    // Use task.start (in minutes) if it exists, otherwise calculate from startTime
    const startMinutes = task.start || 0;
    const top = ((startMinutes / 60) - startHour) * hourHeight;
    const height = (task.duration / 60) * hourHeight;
    return { ...task, top, height, startMinutes };
  });

  // Generate hour labels based on availability
  const totalHours = endHour - startHour;
  const hours = Array.from({ length: totalHours + 1 }, (_, i) => startHour + i);

  return (
    <div className="detailed-timeline-wrap" style={{
      position: "relative",
      width: "100%",
      minHeight: `${totalHours * hourHeight}px`,
      border: "1px solid #c5e1c5",
      borderRadius: "12px",
      overflowY: "auto",
      background: "#fff"
    }}>
      {/* Hour grid lines */}
      {hours.map((h, i) => (
        <div key={h} style={{
          position: "absolute",
          top: `${i * hourHeight}px`,
          left: 0,
          width: "100%",
          borderTop: "1px solid rgba(59,110,59,0.08)",
          fontSize: "12px",
          color: "#4B6B4B",
          paddingLeft: "8px",
          height: hourHeight
        }}>
          {String(h).padStart(2, "0")}:00
        </div>
      ))}

      {/* Task blocks */}
      {blocks.map((task) => {
        const taskStart = minutesToHHMM(task.start || task.startMinutes);
        const taskEnd = minutesToHHMM((task.start || task.startMinutes) + task.duration);

        return (
          <div key={task.id} style={{
            position: "absolute",
            top: `${task.top}px`,
            left: `${timelinePadding}px`,
            width: widthCalc,
            height: `${Math.max(task.height, 20)}px`,
            background: task.attempts >= 3
              ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
              : task.carriedOver
              ? "linear-gradient(135deg, #f59e0b, #d97706)"
              : task.completed
              ? "linear-gradient(135deg, rgba(111,175,111,0.5), rgba(59,110,59,0.5))"
              : "linear-gradient(135deg, #6FAF6F, #3B6E3B)",
            borderRadius: "8px",
            color: "#fff",
            padding: "4px 8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <div style={{ fontWeight: "700", fontSize: "13px" }}>{task.name}</div>
            <div style={{ fontSize: "11px", opacity: 0.9 }}>
              {taskStart} - {taskEnd} ({task.duration} min)
            </div>
            {task.completed && <div style={{ fontSize: "10px", marginTop: "2px" }}>✓ Completed</div>}
            {task.carriedOver && <div style={{ fontSize: "10px", marginTop: "2px" }}>🍂 Carried over</div>}
            {task.attempts > 0 && (
              <div style={{ fontSize: "10px", marginTop: "2px" }}>
                🔁 Rescheduled {task.attempts}x
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
