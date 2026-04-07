#!/usr/bin/env node

/**
 * Export DSAi tasks to GitHub Issues CSV format
 *
 * Converts markdown task files to CSV format compatible with
 * benbalter/bulk-issue-creator GitHub Action
 *
 * Usage:
 *   node tools/scripts/github/export-tasks-to-github-csv.cjs
 *
 * Output:
 *   config/data.csv (for bulk-issue-creator)
 */

const fs = require('node:fs');
const path = require('node:path');

/**
 * Extract simple metadata fields from lines
 */
function extractMetadataFields(lines, task) {
  const fieldMap = {
    '**Task ID:**': (val) => { task.taskId = val; },
    '**Title:**': (val) => { task.title = val; },
    '**Priority:**': (val) => { task.priority = val; task.labels.push(val.toLowerCase()); },
    '**Estimated Time:**': (val) => { task.estimate = val; },
    '**Phase:**': (val) => { task.phase = val; task.milestone = val.split(' - ')[0]; },
  };

  for (const line of lines) {
    const trimmed = line.trim();
    for (const [prefix, handler] of Object.entries(fieldMap)) {
      if (trimmed.startsWith(prefix)) {
        handler(trimmed.replaceAll(prefix, '').trim());
      }
    }
    if (trimmed.startsWith('**Assigned To:**')) {
      const assignee = trimmed.replaceAll('**Assigned To:**', '').trim();
      if (assignee.includes('Developer')) {
        task.assignees = 'michelve';
      } else if (assignee.includes('Designer')) {
        task.labels.push('designer');
      }
    }
  }
}

/**
 * Check if a line is a dependency section header
 */
function isDependencySectionHeader(line) {
  return line === '## Dependencies' || line === '## 🔗 Dependencies';
}

/**
 * Check if a line is a description section header
 */
function isDescriptionSectionHeader(line) {
  return line === '## 📋 Task Description' || line === '## Description';
}

/**
 * Parse a dependency line and push the task ID to the appropriate list
 */
function parseDependencyLine(line, state, task) {
  if (!state.inRequires && !state.inBlocks) {
    return;
  }
  if (!line.startsWith('-')) {
    return;
  }
  const taskIdMatch = /TASK-\d+/.exec(line);
  if (taskIdMatch) {
    const target = state.inRequires ? task.requires : task.blocks;
    target.push(taskIdMatch[0]);
  }
}

/**
 * Process a line within the dependencies section
 */
function processDependencyLine(line, state, task) {
  if (line.startsWith('## ') && !line.includes('Dependencies')) {
    state.inDependencies = false;
    state.inRequires = false;
    state.inBlocks = false;
    return;
  }
  if (line === '### Requires:' || line === '### Prerequisites') {
    state.inRequires = true;
    state.inBlocks = false;
    return;
  }
  if (line === '### Blocks:') {
    state.inBlocks = true;
    state.inRequires = false;
    return;
  }
  parseDependencyLine(line, state, task);
}

/**
 * Extract dependencies and description sections from lines
 */
function extractSections(lines, task) {
  const descriptionLines = [];
  const state = { inDescription: false, inDependencies: false, inRequires: false, inBlocks: false };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (isDependencySectionHeader(line)) {
      state.inDependencies = true;
      continue;
    }
    if (isDescriptionSectionHeader(line)) {
      state.inDescription = true;
      continue;
    }

    if (state.inDependencies) {
      processDependencyLine(line, state, task);
    }

    if (state.inDescription) {
      if (line.startsWith('## ') && !line.includes('Task Description')) {
        state.inDescription = false;
      } else {
        descriptionLines.push(line);
      }
    }
  }

  task.description = descriptionLines.join('\n').trim();
}

/**
 * Parse markdown task file
 */
function parseTaskFile(filePath, directory, filename) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const task = {
    repository: 'michelve/dsai', // Change this to your repo
    title: '',
    labels: [],
    assignees: '',
    milestone: '',
    taskId: '',
    priority: '',
    estimate: '',
    phase: '',
    description: '',
    taskFile: `${directory}/${filename}`, // Add the file path
    requires: [], // Tasks this depends on (blockers)
    blocks: [], // Tasks this blocks
  };

  // Extract metadata fields
  extractMetadataFields(lines, task);

  // Extract dependencies and description
  extractSections(lines, task);

  // Clear previous labels and build proper label set
  task.labels = [];
  assignLabels(task, directory);

  return task;
}

