---
name: timeflow-brainstorm
description: Socratic method-based brainstorming for TimeFlow features. Systematically explore raw ideas through 5 structured phases (Opening → Deep Questioning → Requirements → Design → Acceptance Criteria) to produce comprehensive requirements documents. Output feeds directly into /timeflow-tdd for test-driven implementation.
user-invocable: true
disable-model-invocation: false
argument-hint: "raw feature idea or problem to solve"
---

# TimeFlow Brainstorming Skill (Socratic Method)

## Overview

This skill transforms raw feature ideas into formally documented requirements through disciplined Socratic questioning. Every feature is explored systematically before ANY code is written.

**Core Philosophy:** Deep thinking before implementation. Requirements before code. Architecture before features.

---

## PHASE 1: OPENING & CONTEXT (5-10 minutes)

### Goal: Understand Idea in User's Own Words

### Step 1: Listen & Clarify

**Claude's Questions:**

1. **"Tell me about this idea in your own words. What problem does it solve?"**
   - Listen for: Core motivation, pain points, user frustration
   - Note: Hidden assumptions, vague language, unclear goals

2. **"Can you give me a specific example of when you'd use this?"**
   - Listen for: Concrete vs abstract thinking
   - Note: Edge cases implied in example, actual usage pattern

3. **"Who benefits from this and how?"**
   - Listen for: Target user, specific value, measurable benefit
   - Note: Assumptions about user behavior

4. **"What's the simplest version that would still be useful?"**
   - Listen for: MVP vs nice-to-have features
   - Note: Scope creep indicators

### Step 2: Summarize Understanding

**Claude Output:**

```
YOUR IDEA (My Understanding):
[Paraphrase idea clearly]

CORE PROBLEM:
[One sentence: What pain point this solves]

TARGET USERS:
[Who benefits]

INITIAL SCOPE:
[Simple version identified]

QUESTIONS FOR PHASE 2:
1. [Clarification needed]
2. [Ambiguity found]
3. [Assumption to verify]
```

### Step 3: Get Confirmation

"Before we dive deeper, does this capture your idea correctly? Anything I missed or misunderstood?"

---

## PHASE 2: DEEP SOCRATIC QUESTIONING (20-30 minutes)

### SECTION 2.A: CALM PRODUCTIVITY ALIGNMENT (CRITICAL)

**Why This First:** TimeFlow must serve its core philosophy or feature is rejected.

#### Question 1: Stress Reduction

**"How does this reduce stress or overwhelm for users?"**

✓ GOOD ANSWERS:
- "This helps users avoid overcommitting"
- "This makes rescheduling less overwhelming"
- "This gives users control and peace of mind"

❌ RED FLAG ANSWERS:
- "It enables more tasks" (increases stress)
- "It gamifies productivity" (competitive pressure)
- "It helps users do more faster" (undermines calm)

**Follow-up:** "Could this feature cause stress if not used perfectly?"

---

#### Question 2: Realistic vs Wishful Planning

**"Does this encourage realistic planning or enable wishful thinking?"**

✓ GOOD:
- "Makes users plan what they actually do"
- "Shows real constraints upfront"
- "Prevents overcommitment"

❌ RED FLAG:
- "Helps users pack more into their day"
- "Encourages ambitious planning"
- "Pushes users to do more"

---

#### Question 3: Psychological Safety

**"Could this feature cause guilt or shame if the user doesn't use it?"**

**BLOCKER ANSWER:** If answer is "yes" → Feature requires redesign or rejection

✓ GOOD:
- "No, it's optional helper"
- "Doesn't judge, just suggests"
- "User has full control"

❌ BLOCKER:
- "Maybe users feel pressure"
- "Could feel like failure if ignored"
- "Might create FOMO"

---

#### Question 4: Cognitive Load

**"How would this make planning easier, not harder?"**

✓ GOOD:
- "Reduces number of decisions"
- "Automates tedious task"
- "Clear, simple interface"

❌ RED FLAG:
- "Users learn a new system"
- "More data to collect"
- "Complex configuration"

---

**DECISION POINT:** All 4 questions must align with calm productivity, or feature needs major redesign.

```
CALM PRODUCTIVITY CHECK:
□ Reduces stress: [YES/NO]
□ Promotes realistic planning: [YES/NO]
□ No guilt/shame risk: [YES/NO]
□ Reduces complexity: [YES/NO]

If ANY is NO → PAUSE: Redesign needed before proceeding
```

