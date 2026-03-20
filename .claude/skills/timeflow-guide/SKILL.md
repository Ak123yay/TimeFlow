---
name: timeflow-guide
description: Comprehensive TimeFlow project architecture, design patterns, data structures, and best practices. Use when understanding how TimeFlow works, learning codebase conventions, planning features, reviewing code architecture, or debugging cross-component issues.
user-invocable: true
disable-model-invocation: false
argument-hint: "topic or file to understand"
---

# TimeFlow Project Guide - Comprehensive Architecture Reference

TimeFlow is a nature-themed intelligent task scheduler built with React 18 + Vite that helps users flow through their day with calm, realistic productivity. The app combines time-blocking visualization, intelligent AI-powered rescheduling, behavioral learning, and a gentle UX philosophy focused on progress over perfection.

**Core Philosophy:** Realistic planning over wishful thinking, gentle guidance over guilt, progress over perfection.

---

## Project Overview & Key Features

### Primary Features
1. **Time-Blocked Scheduling** - Visual timeline representation of tasks with specific times and durations throughout the day
2. **AI-Powered Rescheduling** - 7 ranked suggestions when tasks overrun their allocated time (smartReschedule.js, 1500+ lines)
3. **Task Health Assessment** - 3-tier risk system (green/amber/red) based on attempts, deadlines, and schedule conflicts
4. **Weekly Pool** - Low-pressure brainstorming space for task ideas without fixed times or pressure
5. **Insights Dashboard** - Analytics on productivity patterns, duration accuracy, best performing hours/days
6. **PWA & Offline** - 100% offline functionality with service worker, 713KB precached, progressive web app installation

### Design Philosophy
- Nature-inspired visual aesthetic (greens, warm earth tones, organic shapes)
- Calm, non-overwhelming UI that encourages gentle self-reflection
- Mobile-first design with iOS-style animations and haptic feedback
- No gamification or guilt-inducing mechanics
- Focus on learning user patterns and providing supportive suggestions

---

## Current Architecture - High-Level Overview

### Technology Stack
- **Frontend Framework**: React 18 with Hooks (functional components)
- **Build Tool**: Vite (fast development, optimized production builds)
- **Styling**: Custom CSS (no Tailwind) with CSS variables and dark mode support
- **Animation**: Framer Motion for smooth, spring-based transitions
- **Storage**: localStorage for persistence (synchronous, no external database)
- **Icons**: 60+ custom SVG icons (minimalistic outline-only design, maintained icon system)

### File Structure & Critical Components

#### Core Components
- **`Today.jsx`** (2700+ lines) - Main daily view component
  - Task management (CRUD operations)
  - Carryover logic for incomplete tasks
  - Completion/uncommpletion handlers
  - Task filtering and search
  - State management with useState/useCallback
  - Integration with storage.js for persistence

- **`storage.js`** (450+ lines) - Data persistence layer
  - localStorage read/write operations (synchronous)
  - Task loading from dates
  - Cross-date task synchronization
  - Carryover task generation with ID-based deduplication
  - Cache management for performance

- **`smartReschedule.js`** (1500+ lines) - AI rescheduling engine
  - 10 subsystems for ranking reschedule options
  - Conflict detection and avoidance
  - Deadline awareness
  - User behavior pattern analysis
  - Duration accuracy learning
  - 7 ranked suggestions returned to user

- **`scheduler.js`** (300+ lines) - Scheduling utilities
  - Time slot detection and validation
  - Conflict checking between tasks
  - Task categorization
  - Duration estimation
  - Available time window calculation

- **`/src/icons/` (60+ files)**
  - Organized by category: Growth, Status, Emotions, UI Controls, Categories, Achievements, Platform, Misc
  - All use minimalistic outline-only design
  - Centralized dark mode via useIconContext()
  - React.memo optimization on all icons
  - Barrel export in index.js for tree-shaking

#### Styling Files
- **`swiftui.css`** - Tab bar styling (70px fixed height, solid backgrounds)
- **`mobile.css`** - Mobile-specific responsive styles
- **`App.css`** - Global styles, animations, theme variables

#### Supporting Files
- **`IconContext.jsx`** - React context for dark mode detection and icon styling
- **`MobileLayout.jsx`** - Mobile layout wrapper, tab bar integration
- **`SwiftUIComponents.jsx`** - Tab bar component with 5-item navigation

### Data Flow Architecture
```
User Action
    ↓
Component State Update (Today.jsx)
    ↓
Calculation/Validation (scheduler.js, smartReschedule.js)
    ↓
localStorage Save (storage.js saveTasks/saveTasksForDate)
    ↓
Cross-Date Sync (if carryover/multi-day logic)
    ↓
UI Re-render (React)
```

---

## Task Data Structure - Complete Reference

Every task follows this standardized structure:

