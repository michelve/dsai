# Quick Start: Create GitHub Issues from Tasks

**Time to complete:** 5 minutes ⏱️

---

## ✨ What You'll Get

**52 GitHub Issues** automatically created from your task files with:
- ✅ Labels (critical, high-priority, component, designer, design-tokens)
- ✅ Milestones (Phase 0, Phase 1, etc.)
- ✅ Assignments (tasks assigned to you)
- ✅ Estimates
- ✅ Proper formatting

---

## 🚀 5-Step Setup

### 1️⃣ Update Your Repository Name

**File:** `tools/scripts/export-tasks-to-github-csv.js`  
**Line:** 24

Change this:
```javascript
repository: 'michelve/dsai', // ⬅️ CHANGE THIS
```

To your repo:
```javascript
repository: 'YOUR_USERNAME/dsai',
```

### 2️⃣ Update Your GitHub Username

**Same file, Line 56:**

Change this:
```javascript
task.assignees = 'michelve'; // ⬅️ CHANGE THIS
```

To your username:
```javascript
task.assignees = 'YOUR_GITHUB_USERNAME';
```

### 3️⃣ Commit and Push

```bash
git add .github/workflows/bulk-issue-creator.yml
git add config/
git add tools/scripts/export-tasks-to-github-csv.js
git commit -m "Setup bulk issue creator"
git push
```

### 4️⃣ Run the GitHub Action (Preview)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **"Bulk Issue Creator"** (left sidebar)
4. Click **"Run workflow"** (green button, top right)
5. Leave as **"false"** (preview mode)
6. Click **"Run workflow"**
7. Click on the workflow run to see preview

### 5️⃣ Create the Issues!

If preview looks good:

1. Run workflow again
2. Change **"false"** to **"true"**
3. Click **"Run workflow"**
4. Wait ~2 minutes
5. Check Issues tab → You'll see 52 new issues! 🎉

---

## 📊 What Gets Created

```
✅ 52 Issues from your tasks/ directory
   
   Phase 0: 5 issues (Critical)
   Phase 1: 10 issues (High)
   Phase 2A: 7 issues (Component development)
   Phase 2B: 9 issues (Component development)
   Phase 2C: 9 issues (Component development)
   Phase 3: 5 issues (Figma integration)
   Phase 4: 6 issues (Polish & release)
   
❌ 5 Completed tasks excluded (TASK-001 to TASK-005)
```

---

## 🎯 Example Issue

**Title:** Designer Task - Define Brand Color Palette (40-60 Colors)

**Labels:** critical, phase-0, designer, design-tokens

**Milestone:** Phase 0

**Body:**
```markdown
## 📋 Task: TASK-007

**Priority:** Critical
**Estimated Time:** 12 hours
**Phase:** Phase 0 - Foundation (Week 1-4)

---

[Full task specification →](link to original file)
```

---

## ⚠️ Important: Preview First!

**Always preview before creating issues!**

The workflow defaults to `write: false` so you can see what will be created.

Only change to `write: true` when you're ready.

---

## 🔧 Common Issues

### "Repository not found"
- Check the repository name in step 1
- Format: `username/repo` (all lowercase)

### "No issues created"
- Check you ran with `write: true`
- Check the Action logs for errors

### "Permission denied"
- The workflow has proper permissions by default
- Uses `GITHUB_TOKEN` automatically

---

## 📚 Need More Details?

See full documentation: [GITHUB-ISSUES-SETUP.md](./GITHUB-ISSUES-SETUP.md)

---

## 🎉 That's It!

After these 5 steps, you'll have all your tasks as GitHub Issues, ready to work on.

**Total time:** ~5 minutes  
**Issues created:** 52  
**Manual work:** 0 (fully automated!)

---

**Ready?** Start with step 1 above! 🚀

