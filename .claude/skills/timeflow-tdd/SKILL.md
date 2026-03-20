---
name: timeflow-tdd
description: Test-Driven Development (TDD) workflow for TimeFlow. Implements red-green-refactor discipline with TimeFlow-specific test patterns, localStorage mocking, carryover logic verification, and icon rendering tests. Enforce test-first approach for calm, confident development.
user-invocable: true
disable-model-invocation: false
argument-hint: "feature to develop or component to test"
---

# TimeFlow Test-Driven Development (TDD) Skill

## Overview

This skill guides disciplined Test-Driven Development (TDD) specifically tailored to TimeFlow's architecture, data patterns, and critical systems. TDD aligns with TimeFlow's philosophy: write tests first for calm, confident development with zero surprises.

**Core Philosophy:** Red → Green → Refactor. Tests are the specification. Code is the implementation.

---

## RED PHASE: Write Failing Tests First

### RED Rule #1: Test Before Implementation
- ✅ Create test file with `.test.js` suffix
- ✅ Write test that FAILS with meaningful error
- ✅ Zero implementation code exists yet
- ❌ NEVER skip red phase by writing code first

### RED Rule #2: Test Naming Convention

**Pattern:** `SHOULD [action] WHEN [condition] THEN [result]`

```javascript
// ✅ GOOD: Clear expected behavior
describe("Task Carryover (storage.js)", () => {
  describe("Preventing duplicates", () => {
    it("SHOULD NOT re-carry task WHEN carriedMarked flag is true", () => {
      // Test that fails without implementation
    });
  });
});

// ❌ BAD: Vague, unclear outcome
it("carryover works", () => {});
it("doesn't duplicate", () => {});
```

### RED Rule #3: Single Responsibility Per Test

- ✅ One assertion or clearly grouped assertions
- ✅ Test fails for ONE reason
- ✅ Test is isolated (no dependencies on other tests)
- ❌ Multiple behaviors in one test (confusing failure)

### RED Rule #4: Meaningful Failure Messages

**Test must FAIL with helpful message:**

```javascript
// ❌ POOR: Expected undefined to equal Array
it("loads tasks", () => {
  expect(loadTasksForDate("2026-03-19")).toEqual([]);
});

// ✅ GOOD: Exact expectation
it("SHOULD return empty array WHEN date has no tasks", () => {
  const tasks = loadTasksForDate("2026-03-19");
  expect(tasks).toEqual([]);
  // Fails with: "Expected undefined to have length property"
  // Dev immediately sees: "loadTasksForDate returned undefined, should return []"
});
```

### TimeFlow-Specific Test Patterns

#### Pattern 1: Task Persistence Tests

```javascript
describe("Task Persistence (storage.js)", () => {
  let store = {};

  beforeEach(() => {
    // Mock localStorage for isolation
    global.localStorage = {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { store = {}; }),
    };
  });

  // RED: Test fails without loadTasksForDate implementation
  it("SHOULD return empty array WHEN no tasks for date", () => {
    const tasks = loadTasksForDate("2026-03-19");
    expect(tasks).toEqual([]);
  });

  // RED: Test fails without proper JSON parsing
  it("SHOULD parse and return tasks WHEN data exists", () => {
    const mockTasks = [
      { id: 1, name: "Code review", duration: 30 }
    ];
    localStorage.setItem("timeflow-tasks-2026-03-19", JSON.stringify(mockTasks));

    const tasks = loadTasksForDate("2026-03-19");
    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe("Code review");
  });
});
```

#### Pattern 2: Carryover Logic Tests (CRITICAL)

```javascript
describe("Task Carryover (ID-Based Matching)", () => {
  // RED: Test fails without originalTaskId tracking
  it("SHOULD prevent duplicate carryover WHEN carriedMarked=true", () => {
    const originalTask = {
      id: 123,
      name: "Code review",
      completed: false,
      carriedMarked: true  // Already carried once
    };

    localStorage.setItem("timeflow-tasks-2026-03-18", JSON.stringify([originalTask]));

    const unfinished = getUnfinishedTasksFromPreviousDays();
    // Should NOT include original task
    expect(unfinished).toHaveLength(0);
  });

  // RED: Test fails without ID-based matching
  it("SHOULD use originalTaskId for deletion, NOT task name", () => {
    const tasks = [
      { id: 123, name: "Code review", completed: false },
      { id: 124, name: "Code review", completed: false }  // Same name!
    ];

    deleteTaskById(tasks, 123);

    // Should delete ONLY id=123, not all with that name
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(124);
  });

  // RED: Test fails without immediate save
  it("SHOULD save immediately after deletion, NO debounce", () => {
    global.localStorage.setItem = jest.fn();

    const tasks = [{ id: 1, name: "Task" }];
    deleteTask(tasks, 1);

    // setItem called immediately, not after timeout
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
```