```javascript
{
  // UNIQUE IDENTIFICATION
  id: Date.now() + Math.random(),           // Unique ID (used for ALL matching)
  originalTaskId: null,                     // For carried-over tasks: ID of original

  // BASIC INFORMATION
  name: "Task name",                        // User-provided task description
  category: "coding",                       // Auto-detected category for insights

  // TIMING & DURATION
  duration: 30,                             // Estimated duration in minutes
  remaining: 30,                            // Time remaining (updates as task runs)
  startTime: "14:30",                       // HH:MM format (24-hour)
  deadline: "2026-03-19",                   // YYYY-MM-DD deadline (optional)

  // STATUS & TRACKING
  completed: false,                         // Whether task is finished
  attempts: 0,                              // Number of times task was attempted
  totalTimeSpent: 45,                       // Total time invested (if overrun)

  // CARRYOVER-SPECIFIC (added when carried to new day)
  carriedOver: true,                        // Marks this as a carried task
  originalDate: "2026-03-18",               // Original creation date (YYYY-MM-DD)
  carriedMarked: true,                      // Prevents re-carrying duplicate

  // METADATA
  notes: "",                                // Optional user notes (rarely used)
  health: "green"|"amber"|"red",            // Risk assessment for insights
}
```

**CRITICAL:** Always use `id` and `originalTaskId` for task identification/matching. NEVER use task names for matching.

---

## Recent Major Changes (v1.1.2) - Latest Updates

