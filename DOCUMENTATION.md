# TimeFlow 🌿

**A nature-themed intelligent task scheduler that helps you flow through your day with calm productivity.**

TimeFlow transforms traditional task management by combining time-blocking, intelligent rescheduling, and behavioral learning to create a scheduling assistant that adapts to how you actually work.

## Quick Summary (Plain English)

**What:** A smart daily planner that prevents you from overcommitting and helps when tasks take longer than expected.

**How:** Instead of endless to-do lists, you schedule tasks with specific times (like "2:00-3:30 PM"). TimeFlow shows your whole day visually, warns when you're overbooked, and gives you smart options when things don't go as planned.

**Why it's different:**
- 🟢 **See your whole day** - Visual timeline, not just a list
- ⚠️ **Get early warnings** - Task turning red? You've avoided it too many times
- 🔄 **Handle delays gracefully** - 7 rescheduling options when tasks run long
- 📊 **Learn from patterns** - Tracks what takes longer than planned
- 🧘 **Reduce guilt** - "Back to Pool" instead of "Delete"
- 🌿 **Gentle streaks** - Growing plant rewards consistency without punishment

**Perfect for:** People who make ambitious to-do lists but only finish half, underestimate how long tasks take, or keep pushing the same task to "tomorrow."

---

## Table of Contents

