import { useState, useEffect, lazy, Suspense } from "react";
import Setup from "./components/Setup";
import Today from "./components/Today";
import DayReflection from "./components/DayReflection";
import Streak from "./components/Streak";
// OPTIMIZED: Lazy load WeeklyView and WeeklyPool to reduce initial bundle size
const WeeklyView = lazy(() => import("./components/WeeklyView"));
const WeeklyPool = lazy(() => import("./components/WeeklyPool"));
import Onboarding from "./components/Onboarding";
import { loadAvailability } from "./utils/storage";
import { getTimePeriod } from "./utils/timeUtils";
import "./App.css";

// Loading fallback component for lazy-loaded routes
function LoadingFallback() {
  // Get current time period for matching background
  const period = getTimePeriod();
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const periodClass = period === 'evening' || period === 'night'
    ? 'app-night'
    : period === 'dawn'
    ? 'app-dawn'
    : period === 'dusk'
    ? 'app-dusk'
    : '';

  return (
    <div className={periodClass} style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: period === 'evening' || period === 'night'
        ? isDark ? 'linear-gradient(135deg, #1A2225, #171C1A)' : 'linear-gradient(135deg, #E8F4F8, #E0F0E8)'
        : period === 'dawn'
        ? isDark ? 'linear-gradient(135deg, #2A1F1F, #1A1F1A)' : 'linear-gradient(135deg, #FFF5F5, #F0F8F2)'
        : period === 'dusk'
        ? isDark ? 'linear-gradient(135deg, #251F2A, #1A1F1A)' : 'linear-gradient(135deg, #F5F0FF, #F0F8F2)'
        : isDark ? '#1A1F1A' : '#F0F8F2',
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

  const [currentView, setCurrentView] = useState('today'); // 'today' | 'reflection' | 'week' | 'pool' | 'streak'
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

  return (
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
        <DayReflection
          todayDate={new Date().toISOString().slice(0, 10)}
          onComplete={showToday}
        />
      ) : currentView === 'week' ? (
        <Suspense fallback={<LoadingFallback />}>
          <WeeklyView onBackToToday={showToday} />
        </Suspense>
      ) : currentView === 'pool' ? (
        <Suspense fallback={<LoadingFallback />}>
          <WeeklyPool onNavigateToToday={showToday} />
        </Suspense>
      ) : currentView === 'streak' ? (
        <Streak onNavigate={(view) => {
          if (view === 'today') showToday();
          else if (view === 'week') showWeek();
          else if (view === 'pool') showPool();
          else if (view === 'stats') showReflection();
        }} />
      ) : (
        <Today onEndDay={showReflection} onShowWeek={showWeek} onShowPool={showPool} />
      )}
    </div>
  );
}
