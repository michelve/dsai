# Vibe Coding Quality Workflow

> Mitigating dev debt introduced by vibe coding through automated SonarQube quality gates and AI-assisted fix loops.

## The Problem

Vibe coding, whether from Figma-to-code, AI agents, or browser-based visual editors - ships features fast but introduces code quality issues and technical debt. This workflow catches and fixes those issues before they reach `main`.

## The Workflow
<!-- [MermaidChart: 5e823f5c-e033-4434-8f11-10dc44074df7] -->

```mermaid
flowchart TB
    %% ===== ENTRY: TICKET SOURCE =====
    JIRA["Jira Ticket\n(Story / Bug / Task)"]
    AI_READ["AI Agent Reads Ticket\n- Summary & acceptance criteria\n- Linked designs Figma URL\n- Priority & sprint context"]
    
    JIRA --> AI_READ

    %% ===== VIBE CODING SOURCES =====
    subgraph VIBE_SOURCES["Vibe Coding Sources"]
        direction LR
        FIGMA["Figma to Code\nfigma-implement-design\nDesign token integration"]
        CODE_VIBE["Pure Code Vibe\nAI agent writes code\nfrom ticket context"]
        VYBIT["Browser Fine-Tune\nVybit visual editor\ngithub.com/bitovi/vybit"]
    end

    AI_READ --> VIBE_SOURCES

    %% ===== TWO PATHS =====
    subgraph PATHS["Development Paths"]
        direction TB
        
        subgraph HUMAN_PATH["Human-in-the-Loop - Recommended"]
            direction TB
            H1["Developer or Designer\nworks with AI assistance"]
            H2["Reviews AI suggestions\nGuides direction & decisions"]
            H3["Iterates on implementation\nTests in browser"]
            H1 --> H2 --> H3
        end
        
        subgraph AUTO_PATH["Fully Autonomous Agent"]
            direction TB
            A1["AI Agent takes ticket\nPlans implementation"]
            A2["Writes code autonomously\nRuns lint & tests"]
            A3["Self-reviews against\nacceptance criteria"]
            A1 --> A2 --> A3
        end
    end

    FIGMA --> HUMAN_PATH
    CODE_VIBE --> HUMAN_PATH
    VYBIT --> HUMAN_PATH
    FIGMA --> AUTO_PATH
    CODE_VIBE --> AUTO_PATH

    %% ===== QUALITY GATE =====
    SCAN_TRIGGER{{"Trigger SonarQube Scan\nHey scan my latest changes"}}
    
    HUMAN_PATH --> SCAN_TRIGGER
    AUTO_PATH --> SCAN_TRIGGER

    subgraph SONAR_SCAN["SonarQube Analysis"]
        direction TB
        
        subgraph SCAN_METHODS["Scan Methods"]
            direction LR
            CLI["CLI Scanner\npnpm sonar:local"]
            MCP["MCP Tools\nsearch_sonar_issues\nanalyze_code_snippet"]
            SONARLINT["SonarLint IDE\nReal-time in VS Code"]
            PR_ANALYSIS["PR Analysis\nAutomatic on PR creation"]
        end
        
        SCAN_RUN["Scan Running\nAnalyzing changed files"]
        SCAN_RESULTS["Results Returned\n- Bugs & vulnerabilities\n- Code smells\n- Security hotspots\n- Coverage gaps\n- Duplications"]
        
        SCAN_METHODS --> SCAN_RUN --> SCAN_RESULTS
    end

    SCAN_TRIGGER --> SONAR_SCAN

    %% ===== FIX LOOP =====
    ISSUES_CHECK{"Issues Found?"}
    SCAN_RESULTS --> ISSUES_CHECK

    subgraph FIX_LOOP["AI Fix Loop"]
        direction TB
        PICK["Agent picks up issues\nGrouped by file"]
        FIX["Applies fixes using\ndsai-sonar skill rules"]
        VERIFY["Runs lint & tests\nVerifies no regressions"]
        PICK --> FIX --> VERIFY
    end

    ISSUES_CHECK -- "Yes" --> FIX_LOOP
    FIX_LOOP --> SCAN_TRIGGER
    
    %% ===== CLEAN EXIT =====
    CLEAN["Clean Scan\n0 new issues"]
    ISSUES_CHECK -- "No" --> CLEAN

    COMMIT["Commit Changes"]
    PR_CREATE["Create Pull Request"]
    
    CLEAN --> COMMIT --> PR_CREATE

    %% ===== OTHER WORKFLOW =====
    subgraph OTHER_WORKFLOW["Downstream Workflow - CI/CD & Review"]
        direction LR
        CI["GitHub Actions CI\nLint - Test - Build"]
        SONAR_PR["SonarQube\nPR Quality Gate"]
        REVIEW["Human Review\n& Approval"]
        MERGE["Merge to Main"]
        DEPLOY["Deploy"]
        CI --> SONAR_PR --> REVIEW --> MERGE --> DEPLOY
    end

    PR_CREATE --> OTHER_WORKFLOW

    %% ===== STYLING =====
    classDef recommended fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#000
    classDef autonomous fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#000
    classDef sonar fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    classDef fixloop fill:#fce4ec,stroke:#e91e63,stroke-width:2px,color:#000
    classDef clean fill:#c8e6c9,stroke:#4caf50,stroke-width:3px,color:#000
    classDef downstream fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000
    classDef vibe fill:#fff8e1,stroke:#ff8f00,stroke-width:2px,color:#000

    class HUMAN_PATH recommended
    class AUTO_PATH autonomous
    class SONAR_SCAN sonar
    class FIX_LOOP fixloop
    class CLEAN clean
    class OTHER_WORKFLOW downstream
    class VIBE_SOURCES vibe
```

