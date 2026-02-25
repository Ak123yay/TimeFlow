# TimeFlow (Beta V1.1)

**A mobile optimized nature-themed intelligent task scheduler that helps you flow through your day with calm productivity.**
**Now with AI like rescheduling!**

## What is TimeFlow?

TimeFlow is a smart daily planner that transforms traditional to-do lists into time-blocked schedules with intelligent rescheduling. Instead of endless tasks that create overwhelm, TimeFlow helps you plan realistically, execute with focus, and handle delays gracefully.

## The Problem It Solves

Traditional to-do apps let you overcommit without warning. You make a list with 10 tasks, realize at 5 PM you only finished 3, then feel guilty about the 7 undone tasks. This cycle repeats daily.

TimeFlow prevents this by:
- **Visual capacity awareness** - See your whole day as time blocks, not just a list
- **Early warnings** - Get alerted when you're overbooked before the day starts
- **Smart rescheduling** - 7 intelligent options when tasks take longer than expected
- **Pattern learning** - Tracks which tasks you avoid and which take longer than planned
- **Adaptive UI** - Light/dark mode based on your system preferences
- **First-time guidance** - Helpful tooltips when you first visit each feature

## Core Features

### 🎯 Time-Blocked Scheduling
Assign specific start times and durations to tasks. See your entire day visually with a timeline showing exactly when each task happens. TimeFlow blocks conflicts automatically - you can't schedule two things at once.

### 🔍 Search & Filter
Quickly find tasks across your day with real-time search. Filter by task name or notes with instant results and 300ms debouncing for smooth performance. Available in Today view and Weekly Pool.

### 🔄 AI-Powered Intelligent Rescheduling
When a task timer ends and you're not done, TimeFlow's AI engine analyzes your behavioral patterns, predicts completion probability, detects procrastination, and ranks all options by suitability:
- **Mark Complete** - Task is done (boosted when deadline is urgent or completion probability is high)
- **Continue +Xmin** - Smart duration suggestion based on historical data (not just +1 min)
- **Later Today** - Finds and scores optimal time slots by energy patterns and category fit
- **Tomorrow** - Moves to tomorrow's schedule (discouraged for urgent/overdue tasks)
- **Back to Pool** - Returns to idea bucket (guilt-free deferral)
- **Pick Time** - Choose custom time manually
- **Break Task** - Splits into smaller pieces (strongly recommended after chronic avoidance)

Each option shows an AI-generated reason explaining why it's recommended, and the top pick gets an "AI" badge.

### 🧠 AI Rescheduling Engine
A multi-module behavioral intelligence system that learns from every decision you make:
- **Completion Probability Predictor** - 8-factor weighted model predicting whether you'll finish a task (base tendency, attempt decay, category rate, time-of-day energy, day-of-week performance, deadline urgency, duration realism, carried-over penalty)
- **Procrastination Detector** - 5-factor severity analysis (none/mild/moderate/severe/chronic) with actionable interventions
- **Optimal Time Slot Scorer** - Ranks available slots by hourly productivity patterns, category-time fit, deadline urgency, and buffer quality
- **Smart Continue Duration** - Suggests realistic additional time based on weighted historical averages instead of a flat +1 minute
- **Workload Balance Analyzer** - Scans the next 6 days to find the best day to reschedule tasks based on free capacity and completion rates
- **Behavioral Pattern Tracker** - Records every rescheduling decision with full context (hour, day, category, elapsed time, attempts) for ongoing learning
- **Pattern Insights Generator** - Produces human-readable insights about your productivity patterns (peak hours, avoided categories, chronic tasks, estimation accuracy)
- **Task Categorizer** - Keyword density analysis across 8 categories (coding, meetings, creative, email, admin, health, learning, personal) with confidence scoring

### ↩️ Flexible Task Management
- **Toggle completion status** - Accidentally marked complete? Click again to uncheck
- **Carried task tracking** - Shows original date ("from Feb 14") for carried tasks
- **Cross-date synchronization** - Completing carried tasks updates the original date
- **Automatic carry-over** - Tasks automatically carry over at your configured start time

