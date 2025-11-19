# GitHub Issues Label System

Comprehensive labeling system for the DSAi Design System project with 57 tasks organized by role, work type, domain, priority, phase, and status.

---

## 📊 Label Categories

### 1. 👥 ROLE-BASED LABELS

Who should work on this task?

| Label | Description | Use Case |
|-------|-------------|----------|
| `👨‍🎨 designer` | Design team tasks | Color palette, Figma setup, component design |
| `👨‍💻 developer` | Development tasks | Code implementation, infrastructure setup |

**Example Filters:**
- Designer tasks: `label:"👨‍🎨 designer"`
- Developer tasks: `label:"👨‍💻 developer"`

---

### 2. 🛠️ WORK TYPE LABELS

What kind of work is this?

| Label | Description | Tasks |
|-------|-------------|-------|
| `🎨 design` | Design work | Figma, colors, typography, visual design |
| `💻 code` | Coding/implementation | Component building, features |
| `🔧 infrastructure` | Tools & setup | Build pipelines, CI/CD, Storybook |
| `📚 documentation` | Documentation | Guides, READMEs, API docs |
| `🧪 testing` | Testing & QA | Test coverage, audits, validation |

**Example Filters:**
- Design work: `label:"🎨 design"`
- Infrastructure: `label:"🔧 infrastructure"`
- Needs tests: `label:"🧪 testing"`

---

### 3. 🎯 DOMAIN LABELS

What area of the system?

| Label | Description | Components |
|-------|-------------|------------|
| `🎨 design-tokens` | Design token system | Colors, typography, spacing, shadows |
| `🧩 component` | React components | All 38 Bootstrap components |
| `🎨 figma` | Figma integration | Figma Variables, Code Connect |
| `📖 storybook` | Storybook docs | Component documentation |

**Component Complexity Sub-labels:**
- `simple` - Simple components (Button, Badge, Alert)
- `medium` - Medium complexity (Input, Select, Tabs)
- `complex` - Complex components (Modal, Dropdown, Carousel)

**Example Filters:**
- Token work: `label:"🎨 design-tokens"`
- All components: `label:"🧩 component"`
- Simple components: `label:"🧩 component" label:"simple"`
- Figma tasks: `label:"🎨 figma"`

---

### 4. 🚦 PRIORITY LABELS

How urgent is this?

| Label | Description | Timeline |
|-------|-------------|----------|
| `🔴 critical` | Blocking/Critical | Must do first |
| `🟠 high-priority` | High priority | Important, do soon |
| `🟡 medium-priority` | Medium priority | Can be scheduled |

**Example Filters:**
- Critical only: `label:"🔴 critical"`
- High priority: `label:"🟠 high-priority"`
- Not critical: `-label:"🔴 critical"`

---

### 5. 📍 PHASE LABELS

Which phase of the project?

| Label | Description | Tasks | Weeks |
|-------|-------------|-------|-------|
| `📍 phase-0` | Foundation | 10 tasks | Weeks 1-4 |
| `📍 phase-1` | Token System | 10 tasks | Weeks 5-10 |
| `📍 phase-2a` | Simple Components | 7 tasks | Weeks 11-18 |
| `📍 phase-2b` | Medium Components | 9 tasks | Weeks 19-32 |
| `📍 phase-2c` | Complex Components | 9 tasks | Weeks 33-54 |
| `📍 phase-3` | Figma Integration | 5 tasks | Weeks 55-60 |
| `📍 phase-4` | Polish & Release | 6 tasks | Weeks 61-65 |

**Example Filters:**
- Current phase: `label:"📍 phase-0"`
- Next phase: `label:"📍 phase-1"`
- All component phases: `label:"📍 phase-2a" label:"📍 phase-2b" label:"📍 phase-2c"`

---

### 6. ✅ STATUS LABELS

What's the current state?

| Label | Description |
|-------|-------------|
| `✅ completed` | Task finished |
| `📋 todo` | Not started yet |

