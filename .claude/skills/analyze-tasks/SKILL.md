---
name: analyze-tasks
description: Deep research and investigation of TimeFlow's task persistence, carryover logic, and AI rescheduling system. Use for investigating task-related bugs, understanding behavioral patterns, tracing data flow, or validating that changes don't break carryover functionality.
disable-model-invocation: false
argument-hint: "specific issue or component to investigate"
---

# TimeFlow Task System - Deep Analysis Skill

Thoroughly investigate $ARGUMENTS across the TimeFlow codebase with systematic research:

## Research Methodology

### Phase 1: Identify Target Files
- Locate all files related to task management, persistence, and carryover
- Find relevant test cases or bug reports related to the issue
- Map out dependencies between components (Today.jsx → storage.js → smartReschedule.js)

### Phase 2: Trace Task Lifecycle
**Follow a task from creation through completion/carryover:**
- **Creation**: How is the task ID generated? What initial fields are set?
- **Storage**: How is it saved to localStorage? What triggers persistence?
- **Carryover**: When carried to next day, what fields are added/modified?
- **Deletion**: How is it identified for deletion? What cleanup happens?
- **Completion**: How is completion tracked? Does completed flag prevent carryover?

### Phase 3: Investigate Task Matching Implementation
- Trace ALL places where tasks are identified/matched
- Check if matching uses IDs or names
- Look for duplicated matching logic (may have inconsistencies)
- Verify deduplication logic uses composite keys
- Check for edge cases (same name, partial matches, null values)

### Phase 4: Analyze Data Persistence Flow
- How are tasks loaded from localStorage?
- When are tasks saved? (immediate or debounced?)
- What triggers cross-date synchronization?
- Are there race conditions on deletions?
- How is localStorage formatted and parsed?

### Phase 5: Check for Known Patterns
- **Name-based matching**: Search for `t.name ===` or `task.name ==`
- **ID mismatch**: Look for `t.id` when `t.originalTaskId` should be used
- **Debounced deletions**: Search for `setTimeout` or debounce on delete operations
- **Missing deduplication**: Check deduplication logic completeness
- **Incomplete carryover marking**: Verify all carried tasks get `carriedMarked: true`

### Phase 6: Summarize Findings with Context
- Provide specific file paths and line numbers
- Include code snippets showing the issue
- Identify which components are affected
- Highlight potential data loss or corruption vectors
- Recommend specific fixes with file locations