/**
 * Add a label if the title matches a pattern
 */
function addLabelIfMatch(labels, title, pattern, label) {
  if (pattern.test(title)) {
    labels.push(label);
  }
}

/**
 * Assign role-based label (designer vs developer)
 */
function assignRoleLabel(task) {
  const titleLower = task.title.toLowerCase();
  if (
    titleLower.includes('designer') ||
    (task.assignees === '' && /color|typography|figma|audit/i.test(task.title))
  ) {
    task.labels.push('👨‍🎨 designer');
  } else if (task.assignees && task.assignees !== '') {
    task.labels.push('👨‍💻 developer');
  }
}

/**
 * Assign work-type labels based on title keywords
 */
function assignWorkTypeLabels(task) {
  const title = task.title;
  const workTypeRules = [
    [/figma|design|color|palette|typography|audit|variable/i, '🎨 design'],
    [/setup|configure|pipeline|storybook|dictionary|ci\/cd|build/i, '🔧 infrastructure'],
    [/document|guide|readme/i, '📚 documentation'],
    [/test|coverage|audit/i, '🧪 testing'],
  ];
  for (const [pattern, label] of workTypeRules) {
    addLabelIfMatch(task.labels, title, pattern, label);
  }

  if (
    /setup|configure|create|build|implement|component/i.test(title) &&
    !/designer|figma variable/i.test(title)
  ) {
    task.labels.push('💻 code');
  }
}

/**
 * Assign domain and component-complexity labels
 */
function assignDomainLabels(task) {
  const title = task.title;
  addLabelIfMatch(task.labels, title, /token|color|palette|typography|spacing|shadow|border|semantic/i, '🎨 design-tokens');
  addLabelIfMatch(task.labels, title, /figma|code connect/i, '🎨 figma');
  addLabelIfMatch(task.labels, title, /storybook/i, '📖 storybook');

  const taskNum = Number.parseInt(task.taskId.replaceAll('TASK-', ''), 10);
  const isComponentByTitle = /button|badge|alert|modal|input|select/i.test(title);
  if ((taskNum >= 21 && taskNum <= 45) || isComponentByTitle) {
    task.labels.push('🧩 component');
    assignComponentComplexity(task.labels, taskNum);
  }
}

/**
 * Assign component complexity label based on task number range
 */
function assignComponentComplexity(labels, taskNum) {
  const ranges = [
    [21, 27, 'simple'],
    [28, 36, 'medium'],
    [37, 45, 'complex'],
  ];
  for (const [min, max, label] of ranges) {
    if (taskNum >= min && taskNum <= max) {
      labels.push(label);
      return;
    }
  }
}

/**
 * Assign priority label from task.priority
 */
function assignPriorityLabel(task) {
  const priorityMap = { Critical: '🔴 critical', High: '🟠 high-priority', Medium: '🟡 medium-priority' };
  if (priorityMap[task.priority]) {
    task.labels.push(priorityMap[task.priority]);
  }
}

/**
 * Assign status and dependency labels
 */
function assignStatusLabels(task, directory) {
  task.labels.push(directory === 'completed' ? '✅ completed' : '📋 todo');
  if (task.requires.length > 0) {
    task.labels.push('🚧 has-dependencies');
  }
}

/**
 * Assign special category labels (a11y, performance, security)
 */
function assignSpecialLabels(task) {
  const title = task.title;
  addLabelIfMatch(task.labels, title, /accessibility|a11y|wcag|aria/i, '♿ accessibility');
  addLabelIfMatch(task.labels, title, /performance|optimization|bundle/i, '⚡ performance');
  addLabelIfMatch(task.labels, title, /security|audit/i, '🔒 security');
}

/**
 * Assign all labels to a task based on its properties
 */
function assignLabels(task, directory) {
  assignRoleLabel(task);
  assignWorkTypeLabels(task);
  assignDomainLabels(task);
  assignPriorityLabel(task);
  assignPhaseLabel(task);
  assignStatusLabels(task, directory);
  assignSpecialLabels(task);
}

/**
 * Assign phase label from task.phase
 */
