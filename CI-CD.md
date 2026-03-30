# CI/CD Pipeline Documentation

This document explains the automated CI/CD pipeline for the DSAi Design System.

## Overview

The CI/CD pipeline automates:

- **Code Quality**: Linting and type checking
- **Build Verification**: Building all packages
- **Testing**: Running unit and integration tests
- **Compatibility**: Testing across multiple Node.js versions
- **Dependencies**: Automated dependency updates via Dependabot

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers**:

- Push to `main` or `develop` branch
- Pull requests targeting `main` or `develop`

**Jobs**:

#### Lint & Type Check (Fast Fail)

Runs first to catch syntax and type errors quickly.

```yaml
- Checkout code with full history (for Nx affected)
- Install pnpm and Node.js 22
- Install dependencies
- Run `pnpm lint` (all packages)
- Run type-check (all packages)
```

**Duration**: ~2-3 minutes

#### Build Packages

Builds all packages after lint/type-check passes.

```yaml
- Checkout code
- Install dependencies
- Build all packages
- Upload build artifacts for debugging
```

**Duration**: ~2-3 minutes

#### Test

Runs tests on all packages (continues on error until tests implemented).

```yaml
- Checkout code
- Install dependencies
- Run tests with coverage
```

**Duration**: ~2-3 minutes

#### Node.js Compatibility

Builds run on Node.js 22 (LTS required for Style Dictionary v5).

```yaml
- Build all packages on Node 22
```

**Duration**: ~2-3 minutes per version (parallel)

#### CI Success

Final gate that checks all jobs passed.

**Total Pipeline Duration**: ~5-7 minutes

### 2. Publish Workflow (`.github/workflows/publish.yml`)

**Status**: Placeholder (not yet implemented)

**Future Purpose**: Automated npm publishing on release

**Planned Features**:

- Version bumping (semver)
- Build verification before publish
- Publish to npm registry
- Create Git tags
- Generate GitHub releases with changelog

**Trigger**: Manual workflow dispatch or release tags

### 3. Token Sync Workflow (`.github/workflows/token-sync.yml`)

**Status**: Placeholder (not yet implemented)

**Future Purpose**: Sync design tokens from Figma

**Planned Features**:

- Fetch tokens from Figma API
- Transform to TypeScript format
- Build updated packages
- Create PR with changes
- Visual diff preview

**Trigger**: Manual dispatch or nightly schedule

### 4. Dependabot (`.github/dependabot.yml`)

**Configuration**:

- Weekly updates on Mondays at 3 AM UTC
- Groups minor/patch updates together
- Separate updates for production vs development dependencies
- Monitors GitHub Actions versions

**Labels**: `dependencies`, `automated`

## Performance Optimizations

### Nx Affected Commands

Only processes packages affected by changes:

```bash
nx affected --target=lint     # Only lint changed packages
nx affected --target=build    # Only build changed + dependents
```

**Benefits**:

- 50-90% faster CI for most PRs
- Only runs relevant checks
- Automatic dependency graph analysis

### Caching Strategy

#### pnpm Cache

```yaml
uses: actions/setup-node@v4
with:
  cache: 'pnpm'
```

Caches `node_modules` between runs (5-10x faster installs).

#### Nx Cache

Nx automatically caches build outputs locally. For distributed caching across CI and developers, connect to Nx Cloud:

```bash
npx nx connect-to-nx-cloud
```

**Expected speedup**: 10-20x for unchanged packages

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Cancels outdated workflow runs when new commits pushed.

## Required GitHub Secrets

### Current (None required for basic CI)

The CI workflow runs without secrets.

### Future Requirements

#### For Publishing (`publish.yml`)

- `NPM_TOKEN`: npm authentication token
  - Create at: <https://www.npmjs.com/settings/tokens>
  - Type: Automation token
  - Scope: Read and write

#### For Figma Sync (`token-sync.yml`)

- `FIGMA_ACCESS_TOKEN`: Figma API personal access token
  - Create at: <https://www.figma.com/developers/api#access-tokens>
  - Scope: Read-only file access

### Setting Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add name and value
4. Click "Add secret"

## Running Workflows Locally

### Using `act`

Install [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
pnpm add -g act

# Run CI workflow
act pull_request

# Run specific job
act -j lint-and-typecheck

# With secrets
act --secret-file .secrets
```

### Manual Testing

Run the same commands CI uses:

```bash
# Lint
pnpm nx affected --target=lint --parallel=3

# Type check
pnpm nx affected --target=type-check --parallel=3

# Build
pnpm nx affected --target=build --parallel=3

# Test
pnpm nx affected --target=test --parallel=3 --ci --coverage
```

## Troubleshooting

### "No tasks were run" (Nx affected)

**Cause**: No files changed that affect any projects.

**Solution**: Use `--all` instead of `affected` for testing:

```bash
pnpm nx run-many --target=build --all
```

### Cache issues

**Symptom**: Builds not reflecting recent changes.

**Solution**: Clear Nx cache:

```bash
pnpm nx reset
```

### Workflow not triggering

**Check**:

1. Branch name matches trigger (e.g., `main` not `master`)
2. Workflow file is in `.github/workflows/`
3. YAML syntax is valid

### Build failures

#### Lint errors

```bash
# Fix locally first
pnpm run lint --fix
```

#### Type errors

```bash
# Check types locally
pnpm nx affected --target=type-check
```

#### Out of memory

Add to workflow:

```yaml
env:
  NODE_OPTIONS: '--max-old-space-size=4096'
```

### Dependabot PR failures

**Common causes**:

1. Breaking changes in dependencies
2. Peer dependency conflicts
3. Type definition mismatches

**Resolution**:

1. Check Dependabot PR description for changelog
2. Review breaking changes
3. Update code if needed
4. Merge related dependency updates together

## Best Practices

### For Contributors

1. **Run checks locally before pushing**:

   ```bash
   pnpm run lint
   pnpm run type-check
   pnpm run build
   ```

2. **Keep PRs focused**: Smaller PRs = faster CI

3. **Watch CI status**: Don't merge failing PRs

4. **Review Dependabot PRs**: Don't auto-merge without checking

### For Maintainers

1. **Monitor workflow execution times**: Keep under 5 minutes

2. **Review failed runs**: Investigate patterns

3. **Update actions regularly**: Dependabot handles this

4. **Optimize caching**: Connect Nx Cloud for distributed caching

5. **Document changes**: Update this file when adding workflows

## Metrics

### Current Targets

- **Pipeline duration**: < 5 minutes
- **Success rate**: > 95%
- **Cache hit rate**: > 80% (with Nx Cloud)

### Monitoring

Track these metrics:

1. Average workflow duration
2. Failure rate by job
3. Cache effectiveness
4. Time to feedback (commit to result)

## Support

**Issues with CI/CD**:

1. Check this documentation first
2. Review recent workflow runs
3. Check GitHub Actions status page
4. Open issue with workflow run link

**Questions**:

- Create discussion in GitHub Discussions
- Tag with `ci-cd` label