#### Pattern 3: Icon Rendering Tests

```javascript
describe("Icon Rendering (LeafIcon)", () => {
  // RED: Test fails without dark mode support
  it("SHOULD use dark grey stroke #888 in dark mode", () => {
    const { container } = render(<LeafIcon isDark={true} />);
    const path = container.querySelector('path');
    expect(path.getAttribute('stroke')).toBe('#888');
  });

  // RED: Test fails without context detection
  it("SHOULD auto-detect dark mode from context", () => {
    const { container } = render(
      <IconProvider value={{ isDark: true }}>
        <LeafIcon />
      </IconProvider>
    );
    const path = container.querySelector('path');
    expect(path.getAttribute('stroke')).toBe('#888');
  });

  // RED: Test fails without correct sizing
  it("SHOULD render at 20px in tab bar", () => {
    const { container } = render(<LeafIcon size={20} />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('height')).toBe('20');
  });

  // RED: Test fails without outline-only design
  it("SHOULD have fill=none for outline-only design", () => {
    const { container } = render(<LeafIcon />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('fill')).toBe('none');
  });
});
```

### RED Phase Checklist

```
Before moving to GREEN phase:
□ Test file created with .test.js suffix
□ Test name uses SHOULD/WHEN/THEN format
□ Test runs and FAILS with meaningful error
□ Error message helps developer fix it
□ No implementation code exists yet
□ Test is isolated (no test interdependencies)
□ Single assertion or clearly grouped assertions
□ Test setup is minimal (mocks only necessity)
□ Failure message is specific, not generic
```

---

## GREEN PHASE: Minimal Implementation

### GREEN Rule #1: Write Simplest Code That Passes

```javascript
// RED: Test written, failing
it("SHOULD load tasks from localStorage", () => {
  localStorage.setItem("timeflow-tasks-2026-03-19", JSON.stringify([{id:1}]));
  expect(loadTasksForDate("2026-03-19")).toEqual([{id:1}]);
});

// GREEN: Minimal implementation (NOT over-engineered)
export const loadTasksForDate = (dateString) => {
  try {
    const raw = localStorage.getItem(`timeflow-tasks-${dateString}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// ❌ WRONG: Over-implementation
export const loadTasksForDate = (dateString) => {
  try {
    const raw = localStorage.getItem(`timeflow-tasks-${dateString}`);
    const tasks = raw ? JSON.parse(raw) : [];
    // Over-engineering:
    tasks.forEach(t => {
      t.createdAt = t.createdAt || new Date().toISOString();
      t.syncStatus = 'synced';
      if (new Date(t.deadline) < new Date()) t.isOverdue = true;
    });
    return tasks.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    console.error(e);
    return [];
  }
};
```

### GREEN Rule #2: Follow TimeFlow Patterns

**Task Data Structure (MUST match CLAUDE.md):**

```javascript
{
  id: Date.now() + Math.random(),           // Unique ID
  name: "Task name",
  duration: 30,                             // Minutes
  startTime: "14:30",                       // HH:MM (24h)
  deadline: "2026-03-19",                   // YYYY-MM-DD
  category: "coding",                       // Auto-detected
  completed: false,
  remaining: 30,
  carriedOver: false,
  originalTaskId: null,                     // For carryover
  carriedMarked: false,                     // Prevent re-carry
}
```

**Storage Key Format (MUST use this pattern):**

```javascript
const key = `timeflow-tasks-2026-03-19`;  // "timeflow-tasks-" + YYYY-MM-DD
```

**Icon Component Pattern (MUST use this structure):**

```javascript
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
      {/* SVG paths */}
    </svg>
  );
});
IconName.displayName = 'IconName';
export default IconName;
```

### GREEN Phase Checklist

```
Test now passes:
□ npm test: All tests pass
□ No new features beyond what test requires
□ No optimization attempts
□ Error handling only for stated test cases
□ Code matches TimeFlow patterns (from CLAUDE.md)
□ No hardcoded values without context
□ No TODO/FIXME comments for later work
□ Variable names follow TimeFlow conventions
□ No console.log statements left behind
```

---

## REFACTOR PHASE: Clean Code

### REFACTOR Rule #1: Tests Still Pass

- ✅ Run `npm test` after every refactor
- ✅ All tests STILL pass
- ❌ Never refactor without test green light

### REFACTOR Rule #2: No New Functionality

```javascript
// ❌ WRONG: Refactoring that adds features
// Before (simple):
function deleteTask(task) {
  tasks = tasks.filter(t => t.id !== task.id);
  saveTasks(tasks);
}

// After (added features):
function deleteTask(task) {
  // ❌ Added timestamp tracking
  task.deletedAt = new Date().toISOString();
  // ❌ Added recovery mechanism
  recoverableDeletes.push(task);
  tasks = tasks.filter(t => t.id !== task.id);
  saveTasks(tasks);
}

