---
name: timeflow-ralph-loop
description: Ralph Loop enables iterative, self-referential development where Claude works on TimeFlow tasks repeatedly until completion. Perfect for complex bugs, feature implementation with test feedback, and iterative refinement with multi-phase improvements.
user-invocable: true
disable-model-invocation: false
argument-hint: "task with explicit success criteria and max iterations"
---

# Ralph Loop: Iterative Development for TimeFlow

> **Skill Type:** Iterative Development Methodology
> **Purpose:** Enable autonomous, self-referential development loops where Claude works on TimeFlow tasks repeatedly until completion
> **Best For:** Complex bug fixes, feature implementation with test feedback, iterative refinement, multi-phase improvements
> **Integration:** Works with `/timeflow-tdd`, `/timeflow-debug`, `/timeflow-brainstorm`

---

## Table of Contents

1. Ralph Loop Mechanics
2. TimeFlow-Specific Ralph Loop Patterns
3. 7-Phase Skill Workflow
4. Completion Promise Pattern
5. Integration with TimeFlow Skills
6. Using Subagents in Ralph Loop
7. Best Practices
8. Code Examples & Scenarios
9. Advanced Patterns
10. TimeFlow Iterative Loops Checklist

---

## Ralph Loop Mechanics

### What is Ralph Loop?

Ralph Loop is an iterative AI technique named after the continuous learning loops of Ralph Wiggum. Claude works on tasks repeatedly, seeing prior work from previous iterations until the task reaches completion. The technique preserves all file modifications and git history between iterations, creating powerful feedback loops for autonomous problem-solving.

**The Core Loop:**

```
ITERATION 1 → [Execute Task] → [Test/Evaluate] → [Output Results]
                                        ↓
ITERATION 2 → [Read Prior Work] → [Identify Issues] → [Refine] → [Output Results]
                                        ↓
ITERATION N → [Continued Refinement] → [Completion Promise] → SUCCESS
```

### How Session Continuity Works

1. **Initial Prompt** - You define the task with explicit completion criteria
2. **Iteration 1** - Claude performs work, test/evaluate, and outputs findings
3. **Stop Hook** - Session would normally exit, but Ralph Loop re-feeds the prompt
4. **Iteration 2+** - Claude sees ALL prior work (file modifications, git changes, test results) and continues iterating
5. **Completion Promise** - Claude outputs the completion marker when task is done
6. **Exit** - Loop terminates, you have the final improved solution

### Why Ralph Loop Works for TimeFlow

TimeFlow's complexity benefits from iterative loops:

- **Task Carryover Logic** - Complex state management often needs multiple rounds of testing
- **AI Rescheduling Engine** - Edge cases discovered in testing require iterative fixes
- **Feature Implementation** - Multi-component features benefit from test-feedback loops
- **Icon/UI Refinement** - Visual design often improves through iteration and testing
- **Dark Mode Consistency** - Cross-component verification requires multiple passes
- **Performance Optimization** - Measurement → fix → measure cycle repeats

---

## TimeFlow-Specific Ralph Loop Patterns

### When to Use Ralph Loop

✅ **IDEAL for Ralph Loop:**
- Fixing a bug with multiple root causes (investigate → fix → test → iterate)
- Implementing a feature affecting 3+ components (implement → test → refactor → test)
- Refactoring large files like `Today.jsx` (refactor → test → measure → iterate)
- Performance optimization (profile → optimize → measure → iterate)
- Complex state management issues (implement → verify localStorage → test carryover → iterate)
- Icon system completeness (scan codebase → identify missing icons → create → verify)

❌ **NOT ideal for Ralph Loop:**
- Single-line typo fixes (too trivial for iteration)
- Simple CSS color changes (immediate verification possible)
- Trivial documentation updates (no feedback loop needed)

### Common TimeFlow Ralph Loop Scenarios

**Scenario 1: Task Carryover Bug Investigation**
```
Iteration 1: Reproduce issue → Trace through carryover logic → Identify suspected cause
Iteration 2: Read prior investigation → Confirm root cause via logging → Implement ID-based fix
Iteration 3: Run tests → Verify no duplication → Check edge case (deleted carried task)
Iteration 4: Adjust fix → Verify all edge cases → Confirm localStorage state
Final: All tests pass → DONE
```

**Scenario 2: Feature Implementation with Tests**
```
Iteration 1: Use /timeflow-tdd → RED phase → Write failing tests
Iteration 2: Implement minimal code → GREEN phase → Tests should pass
Iteration 3: Test on real app → Verify dark mode → Check mobile responsiveness
Iteration 4: REFACTOR phase → Clean up → Run full test suite
Final: All tests pass → Feature working → DONE
```

**Scenario 3: Complex Icon System Refactoring**
```
Iteration 1: Analyze icon usage across 30+ components → Identify inconsistencies
Iteration 2: Create refactoring plan → Update 5 icon files → Test rendering
Iteration 3: Verify dark mode support → Check all 20px sizes in tab bar
Iteration 4: Scan for missed icons → Update additional components → Final verification
Final: All icons consistent → System unified → DONE
```

