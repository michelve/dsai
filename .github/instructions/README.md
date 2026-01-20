# Instructions System

**Directory:** `.github/instructions/`  
**Purpose:** Configure AI agent behavior with project-specific rules and guidelines  
**Last Updated:** January 19, 2026

---

## Overview

The Instructions System allows you to configure how AI agents (GitHub Copilot, Claude, etc.) behave when working with your codebase. Unlike Skills (which teach specific workflows), Instructions provide **rules, constraints, and behaviors** that agents must follow.

### Instructions vs Skills

| Feature | Instructions | Skills |
|---------|-------------|--------|
| **Purpose** | Define rules & behaviors | Teach workflows & capabilities |
| **Activation** | Always active (or pattern-matched) | Loaded on-demand when relevant |
| **Content** | Rules, constraints, requirements | Procedures, examples, templates |
| **Use Case** | "Always do X when Y happens" | "How to accomplish task Z" |
| **Location** | `.github/instructions/` | `.github/skills/` |

---

## File Format

Instructions files use Markdown with YAML frontmatter:

```markdown
---
description: Brief description of what this instruction configures
applyTo: '**'  # Glob pattern for when to apply (optional)
---

# Instruction Title

Detailed rules, constraints, and behaviors...
```

### Frontmatter Fields

#### `description` (Required)

A brief summary of what this instruction file configures.

```yaml
description: Configuration for AI behavior when interacting with Codacy's MCP Server
```

#### `applyTo` (Optional)

A glob pattern specifying which files this instruction applies to. Omit for global rules.

```yaml
# Apply to all files
applyTo: '**'

# Apply only to React components
applyTo: 'src/components/**/*.tsx'

# Apply to test files
applyTo: '**/*.test.ts'

# Multiple patterns (future support)
applyTo: 
  - 'src/**/*.ts'
  - 'packages/**/*.ts'
```

---

## Instruction Categories

### 1. Tool Configuration

Configure how agents interact with external tools and services.

**Example:** [codacy.instructions.md](codacy.instructions.md)

```markdown
---
description: Configuration for AI behavior when interacting with Codacy's MCP Server
applyTo: '**'
---

# Codacy Rules

## CRITICAL: After ANY successful edit
- YOU MUST IMMEDIATELY run the `codacy_cli_analyze` tool
- If any issues are found, propose and apply fixes
```

**Use Cases:**

- MCP server integration rules
- External API interaction guidelines
- Third-party service configuration
- Tool-specific behaviors

### 2. Code Quality Standards

Define coding standards, linting rules, and quality requirements.

**Example:** `code-quality.instructions.md`

```markdown
---
description: Code quality standards and automated checks
applyTo: 'src/**/*.{ts,tsx}'
---

# Code Quality Requirements

## After Any Code Change
- Run TypeScript type checking
- Run ESLint with auto-fix
- Verify no console.log statements in production code
- Check test coverage remains above 80%
```

### 3. Security Requirements

Enforce security practices and vulnerability checks.

**Example:** `security.instructions.md`

```markdown
---
description: Security requirements and vulnerability scanning
applyTo: '**'
---

# Security Requirements

## CRITICAL: After Adding Dependencies
- Run security audit (npm audit, Trivy, etc.)
- Check for known vulnerabilities
- Verify licenses are compatible
- Fail if critical/high vulnerabilities found
```

### 4. Testing Requirements

Define testing standards and coverage requirements.

**Example:** `testing.instructions.md`

```markdown
---
description: Testing requirements and coverage standards
applyTo: 'src/**/*.{ts,tsx}'
---

# Testing Requirements

## Before Completing Any Task
- Write tests for new functionality
- Maintain 90%+ coverage for DSAi components
- Include unit tests, integration tests, and a11y tests
- Run test suite and verify all pass
```

### 5. Documentation Standards

Enforce documentation requirements.

**Example:** `documentation.instructions.md`

```markdown
---
description: Documentation requirements for components and APIs
applyTo: 'packages/@dsai-io/**/*.{ts,tsx}'
---

# Documentation Standards

## Public APIs
- Add JSDoc comments with @param, @returns, @example
- Include Storybook stories for UI components
- Update README when adding new features
```

---

## Creating Instructions

### Step 1: Identify the Behavior

Ask yourself:

