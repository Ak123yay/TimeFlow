import { useState, useEffect } from 'react';
import MobileLayout from './mobile/MobileLayout';
import { haptic } from '../utils/haptics';
import { useDarkMode } from '../utils/useDarkMode';
import { usePageTransition, useScrollReveal } from '../utils/useAnimations';
import {
  suggestDuration,
  getAllHourlyCompletionRates,
  getEstimationBias,
  getRescheduleOptionFrequencies,
} from '../utils/analytics';
import {
  getProductivityScoreHistory,
  getProductivityTrend,
  calculateProductivityScore,
} from '../utils/storage';
import {
  ChartIcon,
  TargetIcon,
  BoltIcon,
  CheckmarkIcon,
  StopwatchIcon,
  ClockIcon,
  CalendarIcon,
  WaterIcon,
  HammerIcon,
  TargetIcon as TargetIcon2,
  BulbIcon,
  RefreshIcon,
} from '../icons';

// Pure helpers — defined outside component so they aren't recreated on every render
function calculateTrend(values) {
  if (values.length < 5) return 'neutral';
  const recent = values.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const older = values.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
  if (recent - older > 5) return 'improving';
  if (older - recent > 5) return 'declining';
  return 'stable';
}

function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}${ampm}`;
}

export default function Insights({ onNavigate }) {
  const isDark = useDarkMode();
  const { ref: pageRef } = usePageTransition();
  const statsRef = useScrollReveal({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [accuracyStats, setAccuracyStats] = useState(null);
  const [energyPattern, setEnergyPattern] = useState(null);
  const [frequentTasks, setFrequentTasks] = useState([]);
  const [estimationBias, setEstimationBias] = useState(null);
  const [rescheduleHabits, setRescheduleHabits] = useState({});
  const [productivityStats, setProductivityStats] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Calculate accuracy stats from task history
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');
    } catch (e) {
      console.warn('Failed to parse task history:', e);
    }

    if (history.length > 0) {
      // Filter out entries with invalid duration data
      const validHistory = history.filter(h =>
        h.estimatedDuration > 0 && h.actualDuration > 0
      );

      if (validHistory.length > 0) {
        const accuracies = validHistory.map(h => {
          const diff = Math.abs(h.estimatedDuration - h.actualDuration);
          return Math.max(0, 100 - (diff / h.estimatedDuration) * 100);
        });

        const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
        const trend = calculateTrend(accuracies);

        setAccuracyStats({
          average: Math.round(avgAccuracy),
          totalTasks: validHistory.length,
          trend,
          recentAvg: Math.round(
            accuracies.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, accuracies.length)
          )
        });
      }
    }

    // Get energy patterns
    let energyPatternsData = {};
    try {
      energyPatternsData = JSON.parse(localStorage.getItem('timeflow-energy-patterns') || '{}');
    } catch (e) {
      console.warn('Failed to parse energy patterns:', e);
    }

    if (energyPatternsData.hourlyCompletionRates) {
      const hourlyRates = getAllHourlyCompletionRates();

      const bestHours = Object.entries(hourlyRates)
        .filter(([hour, rate]) => rate > 0) // Only show hours with actual data
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour, rate]) => ({
          hour: parseInt(hour),
          rate: Math.round(rate * 100)
        }));

      if (bestHours.length > 0) {
        setEnergyPattern(bestHours);
      }
    }

    // Find frequent tasks for suggestions
    const taskCounts = {};
    history.forEach(h => {
      if (h.name) {
        const normalized = h.name.toLowerCase().trim();
        taskCounts[normalized] = (taskCounts[normalized] || 0) + 1;
      }
    });

    const frequent = Object.entries(taskCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => {
        const suggestion = suggestDuration(name);
        return { name, count, suggestion };
      })
      .filter(t => t.suggestion !== null);

    setFrequentTasks(frequent);

    // Estimation bias
    const bias = getEstimationBias();
    if (bias.bias !== 'unknown') setEstimationBias(bias);

    // Reschedule habits
    const freqs = getRescheduleOptionFrequencies();
    if (Object.keys(freqs).length > 0) setRescheduleHabits(freqs);

    // Calculate productivity score stats
    try {
      const today = new Date().toISOString().slice(0, 10);
      const todayScore = calculateProductivityScore(today);
      const scoreHistory = getProductivityScoreHistory(30);
      const trend = getProductivityTrend(7);

      // Calculate average score from history
      const validScores = scoreHistory.filter(h => h.score > 0);
      const avgScore = validScores.length > 0
        ? Math.round(validScores.reduce((sum, h) => sum + h.score, 0) / validScores.length)
        : 0;

      setProductivityStats({
        today: todayScore,
        average: avgScore,
        trend,
        history: scoreHistory,
        daysWithData: validScores.length
      });
    } catch (e) {
      console.error('Error loading productivity stats:', e);
    }

  }, []);

  if (isMobile) {

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
            Insights
          </h1>
          <p style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0 }}>
            Learn from your task patterns
          </p>
        </div>

        {/* Productivity Score Card */}
        {productivityStats && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '18px',
            padding: '18px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
            borderLeft: `4px solid ${
              productivityStats.today >= 80 ? '#10b981' :
              productivityStats.today >= 50 ? '#f59e0b' : '#ef4444'
            }`
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
              Daily Productivity Score
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: productivityStats.today >= 80 ? '#10b981' :
                    productivityStats.today >= 50 ? '#f59e0b' : '#ef4444'
                }}>
                  {productivityStats.today}%
                </div>
                <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '4px' }}>
                  Today's score
                </div>
              </div>
              <div style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: productivityStats.trend === 'improving' ? 'rgba(16,185,129,0.1)' :
                  productivityStats.trend === 'declining' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                color: productivityStats.trend === 'improving' ? '#10b981' :
                  productivityStats.trend === 'declining' ? '#ef4444' : '#fbbf24',
                fontSize: '12px',
                fontWeight: 600
              }}>
                {productivityStats.trend === 'improving' ? '↗ Improving' :
                  productivityStats.trend === 'declining' ? '↘ Declining' : '→ Stable'}
              </div>
            </div>
            <div style={{
              marginTop: '12px',
              height: '6px',
              background: isDark ? '#1A1F1A' : '#F0F0F0',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${productivityStats.today}%`,
                background: productivityStats.today >= 80 ? '#10b981' :
                  productivityStats.today >= 50 ? '#f59e0b' : '#ef4444',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: isDark ? '#9CA59C' : '#6B8E6B' }}>
              7-day average: {productivityStats.average}% • {productivityStats.daysWithData} days tracked
            </div>
          </div>
        )}

        {/* Duration Accuracy Card */}
        {accuracyStats && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '18px',
            padding: '18px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
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
                borderRadius: '10px',
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

        {/* Estimation Bias Card */}
        {estimationBias && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '18px',
            padding: '18px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
              Estimation Bias
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                padding: '8px 14px', borderRadius: '12px', fontWeight: 700, fontSize: '13px',
                background: estimationBias.bias === 'accurate' ? 'rgba(16,185,129,0.1)' :
                  estimationBias.bias === 'underestimate' ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                color: estimationBias.bias === 'accurate' ? '#10b981' :
                  estimationBias.bias === 'underestimate' ? '#d97706' : '#6366f1',
              }}>
                {estimationBias.bias === 'accurate' ? '✓ On Target' :
                  estimationBias.bias === 'underestimate' ? `↑ Under by ${estimationBias.avgDiffPercent}%` :
                    `↓ Over by ${Math.abs(estimationBias.avgDiffPercent)}%`}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93' }}>
                {estimationBias.sampleSize} tasks analysed
              </div>
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#A8C8A8' : '#2E5E2E', lineHeight: 1.5 }}>
              {estimationBias.suggestion}
            </div>
          </div>
        )}

        {/* Energy Patterns Card */}
        {energyPattern && energyPattern.length > 0 && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '18px',
            padding: '18px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
              Your Best Hours
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {energyPattern.map((slot, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: isDark ? '#1A1F1A' : '#F5F5F5',
                  borderRadius: '12px'
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
              Schedule important tasks during these hours for best results
            </div>
          </div>
        )}

        {/* Reschedule Habits Card */}
        {Object.keys(rescheduleHabits).length > 0 && (() => {
          const LABELS = {
            complete: { icon: () => <CheckmarkIcon size={14} />, label: 'Completed' },
            continue: { icon: () => <StopwatchIcon size={14} />, label: 'Kept going' },
            later_today: { icon: () => <ClockIcon size={14} />, label: 'Later today' },
            tomorrow: { icon: () => <CalendarIcon size={14} />, label: 'Tomorrow' },
            back_to_pool: { icon: () => <WaterIcon size={14} />, label: 'Back to pool' },
            break_task: { icon: () => <HammerIcon size={14} />, label: 'Broke it up' },
            pick_time: { icon: () => <TargetIcon size={14} />, label: 'Picked a time' },
          };
          const entries = Object.entries(rescheduleHabits).sort(([, a], [, b]) => b - a);
          const total = entries.reduce((s, [, v]) => s + v, 0);
          return (
            <div style={{
              background: isDark ? '#242B24' : '#fff',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '14px',
              boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
                Reschedule Habits
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {entries.map(([key, count]) => {
                  const meta = LABELS[key] || { icon: '•', label: key };
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>{typeof meta.icon === 'function' ? meta.icon() : meta.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>{meta.label}</span>
                          <span style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93' }}>{count}×  ({pct}%)</span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '2px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '2px', background: key === 'complete' ? '#4CAF50' : isDark ? '#5A7A5A' : '#8BBB8B', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Frequent Tasks with Suggestions */}
        {frequentTasks.length > 0 && (
          <div style={{
            background: isDark ? '#242B24' : '#fff',
            borderRadius: '18px',
            padding: '18px',
            marginBottom: '14px',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 12px' }}>
              Smart Suggestions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {frequentTasks.map((task, idx) => {
                return (
                  <div key={idx} style={{
                    padding: '14px',
                    background: isDark ? '#1A1F1A' : '#F5F5F5',
                    borderRadius: '14px'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A', marginBottom: '4px' }}>
                      {task.name}
                    </div>
                    <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', marginBottom: '6px' }}>
                      Completed {task.count} times
                    </div>
                    {task.suggestion && task.suggestion.suggested ? (
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
                    ) : (
                      <div style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', fontStyle: 'italic' }}>
                        Need more data for suggestion (minimum 3 completions)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!accuracyStats && !estimationBias && Object.keys(rescheduleHabits).length === 0 && (!energyPattern || energyPattern.length === 0) && frequentTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}><ChartIcon size={48} /></div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A', margin: '0 0 4px' }}>
              No Insights Yet
            </p>
            <p style={{ fontSize: '13px', color: isDark ? '#9CA59C' : '#8E8E93', margin: '0 0 16px' }}>
              Complete tasks using the timer to generate personalized insights
            </p>
            <div style={{
              background: isDark ? '#242B24' : '#fff',
              borderRadius: '16px',
              padding: '18px',
              textAlign: 'left',
              maxWidth: '300px',
              margin: '0 auto',
              border: `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#E8F0E8' : '#1A1A1A', marginBottom: '8px' }}>
                To start tracking insights:
              </div>
              <ol style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '6px' }}>Create a task with a duration</li>
                <li style={{ marginBottom: '6px' }}>Start the timer</li>
                <li style={{ marginBottom: '6px' }}>Complete the task (or let timer finish)</li>
                <li>Mark as complete in the modal</li>
              </ol>
            </div>
            <p style={{ fontSize: '11px', color: isDark ? '#9CA59C' : '#8E8E93', margin: '16px 0 0', fontStyle: 'italic' }}>
              Open browser console (F12) to see debug info
            </p>
          </div>
        )}
      </MobileLayout>
    );
  }

  // Desktop render (simplified for now)
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: isDark ? '#E8F0E8' : '#1A1A1A', marginBottom: '8px' }}>
        Insights
      </h1>
      <p style={{ fontSize: '16px', color: isDark ? '#9CA59C' : '#8E8E93', marginBottom: '32px' }}>
        Desktop view coming soon. Please use mobile view for now.
      </p>
    </div>
  );
}