## Key Concepts

### Vibe Coding Sources

| Source            | Description                                                                                         | Quality Risk                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Figma to Code** | AI translates Figma designs to React components using `figma-implement-design`                      | Accessibility gaps, non-semantic HTML, missing keyboard nav           |
| **Pure Code Vibe** | AI agent writes code from ticket context (Claude Code, Copilot, etc.)                              | High complexity, magic numbers, deprecated APIs, bracket notation     |
| **Vybit Browser** | Visual fine-tuning in the browser ([GitHub.com/bitovi/vybit](https://github.com/bitovi/vybit))      | Inline styles, hardcoded values, missing design tokens                |

### Two Development Paths

**Human-in-the-Loop (Recommended)**

- Developer/designer drives, AI assists
- Human reviews suggestions, guides decisions
- Best for: complex features, accessibility-critical UI, architectural decisions

**Fully Autonomous Agent**

- AI takes ticket end-to-end
- Self-plans, implements, tests, and reviews
- Best for: repetitive fixes, bulk refactors, test coverage gaps

### SonarQube Scan Methods

| Method             | When                     | How                                                                    |
| ------------------ | ------------------------ | ---------------------------------------------------------------------- |
| **CLI Scanner**    | On demand, pre-commit    | `pnpm sonar:local`                                                    |
| **SonarQube MCP**  | During AI fix loop       | `search_sonar_issues`, `analyze_code_snippet`, `get_component_measures` |
| **SonarLint IDE**  | Real-time while coding   | VS Code extension with connected mode                                  |
| **PR Analysis**    | Automatic on PR          | GitHub Actions triggers scan, decorates PR                             |

### The Fix Loop

The core innovation: instead of shipping debt and fixing later, the AI agent **iterates until clean**:

1. **Scan** - SonarQube analyzes changed files
2. **Triage** - Agent groups issues by file, prioritizes by severity
3. **Fix** - Agent applies fixes using the `dsai-sonar` skill (project-specific rules)
4. **Verify** - Lint + tests confirm no regressions
5. **Re-scan** - Loop back until zero new issues
6. **Ship** - Clean commit, PR, downstream workflow

### How SonarQube Prevents Vibe-Coded Debt from Breaking Code

Vibe-coded output (Figma-to-code, autonomous agents, browser editors) ships features fast but tends to produce high-complexity functions, accessibility gaps, security anti-patterns (bracket notation, unsanitized input), magic numbers, and duplicated strings. Three layers of protection catch these issues before they reach `main`:

**Layer 1: Prevention — `dsai-sonar` Skill**

The `dsai-sonar` skill teaches the AI agent 100+ SonarQube rules *before* it writes code. It covers complexity limits (max 10 cyclomatic, 15 cognitive), security rules (no bracket notation, no prototype pollution), accessibility (semantic HTML, ARIA correctness), React anti-patterns, and testing standards. The agent avoids generating violations in the first place because the rules are loaded into its context at code-writing time.

**Layer 2: Detection & Fix — SonarQube MCP Tools (In-Loop)**

During the fix loop, the agent queries SonarQube directly through MCP tools without leaving the conversation:

| MCP Tool | Purpose |
| --- | --- |
| `search_sonar_issues_in_projects` | Find all new issues on changed files with line numbers and severity |
| `analyze_code_snippet` | Check a code snippet against SonarQube rules *before* committing |
| `get_component_measures` | Query coverage, duplications, complexity metrics per file |
| `get_project_quality_gate_status` | Verify the project would pass the quality gate right now |
| `search_security_hotspots` | Surface security-sensitive code that needs review |

This creates a tight feedback loop: write code, scan, fix, re-scan — all within a single AI session. The agent fixes its own issues rather than shipping them as tech debt.

**Layer 3: Enforcement — PR Quality Gate**

Even after the local fix loop, the PR triggers an automatic SonarQube analysis in CI. This is the hard gate — if new issues slip through, the PR is blocked from merge. This catches anything the local scan missed (e.g., cross-file issues, coverage regressions on the full branch diff).

**Why all three layers matter:**

| Layer | Without It |
| --- | --- |
| Prevention (skill) | Agent generates 10x more issues, fix loop takes longer |
| Detection (MCP) | Issues only surface after PR is pushed — slower feedback, context-switching |
| Enforcement (PR gate) | Local fixes can be skipped or incomplete — broken code reaches `main` |

### Downstream Workflow

Once code passes the quality gate:

1. **GitHub Actions CI** - Lint, test, build across all packages
2. **SonarQube PR Gate** - Final quality gate on the PR branch
3. **Human Review** - Team review and approval
4. **Merge, Deploy**
