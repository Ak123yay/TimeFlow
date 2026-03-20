---
name: fix-bug
description: TimeFlow bug-fixing workflow for systematic diagnosis, resolution, and verification. Follow this process to identify root causes, implement targeted fixes, test thoroughly, and document solutions. Designed for both simple and complex bugs.
disable-model-invocation: true
argument-hint: "bug description or component affected"
---

# TimeFlow Bug-Fixing Workflow

## Overview
This skill guides you through a structured 7-step process for identifying and fixing bugs in TimeFlow while preventing regressions and maintaining code quality.

---

## Step 1: Understand the Bug

### Gather Information
- [ ] Read the complete bug description or error message
- [ ] Identify expected behavior vs actual behavior
- [ ] Note when the bug occurs (specific action, timing, condition)
- [ ] Determine which component/module is affected
- [ ] Check if bug is related to: task persistence, carryover, icons, UI, styling

### Categorize the Bug
**Task Management Bugs:**
- Carryover duplication, deleted tasks reappearing, missing tasks
- Associated files: `Today.jsx`, `storage.js`, `scheduler.js`

**UI/Styling Bugs:**
- Misaligned elements, wrong colors, incorrect responsive behavior
- Associated files: `App.css`, `swiftui.css`, `mobile.css`, component JSX

**Icon Rendering Bugs:**
- Icons not showing, wrong colors, size issues, dark mode problems
- Associated files: `/src/icons/`, `IconContext.jsx`

**Performance Bugs:**
- Slow rendering, jank, excessive re-renders, memory leaks
- Associated files: `Today.jsx`, `smartReschedule.js`, icon components

### Document Bug Details
Create a clear summary:
```
Bug: [One-sentence description]
Affected Component: [Which component]
Steps to Reproduce: [Exact steps]
Expected: [What should happen]
Actual: [What does happen]
Impact: [High/Medium/Low priority]
```

---

## Step 2: Investigate Root Cause

### Quick Reference - Common Bug Locations

#### Task Persistence Issues → Check:
- `Today.jsx` - deleteTask(), markComplete(), carryover logic
- `storage.js` - saveTasks(), saveTasksForDate(), loadTasks()
- Task matching logic - Look for `t.name ===` (NAME-BASED BUG!) vs `t.id ===`

#### Icon/Color Issues → Check:
- `/src/icons/` - Check `fill="none"`, stroke colors
- `IconContext.jsx` - Dark mode context setup
- `App.css`, `swiftui.css` - CSS overriding icon colors

#### Styling/Layout → Check:
- `App.css` - Global styles, theme variables
- `swiftui.css` - Tab bar specific
- `mobile.css` - Mobile responsive rules
- Component inline styles

### Systematic Search Process

1. **Identify search terms**
   - For task bugs: "deleteTask", "carriedMarked", "originalTaskId"
   - For icon bugs: "fill=", "stroke=", "#999", "#888"
   - For style bugs: "padding:", "margin:", "display:", className names

2. **Search in key files**
   - Today.jsx (first - most complex)
   - storage.js (if persistence related)
   - Component files (if specific to one view)
   - CSS files (if styling related)

3. **Look for patterns**
   - Duplicated code (multiple places with same logic)
   - Inconsistent implementations (different approaches to same problem)
   - Missing error handling around state updates
   - Race conditions in async operations

---

## Step 3: Identify Root Cause - Check Common Culprits

### Culprit 1: Name-Based Task Matching
```javascript
// ❌ BUG: This fails if task name changes
tasks.filter(t => t.name === taskToDelete.name)

// ✅ FIX: Use ID-based matching
tasks.filter(t => t.id === taskToDelete.originalTaskId)
```
**Where to check:** Any deletion, filtering, or comparison logic in Today.jsx

### Culprit 2: Debounced Deletion Saves
```javascript
// ❌ BUG: 500ms delay allows page close before save
setTimeout(() => saveTasks(deleted), 500)

// ✅ FIX: Save immediately
saveTasks(deleted); // No delay
```
**Where to check:** deleteTask(), any mutation followed by timeout

### Culprit 3: Missing Carryover Marking
```javascript
// ❌ BUG: Task carried to multiple days without marking
carryTasks(newDate); // Doesn't set carriedMarked

// ✅ FIX: Mark as carried to prevent re-carry
originalTasks[i].carriedMarked = true;
saveTasks(originalTasks);
```
**Where to check:** Carryover logic in Today.jsx, storage.js

### Culprit 4: Icon Color Issues
```javascript
// ❌ BUG: Hardcoded light color, breaks dark mode
<svg fill="none" stroke="#999">

// ✅ FIX: Use dynamic resolution
<svg fill="none" stroke={resolvedFill}>
```
**Where to check:** Any icon at `/src/icons/`, check for hardcoded colors

### Culprit 5: CSS Color Overrides
```css
/* ❌ BUG: CSS overrides icon stroke */
.icon {
  fill: #999;  /* Tried to fill outline icons! */
}

/* ✅ FIX: Only adjust if necessary */
.icon {
  fill: none;  /* Explicitly set to none */
}
```
**Where to check:** App.css, component style rules overriding icons

### Culprit 6: Incomplete Deduplication
```javascript
// ❌ BUG: Only checks one criteria
const seen = new Set();
tasks.filter(t => {
  if (seen.has(t.name)) return false; // Name can change!
  seen.add(t.name);
});

// ✅ FIX: Use composite key
const getDedupeKey = t => `${t.originalDate}-${t.originalTaskId}`;
const seen = new Set();
tasks.filter(t => {
  const key = getDedupeKey(t);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
```
**Where to check:** Carryover deduplication logic, search for `new Set()`

