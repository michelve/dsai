# Task Template

**Task ID:** TASK-057
**Title:** Storybook Vite 7 Enterprise Optimization
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 4-6 hours
**Created:** 2025-12-03
**Updated:** 2025-12-03

---

## 📋 Task Description

### Goal

Optimize Storybook's Vite configuration with enterprise-grade performance, security, and developer experience improvements. Establish shared Vite patterns for reuse across the monorepo.

### Problem/Issue

The current Storybook Vite configuration lacks:

- **Performance**: No SWC integration (20x slower HMR than possible), no `server.warmup` for frequently used files
- **Security**: Missing explicit `server.allowedHosts`, `server.fs.deny`, and `server.cors` configurations (GHSA-vg6x-rcgg-rjx6 advisory)
- **Scalability**: No shared Vite config for monorepo consistency, no Nx cache integration for Vite artifacts
- **Compliance**: No `build.license` configuration for bundled dependency licenses

### Expected Outcome

- 20x faster HMR with SWC compiler via `@vitejs/plugin-react-swc`
- Hardened security configuration preventing DNS rebinding attacks
- Shared Vite config file (`config/vite.shared.ts`) for monorepo consistency
- Nx-integrated caching for Vite artifacts
- Faster cold starts with `server.warmup` pre-transformation

---

## 🎯 Acceptance Criteria

- [ ] `@vitejs/plugin-react-swc` (v4.2.2+) integrated via `viteFinal` in `.storybook/main.ts`
- [ ] `server.warmup` configured for `@dsai/react/src/**/*.tsx` and `@dsai/tokens/src/**/*.ts`
- [ ] `server.allowedHosts` explicitly configured (not `true`)
- [ ] `server.fs.deny` includes `.env`, `.env.*`, `*.pem`, `*.crt`, `**/.git/**`
- [ ] `server.cors` configured with explicit origin list (not `true`)
- [ ] `build.license` set to `true` for OSS compliance
- [ ] `optimizeDeps.include` configured for workspace packages
- [ ] Shared config file created at `config/vite.shared.ts`
- [ ] `project.json` updated with Nx cache outputs for `node_modules/.vite`
- [ ] Storybook starts without errors and HMR works correctly
- [ ] `react-docgen-typescript` continues to function for prop tables
- [ ] All existing stories render correctly

---

## 📂 Files to Modify

- `packages/@dsai/storybook/.storybook/main.ts` - Add SWC plugin, security config, warmup
- `packages/@dsai/storybook/project.json` - Add Nx cache outputs for Vite
- `packages/@dsai/storybook/package.json` - Add `@vitejs/plugin-react-swc` dependency
- `config/vite.shared.ts` - Create shared Vite configuration utilities (new file)

---

## 🔗 Dependencies

### Prerequisites

- [ ] Vite 7.2.6+ installed (already complete from migration)
- [ ] Storybook 10.1.2+ with `@storybook/react-vite` framework

### Blocks

- TASK-058: Playground Vite Setup (uses shared config from this task)

---

## 🧪 Testing Requirements

- [ ] `nx run storybook:storybook` starts without errors
- [ ] HMR works on component file changes (verify faster refresh)
- [ ] All story files render correctly
- [ ] Prop tables display via react-docgen-typescript
- [ ] Security config prevents access to `.env` files via dev server
- [ ] `nx run storybook:build-storybook` succeeds with license file generated
- [ ] Nx cache correctly stores/restores Vite optimization artifacts

---

## 📖 Documentation Requirements

- [ ] Inline code comments explaining security configurations
- [ ] JSDoc on shared config exports
- [ ] Update `BUILD.md` with Vite optimization notes
- [ ] Reference GHSA-vg6x-rcgg-rjx6 in security config comments

---

## 🔄 Implementation Steps

### Phase 1: Add SWC Plugin

1. [ ] Add `@vitejs/plugin-react-swc` to `packages/@dsai/storybook/package.json`
2. [ ] Run `pnpm install` to install the dependency
3. [ ] Import and configure SWC plugin in `.storybook/main.ts` `viteFinal`

### Phase 2: Create Shared Config