### 📊 Insights Dashboard
Learn from your task patterns with personalized analytics:
- **Duration Accuracy** - See your time estimation accuracy with trends (improving/stable/declining)
- **Best Hours** - Discover your top 3 most productive hours based on completion rates
- **Smart Suggestions** - Get duration recommendations using exponentially weighted moving averages with recency bias
- **Category Insights** - Track patterns across 8 auto-detected task categories
- **Estimation Bias Detection** - Identifies systematic over- or under-estimation tendencies
- **Completion Momentum** - Tracks in-day streaks to boost motivation
- **Daily Productivity Score** - 0-100 composite score across completion rate, duration accuracy, reschedule count, and on-time starts

### 📱 PWA & Offline Support
Install TimeFlow as a full app with true offline capabilities:
- **Installable** - Add to home screen on any device with native install prompt
- **Offline-First** - Works completely offline with 713KB of cached assets
- **Auto-Updates** - Service worker automatically downloads new versions in background
- **App Experience** - Runs without browser UI in standalone window
- **Fast Loading** - Precached assets load instantly, even offline

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
- **Daily calendar** - See today's date prominently with progress stats
- **Monthly calendar** - Available in Week tab - see your full month at a glance
- **Timer controls** - Pause/resume and cancel buttons for active tasks
- **Bottom navigation** - Always accessible 5-tab navigation (Today, Week, Pool, Reflection, Streak)
- **5-screen onboarding** - Welcome, How It Works, Features, Install Guide, You're All Set
- **First-time tooltips** - Friendly guidance cards on first visit to each feature
- **Dark mode** - Automatic light/dark theme based on system preferences
- **Install prompt** - Native PWA install banner with "Install" and "Not Now" options

### 📅 Weekly Overview
- **Week/Month toggle** - Switch between weekly breakdown and monthly calendar
- **Reflection viewing** - Tap days with reflection badges to view past reflections
- **Task statistics** - See completion rates and task counts per day
- **Carried task tracking** - View how many tasks were carried each day

### 🌿 Gentle Streaks
Track consistency with a growing plant metaphor. Miss a day? Get 1 grace day per week. Miss 2 days? Your streak pauses (not lost) giving you one more chance. No toxic pressure - just gentle encouragement.

### 🛡️ Smart Validation
TimeFlow prevents common mistakes:
- Can't schedule tasks at times that already passed
- Blocks duplicate carried tasks across sessions
- Prevents overlapping appointments
- Validates required fields and number ranges
- Safe deletion with cross-date state management

### 🌓 Adaptive Theming
- **System-based** - Automatically switches between light and dark mode
- **Nature-inspired** - Forest greens in both themes
- **Dark mode palette** - Deep forest night colors with lighter accents
- **Seamless transitions** - All components adapt automatically

### 💡 First-Time Experience
- **Contextual tooltips** - Brief, helpful guidance when visiting features for the first time
- **Dismissible** - Mark as seen with "Got it" button
- **Persistent** - Never shows again once dismissed
- **5 key areas**: Today, Week, Pool, Stats (Reflection), and Streak

## How It Works

**Morning:** Open TimeFlow → See carried-over tasks → Add new tasks with times → Review visual timeline → Adjust if overbooked

**During Day:** Start task timer → Work → Timer ends → Choose rescheduling option → Continue

**Evening:** Click "End Day" → Review completion stats → Write reflection → Decide what to carry over

**Weekly Review:** Check weekly calendar → Toggle to month view → Review patterns → Adjust future planning

## Technology

- **100% Offline** - Uses browser localStorage, no server needed
- **React 19.2** - Modern, responsive UI
- **Vite 7.2.4** - Lightning-fast build and dev server
- **PWA (Progressive Web App)** - vite-plugin-pwa v1.2.0 with Workbox
- **Service Worker** - Precaches 713KB of assets, offline-first with auto-updates
- **Mobile-Optimized** - Touch gestures, haptic feedback, responsive design
- **Framer Motion 12** - Smooth animations
- **Minimal Dependencies** - No external state management
- **CSS Variables** - Dynamic theming with system preference detection
- **Lazy Loading** - Optimized code splitting for fast initial load