- What should the agent **always do**?
- What should the agent **never do**?
- What should happen **when X occurs**?
- What **constraints** should apply?

### Step 2: Choose Scope

Determine if the instruction should apply:

- **Globally** (`applyTo: '**'`)
- **To specific files** (`applyTo: 'src/components/**/*.tsx'`)
- **To specific tasks** (described in content)

### Step 3: Write Clear Rules

Use imperative language and be explicit:

✅ **Good:**

```markdown
## CRITICAL: After editing files
- YOU MUST run the linter immediately
- If issues are found, apply fixes automatically
```

❌ **Bad:**

```markdown
## File editing
- Maybe run the linter if you want
- Consider fixing issues
```

### Step 4: Organize by Priority

Structure content with clear headings:

1. **CRITICAL** - Must always follow (use sparingly)
2. **Important** - Should follow in most cases
3. **Guidelines** - Best practices
4. **Examples** - Usage patterns

### Step 5: Test Thoroughly

Verify the instruction works:

1. Create test scenarios
2. Observe agent behavior
3. Refine rules as needed
4. Document edge cases

---

## Best Practices

### ✅ Do

- **Be explicit and specific** - "Run TypeScript compiler" not "check types"
- **Use action verbs** - MUST, SHOULD, NEVER, ALWAYS
- **Provide examples** - Show expected behavior
- **Define priorities** - Mark critical rules clearly
- **Include error handling** - What to do when things fail
- **Test edge cases** - Consider unusual scenarios
- **Keep instructions focused** - One concern per file
- **Update regularly** - Keep in sync with project evolution

### ❌ Don't

- **Be vague** - Avoid "try to" or "might want to"
- **Overuse CRITICAL** - Reserve for truly critical rules
- **Create conflicting rules** - Ensure instructions don't contradict
- **Write novels** - Keep instructions concise
- **Assume context** - Be explicit about when rules apply
- **Ignore tool limitations** - Understand what agents can/can't do
- **Forget maintenance** - Review instructions periodically

---

## Common Patterns

### Pattern: Post-Edit Checks

Run validations after editing files:

```markdown
## After ANY successful edit
1. YOU MUST run linter on edited file
2. If issues found, apply fixes
3. Verify no new errors introduced
4. Re-run if fixes were applied
```

### Pattern: Pre-Commit Validation

Ensure code meets standards before committing:

```markdown
## Before Completing Task
- All tests pass
- No linting errors
- Coverage threshold met
- Documentation updated
```

### Pattern: Dependency Management

Control how dependencies are added:

```markdown
## CRITICAL: After Adding Dependencies
1. Run security audit
2. Check bundle size impact
3. Verify license compatibility
4. Update dependency documentation
```

### Pattern: Tool Integration

Configure external tool usage:

```markdown
## Using Tool X
- ALWAYS use parameter Y with value Z
- Avoid calling tool when condition A
- If tool fails, fallback to method B
```

### Pattern: Conditional Behavior

Apply rules based on context:

```markdown
## When editing React components
- Ensure WCAG 2.1 AA accessibility
- Add Storybook story
- Write component tests

## When editing utilities
- Add JSDoc documentation
- Include unit tests
- Export from index.ts
```

---

## Example: Complete Instruction File

```markdown
---
description: TypeScript and ESLint configuration for code quality
applyTo: 'src/**/*.{ts,tsx}'
---

# Code Quality Standards

Configuration for maintaining code quality in TypeScript files.

## CRITICAL: After ANY Code Edit

- YOU MUST run TypeScript compiler on edited file:
  ```bash
  npx tsc --noEmit <file>
  ```

- If type errors found:
  - Fix errors immediately
  - Re-run type checker
  - Do not proceed until errors resolved

## After Editing Source Files

- Run ESLint with auto-fix:

  ```bash
  npx eslint --fix <file>
  ```

- If unfixable errors remain:
  - Review error messages
  - Apply manual fixes
  - Re-run ESLint

## Code Style Requirements

- Use TypeScript strict mode
- No `any` types without justification
- Prefer `const` over `let`
- Use functional components for React
- Maximum function complexity: 10
- Maximum file length: 400 lines

## Before Completing Task

Verify:

- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All tests passing
- [ ] No `console.log` in production code
- [ ] Imports organized (absolute before relative)

## Error Handling

If tools are unavailable:

1. Inform user of the issue
2. Suggest manual verification
3. Continue with task (don't block)

## Examples

### Good Code Pattern

```typescript
// ✅ Type-safe, documented, tested
export interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

