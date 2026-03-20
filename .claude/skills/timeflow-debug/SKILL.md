---
name: timeflow-debug
description: Systematic Debugging skill with 4-phase methodology (Investigate → Analyze → Hypothesize → Implement). Prevents premature fixes by enforcing root cause investigation before implementation. TimeFlow-specific patterns for carryover, icons, dark mode, and localStorage issues.
user-invocable: true
disable-model-invocation: false
argument-hint: "bug description or component affected"
---

# TimeFlow Systematic Debugging (4-Phase Methodology)

## Overview

This skill implements a disciplined 4-phase debugging workflow that prevents reactive fixes and ensures developers understand root causes before implementing solutions.

**Core Rule:** You may NOT fix the bug until Phase 3 is complete.

---

## PHASE 1: ROOT CAUSE INVESTIGATION

### Goal: Understand Bug Scope & Gather Evidence

### Step 1.1: Reproduce Systematically

**Checklist:**
- [ ] Reproduce bug in clean browser state (clear localStorage first)
- [ ] Reproduce in both light AND dark mode
- [ ] Reproduce on desktop AND mobile viewport
- [ ] Reproduce after page refresh (test persistence)
- [ ] Reproduce on different browser (if possible)
- [ ] Document exact reproduction steps

**Reproduction Template:**

```
1. [Action by user]
2. [Action by system]
3. [Expected result]
4. [Actual result - the bug]
5. [Screenshots/error messages]
```

### Step 1.2: Isolate Affected Components

**Questions to Answer:**
- Which TimeFlow feature is failing? (Tasks, Icons, Storage, Carryover, Dark Mode, Rescheduling, etc.)
- Is bug isolated to one feature or cascading to others?
- Which component does user interact with? (Today.jsx, tab bar, modal, etc.)
- Where does bug manifest? (UI shows wrong, data lost, wrong behavior, crash?)

**Isolation Technique:**

```javascript
// Open browser console and run:

// 1. Check localStorage state
Object.entries(localStorage)
  .filter(([k,v]) => k.startsWith('timeflow-'))
  .forEach(([k,v]) => console.log(k, JSON.parse(v)))

// 2. Check React component tree
// Use React DevTools → Select component → Check Props tab

// 3. Check for console errors
// Open DevTools → Console tab
// Look for red error messages
```

### Step 1.3: Gather Evidence

**localStorage Inspection:**

```javascript
// Export all data
copy(JSON.stringify(Object.fromEntries(
  Object.entries(localStorage)
    .filter(([k,v]) => k.startsWith('timeflow-'))
    .map(([k,v]) => [k, JSON.parse(v)])
), null, 2))
```

**React DevTools Patterns:**

1. Select component in tree (e.g., LeafIcon, Today)
2. Check "Props" tab - what props are passed?
3. Check "$store" in console - `$r` shows component instance
4. Look for state/props mismatches

**Key Questions to Answer:**

- Does data exist in localStorage?
- Is data in correct format (valid JSON)?
- Do task IDs look correct? (Should be `Date.now() + Math.random()`)
- Is `originalTaskId` populated for carried tasks?
- Is `carriedMarked` flag set?
- Are colors correct in dark mode?

### Step 1.4: Document Exact Conditions

**Bug Report Template:**

```
BUG: [One sentence]

REPRODUCE:
1. [Action]
2. [Action]
3. [Expected]
4. [Actual]

EVIDENCE:
□ Browser: [Chrome/Firefox/Safari] v[X]
□ OS: [Windows/Mac/Linux]
□ Screen: [Desktop/Mobile] - [resolution]
□ Dark mode: [Yes/No]
□ localStorage state: [Attached/Described]
□ Console errors: [Yes/No] - [Error message if yes]

WHEN DISCOVERED:
- First noticed: [Date/Time]
- Persists: [Always/Sometimes] - [describe when]
- Affects: [Single user action/Multiple users/Everyone]

AFFECTED TASK PROPERTIES:
- ID: [task.id]
- Name: [task.name]
- Created: [2026-03-18]
- Status: [completed/in-progress/overdue]
- Carried: [Yes/No]
```

