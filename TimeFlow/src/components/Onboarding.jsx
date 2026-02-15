import { useState } from "react";
import "../App.css";

function LeafIcon({ size = 24, fill = "#6FAF6F" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-45 12 12)" fill={fill} opacity="0.9" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="#2E6B2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function ProgressDots({ currentStep, totalSteps }) {
  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
      {[...Array(totalSteps)].map((_, i) => (
        <div
          key={i}
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: i <= currentStep ? "#3B6E3B" : "#cbd5e1",
            transition: "all 0.3s ease"
          }}
        />
      ))}
    </div>
  );
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card" style={{ maxWidth: "600px", animation: "fadeInUp 0.5s ease-out" }}>

        <ProgressDots currentStep={step} totalSteps={3} />

        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "16px" }}>🌿</div>
            <h1 className="title" style={{ fontSize: "32px", marginBottom: "16px" }}>Welcome to TimeFlow</h1>
            <p className="muted" style={{ fontSize: "17px", lineHeight: "1.7", marginBottom: "32px" }}>
              Your calm, nature-inspired companion for<br />
              focused work and mindful productivity.
            </p>

            <div style={{
              background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "32px",
              textAlign: "left"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                <div style={{ fontSize: "32px" }}>⏰</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px" }}>
                    Time Block Planning
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B8E6B" }}>
                    Schedule your day with visual time blocks
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                <div style={{ fontSize: "32px" }}>🎯</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px" }}>
                    Focus Timer
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B8E6B" }}>
                    Stay present with built-in task timers
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ fontSize: "32px" }}>🌙</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px" }}>
                    Daily Reflection
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B8E6B" }}>
                    End each day with gratitude and insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <h1 className="title" style={{ fontSize: "28px", marginBottom: "24px" }}>How It Works</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
              <div style={{
                background: "linear-gradient(90deg, rgba(111,175,111,0.08), rgba(167,211,167,0.04))",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                textAlign: "left",
                border: "2px solid rgba(111,175,111,0.15)"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6FAF6F, #3B6E3B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "900",
                  flexShrink: 0
                }}>
                  1
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px" }}>
                    Setup Your Day
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B8E6B" }}>
                    Set your available work hours and add tasks for the day
                  </div>
                </div>
              </div>

              <div style={{
                background: "linear-gradient(90deg, rgba(111,175,111,0.08), rgba(167,211,167,0.04))",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                textAlign: "left",
                border: "2px solid rgba(111,175,111,0.15)"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6FAF6F, #3B6E3B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "900",
                  flexShrink: 0
                }}>
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px" }}>
                    Work in Flow
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B8E6B" }}>
                    Start tasks and let the timer guide your focus
                  </div>
                </div>
              </div>

              <div style={{
                background: "linear-gradient(90deg, rgba(111,175,111,0.08), rgba(167,211,167,0.04))",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                textAlign: "left",
                border: "2px solid rgba(111,175,111,0.15)"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6FAF6F, #3B6E3B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "900",
                  flexShrink: 0
                }}>
                  3
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#3B6E3B", marginBottom: "4px" }}>
                    Reflect & Grow
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B8E6B" }}>
                    End your day with reflection and celebrate progress
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: "center" }}>
            <LeafIcon size={64} fill="#3B6E3B" />
            <h1 className="title" style={{ fontSize: "28px", marginTop: "16px", marginBottom: "16px" }}>
              You're All Set!
            </h1>
            <p className="muted" style={{ fontSize: "17px", lineHeight: "1.7", marginBottom: "32px" }}>
              Click below to begin your first TimeFlow session.<br />
              Start by setting your available work hours.
            </p>

            <div style={{
              background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px"
            }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#3B6E3B", marginBottom: "12px" }}>
                💡 Pro Tips
              </div>
              <ul style={{ textAlign: "left", margin: 0, paddingLeft: "24px", color: "#6B8E6B", fontSize: "14px", lineHeight: "1.8" }}>
                <li>Press <kbd style={{ padding: "2px 6px", background: "#e0f0e8", borderRadius: "4px", fontSize: "13px", fontWeight: "600" }}>F</kbd> to toggle Focus Mode</li>
                <li>Use the calendar view to see your day at a glance</li>
                <li>Unfinished tasks automatically carry over to tomorrow</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          {step > 0 && (
            <button
              onClick={handlePrevious}
              className="btn ghost"
              style={{ flex: 1 }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleSkip}
            className="btn ghost"
            style={{ flex: 1 }}
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="btn primary"
            style={{ flex: 2 }}
          >
            {step === 2 ? "Get Started →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
