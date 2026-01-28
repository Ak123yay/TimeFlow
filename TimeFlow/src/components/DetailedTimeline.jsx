import React from "react";
import { loadTasks } from "../utils/storage"; // reuse your loader
import "../App.css";

function minutesToHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

export default function DetailedTimeline() {
  const tasks = loadTasks();

  // Generate task blocks
  const dayStart = 0;   // 0:00
  const dayEnd = 24 * 60; // 24:00
  const hourHeight = 60; // pixels per hour

  const blocks = tasks.map(task => {
    const start = task.startTime ? task.startTime.split(":").map(Number) : [9,0]; // fallback 9:00
    const startMinutes = start[0]*60 + start[1];
    const top = (startMinutes / 60) * hourHeight;
    const height = (task.duration / 60) * hourHeight;
    return { ...task, top, height };
  });

  // generate hour labels
  const hours = Array.from({length:24}, (_,i)=>i);

  return (
    <div className="detailed-timeline-wrap" style={{position:"relative", width:"100%", minHeight: `${24*hourHeight}px`, border:"1px solid #c5e1c5", borderRadius:"12px", overflowY:"auto"}}>
      {hours.map(h => (
        <div key={h} style={{position:"absolute", top: `${h*hourHeight}px`, left:0, width:"100%", borderTop:"1px solid rgba(59,110,59,0.08)", fontSize:"12px", color:"#4B6B4B", paddingLeft:"8px"}}>
          {String(h).padStart(2,"0")}:00
        </div>
      ))}

      {blocks.map((task, i) => (
        <div key={task.id} style={{
          position:"absolute",
          top: `${task.top}px`,
          left: "60px",
          width: "calc(100% - 70px)",
          height: `${task.height}px`,
          background: "linear-gradient(135deg, #6FAF6F, #3B6E3B)",
          borderRadius:"8px",
          color:"#fff",
          padding:"4px 8px",
          boxShadow:"0 2px 6px rgba(0,0,0,0.12)",
          overflow:"hidden"
        }}>
          <div style={{fontWeight:"700"}}>{task.name}</div>
          <div style={{fontSize:"12px"}}>{task.startTime} - {minutesToHHMM(task.startTime ? task.startTime.split(":")[0]*60 + parseInt(task.startTime.split(":")[1]) + task.duration : 540 + task.duration)}</div>
        </div>
      ))}
    </div>
  );
}