### Phase 1 Checklist

```
□ Bug reproduced consistently
□ Exact reproduction steps documented
□ Tested in light and dark mode
□ Tested on mobile and desktop
□ Tested after page refresh
□ localStorage state exported
□ React DevTools inspection done
□ Console errors reviewed
□ Affected components identified
□ Evidence gathered and documented
✓ Ready for Phase 2
```

---

## PHASE 2: PATTERN ANALYSIS

### Goal: Identify Systemic Patterns & Known Issues

### Step 2.1: Check TimeFlow Common Bug Patterns

```
PATTERN 1: Name-Based Task Matching
❌ SYMPTOM: Wrong task affected, or multiple tasks match
🔍 SEARCH: Look for: tasks.find(t => t.name ===)
✅ FIX: Use ID instead: tasks.find(t => t.id ===)

PATTERN 2: Debounced Deletion Saves
❌ SYMPTOM: Deleted task reappears after reload
🔍 SEARCH: Look for: setTimeout(() => saveTasks
✅ FIX: Save immediately: saveTasks(updated)

PATTERN 3: Missing Carryover Flags
❌ SYMPTOM: Task carries multiple times
🔍 SEARCH: Look for: carriedMarked not set to true
✅ FIX: Mark original: originalTask.carriedMarked = true

PATTERN 4: Icon Hardcoded Colors
❌ SYMPTOM: Icons wrong color in dark mode
🔍 SEARCH: Look for: fill="#999" (hardcoded)
✅ FIX: Use context: fill ?? (isDark ? '#888' : '#999')

PATTERN 5: Missing Dark Mode Context
❌ SYMPTOM: Some icons don't respond to dark mode
🔍 SEARCH: Look for: useIconContext() not called
✅ FIX: Call context: const context = useIconContext()
```

### Step 2.2: Search Git History

```bash
# Find related commits
git log --all --oneline --grep="icon\|dark\|carryover\|storage" | head -20

# Show changes in specific commit
git show <commit-hash>

# Find when bug was introduced (blame)
git blame <file-path> | grep <line-number>

# Check who modified file recently
git log --oneline -p <file-path> | head -50
```

### Step 2.3: Look for Similar Issues

**Codebase Search Pattern:**