---

## 7-Phase Skill Workflow

### PHASE 1: Task Definition & Metrics

**Your Role:**
Define the task with explicit success criteria so Claude can clearly recognize completion.

**Structure:**
```
TASK: [What needs to be done]

SUCCESS CRITERIA:
- [ ] Criterion 1: Specific, measurable outcome
- [ ] Criterion 2: Specific, measurable outcome
- [ ] Criterion 3: Specific, measurable outcome

COMPLETION MARKER:
"TIMEFLOW_RALPH_COMPLETE: [descriptive summary]"

MAX ITERATIONS: 8 (or your preferred limit)
```

**TimeFlow Example:**
```
TASK: Fix task carryover duplication bug

SUCCESS CRITERIA:
- [ ] Carried tasks no longer duplicate after page reload
- [ ] Deleted carried tasks don't reappear on next day
- [ ] New carried tasks appear correctly
- [ ] All 3 edge cases verified with localStorage inspection
- [ ] Tests pass for ID-based matching

COMPLETION MARKER:
"TIMEFLOW_RALPH_COMPLETE: Task carryover system fixed with ID-based matching"

MAX ITERATIONS: 6
```

### PHASE 2: Setup & Planning

**Claude's Role (Iteration 1):**
1. **Analyze Context** - Read CLAUDE.md, understand TimeFlow architecture
2. **Plan Approach** - Outline the iterative strategy
3. **Initial Assessment** - Scan relevant files, identify scope
4. **Documentation** - Create mental model of what will happen

**Key Questions Claude Should Answer:**
- What are the main components/files involved?
- What test cases should verify success?
- What edge cases might break in iteration 3-5?
- What could cause iteration failures that need fallback plans?

### PHASE 3: First Iteration - Initial Implementation

**Claude's Main Work:**
- Write code/fixes for initial approach
- Run basic tests
- Identify what worked and what didn't

**Output Checklist:**
- ✓ Changes made to X files
- ✓ Tests run: Y tests passed
- ✓ Issues identified: [List issues]
- ✓ Plan for next iteration: [Specific improvements]

### PHASE 4: Evaluation & Feedback Collection

**Criteria Assessment:**
For each success criterion:
- ✓ PASS - Meets criterion
- ⚠️ PARTIAL - Partially met, needs refinement
- ✗ FAIL - Not met, needs different approach

**Evidence Gathered:**
- Test results (pass/fail counts)
- File inspection (localStorage, component state)
- Visual verification (dark mode, sizing)
- Edge case testing

**Iteration Plan:**
Based on Phase 4 findings, design specific improvements for Phase 5+

### PHASE 5: Iterative Refinement - Loop Continuity

**Claude Reads Prior Iterations:**
- Review all prior output and changes
- Understand what worked/failed
- Build on successful approaches
- Avoid previous dead-ends

**Targeted Improvements:**
- Fix issues identified in Phase 4
- Test edge cases that failed
- Verify dark mode consistency
- Check performance implications

**Key Insight:** Each iteration should fix 1-3 specific issues, not restart from scratch

### PHASE 6: Convergence & Verification

**Convergence Tests:**
- All success criteria met ✓
- Edge cases handled ✓
- Dark mode verified ✓
- localStorage state correct ✓
- No console errors ✓

**Final Verification:**
```javascript
// TimeFlow verification checklist
✓ Task persistence works (localStorage)
✓ Carryover logic correct (ID-based matching)
✓ Deleted tasks don't reappear
✓ UI renders correctly (light + dark)
✓ Mobile responsive verified
✓ No console errors/warnings
✓ Git diff reviewed
```

### PHASE 7: Completion & Documentation

**Before Outputting Completion Promise:**
1. All tests pass
2. All success criteria met
3. Changes committed or staged
4. Summary prepared for handoff

**Final Commit (if applicable):**
```bash
git commit -m "Feature/fix summary matching success criteria

- Criterion 1 achieved: specific change
- Criterion 2 achieved: specific change
- Criterion 3 achieved: specific change

Verified through iterative refinement.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

**Output Completion Promise:**
```
TIMEFLOW_RALPH_COMPLETE: [Summary of what was accomplished]

## Summary
✓ All X success criteria met
✓ Y iterations to completion
✓ Z edge cases verified

### Changes Made
- File A: [summary of changes]
- File B: [summary of changes]

### Verification
- [Key verification 1]
- [Key verification 2]
- [Key verification 3]
```

---

## Completion Promise Pattern

### Defining Clear Completion

Completion promises should be **specific, measurable, and verifiable**:

**Poor Completion Promise:**
```
"TIMEFLOW_RALPH_COMPLETE: Fixed the bug"
```

**Excellent Completion Promise:**
```
"TIMEFLOW_RALPH_COMPLETE: Task carryover duplication fixed via ID-based matching

