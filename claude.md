# Best Practices for Using Claude in Claude Code

## Quick Start
1. **Always consider subagents** for complex, parallel research
2. **Use Plan Mode** for non-trivial implementation tasks
3. **Track progress** with TodoWrite for multi-step work
4. **Read code first** before proposing modifications
5. **Ask questions** when requirements are unclear

---

## 0. Use Subagents for Parallel & Complex Work

**Why Use Subagents:** Subagents enable parallel exploration and specialized thinking. They're autonomous, independent workers that can operate simultaneously without blocking your main context.

### When to Use Subagents (Always Consider)

**Use Subagents For:**
- ✅ **Parallel Research** - Multiple independent investigations (e.g., search 3 different component files simultaneously)
- ✅ **Specialized Analysis** - Deep dives into specific domains (Explore agent for codebase structure, Plan agent for architecture)
- ✅ **Context-Heavy Tasks** - Tasks requiring extensive exploration that would consume main context
- ✅ **Planning Complex Features** - Launch Plan agent to design while you handle other work
- ✅ **Codebase Exploration** - Explore agent for "how does X system work?" questions
- ✅ **Multi-Skill Workflows** - Plan agent designs TDD tests while you review existing patterns
- ✅ **Ralph Loop Setup** - Design loop phases in parallel subagent before implementation begins

**Don't Use Subagents For:**
- ❌ Simple, immediate tasks ("find this file" → use Glob directly)
- ❌ Trivial edits ("add a line" → use Edit tool directly)
- ❌ Sequential work (task B depends on task A results)
- ❌ Real-time user interaction needed
- ❌ Decisions requiring user judgment

### Subagent Types & Best Uses

| Agent Type | Best For | Launch Pattern |
|-----------|----------|-----------------|
| **Explore** | Understanding codebase structure, patterns, relationships | "Find how X system works across N files" |
| **Plan** | Designing implementation approach, architecture decisions | "Design feature with multiple possible approaches" |
| **General** | Research, code search, investigation | "Research how emoji replacement was done" |

### How to Launch Subagents Effectively

**Pattern 1: Single Parallel Investigation**
```
"Launch Explore agent to understand task carryover system architecture while I review Today.jsx"
→ Agent runs independently
→ Returns findings
→ You integrate learnings into main work
```

**Pattern 2: Multiple Parallel Subagents**
```
Launch 3 Plan subagents in parallel:
- Agent 1: Design TDD test structure
- Agent 2: Design database schema changes
- Agent 3: Design UI component structure

All run simultaneously, return results for comparison
```

**Pattern 3: Explore → Plan → Implement Pipeline**
```
1. Launch Explore agent: "Understand current icon system"
2. (In parallel) You review existing icon patterns
3. Launch Plan agent: "Design icon refactoring approach based on Explore findings"
4. Implement based on all findings
```

### TimeFlow-Specific Subagent Usage

**Ralph Loop Setup:**
- Launch Plan subagent to design 7-phase workflow
- Launch Plan subagent to design test strategy
- Launch Explore agent to understand edge cases

**Complex Bug Investigation:**
- Launch Explore agent to map all task carryover references
- Launch Explore agent to check localStorage usage patterns
- Synthesize findings for root cause analysis

**Feature Design:**
- Launch Plan agent to design component structure
- Launch Plan agent to design data persistence changes
- Launch Explore agent to find similar patterns in codebase

### Output Processing

After subagents complete:
1. **Review & Synthesize** - Combine findings into coherent strategy
2. **Identify Gaps** - Check for incomplete coverage
3. **Make Decisions** - Use findings to proceed with confidence
4. **Document Learning** - Note patterns discovered for future work

### Avoid Subagent Anti-Patterns

❌ **"Launch subagent for simple file search"** → Use Glob/Grep directly (faster)
❌ **"Launch subagent without clear goal"** → Define specific question first
❌ **"Ignore subagent findings"** → If you launch them, use the output
❌ **"Sequential subagent calls"** → Launch parallel when possible
❌ **"No synthesis of findings"** → Always integrate subagent output into work

---

## 1. Use Plan Mode for Non-Trivial Tasks