### 1. Tab Bar Redesign (UI/UX Enhancement)
- **Height**: Fixed 70px (changed from 90px)
- **Background**: Solid white (#ffffff) in light mode, solid #1a1a1a in dark mode (removed glassmorphism)
- **Width**: 100vw for full viewport width
- **Icons**: 20px fixed size, grey color (#999 light, #888 dark)
- **Active Tab Indicator**: Thin underline (2px height, 30px width)
- **Layout**: Fixed positioning at bottom of viewport, full width

### 2. Icon System Overhaul (Design System Update)
- **60+ icons converted** from filled/gradient designs to minimalistic outline-only
- **Stroke Weight**: Consistent 1.1-1.3px across all icons
- **Color**: All grey (#999 light mode, #888 dark mode) - no color variety
- **Rendering**: All use `fill="none"` on SVG element
- **Dark Mode**: Automatic detection via `useIconContext()` hook
- **Organization**: 8 categories (Growth, Status, Emotions, UI Controls, Categories, Achievements, Platform, Misc)
- **Performance**: React.memo wrapper on all icons

### 3. Critical Bug Fix - Carried-Over Task Deduplication
**Problem:** Tasks were duplicating when carried to new days and reappearing after deletion
**Root Causes:**
1. Name-based task matching (fragile, breaks on edits)
2. Unreliable `carriedMarked` flags
3. Debounced deletion saves (race condition on page close)
4. Missing deduplication on re-carry

**Solution Implemented:**
- ID-based matching with `originalTaskId` field
- Immediate persistence for deletions (no debounce)
- Composite deduplication key: `${originalDate}-${originalTaskId}`
- Mandatory `carriedMarked: true` flag after carryover

---

## Critical Patterns & Best Practices

### Pattern 1: ID-Based Task Matching (MOST IMPORTANT)
**ALWAYS use task IDs, NEVER use task names:**

```javascript
// ✅ CORRECT: Use originalTaskId for carried tasks
const deleteCarriedTask = (taskToDelete) => {
  const updated = tasks.filter(t => t.id !== taskToDelete.originalTaskId);
  saveTasks(updated); // IMMEDIATE - no debounce
};

// ❌ WRONG: Name-based matching fails on edits
const deleteByName = (taskName) => {
  const updated = tasks.filter(t => t.name !== taskName); // FRAGILE!
};

// ❌ WRONG: Using task ID instead of originalTaskId for carried tasks
const wrongMatching = tasks.filter(t => t.id === carriedTask.id); // Won't find original
```

### Pattern 2: Immediate Persistence for Deletions
**Critical for preventing data loss:**

```javascript
// ✅ CORRECT: Save immediately after deletion
const deleteTask = (task) => {
  const updated = tasks.filter(t => t.id !== task.id);
  saveTasks(updated); // Call immediately, no delay
};

// ❌ WRONG: Delayed save allows race conditions
const deletedTasks = [];
const deleteWithDelay = (task) => {
  deletedTasks.push(task);
  // 500ms debounce delay - page could close before save!
  setTimeout(() => saveTasks(/* filtered */), 500);
};
```

### Pattern 3: Deduplication Key Pattern
**Prevent re-carrying same task multiple times:**

```javascript
// ✅ CORRECT: Composite key with date and ID
const getDedupeKey = (task) => `${task.originalDate}-${task.originalTaskId}`;
const seen = new Set();
const deduplicated = tasks.filter(t => {
  const key = getDedupeKey(t);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// ❌ WRONG: Name-based key breaks on edits
const wrongKey = `${task.originalDate}-${task.name}`; // Name changes!
```

### Pattern 4: Icon Component Structure
**All icons follow this template:**

```javascript
import React from 'react';
import { useIconContext } from '../IconContext';

const IconName = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={resolvedFill}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outline-only SVG paths */}
    </svg>
  );
});

IconName.displayName = 'IconName';
export default IconName;
```

### Pattern 5: Color System & CSS Variables
**Use CSS variables for theming:**

```css
/* Light mode (default) */
:root {
  --primary: #3B6E3B;        /* Forest green */
  --primary-2: #6FAF6F;      /* Light green */
  --success: #52B788;         /* Fresh leaf */
  --warning: #F9C74F;         /* Golden */
  --danger: #FF6B6B;          /* Autumn berry */
  --info: #90E0EF;            /* Water blue */
  --text-primary: #1A1A1A;
  --bg: #F0F8F2;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --primary: #6FAF6F;      /* Lighter in dark */
    --bg: #1A1F1A;
    /* Adjust +10-15% brightness from light mode */
  }
}
```

---

## Color System Reference

### Primary Colors
- **Forest Green (Light)**: #3B6E3B - Primary brand color
- **Light Green (Dark)**: #6FAF6F - Accent and dark mode primary
- **Moss Green**: #7C9A73 - Secondary tone
- **Sage Green**: #9DB39B - Tertiary tone

### Status Colors (Nature-Inspired)
- **Success (Fresh Leaf)**: #52B788 - Completed, healthy status
- **Warning (Sunset)**: #F9C74F - Golden, gentle warning
- **Danger (Autumn Berry)**: #FF6B6B - Alert, urgent status
- **Info (Water Blue)**: #90E0EF - Informational, calm blue

### Neutral & Background
- **Text Primary**: #1A1A1A (light), #E8F0E8 (dark)
- **Text Secondary**: #8E8E93
- **Background**: #F0F8F2 (light), #1A1F1A (dark)
- **Card**: #ffffff (light), #242B24 (dark)

### Icon Colors
- **Light Mode**: #999 (grey, 60% opacity equivalent)
- **Dark Mode**: #888 (darker grey)
- **Never use other colors for icons** - maintain consistency

---

## Common Bug Patterns & Prevention

### Bug Category 1: Task Matching Issues
❌ **Name-based matching** - Breaks when task is renamed
❌ **Using wrong ID** - Using `id` instead of `originalTaskId` for carried tasks
❌ **String comparison edge cases** - Extra spaces, case sensitivity

✅ **Prevention:** Always use `originalTaskId` with strict equality (`===`)

### Bug Category 2: Data Persistence Issues
❌ **Debounced saves on deletions** - Page closes before save completes
❌ **Batch deletion** - Saving multiple deletions together
❌ **Missing persist calls** - Forgetting to call `saveTasks()`

✅ **Prevention:** Save immediately after each deletion, no debounce

### Bug Category 3: Carryover Duplication
❌ **Duplicate re-carrying** - Same task carried multiple times
❌ **Missing carriedMarked flag** - Original task carried again
❌ **Incomplete deduplication** - Only checking one criteria

✅ **Prevention:** Use composite key (`${date}-${originalTaskId}`), set `carriedMarked: true`

### Bug Category 4: Icon/Styling Issues
❌ **Filled SVG shapes** - Using `fill` instead of outline strokes
❌ **Hardcoded colors** - Different colors for different icons
❌ **Wrong sizes** - 24px in tab bar instead of 20px
❌ **Missing dark mode** - Not using `useIconContext()`

✅ **Prevention:** Use template, verify `fill="none"`, use context for colors

---

## Testing Checklist - Before Committing

- [ ] Task carryover doesn't duplicate on new days (refresh page, check)
- [ ] Deleted tasks don't reappear after page reload
- [ ] Icons render at correct sizes (20px in tab bar, 24px in cards)
- [ ] Icons stay grey (no unintended color changes visible)
- [ ] Dark mode works correctly (toggle OS dark mode)
- [ ] No console errors or warnings in browser devtools
- [ ] localStorage data persists after browser close (check Application tab)
- [ ] Mobile layout responsive on small screens (320px+)
- [ ] Tab bar doesn't overlap content (70px padding-bottom)
- [ ] Animations are smooth (no jank or stuttering)

---

## Performance Considerations

- **Task rendering**: Use `useMemo` for large filtered lists (100+ tasks)
- **Storage operations**: localStorage is synchronous, keep saves lean
- **Conflict detection**: O(n²) algorithm acceptable for <100 tasks
- **Search debounce**: 300ms minimum to avoid excessive re-renders
- **Icon rendering**: All icons use React.memo for optimization
- **Animations**: Use CSS transforms for 60fps animations (avoid layout thrashing)

---

## Quick Reference - File Locations

- **Main View**: `src/components/Today.jsx`
- **Data Persistence**: `src/utils/storage.js`
- **Scheduling Engine**: `src/utils/smartReschedule.js`, `src/utils/scheduler.js`
- **Icons**: `src/icons/` (organized by category)
- **Styles**: `src/styles/swiftui.css`, `src/styles/mobile.css`, `src/App.css`
- **Layout**: `src/components/mobile/MobileLayout.jsx`
- **Tab Bar**: `src/components/SwiftUIComponents.jsx`
- **Dark Mode Context**: `src/components/IconContext.jsx`
