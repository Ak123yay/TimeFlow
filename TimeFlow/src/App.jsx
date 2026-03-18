import React, { useState, useEffect, lazy, Suspense } from "react";
import Setup from "./components/Setup";
import Today from "./components/Today";
import DayReflection from "./components/DayReflection";
import Streak from "./components/Streak";
// OPTIMIZED: Lazy load WeeklyView, WeeklyPool, and Insights to reduce initial bundle size
const WeeklyView = lazy(() => import("./components/WeeklyView"));
const WeeklyPool = lazy(() => import("./components/WeeklyPool"));
const Insights = lazy(() => import("./components/Insights"));
import Onboarding from "./components/Onboarding";
import InstallPrompt from "./components/InstallPrompt";
import { IconProvider } from "./icons/IconContext";
import { loadAvailability } from "./utils/storage";
import { getTimePeriod } from "./utils/timeUtils";
import { useDarkMode } from "./utils/useDarkMode";
import { WarningIcon } from "./icons";
import "./App.css";

// Error view used by the class component above (wraps in hook-aware functional comp)
function ErrorFallback() {
  const isDark = useDarkMode();
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: isDark ? '#1A1F1A' : '#F8F8F8',
      color: isDark ? '#E8F0E8' : '#1A1A1A'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}><WarningIcon size={48} /></div>
      <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
        Something went wrong
      </div>
      <div style={{ fontSize: '14px', color: isDark ? '#9CA59C' : '#8E8E93', marginBottom: '24px' }}>
        Try refreshing the page
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 24px',
          background: '#3B6E3B',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Refresh Page
      </button>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

// Loading fallback component for lazy-loaded routes
function LoadingFallback() {
  const isDark = useDarkMode();

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: isDark ? '#1A1F1A' : '#F8F8F8', // Match MobileLayout background
      transition: 'background 0.3s ease'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: isDark ? '3px solid rgba(139,201,139,0.2)' : '3px solid rgba(59,110,59,0.2)',
          borderTopColor: isDark ? '#8BC98B' : '#3B6E3B',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }} />
        <div style={{
          color: isDark ? '#8BC98B' : '#3B6E3B',
          fontWeight: 600,
          fontSize: '15px',
          fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial'
        }}>
          Loading...
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(() => {
    return localStorage.getItem('onboardingCompleted') === 'true';
  });

  const [setupDone, setSetupDone] = useState(() => {
    const availability = loadAvailability();
    return !!(availability && availability.start && availability.end);
  });

  const [currentView, setCurrentView] = useState('today'); // 'today' | 'reflection' | 'week' | 'pool' | 'streak' | 'insights'
  const [timePeriod, setTimePeriod] = useState(getTimePeriod());

  // Hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/week') {
        setCurrentView('week');
      } else if (hash === '#/reflection') {
        setCurrentView('reflection');
      } else if (hash === '#/pool') {
        setCurrentView('pool');
      } else if (hash === '#/streak') {
        setCurrentView('streak');
      } else if (hash === '#/insights') {
        setCurrentView('insights');
      } else {
        setCurrentView('today');
      }
    };

    handleHashChange(); // Initial
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update time period every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimePeriod(getTimePeriod());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const showReflection = () => {
    window.location.hash = '#/reflection';
  };

  const showWeek = () => {
    window.location.hash = '#/week';
  };

  const showPool = () => {
    window.location.hash = '#/pool';
  };

  const showStreak = () => {
    window.location.hash = '#/streak';
  };

  const showToday = () => {
    window.location.hash = '#/today';
  };

  const showInsights = () => {
    window.location.hash = '#/insights';
  };

  return (
    <IconProvider>
      <div className={`App app-${timePeriod}`}>
        {/* Floating leaves background */}
        <div className="floating-leaves" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="floating-leaf"
              style={{
                left: `${20 + i * 20}%`,
                animationDelay: `${i * 4}s`,
                '--drift': `${(Math.random() - 0.5) * 200}px`
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-45 12 12)" fill="#6FAF6F" opacity="0.3" />
                <line x1="6" y1="18" x2="18" y2="6" stroke="#2E6B2E" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
              </svg>
            </div>
          ))}
        </div>

        {!onboardingDone ? (
          <Onboarding onComplete={() => setOnboardingDone(true)} />
        ) : !setupDone ? (
          <Setup onDone={() => setSetupDone(true)} />
        ) : currentView === 'reflection' ? (
          <ErrorBoundary>
            <DayReflection
              todayDate={new Date().toISOString().slice(0, 10)}
              onComplete={showToday}
            />
          </ErrorBoundary>
        ) : currentView === 'week' ? (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <WeeklyView onBackToToday={showToday} />
            </Suspense>
          </ErrorBoundary>
        ) : currentView === 'pool' ? (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <WeeklyPool onNavigateToToday={showToday} />
            </Suspense>
          </ErrorBoundary>
        ) : currentView === 'streak' ? (
          <ErrorBoundary>
            <Streak onNavigate={(view) => {
              if (view === 'today') showToday();
              else if (view === 'week') showWeek();
              else if (view === 'pool') showPool();
              else if (view === 'stats') showReflection();
            }} />
          </ErrorBoundary>
        ) : currentView === 'insights' ? (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Insights onNavigate={(view) => {
                if (view === 'today') showToday();
                else if (view === 'week') showWeek();
                else if (view === 'pool') showPool();
                else if (view === 'streak') showStreak();
                else if (view === 'stats') showReflection();
              }} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <ErrorBoundary>
            <Today onEndDay={showReflection} onShowWeek={showWeek} onShowPool={showPool} />
          </ErrorBoundary>
        )}

        {/* PWA Install Prompt */}
        {onboardingDone && setupDone && <InstallPrompt />}
      </div>
    </IconProvider>
  );
}