4. [ ] Create `config/vite.shared.ts` with:
   - Security defaults (`server.fs.deny`, `server.allowedHosts`, `server.cors`)
   - Common `optimizeDeps.include` patterns for workspace packages
   - Reusable helper functions for path resolution

### Phase 3: Security Hardening

5. [ ] Add `server.fs.deny` patterns in `viteFinal`
6. [ ] Configure explicit `server.allowedHosts` (localhost only for dev)
7. [ ] Set `server.cors` with explicit origin configuration
8. [ ] Verify `server.fs.strict: true` (Vite default since 2.7)

### Phase 4: Performance Optimization

9. [ ] Add `server.warmup.clientFiles` for frequently used component/token files
10. [ ] Configure `optimizeDeps.include` for `@dsai/react`, `@dsai/tokens`
11. [ ] Add `build.license: true` for compliance

### Phase 5: Nx Integration

12. [ ] Update `packages/@dsai/storybook/project.json` with cache outputs:
    - `node_modules/.vite` for dependency optimization cache
    - Existing `dist/storybook` for build output

### Phase 6: Verification

13. [ ] Start Storybook and verify all stories render
14. [ ] Test HMR on component changes
15. [ ] Verify prop tables still work
16. [ ] Test security by attempting to access `.env` via dev server
17. [ ] Run Codacy analysis on modified files

---

## 📝 Notes

### SWC + Storybook Compatibility

Storybook's built-in SWC support is **Webpack-only**. For `@storybook/react-vite`, we use `@vitejs/plugin-react-swc` directly via `viteFinal`. This is fully compatible with `react-docgen-typescript` since docgen runs as a separate TypeScript analyzer, not through the compiler.

### Security Advisory Reference

GHSA-vg6x-rcgg-rjx6 documents DNS rebinding attacks when `server.allowedHosts: true` or `server.cors: true`. Always use explicit host/origin lists in development.

### Future Considerations

- **OXC/Rolldown**: `@vitejs/plugin-react-swc` recommends `@vitejs/plugin-react-oxc` when Rolldown is detected. Document as future upgrade path when Rolldown reaches production stability.
- **LightningCSS**: `build.cssMinify: 'lightningcss'` is faster but still experimental. Evaluate in future optimization pass.

### Package Versions (as of 2025-12-03)

- `@vitejs/plugin-react-swc`: 4.2.2 (3.4M weekly downloads, production-stable)
- `vite`: 7.2.6
- `@storybook/react-vite`: 10.1.2

---

## ✅ Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Tests passing (Storybook starts, stories render, HMR works)
- [ ] Codacy analysis passes on modified files
- [ ] Documentation updated
- [ ] TASK-058 unblocked for Playground setup

---

## 📎 Configuration Examples

### SWC Plugin Integration (viteFinal)

```typescript
import react from '@vitejs/plugin-react-swc';

viteFinal: async (config) => {
  const { mergeConfig } = await import('vite');

  return mergeConfig(config, {
    plugins: [
      react({
        // Automatic JSX runtime (React 17+)
        jsxImportSource: 'react',
        // Match TypeScript ES target
        devTarget: 'es2020',
      }),
    ],
    server: {
      warmup: {
        clientFiles: ['./../../@dsai/react/src/**/*.tsx', './../../@dsai/tokens/src/**/*.ts'],
      },
      allowedHosts: ['localhost', '127.0.0.1'],
      fs: {
        deny: ['.env', '.env.*', '*.pem', '*.crt', '**/.git/**'],
      },
    },
    optimizeDeps: {
      include: ['@dsai/react', '@dsai/tokens'],
    },
    build: {
      license: true,
      chunkSizeWarningLimit: 3000,
    },
  });
};
```

### Nx Cache Configuration (project.json)

```json
{
  "targets": {
    "storybook": {
      "cache": true,
      "inputs": ["^production", "{projectRoot}/.storybook/**/*"],
      "outputs": ["{projectRoot}/node_modules/.vite"]
    },
    "build-storybook": {
      "cache": true,
      "outputs": ["{projectRoot}/dist/storybook", "{projectRoot}/node_modules/.vite"]
    }
  }
}
```
