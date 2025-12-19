# TASK-017: GitHub Actions Token Sync

**Task ID:** TASK-017
**Title:** GitHub Actions Token Sync
**Priority:** Medium
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Create a GitHub Actions workflow that automatically syncs design tokens from Figma to the codebase, builds the tokens with Style Dictionary, and publishes them to npm. This automation ensures tokens stay in sync between design and code, reducing manual work and errors.

---

## Acceptance Criteria

### GitHub Actions Workflow

- [ ] Workflow file created: `.github/workflows/token-sync.yml`
- [ ] Workflow triggered on:
  - Manual dispatch (on-demand sync)
  - Schedule (daily at 2 AM UTC)
  - Webhook from Figma (future enhancement)
- [ ] Workflow runs on `ubuntu-latest`

### Token Export from Figma

- [ ] Figma API integration configured
- [ ] Figma personal access token stored in GitHub Secrets
- [ ] Script exports Figma Variables to JSON
- [ ] Exported JSON matches token structure from TASK-011

### Token Build

- [ ] Style Dictionary build runs in workflow
- [ ] All output formats generated (CSS, JS, TS, SCSS, JSON)
- [ ] Build artifacts validated (no errors)
- [ ] Generated files committed to git (optional) or published directly

### Change Detection

- [ ] Workflow detects if tokens changed
- [ ] If no changes, workflow exits early
- [ ] If changes detected, creates PR or commits directly
- [ ] Commit message includes change summary

### Notifications

- [ ] Slack/Discord notification on token changes (optional)
- [ ] GitHub issue created for manual review (optional)
- [ ] PR review requested from design team

### Documentation

- [ ] Workflow README with setup instructions
- [ ] How to manually trigger sync
- [ ] How to configure Figma API token
- [ ] Troubleshooting guide

---

## Dependencies

### Requires

- **TASK-004**: CI/CD Pipeline Skeleton (GitHub Actions basics)
- **TASK-010**: Figma Variables Collection (Figma structure)
- **TASK-011**: Design JSON Token Structure (target format)
- **TASK-012**: Setup Style Dictionary Pipeline (build process)

### Enhances

- **TASK-018**: Populate Figma Variables (ensures sync works)

---

## Implementation Steps

### Step 1: Create Figma Export Script (2 hours)

```javascript
// scripts/export-figma-tokens.js
const fetch = require('node-fetch');
const fs = require('fs');

const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

async function exportTokens() {
  // Fetch Figma file variables
  const response = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
    {
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN
      }
    }
  );
  
  const data = await response.json();
  
  // Transform Figma variables to token JSON
  const tokens = transformFigmaToTokens(data);
  
  // Write to JSON files
  fs.writeFileSync('tokens/color/primitive.json', JSON.stringify(tokens.color, null, 2));
  // ... write other categories
}

function transformFigmaToTokens(figmaData) {
  // Transform Figma variable format to Style Dictionary format
}

exportTokens();
```

### Step 2: Create GitHub Actions Workflow (2 hours)

```yaml
# .github/workflows/token-sync.yml
name: Sync Design Tokens from Figma

on:
  workflow_dispatch: # Manual trigger
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Export tokens from Figma
        env:
          FIGMA_API_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: node scripts/export-figma-tokens.js
      
      - name: Build tokens with Style Dictionary
        run: pnpm --filter @yourorg/tokens build
      
      - name: Check for changes
        id: changes
        run: |
          if git diff --quiet; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi
      
      - name: Create Pull Request
        if: steps.changes.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore(tokens): sync design tokens from Figma'
          title: 'Design Tokens Update'
          body: |
            ## Design Tokens Synchronized
            
            This PR updates design tokens from Figma.
            
            **Changes:**
            - Color tokens
            - Typography tokens
            - Spacing tokens
            
            Please review and merge if all looks good.
          branch: 'token-sync'
          labels: tokens, automated
```

### Step 3: Configure Secrets (0.5 hours)

1. Get Figma Personal Access Token:
   - Go to Figma Account Settings
   - Generate new token
2. Add to GitHub Secrets:
   - `FIGMA_API_TOKEN`
   - `FIGMA_FILE_KEY` (from Figma file URL)
3. Test secrets are accessible in workflow

### Step 4: Add Change Detection (1 hour)

1. Improve change detection to show what changed:

```bash
git diff --name-only tokens/
```

1. Generate change summary for PR body
2. Add validation before creating PR

### Step 5: Test Workflow (0.5 hours)

1. Manually trigger workflow
2. Verify Figma export works
3. Verify Style Dictionary build works
4. Verify PR is created
5. Fix any issues

### Step 6: Documentation (0.5 hours)

Create `.github/workflows/README.md`:

```markdown
# Token Sync Workflow

## Setup
1. Create Figma Personal Access Token
2. Add secrets to GitHub:
   - FIGMA_API_TOKEN
   - FIGMA_FILE_KEY
3. Workflow runs automatically daily

## Manual Trigger
1. Go to Actions tab
2. Select "Sync Design Tokens from Figma"
3. Click "Run workflow"

## Troubleshooting
- Check Figma API token is valid
- Verify Figma file key is correct
- Review workflow logs for errors
```

---

## Definition of Done

- [ ] GitHub Actions workflow created and functional
- [ ] Figma export script works correctly
- [ ] Tokens export from Figma to JSON
- [ ] Style Dictionary build runs successfully
- [ ] Change detection works (skips if no changes)
- [ ] PR created automatically when tokens change
- [ ] Workflow can be manually triggered
- [ ] Scheduled sync runs daily
- [ ] GitHub Secrets configured (FIGMA_API_TOKEN, FIGMA_FILE_KEY)
- [ ] Documentation complete (setup, usage, troubleshooting)
- [ ] Workflow tested and approved by team

---

## Notes

### Figma API

- Rate limit: 1000 requests per hour
- Personal tokens for server-side access
- Variables API endpoint: `/v1/files/{file_key}/variables/local`

### Automation Benefits

- Design-code sync stays up-to-date
- Reduces manual token copying
- Catches token changes immediately
- Automates repetitive work

### Alternative Approaches

- Use Figma Tokens plugin (manual export)
- Use figma-api npm package
- Use Figma webhooks (requires server)

---

## Related Tasks

- **TASK-004**: CI/CD Pipeline Skeleton
- **TASK-010**: Figma Variables Collection
- **TASK-011**: Design JSON Token Structure
- **TASK-012**: Setup Style Dictionary Pipeline
- **TASK-018**: Populate Figma Variables

---

**Estimated Effort:** 6 hours
