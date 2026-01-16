# CI/CD Integration

Integrate @dsai-io/tools into your continuous integration and deployment pipelines.

## Overview

This guide covers:

- Automated token builds in CI
- Validation and quality gates
- Publishing to package registries
- Integration with popular CI platforms

---

## GitHub Actions

### Basic Build Workflow

```yaml
# .github/workflows/tokens.yml
name: Build Tokens

on:
  push:
    paths:
      - 'tokens/**'
      - 'dsai.config.ts'
  pull_request:
    paths:
      - 'tokens/**'
      - 'dsai.config.ts'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Validate tokens
        run: pnpm dsai tokens validate

      - name: Build tokens
        run: pnpm dsai tokens build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: tokens
          path: dist/tokens/
```

### Multi-Brand Pipeline

```yaml
name: Multi-Brand Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        brand: [brand-a, brand-b, brand-c]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build ${{ matrix.brand }}
        run: pnpm dsai tokens build --brand ${{ matrix.brand }}

      - name: Upload ${{ matrix.brand }} artifacts
        uses: actions/upload-artifact@v4
        with:
          name: tokens-${{ matrix.brand }}
          path: dist/${{ matrix.brand }}/
```

### Publish to npm

```yaml
name: Publish Tokens

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: pnpm install

      - name: Build tokens
        run: pnpm dsai tokens build

      - name: Publish
        run: pnpm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## GitLab CI

### Basic Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - build
  - publish

variables:
  NODE_VERSION: '20'

validate-tokens:
  stage: validate
  image: node:${NODE_VERSION}
  before_script:
    - corepack enable
    - pnpm install
  script:
    - pnpm dsai tokens validate
  rules:
    - changes:
        - tokens/**/*
        - dsai.config.ts

build-tokens:
  stage: build
  image: node:${NODE_VERSION}
  before_script:
    - corepack enable
    - pnpm install
  script:
    - pnpm dsai tokens build
  artifacts:
    paths:
      - dist/tokens/
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

publish-tokens:
  stage: publish
  image: node:${NODE_VERSION}
  before_script:
    - corepack enable
    - pnpm install
    - echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
  script:
    - pnpm dsai tokens build
    - pnpm publish --access public
  rules:
    - if: $CI_COMMIT_TAG
```

---

## Azure Pipelines

```yaml
# azure-pipelines.yml
trigger:
  paths:
    include:
      - tokens/*
      - dsai.config.ts

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: BuildTokens
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '20.x'

          - script: corepack enable && pnpm install
            displayName: 'Install dependencies'

          - script: pnpm dsai tokens validate
            displayName: 'Validate tokens'

          - script: pnpm dsai tokens build
            displayName: 'Build tokens'

          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: 'dist/tokens'
              artifact: 'tokens'
```

---

## Quality Gates

### Token Validation

```yaml
# Add to your CI workflow
- name: Validate token structure
  run: pnpm dsai tokens validate --strict

- name: Check for circular references
  run: pnpm dsai tokens validate --check-refs

- name: Validate naming conventions
  run: pnpm dsai tokens validate --naming-convention kebab-case
```

### Linting

```yaml
- name: Lint token files
  run: |
    pnpm biome check tokens/**/*.json
    pnpm eslint dsai.config.ts
```

### Size Checks

```yaml
- name: Check bundle size
  run: |
    pnpm dsai tokens build
    du -sh dist/tokens/*.css
    # Fail if CSS is too large
    SIZE=$(stat -c%s dist/tokens/tokens.css)
    if [ $SIZE -gt 50000 ]; then
      echo "Token CSS exceeds 50KB limit"
      exit 1
    fi
```

---

## Caching

### Cache Dependencies

```yaml
# GitHub Actions
- name: Cache pnpm store
  uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-

# GitLab CI
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .pnpm-store/
```

### Cache Build Output

```yaml
- name: Cache token build
  uses: actions/cache@v4
  with:
    path: dist/tokens
    key: tokens-${{ hashFiles('tokens/**', 'dsai.config.ts') }}
```

---

## Environment Variables

### Configuration

```yaml
env:
  DSAI_LOG_LEVEL: info
  DSAI_CACHE: true
  DSAI_PARALLEL: true
```

### Secrets

```yaml
# GitHub Actions
env:
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}

# GitLab CI
variables:
  NPM_TOKEN: $NPM_TOKEN
  FIGMA_TOKEN: $FIGMA_TOKEN
```

---

## Notifications

### Slack Notification

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Token build failed: ${{ github.run_url }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### PR Comments

```yaml
- name: Comment on PR
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const stats = JSON.parse(fs.readFileSync('dist/tokens/stats.json'));
      github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: `## Token Build Stats\n- Total tokens: ${stats.total}\n- CSS size: ${stats.cssSize}`
      });
```

---

## Best Practices

1. **Validate First** - Always validate before building
2. **Fail Fast** - Exit immediately on validation errors
3. **Cache Wisely** - Cache dependencies and build artifacts
4. **Parallel Builds** - Use matrix builds for multi-brand
5. **Artifact Retention** - Keep artifacts for debugging
6. **Security** - Never commit tokens/secrets to repo

---

## Troubleshooting

### Common Issues

**Build fails with "Config not found":**

```yaml
- name: Verify config exists
  run: ls -la dsai.config.ts
```

**Memory issues on large token sets:**

```yaml
env:
  NODE_OPTIONS: '--max-old-space-size=4096'
```

**Permission denied:**

```yaml
- name: Fix permissions
  run: chmod +x ./node_modules/.bin/dsai
```

---

## See Also

- [Multi-Brand Architecture](./multi-brand.md)
- [CLI Reference](../cli.md)
- [Troubleshooting](../troubleshooting.md)