// ✅ RIGHT: Refactor only, no new features
function deleteTask(task) {
  const updated = tasks.filter(t => t.id !== task.id);
  saveImmediately(updated);  // Extracted for clarity
}
```

### REFACTOR Opportunities for TimeFlow

**Extract Helper Functions:**

```javascript
// Before: Long function
function carryOverTasks() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const prevDate = yesterday.toISOString().slice(0, 10);

  const prevTasks = JSON.parse(localStorage.getItem(`timeflow-tasks-${prevDate}`));
  const unfinished = prevTasks.filter(t => !t.completed && !t.carriedMarked);

  const existing = new Set();
  const tasks = JSON.parse(localStorage.getItem(`timeflow-tasks-${today}`));
  tasks.forEach(t => {
    if (t.carriedOver && t.originalTaskId) {
      existing.add(`${t.originalDate}-${t.originalTaskId}`);
    }
  });

  const toAdd = unfinished.filter(t => !existing.has(`${prevDate}-${t.id}`));
  return toAdd;
}

// After: Refactored with helpers
function carryOverTasks() {
  const prevDate = getYesterdayDate();
  const unfinished = getUnfinishedTasks(prevDate);
  const existing = getExistingCarriedIds(today);
  return filterNewCarries(unfinished, existing, prevDate);
}

const getYesterdayDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const filterNewCarries = (unfinished, existing, prevDate) =>
  unfinished.filter(t => !existing.has(`${prevDate}-${t.id}`));
```

**Extract Constants:**

```javascript
// Before: Magic numbers
const overallBreakTime = totalMinutes * 0.15;
const storageTTL = 1000 * 60 * 60 * 24;  // 24 hours

// After: Named constants
const RECOMMENDED_BREAK_RATIO = 0.15;  // TimeFlow's calm pacing
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24;  // Task data retention

const overallBreakTime = totalMinutes * RECOMMENDED_BREAK_RATIO;
```

**Simplify Conditionals:**

```javascript
// Before: Nested if statements
if (task.completed === true) {
  if (task.remaining > 0) {
    if (task.attempts > 3) {
      // Action
    }
  }
}

// After: Simplified
if (task.completed && task.remaining > 0 && task.attempts > 3) {
  // Action
}
```

### REFACTOR Phase Checklist

```
After refactoring:
□ npm test: All tests STILL pass (zero failures)
□ No new functionality added
□ Code more readable (shorter functions, clear intent)
□ Duplicated code removed (DRY principle)
□ Constants extracted for magic numbers
□ Helper functions created for repeated logic
□ Comments clarify "why", not "what"
□ Error handling simplified where possible
□ Variable names improved for clarity
□ No performance degradation
□ No console.log statements
□ Ready to commit
```

---

## TimeFlow Testing Setup

### Jest Configuration

```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### localStorage Mocking

```javascript
// jest.setup.js
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

---

## TDD Safety Guardrails

### Guardrail 1: Never Skip RED Phase

**BLOCKED:** Implementing code without failing test first

### Guardrail 2: Force Test Quality

**REQUIRED:** Each test has single, clear assertion

### Guardrail 3: Prevent Over-Implementation

**CHECK:** Green code has zero extra features

### Guardrail 4: Guarantee Test Coverage

**MINIMUM:** 70% line coverage, 70% branch coverage

---

## Complete TDD Workflow for $ARGUMENTS

### For Feature: $ARGUMENTS

**RED Phase (Now):**
1. Create `/src/[path]/$ARGUMENTS.test.js`
2. Write failing tests for each requirement
3. Verify tests FAIL with meaningful messages
4. Document what each test validates

**GREEN Phase (Next):**
1. Write minimal implementation to pass tests
2. Run `npm test` - all tests pass
3. Verify no over-engineering
4. Follow TimeFlow patterns

**REFACTOR Phase (After GREEN):**
1. Run `npm test` - ensure still passing
2. Extract helpers, simplify conditionals
3. Improve variable names
4. Add constants for magic values
5. Commit refactored code

**FINAL VERIFICATION:**
- [ ] Task carryover doesn't duplicate
- [ ] Deleted tasks don't reappear
- [ ] Icons render at correct sizes
- [ ] Dark mode works correctly
- [ ] localStorage data persists
- [ ] No console errors/warnings

---

## Quick Commands

```bash
# Run all tests
npm test

# Watch mode (rerun on changes)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Single test file
npm test src/utils/__tests__/storage.test.js

# Test matching pattern
npm test -- --testNamePattern="carryover"
```

---

## References

- Task data structure: See CLAUDE.md "Task Data Structure"
- Storage patterns: See CLAUDE.md "Pattern 2: Immediate Persistence"
- Icon patterns: See icon-guide skill
- Design system: See design-review skill
