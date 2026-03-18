import { useState, useEffect } from 'react';
import MobileLayout from './mobile/MobileLayout';
import FirstTimeTooltip from './FirstTimeTooltip';
import { hasSeenTooltip, markTooltipSeen, TOOLTIP_CONTENT } from "../utils/firstTimeTooltips";
import { getReflectionHistory } from '../utils/storage';
import { loadStreak } from '../utils/streaks';
import { haptic } from '../utils/haptics';
import { useDarkMode } from '../utils/useDarkMode';
import {
  LeafIcon,
  FireIcon,
  TrophyIcon,
  ChartIcon,
  TargetIcon,
  StarIcon,
  HappyIcon,
  ContentIcon,
  NeutralIcon,
  SadIcon,
  SproutIcon,
} from '../icons';

export default function Streak({ onNavigate }) {
  const isDark = useDarkMode();
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastActive: null });
  const [reflections, setReflections] = useState([]);
  const [showTooltip, setShowTooltip] = useState(() => !hasSeenTooltip('streak'));

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Load streak data
    const streakData = loadStreak();
    setStreak(streakData);

    // Load recent reflections
    const history = getReflectionHistory();
    setReflections(history.slice(0, 7)); // Last 7 days
  }, []);

  const getStreakMessage = () => {
    if (streak.current === 0) return "Start your streak today!";
    if (streak.current === 1) return "Great start! Keep it going!";
    if (streak.current < 7) return "Building momentum!";
    if (streak.current < 30) return "You're on fire!";
    if (streak.current < 100) return "Incredible dedication!";
    return "Legendary streak!";
  };

  const getDaysUntilMilestone = () => {
    const milestones = [7, 30, 100, 365];
    const next = milestones.find(m => m > streak.current);
    return next ? next - streak.current : null;
  };

  if (isMobile) {
    return (
      <MobileLayout
        showBottomNav={true}
        onNavigate={(tab) => {
          haptic.light();
          if (tab === 'today') onNavigate('today');
          else if (tab === 'week') onNavigate('week');
          else if (tab === 'pool') onNavigate('pool');
          else if (tab === 'stats') onNavigate('stats');
        }}
        activeTab="streak"
      >
        {/* Header */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Your Streak
          </h1>
          <p style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
            Track your daily progress
          </p>
        </div>

        {/* First-Time Tooltip */}
        {showTooltip && (
          <FirstTimeTooltip
            title={TOOLTIP_CONTENT.streak.title}
            description={TOOLTIP_CONTENT.streak.description}
            icon={TOOLTIP_CONTENT.streak.icon}
            onDismiss={() => {
              setShowTooltip(false);
              markTooltipSeen('streak');
            }}
          />
        )}

        {/* Current Streak Card */}
        <div style={{
          background: 'linear-gradient(135deg, #3B6E3B 0%, #2E5A2E 100%)',
          borderRadius: '20px', padding: '24px', marginBottom: '14px',
          boxShadow: '0 4px 12px rgba(59,110,59,0.15), 0 12px 32px rgba(59,110,59,0.2)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            {streak.current}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: '8px' }}>
            Day Streak
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
            {getStreakMessage()}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            background: isDark ? 'rgba(36,43,36,0.8)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '18px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(59,110,59,0.1)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,110,59,0.1)'}`,
            textAlign: 'center',
            transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#3B6E3B' }}>
              {streak.longest}
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '4px' }}>Longest Streak</div>
          </div>

          <div style={{
            background: isDark ? 'rgba(36,43,36,0.8)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '18px',
            padding: '18px',
            boxShadow: '0 2px 8px rgba(59,110,59,0.1)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,110,59,0.1)'}`,
            textAlign: 'center',
            transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#3B6E3B' }}>
              {reflections.length}
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '4px' }}>Total Days</div>
          </div>
        </div>

        {/* Insights Card */}
        <div
          onClick={() => {
            haptic.light();
            window.location.hash = '#/insights';
          }}
          style={{
            background: isDark ? 'rgba(36,43,36,0.8)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '14px',
            boxShadow: '0 2px 8px rgba(59,110,59,0.1)',
            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,110,59,0.1)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(59,110,59,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <ChartIcon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
              View Insights
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>
              Time accuracy, best hours, and smart suggestions
            </div>
          </div>
          <div style={{ fontSize: '18px', color: isDark ? '#9CA59C' : '#8E8E93' }}>
            →
          </div>
        </div>

        {/* Next Milestone */}
        {getDaysUntilMilestone() && (
          <div style={{
            background: isDark ? 'rgba(36,43,36,0.8)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '14px',
            boxShadow: '0 2px 8px rgba(59,110,59,0.1)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,110,59,0.1)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(59,110,59,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '20px'
            }}>
              <TargetIcon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
                Next Milestone
              </div>
              <div style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>
                {getDaysUntilMilestone()} more {getDaysUntilMilestone() === 1 ? 'day' : 'days'} to reach {streak.current + getDaysUntilMilestone()} days!
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {reflections.length > 0 && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 10px', paddingLeft: '2px' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reflections.map((ref, idx) => (
                <div key={idx} style={{
                  background: isDark ? '#242B24' : '#fff', borderRadius: '16px', padding: '14px 16px',
                  boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: ref.mood === 'great' ? 'rgba(16,185,129,0.1)' :
                      ref.mood === 'good' ? 'rgba(111,175,111,0.1)' :
                        ref.mood === 'okay' ? 'rgba(251,191,36,0.1)' : 'rgba(245,158,11,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {ref.mood === 'great' ? <StarIcon size={18} /> : ref.mood === 'good' ? <HappyIcon size={18} /> : ref.mood === 'okay' ? <NeutralIcon size={18} /> : <SadIcon size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
                      {ref.date}
                    </div>
                    <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>
                      {ref.completedCount}/{ref.totalCount} tasks • {Math.floor(ref.timeSpent / 60)}h {ref.timeSpent % 60}m
                    </div>
                  </div>
                  <LeafIcon size={16} fill="#3B6E3B" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {reflections.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}><SproutIcon size={48} /></div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 4px' }}>
              Start Your Journey
            </p>
            <p style={{ fontSize: '13px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
              Complete your first day to build your streak
            </p>
          </div>
        )}
      </MobileLayout>
    );
  }

  // Desktop render
  return (
    <div className="setup-fullscreen nat-bg">
      <div className="setup-inner nat-card" style={{ maxWidth: "700px" }}>
        <div className="setup-header" style={{ marginBottom: "22px" }}>
          <h1 className="title" style={{ fontSize: "24px" }}>Your Streak</h1>
          <p className="muted" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LeafIcon size={14} fill="#6B8E6B" />
            Track your daily progress
          </p>
        </div>

        {/* Desktop content - similar structure */}
        <div style={{
          background: 'linear-gradient(135deg, #3B6E3B 0%, #2E5A2E 100%)',
          borderRadius: '24px', padding: '40px', marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(59,110,59,0.15), 0 12px 32px rgba(59,110,59,0.2)', textAlign: 'center'
        }}>
          <div style={{ fontSize: '96px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            {streak.current}
          </div>
          <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginTop: '12px' }}>
            Day Streak
          </div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
            {getStreakMessage()}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '24px',
            border: '1.5px solid rgba(111,175,111,0.15)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#3B6E3B' }}>
              {streak.longest}
            </div>
            <div style={{ fontSize: '14px', color: '#6B8E6B', marginTop: '8px' }}>Longest Streak</div>
          </div>

          <div style={{
            background: '#fff', borderRadius: '20px', padding: '24px',
            border: '1.5px solid rgba(111,175,111,0.15)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#3B6E3B' }}>
              {reflections.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6B8E6B', marginTop: '8px' }}>Total Days</div>
          </div>
        </div>

        {reflections.length > 0 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#3B6E3B', marginBottom: '16px' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reflections.map((ref, idx) => (
                <div key={idx} style={{
                  background: '#fff', borderRadius: '20px', padding: '18px 22px',
                  border: '1.5px solid rgba(111,175,111,0.15)',
                  display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: ref.mood === 'great' ? 'rgba(16,185,129,0.1)' :
                      ref.mood === 'good' ? 'rgba(111,175,111,0.1)' :
                        ref.mood === 'okay' ? 'rgba(251,191,36,0.1)' : 'rgba(245,158,11,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {ref.mood === 'great' ? <StarIcon size={18} /> : ref.mood === 'good' ? <HappyIcon size={18} /> : ref.mood === 'okay' ? <NeutralIcon size={18} /> : <SadIcon size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#3B6E3B' }}>
                      {ref.date}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B8E6B', marginTop: '4px' }}>
                      {ref.completedCount}/{ref.totalCount} tasks completed • {Math.floor(ref.timeSpent / 60)}h {ref.timeSpent % 60}m
                    </div>
                  </div>
                  <LeafIcon size={20} fill="#3B6E3B" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
