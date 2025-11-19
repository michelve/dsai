# Task Dependencies & Blockers

Complete guide to understanding task dependencies, blockers, and the critical path in the DSAi Design System project.

---

## 🎯 Overview

Every task in your project has **dependency information** extracted from the task markdown files:

- **Requires (Blockers)**: Tasks that must be completed before this one can start
- **Blocks**: Tasks that are waiting for this one to complete

This creates a **dependency graph** that helps you understand:
- Which tasks can start immediately
- Which tasks are blocked
- The critical path through the project
- What gets unblocked when you complete a task

---

## 🏷️ Dependency Labels

### Automatic Labels

| Label | Meaning | Filter |
|-------|---------|--------|
| `🚧 has-dependencies` | Task requires other tasks first | `label:"🚧 has-dependencies"` |
| `✅ completed` | Task is done | `label:"✅ completed"` |
| `📋 todo` | Task not started | `label:"📋 todo"` |

### Finding Blocked vs Ready Tasks

**Blocked tasks** (has dependencies):
```
label:"🚧 has-dependencies" label:"📋 todo"
```
→ 52 tasks waiting on dependencies

**Ready to start** (no dependencies):
```
label:"📋 todo" -label:"🚧 has-dependencies"
```
→ Tasks with no blockers

**Critical path** (completed tasks):
```
label:"✅ completed"
```
→ 5 tasks (TASK-001 to TASK-005)

---

## 📊 Dependency Information in Issues

Each GitHub issue shows dependency information:

### Example: TASK-011 (Design JSON Token Structure)

```markdown
## 🔗 Dependencies

### ⚠️ Requires (Blockers)
This task depends on the following tasks to be completed first:
TASK-001, TASK-007, TASK-009, TASK-010

**Note:** This task is blocked until the above dependencies are resolved.

### 🚧 Blocks
Completing this task will unblock:
TASK-012, TASK-015, TASK-016, TASK-019
```

This tells you:
- **Can't start** until: TASK-001, 007, 009, 010 are done
- **Will unblock**: TASK-012, 015, 016, 019 when complete

---

## 🗺️ Critical Path

### Phase 0 Foundation (Must do first)

**No dependencies** (Start immediately):
```
TASK-001: Nx Monorepo ← START HERE
TASK-002: TypeScript/ESLint/Prettier  
TASK-003: Build Pipeline
TASK-004: CI/CD Pipeline
TASK-005: Testing Infrastructure
```

**Designer foundation work**:
```
TASK-006: Bootstrap Audit ← Designer starts here
    ↓
TASK-007: Color Palette (blocks TASK-009, 010, 011)
    ↓
TASK-009: Typography Scale (blocks TASK-010, 011, 019)
    ↓
TASK-010: Figma Variables (blocks TASK-011, 018, 019)
```

**Critical blocker**:
```
TASK-011: JSON Token Structure
    Requires: TASK-001, 007, 009, 010
    Blocks: TASK-012, 015, 016, 019 + ALL components
```

### Phase 1 Token System (After Phase 0)

**Dependency chain**:
```
TASK-011 (JSON Tokens)
    ↓
TASK-012 (Style Dictionary)
    ↓
TASK-015 (CSS Variables)
    ↓
TASK-014 (Component Template)
    ↓
Components can start!
```

### Phase 2+ Components

**All 25 components depend on**:
- ✅ TASK-011: Token structure
- ✅ TASK-012: Style Dictionary
- ✅ TASK-013: Storybook
- ✅ TASK-014: Component template

---

## 🔍 Analyzing Dependencies

### Tasks with Most Dependencies (Blockers)

**Heavily blocked tasks**:

1. **TASK-011** (Token Structure)
   - Requires: 4 tasks (001, 007, 009, 010)
   - Blocks: 40+ tasks (entire project!)

2. **TASK-013** (Storybook)
   - Requires: 4 tasks (001, 002, 011, 012)
   - Blocks: All component documentation

3. **TASK-014** (Component Template)
   - Requires: 3 tasks (011, 012, 013)
   - Blocks: All 25 components

### Critical Bottleneck Tasks

Tasks that block the most others:

1. **TASK-011** (Token Structure) - Blocks 40+ tasks
2. **TASK-012** (Style Dictionary) - Blocks 30+ tasks
3. **TASK-007** (Color Palette) - Blocks token system
4. **TASK-009** (Typography) - Blocks token system

---

## 🎯 Filtering by Dependencies

### See What's Blocking a Task

Look at the issue body under "Requires" section.

### See What This Task Blocks

Look at the issue body under "Blocks" section.

### Find Tasks Ready to Start

**No dependencies, not started**:
```
label:"📋 todo" -label:"🚧 has-dependencies"
```

**Your current assignee, ready to start**:
```
assignee:@me label:"📋 todo" -label:"🚧 has-dependencies"
```

### Find What Gets Unblocked

When you complete a task, check its "Blocks" section to see what becomes available.

---

## 📈 Dependency Graph Example

```
TASK-001 (Monorepo) ──┐
TASK-007 (Colors) ─────┼──→ TASK-011 (Tokens) ──→ TASK-012 (Style Dict) ──→ Components
TASK-009 (Typography) ─┤                    ↓
TASK-010 (Figma Vars) ─┘                    └──→ TASK-013 (Storybook)
                                             └──→ TASK-015 (CSS Vars)
                                             └──→ TASK-019 (Semantic)
```

---

## 🚀 Practical Workflow

### 1. Starting a New Sprint

**Find ready tasks**:
```
label:"📍 phase-0" label:"📋 todo" -label:"🚧 has-dependencies"
```

### 2. Planning Designer Work

**Designer tasks by dependencies**:
```
label:"👨‍🎨 designer" label:"📋 todo"
```