**Example Filters:**
- Remaining work: `label:"📋 todo"`
- Done: `label:"✅ completed"`

---

### 7. 🎪 SPECIAL CATEGORY LABELS

Special focus areas:

| Label | Description | Tasks |
|-------|-------------|-------|
| `♿ accessibility` | A11y work | WCAG compliance, aria labels, screen readers |
| `⚡ performance` | Performance | Optimization, bundle size |
| `🔒 security` | Security | Security audits, vulnerabilities |

**Example Filters:**
- Accessibility tasks: `label:"♿ accessibility"`
- Performance work: `label:"⚡ performance"`
- Security audits: `label:"🔒 security"`

---

## 🔍 Powerful Filter Examples

### By Role & Phase
```
label:"👨‍🎨 designer" label:"📍 phase-0"
```
→ Designer tasks in Phase 0 (5 issues)

### By Work Type & Priority
```
label:"💻 code" label:"🔴 critical"
```
→ Critical coding tasks (6 issues)

### By Domain & Complexity
```
label:"🧩 component" label:"simple"
```
→ Simple components (7 issues)

### Current Sprint Planning
```
label:"📍 phase-0" label:"📋 todo" label:"🔴 critical"
```
→ Critical Phase 0 tasks not yet started

### Designer Backlog
```
label:"👨‍🎨 designer" label:"📋 todo" sort:priority-desc
```
→ All designer tasks, sorted by priority

### Developer Next Tasks
```
label:"👨‍💻 developer" label:"🟠 high-priority" -label:"🔧 infrastructure"
```
→ High-priority dev tasks excluding infrastructure

### Token System Work
```
label:"🎨 design-tokens" label:"📍 phase-0" OR label:"📍 phase-1"
```
→ All token-related work in Phase 0 and 1

---

## 📈 Task Breakdown by Labels

### By Role (57 total)
- `👨‍🎨 designer`: ~15 tasks
- `👨‍💻 developer`: ~42 tasks

### By Work Type
- `🎨 design`: ~18 tasks
- `💻 code`: ~45 tasks
- `🔧 infrastructure`: ~15 tasks
- `🧪 testing`: ~8 tasks
- `📚 documentation`: ~3 tasks

### By Domain
- `🎨 design-tokens`: ~12 tasks
- `🧩 component`: ~25 tasks
- `🎨 figma`: ~8 tasks
- `📖 storybook`: ~3 tasks

### By Priority
- `🔴 critical`: 11 tasks
- `🟠 high-priority`: 38 tasks
- `🟡 medium-priority`: 7 tasks

### By Phase
- `📍 phase-0`: 10 tasks
- `📍 phase-1`: 10 tasks
- `📍 phase-2a`: 7 tasks
- `📍 phase-2b`: 9 tasks
- `📍 phase-2c`: 9 tasks
- `📍 phase-3`: 5 tasks
- `📍 phase-4`: 6 tasks

### By Status
- `✅ completed`: 5 tasks
- `📋 todo`: 52 tasks

---

## 🎯 Recommended Views

### For Designers

**Current Work:**
```
label:"👨‍🎨 designer" label:"📋 todo" label:"🔴 critical"
```

**Design System Foundation:**
```
label:"🎨 design-tokens" label:"📍 phase-0"
```

**Figma Tasks:**
```
label:"🎨 figma" is:open
```

### For Developers

**Infrastructure Setup:**
```
label:"🔧 infrastructure" label:"📍 phase-0" OR label:"📍 phase-1"
```

**Component Building:**
```
label:"🧩 component" label:"simple" OR label:"medium"
```

**Current Sprint:**
```
label:"👨‍💻 developer" label:"📍 phase-0" label:"📋 todo"
```

### For Project Managers

**Critical Path:**
```
label:"🔴 critical" label:"📋 todo" sort:created-asc
```

**Phase Progress:**
```
label:"📍 phase-0" is:open
```

**Blocked Work:**
```
label:"🔴 critical" label:"👨‍🎨 designer" label:"📋 todo"
```