✓ Carried tasks no longer duplicate after page reload
✓ Deleted carried tasks don't reappear (304 localStorage inspection confirmed)
✓ New carried tasks appear correctly with unique IDs
✓ localStorage state consistent across all test cases
✓ Git diff shows minimal, focused changes to storage.js"
```

### Success Metrics

Use quantifiable, verifiable criteria:

| ✓ Good | ✗ Poor |
|--------|--------|
| "localStorage inspection shows 0 duplicate IDs" | "Task tracking works" |
| "8/8 test cases pass in jest suite" | "Bugs fixed" |
| "Dark mode verified in Chrome DevTools + real device" | "Dark mode looks good" |
| "Icon renders at exactly 20px in tab bar" | "Icons centered properly" |
| "Task carryover verified across 2026-03-18 → 2026-03-19 boundary" | "Carryover works" |

### Iteration Exit Conditions

**Stop and Output Completion When:**
1. All success criteria checked ✓
2. No known edge cases failing
3. Tests pass (or thorough manual verification done)
4. Code reviewed for obvious issues
5. Changes committed or staged for user

**Automatic Loop Exit at:**
- MAX_ITERATIONS reached (with best-effort summary)
- Completion promise outputted (success)
- Fundamental blocker encountered (describe blocker, request guidance)

---

## Integration with TimeFlow Skills

### Ralph Loop + /timeflow-tdd

**Combined Usage Pattern:**

```
TASK: Implement new feature with TDD discipline

Phase 1-2: Use /timeflow-tdd to RED phase
  → Write failing tests defining feature behavior
  → Use /timeflow-ralph-loop to iterate on implementation

Phase 3: Return to /timeflow-tdd GREEN phase
  → Make tests pass with minimal code
  → Iterate with Ralph Loop until tests pass

Phase 4: Use /timeflow-tdd REFACTOR phase
  → Clean up code without changing behavior
  → Use Ralph Loop to refine until satisfied

Phase 7: Output completion promise with test results
```

**Example Command:**
```
/timeflow-tdd "Implement new weekly goal tracking"

→ After RED phase, switch to:

/timeflow-ralph-loop "Implement weekly goal feature to pass the RED tests

SUCCESS CRITERIA:
- [ ] All 12 RED tests now pass (GREEN phase)
- [ ] Feature works in light and dark modes
- [ ] localStorage persists weekly goals correctly
- [ ] UI responsive on mobile

MAX ITERATIONS: 5"
```

### Ralph Loop + /timeflow-debug

**Combined Usage Pattern:**

```
TASK: Fix complex multi-symptom bug

Phase 1-2: Use /timeflow-debug to INVESTIGATE
  → Reproduce systematically
  → Gather evidence about root cause
  → Create debug log

Phase 3: Use /timeflow-ralph-loop for ITERATIVE HYPOTHESIS TESTING
  → Test each hypothesis
  → Refine based on results
  → Loop until root cause confirmed

Phase 4-5: Use /timeflow-debug to IMPLEMENT FIX
  → Create minimal fix
  → Verify no regressions
  → Run full verification
```

**Example Command:**
```
/timeflow-debug "Investigate task carryover duplication"

→ After investigation, switch to:

/timeflow-ralph-loop "Implement fix for carryover duplication

SUCCESS CRITERIA:
- [ ] Root cause from debug investigation fixed
- [ ] No duplicates appear in localStorage
- [ ] Edge case: deleted tasks verified
- [ ] Edge case: multiple carries verified

MAX ITERATIONS: 4"
```

### Ralph Loop + /timeflow-brainstorm

**Combined Usage Pattern:**

```
TASK: Develop new feature through design → implementation

Phase 1-2: Use /timeflow-brainstorm for IDEATION
  → Explore feature concept with Socratic questioning
  → Establish calm productivity alignment
  → Generate acceptance criteria

Phase 3-5: Use /timeflow-ralph-loop for ITERATIVE DEVELOPMENT
  → Implement based on brainstorm requirements
  → Test iteratively with acceptance criteria
  → Refine based on testing feedback

Phase 6-7: Verify against calm productivity principles
```

**Example Command:**
```
/timeflow-brainstorm "Implement task difficulty scoring system"

→ After requirements, switch to:

/timeflow-ralph-loop "Build task difficulty scoring feature

SUCCESS CRITERIA:
- [ ] Feature passes all acceptance criteria from brainstorm
- [ ] Calm productivity gates verified (no stress added)
- [ ] Storage integration works
- [ ] UI displays intuitively

MAX ITERATIONS: 5"
```

---

## Using Subagents in Ralph Loop

Ralph Loop becomes even more powerful when combined with specialized subagents. Subagents can parallelize work, handle complex research, and design approaches in the background while main iterations continue.

### When to Launch Subagents in Ralph Loop

**Launch Subagents At:**
- **PHASE 1-2 (Setup)** - Design approach in background while defining task
- **PHASE 3 (First Iteration)** - Explore codebase patterns while implementing
- **PHASE 4 (Evaluation)** - Plan next iteration refinements while evaluating current
- **PHASE 5+ (Refinement)** - Investigate specific issues in parallel subagents

### Subagent Types for Ralph Loop

| Subagent | Best Use in Ralph Loop | Example |
|----------|------------------------|---------|
| **Explore** | Understand codebase patterns, cross-component relationships | "How is task carryover used across 15+ components?" |
| **Plan** | Design iteration phases, testing strategy, architecture | "Design 5-iteration plan for implementing task priorities" |
| **General** | Research, code search, edge case discovery | "Find all localStorage operations related to tasks" |

### Common Ralph Loop + Subagent Patterns

**Pattern 1: Research-First Iteration**
```
TASK: Fix task carryover edge cases

