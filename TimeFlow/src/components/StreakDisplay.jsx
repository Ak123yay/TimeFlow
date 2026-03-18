import { getPlantEmoji, getStreakMessage, getPlantColors } from '../utils/streaks';
import {
  TrophyIcon,
  CalendarIcon,
  LiferingIcon,
} from '../icons';

export default function StreakDisplay({ streak, compact = false }) {
  if (!streak || streak.current === 0) {
    return null;
  }

  const plantEmoji = getPlantEmoji(streak.plantStage);
  const message = getStreakMessage(streak);
  const colors = getPlantColors(streak.plantStage);

  if (compact) {
    // Minimal display for header
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}08)`,
        borderRadius: '9999px',
        border: `1px solid ${colors.primary}30`,
        fontSize: '13px',
        fontWeight: '600',
        color: colors.primary
      }}>
        <span style={{ fontSize: '16px' }}>{plantEmoji}</span>
        <span>{streak.current} day{streak.current !== 1 ? 's' : ''}</span>
        {streak.graceAvailable && (
          <span style={{
            fontSize: '10px',
            padding: '2px 5px',
            background: '#f59e0b20',
            color: '#d97706',
            borderRadius: '4px',
            marginLeft: '4px'
          }}>
            +1 grace
          </span>
        )}
      </div>
    );
  }

  // Full display for detailed view
  return (
    <div style={{
      padding: '16px 20px',
      background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}05)`,
      borderRadius: '12px',
      border: `1px solid ${colors.primary}20`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: `radial-gradient(circle, ${colors.primary}08, transparent)`,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '36px',
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}>
            {plantEmoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              color: colors.primary,
              lineHeight: 1.2
            }}>
              {streak.current} day{streak.current !== 1 ? 's' : ''}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6B8E6B',
              marginTop: '2px'
            }}>
              {message}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {/* Streak progress bar */}
          <div style={{
            flex: 1,
            height: '6px',
            background: '#E8F5E8',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(100, (streak.current / 30) * 100)}%`,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: '9999px',
              transition: 'width 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              boxShadow: `0 0 8px ${colors.primary}40`
            }} />
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '12px',
            fontSize: '11px',
            color: '#6B8E6B',
            fontWeight: '600'
          }}>
            {streak.longest > streak.current && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <span style={{ fontSize: '14px' }}><TrophyIcon size={14} /></span>
                <span>Best: {streak.longest}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              <span style={{ fontSize: '14px' }}><CalendarIcon size={14} /></span>
              <span>Total: {streak.totalActiveDays}</span>
            </div>
          </div>
        </div>

        {/* Grace token indicator */}
        {!streak.graceAvailable && (
          <div style={{
            marginTop: '10px',
            fontSize: '11px',
            padding: '6px 10px',
            background: 'rgba(245,158,11,0.1)',
            borderRadius: '6px',
            color: '#d97706',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span><LiferingIcon size={16} /></span>
            <span>Grace used this week • Resets Monday</span>
          </div>
        )}

        {streak.graceAvailable && (
          <div style={{
            marginTop: '10px',
            fontSize: '11px',
            color: '#6B8E6B',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span><LiferingIcon size={16} /></span>
            <span>1 grace day available</span>
          </div>
        )}
      </div>
    </div>
  );
}
