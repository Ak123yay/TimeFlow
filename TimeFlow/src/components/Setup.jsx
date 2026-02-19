// src/components/Setup.jsx
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { saveAvailability, loadAvailability } from "../utils/storage";
import MobileLayout from './mobile/MobileLayout';
import { haptic } from "../utils/haptics";
import "../App.css";

/* Presets */
const PRESETS = [
  { label: "Workday", start: "09:00", end: "17:00" },
  { label: "School", start: "08:00", end: "15:00" },
  { label: "Evening", start: "12:00", end: "20:00" },
];

/* Helper: HH:MM -> minutes */
function hhmmToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function LeafIcon({ className = "", size = 18, fill = "#3B6E3B" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="4"
        transform="rotate(-45 12 12)"
        fill={fill}
        opacity="0.9"
      />
      <line
        x1="6"
        y1="18"
        x2="18"
        y2="6"
        stroke="#2E6B2E"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Setup({ onDone }) {
  const saved = loadAvailability();
  const [start, setStart] = useState(saved?.start ?? "09:00");
  const [end, setEnd] = useState(saved?.end ?? "17:00");
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const timelineRef = useRef(null);
  const labelRef = useRef(null);

  // styles computed in px
  const [connectorStyle, setConnectorStyle] = useState({ left: "0px", width: "0px" });
  const [startMarkerLeft, setStartMarkerLeft] = useState("0px");
  const [endMarkerLeft, setEndMarkerLeft] = useState("0px");
  const [labelStyle, setLabelStyle] = useState({ left: "50%", transform: "translateX(-50%)" });
  const [shortLabel, setShortLabel] = useState(false);

  // constants
  const MIN_CONNECTOR_PX = 70;
  const H_PADDING = 12;

  const startM = hhmmToMinutes(start);
  const endM = hhmmToMinutes(end);
  const durationM = Math.max(0, endM - startM);

  useLayoutEffect(() => {
    function compute() {
      const timeline = timelineRef.current;
      const labelEl = labelRef.current;
      if (!timeline) return;

      const width = timeline.clientWidth;
      const pxPerMin = width / (24 * 60);
      let startPx = Math.round(startM * pxPerMin);
      let endPx = Math.round(endM * pxPerMin);
      let rawWidth = Math.max(4, endPx - startPx);

      if (durationM <= 0) rawWidth = MIN_CONNECTOR_PX;

      const labelWidth = labelEl ? labelEl.offsetWidth : 0;
      const minWidth = Math.max(MIN_CONNECTOR_PX, labelWidth + 20);
      let widthPx = Math.max(rawWidth, minWidth);

      // prevent overflow right
      if (startPx + widthPx + H_PADDING > width) {
        startPx = Math.max(H_PADDING, width - widthPx - H_PADDING);
      }
      startPx = Math.max(H_PADDING, startPx);

      const computedEndPx = startPx + widthPx;
      let centerPx = startPx + widthPx / 2;

      const halfLabel = labelWidth / 2 || 0;
      const minCenter = H_PADDING + halfLabel;
      const maxCenter = width - H_PADDING - halfLabel;
      centerPx = Math.min(Math.max(centerPx, minCenter), maxCenter);

      // when label too wide relative to timeline, short label
      setShortLabel(labelWidth > width * 0.58);

      setConnectorStyle({ left: `${startPx}px`, width: `${widthPx}px` });
      setStartMarkerLeft(`${startPx}px`);
      setEndMarkerLeft(`${computedEndPx}px`);
      setLabelStyle({ left: `${centerPx}px`, transform: "translateX(-50%)" });
    }

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [start, end, startM, endM, durationM]);

  function applyPreset(p) {
    setStart(p.start);
    setEnd(p.end);
    setError("");
  }

  function validateAndSave() {
    if (!start || !end) {
      setError("Choose both start and end times.");
      return;
    }
    if (start === end) {
      setError("Start and end cannot be the same.");
      return;
    }
    if (hhmmToMinutes(start) > hhmmToMinutes(end)) {
      setError("For v1 the end must be later on the same day.");
      return;
    }
    saveAvailability({ start, end });
    onDone();
  }

  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card">
        {/* decorative vines - absolute positioned in CSS */}
        <div className="setup-header">
          <div className="header-left">
            <h1 className="title">When are you available today?</h1>
            <p className="muted">We’ll only schedule tasks inside this window. You can change it anytime.</p>
          </div>
          <div className="header-decor" aria-hidden>
            {/* subtle vine icon (CSS also adds corner vines) */}
            <LeafIcon size={38} fill="#3B6E3B" />
          </div>
        </div>

        <div className="presets horizontal-scroll" role="list">
          {PRESETS.map((p) => (
            <button key={p.label} className="preset-pill" onClick={() => applyPreset(p)} aria-label={`Preset ${p.label}`}>
              <div className="preset-text">{p.label}</div>
              <div className="preset-sub">{p.start} — {p.end}</div>
            </button>
          ))}
        </div>

        <div className="controls-row">
          <label className="control">
            <div className="control-label">Start</div>
            <div className="time-input">
              <LeafIcon size={18} fill="#4F7A4F" />
              <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
          </label>

          <label className="control">
            <div className="control-label">End</div>
            <div className="time-input">
              <LeafIcon size={18} fill="#4F7A4F" />
              <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </label>

          <div className="summary small">
            <div className="summary-title">Available</div>
            <div className="summary-main">{start} — {end}</div>
            <div className="summary-sub muted">{Math.floor(durationM/60)}h {durationM%60}m</div>
          </div>
        </div>

        <div className="timeline-wrap" aria-hidden>
          <div className="timeline-scale">
            <span>0:00</span><span>6:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
          </div>

          <div className="timeline-bar" ref={timelineRef}>
            <div className="connector vine" style={connectorStyle} />
            <div className="marker start-marker" style={{ left: startMarkerLeft, transform: "translateX(-50%)" }} title={`Start ${start}`}>
              <LeafIcon size={18} fill="#3B6E3B" />
            </div>
            <div className="marker end-marker" style={{ left: endMarkerLeft, transform: "translateX(-50%)" }} title={`End ${end}`}>
              <LeafIcon size={18} fill="#3B6E3B" />
            </div>

            <div ref={labelRef} className="timeline-label" style={labelStyle}>
              <span className="label-text">
                {shortLabel ? `${start} — ${end}` : `${start} — ${end} (${Math.floor(durationM/60)}h ${durationM%60}m)`}
              </span>
            </div>
          </div>
        </div>

        {/* Install Instructions */}
        <div style={{
          marginTop: "28px",
          marginBottom: "20px",
          padding: "20px",
          background: "linear-gradient(135deg, rgba(59,110,59,0.12), rgba(59,110,59,0.06))",
          borderRadius: "16px",
          border: "2px solid rgba(59,110,59,0.25)"
        }}>
          <div style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#3B6E3B",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "20px" }}>📱</span>
            <span>Install TimeFlow as an App</span>
          </div>
          <div style={{
            fontSize: "13px",
            color: "#6B8E6B",
            marginBottom: "16px",
            lineHeight: "1.5"
          }}>
            Get the full app experience with offline support and instant loading
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <div style={{
              padding: "12px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "10px",
              border: "1px solid rgba(59,110,59,0.15)"
            }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "6px" }}>
                📱 Android (Chrome/Edge)
              </div>
              <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                Look for the "Install" banner at the bottom, or tap the menu (⋮) → "Install app"
              </div>
            </div>

            <div style={{
              padding: "12px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "10px",
              border: "1px solid rgba(59,110,59,0.15)"
            }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "6px" }}>
                🍎 iOS (Safari)
              </div>
              <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                Tap the Share button <span style={{ fontSize: "14px" }}>⎙</span> → "Add to Home Screen"
              </div>
            </div>

            <div style={{
              padding: "12px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "10px",
              border: "1px solid rgba(59,110,59,0.15)"
            }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "6px" }}>
                💻 Desktop (Chrome/Edge/Brave)
              </div>
              <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                Look for the install icon <span style={{ fontSize: "14px" }}>⊕</span> in the address bar
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          marginBottom: "20px",
          padding: "20px",
          background: "linear-gradient(135deg, rgba(167,211,167,0.08), rgba(111,175,111,0.04))",
          borderRadius: "16px",
          border: "1px solid rgba(111,175,111,0.15)"
        }}>
          <div style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#3B6E3B",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <LeafIcon size={20} fill="#3B6E3B" />
            <span>What makes TimeFlow special</span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: windowWidth < 640
              ? "1fr"
              : windowWidth < 1024
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
            gap: "14px"
          }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🔄</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Adaptive Rescheduling
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Running late? We'll help you find the next available slot or move tasks to tomorrow
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🌊</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Weekly Pool
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Capture tasks without time pressure, then select what to tackle each day
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>📝</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Daily Reflections
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  End each day with a moment of reflection on what went well
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🎯</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Focus Mode
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Hide distractions and focus on your current task with timer support
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🌿</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Calm Interface
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Nature-themed design that adapts throughout the day for mindful productivity
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>📊</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Weekly Overview
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Track your progress and reflections across the week at a glance
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🌱</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Gentle Streaks
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Growing plant rewards consistency with grace periods - no toxic pressure
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>⚠️</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Task Health Check
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Color-coded warnings for tasks you've been avoiding or are approaching deadlines
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>📅</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Deadline Tracking
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Set deadlines and get auto-escalating urgency as dates approach
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>✈️</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Works Offline
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Full offline support with 710KB cached - works with zero internet
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>⚡</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Instant Loading
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  Service worker caches everything for near-instant load times
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>🔄</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3B6E3B", marginBottom: "4px" }}>
                  Auto-Updates
                </div>
                <div style={{ fontSize: "12px", color: "#6B8E6B", lineHeight: "1.4" }}>
                  New versions download automatically in the background
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="actions-row">
          <button className="btn primary" onClick={validateAndSave}>Save & Continue</button>
          <button className="btn ghost" onClick={() => {
            const s = loadAvailability();
            if (s) { setStart(s.start); setEnd(s.end); } else { setStart("09:00"); setEnd("17:00"); }
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