- [What is TimeFlow? (Plain English)](#what-is-timeflow-plain-english)
- [How Does It Work? (Simple Explanation)](#how-does-it-work-simple-explanation)
- [Philosophy](#philosophy)
- [Core Features](#core-features)
- [How Rescheduling Works](#how-rescheduling-works)
- [Task Health Assessment](#task-health-assessment)
- [Data Models](#data-models)
- [Storage Architecture](#storage-architecture)
- [Components](#components)
- [Utility Functions](#utility-functions)
- [User Workflows](#user-workflows)
- [Technical Architecture](#technical-architecture)
- [Setup & Development](#setup--development)
- [Feature Breakdown](#feature-breakdown)

---

## What is TimeFlow? (Plain English)

TimeFlow is a **smart daily planner** that helps you actually finish your tasks instead of just making endless to-do lists.

### The Problem It Solves

Have you ever:
- Made a to-do list with 10 tasks, but only finished 3?
- Kept pushing the same task to "tomorrow" for a week?
- Felt guilty about unfinished tasks piling up?
- Underestimated how long things take?
- Had tasks you avoid because they feel too big?

TimeFlow helps with all of this by being your intelligent scheduling assistant.

### How It's Different

**Traditional to-do apps:**
- Just a list of tasks
- No time awareness
- You decide everything manually
- Easy to overcommit

**TimeFlow:**
- Each task has a specific time and duration
- Shows your whole day visually
- Warns you when you're overbooked
- Learns from your patterns
- Helps you when tasks don't go as planned

### The Big Idea

Instead of just listing tasks, TimeFlow helps you:
1. **Plan realistically** - See if you're trying to fit too much in one day
2. **Stay focused** - Timer keeps you on track
3. **Handle delays gracefully** - 7 different options when tasks take longer
4. **Learn from patterns** - Notices which tasks you keep avoiding
5. **Reduce overwhelm** - Separates brainstorming from commitment

---

## How Does It Work? (Simple Explanation)

### Your Daily Flow

**1. Morning: Plan Your Day**
```
You wake up → Open TimeFlow → See tasks carried over from yesterday
→ Add new tasks for today → Assign times (like "10:00 AM - 11:30 AM")
→ TimeFlow shows you a visual timeline of your day
```

**What you see:**
- Green bordered tasks = Everything's fine
- Orange bordered tasks = Warning (you've rescheduled this before)
- Red bordered tasks = Problem (you've avoided this many times)

**2. During the Day: Execute**
```
Task time arrives → Click "Start" → Timer counts down
→ You work on the task → Timer ends
```

**If you finish:** Mark complete ✓ → See celebration animation → Move to next task

**If you don't finish:** TimeFlow asks "What do you want to do?" with 7 options:
- **Mark Complete** - Actually done
- **Continue +1 min** - Almost there, need a bit more time
- **Later Today** - TimeFlow finds next free slot automatically
- **Tomorrow** - Move to tomorrow's schedule
- **Back to Pool** - Not ready to commit, put in idea bucket
- **Pick Time** - Choose your own time manually
- **Break Task** - Split into smaller pieces (appears after 3+ delays)

**3. End of Day: Reflect**
```
Click "End Day" → See how many tasks you completed
→ Write quick reflection → Choose mood
→ Decide what to do with unfinished tasks
```

### The Weekly Pool (Your Idea Bucket)

Think of it like a **low-pressure brainstorming space**:
- Add task ideas with just names (no times or dates yet)
- When you're ready, move them to "Today" and give them a time
- If a task from "Today" isn't working out, send it back to the pool

**Why this helps:**
- Capture ideas without committing
- Separate "someday" from "today"
- Reduce guilt - it's in the pool, not forgotten

### Smart Features That Adapt

**1. Conflict Prevention**
- Try to schedule overlapping tasks → TimeFlow blocks it
- "Can't schedule 2-3 PM, you already have a meeting then"

**2. Overflow Warnings**
- Schedule 10 hours of tasks in an 8-hour day → See warning
- "You're 2 hours over capacity - something has to give"

**3. Task Health Monitoring**
- Reschedule a task 5 times → It turns red
- TimeFlow notices: "This task has been rescheduled 5+ times - chronic procrastination"
- Suggests breaking it into smaller pieces

**4. Pattern Learning**
- Complete "Write blog post" 5 times → TimeFlow learns it takes ~45 min
- Next time: "This usually takes 45 min (based on 5 completions)"

**5. Deadline Tracking**
- Set task deadline → TimeFlow auto-increases priority as it approaches
- "OVERDUE" badge appears if you miss it
- Can't ignore urgent tasks

### What You See On Screen

**Main View (Today):**
```
Header: [Week] [Pool] [Focus] [Timeline] [End Day]

Stats: 3/8 tasks done • 75% capacity • 2h 15m left

Carried Over Tasks (orange section):
┌─ 🟠 File taxes (from Feb 14)
│  Due yesterday • Rescheduled 3x • ⚠️ WARNING
│  [Start] [✏️]                          [×]
└─

Today's Tasks (green section):
┌─ 🟢 Morning standup
│  9:00 AM - 9:30 AM • 30 min
│  [Start] [✏️]                          [×]
└─
┌─ 🟡 Write documentation
│  10:00 AM - 11:30 AM • 90 min
│  Due today • Rescheduled 2x • ⚠️ WARNING
│  [Start] [✏️]                          [×]
└─
```

**When Timer Ends:**
```
Task Finished?
"Write documentation"

⚠️ This has been rescheduled 2 times
💡 Recommended: Later today (3:00 PM)

[✓ Mark Complete]

[⏱️ Continue +1 min]  [🕐 Later Today (3:00 PM)]
[📅 Tomorrow]         [🎯 Pick Time]
[🌊 Back to Pool]

[🔨 Break into smaller tasks]

[Cancel]
```

### Real Example: A Typical Day

**8:00 AM - Planning**
- See 2 tasks carried from yesterday (orange)
- Add 6 new tasks for today
- TimeFlow shows "90% capacity - good fit!"

**9:00 AM - First Task**
- Start "Morning standup" timer (30 min)
- Timer ends → Mark complete ✓
- See quick celebration

**10:00 AM - Second Task**
- Start "Write documentation" (90 min)
- Timer ends but not done
- Pick "Continue +1 min" (just need 15 more min)
- Continue working

**2:00 PM - Interruption**
- Can't do "Review code" task
- Pick "Later Today"
- TimeFlow finds next free slot: 4:00 PM
- Task automatically moves there

**5:00 PM - Running Late**
- "Prepare presentation" not finished
- Pick "Tomorrow"
- Task moves to tomorrow with "carried over" badge
- Attempt counter: 0 → 1

**Evening - End of Day**
- Click "End Day"
- See: "6/8 tasks completed (75%)"
- Write: "Good focus, but presentation took longer than expected"
- Mood: Good 🙂
- Unfinished task "File taxes" → Carry to tomorrow

**Next Morning**
- See "File taxes" in orange section
- Shows: "from Feb 14" badge
- Border is turning red (many reschedules)
- Decide to break it into smaller tasks

### Why It Works

1. **Visual Timeline** - See your whole day, not just a list
2. **Realistic Planning** - Can't schedule 12 hours in 8 hours
3. **Graceful Failure** - Delays are normal, system helps you handle them
4. **Pattern Recognition** - System learns what you actually do vs. plan
5. **No Guilt** - "Back to Pool" instead of "Delete" feels gentler
6. **Early Warnings** - Red borders before task becomes chronic problem

### What Makes TimeFlow "Smart"

**It notices patterns:**
- "You reschedule coding tasks 60% of the time"
- "You complete morning tasks 85% of the time"
- "This task usually takes 45 min, not 30 min"

**It predicts problems:**
- "If you add this task, you'll be 2 hours overbooked"
- "This task conflicts with your 2:00 PM meeting"
- "You have 20 min free at 3:00 PM for this task"

**It learns from you:**
- Tracks which reschedule options you prefer
- Suggests durations based on past completions
- Remembers your productive hours

**It helps you improve:**
- Shows which tasks you chronically avoid
- Highlights unrealistic time estimates
- Suggests breaking down large tasks

### The Bottom Line

**Without TimeFlow:**
- Make to-do list with 10 tasks
- Realize at 5 PM you only did 3
- Feel guilty about the 7 undone
- Copy them to tomorrow
- Repeat cycle

**With TimeFlow:**
- Schedule 8 tasks with specific times
- TimeFlow warns: "This is 1 hour over capacity"
- Remove 1 task, put in Pool
- Complete 6/7 tasks
- 1 task delayed → TimeFlow suggests best reschedule option
- See pattern: "You always underestimate documentation tasks"
- Adjust future estimates
- Improve over time

---

## Philosophy

### Design Principles

1. **Calm Productivity**: Warm, encouraging language with no guilt-inducing messages
2. **Nature-Themed**: Forest greens, leaf icons, vine decorations create a peaceful aesthetic
3. **Adaptive Interface**: Automatic light/dark theme based on system preferences for comfort in any lighting
4. **Intelligent Assistance**: Learn from behavior, predict problems, suggest solutions
5. **Progressive Disclosure**: Show complexity only when needed
6. **Offline-First**: 100% local storage, no server dependency

### User Mental Model

```
Weekly Pool (brainstorming) → Today (commitment) → Execution (flow) → Reflection (learning)
```

- **Pool**: Low-pressure collection of tasks for the week
- **Today**: Intentional selection and time-blocking
- **Flow**: Focus mode during execution
- **Reflection**: End-of-day review and carry-over decisions

---

## Core Features

### 1. Time-Blocked Scheduling

**Plain English:** Instead of just saying "Write report today," you say "Write report from 2:00-3:30 PM." TimeFlow shows you a visual calendar with colored blocks for each task, like looking at Google Calendar but for your daily tasks. You can drag tasks around to rearrange them, and TimeFlow prevents you from scheduling two things at the same time.

**What it does:**
- Assign specific start times and durations to tasks
- Visual timeline showing your entire day
- Real-time current time indicator
- Drag-and-drop reordering

**Implementation:**
- Tasks have `startTime` (HH:MM format) and `duration` (minutes)
- Timeline component calculates pixel positions based on hour scale
- Auto-scheduling fills gaps in the day

**Key files:**
- `Today.jsx` - Main scheduling interface
- `DetailedTimeline.jsx` - Visual calendar view
- `scheduler.js` - Scheduling algorithms

### 2. Intelligent Rescheduling System

**Plain English:** When a task timer ends and you're not done, TimeFlow doesn't just say "too bad." It gives you 7 smart options - from "just need 1 more minute" to "move this to tomorrow" to "this task is too big, split it in half." If you keep rescheduling something 3+ times, TimeFlow suggests breaking it into smaller pieces because you're probably avoiding it.

**What it does:**
- 7 different rescheduling options when tasks aren't completed
- Smart slot finding for "Later Today" option
- Attempt tracking for behavioral insights
- Break task suggestion after 3+ reschedules

**Components:**
- `RescheduleModal.jsx` - The rescheduling interface
- Appears when timer ends and task isn't complete
- Tracks every reschedule decision

**Options explained:**

| Option | When to Use | What Happens | Attempts++ |
|--------|-------------|--------------|------------|
| **Mark Complete** | Task is done | Sets `completed: true`, triggers celebration | No |
| **Continue Now** | Need a bit more time | Adds 1 minute, resumes timer | No |
| **Later Today** | Reschedule to later slot | Finds next free time, updates `startTime` | Yes |
| **Tomorrow** | Move to next day | Creates copy in tomorrow's tasks, removes from today | Yes |
| **Back to Pool** | Not ready to commit | Returns to Weekly Pool for later | Yes |
| **Pick Time** | Custom reschedule | Opens edit dialog for manual time selection | Yes |
| **Break Task** | Task too large | Splits into 2 tasks of half duration | Yes |

**Attempt Tracking:**
```javascript
{
  attempts: 3,                          // Number of times rescheduled
  scheduledFor: "2026-02-15T14:00:00Z", // Last scheduled time
  lastRescheduled: "2026-02-15T10:30:00Z", // When last moved
  rescheduledReasons: ['later_today', 'tomorrow', 'later_today'] // History
}
```

### 3. Task Health Assessment

**Plain English:** TimeFlow acts like a task doctor - it checks each task's "health" and warns you which ones are in trouble. If you keep avoiding a task or a deadline is approaching, the task's border changes color from green (healthy) to orange (warning) to red (critical). This helps you spot problem tasks before they become chronic issues.

**What it does:**
- Calculates risk score (0-100) for each task
- Visual color-coding: Green (healthy) → Amber (warning) → Red (critical)
- Shows warning badges on at-risk tasks
- Provides detailed reasons via tooltips

**Risk Factors (weighted):**

1. **Reschedule Attempts** (0-40 points)
   - 1-2 reschedules: 10 points
   - 3-4 reschedules: 25 points
   - 5+ reschedules: 40 points (chronic procrastination)

2. **Deadline Proximity** (0-30 points)
   - Overdue: 30 points
   - Due today: 25 points
   - Due tomorrow: 15 points
   - Due in 3-7 days: 8 points

3. **Scheduling Conflicts** (0-20 points)
   - 1 conflict: 10 points
   - 2+ conflicts: 20 points

4. **Schedule Overflow** (0-10 points)
   - Critical overflow: 10 points
   - Warning overflow: 5 points

**Status Determination:**
- **Healthy** (0-24 points): Green border, no badge
- **Warning** (25-49 points): Amber border, ⚠️ WARNING badge
- **Critical** (50+ points): Red border, 🚨 CRITICAL badge

**Implementation:**
```javascript
// From scheduler.js
export const getTaskHealth = (task, allTasks, availability) => {
  let riskScore = 0;
  const reasons = [];

  // Factor 1: Attempts
  const attempts = task.attempts || 0;
  if (attempts >= 5) {
    riskScore += 40;
    reasons.push('Rescheduled 5+ times - chronic procrastination');
  }

  // Factor 2: Deadline
  const urgency = getDeadlineUrgency(task);
  if (urgency?.level === 'overdue') {
    riskScore += 30;
    reasons.push('OVERDUE');
  }

  // Factor 3: Conflicts
  const conflicts = detectConflicts(allTasks);
  const taskConflicts = conflicts.filter(c =>
    c.task1.id === task.id || c.task2.id === task.id
  );
  if (taskConflicts.length > 0) {
    riskScore += Math.min(20, taskConflicts.length * 10);
    reasons.push(`Conflicts with ${taskConflicts.length} other task(s)`);
  }

  // Factor 4: Overflow
  const overflow = calculateOverflow(allTasks, availability);
  if (overflow.affectedTasks.some(t => t.id === task.id)) {
    riskScore += overflow.severity === 'critical' ? 10 : 5;
    reasons.push('Contributes to schedule overflow');
  }

  // Determine status
  let status = 'healthy';
  if (riskScore >= 50) status = 'critical';
  else if (riskScore >= 25) status = 'warning';

  return {
    status,
    score: riskScore,
    reasons,
    color: status === 'critical' ? '#dc2626' :
           status === 'warning' ? '#f59e0b' : '#6FAF6F'
  };
};
```

### 4. Weekly Pool

**Plain English:** Think of this as your "someday/maybe" list - a stress-free place to dump task ideas without committing to when you'll do them. Just jot down "Research new framework" and it sits in the pool. When you're ready, move it to "Today" and THEN give it a time. If a task from Today isn't working out, send it back to the pool guilt-free.

**What it does:**
- Separate space for brainstorming tasks
- Add tasks with just a name (no time commitment yet)
- Move tasks to Today when ready to commit
- "Back to Pool" option for tasks you're not ready to schedule

**Philosophy:**
- Pool = low-pressure collection
- Today = high-commitment execution
- Reduces overwhelm by separating planning from doing

**Data Flow:**
```
Weekly Pool (just names)
      ↓
Move to Today Dialog (specify duration + start time)
      ↓
Today's Tasks (time-blocked)
      ↓
Complete or Back to Pool
```

**Storage Schema:**
```javascript
'timeflow-weekly-pool': [
  {
    id: 1234567890,
    name: "Research new framework",
    inWeeklyPool: true,
    createdAt: "2026-02-15T09:00:00Z",
    movedToTodayCount: 2  // How many times moved to Today
  }
]
```

### 5. Focus Mode

**Plain English:** Press 'F' and everything disappears except the task you're currently working on. No distractions, no other tasks visible - just you, the timer, and one task with a calming pulsing green border. Perfect for deep work. Press 'F' again to exit.

**What it does:**
- Hides everything except active task and timer
- Centers active task card with pulsing animation
- Keyboard shortcut: Press `F` to toggle
- Visual "Focus Mode Active" indicator

**When Active:**
- Stats section hidden
- Timeline hidden
- All other tasks hidden
- Only active task visible (large, centered)
- Green pulsing border animation

**Implementation:**
```jsx
{focusModeEnabled && activeTaskId ? (
  <div style={{ /* centered container */ }}>
    <div>🎯 Focus Mode Active (Press F to exit)</div>
    {/* Only active task rendered */}
  </div>
) : (
  /* Normal view with all tasks */
)}
```

### 6. Adaptive Theming (Light/Dark Mode)

**Plain English:** TimeFlow automatically matches your computer or phone's light/dark mode preference. Using dark mode at night? TimeFlow turns dark too with deep forest greens and light text. Switch to light mode? TimeFlow becomes bright and clean. No manual toggle needed - it just works.

**What it does:**
- Detects system color scheme preference automatically
- Switches between light and dark color palettes seamlessly
- Maintains nature-themed aesthetic in both modes
- All components adapt instantly

**Color Palettes:**

**Light Mode:**
- Background: `#F8F8F8` (light gray)
- Cards: `#FFFFFF` (white)
- Text: `#1A1A1A` (dark)
- Primary: `#3B6E3B` (forest green)
- Secondary: `#8E8E93` (gray)

**Dark Mode:**
- Background: `#1A1F1A` (deep forest night)
- Cards: `#242B24` (dark moss)
- Text: `#E8F0E8` (light)
- Primary: `#6FAF6F` (lighter green for contrast)
- Secondary: `#9CA59C` (muted gray)

**Implementation:**
```jsx
// Detect system preference
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Conditional styling
<div style={{
  background: isDark ? '#242B24' : '#fff',
  color: isDark ? '#E8F0E8' : '#1A1A1A'
}}>
```

**CSS Variables Approach:**
```css
:root {
  --bg: #F0F8F2;
  --text-primary: #1A1A1A;
  --primary: #3B6E3B;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1A1F1A;
    --text-primary: #E8F0E8;
    --primary: #6FAF6F;
  }
}
```

**Affected Components:**
- Mobile layout and bottom navigation
- All cards (hero, stat pills, task cards)
- Calendar views (daily and monthly)
- Form inputs and bottom sheets
- Task cards and timers

**Benefits:**
- Reduces eye strain in low-light environments
- Respects user's system-wide preference
- No manual switching required
- Consistent experience across all devices

### 7. Conflict Detection

**Plain English:** TimeFlow won't let you schedule two things at the same time. Try to add "Meeting" from 2-3 PM when "Write report" is already 2-3 PM? It blocks you with an error. Even warns if tasks are back-to-back with no breathing room ("You have no break between these two tasks - add 5-10 minutes?").

**What it does:**
- Prevents scheduling overlapping tasks
- Warns about back-to-back tasks (< 5 min buffer)
- Shows visual conflict indicators
- Auto-suggests resolution

**Detection Logic:**
```javascript
export const detectPotentialConflicts = (newTask, existingTasks) => {
  const conflicts = [];
  const warnings = [];

  const newStart = hhmmToMinutes(newTask.startTime);
  const newEnd = newStart + newTask.duration;

  existingTasks.forEach(task => {
    const start = hhmmToMinutes(task.startTime);
    const end = start + task.duration;

    // Direct overlap
    if (newStart < end && newEnd > start) {
      conflicts.push({
        type: 'overlap',
        task,
        message: `Overlaps with "${task.name}"`
      });
    }

    // Back-to-back (no buffer)
    if (Math.abs(newEnd - start) < 5 || Math.abs(end - newStart) < 5) {
      warnings.push({
        type: 'no-buffer',
        task,
        message: `Back-to-back with "${task.name}" - add 5-10 min buffer?`
      });
    }
  });

  return { conflicts, warnings };
};
```

**User Experience:**
- **Conflicts:** Blocks task addition, shows alert
- **Warnings:** Shows confirm dialog, allows override
- **Visual:** Amber border on conflicting tasks

### 8. Overflow Detection

**Plain English:** If you try to fit 10 hours of tasks into an 8-hour workday, TimeFlow calls you out. It shows a big warning banner: "You're 2 hours over capacity." This forces you to be realistic - either remove tasks, shorten them, or admit you won't finish everything today.

**What it does:**
- Calculates total scheduled time vs. available time
- Shows capacity percentage in header
- Visual warnings when overbooked
- Smart suggestions to fix overflow

**Calculation:**
```javascript
const calculateTimeBalance = () => {
  const totalScheduled = tasks.reduce((sum, t) =>
    sum + (t.remaining || t.duration), 0
  );
  const available = hhmmToMinutes(availability.end) -
                    hhmmToMinutes(availability.start);
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const remainingAvailable = Math.max(0,
    hhmmToMinutes(availability.end) - now
  );

  return {
    total: available,
    used: totalScheduled,
    remaining: remainingAvailable,
    overflowMinutes: Math.max(0, totalScheduled - remainingAvailable),
    warningLevel: totalScheduled > remainingAvailable * 1.2 ? 'critical' :
                  totalScheduled > remainingAvailable ? 'warning' : 'ok'
  };
};
```

**Visual Indicators:**
- **Warning (60-120 min over):** ⚠️ Amber banner
- **Critical (120+ min over):** 🚨 Red banner
- Shows exact overflow amount: "2h 15min over capacity"

### 9. Deadline Management

**Plain English:** Set a deadline on a task (like "File taxes by April 15") and TimeFlow automatically makes it more urgent as the date approaches. Task due today gets bumped to highest priority. Overdue tasks show a red "OVERDUE" badge so you can't ignore them.

**What it does:**
- Optional deadline field for tasks
- Auto-escalation as deadline approaches
- Visual countdown badges
- Priority boost for imminent deadlines

**Urgency Levels:**
```javascript
export const getDeadlineUrgency = (task) => {
  if (!task.deadline) return null;

  const daysUntil = Math.ceil(
    (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil < 0) {
    return { level: 'overdue', message: 'OVERDUE', color: '#dc2626' };
  } else if (daysUntil === 0) {
    return { level: 'today', message: 'DUE TODAY', color: '#ea580c' };
  } else if (daysUntil === 1) {
    return { level: 'tomorrow', message: 'Due tomorrow', color: '#f59e0b' };
  } else if (daysUntil <= 3) {
    return { level: 'soon', message: `${daysUntil} days left`, color: '#fbbf24' };
  } else if (daysUntil <= 7) {
    return { level: 'upcoming', message: `${daysUntil} days left`, color: '#6FAF6F' };
  }

  return null;
};
```

**Auto-Escalation:**
```javascript
// Runs on component mount/update
useEffect(() => {
  const updated = tasks.map(task => {
    const urgency = getDeadlineUrgency(task);
    if (urgency?.level === 'today' && !task.escalatedPriority) {
      return {
        ...task,
        originalPriority: task.priority || 3,
        priority: 5,  // Max priority
        escalatedPriority: true
      };
    }
    return task;
  });
  if (JSON.stringify(updated) !== JSON.stringify(tasks)) {
    setTasks(updated);
  }
}, [tasks]);
```

### 10. Carry-Over System

**Plain English:** Didn't finish a task today? It automatically appears in tomorrow's list with an orange background and a "from Feb 14" badge. This keeps unfinished tasks visible without you manually copying them. The attempt counter goes up so TimeFlow can warn you if you're chronically avoiding something.

**What it does:**
- Automatically moves unfinished tasks to next day
- Visual separation in UI (separate section)
- Tracks original date with badge
- Increments attempt counter

**Carry-Over Logic:**
```javascript
// At end of day or midnight
const carriedOverTasks = todayTasks
  .filter(t => !t.completed)
  .map(t => ({
    ...t,
    id: Date.now() + Math.random(),
    carriedOver: true,
    originalDate: getTodayString(),
    attempts: (t.attempts || 0) + 1,
    lastRescheduled: new Date().toISOString(),
    rescheduledReasons: [...(t.rescheduledReasons || []), 'carried_over']
  }));

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowDate = tomorrow.toISOString().slice(0, 10);

saveTasksForDate(tomorrowDate, carriedOverTasks);
```

**Visual Treatment:**
- Orange/amber gradient background
- "from Feb 14" badge
- Separate section header: "🍂 Carried from previous days"
- Higher visibility to encourage completion

### 11. End-of-Day Reflection

**What it does:**
- Review day's completion stats
- Write gratitude/reflection notes
- Choose mood (great/good/okay/rough)
- Decide what to do with unfinished tasks

**Data Stored:**
```javascript
'timeflow-reflections': {
  '2026-02-15': {
    completedCount: 7,
    totalCount: 10,
    timeSpent: 420,  // minutes
    reflection: "Great focus today, completed all priority tasks!",
    mood: 'great',
    unfinishedActions: {
      '123': 'carry',    // Carry over
      '456': 'delete',   // Delete
      '789': 'completed' // Mark done
    }
  }
}
```

**Reflection Viewing:**
- Weekly calendar shows 📝 badge for days with reflections
- Click day card to view full reflection
- Modal displays stats, mood, and reflection text

### 12. Weekly Calendar View

**What it does:**
- 7-day overview of current week
- Each day shows: task count, completion %, reflection indicator
- Color coding: today (green), past (muted), future (light)
- Click to navigate to specific day
- Click reflections to view details

**Day Card Data:**
```javascript
{
  date: '2026-02-15',
  dayName: 'Monday',
  taskCount: 8,
  completedCount: 6,
  completionRate: 0.75,
  reflection: { /* reflection object or null */ }
}
```

### 13. Analytics & Learning

**What it does:**
- Tracks task completion patterns
- Duration accuracy (estimated vs actual)
- Reschedule option preferences
- Energy levels by time of day

**Data Collection:**
```javascript
// When task completes
const completeTask = (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  const actualDuration = calculateActualDuration(task.startedAt);

  saveTaskToHistory({
    name: task.name,
    estimatedDuration: task.duration,
    actualDuration,
    completedAt: new Date().toISOString(),
    durationAccuracy: (task.duration / actualDuration) * 100
  });

  trackCompletionByHour(new Date().getHours());
};
```

**Smart Suggestions:**
- "This task usually takes 45 min (based on 5 completions)"
- "You complete 85% of tasks scheduled before noon"
- "You prefer 'Tomorrow' 70% of the time - suggesting it first"

### 14. Drag-and-Drop Reordering

**What it does:**
- Reorder tasks by dragging
- Works with both mouse and keyboard
- Touch-friendly on mobile
- Persists order to localStorage

**Implementation:**
Uses `@dnd-kit` library:

```jsx
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!active || !over || active.id === over.id) return;

  setTasks((items) => {
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    saveTasks(reordered);  // Persist immediately
    return reordered;
  });
};
```

### 15. Timer & Tracking

**What it does:**
- Countdown timer for active task
- Pause/resume capability with persistent state
- Cancel button to stop tasks mid-execution
- Visual progress bar
- Notification when time ends

**Timer Implementation:**
```javascript
const startTask = (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  setActiveTaskId(taskId);
  setSecondsLeft((task.remaining || task.duration) * 60);
  setIsPaused(false);

  timerRef.current = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        setShowRescheduleModal(true);  // Time's up!
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

const pauseTask = () => {
  clearInterval(timerRef.current);
  setIsPaused(true);
  haptic.light();
};

const resumeTask = () => {
  setIsPaused(false);
  timerRef.current = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        setShowRescheduleModal(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  haptic.light();
};

const cancelTask = () => {
  clearInterval(timerRef.current); 
  setActiveTaskId(null);
  setSecondsLeft(0);
  setIsPaused(false);
  setShowRescheduleModal(false);
  haptic.heavy();
};
```

**Tracking:**
- Start time recorded when timer begins
- Actual duration calculated on completion
- Remaining time updated on pause/continue
- Pause state persists across interactions
- All time data stored for analytics
- Cancel allows abandoning tasks without penalty

### 16. Mobile Swipe Gestures

**Plain English:** On mobile, swipe left on any task to reveal action buttons (Complete ✓ and Delete 🗑️). Swipe further to snap them open, or swipe right to close them. It's like iOS Mail's swipe-to-delete, but for task actions.

**What it does:**
- Touch-optimized swipe-to-reveal actions on mobile
- Bidirectional swipe: left to open, right to close
- Haptic feedback at threshold points
- Smooth animations and spring physics
- Prevents accidental triggers during scrolling

**Gesture Recognition:**
```javascript
const handleTouchMove = (e) => {
  const diffX = e.touches[0].clientX - startX.current;
  const diffY = e.touches[0].clientY - startY.current;

  // Detect vertical scroll vs horizontal swipe
  if (!isVerticalScroll.current && Math.abs(diffY) > Math.abs(diffX)) {
    isVerticalScroll.current = true;
    return;
  }

  if (diffX < 0) {
    // Swiping left to reveal (max -150px)
    const newOffset = Math.max(-150, diffX);
    setSwipeOffset(newOffset);

    // Haptic at -80px threshold
    if (diffX < -80 && !hasTriggeredHaptic.current) {
      haptic.selection();
      hasTriggeredHaptic.current = true;
    }
  } else if (actionsRevealed && diffX > 0) {
    // Swiping right to close
    const newOffset = Math.max(-150, -150 + diffX);
    setSwipeOffset(newOffset);
    wasClosing.current = true;
  }
};
```

**Threshold Logic:**
- **Opening:** Swipe left 80px to snap open
- **Closing:** Swipe right 40px to snap closed (easier to close than open)
- **In-between:** Springs back to nearest state

**Key Files:**
- `src/components/SwipeableTask.jsx` - Swipe gesture wrapper
- Integrated with mobile task cards in `Today.jsx`

### 17. Monthly Calendar View

**Plain English:** See your entire month at a glance with a clean calendar grid. Each day shows colored dots indicating task completion status (green = all done, orange = in progress, gray = incomplete). Navigate between months, jump to today, and tap any day to see its tasks.

**What it does:**
- Full monthly calendar grid with task indicators
- Color-coded completion status for each day
- Navigation controls (previous/next month, jump to today)
- Touch-optimized for mobile with haptic feedback
- Shows task counts and completion rates per day
- Visual distinction between today, past, and future days

**Calendar Features:**
- **Task Indicators:**
  - Green dot: All tasks completed
  - Orange dot: Partial completion
  - Gray dot: No tasks completed
  - Number badge: Shows total task count if > 1
- **Day States:**
  - Today: Green border with subtle background
  - Selected: Highlighted with accent color
  - Past days: 50% opacity
  - Future days: Full opacity
- **Navigation:**
  - Arrow buttons to change months
  - "Today" button to jump to current date
  - Month/year header showing current view

**Implementation:**
```javascript
// Generate calendar grid dynamically
for (let day = 1; day <= daysInMonth; day++) {
  const date = new Date(year, month, day);
  const dateString = date.toISOString().slice(0, 10);
  const tasks = loadTasksForDate(dateString);
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  calendarDays.push({
    day,
    date: dateString,
    tasks: totalTasks,
    completed: completedTasks,
    isToday: date.getTime() === today.getTime(),
    isPast: date < today,
    isFuture: date > today,
    isSelected: selectedDate === dateString
  });
}
```

**Completion Status:**
```javascript
const completionRate = dayData.tasks > 0
  ? (dayData.completed / dayData.tasks)
  : 0;

// Color based on completion
const indicatorColor = completionRate === 1
  ? '#3B6E3B'      // All done - green
  : completionRate > 0
  ? '#D97706'      // Partial - orange
  : '#9CA3AF';     // None done - gray
```

**Key Files:**
- `src/components/CalendarView.jsx` - Monthly calendar component
- Integrated into `Today.jsx` with view mode toggle

### 18. Data Validation & Safety

**Plain English:** TimeFlow prevents common mistakes like scheduling tasks in the past, creating duplicate carried tasks, or booking overlapping appointments. It validates your input to keep your schedule logical and error-free.

**What it does:**
- Prevents scheduling tasks at times that have already passed
- Blocks duplicate carried tasks across component remounts
- Validates form inputs (required fields, number ranges)
- Prevents conflicting time blocks
- Safe deletion with cross-date state management

**Past Time Validation:**
```javascript
// In EditTaskDialog.jsx
if (taskStartTime) {
  const now = new Date();
  const today = new Date().toISOString().slice(0, 10);
  const selectedTime = new Date(`${today}T${taskStartTime}`);

  if (selectedTime < now) {
    haptic.warning();
    alert('Cannot schedule task at a time that has already passed. Please select a future time.');
    return;
  }
}
```

**Duplicate Prevention (Carry-Over):**
```javascript
// localStorage-based tracking to prevent duplicates on remount
const carryOverKey = `timeflow-carryover-loaded-${today}`;
const alreadyLoaded = localStorage.getItem(carryOverKey) === 'true';
if (alreadyLoaded) return;

// Use composite keys to detect existing carried tasks
const existingCarriedIds = new Set(
  todayTasks
    .filter(t => t.carriedOver)
    .map(t => `${t.originalDate}-${t.name}`)
);

// Only add new carried tasks not already present
const newUnfinishedTasks = unfinishedTasks.filter(t =>
  !existingCarriedIds.has(`${t.originalDate}-${t.name}`)
);
```

**Cross-Date State Management:**
```javascript
// When deleting carried tasks, mark complete in original date
const deleteTask = (id) => {
  const taskToDelete = tasks.find(t => t.id === id);

  if (taskToDelete?.carriedOver && taskToDelete.originalDate) {
    const originalTasks = loadTasksForDate(taskToDelete.originalDate);
    const updatedOriginalTasks = originalTasks.map(t =>
      t.name === taskToDelete.name ? { ...t, completed: true } : t
    );
    saveTasksForDate(taskToDelete.originalDate, updatedOriginalTasks);
  }

  setTasks(prev => prev.filter(t => t.id !== id));
};
```

**Validation Features:**
- Past time blocking (can't schedule in the past)
- Required field validation (name, duration required)
- Number range validation (duration > 0)
- Conflict detection (overlapping times)
- Duplicate prevention (carried tasks)
- Data consistency across dates

### 19. Gentle Streaks & Mindful Gamification 🌿
- Tracks daily engagement streak
- Visual plant growth as streak increases
- Non-punitive grace period system
- Supportive messages instead of guilt

**How Streaks Work:**

**What Counts as a "Meaningful Action":**
- Completing any task
- Starting a timer on any task
- Activating Focus Mode

**Streak Levels (Plant Growth):**
```
Day 1:      🌰 Seed       "Every season starts with a seed"
Days 2-3:   🌱 Seedling   "Your habit is taking root"
Days 4-7:   🌿 Sprout     "Growing steadily"
Days 8-14:  🪴 Plant      "Strong roots, steady growth"
Days 15-30: 🌿🌿 Vine      "Your practice is flourishing"
Day 31+:    🌸 Flower     "Beautiful growth"
```

**Grace Period System (Non-Toxic):**

1. **Grace Token Available:**
   - Everyone gets 1 grace day per week (resets Monday)
   - Miss a day → Grace used → Streak continues
   - Visual indicator: "🛟 1 grace day available"

2. **Grace Already Used:**
   - Miss 1 day → Streak **pauses** (not lost yet!)
   - Message: "Your plant is resting today 🌙 Pick it up when you're ready"
   - Miss 2+ days → Gentle reset: "Every season starts with a seed 🌱"

3. **No Punishment:**
   - No "YOU LOST YOUR STREAK!" alerts
   - No shaming language
   - Progress is never deleted, just restarted
   - Your longest streak is always remembered

**Visual Design:**

Compact mode (header):
```
┌─────────────────────────────────┐
│ 🌿 7 days    [+1 grace]         │
└─────────────────────────────────┘
```

Full mode (expandable):
```
┌─────────────────────────────────────────┐
│  🪴  7 days                              │
│      Strong roots, steady growth        │
│                                          │
│  ▓▓▓▓▓▓▓░░░░░░░░░░░░░   23%             │
│                                          │
│  🏆 Best: 14  📅 Total: 42  🛟 Grace OK │
└─────────────────────────────────────────┘
```

**Implementation:**

Storage:
```javascript
'timeflow-streak': {
  current: 7,                    // Current streak
  longest: 14,                   // Best streak ever
  lastActiveDate: '2026-02-15',  // Last day active
  graceAvailable: true,          // Grace token status
  paused: false,                 // Is streak paused?
  totalActiveDays: 42,           // All-time active days
  plantStage: 'plant',           // Current growth stage
  lastGraceReset: '2026-02-10'   // Last Monday
}

'timeflow-daily-actions': {
  '2026-02-15': true,  // Had activity today
  '2026-02-14': true,
  '2026-02-13': false  // Missed this day
}
```

Streak Update Logic:
```javascript
export const updateStreak = () => {
  const streak = loadStreak();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  // Already processed today
  if (streak.lastActiveDate === today) return streak;

  // Check if user did something meaningful today
  const actionToday = hadMeaningfulAction(today);
  if (!actionToday) return streak;  // No action yet

  // User did something meaningful today
  streak.totalActiveDays += 1;

  // Check streak continuity
  if (streak.lastActiveDate === yesterday) {
    // Continuing from yesterday
    streak.current += 1;
    streak.lastActiveDate = today;
    streak.paused = false;
  } else {
    // Missed at least one day
    const daysMissed = daysBetween(streak.lastActiveDate, today) - 1;

    if (daysMissed === 1 && streak.graceAvailable) {
      // Use grace token
      streak.current += 1;
      streak.lastActiveDate = today;
      streak.graceAvailable = false;
      streak.paused = false;
    } else if (daysMissed === 1 && !streak.graceAvailable) {
      // Pause streak (one more chance)
      streak.paused = true;
      streak.lastActiveDate = today;
    } else {
      // Reset after 2+ days
      streak.current = 1;
      streak.lastActiveDate = today;
      streak.paused = false;
    }
  }

  // Update plant stage
  streak.plantStage = getPlantStage(streak.current);

  // Reset grace token weekly (Monday)
  const today = new Date();
  const lastReset = new Date(streak.lastGraceReset);
  const daysSinceReset = daysBetween(lastReset, today);
  if (daysSinceReset >= 7) {
    streak.graceAvailable = true;
    streak.lastGraceReset = getTodayString();
  }

  saveStreak(streak);
  return streak;
};
```

**Milestone Messages:**
```javascript
export const getMilestoneMessage = (streakDays) => {
  const milestones = {
    1: "🌱 First day! You showed up.",
    3: "🌿 Three days of growth!",
    7: "🪴 One week! Your habit is rooting.",
    14: "🌿 Two weeks! Steady progress.",
    30: "🌸 One month! Your practice blooms.",
    60: "🌳 Two months! Strong and thriving.",
    100: "🌳✨ 100 days! Incredible dedication."
  };
  return milestones[streakDays] || null;
};
```

**Why This Works Better Than Duolingo:**

Traditional streak systems:
- ❌ Punitive: Lose everything if you miss one day
- ❌ Stressful: Creates anxiety about maintaining streak
- ❌ All-or-nothing: No room for life happening

TimeFlow's Gentle Streaks:
- ✅ Grace period: 1 free miss per week
- ✅ Pause buffer: Second miss pauses, not resets
- ✅ Supportive language: "resting" not "failed"
- ✅ Progress preserved: Longest streak always visible
- ✅ Total days tracked: Even after resets
- ✅ Natural metaphor: Plants grow, rest, and regrow

**Key files:**
- `src/utils/streaks.js` - Streak calculation logic
- `src/components/StreakDisplay.jsx` - Visual component
- `Today.jsx` - Integration with task completion

### 20. Search & Filter

**Plain English:** Quickly find specific tasks across your day or weekly pool by typing in a search box. The search works instantly as you type, filtering tasks by name or notes. Perfect for when you have many tasks and need to find "that meeting with Sarah" or "the blog post task."

**What it does:**
- Real-time search filtering in Today view and Weekly Pool
- Searches both task names and notes
- 300ms debouncing to prevent performance issues
- Sticky search bar stays visible while scrolling
- Clear button (×) to reset search instantly
- Case-insensitive matching

**Implementation:**

**SearchBar Component** (`src/components/shared/SearchBar.jsx`):
```jsx
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, placeholder = "Search tasks..." }) {
  const [query, setQuery] = useState('');
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Debounced search with 300ms delay
  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query.toLowerCase().trim());
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: isDark ? '#1A1F1A' : '#F0F8F2',
      padding: '12px 0',
      marginBottom: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: isDark ? '#242B24' : '#fff',
        borderRadius: '12px',
        padding: '10px 14px',
        border: `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`
      }}>
        <span style={{ fontSize: '16px', marginRight: '8px' }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '15px',
            color: isDark ? '#E8F0E8' : '#1A1A1A'
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: isDark ? '#9CA59C' : '#8E8E93'
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
```

**Integration in Today.jsx:**
```javascript
import SearchBar from './components/shared/SearchBar';

// Add search state
const [searchQuery, setSearchQuery] = useState('');

// Filter function
const filterTasks = (tasks) => {
  if (!searchQuery) return tasks;
  return tasks.filter(task =>
    task.name?.toLowerCase().includes(searchQuery) ||
    task.notes?.toLowerCase().includes(searchQuery)
  );
};

// Use filtered tasks in render
const filteredTasks = filterTasks(tasks);

// Render SearchBar
<SearchBar onSearch={setSearchQuery} placeholder="Search today's tasks..." />
```

**Performance Optimization:**
- **Debouncing:** 300ms delay prevents excessive re-renders on every keystroke
- **Memoization:** Filter function only runs when search query or tasks change
- **Sticky positioning:** Search bar remains visible during scroll without layout shifts
- **toLowerCase() caching:** Search query lowercased once, not on every task

**Key Features:**
- Works in Today view and Weekly Pool
- Searches both task name and notes fields
- Instant clear with × button
- Adapts to light/dark mode
- Mobile-optimized with large touch targets
- Maintains focus for continuous typing

**Key Files:**
- `src/components/shared/SearchBar.jsx` - Reusable search component
- `Today.jsx` - Search integration for Today tasks (line 277, 780-787, 1122)
- `WeeklyPool.jsx` - Search integration for Pool tasks (line 54, 57-62, 134)

### 21. Insights Dashboard 📊

**Plain English:** Learn from your task patterns with a personal analytics dashboard. See how accurately you estimate time, discover your most productive hours, and get smart duration suggestions based on your history. It's like having a data analyst review all your completed tasks and tell you what patterns emerge.

**What it does:**
- **Duration Accuracy:** Shows your average time estimation accuracy percentage with trend (improving/stable/declining)
- **Best Hours:** Identifies your top 3 most productive hours based on completion rates
- **Smart Suggestions:** Recommends task durations based on your historical completion data
- **Category Insights:** Tracks patterns across different task types
- **Trend Analysis:** Compares recent performance to overall average

**Dashboard Cards:**

**1. Duration Accuracy Card:**
```javascript
// Calculate from task history
const history = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');

if (history.length > 0) {
  const accuracies = history.map(h => {
    const diff = Math.abs(h.estimatedDuration - h.actualDuration);
    return Math.max(0, 100 - (diff / h.estimatedDuration) * 100);
  });

  const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const recentAccuracies = accuracies.slice(-5);
  const recentAvg = recentAccuracies.reduce((a, b) => a + b, 0) / recentAccuracies.length;

  // Calculate trend
  const trend = recentAvg > avgAccuracy + 5 ? 'improving' :
                recentAvg < avgAccuracy - 5 ? 'declining' : 'stable';

  setAccuracyStats({
    average: Math.round(avgAccuracy),
    totalTasks: history.length,
    trend,
    recentAvg: Math.round(recentAvg)
  });
}
```

**Display:**
```
┌────────────────────────────────────┐
│ ⏱️ Duration Accuracy               │
│                                    │
│        78%                         │
│   Based on 42 tasks                │
│                                    │
│   📈 Improving (Recent: 85%)       │
│   You're getting better at         │
│   estimating task durations!       │
└────────────────────────────────────┘
```

**2. Best Hours Card:**
```javascript
// Analyze completion patterns by hour
const energyPatterns = JSON.parse(localStorage.getItem('timeflow-energy-patterns') || '{}');

const hourlyStats = Object.entries(energyPatterns).map(([hour, data]) => ({
  hour: parseInt(hour),
  completionRate: (data.completed / data.total) * 100,
  totalTasks: data.total
})).filter(h => h.totalTasks >= 3)  // Minimum sample size
  .sort((a, b) => b.completionRate - a.completionRate)
  .slice(0, 3);  // Top 3

setBestHours(hourlyStats);
```

**Display:**
```
┌────────────────────────────────────┐
│ 🌟 Your Best Hours                │
│                                    │
│  1. 9:00 AM  ━━━━━━━━━ 92%        │
│     12 tasks completed             │
│                                    │
│  2. 2:00 PM  ━━━━━━━━ 85%         │
│     8 tasks completed              │
│                                    │
│  3. 10:00 AM ━━━━━━━ 78%          │
│     15 tasks completed             │
└────────────────────────────────────┘
```

**3. Smart Suggestions Card:**
```javascript
// Find frequent tasks with duration history
const taskDurations = {};
history.forEach(h => {
  if (!taskDurations[h.name]) {
    taskDurations[h.name] = [];
  }
  taskDurations[h.name].push(h.actualDuration);
});

const suggestions = Object.entries(taskDurations)
  .filter(([name, durations]) => durations.length >= 3)  // At least 3 completions
  .map(([name, durations]) => {
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    return {
      taskName: name,
      suggestedDuration: Math.round(avgDuration),
      basedOn: durations.length
    };
  })
  .sort((a, b) => b.basedOn - a.basedOn)
  .slice(0, 5);

setSuggestions(suggestions);
```

**Display:**
```
┌────────────────────────────────────┐
│ 💡 Smart Suggestions               │
│                                    │
│ "Morning standup"                  │
│ → Usually takes 25 min             │
│   (based on 8 completions)         │
│                                    │
│ "Write blog post"                  │
│ → Usually takes 90 min             │
│   (based on 5 completions)         │
└────────────────────────────────────┘
```

**Implementation:** (`src/components/Insights.jsx`)
```jsx
import { useState, useEffect } from 'react';

export default function Insights({ onBack }) {
  const [accuracyStats, setAccuracyStats] = useState(null);
  const [bestHours, setBestHours] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    calculateInsights();
  }, []);

  const calculateInsights = () => {
    // Load data from localStorage
    const history = JSON.parse(localStorage.getItem('timeflow-task-history') || '[]');
    const energyPatterns = JSON.parse(localStorage.getItem('timeflow-energy-patterns') || '{}');

    // Calculate accuracy, best hours, suggestions
    // (Implementation shown above)
  };

  return (
    <div>
      {/* Dashboard cards with insights */}
    </div>
  );
}
```

**Navigation:**
- Accessed via "View Insights" card on Streak page
- Also available via hash navigation: `#/insights`
- Stats tab on bottom nav goes to Reflection (preserved user workflow)

**Data Sources:**
- `timeflow-task-history` - Completed task records with durations
- `timeflow-energy-patterns` - Hourly completion statistics
- Existing analytics infrastructure, no new data collection needed

**Key Files:**
- `src/components/Insights.jsx` - Main insights dashboard component
- `src/components/Streak.jsx` - "View Insights" navigation card (lines 133-176)
- `App.jsx` - Route handling for `#/insights` (lines 91-93, 175-183)

### 22. PWA & Offline Support 📱

**Plain English:** TimeFlow can be installed as a real app on your phone or computer, just like Instagram or Twitter. It works completely offline (no internet needed), loads instantly even without WiFi, and automatically updates itself in the background. It's a real app, not just a website bookmark.

**What it does:**
- **Installable:** Native "Add to Home Screen" prompt on mobile/desktop
- **Offline-First:** Works without internet connection
- **Service Worker:** Caches 713KB of assets for instant offline loading
- **Auto-Updates:** Automatically downloads new versions in background
- **Standalone Mode:** Runs without browser UI (no address bar)
- **Native Experience:** Full-screen app with system integration

**PWA Configuration** (`vite.config.js`):
```javascript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'TimeFlow - Task Timer',
        short_name: 'TimeFlow',
        description: 'Nature-inspired task scheduling and time management',
        theme_color: '#3B6E3B',
        background_color: '#F0F8F2',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365  // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
```

**Service Worker Features:**
- **Precaching:** 713KB of HTML, JS, CSS, icons precached during install
- **Runtime Caching:** Google Fonts cached for 1 year
- **Cache-First Strategy:** Assets served from cache, network as fallback
- **Auto-Update:** New versions downloaded in background, activated on next load
- **Offline Fallback:** Works completely offline after first visit

**Install Prompt Component** (`src/components/InstallPrompt.jsx`):
```jsx
import { useState, useEffect } from 'react';
import { haptic } from '../utils/haptics';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Only show if user hasn't dismissed before
      const dismissed = localStorage.getItem('timeflow-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    haptic.success();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    haptic.light();
    localStorage.setItem('timeflow-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div style={{ /* Banner styles */ }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '32px' }}>🌿</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>
            Install TimeFlow
          </div>
          <div style={{ fontSize: '13px', opacity: 0.85 }}>
            Get the full app experience with offline support
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={handleInstall}>Install</button>
        <button onClick={handleDismiss}>Not Now</button>
      </div>
    </div>
  );
}
```

**PWA Meta Tags** (`index.html`):
```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/icon-192.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TimeFlow 🌿</title>

  <!-- PWA Theme Colors -->
  <meta name="theme-color" content="#3B6E3B" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#1A1F1A" media="(prefers-color-scheme: dark)" />
  <link rel="apple-touch-icon" href="/icon-192.png" />
</head>
```

**Installation Instructions (in Onboarding - Screen 4):**
```
📱 On Mobile (iOS/Android):
1. Tap the share/menu button
2. Select "Add to Home Screen"
3. Tap "Add" to confirm

💻 On Desktop (Chrome/Edge):
1. Click install icon in address bar
2. Click "Install" in the prompt
3. TimeFlow opens as standalone app

✨ You'll get:
- Offline access (no WiFi needed)
- Fast loading (713KB cached)
- App icon on home screen
- No browser UI
```

**Benefits Over Basic Bookmark:**
| Bookmark | PWA |
|----------|-----|
| Opens in browser with URL bar | Opens as standalone app |
| Requires internet | Works offline completely |
| Slow loading | Instant (precached) |
| No updates | Auto-updates in background |
| Feels like website | Feels like native app |

**Cache Stats:**
- **Precached Assets:** 16 entries, 713KB total
- **Cache Lifetime:** Persistent until app update
- **Update Strategy:** Background download, activate on next launch
- **Offline Capability:** 100% functional offline after first visit

**Key Files:**
- `vite.config.js` - PWA plugin configuration with manifest and workbox
- `src/components/InstallPrompt.jsx` - Native install banner component
- `index.html` - PWA meta tags and theme colors
- `public/icon-192.png` - Home screen icon (192x192)
- `public/icon-512.png` - Splash screen icon (512x512)
- `App.jsx` - InstallPrompt integration (lines 188-189)

**Technology Stack:**
- **vite-plugin-pwa v1.2.0** - PWA build plugin
- **Workbox** - Service worker generation and caching strategies
- **Web App Manifest** - App metadata (name, icons, theme, display mode)
- **Service Worker API** - Background caching and offline support

### 23. Automatic Carry-Over at Start Time 🔄

**Plain English:** Don't manually carry over incomplete tasks every morning. TimeFlow automatically moves yesterday's unfinished tasks to today when you reach your configured start time (like 9:00 AM). Even if you have the app open before your start time, tasks will automatically appear when it's time to begin your day.

**What it does:**
- Automatically carries over incomplete tasks at your availability start time
- Works even if app is already open (periodic check)
- Prevents duplicate carries with localStorage tracking
- Only triggers once per day
- Respects your personal schedule (uses your configured start time, not a fixed time like 9 AM)

**Implementation** (`Today.jsx`):

**1. Initial Mount Check (with Start Time Validation):**
```javascript
useEffect(() => {
  const today = getTodayString();
  const carryOverKey = `timeflow-carryover-loaded-${today}`;
  const alreadyLoaded = localStorage.getItem(carryOverKey) === 'true';

  if (alreadyLoaded) return;

  // Check if current time is past availability start time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMin] = availability.start.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;

  // Only auto-carry-over if current time is past start time
  if (currentMinutes < startMinutes) {
    return; // Too early, don't carry over yet
  }

  // Load yesterday's unfinished tasks
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().slice(0, 10);
  const yesterdayTasks = JSON.parse(
    localStorage.getItem(`timeflow-tasks-${yesterdayDate}`) || '[]'
  );

  const unfinishedTasks = yesterdayTasks.filter(t => !t.completed);

  if (unfinishedTasks.length === 0) {
    localStorage.setItem(carryOverKey, 'true');
    return;
  }

  // Check for existing carried tasks (prevent duplicates)
  const existingCarriedIds = new Set(
    tasks
      .filter(t => t.carriedOver)
      .map(t => `${t.originalDate}-${t.name}`)
  );

  // Only add new carried tasks not already present
  const newUnfinishedTasks = unfinishedTasks
    .filter(t => !existingCarriedIds.has(`${yesterdayDate}-${t.name}`))
    .map((t, index) => ({
      ...t,
      id: Date.now() + index,
      carriedOver: true,
      originalDate: yesterdayDate,
      attempts: (t.attempts || 0) + 1
    }));

  if (newUnfinishedTasks.length > 0) {
    setTasks(prev => [...newUnfinishedTasks, ...prev]);
  }

  localStorage.setItem(carryOverKey, 'true');
}, [availability, tasks]);
```

**2. Periodic Check (Every Minute):**
```javascript
// Periodic check to auto-carry-over when start time is reached
useEffect(() => {
  const checkCarryOver = () => {
    const today = getTodayString();
    const carryOverKey = `timeflow-carryover-loaded-${today}`;
    const alreadyLoaded = localStorage.getItem(carryOverKey) === 'true';

    if (alreadyLoaded) return;

    // Check if current time is past availability start time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = availability.start.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;

    // Trigger carry-over if we've reached start time
    if (currentMinutes >= startMinutes) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().slice(0, 10);
      const yesterdayTasks = JSON.parse(
        localStorage.getItem(`timeflow-tasks-${yesterdayDate}`) || '[]'
      );

      const unfinishedTasks = yesterdayTasks.filter(t => !t.completed);

      if (unfinishedTasks.length === 0) {
        localStorage.setItem(carryOverKey, 'true');
        return;
      }

      // Check for existing carried tasks
      const existingCarriedIds = new Set(
        tasks
          .filter(t => t.carriedOver)
          .map(t => `${t.originalDate}-${t.name}`)
      );

      const newUnfinishedTasks = unfinishedTasks
        .filter(t => !existingCarriedIds.has(`${yesterdayDate}-${t.name}`))
        .map((t, index) => ({
          ...t,
          id: Date.now() + index,
          carriedOver: true,
          originalDate: yesterdayDate,
          attempts: (t.attempts || 0) + 1
        }));

      if (newUnfinishedTasks.length > 0) {
        setTasks(prev => [...newUnfinishedTasks, ...prev]);
      }

      localStorage.setItem(carryOverKey, 'true');
    }
  };

  // Check every minute (60000ms)
  const interval = setInterval(checkCarryOver, 60000);

  // Initial check on mount
  checkCarryOver();

  return () => clearInterval(interval);
}, [availability, tasks]);
```

**How It Works:**

**Scenario 1: Open app after start time (e.g., at 10 AM, start time is 9 AM)**
```
1. User opens TimeFlow at 10:00 AM
2. Current time (600 min) > Start time (540 min) ✓
3. Immediately carries over yesterday's unfinished tasks
4. Marks as loaded with localStorage flag
```

**Scenario 2: Open app before start time (e.g., at 8 AM, start time is 9 AM)**
```
1. User opens TimeFlow at 8:00 AM
2. Current time (480 min) < Start time (540 min) ✗
3. No carry-over yet (too early)
4. Periodic check runs every minute
5. At 9:00 AM, check detects: Current time (540 min) >= Start time (540 min) ✓
6. Automatically carries over tasks
7. User sees tasks appear without refresh
```

**Scenario 3: Already carried over today**
```
1. localStorage has 'timeflow-carryover-loaded-2026-02-19' = 'true'
2. Both mount check and periodic check skip
3. No duplicate carries
```

**Duplicate Prevention:**
- **localStorage flag:** `timeflow-carryover-loaded-${today}` prevents multiple triggers
- **Composite key matching:** `${originalDate}-${taskName}` identifies existing carried tasks
- **Set-based filtering:** O(1) lookup to avoid duplicate carries

**Key Benefits:**
- **User convenience:** No manual carry-over needed
- **Respects schedule:** Uses your configured start time, not arbitrary time
- **Real-time:** Works even if app is open before start time
- **No duplicates:** Robust duplicate prevention logic
- **Lightweight:** Only checks once per minute, minimal performance impact

**User Control:**
- Start time configured in Setup screen (`availability.start`)
- Can be changed anytime in settings
- Carry-over respects user's actual work hours
- Example: Night shift worker with 9 PM start → carries over at 9 PM

**Key Files:**
- `Today.jsx` - Automatic carry-over logic (lines 485-494, 525-570)
- localStorage keys:
  - `timeflow-carryover-loaded-${date}` - Tracks if carry-over completed today
  - `timeflow-tasks-${date}` - Yesterday's tasks to carry over
  - `timeflow-availability` - User's start time configuration

**User Feedback Confirmation:**
User asked: "u made it the strrt time u pu in right?"
Response: "Yes! It uses your availability.start setting (the start time you put in during setup)"

---

## How Rescheduling Works (Deep Dive)

### The Rescheduling Lifecycle

```
1. User starts task timer
         ↓
2. Timer counts down
         ↓
3. Timer reaches 0
         ↓
4. RescheduleModal appears
         ↓
5. User picks one of 7 options
         ↓
6. Task updated based on choice
         ↓
7. Attempts++ (if applicable)
         ↓
8. Health score recalculated
         ↓
9. Visual feedback updated
```

### Option 1: Mark Complete ✓

**When Used:** Task is finished

**What Happens:**
```javascript
const handleComplete = () => {
  const task = tasks.find(t => t.id === activeTaskId);

  // Calculate actual duration
  const actualDuration = Math.floor(
    (new Date() - new Date(task.startedAt)) / 60000
  );

  // Save to history
  saveTaskToHistory({
    ...task,
    actualDuration,
    completedAt: new Date().toISOString(),
    durationAccuracy: calculateDurationAccuracy(task, actualDuration)
  });

  // Mark complete
  setTasks(prev => prev.map(t =>
    t.id === activeTaskId
      ? { ...t, completed: true, remaining: 0 }
      : t
  ));

  // Stop timer
  clearInterval(timerRef.current);
  setActiveTaskId(null);
  setSecondsLeft(0);
  setShowRescheduleModal(false);

  // Celebration
  const allDone = tasks.filter(t => t.id !== activeTaskId).every(t => t.completed);
  if (!allDone) {
    setShowCelebration('task');
    setTimeout(() => setShowCelebration(null), 3000);
  }
};
```

**Side Effects:**
- Completion tracked in analytics
- Duration accuracy calculated
- Celebration animation triggered
- Task moved to completed section

**Attempts:** Does NOT increment (task was successful)

### Option 2: Continue Now ⏱️

**When Used:** Need just a bit more time

**What Happens:**
```javascript
const handleContinue = () => {
  const remainingMinutes = Math.ceil(secondsLeft / 60);

  // Update remaining time
  setTasks(prev => prev.map(t =>
    t.id === activeTaskId
      ? { ...t, remaining: remainingMinutes + 1 }  // Add 1 minute
      : t
  ));

  // Reset timer to 1 minute
  setSecondsLeft(60);
  setShowRescheduleModal(false);

  // Resume timer
  timerRef.current = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        setShowRescheduleModal(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};
```

**Side Effects:**
- Timer restarts with +1 minute
- No reschedule recorded
- No attempt increment

**Attempts:** Does NOT increment (not a true reschedule)

### Option 3: Later Today 🕐

**When Used:** Want to do task later in the day

**What Happens:**

**Step 1: Find Next Available Slot**
```javascript
export const findNextFreeSlot = (taskDuration, existingTasks, availability) => {
  const startM = hhmmToMinutes(availability.start);
  const endM = hhmmToMinutes(availability.end);
  const now = new Date();
  const currentM = now.getHours() * 60 + now.getMinutes();

  // Sort tasks by start time
  const scheduled = existingTasks
    .filter(t => t.start && t.end)
    .sort((a, b) => a.start - b.start);

  // Search from at least 15 min ahead
  let searchStart = Math.max(startM, currentM + 15);

  // Find gaps between tasks
  for (let i = 0; i < scheduled.length; i++) {
    const task = scheduled[i];
    const gapSize = task.start - searchStart;

    if (gapSize >= taskDuration) {
      // Found a slot!
      return {
        date: new Date().toISOString().slice(0, 10),
        startTime: minutesToHHMM(searchStart),
        endTime: minutesToHHMM(searchStart + taskDuration)
      };
    }

    searchStart = task.end;  // Move past this task
  }

  // Check final gap (after last task)
  const finalGap = endM - searchStart;
  if (finalGap >= taskDuration) {
    return {
      date: new Date().toISOString().slice(0, 10),
      startTime: minutesToHHMM(searchStart),
      endTime: minutesToHHMM(searchStart + taskDuration)
    };
  }

  return null;  // No slot available today
};
```

**Step 2: Update Task**
```javascript
const handleLaterToday = (slot) => {
  const task = tasks.find(t => t.id === activeTaskId);
  if (!task || !slot) return;

  setTasks(prev => prev.map(t =>
    t.id === activeTaskId
      ? {
          ...t,
          startTime: slot.startTime,
          scheduledFor: new Date(`${getTodayString()}T${slot.startTime}`).toISOString(),
          attempts: (t.attempts || 0) + 1,  // INCREMENT
          lastRescheduled: new Date().toISOString(),
          rescheduledReasons: [...(t.rescheduledReasons || []), 'later_today']
        }
      : t
  ));

  // Stop timer
  clearInterval(timerRef.current);
  setActiveTaskId(null);
  setSecondsLeft(0);
  setShowRescheduleModal(false);
};
```

**Side Effects:**
- Task moved to new time slot
- Appears later in timeline
- Attempt counter incremented
- Reschedule reason tracked

**Attempts:** YES, increments by 1

**Button State:**
- Disabled if no slots available
- Shows suggested time if slot found: "Later today (3:00 PM)"

### Option 4: Tomorrow 📅

**When Used:** Task won't fit today or need fresh start

**What Happens:**
```javascript
const handleTomorrow = () => {
  const task = tasks.find(t => t.id === activeTaskId);
  if (!task) return;

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  // Load tomorrow's tasks
  const tomorrowTasks = loadTasksForDate(tomorrowDate);

  // Create rescheduled version
  const rescheduledTask = {
    ...task,
    id: Date.now() + Math.random(),  // New ID
    carriedOver: true,
    originalDate: getTodayString(),
    remaining: task.remaining || task.duration,
    attempts: (task.attempts || 0) + 1,  // INCREMENT
    lastRescheduled: new Date().toISOString(),
    rescheduledReasons: [...(task.rescheduledReasons || []), 'tomorrow'],
    startTime: null,  // Clear time (unscheduled)
    scheduledFor: null
  };

  // Add to tomorrow
  tomorrowTasks.push(rescheduledTask);
  saveTasksForDate(tomorrowDate, tomorrowTasks);

  // Remove from today
  setTasks(prev => prev.filter(t => t.id !== activeTaskId));

  // Stop timer
  clearInterval(timerRef.current);
  setActiveTaskId(null);
  setSecondsLeft(0);
  setShowRescheduleModal(false);
};
```

**Side Effects:**
- Task removed from today
- New task created in tomorrow's list
- Marked as `carriedOver: true`
- Original date preserved
- Appears in orange "Carried Over" section tomorrow

**Attempts:** YES, increments by 1

### Option 5: Back to Pool 🌊

**When Used:** Not ready to commit to specific time

**What Happens:**
```javascript
const handleBackToPool = () => {
  const task = tasks.find(t => t.id === activeTaskId);
  if (!task) return;

  // Create pool version
  const poolTask = {
    name: task.name,
    duration: task.remaining || task.duration,
    inWeeklyPool: true,
    createdAt: new Date().toISOString(),
    movedToTodayCount: task.movedToTodayCount || 0
  };

  // Add to pool
  addTaskToWeeklyPool(poolTask);

  // Remove from today
  setTasks(prev => prev.filter(t => t.id !== activeTaskId));

  // Stop timer
  clearInterval(timerRef.current);
  setActiveTaskId(null);
  setSecondsLeft(0);
  setShowRescheduleModal(false);
};
```

**Side Effects:**
- Task removed from Today
- Added to Weekly Pool
- Loses time commitment
- Available for future "Move to Today"

**Attempts:** YES, increments by 1 (before moving to pool)

**Philosophy:**
- Guilt-free deferral
- Better than deletion
- Maintains task idea for later

### Option 6: Pick Time 🎯

**When Used:** Want custom time/duration

**What Happens:**
```javascript
const handlePickTime = () => {
  const task = tasks.find(t => t.id === activeTaskId);
  if (!task) return;

  // Close reschedule modal
  setShowRescheduleModal(false);

  // Stop timer
  clearInterval(timerRef.current);
  setActiveTaskId(null);
  setSecondsLeft(0);

  // Open edit dialog
  setEditingTask(task);
  setShowEditDialog(true);

  // (Edit dialog allows full control over task properties)
};
```

**Side Effects:**
- Opens EditTaskDialog
- User can modify: name, duration, start time, deadline
- On save, updates task with new values
- Attempts incremented when save happens

**Attempts:** YES, increments by 1 (on save)

### Option 7: Break Task 🔨

**When Used:** Task is too large/intimidating (appears after 3+ attempts)

**What Happens:**
```javascript
const handleBreakTask = () => {
  const task = tasks.find(t => t.id === activeTaskId);
  if (!task) return;

  const halfDuration = Math.ceil((task.remaining || task.duration) / 2);

  // Create part 1
  const part1 = {
    ...task,
    id: Date.now(),
    name: `${task.name} (Part 1)`,
    duration: halfDuration,
    remaining: halfDuration,
    attempts: 0,  // RESET attempts
    splitFrom: task.id
  };

  // Create part 2
  const part2 = {
    ...task,
    id: Date.now() + 1,
    name: `${task.name} (Part 2)`,
    duration: halfDuration,
    remaining: halfDuration,
    attempts: 0,  // RESET attempts
    splitFrom: task.id
  };

  // Replace original with two new tasks
  setTasks(prev => [
    ...prev.filter(t => t.id !== activeTaskId),
    part1,
    part2
  ]);

  // Stop timer
  clearInterval(timerRef.current);
  setActiveTaskId(null);
  setSecondsLeft(0);
  setShowRescheduleModal(false);
};
```

**Side Effects:**
- Original task removed
- Two new tasks created (50% duration each)
- Attempt counters reset to 0
- Linked via `splitFrom` field
- Smaller tasks = higher completion rate

**Attempts:** Original task's attempts are discarded (fresh start)

**When Suggested:**
- Automatically appears if `attempts >= 3`
- Button shows: "🔨 Break into smaller tasks"
- Research shows: >3 reschedules = low completion probability

---

## Data Models

### Task Object (Complete Schema)

```javascript
{
  // Core Properties
  id: number,                    // Unique identifier (timestamp + random)
  name: string,                  // Task description
  duration: number,              // Estimated duration in minutes
  remaining: number,             // Time left (for partial completion)
  completed: boolean,            // Completion status

  // Scheduling
  startTime: string | null,      // HH:MM format (e.g., "14:30")
  start: number | null,          // Minutes from midnight (870 = 14:30)
  end: number | null,            // Minutes from midnight (start + duration)
  scheduledFor: string | null,   // ISO datetime when scheduled

  // Rescheduling
  attempts: number,              // Number of times rescheduled
  lastRescheduled: string | null,// ISO datetime of last reschedule
  rescheduledReasons: string[],  // ['later_today', 'tomorrow', ...]

  // Carry-Over
  carriedOver: boolean,          // Brought from previous day
  originalDate: string | null,   // YYYY-MM-DD of original schedule

  // Deadlines
  deadline: string | null,       // ISO date (YYYY-MM-DD)
  deadlineWarnings: object[],    // History of warnings shown
  escalatedPriority: boolean,    // Auto-increased for urgent deadline
  originalPriority: number | null, // Before escalation

  // Priority & Flexibility
  priority: number,              // 1-5 (5 = highest)
  isFlexible: boolean,           // Can be moved/split

  // Conflicts & Dependencies
  conflicts: number[],           // IDs of conflicting tasks
  dependsOn: number[],           // Tasks that must complete first
  blockedBy: number[],           // Tasks waiting on this

  // Splitting
  splitFrom: number | null,      // Original task ID if split

  // Analytics
  estimatedDuration: number,     // Original estimate
  actualDuration: number,        // Time actually spent
  durationHistory: object[],     // Past completion records
  durationAccuracy: number,      // Percentage accurate (0-100)
  startedAt: string | null,      // ISO datetime when timer started
  completedAt: string | null,    // ISO datetime when completed

  // Weekly Pool
  inWeeklyPool: boolean,         // Currently in pool (not Today)
  movedToTodayCount: number,     // Times moved from pool to Today
  createdAt: string              // ISO datetime when created
}
```

### Availability Object

```javascript
{
  start: string,  // HH:MM (e.g., "09:00")
  end: string,    // HH:MM (e.g., "18:00")
  break: {
    start: string,  // Optional break start
    end: string,    // Optional break end
    duration: number // Break duration in minutes
  }
}
```

### Reflection Object

```javascript
{
  completedCount: number,    // Tasks completed
  totalCount: number,        // Total tasks for day
  timeSpent: number,         // Minutes of focused work
  reflection: string,        // User's written reflection
  mood: 'great' | 'good' | 'okay' | 'rough',
  unfinishedActions: {
    [taskId]: 'carry' | 'delete' | 'completed'
  }
}
```

### Health Assessment Object

```javascript
{
  status: 'healthy' | 'warning' | 'critical',
  score: number,        // 0-100 risk score
  reasons: string[],    // Human-readable explanations
  color: string         // Hex color for border (#6FAF6F, #f59e0b, #dc2626)
}
```

---

## Storage Architecture

### localStorage Keys

All data stored in browser's localStorage:

```javascript
// Current availability settings
'timeflow-availability': {
  start: "09:00",
  end: "18:00"
}

// Tasks for specific date
'timeflow-tasks-2026-02-15': [
  { /* task object */ },
  { /* task object */ }
]

// Weekly pool tasks
'timeflow-weekly-pool': [
  { /* pool task object */ }
]

// Daily reflections
'timeflow-reflections': {
  '2026-02-15': { /* reflection object */ }
}

// Carry-over tracking (prevents duplicates on remount)
'timeflow-carryover-loaded-2026-02-15': 'true'

// Task history (for analytics)
'timeflow-task-history': [
  {
    name: "Write documentation",
    estimatedDuration: 60,
    actualDuration: 75,
    completedAt: "2026-02-15T14:30:00Z",
    durationAccuracy: 80
  }
]

// Reschedule analytics
'timeflow-reschedule-analytics': {
  optionFrequency: {
    'complete': 245,
    'continue': 89,
    'later_today': 42,
    'tomorrow': 156,
    'back_to_pool': 67,
    'pick_time': 23,
    'break_task': 15
  }
}

// User preferences
'timeflow-settings': {
  preferredView: 'list',  // or 'calendar'
  focusModeEnabled: false,
  soundEnabled: true,
  theme: 'green'
}
```

### Storage Functions

Located in `src/utils/storage.js`:

#### Task Storage

```javascript
// Save tasks for specific date
export const saveTasksForDate = (date, tasks) => {
  try {
    localStorage.setItem(`timeflow-tasks-${date}`, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
};

// Load tasks for specific date
export const loadTasksForDate = (date) => {
  try {
    const data = localStorage.getItem(`timeflow-tasks-${date}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load tasks', e);
    return [];
  }
};

// Get today's tasks
export const loadTasks = () => {
  const today = new Date().toISOString().slice(0, 10);
  return loadTasksForDate(today);
};

// Save today's tasks
export const saveTasks = (tasks) => {
  const today = new Date().toISOString().slice(0, 10);
  saveTasksForDate(today, tasks);
};
```

#### Weekly Pool Storage

```javascript
export const loadWeeklyPool = () => {
  try {
    const data = localStorage.getItem('timeflow-weekly-pool');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveWeeklyPool = (tasks) => {
  try {
    localStorage.setItem('timeflow-weekly-pool', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save pool', e);
  }
};

export const addTaskToWeeklyPool = (task) => {
  const pool = loadWeeklyPool();
  const newTask = {
    id: Date.now(),
    inWeeklyPool: true,
    createdAt: new Date().toISOString(),
    movedToTodayCount: 0,
    ...task
  };
  pool.push(newTask);
  saveWeeklyPool(pool);
  return newTask;
};

export const removeTaskFromWeeklyPool = (taskId) => {
  const pool = loadWeeklyPool();
  const filtered = pool.filter(t => t.id !== taskId);
  saveWeeklyPool(filtered);
};
```

#### Reflection Storage

```javascript
export const saveReflection = (date, reflection) => {
  try {
    const reflections = loadAllReflections();
    reflections[date] = reflection;
    localStorage.setItem('timeflow-reflections', JSON.stringify(reflections));
  } catch (e) {
    console.error('Failed to save reflection', e);
  }
};

export const loadReflection = (date) => {
  const reflections = loadAllReflections();
  return reflections[date] || null;
};

export const loadAllReflections = () => {
  try {
    const data = localStorage.getItem('timeflow-reflections');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};
```

#### Availability Storage

```javascript
export const saveAvailability = (availability) => {
  try {
    localStorage.setItem('timeflow-availability', JSON.stringify(availability));
  } catch (e) {
    console.error('Failed to save availability', e);
  }
};

export const loadAvailability = () => {
  try {
    const data = localStorage.getItem('timeflow-availability');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};
```

---

## Components

### Component Hierarchy

```
App.jsx
├── Setup.jsx (first-time setup)
└── Today.jsx (main interface)
    ├── CalendarView.jsx
    ├── RescheduleModal.jsx
    ├── EditTaskDialog.jsx
    ├── DetailedTimeline.jsx
    ├── TaskHealthIndicator.jsx
    ├── TaskTimer.jsx
    ├── SwipeableTask.jsx (mobile wrapper)
    └── SortableTaskItem (inline)
├── WeeklyPool.jsx
    └── MoveToTodayDialog.jsx
├── WeeklyView.jsx
    └── ReflectionViewer.jsx
└── DayReflection.jsx (not yet implemented)
```

### Component Details

#### App.jsx

**Purpose:** Root component, routing logic

**State:**
- `screen`: Current view ('setup' | 'today' | 'pool' | 'week')

**Logic:**
```javascript
const [screen, setScreen] = useState(() => {
  const availability = loadAvailability();
  return availability ? "today" : "setup";
});

// Navigation handlers
const handleShowPool = () => setScreen("pool");
const handleShowToday = () => setScreen("today");
const handleShowWeek = () => setScreen("week");
```

**Renders:**
```jsx
{screen === "setup" && <Setup onComplete={() => setScreen("today")} />}
{screen === "today" && <Today onShowWeek={handleShowWeek} onShowPool={handleShowPool} />}
{screen === "pool" && <WeeklyPool onNavigateToToday={handleShowToday} />}
{screen === "week" && <WeeklyView onNavigateToToday={handleShowToday} />}
```

#### Today.jsx

**Purpose:** Main scheduling interface

**Major State:**
```javascript
const [tasks, setTasks] = useState([]);
const [availability, setAvailability] = useState(null);
const [activeTaskId, setActiveTaskId] = useState(null);
const [secondsLeft, setSecondsLeft] = useState(0);
const [focusModeEnabled, setFocusModeEnabled] = useState(false);
const [showRescheduleModal, setShowRescheduleModal] = useState(false);
const [viewMode, setViewMode] = useState('list'); // or 'calendar'
```

**Key Functions:**
- `addTask()`: Add new task with conflict detection
- `startTask(id)`: Begin timer for task
- `pauseTask()`: Pause active timer
- `deleteTask(id)`: Remove task
- `handleComplete()`: Mark task done
- `handleLaterToday()`: Reschedule to later slot
- `handleTomorrow()`: Move to tomorrow
- `handleBackToPool()`: Return to pool
- `handleBreakTask()`: Split into two tasks
- `toggleFocusMode()`: Toggle focus mode

**Effects:**
- Load tasks on mount
- Save tasks on change
- Update timer every second
- Keyboard shortcuts (F for focus mode)
- Auto-scroll to current time

#### RescheduleModal.jsx

**Purpose:** Present rescheduling options when timer ends

**Props:**
```javascript
{
  task: object,              // Current task
  availability: object,      // User's time window
  existingTasks: array,      // All tasks for slot finding
  onComplete: function,      // Mark complete handler
  onContinue: function,      // Add 1 min handler
  onLaterToday: function,    // Reschedule later handler
  onTomorrow: function,      // Move to tomorrow handler
  onBackToPool: function,    // Return to pool handler
  onPickTime: function,      // Custom time handler
  onBreakTask: function,     // Split task handler
  onClose: function          // Cancel handler
}
```

**Smart Features:**
- Calculates next free slot for "Later Today"
- Disables "Later Today" if no slots available
- Shows attempt count warning if >= 2
- Shows "Break Task" option if >= 3 attempts
- Smart recommendations based on history

#### TaskHealthIndicator.jsx

**Purpose:** Visual health status indicator

**Props:**
```javascript
{
  health: {
    status: 'healthy' | 'warning' | 'critical',
    score: number,
    reasons: string[],
    color: string
  },
  compact: boolean  // Compact vs full mode
}
```

**Rendering:**
- **Compact:** Small badge with icon + status
- **Full:** Detailed card with score + reasons list
- **Healthy:** Returns null (no indicator)
- **Tooltip:** Shows reasons on hover

#### DetailedTimeline.jsx

**Purpose:** Visual calendar view of day

**Features:**
- Hour-by-hour timeline (based on availability)
- Task blocks positioned by time
- Current time indicator (moving line)
- Click tasks to edit
- Overflow visualization

**Calculation:**
```javascript
// Convert time to pixel position
const timeToPosition = (time) => {
  const minutes = hhmmToMinutes(time);
  const startMinutes = hhmmToMinutes(availability.start);
  const totalMinutes = hhmmToMinutes(availability.end) - startMinutes;
  const percentage = ((minutes - startMinutes) / totalMinutes) * 100;
  return `${percentage}%`;
};

// Task block width based on duration
const widthPercentage = (duration, totalMinutes) => {
  return `${(duration / totalMinutes) * 100}%`;
};
```

#### WeeklyPool.jsx

**Purpose:** Brainstorming/planning space

**Features:**
- Add tasks with name only (no duration)
- List view of pool tasks
- "Move to Today" opens dialog for time commitment
- Delete tasks from pool
- Navigate back to Today

**Key Difference:**
- Pool tasks have NO time commitment
- Duration specified only when moving to Today
- Lower pressure for capturing ideas

#### WeeklyView.jsx

**Purpose:** 7-day week overview

**Features:**
- Day cards showing stats
- Completion percentage
- Reflection indicators
- Click to view specific day
- Click reflection badge to view reflection

**Data Aggregation:**
```javascript
export const getWeekData = (startDate) => {
  const week = [];
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);

    const tasks = loadTasksForDate(dateStr);
    const reflection = loadReflection(dateStr);

    week.push({
      date: dateStr,
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      taskCount: tasks.length,
      completedCount: tasks.filter(t => t.completed).length,
      completionRate: tasks.length > 0
        ? tasks.filter(t => t.completed).length / tasks.length
        : 0,
      reflection
    });
  }

  return week;
};
```

#### CalendarView.jsx

**Purpose:** Monthly calendar view with task indicators

**Props:**
```javascript
{
  onDaySelect: function,   // Callback when day is clicked
  selectedDate: string     // Currently selected date (YYYY-MM-DD)
}
```

**Features:**
- Dynamic month grid generation (accounts for starting day of week)
- Task data aggregation for each day
- Completion status visualization
- Navigation (prev/next month, today button)
- Touch-optimized with haptic feedback
- Responsive grid layout

**State Management:**
```javascript
const [currentDate, setCurrentDate] = useState(() => new Date());

// Calculate month properties
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);
const daysInMonth = lastDay.getDate();
const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
```

**Grid Generation:**
- Empty cells for days before month starts (based on startingDayOfWeek)
- Day cells with task data (loads from storage via `loadTasksForDate()`)
- Color-coded completion indicators
- Task count badges

**Visual States:**
- **Today:** Green border + background tint
- **Selected:** Accent border + background
- **Past:** Reduced opacity (50%)
- **Has Tasks:** Light gray background
- **Empty:** Transparent

---

## Utility Functions

### scheduler.js

Core scheduling algorithms:

#### `rescheduleUnfinishedTasks(tasks, availability)`
Auto-schedules unfinished tasks in available slots

#### `detectConflicts(tasks)`
Finds overlapping time blocks
```javascript
const conflicts = [];
for (let i = 0; i < tasks.length; i++) {
  for (let j = i + 1; j < tasks.length; j++) {
    if (tasks[i].start < tasks[j].end && tasks[i].end > tasks[j].start) {
      conflicts.push({ task1: tasks[i], task2: tasks[j] });
    }
  }
}
return conflicts;
```

#### `calculateOverflow(tasks, availability)`
Detects schedule overload
```javascript
const total = tasks.reduce((sum, t) => sum + (t.remaining || t.duration), 0);
const available = hhmmToMinutes(availability.end) - hhmmToMinutes(availability.start);
const overflow = total - available;

return {
  severity: overflow > 120 ? 'critical' : overflow > 60 ? 'warning' : 'none',
  overflowMinutes: Math.max(0, overflow),
  affectedTasks: overflow > 0 ? tasks.slice(-Math.ceil(overflow / 30)) : []
};
```

#### `getDeadlineUrgency(task)`
Calculates deadline proximity (shown earlier)

#### `detectPotentialConflicts(newTask, existingTasks)`
Prevents scheduling conflicts (shown earlier)

#### `getTaskHealth(task, allTasks, availability)`
Comprehensive health assessment (shown earlier)

#### `findNextFreeSlot(duration, tasks, availability)`
Smart slot finding (shown earlier)

### analytics.js

Analytics and learning functions:

#### `getTaskHistoryByName(taskName)`
Fuzzy matches task names to find similar completions
```javascript
const history = loadTaskHistory();
return history.filter(h =>
  h.name.toLowerCase().includes(taskName.toLowerCase()) ||
  taskName.toLowerCase().includes(h.name.toLowerCase())
);
```

#### `saveTaskToHistory(task)`
Records completion for learning
```javascript
const history = loadTaskHistory();
history.push({
  name: task.name,
  estimatedDuration: task.duration,
  actualDuration: task.actualDuration,
  completedAt: task.completedAt,
  durationAccuracy: task.durationAccuracy
});
// Keep last 500 entries
if (history.length > 500) history.shift();
saveTaskHistory(history);
```

#### `suggestDuration(taskName)`
Predicts duration based on history
```javascript
const history = getTaskHistoryByName(taskName);
if (history.length < 3) return null;

const durations = history.map(h => h.actualDuration);
const avg = durations.reduce((a, b) => a + b) / durations.length;
const min = Math.min(...durations);
const max = Math.max(...durations);

return {
  suggested: Math.round(avg),
  min,
  max,
  confidence: Math.min(100, history.length * 20)
};
```

#### `trackRescheduleOption(option)`
Records which option user picked
```javascript
const analytics = loadRescheduleAnalytics();
analytics.optionFrequency[option] = (analytics.optionFrequency[option] || 0) + 1;
saveRescheduleAnalytics(analytics);
```

#### `getHourlyCompletionRate(hour)`
Returns completion rate for specific hour
```javascript
const analytics = loadEnergyPatterns();
return analytics.hourlyCompletionRates[hour] || 0.5;
```

---

## User Workflows

### Workflow 1: Morning Planning

```
1. User opens TimeFlow → Today view loads
2. Sees carried-over tasks from yesterday (orange section)
3. Clicks "+ Add Task" to add new task
   - Enters: name, duration, start time
   - (Optional) sets deadline
4. System checks for conflicts
   - If conflict: Shows alert, blocks addition
   - If warning: Shows confirm dialog
5. Task appears in timeline
6. Repeats for multiple tasks
7. Reviews full schedule:
   - Green borders = healthy
   - Amber = warning (maybe too many reschedules)
   - Red = critical (needs attention)
8. Clicks red task → Decides to break it into smaller pieces
9. Ready to start day
```

### Workflow 2: Task Execution

```
1. Current time reaches task start time
2. User clicks "Start" button on task
3. Timer begins countdown
4. Task card gets pulsing green border
5. Other tasks dimmed (if focus mode enabled)
6. User works on task
7. Timer reaches 0
8. RescheduleModal appears with 7 options
9. User picks "Mark Complete" ✓
10. Celebration animation plays
11. Task moved to completed section
12. Next task ready to start
```

### Workflow 3: Handling Delays

```
1. Timer ends but task not done
2. RescheduleModal shows
3. User sees:
   - Attempt count: "⚠️ This has been rescheduled 2 times"
   - Smart suggestion: "💡 Recommended: Later today (3:00 PM)"
4. Reviews options:
   - Later Today: Shows "3:00 PM" (calculated slot)
   - Tomorrow: Available
   - Back to Pool: Available
5. User picks "Later Today"
6. Task jumps to 3:00 PM in timeline
7. Attempt counter: 2 → 3
8. Next time modal appears: "Break Task" option shows
9. Health status: Warning → Critical (score now 35)
10. Border color changes: Amber → closer to Red
```

### Workflow 4: End of Day

```
1. User clicks "End Day" button
2. DayReflection screen appears
3. Shows stats:
   - "7/10 tasks completed (70%)"
   - "420 minutes focused"
4. Lists 3 unfinished tasks with options:
   - "✅ Mark done anyway"
   - "📅 Carry to tomorrow"
   - "🗑️ Delete"
5. User:
   - Marks 1 done
   - Carries 2 to tomorrow
6. Writes reflection: "Good focus, but overestimated capacity"
7. Selects mood: "Good 🙂"
8. Clicks "Save & Continue"
9. Reflection saved
10. Tomorrow's tasks now have 2 carried-over tasks (orange section)
11. Weekly calendar shows 📝 badge for today
```

### Workflow 5: Weekly Review

```
1. User clicks "Week" button
2. Weekly calendar shows 7 days
3. Each day card shows:
   - Mon: 8 tasks, 75% complete, 📝
   - Tue: 10 tasks, 60% complete, 📝
   - Wed: 7 tasks, 85% complete, 📝
   - Thu: 9 tasks, 70% complete
   - Fri: 6 tasks, 100% complete, 📝
   - Sat: 3 tasks, 100% complete
   - Sun: Not yet
4. User clicks Monday's 📝 badge
5. ReflectionViewer modal opens:
   - Stats: "6/8 tasks (75%)"
   - Mood: "Good 🙂"
   - Reflection text: "Good focus, but overestimated capacity"
6. User reviews week patterns:
   - Tuesdays are hardest (60% completion)
   - Fridays best (100% completion)
7. Decides to schedule fewer tasks on Tuesdays
8. Closes modal, navigates back to Today
```

---

## Technical Architecture

### Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool & dev server
- **@dnd-kit**: Drag-and-drop functionality
- **localStorage**: Data persistence
- **CSS Modules**: Scoped styling (inline for now)

### No Dependencies For:
- Routing (hash-based manual routing)
- State management (React useState)
- Date handling (native Date API)
- HTTP requests (100% offline)

### Performance Optimizations

1. **Debounced localStorage saves:**
```javascript
const debouncedSave = useCallback(
  debounce((tasks) => saveTasks(tasks), 500),
  []
);
```

2. **Memoized calculations:**
```javascript
const taskBlocks = useMemo(() =>
  tasks.map(task => ({
    ...task,
    start: task.startTime ? hhmmToMinutes(task.startTime) : null,
    end: task.startTime
      ? hhmmToMinutes(task.startTime) + (task.remaining || task.duration)
      : null
  })),
  [tasks]
);
```

3. **Conditional rendering:**
```javascript
// Only render health indicator if not healthy
{health.status !== 'healthy' && (
  <TaskHealthIndicator health={health} compact={true} />
)}
```

### File Structure

```
TimeFlow/
├── src/
│   ├── App.jsx              # Root component
│   ├── App.css              # Global styles
│   ├── components/
│   │   ├── Today.jsx        # Main interface
│   │   ├── Setup.jsx        # First-time setup
│   │   ├── WeeklyPool.jsx   # Task pool
│   │   ├── WeeklyView.jsx   # Week calendar
│   │   ├── CalendarView.jsx # Monthly calendar
│   │   ├── DetailedTimeline.jsx  # Timeline view
│   │   ├── TaskHealthIndicator.jsx  # Health badges
│   │   ├── SwipeableTask.jsx # Mobile swipe wrapper
│   │   ├── mobile/
│   │   │   └── TaskCard.jsx # Mobile task cards
│   │   ├── shared/
│   │   │   └── TaskTimer.jsx # Active task timer
│   │   └── dialogs/
│   │       ├── RescheduleModal.jsx
│   │       ├── EditTaskDialog.jsx
│   │       ├── MoveToTodayDialog.jsx
│   │       └── ReflectionViewer.jsx
│   ├── utils/
│   │   ├── storage.js       # localStorage helpers
│   │   ├── scheduler.js     # Scheduling algorithms
│   │   ├── analytics.js     # Learning & tracking
│   │   └── haptics.js       # Haptic feedback utilities
│   └── main.jsx             # Entry point
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── vite.config.js
└── README.md                # This file
```

---

## Setup & Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd TimeFlow/TimeFlow

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory - ready to deploy as static site.

### Development Commands

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

(Requires modern browser with localStorage and ES6 support)

---

## Feature Breakdown

### Completed Features ✅

- ✅ Time-blocked scheduling
- ✅ Intelligent rescheduling (7 options)
- ✅ Task health assessment
- ✅ Weekly Pool
- ✅ Focus Mode
- ✅ Conflict detection
- ✅ Overflow detection
- ✅ Deadline management
- ✅ Carry-over system (with duplicate prevention)
- ✅ Drag-and-drop reordering
- ✅ Weekly calendar view
- ✅ Monthly calendar view with task indicators
- ✅ Reflection viewing
- ✅ Analytics tracking
- ✅ Smart suggestions
- ✅ Gentle Streaks & Gamification
- ✅ Timer pause/resume functionality
- ✅ Cancel active task mid-execution
- ✅ Mobile swipe gestures (bidirectional)
- ✅ Past time scheduling validation
- ✅ Mobile responsive with touch optimization

### Planned Features 🚧

- ⏳ End-of-day reflection screen
- ⏳ Task dependencies
- ⏳ Habit tracking
- ⏳ Mood tracking
- ⏳ Advanced analytics dashboard
- ⏳ Energy-based scheduling
- ⏳ Task batching suggestions
- ⏳ Break time detection
- ⏳ Flow state protection
- ⏳ Multi-day optimization
- ⏳ Time-of-day theming
- ⏳ Floating leaf animations

---

## Design System

### Colors

```css
--primary: #6FAF6F;       /* Forest green */
--primary-2: #123a12;     /* Deep green */
--vine: #3B6E3B;          /* Medium green */
--muted: #6B8E6B;         /* Muted green */
--bg: #F0F8F2;            /* Light mint background */

/* Health Status */
--healthy: #6FAF6F;       /* Green */
--warning: #f59e0b;       /* Amber */
--critical: #dc2626;      /* Red */
```

### Typography

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
             Roboto, "Helvetica Neue", Arial, sans-serif;

/* Headings */
h1: 28px, weight 900
h2: 24px, weight 800
h3: 18px, weight 700

/* Body */
p: 15px, weight 400
small: 13px
```

### Spacing

Base unit: 8px
- 4px: Tight spacing
- 8px: Default gap
- 12px: Medium gap
- 16px: Large gap
- 24px: Section spacing
- 32px: Major sections

### Border Radius

- Small: 8px
- Medium: 12px
- Large: 18px
- Pills: 9999px (fully rounded)

### Shadows

```css
--soft-shadow: rgba(59, 110, 59, 0.08);

/* Cards */
box-shadow: 0 8px 32px var(--soft-shadow);

/* Elevated */
box-shadow: 0 12px 40px var(--soft-shadow);
```

### Animations

```css
/* Transitions */
--transition-fast: 0.15s ease-out;
--transition-normal: 0.3s ease-out;

/* Focus pulse */
@keyframes focusPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(111,175,111,0.3); }
  50% { box-shadow: 0 0 0 6px rgba(111,175,111,0.15); }
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale in */
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## Contributing

### Code Style

- Use functional components
- Prefer hooks over class components
- Keep components under 500 lines
- Extract reusable logic to utils
- Use meaningful variable names
- Comment complex algorithms

### Commit Messages

```
feat: Add task health assessment
fix: Prevent timer from going negative
docs: Update README with rescheduling flow
refactor: Extract slot finding to utility
style: Update nature theme colors
test: Add tests for conflict detection
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with clear commits
3. Test thoroughly (manual for now)
4. Update README if adding features
5. Submit PR with description

---

## License

MIT License - See LICENSE file for details

---

## Credits

Built with ❤️ and 🌿 by the TimeFlow team.

Inspired by:
- Cal Newport's "Deep Work"
- Nir Eyal's "Indistractable"
- Natural productivity rhythms
- Calm, intentional software design

---

## Version History

### v1.0.0 (Current)
- Initial release
- Core scheduling features
- Intelligent rescheduling
- Task health assessment
- Weekly Pool
- Focus Mode
- Mobile responsive

### Upcoming v1.1.0
- End-of-day reflection screen
- Advanced analytics dashboard
- Task dependencies
- Energy-based scheduling

---

## FAQ

**Q: Where is my data stored?**
A: All data is stored locally in your browser's localStorage. Nothing is sent to servers.

**Q: Will I lose my data if I clear browser cache?**
A: Yes. Use browser export/import features to backup localStorage, or we'll add export in v1.1.

**Q: Why does "Later Today" sometimes not work?**
A: No available time slots found that fit the task duration. Try shortening the task or using "Tomorrow".

**Q: What does the risk score mean?**
A: 0-100 scale measuring likelihood of task failure based on attempts, deadlines, conflicts, and overflow.

**Q: Can I use this on mobile?**
A: Yes! Fully responsive design with touch-friendly targets.

**Q: Does this work offline?**
A: 100% offline. No internet required.

**Q: How do I backup my data?**
A: Export localStorage via browser dev tools, or wait for v1.1's built-in export feature.

**Q: Why is my task marked critical?**
A: Risk score ≥50. Usually due to: 5+ reschedules (40 pts) + deadline today (25 pts) = 65 pts = Critical.

---

## Keyboard Shortcuts

- `F` - Toggle Focus Mode
- `Esc` - Close modals/dialogs
- `Space` - Grab item (during drag-and-drop)
- `Arrow Keys` - Move item (during drag-and-drop)

---

## Support

For bugs, features, or questions:
- GitHub Issues: [repo-url]/issues
- Email: support@timeflow.app (placeholder)

---

**Made with calm productivity in mind. Flow through your day. 🌿**