Check each issue's "Requires" section to plan order.

### 3. After Completing a Task

1. Mark task as done (close issue or add `✅ completed`)
2. Check "Blocks" section
3. Those tasks are now closer to being unblocked
4. Check their "Requires" to see if all dependencies met

### 4. Finding the Next Task

**Your work, ready to start**:
```
assignee:@me label:"📋 todo" -label:"🚧 has-dependencies" sort:priority-desc
```

---

## 🎨 Designer Dependency Path

**Critical designer sequence**:

```
Week 1-2:
TASK-006: Bootstrap Audit (no dependencies)
    ↓
TASK-007: Color Palette
    ↓
TASK-009: Typography Scale
    ↓
TASK-008: Figma File Structure
    ↓
TASK-010: Figma Variables
    ↓
Developer can start TASK-011 (Tokens)
```

**Parallel designer work** (after Phase 0):
- TASK-018: Populate Figma Variables
- TASK-020: Storybook Theme
- TASK-046-050: Figma integration tasks

---

## 💻 Developer Dependency Path

**Critical developer sequence**:

```
Week 1-4:
TASK-001: Monorepo ← START
TASK-002: TypeScript/ESLint
TASK-003: Build Pipeline
TASK-004: CI/CD
TASK-005: Testing
    ↓
Wait for designer work (TASK-007, 009, 010)
    ↓
Week 5-6:
TASK-011: Token Structure
    ↓
TASK-012: Style Dictionary
TASK-013: Storybook
    ↓
TASK-015: CSS Variables
TASK-014: Component Template
    ↓
Week 7+:
Components can start!
```

---

## 📊 Dependency Statistics

### By Phase

**Phase 0** (10 tasks):
- No dependencies: 5 tasks (TASK-001-005)
- Has dependencies: 5 tasks (TASK-006-010)

**Phase 1** (10 tasks):
- All depend on Phase 0 completion
- 9/10 depend on TASK-011

**Phase 2** (25 component tasks):
- All depend on Phase 1 completion
- All need: Tokens + Storybook + Template

**Phase 3-4** (11 tasks):
- All depend on Phase 2 components

### Blocker Analysis

**Most critical blockers**:
1. TASK-011: Blocks 40+ tasks (75% of project)
2. TASK-007: Blocks token system (25 tasks)
3. TASK-009: Blocks token system (25 tasks)
4. TASK-012: Blocks all components (25 tasks)

---

## 🛠️ Managing Dependencies

### In GitHub Issues

**Comment on blocked issues**:
```
⚠️ Blocked by #XX, #YY, #ZZ
Waiting for [TASK-007] Color Palette to complete.
```

**Link issues**:
- Use "Blocks #XX" in issue body
- GitHub auto-links task mentions
- Create issue relationships

### Using GitHub Projects

**Column organization**:
1. **Ready** - No dependencies
2. **Blocked** - Has unmet dependencies  
3. **In Progress** - Currently working
4. **Done** - Completed

**Automation rules**:
```
If issue has label "🚧 has-dependencies"
  → Move to "Blocked" column

If issue has no label "🚧 has-dependencies" AND label "📋 todo"
  → Move to "Ready" column
```

---

## 💡 Pro Tips

### 1. Start with Phase 0 No-Dependency Tasks

These 5 tasks can all start immediately:
- TASK-001: Monorepo
- TASK-002: TypeScript
- TASK-003: Build Pipeline
- TASK-004: CI/CD
- TASK-005: Testing
- TASK-006: Bootstrap Audit (designer)

### 2. Designers: Don't Wait

Designer work is the critical path:
- TASK-007 (Colors) blocks everything
- TASK-009 (Typography) blocks everything
- Start these ASAP!

### 3. Parallel Work Windows

**Weeks 1-4**: Developer and designers can work in parallel
- Dev: Infrastructure (001-005)
- Design: Foundation (006-010)

**Weeks 5-6**: Mostly developer work
- Design: Can start Figma Variables (018)

### 4. Track Completion Impact

When you close an issue, note what it unblocks:
```
Closing TASK-011 unblocks:
✅ TASK-012 (Style Dictionary)
✅ TASK-015 (CSS Variables)
✅ TASK-016 (TypeScript Types)
✅ TASK-019 (Semantic Tokens)
```

### 5. Use Dependency Graph Tools

GitHub Projects can show dependencies visually:
- Enable "Dependencies" field
- Link issues with "blocks" relationship
- View as dependency graph

---

## 🎯 Quick Reference

### Find Tasks by Dependency Status

| What You Want | Filter |
|---------------|--------|
| Ready to start | `-label:"🚧 has-dependencies" label:"📋 todo"` |
| Blocked | `label:"🚧 has-dependencies" label:"📋 todo"` |
| Your ready work | `assignee:@me -label:"🚧 has-dependencies" label:"📋 todo"` |
| Critical path | `label:"🔴 critical" label:"🚧 has-dependencies"` |
| Designer ready | `label:"👨‍🎨 designer" -label:"🚧 has-dependencies"` |
| Developer ready | `label:"👨‍💻 developer" -label:"🚧 has-dependencies"` |

---

## ✅ Dependency Checklist

Before starting a task:
- [ ] Check "Requires" section in issue
- [ ] Verify all dependencies are completed
- [ ] Confirm you have needed outputs from dependencies
- [ ] Update issue status

After completing a task:
- [ ] Close/mark issue as complete
- [ ] Check "Blocks" section
- [ ] Comment on blocked issues that they're unblocked
- [ ] Update project board

---

**Dependency data extracted from:** `tasks/**/*.md` → Dependencies section  
**Generated in:** `config/data.csv` → `requires` and `blocks` columns  
**Displayed in:** GitHub issue body → 🔗 Dependencies section

