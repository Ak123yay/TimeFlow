# Best Practices for Using Claude in Claude Code

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

Read Documentation.md and Readme.md
use subagents if needed