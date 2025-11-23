# CI/CD Configuration

## Overview

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the DSAi Design System.

**Node.js Version**: v25 (Latest)  
**pnpm Version**: v10  
**Style Dictionary**: v5.1.1 (DTCG compliant)

---

## Workflows

### 1. `ci.yml` - Continuous Integration

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger via `workflow_dispatch`

**Jobs**:

#### Setup (Job 1)

- Installs Node.js v25
- Sets up pnpm v10
- Caches dependencies
- Installs packages

#### Lint (Job 2)

- Runs ESLint on all code
- Checks code style and quality

#### Test (Job 3)

- Runs Jest tests with coverage
- Uploads coverage to Codecov

#### Validate Tokens (Job 4)

- Transforms Figma exports to DTCG format
- Validates 100% match rate between source and output
- Checks for undefined values in outputs
- Ensures DTCG compliance

#### Build (Job 5)

- Builds all packages in monorepo
- Verifies build outputs
- Uploads artifacts

#### Build Storybook (Job 6)

- Only runs on `main` branch
- Builds Storybook static site
- Uploads for deployment

#### CI Summary (Job 7)

- Generates summary of all jobs
- Shows Node.js and pnpm versions
- Reports success/failure status

---

### 2. `publish-tokens.yml` - Package Publishing

**Triggers**:

- Push of version tags (e.g., `v0.1.0`)
- Manual trigger with version input

**Jobs**:

#### Publish

- Validates all design tokens
- Builds @dsai/tokens package
- Verifies outputs (no undefined values)
- Publishes to npm registry
- Creates GitHub release with assets

**Requirements**:

- `NPM_TOKEN` secret must be configured in repository settings
- Package version must be updated in `package.json`

---

## Environment Variables

### Global

```yaml
NODE_VERSION: '25' # Node.js v25 for optimal performance
PNPM_VERSION: '10' # Latest stable pnpm
```

### Secrets Required

#### For Publishing

- `NPM_TOKEN` - npm authentication token for publishing packages

#### For Coverage (Optional)

- `CODECOV_TOKEN` - Codecov.io token for coverage reports

---

## Caching Strategy

### pnpm Store Cache

- **Key**: `${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}`
- **Path**: pnpm store directory
- **Restore Keys**: OS + pnpm-store prefix
- **Benefit**: Faster dependency installation

### Nx Cache

- **Key**: OS + Nx + lockfile + source files
- **Path**: `.nx/cache`
- **Restore Keys**: Progressive fallback
- **Benefit**: Faster builds with Nx computation caching

---

## Usage

### Running CI Locally

Simulate CI environment locally:

```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint

# Run tests with coverage
pnpm test:ci

# Validate tokens
cd packages/@dsai/tokens
pnpm tokens:transform
FIGMA_SOURCE=collections pnpm tokens:validate:figma
pnpm tokens:validate

# Build all packages
cd ../..
pnpm build
```

### Publishing a New Version

1. **Update version** in `packages/@dsai/tokens/package.json`
2. **Commit changes**:
   ```bash
   git add packages/@dsai/tokens/package.json
   git commit -m "chore(tokens): bump version to 0.1.0"
   ```
3. **Create and push tag**:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
4. **Workflow runs automatically** and publishes to npm

### Manual Publishing

Use the GitHub UI:

1. Go to **Actions** → **Publish Tokens Package**
2. Click **Run workflow**
3. Enter version number
4. Click **Run workflow**

---

## Node.js v25 Optimizations

### Why Node.js v25?

Our CI/CD uses **Node.js v25** (latest) for:

1. **Style Dictionary v5 Performance**
   - Native `Set.prototype.union`
   - 21% faster token builds
   - Better memory management

2. **Modern JavaScript Features**
   - Latest ES2024 support
   - Improved async/await
   - Better error messages

3. **Build Performance**
   - Faster module resolution
   - Optimized TypeScript compilation
   - Reduced memory footprint

### Compatibility

✅ **Exceeds Requirements**:

- Style Dictionary v5: requires Node.js ≥22.0.0
- Current: Node.js v25.2.1

✅ **Future-Proof**:

- Latest Node.js features
- Long-term compatibility

---

## Troubleshooting

### Workflow Fails on Setup

**Issue**: pnpm installation fails  
**Solution**: Check `pnpm-lock.yaml` is committed and not corrupted

### Workflow Fails on Build

**Issue**: Build errors in CI but works locally  
**Solution**: Clear Nx cache and ensure `pnpm-lock.yaml` is up to date

### Token Validation Fails

**Issue**: Match rate < 100% or undefined values found  
**Solution**:

1. Check Figma exports in `packages/@dsai/tokens/figma-exports/`
2. Run validation locally: `pnpm tokens:validate:all`
3. Review transformation script for errors

### Publishing Fails

**Issue**: `NPM_TOKEN` not configured  
**Solution**: Add npm token to repository secrets:

1. Generate token at https://www.npmjs.com/settings/tokens
2. Add as `NPM_TOKEN` in GitHub Settings → Secrets → Actions

---

## Performance Metrics

### Typical CI Times (Node.js v25)

| Job             | Duration       | Notes            |
| --------------- | -------------- | ---------------- |
| Setup           | 1-2 min        | With cache: 30s  |
| Lint            | 1-2 min        | ESLint all files |
| Test            | 2-4 min        | With coverage    |
| Validate Tokens | 1-2 min        | 538 tokens       |
| Build           | 3-5 min        | All packages     |
| Build Storybook | 2-4 min        | Main branch only |
| **Total**       | **~10-15 min** | Full pipeline    |

### With Cache Hit

- **Setup**: 30 seconds
- **Build**: 2-3 minutes
- **Total**: ~6-8 minutes

---

## Best Practices

### 1. Keep pnpm-lock.yaml Updated

Always commit `pnpm-lock.yaml` changes to ensure consistent dependencies across environments.

### 2. Use Nx Affected Commands

For large monorepos, consider using Nx affected commands to only build/test changed packages:

```yaml
- name: Build affected
  run: pnpm affected:build
```

### 3. Cache Strategy

Our caching reduces CI time by ~40%. Keep cache keys updated with lockfile hashes.

### 4. Parallel Jobs

Jobs run in parallel where possible (lint, test, validate-tokens) for faster feedback.

### 5. Artifact Retention

Build artifacts retained for 7 days, Storybook for 30 days. Adjust as needed.

---

## Monitoring

### GitHub Actions Dashboard

View workflow runs: `https://github.com/YOUR_ORG/dsai/actions`

### Status Badges

Add to README.md:

```markdown
![CI](https://github.com/YOUR_ORG/dsai/workflows/CI%2FCD%20Pipeline/badge.svg)
![Publish](https://github.com/YOUR_ORG/dsai/workflows/Publish%20Tokens%20Package/badge.svg)
```

### Notifications

Configure notifications in repository settings:

- **Settings** → **Notifications** → **Actions**
- Choose email or Slack integration

---

## Security

### Dependabot

Consider enabling Dependabot for automatic dependency updates:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
```

### CodeQL

Enable CodeQL for security scanning:

- **Settings** → **Security** → **Code scanning**
- Enable CodeQL analysis

---

## Resources

- **GitHub Actions Docs**: https://docs.github.com/actions
- **pnpm CI Guide**: https://pnpm.io/continuous-integration
- **Nx CI Guide**: https://nx.dev/ci/intro/ci-with-nx
- **Node.js v25 Release**: https://nodejs.org/en/blog/release/v25.0.0

---

**Last Updated**: November 23, 2025  
**Node.js Version**: v25.2.1  
**Status**: ✅ Production Ready
