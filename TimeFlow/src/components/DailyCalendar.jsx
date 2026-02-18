import { haptic } from '../utils/haptics';
import { loadTasksForDate } from '../utils/storage';

/**
 * DailyCalendar - Simple view showing just today's date and stats
 */
export default function DailyCalendar() {
  const today = new Date();
  const dateString = today.toISOString().slice(0, 10);
  const tasks = loadTasksForDate(dateString);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  const dayOfMonth = today.getDate();
  const year = today.getFullYear();

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))',
      border: '1.5px solid rgba(111,175,111,0.25)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px'
    }}>
      {/* Date Display */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#3B6E3B',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px'
        }}>
          {dayOfWeek}
        </div>
        <div style={{
          fontSize: '48px',
          fontWeight: 900,
          color: '#1A1A1A',
          lineHeight: 1,
          marginBottom: '4px'
        }}>
          {dayOfMonth}
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#6B8E6B'
        }}>
          {month} {year}
        </div>
      </div>

      {/* Task Stats */}
      {totalTasks > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#6B8E6B'
            }}>
              Today's Progress
            </span>
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#3B6E3B'
            }}>
              {completedTasks}/{totalTasks}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '6px',
            background: 'rgba(209,213,219,0.5)',
            borderRadius: '99px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${completionRate}%`,
              background: completionRate === 100
                ? '#10b981'
                : completionRate >= 75
                ? '#6FAF6F'
                : completionRate >= 50
                ? '#fbbf24'
                : '#f59e0b',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#8E8E93',
            textAlign: 'center'
          }}>
            {completionRate}% complete
          </div>
        </div>
      )}

      {totalTasks === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '12px',
          fontSize: '13px',
          color: '#8E8E93'
        }}>
          No tasks scheduled for today
        </div>
      )}
    </div>
  );
}
