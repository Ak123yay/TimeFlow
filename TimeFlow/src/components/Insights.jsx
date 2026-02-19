import { useState, useEffect } from 'react';
import MobileLayout from './mobile/MobileLayout';
import { haptic } from '../utils/haptics';
import {
  suggestDuration,
  getAllHourlyCompletionRates
} from '../utils/analytics';

export default function Insights({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [accuracyStats, setAccuracyStats] = useState(null);
  const [energyPattern, setEnergyPattern] = useState(null);
  const [frequentTasks, setFrequentTasks] = useState([]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Calculate accuracy stats from task history
    const history = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');

    if (history.length > 0) {
      const accuracies = history.map(h => {
        const diff = Math.abs(h.estimatedDuration - h.actualDuration);
        return Math.max(0, 100 - (diff / h.estimatedDuration) * 100);
      });

      const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
      const trend = calculateTrend(accuracies);

      setAccuracyStats({
        average: Math.round(avgAccuracy),
        totalTasks: history.length,
        trend,
        recentAvg: Math.round(
          accuracies.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, accuracies.length)
        )
      });
    }

    // Get energy patterns
    const hourlyRates = getAllHourlyCompletionRates();
    const bestHours = Object.entries(hourlyRates)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, rate]) => ({
        hour: parseInt(hour),
        rate: Math.round(rate * 100)
      }));

    setEnergyPattern(bestHours);

    // Find frequent tasks for suggestions
    const taskCounts = {};
    history.forEach(h => {
      const normalized = h.name.toLowerCase().trim();
      taskCounts[normalized] = (taskCounts[normalized] || 0) + 1;
    });

    const frequent = Object.entries(taskCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => {
        const suggestion = suggestDuration(name);
        return { name, count, suggestion };
      })
      .filter(t => t.suggestion !== null);

    setFrequentTasks(frequent);

  }, []);

  const calculateTrend = (values) => {
    if (values.length < 5) return 'neutral';
    const recent = values.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const older = values.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
    if (recent - older > 5) return 'improving';
    if (older - recent > 5) return 'declining';
    return 'stable';
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}${ampm}`;
  };

  if (isMobile) {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
      <MobileLayout
        showBottomNav={true}
        onNavigate={(tab) => {
          haptic.light();
          if (tab === 'today') onNavigate('today');
          else if (tab === 'week') onNavigate('week');
          else if (tab === 'pool') onNavigate('pool');
          else if (tab === 'streak') onNavigate('streak');
        }}
        activeTab="stats"
      >
        {/* Header */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 4px' }}>
            Insights 📊
          </h1>
          <p style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
            Learn from your task patterns
          </p>
        </div>

        {/* Duration Accuracy Card */}
        {accuracyStats && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
              Time Estimation Accuracy
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#3B6E3B' }}>
                  {accuracyStats.average}%
                </div>
                <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '4px' }}>
                  Average accuracy ({accuracyStats.totalTasks} tasks)
                </div>
              </div>
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: accuracyStats.trend === 'improving' ? 'rgba(16,185,129,0.1)' :
                           accuracyStats.trend === 'declining' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                color: accuracyStats.trend === 'improving' ? '#10b981' :
                       accuracyStats.trend === 'declining' ? '#ef4444' : '#fbbf24',
                fontSize: '12px',
                fontWeight: 600
              }}>
                {accuracyStats.trend === 'improving' ? '↗ Improving' :
                 accuracyStats.trend === 'declining' ? '↘ Declining' : '→ Stable'}
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: isDark ? '#9CA59C' : '#6B8E6B' }}>
              Recent 5 tasks: {accuracyStats.recentAvg}%
            </div>
          </div>
        )}

        {/* Energy Patterns Card */}
        {energyPattern && energyPattern.length > 0 && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
              Your Best Hours ⚡
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {energyPattern.map((slot, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  background: isDark ? '#1A1F1A' : '#F5F5F5',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(59,110,59,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#3B6E3B'
                  }}>
                    #{idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
                      {formatHour(slot.hour)} - {formatHour(slot.hour + 1)}
                    </div>
                    <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93' }}>
                      {slot.rate}% completion rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '11px', color: isDark ? '#9CA59C' : '#6B8E6B', fontStyle: 'italic' }}>
              💡 Schedule important tasks during these hours for best results
            </div>
          </div>
        )}

        {/* Frequent Tasks with Suggestions */}
        {frequentTasks.length > 0 && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
              Smart Suggestions 💡
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {frequentTasks.map((task, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  background: isDark ? '#1A1F1A' : '#F5F5F5',
                  borderRadius: '10px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A', marginBottom: '4px' }}>
                    {task.name}
                  </div>
                  <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', marginBottom: '6px' }}>
                    Completed {task.count} times
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#3B6E3B',
                    fontWeight: 600
                  }}>
                    Suggested: {task.suggestion.suggested}min
                    <span style={{
                      fontSize: '10px',
                      color: isDark ? '#9CA59C' : '#8E8E93',
                      fontWeight: 400
                    }}>
                      ({task.suggestion.min}-{task.suggestion.max}min)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!accuracyStats && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 4px' }}>
              No Insights Yet
            </p>
            <p style={{ fontSize: '13px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
              Complete tasks to generate personalized insights
            </p>
          </div>
        )}
      </MobileLayout>
    );
  }

  // Desktop render (simplified for now)
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A', marginBottom: '8px' }}>
        Insights 📊
      </h1>
      <p style={{ fontSize: '16px', color: isDark ? '#9CA59C' : '#8E8E93', marginBottom: '32px' }}>
        Desktop view coming soon. Please use mobile view for now.
      </p>
    </div>
  );
}