## Key Differentiators

| Traditional Apps | TimeFlow |
|-----------------|----------|
| Endless lists | Time-blocked schedule |
| No capacity awareness | Visual overflow warnings |
| Manual reschedule decisions | AI-powered recommendation engine with 7 ranked options |
| No pattern learning | Behavioral intelligence with procrastination detection |
| Fixed "+5 min" extensions | Smart continue duration based on historical data |
| No slot intelligence | Energy-aware optimal time slot scoring |
| Task deletion = failure | Back to Pool = low-pressure deferral |
| Toxic streaks | Gentle streaks with grace periods |
| Generic design | Nature-themed calm productivity |
| Static appearance | Adaptive light/dark mode |
| No guidance | First-time tooltips + 5-screen onboarding |
| Browser bookmark | Installable PWA with offline support |
| Manual task carry-over | Automatic at your start time |
| No search | Real-time search with debouncing |
| No self-awareness | Completion probability predictions + pattern insights |

## Perfect For

- People who make ambitious to-do lists but only finish half
- Those who underestimate how long tasks take
- Anyone who keeps pushing the same task to "tomorrow"
- Individuals seeking a calmer, more intentional productivity system
- Remote workers managing their own schedules
- Students balancing multiple projects with deadlines
- Users who prefer dark mode for late-night planning

## Philosophy

TimeFlow embraces **calm productivity** over hustle culture:
- Warm, encouraging language (no guilt-inducing messages)
- Nature-themed design (forest greens, growing plants)
- Adaptive dark theme for comfort in any lighting
- Realistic planning over wishful thinking
- Learning from patterns rather than forcing discipline
- Progress over perfection
- Gentle guidance for first-time users

## Quick Stats

- **AI rescheduling engine** - 10 subsystems with 1500+ lines of behavioral intelligence
- **8-factor completion probability** predictor with confidence scoring
- **5-level procrastination detection** (none/mild/moderate/severe/chronic) with interventions
- **Energy-aware slot scoring** using hourly productivity patterns and category-time fit
- **Smart continue duration** using exponentially weighted historical averages
- **Workload balance analysis** across 6 upcoming days
- **7 rescheduling options** ranked by AI with personalized reasons
- **8 auto-detected task categories** (coding, meetings, creative, email, admin, health, learning, personal)
- **3-tier health system** (healthy, warning, critical)
- **Real-time search** with 300ms debouncing in Today and Pool views
- **Insights dashboard** with duration accuracy, best hours, and smart suggestions
- **PWA support** - 713KB precached, offline-first with service worker
- **Automatic carry-over** at your configured start time
- **Toggle completion** - Uncheck tasks if marked by mistake
- **Daily + Monthly calendars** - Daily view in Today, monthly in Week
- **5-screen onboarding** - Welcome, How It Works, Features, Install Guide, Setup
- **Bidirectional swipe gestures** for mobile task actions
- **Pause/resume/cancel** timer controls
- **Cross-date validation** prevents scheduling mistakes
- **Automatic theming** - Light/dark based on system
- **5 first-time tooltips** - Helpful guidance on first use
- **Persistent bottom nav** - Always accessible navigation

## Get Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Complete 5-screen onboarding (Welcome → How It Works → Features → Install Guide → Setup)
5. Add your first task with a time
6. Start the timer and begin flowing through your day

**PWA Installation:**
- Run `npm run build` to generate the PWA with service worker
- Serve the `dist` folder (e.g., `npx serve dist`)
- Open on mobile to see native install prompt
- Or use browser's "Install app" menu option

**Tip:** Your system's light/dark mode preference will be automatically applied!

---

**Made with calm productivity in mind. Flow through your day. 🌿**

*For full documentation, see [DOCUMENTATION.md](DOCUMENTATION.md)*