Phase 1: Launch Explore subagent
  → "Understand how task carryover works across storage.js, Today.jsx, scheduler.js"
  → Subagent investigates in background

Phase 2-3: (Main loop) Implement initial fix based on current understanding
  → While implementing, Explore agent completes findings

Phase 4: (Main loop) Evaluate, using Explore findings to check edge cases
  → Discovered edge cases from Explore inform iteration 4 refinements

Phase 5+: Targeted improvements based on subagent discoveries
```

**Pattern 2: Parallel Strategy Planning**
```
TASK: Implement new reporting feature (6 iterations planned)

Phase 1: Launch Plan subagent
  → "Design 6-iteration implementation plan with TDD discipline"
  → "Design localStorage schema changes"
  → "Design UI component structure"
  → 3 parallel subagents working independently

Phase 2: (Main loop) Define task while subagents design

Phase 3+: Implement using comprehensive plans from all 3 subagents
```

**Pattern 3: Issue Investigation Subprocess**
```
TASK: Debug dark mode rendering issues

Phase 1-3: (Main loop) Initial dark mode fix attempts
  → Tests still failing - issue unclear

Phase 4: Launch Explore subagent
  → "Find all icon rendering code paths, especially dark mode branches"
  → "Identify where isDark context is checked vs. hardcoded"

Phase 5: (Main loop) Evaluate using Explore findings
  → Root cause identified from subagent research
  → Refine fix based on comprehensive understanding

Phase 6: Targeted fix using all discovered patterns
```

### Subagent Launch Strategy for Ralph Loop

**Before Starting Ralph Loop:**
```
"Launch Explore agent to map task carryover system while I define the task and success criteria"

Explore Agent Task:
- Find all task carryover references (storage.js, Today.jsx, scheduler.js, tests)
- Document ID-based matching pattern
- Identify edge case handling
- List all tests related to carryover

[Subagent runs in background]

Then: Define Ralph Loop task with Explore findings once complete
```

**During Ralph Loop Iterations:**
```
Iteration 1: Execute work and test
Iteration 2: Evaluate results + Launch parallel Explore for next iteration issues
Iteration 3: (Main work) Implement improvements using subagent findings from Iteration 2
Iteration 4: Continue refinement
```

### How to Reference Subagent Findings

**In Ralph Loop Iterations:**
```
## Iteration 3: Refine Based on Subagent Research

### Prior Findings
From Explore subagent (launched in Iteration 1):
- Task carryover uses originalTaskId for identification (not name-based)
- Edge case: Multiple carries create chain of references
- Issue: When deleting carried task, original date not updated

### Improvements in This Iteration
Implementing fix based on subagent research:
- Check originalTaskId chain when deleting
- Update BOTH current and original date tasks
- Verify no orphaned references remain
```

### Subagent Anti-Patterns in Ralph Loop

❌ **"Wait for subagent, then use findings"** → Launch subagents early, continue working
❌ **"Launch trivial subagents"** → Use direct tools for simple searches (Glob, Grep)
❌ **"Ignore subagent output"** → Actively integrate findings into iterations
❌ **"Sequential subagents"** → Launch parallel when possible
❌ **"No synthesis"** → Always review and document subagent findings

### Subagent Success Checklist

When launching subagents for Ralph Loop:
- [ ] Clear, specific task defined without ambiguity
- [ ] Subagent task independent from main Ralph Loop work
- [ ] Expected output clearly specified
- [ ] Will results be actionable in next iteration?
- [ ] Parallelizable with main iteration work?
- [ ] Documented where findings will be used

---

## Best Practices

### Prompt Structure for Effective Loops

**Essential Elements:**
```
TASK: [Clear, specific task description]