**When to use:** For implementation tasks that involve multiple files, architectural decisions, or where the approach isn't obvious.

- Use `EnterPlanMode` before writing code for significant changes
- This allows exploring the codebase and designing a solution before committing to an approach
- Get user approval on your strategy before implementation
- Skip plan mode only for simple, straightforward tasks (single-line fixes, obvious bugs)

**Example:** Adding a new feature should start with plan mode → exploration → design → approval → implementation

---

## 2. Use Extended Thinking for Complex Problems

**When to use:** When tackling complex algorithms, debugging hard-to-find issues, or making important architectural decisions.

- Extended thinking helps Claude reason through problems step-by-step
- Particularly valuable for:
  - Performance optimization problems
  - Complex refactoring decisions
  - Debugging multi-component interactions
  - Understanding unfamiliar codebases

---

## 3. Use Todo Lists (TodoWrite) to Track Progress

**When to use:** For any task with 3+ steps or any non-trivial work.

- Create todos at the start to plan work
- Mark todos as `in_progress` when you start them
- Mark todos as `completed` immediately when finished
- Keep exactly ONE task in_progress at a time
- Use this to give users visibility into what you're doing

**Benefits:**
- Prevents forgetting steps
- Shows progress to the user
- Helps organize complex tasks
- Keeps you focused

---

## 4. Read Code Before Modifying

**Best Practice:** Always read relevant files first.

- Use `Read` tool to understand existing code
- Understand patterns in the codebase
- Check for similar implementations
- Avoid proposing changes to code you haven't read
- This prevents breaking existing functionality

---

## 5. Use Specialized Tools and Agents Appropriately

| Task | Tool | When |
|------|------|------|
| **Quick file search** | Glob or Grep | Looking for specific patterns or files |
| **Complex exploration** | Task (Explore agent) | Need to understand codebase structure or relationships |
| **Git operations** | Bash | Commits, branches, status checks |
| **File operations** | Read/Edit/Write | Reading, editing, or creating files |
| **Planning** | EnterPlanMode | Before significant implementation work |
| **Asking for input** | AskUserQuestion | Need user decisions or clarification |

---

## 6. Parallelize Independent Tasks

**When multiple tools don't depend on each other:**
- Make all calls in a single response
- This speeds up work and reduces round-trips
- Example: Search for multiple patterns in parallel, run multiple git commands

**Sequential for dependent tasks:**
- Wait for results before proceeding
- Example: Read file → understand it → make changes

---

## 7. Ask Questions When Needed

Use `AskUserQuestion` to:
- Clarify ambiguous requirements
- Get user preference on implementation approaches
- Validate assumptions before proceeding
- Gather missing information

This prevents wasted work and ensures alignment.

---

## 8. Focus on What Was Asked

**Keep scope narrow:**
- Don't add extra features beyond what's requested
- Don't refactor surrounding code unless asked
- Don't add "nice-to-have" error handling for impossible scenarios
- Don't over-engineer solutions
- Avoid premature abstraction

**Exception:** Only make changes beyond the ask if they're clearly necessary.

---

## 9. Use Appropriate Communication

- Output all thoughts and communication as text (not in code comments)
- Use markdown formatting for clarity
- Keep responses concise and focused
- Don't use tools as a way to communicate with the user
- Reserve emoji only if explicitly requested

---

## 10. Code Quality Standards

**Before finishing:**
- No obvious bugs or security vulnerabilities
- Proper error handling at system boundaries (user input, APIs)
- Code follows existing patterns in the codebase
- Tests pass (if applicable)
- No hardcoded values without context

**Avoid:**
- XSS, SQL injection, command injection, OWASP top 10 vulnerabilities
- Backwards-compatibility hacks for unused code
- `// removed` comments or unused `_vars`

---

## 11. Commit Messages