---

## Step 4: Implement the Fix

### Before Making Changes
- [ ] Have you identified EXACTLY which lines need changing?
- [ ] Have you read the surrounding code to understand context?
- [ ] Are there other places with the same bug pattern?
- [ ] Will this fix break anything else?

### Make Minimal Changes
- Only change code necessary to fix the bug
- Don't refactor surrounding code
- Don't add extra error handling for impossible cases
- Don't reorganize files or rename variables unnecessarily

### Example Fix Process

```javascript
// BEFORE (Buggy code)
const deleteTask = (taskToDelete) => {
  const updated = tasks.filter(t => t.name !== taskToDelete.name);
  // Problem: name-based matching, saves debounced
  setTimeout(() => saveTasks(updated), 500);
};

// AFTER (Fixed code)
const deleteTask = (taskToDelete) => {
  const updated = tasks.filter(t => t.id !== taskToDelete.originalTaskId);
  // Fixed: ID-based matching, immediate save
  saveTasks(updated);
};
```

### Update Related Code
- Find ALL places where same pattern occurs
- Apply fix consistently across file
- Don't create inconsistency between different locations

---

## Step 5: Test the Fix

### Pre-Testing Checklist
- [ ] No syntax errors (check console)
- [ ] Component renders without crashing
- [ ] Fixed functionality works as expected

### Functional Testing

#### Task Carryover Testing
```
1. Create task "Test Task" for today at 14:00
2. Don't complete it
3. Navigate to tomorrow
4. Verify task carried to tomorrow
5. Delete carried task
6. Refresh page
7. Verify task DOES NOT reappear
8. Navigate back to today
9. Verify original task STILL EXISTS (not deleted)
10. Edit original task name
11. Navigate to tomorrow again
12. Verify NO duplicate task appears
```

#### Icon Testing
```
1. View task list in light mode
2. Verify all icons are grey (#999)
3. Toggle OS dark mode
4. Verify all icons updated to dark grey (#888)
5. Zoom to 200% on mobile
6. Verify icons still readable at 20px size
7. Check tab bar icons specifically
```

#### Styling Testing
```
1. Measure tab bar height (should be 70px)
2. Check content doesn't overlap tab bar
3. Test on mobile (320px width)
4. Test on tablet (768px width)
5. Test on desktop (1024px+ width)
6. Verify all colors correct in dark mode
```

### Quality Checks
- [ ] No console errors or warnings
- [ ] No performance degradation (check DevTools)
- [ ] Dark mode still works correctly
- [ ] Mobile responsiveness maintained
- [ ] Animations still smooth (no jank)

---

## Step 6: Verify No Regressions

### Test Complete Workflows
- [ ] Create → Complete → Carryover (if applicable)
- [ ] Delete → Refresh → Verify (if applicable)
- [ ] Icon rendering at all sizes
- [ ] Dark mode toggle
- [ ] Mobile → Desktop responsiveness
- [ ] Cross-browser (Chrome, Firefox, Safari if possible)

### Run Through Testing Checklist
From CLAUDE.md testing section:
- [ ] Task carryover doesn't duplicate on new days
- [ ] Deleted tasks don't reappear after page reload
- [ ] Icons render at correct size (20px in tab bar)
- [ ] Icons stay grey (no unintended color changes)
- [ ] Dark mode works correctly
- [ ] No console errors or warnings
- [ ] localStorage data persists after browser close

---

## Step 7: Commit Changes

### Create Descriptive Commit

```bash
git add [modified files]
git commit -m "Fix: [Brief description of bug and solution]

[Detailed explanation of what was broken and why]

[What changed and why it fixes the issue]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

### Example Commits
```
Fix: ID-based task matching prevents carryover duplication

Previously, task deletion used name-based matching which failed when
task names were edited. This caused carried tasks to reappear after
deletion. Implemented ID-based matching with originalTaskId field
and immediate persists to prevent race conditions.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Update Documentation
- [ ] Update CLAUDE.md if pattern is common
- [ ] Add to "Common Bugs to Avoid" if applicable
- [ ] Update DOCUMENTATION.md if behavior changed
- [ ] Update README.md if feature affected

---

## Common Fix Patterns

### Pattern 1: Adding Missing Field
```javascript
// Add originalTaskId when carrying over
const carryTasks = () => {
  return incompleteTasks.map(t => ({
    ...t,
    originalTaskId: t.id,  // ADD THIS
    originalDate: today,
    carriedOver: true,
    carriedMarked: true,
  }));
};
```

### Pattern 2: Removing Debounce
```javascript
// Remove timeout delay from save
const deleteTask = (task) => {
  const updated = tasks.filter(t => t.id !== task.id);
  saveTasks(updated); // REMOVE setTimeout wrapper
};
```

### Pattern 3: Changing Matching Logic
```javascript
// Replace name matching with ID matching
// BEFORE: .filter(t => t.name === task.name)
// AFTER: .filter(t => t.id === task.originalTaskId)
```

### Pattern 4: Adding Color Resolution
```javascript
// Add dark mode support to icon
const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');
// USE: stroke={resolvedFill} NOT stroke="#999"
```

---

## Getting Help

If stuck:
1. Use `/timeflow-guide [component name]` to understand architecture
2. Use `/analyze-tasks [issue description]` to investigate systematically
3. Use `/design-review [component]` if styling is involved
4. Check git history: `git log -p --follow [file]` to see how code evolved