---

## 🛠️ How Labels Are Applied

Labels are automatically applied by the export script based on:

1. **Task Title** - Keywords like "designer", "figma", "token", "component"
2. **Task Number** - TASK-021 to TASK-045 are components
3. **Assignee** - Tasks with assignees get developer label
4. **Priority** - From task metadata (Critical, High, Medium)
5. **Phase** - From task phase field
6. **Directory** - completed/ gets completed label

---

## 💡 Pro Tips

### 1. Multi-Label Filtering
Combine multiple labels for precise filtering:
```
label:"👨‍💻 developer" label:"🧩 component" label:"simple"
```

### 2. Exclude Labels
Use `-label:` to exclude:
```
label:"📍 phase-0" -label:"✅ completed"
```

### 3. Save Filters
Save common filters as bookmarks in GitHub

### 4. Use in Projects
Add labels to project board automation:
- Auto-add `label:"📍 phase-0"` to "Current Sprint"
- Move `label:"✅ completed"` to "Done"

### 5. Sort by Priority
```
label:"📋 todo" sort:priority-desc
```

---

## 🎨 Label Colors (Suggested)

When creating labels in GitHub, use these colors for visual organization:

### Role
- `👨‍🎨 designer` - Purple (#A463F2)
- `👨‍💻 developer` - Blue (#0366D6)

### Work Type
- `🎨 design` - Pink (#E99695)
- `💻 code` - Green (#0E8A16)
- `🔧 infrastructure` - Gray (#6A737D)
- `📚 documentation` - Teal (#1D76DB)
- `🧪 testing` - Orange (#D93F0B)

### Priority
- `🔴 critical` - Red (#D73A4A)
- `🟠 high-priority` - Orange (#FB8500)
- `🟡 medium-priority` - Yellow (#FFB000)

### Phase
- All phases - Light Blue (#BFD4F2)

### Status
- `✅ completed` - Green (#28A745)
- `📋 todo` - Light Gray (#E4E669)

---

## 📚 Examples of Labeled Issues

### Example 1: Designer Task
```
Title: Designer Task - Define Brand Color Palette
Labels: 👨‍🎨 designer, 🎨 design, 🎨 design-tokens, 🔴 critical, 📍 phase-0, 📋 todo
```

### Example 2: Component Task
```
Title: Button Component
Labels: 👨‍💻 developer, 💻 code, 🧩 component, simple, 🟠 high-priority, 📍 phase-2a, 📋 todo
```

### Example 3: Infrastructure Task
```
Title: Setup Style Dictionary Pipeline
Labels: 👨‍💻 developer, 💻 code, 🔧 infrastructure, 🟠 high-priority, 📍 phase-1, 📋 todo
```

### Example 4: Figma Task
```
Title: Create Figma Variables Collection
Labels: 👨‍🎨 designer, 🎨 design, 🎨 figma, 🔴 critical, 📍 phase-0, 📋 todo
```

---

## 🔄 Maintaining Labels

### When Creating New Tasks
The export script automatically applies labels based on:
- Task title keywords
- Task number ranges
- Assigned person
- Priority and phase

### Manual Label Adjustments
You can manually add/remove labels in GitHub for:
- Special cases
- Multi-role tasks
- Custom categorization

### Updating Labels in Bulk
Re-run the export script and workflow to update all labels:
```bash
node tools/scripts/export-tasks-to-github-csv.js
# Then run GitHub Action
```

---

## ✨ Benefits of This System

1. **Easy Filtering** - Find exactly what you need quickly
2. **Visual Organization** - Emojis make labels scannable
3. **Multi-Dimensional** - Filter by role, type, domain, priority, phase
4. **Consistent** - Automated application ensures consistency
5. **Scalable** - Works for 57 tasks or 570 tasks
6. **Team-Friendly** - Designers and developers can filter their work

---

**Need to update labels?** Edit `tools/scripts/export-tasks-to-github-csv.js` and regenerate!