CURRENT SITUATION:
- [What's happening now]
- [Why it's problematic]

SUCCESS CRITERIA:
- [ ] Measurable outcome 1
- [ ] Measurable outcome 2
- [ ] Measurable outcome 3
- [ ] Edge case verification
- [ ] No regressions

MAX ITERATIONS: [6-8 recommended]

COMPLETION MARKER:
"TIMEFLOW_RALPH_COMPLETE: [Success summary]"
```

### Pro Tips

**Tip 1: Explicit Edge Cases**
Include edge cases in success criteria + make them discoverable:
```
✓ Edge case 1: Task deleted between carries
✓ Edge case 2: Task name edited multiple times
✓ Edge case 3: Date boundary transitions (03-18 → 03-19)
```

**Tip 2: Measurable Tests**
Every criterion should be verifiable without ambiguity:
```
✓ "localStorage shows exactly 2 unique task IDs" (measurable)
✗ "Carryover tracking looks correct" (ambiguous)
```

**Tip 3: Realistic Iteration Counts**
- Simple fix: 2-3 iterations
- Feature implementation: 4-6 iterations
- Complex refactoring: 6-8 iterations
- Very complex: cap at 10, then get user feedback

**Tip 4: Leverage Iterative Knowledge**
In each iteration, explicitly reference prior learnings:
```
Iteration 1: Discovered that X was the issue
Iteration 2: Confirmed X by investigating Y component
Iteration 3: Fixed X by updating Z file, avoiding dead-end approach tried in Iteration 1
```

### When NOT to Use Ralph Loop

Ralph Loop is inefficient for:
- **Trivial fixes** (typos, one-line changes) → Use direct approach
- **Clarification needed** (unclear requirements) → Ask questions first
- **Unknown unknowns** (no way to define success criteria) → Use brainstorm first
- **External dependencies** (waiting for API response) → Not suitable for loops

### Loop Depth Management

| Iterations | Interpretation | Action |
|-----------|-----------------|--------|
| 1-2 | Task too simple | Consider if Ralph Loop needed |
| 3-4 | Optimal | Expected for focused tasks |
| 5-6 | Normal | Complex features, multiple components |
| 7-8 | Intensive | Very complex refactoring, many edge cases |
| 9+ | Too deep | Stop and reassess, may need different approach |

### Common Failure Modes & Recovery

**Failure Mode 1: "Loop Not Making Progress"**
- *Symptom:* Iteration 3 still failing same test as Iteration 1
- *Cause:* Not actually reading prior work, or previous approach wasn't analyzed
- *Recovery:* Explicitly re-read Iterations 1-2, identify what failed, try different approach

**Failure Mode 2: "Scope Creep"**
- *Symptom:* Iteration 4 adding new features not in success criteria
- *Cause:* Losing focus on original task
- *Recovery:* Review success criteria, cut new features for future task

**Failure Mode 3: "Test Flakiness"**
- *Symptom:* Same test passes Iteration 2, fails Iteration 4
- *Cause:* Test depends on previous iteration's side effects
- *Recovery:* Reset state between iterations, verify test isolation

**Failure Mode 4: "localStorage Corruption"**
- *Symptom:* localStorage state invalid after Iteration 3
- *Cause:* Incomplete migration, orphaned keys
- *Recovery:* Inspect raw localStorage, fix migration logic, verify isolation

---

## Code Examples & Scenarios

### Example 1: Simple Bug Fix (3 Iterations)

**Task Definition:**
```
TASK: Fix icon sizing inconsistency in dashboard

CURRENT SITUATION:
- Dashboard icons render at different sizes (18px-24px)
- Should all be exactly 20px for consistency
- Causes visual misalignment

SUCCESS CRITERIA:
- [ ] All dashboard icons render at exactly 20px
- [ ] Icons verified in light mode
- [ ] Icons verified in dark mode
- [ ] No console Errors or warnings
- [ ] Mobile responsive verified

MAX ITERATIONS: 3

COMPLETION MARKER:
"TIMEFLOW_RALPH_COMPLETE: Dashboard icons unified to 20px size"
```

**Iteration 1 Output:**
```
## Iteration 1: Analysis & Initial Fix

### Analysis
Found 8 dashboard icon instances:
- DayReflection.jsx: 3 icons at 24px
- Insights.jsx: 2 icons at 18px
- StreakDisplay.jsx: 3 icons inconsistent

### Changes Made
- Updated DayReflection.jsx: 24px → 20px (3 icons)
- Updated Insights.jsx: 18px → 20px (2 icons)
- Updated StreakDisplay.jsx: Unified to 20px (3 icons)

### Tests
✓ Icons render in light mode
⚠️ Dark mode: Need to verify in actual app

### Next Iteration Plan
Verify dark mode rendering, check for any responsive issues
```

**Iteration 2 Output:**
```
## Iteration 2: Dark Mode Verification

### Prior Findings Review
- Updated 8 icon instances to 20px in Iteration 1
- Light mode verified ✓

### Dark Mode Testing
✓ Chrome DevTools dark mode: All 8 icons render at 20px
✓ Real device dark mode: Visual confirmation, sizing perfect
✓ No color issues (grey icons maintaining contrast)

### Responsive Testing
✓ Mobile (320px): Icons scale correctly
✓ Tablet (768px): Icons scale correctly
✓ Desktop (1920px): Icons maintain 20px size

### Console Check
- 0 errors
- 0 warnings
- All icons rendered without issues

### Readiness Assessment
All success criteria met! Ready for completion.
```

**Final Completion Promise:**
```
TIMEFLOW_RALPH_COMPLETE: Dashboard icons unified to 20px size

✓ All 8 dashboard icon instances updated to exactly 20px
✓ Light mode verified with all icons rendering correctly
✓ Dark mode verified on real device and DevTools
✓ Responsive scaling verified (320px-1920px)
✓ Zero console errors or warnings
✓ Visual alignment perfect, no offset issues

Changes: 3 files updated, 8 icon instances standardized
```

### Example 2: Feature Implementation (5 Iterations)

**Task Definition:**
```
TASK: Implement task priority indicator system

CURRENT SITUATION:
- Tasks don't show visual priority indication
- Users can't distinguish high-priority from low-priority tasks
- Need subtle, calm visual system aligned with nature theme

SUCCESS CRITERIA:
- [ ] High-priority tasks show visual indicator (border accent, not harsh)
- [ ] Medium-priority tasks neutral
- [ ] Low-priority tasks subtle de-emphasis
- [ ] Light mode colors contrast properly
- [ ] Dark mode colors contrast properly
- [ ] Mobile rendering verified
- [ ] Component integration with Today.jsx working
- [ ] localStorage correctly persists priority data

MAX ITERATIONS: 5

COMPLETION MARKER:
"TIMEFLOW_RALPH_COMPLETE: Task priority indicator system implemented"
```

**Iteration 1:**
```
Analyzed requirements → Created priority indicator component →
Tested basic rendering → Found styling issues with dark mode
```

**Iteration 2:**
```
Fixed dark mode styling → Verified color contrast →
Integrated with Today.jsx → Discovered localStorage issue
```

**Iteration 3:**
```
Fixed localStorage persistence → Verified task priority saves →
Tested carryover with prioritized tasks → Mobile test queue issue
```

**Iteration 4:**
```
Fixed mobile rendering (responsive priority labels) →
Verified light/dark mode on real device →
Edge case: deleted prioritized task behavior
```

**Iteration 5:**
```
Verified all edge cases → Final localStorage inspection →
All success criteria met → Ready for completion
```

### Example 3: Complex Refactoring (6 Iterations)

**Task:** Refactor icon system for 1.2px consistency across all 50+ icons
- Iteration 1: Analyze current icon implementations
- Iteration 2: Create refactoring plan, update first 15 icons
- Iteration 3: Continue refactoring, test rendering
- Iteration 4: Verify dark mode consistency
- Iteration 5: Mobile rendering verification
- Iteration 6: Final verification, all edge cases

---

## Advanced Patterns

### Pattern 1: Contextual Learning Across Iterations

**What It Means:**
Each iteration explicitly references and learns from prior iterations, not just starting fresh.

**Example:**
```
## Iteration 3: Informed by Iterations 1-2

In Iteration 1, we discovered that X approach led to storage issues.
In Iteration 2, we tried Y approach which fixed storage but broke dark mode.

Therefore, in Iteration 3, we implement Z approach which combines:
- Best of X (stability)
- Best of Y (dark mode support)
- New element: localStorage isolation layer
```

**Why This Works:**
- Avoids repeating dead-ends
- Builds progressively on successful patterns
- Faster convergence to solution

### Pattern 2: Exponential Backoff & Retry

**When Initial Approach Fails:**
```
Iteration 1: Try approach A
Iteration 2: If A fails → Try approach B (different angle)
Iteration 3: If B fails → Try A + B hybrid
Iteration 4: If hybrid fails → Deep investigation + approach C

Don't just keep beating same approach, intelligently vary.
```

### Pattern 3: Multi-Skill Loops

**Combining Multiple Skills in Single Loop:**
```
/timeflow-ralph-loop "Implement new feature

- Use /timeflow-brainstorm principles for requirements validation
- Use /timeflow-tdd discipline for test-first approach
- Use /timeflow-debug logic for any issues discovered
- Iterate until completion"
```

**In Practice:**
```
Iteration 1-2: Implement features using TDD RED/GREEN/REFACTOR
Iteration 3: Debug discovered issues using systematic approach
Iteration 4: Refine based on brainstorm calm productivity principles
Iteration 5: Final verification and completion
```

### Pattern 4: State Management Verification

**For localStorage/Persistence Issues:**
```
After each iteration where file modifications touch storage logic:

1. Inspect localStorage directly in DevTools
2. Log the exact state: console.log(JSON.stringify(localStorage))
3. Create before/after comparison
4. Verify no orphaned keys
5. Check for corruption patterns
```

**TimeFlow Specific:**
```javascript
// Verification code for loops touching task persistence

console.log("=== TaskFlow Storage Verification ===");
const allKeys = Object.keys(localStorage).filter(k => k.startsWith('timeflow-'));
allKeys.forEach(key => {
  try {
    const data = JSON.parse(localStorage[key]);
    console.log(`${key}: ${data.length || Object.keys(data).length} items`);
  } catch (e) {
    console.error(`CORRUPTION in ${key}: ${e.message}`);
  }
});
```

### Pattern 5: Performance Monitoring

**For Performance-Related Loops:**
```
Each iteration:
1. Measure operation time (console.time/timeEnd)
2. Check memory usage (DevTools Memory)
3. Count re-renders (React DevTools Profiler)
4. Compare against baseline from Iteration 1

Only declare success when optimization complete + no regressions.
```

---

## TimeFlow Iterative Loops Checklist

### Pre-Loop Checklist

Before starting a Ralph Loop:
- [ ] Task clearly defined with specific success criteria
- [ ] Success criteria are measurable and verifiable
- [ ] Max iterations is realistic (3-8 range usually best)
- [ ] Completion promise format decided
- [ ] Any dependent skills identified (/tdd, /debug, /brainstorm)
- [ ] Current working directory correct (TimeFlow root)
- [ ] Git status clean or intentionally modified

### Per-Iteration Checklist

Each iteration should include:
- [ ] Read ALL prior iteration output (not subset)
- [ ] Understand what worked/failed in previous iterations
- [ ] Make targeted improvements (1-3 specific issues)
- [ ] Test changes thoroughly
- [ ] Document findings clearly
- [ ] Reference prior work ("Iteration N showed that...")
- [ ] Output specific plan for next iteration

### Convergence Verification Checklist

Before outputting completion promise:
- [ ] All success criteria checked and marked ✓
- [ ] Edge cases verified
- [ ] Dark mode tested and working
- [ ] Mobile responsive verified
- [ ] localStorage state verified clean
- [ ] No console errors or warnings
- [ ] Code review of changes done
- [ ] Ready for user hand-off

### Post-Loop Checklist

After completion promise output:
- [ ] User can see all changes (git diff shows what changed)
- [ ] Changes are staged or committed
- [ ] Summary clearly explains what was accomplished
- [ ] Task fully ready for user action (commit, deploy, test)

---

## Real-World TimeFlow Ralph Loop Example

### Full Example: Fix Task Carryover Deletion Bug

**Initial Task Definition:**
```
TASK: Fix task carryover deletion bug

CURRENT SITUATION:
When a user carries a task from one day to the next, then deletes it on
the new day, the original carried task is getting marked as "carriedMarked"
but something is causing duplicates to appear or the task to reappear.

SUCCESS CRITERIA:
- [ ] Carried task deleted on new day stays deleted (doesn't reappear)
- [ ] Original task on original day marked carriedMarked: true
- [ ] New carried task has originalTaskId matching original
- [ ] localStorage inspection shows clean state (no orphaned duplicates)
- [ ] Edge case: Task carried multiple times → deleted → no reappear
- [ ] Edge case: Task edited after carry, then deleted → no reappear
- [ ] All storage.js operations save immediately (no debounce issues)

MAX ITERATIONS: 5

COMPLETION MARKER:
"TIMEFLOW_RALPH_COMPLETE: Task carryover deletion fixed permanently"
```

**Iteration 1: Investigation**
```
## Iteration 1: Analyze Carryover Logic

### Code Review
Examined storage.js and Today.jsx carryover functions:
- getUnfinishedTasksFromPreviousDays() checks carriedMarked flag
- createCarriedTask() sets originalTaskId and carriedMarked
- deleteTask() should mark as deleted locally

### Issue Discovered
In deleteTask(), when task is deleted:
- Immediate deletion from current date works
- Original task marked carriedMarked: true
- BUT when page reloads, both appear again somehow

### Hypothesis
The saveTasks() call might be debounced, or the deletion logic isn't
persisting correctly to localStorage.

### Test Results
- Created test task on 2026-03-18
- Carried to 2026-03-19
- Deleted on 2026-03-19
- Refreshed page → BOTH TASKS REAPPEAR ❌

### Next Iteration Plan
Trace through deleteTask() logic, check for debouncing or missed save calls.
```

**Iteration 2: Root Cause Analysis**
```
## Iteration 2: Trace Deletion Logic

### Reading Iteration 1 Findings
- Issue confirmed: deleted tasks reappearing
- Hypothesis: debounce or missed saves

### Detailed Code Trace
Found the issue in storage.js:

deleteTask function calls:
1. saveTasks() → localStorage.setItem()
2. BUT if saveTasksForDate() is debounced elsewhere → RACE CONDITION

### Exact Root Cause
In deleteTask():
- Removes from taskList
- Calls saveTasks()
- ✓ Current date tasks saved
- ✗ BUT previous day tasks NOT checked/updated

When page reloads:
- getUnfinishedTasksFromPreviousDays() STILL finds unfinished tasks
- Because original task still marked carriedMarked: false
- Creates DUPLICATE carry-over

### Solution Identified
Need to check: when deleting a carried task, update originalTaskId field
to mark relationship correctly in localStorage.

### Test Results
Manual trace shows the gap in logic. Ready to implement fix.
```

**Iteration 3: Implementation & Testing**
```
## Iteration 3: Implement and Test Fix

### Prior Learnings
Iteration 2 identified: need to update originalTaskId relationship when
deleting carried tasks.

### Changes Made
Updated deleteTask() in storage.js:
1. Check if task is a carried task (has originalTaskId)
2. If yes, load original task's date & mark with duplicate flag
3. Save both current date and original task's date
4. No debounce - immediate save calls

### Code Change Summary
Lines 245-280 in storage.js modified to implement two-date save pattern.

### Test Execution
✓ Carried task deleted on new day
✓ localStorage inspection: only 1 task (deleted one gone)
✓ Original task on original date: carriedMarked: true
✓ Page reload: NO duplicates ✓

### Edge Case Testing
✗ Edge case: Multiple carries of same task → Still need to test
✗ Edge case: Task edited then carried then deleted → Need to test

### Next Iteration Plan
Test remaining edge cases identified above.
```

**Iteration 4: Edge Case Verification**
```
## Iteration 4: Edge Case Testing & Refinement

### Prior Success Review
Iteration 3 fixed basic deletion issue. No duplicates in simple case ✓

### Edge Case 1: Multiple Carries
- 2026-03-17: Create Task A
- 2026-03-18: Carry Task A (has originalTaskId → 2026-03-17)
- 2026-03-19: Carry Task A again (needs chain reference?)
- 2026-03-19: Delete Task A
✓ PASSES - Deletion captures through chain correctly

### Edge Case 2: Edit Then Carry Then Delete
- 2026-03-17: Create "Code Review", duration 30
- 2026-03-18: Edit to "Code Review - Final", duration 45
- 2026-03-18: Carry to 2026-03-19
- 2026-03-19: Delete
✓ PASSES - Task deleted, original preserved with originalName intact

### localStorage Inspection
```json
{
  "timeflow-tasks-2026-03-17": [{"id": 123, "carriedMarked": true}],
  "timeflow-tasks-2026-03-18": [],
  "timeflow-tasks-2026-03-19": []
}
```
✓ Clean state, no duplicates, no orphaned entries

### Convergence Assessment
All edge cases now pass. All success criteria met ✓
```

**Iteration 5: Final Verification & Completion**
```
## Iteration 5: Final Verification

### Checklist Review

✓ Carried task deleted on new day stays deleted
✓ Original task marked carriedMarked: true
✓ New carried tasks have correct originalTaskId
✓ localStorage clean (no orphaned records)
✓ Edge case 1: Multiple carries work correctly
✓ Edge case 2: Edit then carry then delete works
✓ All storage operations save immediately
✓ No console errors or warnings
✓ Code review of storage.js changes complete

### Code Quality Check
- Changes minimal and focused (only deleteTask logic modified)
- Comments added explaining two-date save pattern
- No new dependencies introduced
- Follows existing code patterns in storage.js

### Ready for Handoff
All success criteria met in this iteration.
Implementation is solid, edge cases verified, code quality good.
```

**Final Completion Promise:**
```
TIMEFLOW_RALPH_COMPLETE: Task carryover deletion fixed permanently

✓ Carried tasks deleted on new day no longer reappear
✓ Original tasks correctly marked with carriedMarked: true flag
✓ New carried tasks maintain correct originalTaskId references
✓ localStorage inspection confirms clean state (no duplicates/orphans)
✓ Multiple carry-over chains tested and working
✓ Edit-then-carry-then-delete edge case verified
✓ All operations save immediately (debounce verified resolved)

Changes Made:
- storage.js: Enhanced deleteTask() function (lines 245-280)
  - Implements two-date save pattern for carried task deletion
  - Properly updates originalTaskId relationships
  - Ensures immediate persistence without debounce

Verification Complete:
- 6 test cases created and passed
- localStorage inspection shows clean state
- Code review completed
- Zero console errors or warnings
- Iterations 1-5 progressively identified and fixed root cause
```

---

## Quick Reference: Ralph Loop vs. Other Skills

| Skill | When to Use | Example |
|-------|-----------|---------|
| `/timeflow-tdd` | New feature with uncertain requirements | "Implement weekly planning view" |
| `/timeflow-debug` | Single investigation needed | "Find why dark mode text is unreadable" |
| `/timeflow-brainstorm` | Exploring feature concepts | "How should notifications work?" |
| `/timeflow-ralph-loop` | **Iterative work with test feedback** | **"Fix task carryover with multiple test rounds"** |
| **Combined** | Complex feature requiring multiple skills | **"Design feature (brainstorm) → TDD loop → test feedback → iterate"** |

---

## Completion

Ralph Loop provides the framework for autonomous, iterative problem-solving in TimeFlow. By defining clear success criteria and leveraging the feedback loop between iterations, Claude can progressively refine solutions until they meet all requirements.

**Key Takeaways:**
- Use Ralph Loop for iterative tasks requiring test feedback
- Define success criteria precisely for clear convergence
- Reference prior iteration findings to avoid dead-ends
- Integrate with /timeflow-tdd, /timeflow-debug for multi-skill workflows
- Track convergence with checklist verification before completion promise

**Start a Ralph Loop:**
```
/timeflow-ralph-loop "[Your task]

SUCCESS CRITERIA:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

MAX ITERATIONS: [number]

COMPLETION MARKER:
\"TIMEFLOW_RALPH_COMPLETE: [Summary]\""
```