1. Search for similar behavior in other components
2. Check if pattern is duplicated in multiple places
3. Verify if all instances have same bug or just this one
4. Note inconsistencies (why does component A work but B doesn't?)

**Example: Icon Color Investigation**

```
Search: #999 (light mode color)
Results: Found in 45 places
Analysis:
  - 40 places: Using context (correct)
  - 5 places: Hardcoded (PROBLEM)
  - 3 places: CSS overriding SVG (PROBLEM)

Pattern: CSS rules override SVG stroke colors
Location: swiftui.css, App.css, mobile.css
```

### Step 2.4: Review Error Messages Carefully

**Error Message Parsing:**

```javascript
// Error: Cannot read properties of undefined (reading 'id')
// Line: storage.js:142

// Analysis:
// - Variable is undefined (not null, not empty)
// - Trying to access 'id' property
// - Means: task object doesn't exist
// - Why: Task wasn't loaded, wasn't created, or was deleted

// Check:
// 1. Is task.id being generated correctly?
// 2. Is task being loaded from localStorage?
// 3. Was task deleted before accessing?
// 4. Is carryover logic creating task correctly?
```

### Phase 2 Checklist

```
□ Checked for name-based matching issues
□ Searched for debounced save operations
□ Verified carryover flags set correctly
□ Found hardcoded colors in icons
□ Confirmed dark mode context usage
□ Reviewed git history for related changes
□ Searched for similar patterns in codebase
□ Parsed error messages for clues
□ Identified common pattern match, if any
✓ Ready for Phase 3
```

---

## PHASE 3: HYPOTHESIS TESTING

### Goal: Test Root Cause Theories Before Fixing

### Step 3.1: Form Specific Hypothesis

**Pattern:**

```
HYPOTHESIS: [Specific claim about root cause]

EVIDENCE SUPPORTING: [What points to this cause]

EVIDENCE AGAINST: [What contradicts this]

PREDICTION: If this is correct, [what would we observe]

TEST METHOD: I will [specific action] and expect [result]
```

**Example Hypotheses:**

```
HYPOTHESIS 1: Task deletion uses name matching instead of ID
PREDICTION: If I have two tasks with same name, deleting one deletes both
TEST: Create two tasks "Code review", delete one, check if second still exists

HYPOTHESIS 2: Carryover doesn't set carriedMarked flag
PREDICTION: If I don't refresh, task carries once. After refresh, carries again.
TEST: Create task, don't complete, wait for tomorrow, check manifest

HYPOTHESIS 3: Icon CSS rule overrides SVG fill="none"
PREDICTION: If I inspect element, I'll see fill overridden by CSS
TEST: DevTools → Select icon → Inspect computed styles → find CSS rule
```

### Step 3.2: Design Minimal Tests

**Test 1: localStorage Direct Inspection**

```javascript
// Open console and run:
const tasks = JSON.parse(localStorage.getItem('timeflow-tasks-2026-03-19'));
console.log('All tasks:', tasks);
console.log('Task 1 ID:', tasks[0]?.id);
console.log('Task 1 originalTaskId:', tasks[0]?.originalTaskId);
console.log('Task 1 carriedMarked:', tasks[0]?.carriedMarked);

// Look for patterns:
// - Multiple tasks with id: 123? (duplicate ID bug)
// - originalTaskId missing? (carryover not tracking properly)
// - carriedMarked = false? (re-carry risk)
```

**Test 2: React DevTools Inspection**

```
1. Open React DevTools
2. Select component (e.g., LeafIcon)
3. Check Props:
   - fill=[value]
   - isDark=[value]
   - size=[value]
4. Check computed styles
5. Look for CSS overrides
```

**Test 3: Console Logging Strategy**

```javascript
// Add strategic logging to narrow down issue:

// Before operation
console.log('BEFORE:', {
  taskCount: tasks.length,
  firstTaskId: tasks[0]?.id,
  storedIds: tasks.map(t => t.id)
});

// Operation (whatever causes bug)
// ...

// After operation
console.log('AFTER:', {
  taskCount: tasks.length,
  firstTaskId: tasks[0]?.id,
  storedIds: tasks.map(t => t.id),
  missing: [compare before/after]
});
```

### Step 3.3: Track Testing Results

**Hypothesis Test Log:**

```
HYPOTHESIS 1: Name-based matching
[ ] Prediction: Two tasks with same name, deleting one deletes both
[✓] Test Result: YES - Confirmed! Both tasks deleted
__ACTION: Root cause found! Use ID-based matching instead

HYPOTHESIS 2: Debounced save race condition
[ ] Prediction: Deleted task reappears if page closed before timeout
[✗] Test Result: NO - Task stays deleted throughout test
__ACTION: Not the issue, continue investigation

HYPOTHESIS 3: Missing carriedMarked flag
[ ] Prediction: Refresh shows task carried twice
[✓] Test Result: YES - Task appears in manifest twice!
__ACTION: Root cause found! Set carriedMarked flag properly
```

### Step 3.4: Check Multiple Hypotheses

**REQUIRED:** Test at least 3 hypotheses before moving to implementation

**Decision Tree Example:**

```
START: Task duplicates after carryover

HYPOTHESIS 1: Name-based matching
→ Test: Two tasks, same name
→ Result: YES - Duplicate deletion
→ ROOT CAUSE FOUND ✓

HYPOTHESIS 2: Missing dedup check
→ Test: Check deduplication logic
→ Result: YES - Using name, not ID
→ SECONDARY ISSUE FOUND ✓

HYPOTHESIS 3: Debounced save
→ Test: Check for setTimeout in delete
→ Result: NO - Save is immediate
→ Not involved ✗

CONCLUSION: Root cause = name-based matching
SECONDARY: Dedup also uses names (must fix both)
```

### Phase 3 Checklist

```
□ Hypothesis 1 tested: [Result: ✓/✗]
□ Hypothesis 2 tested: [Result: ✓/✗]
□ Hypothesis 3 tested: [Result: ✓/✗]
□ Root cause identified and documented
□ Secondary issues identified (if any)
□ Exact code location pinpointed
□ Test log completed
□ Root cause explanation written
✓ Ready for Phase 4: Implementation
```

---

## PHASE 4: IMPLEMENTATION

### Goal: Minimal Fix with Comprehensive Verification

### Step 4.1: Create Minimal Fix

**Rules:**
- ✅ Fix ONLY the root cause
- ✅ Don't refactor surrounding code
- ✅ Don't add extra features
- ❌ No scope creep
- ❌ No "while we're here" changes

**Example Minimal Fix:**

```javascript
// BEFORE (Bug: name-based matching)
const deleteTask = (taskToDelete) => {
  const updated = tasks.filter(t => t.name !== taskToDelete.name);
  // ❌ Problem: Matches by name, affects multiple tasks with same name

  debounce(() => saveTasks(updated), 500);
  // ❌ Problem: Debounce can lose data on page close
};

// AFTER (Minimal fix)
const deleteTask = (taskToDelete) => {
  const updated = tasks.filter(t => t.id !== taskToDelete.originalTaskId);
  // ✓ Uses ID matching (correct)

  saveTasks(updated);
  // ✓ Immediate save (no data loss)
};

// ❌ NOT THIS (Over-fixing):
const deleteTask = (taskToDelete) => {
  // Added: logging, analytics, undo mechanism, validation
  // This is scope creep!
};
```

### Step 4.2: Test Thoroughly

**Regression Test Checklist:**

```
FUNCTIONALITY TESTS:
□ Bug is fixed (reproduce bug scenario, verify fixed)
□ Bug doesn't reappear after refresh
□ Related features still work
□ Edge cases from Phase 1 work correctly

DATA INTEGRITY TESTS (critical for carryover):
□ Carryover doesn't duplicate tasks
□ Deleted tasks don't reappear next day
□ Only correct task deleted (ID-based, not name)
□ Task IDs remain consistent

DARK MODE TESTS (if icon related):
□ Icon renders correctly in light mode
□ Icon renders correctly in dark mode
□ Toggle dark mode - icon updates correctly
□ No color "stuck" at light mode

STORAGE TESTS:
□ localStorage data remains valid
□ No JSON parse errors
□ Manifest matches actual dates
□ Task persistence works after reload

PERFORMANCE TESTS:
□ No console errors
□ No console warnings
□ No memory leaks (check DevTools Memory tab)
□ Smooth animations (no jank)

MOBILE TESTS:
□ Works on 320px screen
□ Touch targets adequate (44px+)
□ No horizontal scroll
```

### Step 4.3: Verify No Regressions

**Complete Workflow Tests:**

1. **Task Creation → Carryover → Deletion:**
   - [ ] Create task for today
   - [ ] Don't complete, wait for tomorrow
   - [ ] Task appears tomorrow (carried)
   - [ ] Create same task again (two instances)
   - [ ] Delete one instance
   - [ ] Verify only one deleted (by ID, not name)
   - [ ] Refresh page
   - [ ] Verify carried task still exists, deleted task gone

2. **Dark Mode Toggle:**
   - [ ] Light mode: screenshot icons
   - [ ] Dark mode: screenshot icons
   - [ ] Verify icons updated color correctly

3. **localStorage Integrity:**
   - [ ] Export localStorage before fix
   - [ ] Export localStorage after fix
   - [ ] Compare: same data format
   - [ ] No corrupted JSON
   - [ ] No task duplicates

### Step 4.4: Document Root Cause & Learning

**Required Documentation:**

```
ROOT CAUSE EXPLANATION:
[Why this bug happened in plain English]

PATTERN IDENTIFIED:
[What pattern should be avoided in future]

HOW FIX PREVENTS RECURRENCE:
[Specific mechanism that makes bug impossible to reoccur]

LESSON FOR TEAM:
[What lesson should other devs learn from this]

UPDATE TO CLAUDE.md:
[If pattern should be documented, add to CLAUDE.md "Common Pitfalls"]
```

**Example Documentation:**

```
ROOT CAUSE: Task matching used name instead of ID
CONSEQUENCE: Tasks with same name affected together
PATTERN: Name-based comparison breaks when user edits task name

FIX: Changed tasks.filter(t => t.name === name)
     to: tasks.filter(t => t.id === task.originalTaskId)

PREVENTION: ID-based matching never matches wrong task
            even if names are identical or name changes

LESSON: Always use IDs for task matching, never names
CLAUDE.md UPDATE: Already documented in "Pattern 1: ID-Based Task Matching"
```

### Phase 4 Checklist

```
□ Fix is minimal (only root cause addressed)
□ All regression tests pass
□ No new console errors
□ Data integrity verified
□ Carryover still works correctly
□ Dark mode still works correctly
□ Mobile responsiveness maintained
□ localStorage data valid
□ Performance acceptable
□ Root cause documented
□ Lesson learned captured
□ Ready to commit
```

---

## Emergency Escalation: After 3 Failed Fixes

**If implementation attempts fail 3 times:**

1. **PAUSE:** Do not attempt 4th fix
2. **ESCALATE:** Review architecture, not just code
3. **QUESTIONS:**
   - Is bug symptom of larger design issue?
   - Does bug indicate we need refactoring first?
   - Should we involve team discussion?
4. **DECISION:** Proceed with minor refactoring or major redesign

---

## TimeFlow-Specific Common Issues

### Issue: Task Carryover Duplication

```
SYMPTOMS: Tasks appear twice, or reappear after deletion

PHASE 1 Evidence to Gather:
- localStorage state for both dates
- Count of tasks with same ID
- originalTaskId tracking

PHASE 2 Patterns to Check:
- Name-based deduplication
- Missing carriedMarked flag
- Missing ID tracking

PHASE 3 Hypotheses to Test:
- Does task have originalTaskId? (if not: root cause)
- Is source task marked carriedMarked=true? (if not: root cause)
- Is dedup key using ID or name? (if name: root cause)

PHASE 4 Fix:
- Add originalTaskId tracking
- Set carriedMarked = true on source
- Use ${date}-${originalTaskId} for dedup key
```

### Issue: Dark Mode Icons Wrong Color

```
SYMPTOMS: Icons appear black, not grey; don't update on theme toggle

PHASE 1 Evidence:
- Check icon SVG stroke color (should be #999 or #888)
- Check CSS computed styles
- Check React DevTools props

PHASE 2 Patterns:
- Icon hardcoded color
- Missing useIconContext() call
- CSS rule overriding SVG

PHASE 3 Hypotheses:
- Is useIconContext called? (if not: root cause)
- Is stroke hardcoded "#999"? (if yes: root cause)
- Does CSS have "fill" or "stroke" rule? (if overriding: root cause)

PHASE 4 Fix:
- Import useIconContext
- Use: fill ?? (isDark ? '#888' : '#999')
- Add CSS: svg { fill: none !important; }
```

---

## Commands Reference

```bash
# Inspect localStorage
# Browser console:
Object.entries(localStorage).filter(([k]) => k.startsWith('timeflow-'))

# Export all data
copy(JSON.stringify(Object.fromEntries(...)))

# Git history search
git log --all --grep="pattern" -- file.js

# Run with debug output
DEBUG=* npm start

# Clear cache
localStorage.clear()
```

---

## Debug Phase Summary

| Phase | Duration | Action | Blocker |
|-------|----------|--------|---------|
| **1: Investigate** | 10-15 min | Gather evidence | Must complete before phase 2 |
| **2: Analyze** | 10-15 min | Find patterns | Must complete before phase 3 |
| **3: Hypothesize** | 15-20 min | Test theories | Must complete before phase 4 |
| **4: Implement** | 10-20 min | Fix bug | Can't skip to this phase |

**TOTAL TIME:** 45-70 minutes → Robust, confident fix with zero surprises