---

### SECTION 2.B: USER VALUE & BEHAVIOR (10-15 min)

#### Question 1: Behavioral Change

**"What would users do DIFFERENTLY after this feature exists?"**

- If answer is "nothing changes" → Feature isn't valuable
- Look for concrete behavior change

---

#### Question 2: Frequency of Use

**"How often would users actually use this in a typical week?"**

```
USAGE FREQUENCY ASSESSMENT:
< 1x/month = Nice-to-have feature
1x/month - 1x/week = Non-essential feature
1x/week - 1x/day = Core feature
> Several times/day = Critical feature

Compare effort to frequency:
- 2-week effort for feature used 1x/month? → Question ROI
- 1-week effort for feature used 10x/day? → Worth it
```

---

#### Question 3: Friction Points

**"What would prevent a user from using this?"**

- Missing steps in flow?
- Too complex to understand?
- Requires too much setup?
- Takes too long?

---

#### Question 4: Serving Core Users

**"How would this help a user who typically fails to complete tasks?"**

- Core user = someone who struggles with planning/completion
- Feature shouldn't just help perfect planners
- Must serve all user types

---

### SECTION 2.C: ARCHITECTURE & INTEGRATION (10-15 min)

#### Question 1: Architectural Fit

**"How does this connect to existing TimeFlow concepts?"**

- Tasks, Timeline, Pool, Carryover, Insights?
- New concept or extension of existing?
- Cross-component dependencies?

---

#### Question 2: New Data

**"What new data would we need to track?"**

List every new data field, storage implications, complexity

---

#### Question 3: Component Changes

**"Which component(s) would change? Today.jsx? storage.js? smartReschedule.js?"**

```
COMPONENT IMPACT ANALYSIS:
Today.jsx: [State changes]
storage.js: [Schema changes]
scheduler.js: [Logic changes]
IconContext.jsx: [Dark mode changes]
swiftui.css: [Styling changes]
[Other components]: [Changes]
```

---

#### Question 4: Breakage Risk

**"What could break if we add this feature?"**

- Carryover logic affected?
- Task deletion changed?
- Icon rendering changed?
- Dark mode compatibility?
- Mobile responsiveness?

---

### SECTION 2.D: RISK & EDGE CASE ANALYSIS (MANDATORY - 3+ RISKS)

**REQUIREMENT:** Identify minimum 3 risks before proceeding

#### Question 1: User Interaction Failures

**"What could go wrong when users interact with this?"**

- Confusing error states?
- Unclear feedback messages?
- Impossible combinations?

---

#### Question 2: Carryover Interaction

**"How would this interact with carryover logic?"** (CRITICAL)

- Does feature affect task persistence?
- ID-based matching still works?
- Deduplication still prevents duplicates?

---

#### Question 3: Edge Cases

**"What happens if [edge case]?"**

Systematically explore:
- What if task is already completed?
- What if task is already carried twice?
- What if user changes task name?
- What if network drops mid-operation?
- What if user's localStorage is corrupted?

---

#### Question 4: Performance & Device Compatibility

**"How would this affect users on slower connections or older devices?"**

- Feature works offline?
- Doesn't require external APIs?
- Doesn't add excessive storage?
- Doesn't cause jank?

---

#### Question 5: Ambiguity Detection

**"Could this create confused or ambiguous states?"**

- Is outcome always clear to user?
- Can users understand behavior without training?
- Are edge cases handled gracefully?

---

**RISK DOCUMENTATION:**

```
RISK 1: [Description]
Severity: [High/Medium/Low]
Mitigation: [How we prevent or handle]

RISK 2: [Description]
Severity: [High/Medium/Low]
Mitigation: [How we prevent or handle]

RISK 3: [Description]
Severity: [High/Medium/Low]
Mitigation: [How we prevent or handle]

[Additional risks if identified]
```

---

### SECTION 2.E: DESIGN & AESTHETICS (5-10 min)

#### Question 1: Nature-Inspired Fit

**"How does this fit TimeFlow's nature-inspired aesthetic?"**

- Green/earth color palette?
- Organic shapes, soft edges?
- Minimalistic approach?

---

#### Question 2: Visual Requirements

**"Would this require new icons, colors, or UI patterns?"**

