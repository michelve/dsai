# Coverage Setup for Codacy

This document explains how code coverage is configured and uploaded to Codacy for the DSAi project.

## Overview

We use Jest with LCOV format to generate coverage reports, which are then uploaded to Codacy for tracking and visualization.

## Prerequisites

1. **Codacy Project Token**: Get your token from [Codacy Settings](https://app.codacy.com/gh/michelve/dsai/settings/coverage)
2. **Local `.env` file**: Copy `.env.example` to `.env` and add your token

## Local Coverage

### Generate Coverage Report

```bash
# Run tests with coverage
pnpm test

# Or explicitly with coverage flag
pnpm test:coverage
```

This generates:

- `coverage/lcov.info` - LCOV format for Codacy
- `coverage/index.html` - HTML report for local viewing
- `coverage/coverage-summary.json` - Summary metrics

### View Coverage Locally

```bash
open coverage/index.html
```

### Upload Coverage to Codacy

```bash
# Requires CODACY_PROJECT_TOKEN in .env file
pnpm coverage:upload
```

## CI/CD Integration

Coverage is automatically uploaded on every push to `main` or `dev` branches via GitHub Actions.

### GitHub Actions Workflow

File: `.github/workflows/coverage.yml`

**Triggers:**

- Push to `main` or `dev`
- Pull requests targeting `main` or `dev`

**Steps:**

1. Checkout code with full history
2. Setup Node.js 22 + pnpm 10
3. Install dependencies
4. Run `pnpm test:ci` (coverage with CI optimizations)
5. Upload coverage to Codacy (pushes only)
6. Archive coverage artifacts (30 days retention)

### GitHub Secrets

Add your Codacy project token as a repository secret:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Name: `CODACY_PROJECT_TOKEN`
4. Value: Your Codacy project token
5. Click `Add secret`

## Coverage Thresholds

Minimum coverage requirements (configured in `jest.preset.cjs`):

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

Tests will fail locally if coverage drops below 80% in any category.

## Coverage Formats

We use multiple reporters for different purposes:

- **`lcov`**: For Codacy upload
- **`text`**: Console summary after test run
- **`html`**: Interactive HTML report for local viewing
- **`json-summary`**: Machine-readable summary

## Troubleshooting

### Coverage Not Uploading

**Check the upload command output:**

```bash
pnpm coverage:upload
```

**Common issues:**

- Missing `CODACY_PROJECT_TOKEN` in `.env`
- Wrong commit SHA (should auto-detect via git)
- Network issues with Codacy API
- Coverage file path incorrect

### Viewing Upload Logs

1. Go to [Codacy Repository Settings → Coverage](https://app.codacy.com/gh/michelve/dsai/settings/coverage)
2. Click "Test integration"
3. View the 50 most recent uploads with status

### Missing Coverage for Files

**Cause**: Files not included in coverage collection patterns.

**Fix**: Check `collectCoverageFrom` in `jest.preset.cjs`:

```javascript
collectCoverageFrom: [
  'packages/**/src/**/*.{ts,tsx}',
  '!packages/**/src/**/*.d.ts',
  '!packages/**/src/**/*.stories.{ts,tsx}',
  '!packages/**/src/**/__tests__/**',
  '!packages/**/src/**/index.ts',
],
```

### Coverage Shows "Pending" on Codacy

**Possible reasons:**

1. File paths don't match repository structure
2. Coverage uploaded for ignored files
3. Wrong language association

**Solution**: Ensure coverage report uses paths relative to repository root (e.g., `packages/@dsai/react/src/Button.tsx`)

### Pull Request Not Showing Coverage Diff

**Requirements:**

- Coverage uploaded for HEAD commit of PR branch
- Coverage uploaded for common ancestor commit with target branch

**Check**: View logs on Codacy PR page to see which commits are missing coverage.

## Advanced Usage

### Upload Coverage for Specific Commit

```bash
export CODACY_PROJECT_TOKEN=your_token
bash <(curl -Ls https://coverage.codacy.com/get.sh) report \
  -r coverage/lcov.info \
  --commit-uuid <commit-sha>
```

### Partial Coverage (Monorepo)

If running tests in parallel or per package:

```bash
# Upload each package's coverage as partial
bash <(curl -Ls https://coverage.codacy.com/get.sh) report \
  -r packages/@dsai/react/coverage/lcov.info \
  --partial

bash <(curl -Ls https://coverage.codacy.com/get.sh) report \
  -r packages/@dsai/tokens/coverage/lcov.info \
  --partial

# Send final notification
bash <(curl -Ls https://coverage.codacy.com/get.sh) final
```

## Resources

- [Codacy Coverage Reporter Docs](https://docs.codacy.com/coverage-reporter/)
- [Jest Coverage Docs](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [LCOV Format Spec](http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php)

## See Also

- [TESTING.md](../TESTING.md) - Testing best practices
- [CI-CD.md](../CI-CD.md) - CI/CD pipeline documentation