When creating commits:
- Use clear, descriptive messages (1-2 sentences)
- Focus on "why" not just "what"
- Include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` footer
- Don't amend commits; create new ones when fixing hook failures

---

## 12. General Workflow

1. **Understand the request** - Ask clarifying questions if needed
2. **Plan if necessary** - Use EnterPlanMode for non-trivial work
3. **Explore** - Read relevant code, understand patterns
4. **Create todos** - Break down multi-step work into trackable items
5. **Implement** - Write code following best practices
6. **Verify** - Run tests, check for errors
7. **Communicate** - Explain what you did and why

---

## 13. Time Estimates: Never Give Them

**Important:** Do not estimate how long tasks take.

- Users can judge complexity themselves
- Estimates often prove wrong and set poor expectations
- Focus on what needs to be done, not timeline
- Let users decide if the scope is manageable

---

## 14. Security Considerations

When helping with security:
- ✅ Authorized pentesting, CTF challenges, defensive security
- ✅ Security research and educational contexts
- ❌ Destructive techniques, DoS attacks, mass targeting
- ❌ Detection evasion for malicious purposes
- ⚠️ Dual-use tools (C2, credential testing) require clear authorization context


---

## 15. TimeFlow Project Guide

### Project Overview

**TimeFlow** is a nature-themed intelligent task scheduler (React 18 + Vite). It helps users flow through their day with calm productivity by combining time-blocking, intelligent rescheduling, and behavioral learning.

**Key Philosophy:** Realistic planning over wishful thinking, gentle guidance over guilt, progress over perfection.

### Core Features to Understand
- **Time-Blocked Scheduling** - Tasks have specific times and durations, shown as visual timeline
- **AI-Powered Rescheduling** - 7 ranked options when tasks overrun (smartReschedule.js - 1500+ lines)
- **Task Health Assessment** - 3-tier risk system (green/amber/red) based on attempts, deadlines, conflicts
- **Weekly Pool** - Low-pressure brainstorming space for task ideas
- **Insights Dashboard** - Analytics on productivity patterns, duration accuracy, best hours
- **PWA & Offline** - 100% offline with service worker, 713KB precached

### Current Architecture

**Key Files:**
- `Today.jsx` - Main daily view, task management, carryover logic
- `storage.js` - localStorage persistence, task loading/saving
- `smartReschedule.js` - AI rescheduling engine (10 subsystems)
- `scheduler.js` - Conflict detection, slot optimization, task categorization
- `/src/icons/` - 60+ custom SVG icons (minimalistic outline-only)
- `swiftui.css` - Tab bar and component styling

**Data Flow:**
```
User Action → State Update (Today.jsx) → localStorage Save (storage.js)
→ Cross-date Sync (if needed) → UI Render
```

### Recent Major Changes (v1.1.2)

✅ **Tab Bar Redesign**
- 70px fixed height, solid white/dark backgrounds
- Full-width display (100vw)
- Active tab indicator (thin underline)
- 20px grey icons (#999 light, #888 dark)

✅ **Icon System Overhaul**
- 60+ icons converted to minimalistic outline-only
- Consistent 1.1-1.3px stroke weights
- Grey color scheme for entire system
- Dark mode auto-detection via context

✅ **Critical Bug Fix - Carried-Over Tasks**
- **OLD:** Name-based matching (fragile, fails on edits)
- **NEW:** ID-based matching with `originalTaskId`
- **Impact:** Deleted carried tasks no longer reappear
- **Implementation:** Immediate deletion saves, duplicate detection via IDs

### Known Patterns & Conventions

**Task Structure:**
```javascript
{
  id: Date.now() + Math.random(),        // Unique ID
  name: "Task name",
  duration: 30,                           // Minutes
  startTime: "14:30",                     // HH:MM format (24h)
  deadline: "2026-03-19",                 // YYYY-MM-DD
  category: "coding",                     // Auto-detected
  completed: false,
  remaining: 30,

  // For carried-over tasks:
  carriedOver: true,
  originalDate: "2026-03-18",             // When first created
  originalTaskId: originalTaskId,         // ID of original task
  carriedMarked: true,                    // Prevent re-carries
}
```

**Color System:**
- Primary Green: #3B6E3B (light), #6FAF6F (dark)
- Status Green: #52B788
- Warning: #F9C74F
- Alert: #FF6B6B
- Info: #90E0EF
- Icon Grey: #999 (light), #888 (dark)

**Icon Pattern:**
```javascript
// All icons follow this pattern
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
    <svg {...} fill="none" stroke={resolvedFill} strokeWidth="1.2">
      {/* Outline-only SVG paths */}
    </svg>
  );
});
```

### Common Tasks & Solutions

**Adding a New Icon:**
1. Create file in `/src/icons/[category]/IconName.jsx`
2. Use outline-only design (no fills, `fill="none"`)
3. Export from `/src/icons/index.js`
4. Use `useIconContext()` for dark mode

**Fixing Task Persistence Issues:**
- Use `originalTaskId` for matching, NOT task names
- Call `saveTasks()` or `saveTasksForDate()` immediately (no debounce)
- Check for duplicates: `${originalDate}-${originalTaskId}`
- Mark original as `carriedMarked: true` to prevent re-carries

**Adding Features Without Breaking Carryover:**
- Don't use name-based task matching anywhere
- Always use task IDs for identification
- Test edge case: carry task → edit name → delete → next day

**Dark Mode Issues:**
- Use `useIconContext()` for automatic theme detection
- CSS dark mode: `@media (prefers-color-scheme: dark) { ... }`
- Never hardcode colors for light/dark - use context

### Testing Before Committing

- [ ] Task carryover doesn't duplicate on new days
- [ ] Deleted tasks don't reappear after page reload
- [ ] Icons render at correct size (20px in tab bar)
- [ ] Icons stay grey (no unintended color changes)
- [ ] Dark mode works correctly
- [ ] No console errors or warnings
- [ ] localStorage data persists after browser close

### Common Pitfalls to Avoid

❌ **Name-based task matching** - Use IDs instead
❌ **Debounced deletion saves** - Delete immediately
❌ **Hardcoded colors in icons** - Use context + CSS variables
❌ **Filled SVG shapes** - Keep `fill="none"` for minimalistic icons
❌ **Icon size changes** - Keep 20px in tab bar, 24px elsewhere as default
❌ **Adding decorative icon details** - Maintain minimalistic outline aesthetic
❌ **Forgetting to mark original tasks** - Set `carriedMarked: true` to prevent re-carries

### File Locations Map

```
TimeFlow/
├── src/
│   ├── components/
│   │   ├── Today.jsx              ← Main daily view & task logic
│   │   ├── mobile/MobileLayout.jsx ← Layout wrapper
│   │   ├── SwiftUIComponents.jsx  ← Tab bar component
│   │   └── [other views]
│   ├── icons/
│   │   ├── growth/                ← Growth icons
│   │   ├── status/                ← Status icons
│   │   ├── emotions/              ← Emotion icons
│   │   ├── ui-controls/           ← UI icons
│   │   ├── categories/            ← Category icons
│   │   ├── achievements/          ← Achievement icons
│   │   ├── platform/              ← Platform icons
│   │   ├── misc/                  ← Miscellaneous icons
│   │   └── index.js               ← Icon exports
│   ├── utils/
│   │   ├── storage.js             ← localStorage management
│   │   ├── smartReschedule.js     ← AI rescheduling engine
│   │   ├── scheduler.js           ← Task scheduling utilities
│   │   └── [other utilities]
│   ├── styles/
│   │   ├── swiftui.css            ← Component styles (tab bar, etc)
│   │   ├── mobile.css             ← Mobile-specific styles
│   │   └── [other styles]
│   └── App.jsx
├── DOCUMENTATION.md               ← Comprehensive docs
├── README.md                      ← Quick overview
├── CLAUDE.md                      ← Guidelines (this file)
└── package.json
```

### Before Making Major Changes

1. **Check existing patterns** - Look for similar implementations first
2. **Read DOCUMENTATION.md** - Understand how things work
3. **Use Plan Mode** - For non-trivial changes
4. **Test carryover logic** - If modifying task persistence
5. **Check icon consistency** - If adding/modifying icons
6. **Consider dark mode** - All changes should support both themes

### Performance Considerations

- Task list renders frequently - use memoization (`useMemo`, `useCallback`)
- localStorage is synchronous - keep saves lean
- Conflict detection is O(n²) - acceptable for <100 tasks
- Search has 300ms debounce - don't reduce below this
- Icon rendering uses React.memo - preserve this optimization