function assignPhaseLabel(task) {
  if (!task.phase) { return; }
  const phasePatterns = [
    ['Phase 0', '📍 phase-0'],
    ['Phase 1', '📍 phase-1'],
    ['Phase 2A', '📍 phase-2a'],
    ['Phase 2B', '📍 phase-2b'],
    ['Phase 2C', '📍 phase-2c'],
    ['Phase 3', '📍 phase-3'],
    ['Phase 4', '📍 phase-4'],
  ];
  for (const [pattern, label] of phasePatterns) {
    if (task.phase.includes(pattern)) {
      task.labels.push(label);
      return;
    }
  }
}

/**
 * Escape CSV value
 */
function escapeCsv(value) {
  if (typeof value !== 'string') {
    return value;
  }

  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

/**
 * Scan tasks directory recursively
 */
function scanTasksDirectory(dirPath, relativePath = '') {
  const tasks = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'task-templates') {
      // Recursively scan subdirectories
      tasks.push(...scanTasksDirectory(fullPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.startsWith('TASK-')) {
      const directory = path.basename(dirPath);
      try {
        const task = parseTaskFile(fullPath, directory, entry.name);

        // Only add if has valid title and ID
        if (task.title && task.taskId) {
          tasks.push(task);
        }
      } catch (error) {
        console.error(`Error parsing ${fullPath}:`, error.message);
      }
    }
  }

  return tasks;
}

/**
 * Main function
 */
function main() {
  const tasksDir = path.join(__dirname, '../../tasks');
  const configDir = path.join(__dirname, '../../config');
  const outputFile = path.join(configDir, 'data.csv');

  // Create config directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  console.log('🔍 Scanning tasks directory:', tasksDir);

  // Scan all tasks (exclude completed ones by default)
  const allTasks = scanTasksDirectory(tasksDir);

  // Filter out completed tasks (you can change this)
  const tasks = allTasks.filter((task) => !task.labels.includes('completed'));

  console.log(
    `📋 Found ${tasks.length} tasks (${allTasks.length - tasks.length} completed tasks excluded)`
  );

  // Sort by task ID
  tasks.sort((a, b) => {
    const idA = Number.parseInt(a.taskId.replaceAll('TASK-', ''), 10);
    const idB = Number.parseInt(b.taskId.replaceAll('TASK-', ''), 10);
    return idA - idB;
  });

  // Generate CSV with required columns for bulk-issue-creator
  const csvLines = [
    'repository,title,labels,assignees,milestone,task_id,priority,estimate,phase,task_file,requires,blocks',
  ];

  for (const task of tasks) {
    const row = [
      task.repository,
      escapeCsv(task.title),
      escapeCsv(task.labels.join(',')),
      task.assignees || '',
      escapeCsv(task.milestone),
      task.taskId,
      task.priority,
      escapeCsv(task.estimate),
      escapeCsv(task.phase),
      escapeCsv(task.taskFile),
      escapeCsv(task.requires.join(', ')),
      escapeCsv(task.blocks.join(', ')),
    ].join(',');

    csvLines.push(row);
  }

  const csvContent = csvLines.join('\n');

  // Write to file
  fs.writeFileSync(outputFile, csvContent, 'utf-8');

  console.log(`✅ Exported ${tasks.length} tasks to: ${outputFile}`);
  console.log('\n📊 Task Breakdown:');

  // Show statistics
  const stats = {
    byPriority: {},
    byPhase: {},
  };

  tasks.forEach((task) => {
    stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
    if (task.milestone) {
      stats.byPhase[task.milestone] = (stats.byPhase[task.milestone] || 0) + 1;
    }
  });

  console.log('\nBy Priority:');
  Object.entries(stats.byPriority).forEach(([key, count]) => {
    console.log(`  ${key}: ${count}`);
  });

  console.log('\nBy Phase:');
  Object.entries(stats.byPhase).forEach(([key, count]) => {
    console.log(`  ${key}: ${count}`);
  });

  console.log('\n📝 Next Steps:');
  console.log('1. Review config/data.csv');
  console.log('2. Customize config/template.md.mustache');
  console.log('3. Set up .github/workflows/bulk-issue-creator.yml');
  console.log('4. Run the GitHub Action to create issues');
}

// Run the script
main();
