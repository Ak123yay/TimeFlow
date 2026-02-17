import { useState } from 'react';
import { loadTasksForDate } from '../utils/storage';
import { haptic } from '../utils/haptics';

/**
 * CalendarView - Clean monthly calendar view with task indicators
 */
export default function CalendarView({ onDaySelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Get first day of month and total days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Get today for highlighting
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Navigation handlers
  const goToPreviousMonth = () => {
    haptic.light();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    haptic.light();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    haptic.medium();
    setCurrentDate(new Date());
  };

  // Generate calendar grid
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add all days in month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().slice(0, 10);
    const tasks = loadTasksForDate(dateString);
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;

    calendarDays.push({
      day,
      date: dateString,
      dateObj: date,
      tasks: totalTasks,
      completed: completedTasks,
      isToday: date.getTime() === today.getTime(),
      isPast: date < today,
      isFuture: date > today,
      isSelected: selectedDate === dateString
    });
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      {/* Header with navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <button
          onClick={goToPreviousMonth}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1.5px solid #E5E5E5',
            background: '#fff',
            color: '#1A1A1A',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'manipulation'
          }}
        >
          ‹
        </button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: '2px'
          }}>
            {monthNames[month]} {year}
          </div>
          <button
            onClick={goToToday}
            style={{
              fontSize: '11px',
              color: '#3B6E3B',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: '4px',
              touchAction: 'manipulation'
            }}
          >
            Today
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1.5px solid #E5E5E5',
            background: '#fff',
            color: '#1A1A1A',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'manipulation'
          }}
        >
          ›
        </button>
      </div>

      {/* Week day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        marginBottom: '8px'
      }}>
        {weekDays.map(day => (
          <div key={day} style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#8E8E93',
            textAlign: 'center',
            padding: '4px'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px'
      }}>
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={`empty-${index}`} />;
          }

          const completionRate = dayData.tasks > 0 ? (dayData.completed / dayData.tasks) : 0;

          return (
            <button
              key={dayData.date}
              onClick={() => {
                haptic.light();
                if (onDaySelect) onDaySelect(dayData.date);
              }}
              style={{
                aspectRatio: '1',
                borderRadius: '12px',
                border: dayData.isToday
                  ? '2px solid #3B6E3B'
                  : dayData.isSelected
                  ? '2px solid #6FAF6F'
                  : 'none',
                background: dayData.isToday
                  ? 'rgba(59,110,59,0.1)'
                  : dayData.isSelected
                  ? 'rgba(111,175,111,0.1)'
                  : dayData.tasks > 0
                  ? '#F5F5F5'
                  : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '4px',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                opacity: dayData.isPast && !dayData.isToday ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Day number */}
              <div style={{
                fontSize: '13px',
                fontWeight: dayData.isToday ? 700 : 600,
                color: dayData.isToday
                  ? '#3B6E3B'
                  : dayData.isPast
                  ? '#9CA3AF'
                  : '#1A1A1A'
              }}>
                {dayData.day}
              </div>

              {/* Task indicator dots */}
              {dayData.tasks > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '2px',
                  marginTop: '2px'
                }}>
                  {/* Show completion indicator */}
                  <div style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: completionRate === 1
                      ? '#3B6E3B'
                      : completionRate > 0
                      ? '#D97706'
                      : '#9CA3AF'
                  }} />
                  {/* Show task count if more than 3 */}
                  {dayData.tasks > 1 && (
                    <span style={{
                      fontSize: '8px',
                      color: '#8E8E93',
                      fontWeight: 600
                    }}>
                      {dayData.tasks}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '16px',
        padding: '12px',
        background: '#FAFAFA',
        borderRadius: '8px',
        fontSize: '11px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#3B6E3B'
          }} />
          <span style={{ color: '#6B7280' }}>Complete</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#D97706'
          }} />
          <span style={{ color: '#6B7280' }}>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#9CA3AF'
          }} />
          <span style={{ color: '#6B7280' }}>Incomplete</span>
        </div>
      </div>
    </div>
  );
}
