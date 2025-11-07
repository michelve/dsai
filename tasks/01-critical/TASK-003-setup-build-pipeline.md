# Task Template

**Task ID:** TASK-003
**Title:** Set up Rollup/tsup Build Pipeline
**Priority:** Critical
**Status:** ⚪ Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 0 - Foundation (Week 1-4)
**Created:** 2025-11-07
**Updated:** 2025-11-07

---

## 📋 Task Description

### Goal

Configure an optimized build pipeline using Rollup or tsup to bundle the React component library for multiple module formats (ESM, CJS) with TypeScript declaration files, proper tree-shaking, and minimal bundle size.

### Problem/Issue

The component library needs:

- Multiple output formats for different consumers
- TypeScript declaration files (.d.ts) for type safety
- Tree-shaking support for optimal bundle sizes
- CSS bundling and extraction
- Source maps for debugging
- Optimized production builds

### Expected Outcome

A configured build system that produces optimized, tree-shakeable bundles with TypeScript types, supporting both ESM and CommonJS consumers.

---

## 🎯 Acceptance Criteria

- [ ] Build tool selected (Rollup or tsup) and configured
- [ ] Outputs ESM format (module field in package.json)
- [ ] Outputs CJS format (main field in package.json)
- [ ] TypeScript declaration files generated
- [ ] CSS Modules processed and bundled
- [ ] Source maps generated for debugging
- [ ] Tree-shaking verified to work
- [ ] Bundle size tracked and optimized (< 50KB gzipped target)
- [ ] Build scripts in package.json
- [ ] Watch mode for development
- [ ] Production optimization enabled

---

## 📂 Files to Create/Modify

- `packages/@yourorg/react/rollup.config.js` OR `packages/@yourorg/react/tsup.config.ts`
- `packages/@yourorg/react/package.json` - Add build scripts and entry points
- `.npmignore` or `files` field in package.json
- `tools/bundle-analyzer/` - Optional bundle size analysis

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-001: Nx monorepo structure
- [x] TASK-002: TypeScript configuration

### Blocks

- All component development tasks (need build system)
- TASK-013: Configure Storybook (needs component builds)
- Publishing to npm (needs proper build artifacts)

---

## 🧪 Testing Requirements

- [ ] Build completes without errors: `pnpm build`
- [ ] Output files generated in `dist/` directory
- [ ] TypeScript types can be imported by consumers
- [ ] ESM imports work: `import { Button } from '@yourorg/react'`
- [ ] CJS imports work: `const { Button } = require('@yourorg/react')`
- [ ] Tree-shaking verified: importing one component doesn't bundle all
- [ ] Source maps work in browser DevTools
- [ ] CSS is properly bundled/extracted
- [ ] Bundle size is acceptable (< 50KB gzipped for all components)

---

## 📖 Documentation Requirements

- [ ] Document build process and configuration choices
- [ ] Explain module formats (ESM vs CJS)
- [ ] Bundle size optimization strategies
- [ ] How to analyze bundle size
- [ ] Troubleshooting build errors

---

## 🔄 Implementation Steps

### Option A: Using tsup (Simpler, Faster - RECOMMENDED)

1. [ ] Install tsup and dependencies
   ```bash
   cd packages/@yourorg/react
   pnpm add -D tsup @types/react @types/react-dom
   pnpm add -D postcss autoprefixer
   ```

2. [ ] Create `tsup.config.ts`
   ```typescript
   import { defineConfig } from 'tsup';

   export default defineConfig({
     entry: ['src/index.ts'],
     format: ['esm', 'cjs'],
     dts: true,
     sourcemap: true,
     clean: true,
     minify: true,
     external: ['react', 'react-dom'],
     injectStyle: true,
     tsconfig: './tsconfig.json',
   });
   ```

3. [ ] Update package.json
   ```json
   {
     "main": "./dist/index.js",
     "module": "./dist/index.mjs",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "import": "./dist/index.mjs",
         "require": "./dist/index.js",
         "types": "./dist/index.d.ts"
       },
       "./styles.css": "./dist/index.css"
     },
     "files": ["dist"],
     "scripts": {
       "build": "tsup",
       "build:watch": "tsup --watch",
       "build:analyze": "tsup --metafile"
     }
   }
   ```

### Option B: Using Rollup (More Control)

4. [ ] Install Rollup and plugins (if choosing Rollup)
   ```bash
   cd packages/@yourorg/react
   pnpm add -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve
   pnpm add -D @rollup/plugin-commonjs rollup-plugin-postcss
   pnpm add -D rollup-plugin-peer-deps-external rollup-plugin-terser
   ```

5. [ ] Create `rollup.config.js` (if choosing Rollup)

6. [ ] Configure CSS Modules processing

7. [ ] Add bundle size analysis tool
   ```bash
   pnpm add -D rollup-plugin-visualizer
   ```

8. [ ] Test build outputs

9. [ ] Verify tree-shaking works

10. [ ] Optimize production build

11. [ ] Document build process

---

## 📝 Notes

**Build Tool Decision:**

**tsup (RECOMMENDED):**
- Pros: Simpler config, faster builds, good defaults, esbuild-based
- Cons: Less customization options
- Best for: Our use case (component library)

**Rollup:**
- Pros: More control, better tree-shaking, plugin ecosystem
- Cons: More complex configuration
- Best for: Complex build requirements

**Key Configuration Choices:**

**External Dependencies:**
- React and React-DOM should be peer dependencies (not bundled)
- Reduces bundle size significantly

**Module Formats:**
- ESM (modern): For modern bundlers (Vite, Webpack 5+)
- CJS (legacy): For older Node.js environments

**CSS Handling:**
- Inject styles: CSS bundled with components
- Extract styles: Separate CSS file (more flexible)
- Recommend: Extract for better caching

**Tree-Shaking:**
- Use named exports, not default exports
- Side-effect free code (declare in package.json)
- Proper module format (ESM)

**Bundle Size Targets (from Roadmap):**
- All components: < 50KB gzipped
- Individual component: 1-3KB gzipped
- Track with bundlephobia or size-limit

**Estimated Effort:** 6 hours
- Tool selection and research: 1 hour
- Configuration: 2 hours
- Testing and optimization: 2 hours
- Documentation: 1 hour

---

## ✅ Definition of Done

- [ ] All acceptance criteria met
- [ ] Build produces correct output formats
- [ ] TypeScript types work for consumers
- [ ] Tree-shaking verified
- [ ] Bundle size meets target
- [ ] Build scripts documented
- [ ] CI/CD can run builds
- [ ] Team understands build process