export const Button = ({ variant, onClick }: ButtonProps): JSX.Element => {
  return <button onClick={onClick}>{variant}</button>;
};
```

### Bad Code Pattern

```typescript
// ❌ Using any, no types, unclear
export const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.variant}</button>;
};
```

```

---

## Managing Instructions

### Adding New Instructions

1. Create new `.instructions.md` file in `.github/instructions/`
2. Add YAML frontmatter with description and applyTo
3. Write clear, actionable rules
4. Test with real scenarios
5. Document in this README
6. Commit with descriptive message

### Updating Existing Instructions

1. Review current behavior
2. Identify needed changes
3. Update instruction content
4. Test updated behavior
5. Update last-modified date
6. Commit with changelog

### Removing Obsolete Instructions

1. Mark as deprecated first
2. Monitor for issues
3. After safe period, delete file
4. Update references
5. Document removal reason

---

## Troubleshooting

### Instructions Not Being Followed

**Check:**
- Is the `applyTo` pattern matching correctly?
- Are there conflicting instructions?
- Is the language clear and imperative?
- Are required tools available?

**Solutions:**
- Use more specific glob patterns
- Resolve conflicts between instructions
- Rewrite with clearer language
- Add tool availability checks

### Instructions Too Restrictive

**Symptoms:**
- Agent gets stuck or blocked frequently
- Tasks take significantly longer
- User has to override behavior often

**Solutions:**
- Use SHOULD instead of MUST for non-critical rules
- Add exception handling
- Make rules more specific (narrower scope)
- Consider moving to guidelines instead

### Instructions Ignored

**Possible Causes:**
- Token limit exceeded (instructions truncated)
- Conflicting system prompts
- Agent prioritizing other instructions
- Syntax errors in frontmatter

**Solutions:**
- Keep instructions concise
- Use higher priority markers (CRITICAL)
- Review other instruction files
- Validate YAML syntax

---

## Integration with Other Systems

### With Skills

Instructions and Skills work together:

```

User Request: "Create a new React component"
    ↓

1. Agent loads component-development skill (teaches HOW)
2. Agent loads accessibility instructions (enforces RULES)
3. Agent loads testing instructions (requires TESTS)
    ↓
Result: Accessible, tested component following all rules

```

### With CI/CD

Instructions can mirror CI/CD checks:

```markdown
## CRITICAL: Same as CI Pipeline
- Run: pnpm lint
- Run: pnpm test
- Run: pnpm type-check

This ensures local changes match CI requirements.
```

### With Git Hooks

Instructions can enforce pre-commit standards:

```markdown
## Before Marking Task Complete
These match pre-commit hooks:
- [ ] Lint passes (matches lint-staged)
- [ ] Tests pass (matches pre-push)
- [ ] Types valid (matches pre-commit)
```

---

## Examples Library

See actual instruction files in this directory:

- [`codacy.instructions.md`](codacy.instructions.md) - Codacy MCP Server integration
- (Add more as created)

---

## Resources

### Related Documentation

- [Skills Documentation](../skills/create-skill/SKILL.md) - Creating Agent Skills
- [AGENTS.md](../../AGENTS.md) - Agent configuration and guidelines
- [Custom Instructions](../prompts/) - Project-wide agent prompts

### External Resources

- [GitHub Copilot Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview)
- [YAML Frontmatter Specification](https://yaml.org/spec/1.2.2/)

---

## Contributing

To contribute instructions:

1. **Review existing instructions** - Avoid duplication
2. **Follow the template** - Use consistent format
3. **Test thoroughly** - Verify behavior
4. **Document clearly** - Future you will thank you
5. **Get feedback** - Have others review
6. **Iterate** - Refine based on usage

---

## Questions

- **Need a rule enforced?** → Create an instruction
- **Need a workflow taught?** → Create a skill
- **Need coding standards?** → Create an instruction (or use linter config)
- **Need task automation?** → Create a skill with scripts

Still unsure? Check the decision tree in [Skills vs Instructions](../skills/create-skill/SKILL.md#instructions-vs-skills).

---

**Maintained by:** DSAi Team  
**Last Review:** January 19, 2026  
**Next Review:** March 19, 2026
