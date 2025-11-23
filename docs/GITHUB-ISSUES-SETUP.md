# GitHub Issues Bulk Creator Setup Guide

This guide shows you how to automatically create GitHub Issues from your DSAi task files using the [bulk-issue-creator](https://github.com/benbalter/bulk-issue-creator) GitHub Action.

---

## 🎯 What This Does

Automatically converts all your markdown task files (58 tasks) into GitHub Issues with:

- ✅ Proper titles and labels
- ✅ Priority assignments
- ✅ Milestone grouping (Phase 0, Phase 1, etc.)
- ✅ Estimate tracking
- ✅ Links back to original task files

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Update Repository Name

Edit `tools/scripts/export-tasks-to-github-csv.js` (line 24):

```javascript
repository: 'michelve/dsai', // ⬅️ Change this to YOUR_USERNAME/YOUR_REPO
```

Change to your actual GitHub repository (e.g., `michelve/dsai`).

### Step 2: Update GitHub Username for Assignees

Edit the same file (lines 56-60):

```javascript
if (assignee.includes('Developer')) {
  task.assignees = 'michelve'; // ⬅️ Change to your GitHub username
}
```

### Step 3: Generate the CSV

Run the export script to create the CSV file:

```bash
node tools/scripts/export-tasks-to-github-csv.js
```

This creates `config/data.csv` with all your tasks.

### Step 4: Commit and Push

```bash
git add .github/workflows/bulk-issue-creator.yml
git add config/data.csv
git add config/template.md.mustache
git add tools/scripts/export-tasks-to-github-csv.js
git commit -m "Add bulk issue creator workflow"
git push
```

### Step 5: Run the Workflow

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **"Bulk Issue Creator"** in the left sidebar
4. Click **"Run workflow"** button (top right)
5. Leave "false" selected to **PREVIEW** first
6. Click **"Run workflow"**

You'll see a preview of all issues that will be created. If it looks good:

7. Run workflow again with **"true"** to actually create the issues!

---

## 📊 What Gets Created

### Issues Overview (53 issues)

Your 58 tasks will become GitHub Issues (excluding 5 completed tasks):

| Phase                            | Issues    | Priority          |
| -------------------------------- | --------- | ----------------- |
| **Phase 0: Foundation**          | 5 issues  | Critical → Urgent |
| **Phase 1: Tokens**              | 10 issues | High              |
| **Phase 2A: Simple Components**  | 7 issues  | High              |
| **Phase 2B: Medium Components**  | 9 issues  | High              |
| **Phase 2C: Complex Components** | 9 issues  | High              |
| **Phase 3: Figma Integration**   | 5 issues  | Medium            |
| **Phase 4: Polish & Release**    | 6 issues  | High              |

### Labels Automatically Added

Each issue gets appropriate labels:

- `critical` - Critical priority tasks
- `phase-0`, `phase-1`, etc. - Phase grouping
- `high-priority`, `medium-priority` - Priority levels
- `component` - Component building tasks (TASK-021 to TASK-045)
- `design-tokens` - Token-related tasks
- `designer` - Designer-specific tasks

### Milestones

Issues are grouped into milestones:

- Phase 0
- Phase 1
- Phase 2A
- Phase 2B
- Phase 2C
- Phase 3
- Phase 4

---

## 📝 CSV Format

The generated `config/data.csv` looks like this:

```csv
repository,title,labels,assignees,milestone,task_id,priority,estimate,phase
michelve/dsai,"Designer Task - Define Brand Color Palette","critical,phase-0,designer,design-tokens",,"Phase 0",TASK-007,Critical,12 hours,"Phase 0 - Foundation (Week 1-4)"
michelve/dsai,"Design JSON Token Structure","high-priority,design-tokens",michelve,"Phase 1",TASK-011,High,8 hours,"Phase 1 - Token System"
```

### Columns Explained:

- **repository** - Your GitHub repo (owner/repo)
- **title** - Issue title from task
- **labels** - Comma-separated labels
- **assignees** - GitHub username(s) to assign
- **milestone** - Milestone name (Phase 0, Phase 1, etc.)
- **task_id** - Original task ID (TASK-XXX)
- **priority** - Priority level
- **estimate** - Time estimate
- **phase** - Full phase description

---

## 🎨 Template Customization

The issue body template is at `config/template.md.mustache`.

### Available Variables:

You can use these in your template:

- `{{task_id}}` - Task ID (TASK-007)
- `{{title}}` - Task title
- `{{priority}}` - Priority level
- `{{estimate}}` - Time estimate
- `{{phase}}` - Phase description
- `{{milestone}}` - Milestone name
- Any other column from your CSV!

### Example Template:

```markdown
## 🎯 Task: {{task_id}}

**Priority:** {{priority}}
**Estimate:** {{estimate}}

This is part of {{phase}}.

[View full task specification](link-to-task-file)
```

---

## 🔧 Advanced Configuration

### Exclude Certain Tasks

Edit `tools/scripts/export-tasks-to-github-csv.js` (line 137):

```javascript
// Filter out completed tasks and Phase 4 (example)
const tasks = allTasks.filter(
  (task) => !task.labels.includes('completed') && !task.milestone.includes('Phase 4')
);
```

### Import Only Specific Phase

```javascript
// Only Phase 0 tasks
const tasks = allTasks.filter((task) => task.milestone === 'Phase 0');
```

### Change Repository Per Task

In the CSV, you can have different repositories per row:

```csv
repository,title,labels
owner/repo1,Task 1,critical
owner/repo2,Task 2,high-priority
```

### Add More Custom Fields

1. Add column to CSV generation script
2. Reference in template with `{{your_field}}`

---

## 🔍 Preview Before Creating

**ALWAYS preview first!**

The workflow defaults to `write: false` which shows you what will be created without actually creating anything.

### To Preview:

1. Run workflow with "false" (default)
2. Go to Actions → Bulk Issue Creator → Latest run
3. Expand "Create bulk issues" step
4. Review the output

You'll see something like:

```
Would create issue in michelve/dsai:
  Title: Designer Task - Define Brand Color Palette
  Labels: critical, phase-0, designer
  Milestone: Phase 0
  Assignee: (none)

Would create issue in michelve/dsai:
  Title: Design JSON Token Structure
  Labels: high-priority, design-tokens
  Milestone: Phase 1
  Assignee: michelve
```

### To Actually Create Issues:

1. Run workflow again
2. Change "false" to **"true"**
3. Click "Run workflow"
4. Issues will be created! 🎉

---

## ✅ Verification Checklist

After running with `write: true`, verify:

- [ ] Check Issues tab - Should see 53 new issues
- [ ] Filter by milestone "Phase 0" - Should see 5 issues
- [ ] Filter by label "critical" - Should see critical tasks
- [ ] Filter by label "component" - Should see component tasks
- [ ] Click on an issue - Should have proper body from template
- [ ] Check assignees - Developer tasks assigned to you

---

## 🔄 Updating Issues

If you modify task files and want to update issues:

### Option 1: Close Old, Create New

1. Close all existing issues
2. Run the workflow again

### Option 2: Manual Updates

- Update issues manually in GitHub
- Or use GitHub CLI: `gh issue edit`

### Option 3: Comments Instead of Issues

The bulk-issue-creator can also add comments to existing issues.

Edit the workflow to add:

```yaml
- name: Create bulk issues
  uses: benbalter/bulk-issue-creator@v2
  with:
    write: ${{ github.event.inputs.write }}
    github_token: ${{ secrets.GITHUB_TOKEN }}
    comment: true # ⬅️ Add this to post comments instead
```

Then add an `issue_number` column to your CSV.

---

## 🚨 Troubleshooting

### Issue: "Resource not accessible by integration"

**Solution:** The workflow needs write permissions.

Add to workflow file (after `jobs:`):

```yaml
permissions:
  issues: write
```

### Issue: "Repository not found"

**Solution:** Check the repository name in the CSV matches your actual repo.

Format: `username/repository` (all lowercase)

### Issue: "Milestone not found"

**Solution:** Milestones must be created manually first in GitHub:

1. Go to Issues → Milestones
2. Create: "Phase 0", "Phase 1", etc.
3. Run workflow again

Or remove the milestone column from CSV.

### Issue: "Invalid label"

**Solution:** Labels are auto-created by GitHub, but if you see errors:

1. Go to Issues → Labels
2. Manually create any missing labels
3. Run workflow again

### Issue: "CSV format error"

**Solution:**

1. Open `config/data.csv` in Excel/Google Sheets
2. Check for special characters or broken quotes
3. Re-run: `node tools/scripts/export-tasks-to-github-csv.js`

---

## 📊 Workflow Diagram

```
┌─────────────────────────────────┐
│  Your Markdown Task Files       │
│  (tasks/*.md)                   │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Export Script                  │
│  export-tasks-to-github-csv.js  │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  CSV File                       │
│  config/data.csv                │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  GitHub Actions Workflow        │
│  .github/workflows/*.yml        │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  bulk-issue-creator Action      │
│  (benbalter/bulk-issue-creator) │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  GitHub Issues Created! 🎉      │
│  (53 issues with labels,        │
│   milestones, assignments)      │
└─────────────────────────────────┘
```

---

## 🎯 Pro Tips

### 1. Create Milestones First

Before running the workflow, create milestones in GitHub:

```bash
gh milestone create "Phase 0"
gh milestone create "Phase 1"
gh milestone create "Phase 2A"
gh milestone create "Phase 2B"
gh milestone create "Phase 2C"
gh milestone create "Phase 3"
gh milestone create "Phase 4"
```

Or do it via GitHub UI: Issues → Milestones → New milestone

### 2. Use Project Boards

After creating issues, add them to a project board:

1. Create project board (Projects tab)
2. Add automation: "Auto-add to project"
3. All new issues auto-added to board

### 3. Link to Original Files

The template includes links back to original task files:

```markdown
📄 [View Full Task Specification](link-to-task-file)
```

This keeps the connection between issues and source files.

### 4. Batch Import by Phase

Import one phase at a time:

```javascript
// In export script, filter by phase
const tasks = allTasks.filter((task) => task.milestone === 'Phase 0');
```

Create Phase 0 issues, verify, then do Phase 1, etc.

### 5. Use GitHub CLI

After creating issues, manage with CLI:

```bash
# List all issues
gh issue list

# List by label
gh issue list --label "critical"

# List by milestone
gh issue list --milestone "Phase 0"

# Close completed issues
gh issue close 1 2 3
```

---

## 📚 Additional Resources

- [bulk-issue-creator GitHub](https://github.com/benbalter/bulk-issue-creator)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Mustache Template Syntax](https://mustache.github.io/)
- [GitHub Issues Documentation](https://docs.github.com/en/issues)

---

## 🎉 Expected Result

After successful setup and running the workflow with `write: true`:

✅ **53 GitHub Issues created** with:

- Proper titles from task files
- Labels (critical, high-priority, component, etc.)
- Milestones (Phase 0-4)
- Estimates in issue body
- Assignees (where specified)
- Links to original task specifications
- Organized and ready to work on!

**Time to Setup:** ~10 minutes  
**Time to Create Issues:** ~2 minutes (automated)

---

## 🤔 Linear vs GitHub Issues?

Both work! Here's when to use each:

**Use GitHub Issues if:**

- ✅ Want everything in one place (code + issues)
- ✅ Already use GitHub Projects
- ✅ Free for private repos
- ✅ Simple setup (this guide!)

**Use Linear if:**

- ✅ Want better UI/UX
- ✅ Need advanced project management
- ✅ Want keyboard shortcuts
- ✅ Prefer Linear's workflow

**Why not both?**

- Use GitHub for development tracking
- Use Linear for planning/design work
- Keep them in sync with integrations

---

**Questions?** Check [bulk-issue-creator docs](https://github.com/benbalter/bulk-issue-creator) or review this project's task files for examples.

**Ready to create issues?** Follow the 5 steps above! 🚀
