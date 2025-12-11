# Task Template

**Task ID:** TASK-058
**Title:** Playground App Vite 7 Setup
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 3-4 hours
**Created:** 2025-12-03
**Updated:** 2025-12-03

---

## 📋 Task Description

### Goal

Bootstrap the `apps/playground` application with a full Vite 7 + SWC configuration, creating a standalone development environment for testing design system components outside of Storybook.

### Problem/Issue

The current playground app is a stub with placeholder scripts:

- No Vite configuration (`vite.config.ts` missing)
- Placeholder `echo` commands in `project.json` instead of actual build/dev targets
- No `index.html` entry point
- No React app structure for component testing

### Expected Outcome

- Fully functional Vite 7 dev server with SWC for fast HMR
- React 19 application structure with `@dsai/react` and `@dsai/tokens` integration
- Consistent security and optimization patterns from shared Vite config
- Nx-integrated Vite executors for `dev`, `build`, and `preview` targets

---

## 🎯 Acceptance Criteria

- [ ] `vite.config.ts` created with SWC plugin and shared security config
- [ ] `index.html` entry point with proper React 19 root mounting
- [ ] `src/main.tsx` application entry with React 19 `createRoot`
- [ ] `src/App.tsx` demo component showcasing `@dsai/react` and `@dsai/tokens`
- [ ] `project.json` updated with `@nx/vite:dev-server` and `@nx/vite:build` executors
- [ ] Path aliases configured matching Storybook setup
- [ ] `server.warmup` configured for workspace package files
- [ ] Security config imported from `config/vite.shared.ts`
- [ ] `nx run playground:dev` starts dev server successfully
- [ ] `nx run playground:build` produces production build
- [ ] HMR works on component changes
- [ ] Design tokens display correctly

---

## 📂 Files to Modify

- `apps/playground/vite.config.ts` - Create Vite configuration (new file)
- `apps/playground/index.html` - Create HTML entry point (new file)
- `apps/playground/src/main.tsx` - Create React entry point (new file)
- `apps/playground/src/App.tsx` - Create demo application (new file)
- `apps/playground/src/App.css` - Create basic styles (new file)
- `apps/playground/project.json` - Update with Vite executors
- `apps/playground/package.json` - Add Vite dependencies
- `apps/playground/tsconfig.json` - Update for Vite compatibility

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-057: Storybook Vite Optimization (provides shared config at `config/vite.shared.ts`)
- [ ] `@nx/vite` plugin installed in workspace

### Blocks

- None (end-user development tool)

---

## 🧪 Testing Requirements

- [ ] `nx run playground:dev` starts without errors
- [ ] Dev server accessible at `http://localhost:5173`
- [ ] HMR works on `App.tsx` changes
- [ ] `@dsai/react` components render correctly
- [ ] `@dsai/tokens` CSS variables apply correctly
- [ ] `nx run playground:build` produces optimized bundle
- [ ] `nx run playground:preview` serves production build
- [ ] Nx cache correctly stores/restores build artifacts

---

## 📖 Documentation Requirements

- [ ] Inline comments in `vite.config.ts` explaining configuration
- [ ] JSDoc on demo components
- [ ] Update `apps/playground/README.md` with usage instructions

---

## 🔄 Implementation Steps

### Phase 1: Project Configuration

1. [ ] Add Vite dependencies to `apps/playground/package.json`:
   - `vite` (workspace version)
   - `@vitejs/plugin-react-swc`
2. [ ] Run `pnpm install`
3. [ ] Update `apps/playground/tsconfig.json` for Vite compatibility

### Phase 2: Vite Configuration

4. [ ] Create `apps/playground/vite.config.ts`:
   - Import shared config from `config/vite.shared.ts`
   - Configure SWC plugin with `@vitejs/plugin-react-swc`
   - Set up path aliases for `@dsai/react` and `@dsai/tokens`
   - Configure `server.warmup` for workspace files
   - Apply security defaults from shared config

### Phase 3: Application Structure

5. [ ] Create `apps/playground/index.html` with React 19 root
6. [ ] Create `apps/playground/src/main.tsx` with `createRoot`
7. [ ] Create `apps/playground/src/App.tsx` demo component
8. [ ] Create `apps/playground/src/App.css` with token-based styles
9. [ ] Remove placeholder `apps/playground/src/index.ts`

### Phase 4: Nx Integration

10. [ ] Update `apps/playground/project.json`:
    - Replace placeholder targets with `@nx/vite` executors
    - Configure cache inputs/outputs
    - Add proper dependency configuration

### Phase 5: Verification

11. [ ] Run `nx run playground:dev` and verify startup
12. [ ] Test HMR with component changes
13. [ ] Run `nx run playground:build` and verify output
14. [ ] Run Codacy analysis on new files

---

## 📝 Notes

### Shared Config Import

The playground should import security and optimization defaults from `config/vite.shared.ts` created in TASK-057. This ensures consistency across Storybook and Playground while allowing app-specific overrides.

### Path Alias Strategy

Match Storybook's path aliases for consistency:

```typescript
resolve: {
  alias: {
    '@dsai/tokens': resolve(__dirname, '../../packages/@dsai/tokens/src'),
    '@dsai/react': resolve(__dirname, '../../packages/@dsai/react/src'),
  },
}
```

### React 19 Compatibility

Use the new `createRoot` API from `react-dom/client`:

```typescript
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')!).render(<App />);
```

### Nx Vite Plugin

Requires `@nx/vite` installed in the workspace. If not present, add to root `package.json` devDependencies.

---

## ✅ Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Tests passing (dev server starts, build succeeds)
- [ ] Codacy analysis passes on new files
- [ ] Documentation updated
- [ ] Playground usable for component development/testing

---

## 📎 Configuration Examples

### vite.config.ts

```typescript
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// Import shared security config from TASK-057
// import { securityDefaults, warmupPatterns } from '../../config/vite.shared';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      devTarget: 'es2020',
    }),
  ],
  resolve: {
    alias: {
      '@dsai/tokens': resolve(__dirname, '../../packages/@dsai/tokens/src'),
      '@dsai/react': resolve(__dirname, '../../packages/@dsai/react/src'),
    },
  },
  server: {
    port: 5173,
    warmup: {
      clientFiles: [
        '../../packages/@dsai/react/src/**/*.tsx',
        '../../packages/@dsai/tokens/src/**/*.ts',
      ],
    },
    allowedHosts: ['localhost', '127.0.0.1'],
    fs: {
      deny: ['.env', '.env.*', '*.pem', '*.crt', '**/.git/**'],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
    license: true,
  },
});
```

### project.json (Nx Vite Executors)

```json
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "name": "playground",
  "sourceRoot": "apps/playground/src",
  "projectType": "application",
  "targets": {
    "dev": {
      "executor": "@nx/vite:dev-server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "playground:build"
      },
      "configurations": {
        "development": {
          "buildTarget": "playground:build:development"
        },
        "production": {
          "buildTarget": "playground:build:production"
        }
      }
    },
    "build": {
      "executor": "@nx/vite:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/apps/playground"
      },
      "configurations": {
        "development": {
          "mode": "development"
        },
        "production": {
          "mode": "production"
        }
      }
    },
    "preview": {
      "executor": "@nx/vite:preview-server",
      "options": {
        "buildTarget": "playground:build"
      }
    }
  },
  "tags": ["type:application", "scope:playground"]
}
```

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DSAi Playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### src/main.tsx

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```