- New icons needed? Which ones? What category?
- New colors? (Must use existing palette: #3B6E3B, #52B788, #F9C74F, #FF6B6B, #90E0EF)
- New UI pattern? (Must follow existing patterns from Today.jsx, modals, etc.)

---

#### Question 3: Mobile Responsiveness

**"Could this work on a 320px mobile screen?"**

- Touch targets minimum 44px × 44px?
- No horizontal scroll?
- Readable text sizes?

---

### Phase 2 Decision Gate

```
PHILOSOPHY ALIGNMENT CHECK:
□ Reduces stress: ✓
□ Realistic planning: ✓
□ No guilt/shame: ✓
□ Reduces complexity: ✓
□ 3+ risks identified: ✓

IF ANY FAILS → PAUSE for redesign
IF ALL PASS → Proceed to Phase 3
```

---

## PHASE 3: REQUIREMENTS REFINEMENT (20-25 minutes)

### Step 3.1: Assumption Identification

**For each assumption uncovered in Phases 1-2, ask:**

1. "Is this assumption actually true?"
2. "What if it's wrong?"
3. "How do we know without building it?"

```
ASSUMPTIONS LOG:
□ Assumption 1: [Assumption]
  Truth test: [How we verify]
  Impact if wrong: [Consequence]

□ Assumption 2: [Assumption]
  Truth test: [How we verify]
  Impact if wrong: [Consequence]
```

---

### Step 3.2: Dependency Mapping

**Technical Dependencies:**
```
Does this require changes to:
□ storage.js? (persistence changes)
□ scheduler.js? (logic changes)
□ smartReschedule.js? (rescheduling changes)
□ Icon system? (new icons)
□ CSS/styling? (new patterns)
```

**Feature Dependencies:**
```
□ Does this assume another feature exists?
□ Does this conflict with existing features?
□ Does this extend or replace existing feature?
```

**Data Dependencies:**
```
New task fields:
[List all new fields]

Modified task fields:
[List any modified fields]

Migration strategy:
[How do we handle old data]
```

---

### Step 3.3: Design System Alignment Checklist

```
DESIGN SYSTEM COMPLIANCE:
□ Uses existing palette (#3B6E3B, #52B788, #F9C74F, #FF6B6B, #90E0EF)
□ Icons outline-only, minimalistic, grey (#999/#888)
□ Touch targets 44px+ minimum
□ Typography scale: 28/22/18/15/13/12px
□ Spacing scale: 4/8/12/16/20/24/32px
□ Mobile viewport: 320px minimum
□ Dark mode: All colors have equivalents
□ Animations: <400ms, smooth, respect prefers-reduced-motion
□ No new UI patterns outside existing system
□ Tab bar: 70px not affected
□ Icons don't use hardcoded colors
□ Follows existing component patterns
```

**For each FAILED item:** Document why it doesn't apply or redesign

---

### Step 3.4: Calm Productivity Verification Matrix

```
| Dimension | Question | Status | Notes |
|-----------|----------|--------|-------|
| Stress Reduction | Does this reduce user stress? | ✓/✗ | |
| Realistic Planning | Encourages realistic planning? | ✓/✗ | |
| Progress Focus | Celebrates progress, not perfection? | ✓/✗ | |
| Gentle Guidance | Guides supportively, not judgmentally? | ✓/✗ | |
| Nature Integration | Fits nature-inspired design? | ✓/✗ | |

DECISION: All must be ✓. If ANY ✗, redesign required.
```

---

## PHASE 4: DESIGN & ARCHITECTURE DISCUSSION (20-30 minutes)

### Step 4.1: Integration Patterns

**Data Flow Documentation:**

```
CURRENT FLOW:
User Action → State Update (Today.jsx) → Calculation (scheduler.js)
→ localStorage Save (storage.js) → UI Re-render (React)

WITH NEW FEATURE:
User Action → [New step] → Calculation → Save → Render
           ↓
         [Where does new feature fit?]
         [What new steps added?]
```

---

### Step 4.2: Complexity Assessment

**Code Complexity:**
- Simple: Single component, <100 lines
- Moderate: Multiple components, <500 lines
- Complex: Cross-file, 500-1500 lines
- Very Complex: Major refactoring, 1500+ lines, affects core systems

**Testing Complexity:**
- Simple: <5 test scenarios
- Moderate: 5-15 test scenarios
- Complex: 15-30 test scenarios
- Very Complex: 30+, needs integration testing

**Dependency Complexity:**
- Low: <3 files affected
- Medium: 3-6 files affected
- High: 7-12 files affected
- Critical: 12+ files, especially core systems

**Risk Complexity:**
- Low: <3 identified risks
- Medium: 3-5 risks
- High: 6-8 risks
- Critical: 9+ risks, especially data integrity

---

### Step 4.3: Data Structure Design

```
TASK STRUCTURE CHANGES:

New fields to add:
□ fieldName: [type] = [default value]
□ fieldName: [type] = [default value]

Modified fields:
□ fieldName: [old type/value] → [new type/value]

Carryover implications:
□ Does originalTaskId still work?
□ Does deduplication still function?
□ Does new field carry over correctly?

Backwards compatibility:
□ Can old data format be upgraded?
□ What happens if new code reads old data?
□ Is data loss possible?
```

---

### Step 4.4: Component Change Analysis

```
COMPONENT: Today.jsx
├─ New State: [useState additions]
├─ Modified State: [useState changes]
├─ New Handlers: [event handlers]
├─ Modified Handlers: [function changes]
├─ New Renders: [JSX additions]
└─ Risk: [High/Medium/Low]

COMPONENT: storage.js
├─ New Functions: [utilities needed]
├─ Modified Functions: [logic changes]
├─ Schema Changes: [task structure changes]
└─ Risk: [High/Medium/Low - CRITICAL for carryover]

[Repeat for each affected component]
```

---

## PHASE 5: ACCEPTANCE CRITERIA & TESTING (15-20 minutes)

### Step 5.1: Generate Acceptance Criteria

**Pattern:**

```
REQUIREMENT: Users can [action]

ACCEPTANCE CRITERIA:
□ Given [precondition], when [action], then [result]
□ Given [precondition], when [action], then [result]
□ Given [edge case], when [action], then [graceful handling]
□ Performance: [measurement] < [threshold]
□ Dark Mode: [component] displays correctly
□ Mobile: [component] displays on 320px screens
□ Accessibility: [component] has WCAG AA contrast
□ Offline: [action] works without network
□ Carryover: [action] doesn't break carryover logic
```

**Requirement Example:**

```
REQUIREMENT: User can reschedule task to later time

ACCEPTANCE CRITERIA:
□ Given task is scheduled for 14:00, when user clicks [Later Today],
  then TimeFlow finds next available 30-min slot
□ Given no available slots exist, when user clicks [Later Today],
  then UI shows "No free slots today" message
□ Given task duration changed, when user reschedules,
  then new duration is preserved
□ Performance: Suggestion generated within 200ms
□ Dark Mode: Modal displays correctly in dark mode
□ Mobile: All buttons fit within 320px width, 44px+ tap targets
□ Accessibility: Focus visible, keyboard navigable, WCAG AA colors
□ Offline: Works without network connection
□ Carryover: If rescheduled task carries, ID matching still works
```

---

### Step 5.2: Test Structure Generation

**Template for /timeflow-tdd integration:**

```javascript
describe('Feature: [Feature Name]', () => {
  describe('Core Functionality', () => {
    test('SHOULD [acceptance criterion 1]', () => {});
    test('SHOULD [acceptance criterion 2]', () => {});
    // [One test per criterion]
  });

  describe('Edge Cases', () => {
    test('SHOULD handle [edge case A]', () => {});
    test('SHOULD handle [edge case B]', () => {});
  });

  describe('Integration', () => {
    test('SHOULD work with carryover logic', () => {});
    test('SHOULD persist to localStorage', () => {});
    test('SHOULD work in dark mode', () => {});
    test('SHOULD work offline', () => {});
  });

  describe('Performance', () => {
    test('SHOULD complete within [threshold]ms', () => {});
  });
});
```

---

### Step 5.3: Verification Checklist

**Before Implementation:**

```
VERIFICATION CHECKLIST:

FUNCTIONAL:
□ Core behavior specified clearly
□ All acceptance criteria testable
□ Edge cases handled
□ Error messages planned

DATA INTEGRITY (CRITICAL):
□ Carryover logic unchanged
□ Task IDs used (never names)
□ Deduplication still works
□ Deletion still safe

DESIGN:
□ Color palette verified
□ Icons specified (grey, outline-only)
□ Touch targets 44px+
□ Typography consistent
□ Dark mode supported
□ Mobile responsive

PHILOSOPHY:
□ Feature reduces stress ✓
□ Encourages realistic planning ✓
□ No guilt/shame risk ✓
□ Nature-inspired aesthetic ✓

PERFORMANCE:
□ No layout jank planned
□ Animation smooth (60fps)
□ Storage efficient
□ Works on slow connections

DEPENDENCIES:
□ Technology dependencies clear
□ Data schema updated
□ Migration strategy defined
□ Backwards compatibility verified
```

---

## OUTPUT: REQUIREMENTS DOCUMENT

After completing Phase 5, Claude generates formal Requirements Document:

```markdown
# Feature Requirements: [Feature Name]

## 1. Executive Summary
[One paragraph: Problem, solution, impact]

## 2. Feature Overview
- User story
- Success metrics
- Scope (MVP vs future)

## 3. User Stories & Acceptance Criteria
[From Phase 5.1]

## 4. Design & UI
[Component changes, icon requirements, dark mode notes]

## 5. Data Model
[New fields, schema changes, migration strategy]

## 6. Architecture & Integration
[Component changes, data flow, dependencies]

## 7. Risk Assessment
[All identified risks with mitigations - minimum 3]

## 8. Testing Strategy
[Test outline, coverage goals, performance targets]

## 9. Philosophy Alignment Matrix
[Completed calm productivity matrix]

## 10. Implementation Plan
[Ordered file changes, complexity estimate]

## 11. Acceptance Criteria
[All criteria from Phase 5.1]

## 12. Non-Functional Requirements
[Performance, accessibility, mobile, offline, dark mode]

## 13. Success Metrics
[How do we know this feature succeeded?]
```

---

## SUCCESS CRITERIA FOR BRAINSTORMING

```
COMPLETENESS:
□ All 5 phases executed
□ Minimum 3 risks identified
□ All calm productivity questions answered
□ All decision gates passed

RIGOR:
□ No vague acceptance criteria
□ All assumptions challenged
□ Architecture implications documented
□ Edge cases explored

CLARITY:
□ Requirements unambiguous
□ No conflicting criteria
□ Architecture clear
□ Implementation team can start immediately

PHILOSOPHY ALIGNMENT:
□ Feature passes calm productivity matrix
□ No gamification
□ Reduces user stress
□ Encourages realistic planning

ACTIONABILITY:
□ Test structure complete
□ Risk mitigations concrete
□ Design specs match spec
□ Ready for /timeflow-tdd
```

---

## Quick Command Reference

```
WHEN USER INVOKES: /timeflow-brainstorm [raw idea]

1. PHASE 1 (5-10 min): Opening questions
2. VERIFY: User confirms understanding
3. PHASE 2 (20-30 min): Deep Socratic questioning
   - 2.A: Calm productivity (CRITICAL)
   - 2.B: User value
   - 2.C: Architecture
   - 2.D: Risks (minimum 3)
   - 2.E: Design
4. GATE 1: Philosophy alignment check
5. PHASE 3 (20-25 min): Requirements refinement
6. PHASE 4 (20-30 min): Design & architecture
7. PHASE 5 (15-20 min): Acceptance criteria
8. OUTPUT: Formal Requirements Document
9. HANDOFF: Ready for /timeflow-tdd
```

---

## Philosophy Alignment Gate (CRITICAL)

```
GATE QUESTIONS:

1. Stress Reduction: ___________________________________
   ✓ GREEN: Feature reduces stress
   ✗ RED: Feature increases stress/complexity

2. Realistic Planning: _________________________________
   ✓ GREEN: Encourages realistic planning
   ✗ RED: Enables wishful thinking

3. Psychological Safety: _______________________________
   ✓ GREEN: No guilt/shame risk
   ✗ RED: Could cause guilt/shame (BLOCKER)

4. Cognitive Load: ____________________________________
   ✓ GREEN: Reduces complexity
   ✗ RED: Increases complexity

DECISION:
☑ All GREEN → Proceed to Phase 3
☐ ANY RED → Return to redesign
☐ BLOCKER → Feature rejected or major redesign required
```

---

## Integration with TimeFlow Ecosystem

```
UPSTREAM:
← User feedback, bugs, design reviews

/timeflow-brainstorm (This skill)
  Output: Formal Requirements Document

DOWNSTREAM:
→ /timeflow-tdd: Implement with tests
→ /design-review: Review UI/UX
→ /fix-bug: Fix regressions
→ /timeflow-guide: Update documentation
```

**Key Integration Points:**
- Test structure output feeds directly into /timeflow-tdd
- Requirements document becomes implementation spec
- Risk documentation guides testing strategy
- Calm productivity matrix becomes verification checklist
