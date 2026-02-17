# TimeFlow

**A nature-themed intelligent task scheduler that helps you flow through your day with calm productivity.**

## What is TimeFlow?

TimeFlow is a smart daily planner that transforms traditional to-do lists into time-blocked schedules with intelligent rescheduling. Instead of endless tasks that create overwhelm, TimeFlow helps you plan realistically, execute with focus, and handle delays gracefully.

## The Problem It Solves

Traditional to-do apps let you overcommit without warning. You make a list with 10 tasks, realize at 5 PM you only finished 3, then feel guilty about the 7 undone tasks. This cycle repeats daily.

TimeFlow prevents this by:
- **Visual capacity awareness** - See your whole day as time blocks, not just a list
- **Early warnings** - Get alerted when you're overbooked before the day starts
- **Smart rescheduling** - 7 intelligent options when tasks take longer than expected
- **Pattern learning** - Tracks which tasks you avoid and which take longer than planned

## Core Features

### 🎯 Time-Blocked Scheduling
Assign specific start times and durations to tasks. See your entire day visually with a timeline showing exactly when each task happens. TimeFlow blocks conflicts automatically - you can't schedule two things at once.

### 🔄 Intelligent Rescheduling
When a task timer ends and you're not done, choose from 7 smart options:
- **Mark Complete** - Task is done
- **Continue +1 min** - Need a bit more time
- **Later Today** - Finds next free slot automatically
- **Tomorrow** - Moves to tomorrow's schedule
- **Back to Pool** - Returns to idea bucket (guilt-free)
- **Pick Time** - Choose custom time
- **Break Task** - Splits into smaller pieces (appears after 3+ delays)

### 📊 Task Health Assessment
Each task gets a health score based on:
- Number of times rescheduled
- Deadline proximity
- Scheduling conflicts
- Contribution to overflow

Visual color-coding helps you spot problem tasks early:
- 🟢 Green: Healthy (0-24 risk points)
- 🟡 Amber: Warning (25-49 risk points)
- 🔴 Red: Critical (50+ risk points)

### 🌊 Weekly Pool
A low-pressure brainstorming space where you capture task ideas without committing to when you'll do them. Add tasks with just names - no times or dates required. When ready, move them to "Today" and give them proper scheduling.

### 🎯 Focus Mode
Press 'F' to hide everything except your active task and timer. Minimalist, distraction-free environment with a pulsing green border to maintain flow state.

### 📱 Mobile-First Design
Built for mobile with:
- **Swipe gestures** - Swipe left to reveal Complete ✓ and Delete 🗑️ buttons
- **Touch-optimized** - Large hit targets and haptic feedback
- **Monthly calendar** - See your month at a glance with task completion indicators
- **Timer controls** - Pause/resume and cancel buttons for active tasks

### 🌿 Gentle Streaks
Track consistency with a growing plant metaphor. Miss a day? Get 1 grace day per week. Miss 2 days? Your streak pauses (not lost) giving you one more chance. No toxic pressure - just gentle encouragement.

### 🛡️ Smart Validation
TimeFlow prevents common mistakes:
- Can't schedule tasks at times that already passed
- Blocks duplicate carried tasks across sessions
- Prevents overlapping appointments
- Validates required fields and number ranges
- Safe deletion with cross-date state management

## How It Works

**Morning:** Open TimeFlow → See carried-over tasks → Add new tasks with times → Review visual timeline → Adjust if overbooked

**During Day:** Start task timer → Work → Timer ends → Choose rescheduling option → Continue

**Evening:** Click "End Day" → Review completion stats → Write reflection → Decide what to carry over

**Weekly Review:** Check weekly calendar → Review patterns → Adjust future planning

## Technology

- **100% Offline** - Uses browser localStorage, no server needed
- **React 18** - Modern, responsive UI
- **Mobile-Optimized** - Touch gestures, haptic feedback, responsive design
- **No Dependencies** - Minimal, fast, no external state management

## Key Differentiators

| Traditional Apps | TimeFlow |
|-----------------|----------|
| Endless lists | Time-blocked schedule |
| No capacity awareness | Visual overflow warnings |
| Manual reschedule decisions | 7 smart options |
| No pattern learning | Tracks avoidance & duration accuracy |
| Task deletion = failure | Back to Pool = low-pressure deferral |
| Toxic streaks | Gentle streaks with grace periods |
| Generic design | Nature-themed calm productivity |

## Perfect For

- People who make ambitious to-do lists but only finish half
- Those who underestimate how long tasks take
- Anyone who keeps pushing the same task to "tomorrow"
- Individuals seeking a calmer, more intentional productivity system
- Remote workers managing their own schedules
- Students balancing multiple projects with deadlines

## Philosophy

TimeFlow embraces **calm productivity** over hustle culture:
- Warm, encouraging language (no guilt-inducing messages)
- Nature-themed design (forest greens, growing plants)
- Realistic planning over wishful thinking
- Learning from patterns rather than forcing discipline
- Progress over perfection

## Quick Stats

- **7 rescheduling options** intelligently suggested
- **3-tier health system** (healthy, warning, critical)
- **Monthly calendar view** with completion indicators
- **Bidirectional swipe gestures** for mobile task actions
- **Pause/resume/cancel** timer controls
- **Cross-date validation** prevents scheduling mistakes

## Get Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Complete first-time setup (set work hours)
5. Add your first task with a time
6. Start the timer and begin flowing through your day

---

**Made with calm productivity in mind. Flow through your day. 🌿**

*For full documentation, see [README.md](README.md)*
