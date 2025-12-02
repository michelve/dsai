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

const fs = require('fs');
const path = require('path');

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

  // Extract metadata
  let descriptionLines = [];
  let inDescription = false;
  let inDependencies = false;
  let inRequires = false;
  let inBlocks = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract Task ID
    if (line.startsWith('**Task ID:**')) {
      task.taskId = line.replace('**Task ID:**', '').trim();
    }

    // Extract Title
    if (line.startsWith('**Title:**')) {
      task.title = line.replace('**Title:**', '').trim();
    }

    // Extract Priority
    if (line.startsWith('**Priority:**')) {
      const priority = line.replace('**Priority:**', '').trim();
      task.priority = priority;
      // Add priority as label
      task.labels.push(priority.toLowerCase());
    }

    // Extract Assignee
    if (line.startsWith('**Assigned To:**')) {
      const assignee = line.replace('**Assigned To:**', '').trim();
      // Map to GitHub username (customize this)
      if (assignee.includes('Developer')) {
        task.assignees = 'michelve'; // Change to your GitHub username
      } else if (assignee.includes('Designer')) {
        task.labels.push('designer');
      }
    }

    // Extract Estimate
    if (line.startsWith('**Estimated Time:**')) {
      task.estimate = line.replace('**Estimated Time:**', '').trim();
    }

    // Extract Phase
    if (line.startsWith('**Phase:**')) {
      const phase = line.replace('**Phase:**', '').trim();
      task.phase = phase;
      task.milestone = phase.split(' - ')[0]; // e.g., "Phase 0"
    }

    // Extract Dependencies
    if (line === '## Dependencies' || line === '## 🔗 Dependencies') {
      inDependencies = true;
      continue;
    }

    if (inDependencies) {
      // End of dependencies section
      if (line.startsWith('## ') && !line.includes('Dependencies')) {
        inDependencies = false;
        inRequires = false;
        inBlocks = false;
      }

      // Start of Requires section
      if (line === '### Requires:' || line === '### Prerequisites') {
        inRequires = true;
        inBlocks = false;
        continue;
      }

      // Start of Blocks section
      if (line === '### Blocks:') {
        inBlocks = true;
        inRequires = false;
        continue;
      }

      // Extract task IDs from dependency lines
      if ((inRequires || inBlocks) && line.startsWith('-')) {
        const taskIdMatch = line.match(/TASK-\d+/);
        if (taskIdMatch) {
          const depTaskId = taskIdMatch[0];
          if (inRequires) {
            task.requires.push(depTaskId);
          } else if (inBlocks) {
            task.blocks.push(depTaskId);
          }
        }
      }
    }

    // Extract full description
    if (line === '## 📋 Task Description' || line === '## Description') {
      inDescription = true;
      continue;
    }

    if (inDescription) {
      if (line.startsWith('## ') && !line.includes('Task Description')) {
        inDescription = false;
      } else {
        descriptionLines.push(line);
      }
    }
  }

  // Build full description from file
  task.description = descriptionLines.join('\n').trim();

  // Clear previous labels and build proper label set
  task.labels = [];

  // 1. ROLE-BASED LABELS
  if (
    task.title.toLowerCase().includes('designer') ||
    (task.assignees === '' && task.title.match(/color|typography|figma|audit/i))
  ) {
    task.labels.push('👨‍🎨 designer');
  } else if (task.assignees && task.assignees !== '') {
    task.labels.push('👨‍💻 developer');
  }

  // 2. WORK TYPE LABELS
  // Design work
  if (task.title.match(/figma|design|color|palette|typography|audit|variable/i)) {
    task.labels.push('🎨 design');
  }

  // Code/Implementation
  if (
    task.title.match(/setup|configure|create|build|implement|component/i) &&
    !task.title.match(/designer|figma variable/i)
  ) {
    task.labels.push('💻 code');
  }

  // Infrastructure/Tooling
  if (task.title.match(/setup|configure|pipeline|storybook|dictionary|ci\/cd|build/i)) {
    task.labels.push('🔧 infrastructure');
  }

  // Documentation
  if (task.title.match(/document|guide|readme/i)) {
    task.labels.push('📚 documentation');
  }

  // Testing
  if (task.title.match(/test|coverage|audit/i)) {
    task.labels.push('🧪 testing');
  }

  // 3. DOMAIN LABELS
  // Design tokens
  if (task.title.match(/token|color|palette|typography|spacing|shadow|border|semantic/i)) {
    task.labels.push('🎨 design-tokens');
  }

  // Components
  const taskNum = parseInt(task.taskId.replace('TASK-', ''));
  if (
    (taskNum >= 21 && taskNum <= 45) ||
    task.title.match(/button|badge|alert|modal|input|select/i)
  ) {
    task.labels.push('🧩 component');

    // Component complexity
    if (taskNum >= 21 && taskNum <= 27) {
      task.labels.push('simple');
    } else if (taskNum >= 28 && taskNum <= 36) {
      task.labels.push('medium');
    } else if (taskNum >= 37 && taskNum <= 45) {
      task.labels.push('complex');
    }
  }

  // Figma integration
  if (task.title.match(/figma|code connect/i)) {
    task.labels.push('🎨 figma');
  }

  // Storybook
  if (task.title.match(/storybook/i)) {
    task.labels.push('📖 storybook');
  }

  // 4. PRIORITY LABELS
  if (task.priority === 'Critical') {
    task.labels.push('🔴 critical');
  } else if (task.priority === 'High') {
    task.labels.push('🟠 high-priority');
  } else if (task.priority === 'Medium') {
    task.labels.push('🟡 medium-priority');
  }

  // 5. PHASE LABELS
  if (task.phase && task.phase.includes('Phase 0')) {
    task.labels.push('📍 phase-0');
  } else if (task.phase && task.phase.includes('Phase 1')) {
    task.labels.push('📍 phase-1');
  } else if (task.phase && task.phase.includes('Phase 2A')) {
    task.labels.push('📍 phase-2a');
  } else if (task.phase && task.phase.includes('Phase 2B')) {
    task.labels.push('📍 phase-2b');
  } else if (task.phase && task.phase.includes('Phase 2C')) {
    task.labels.push('📍 phase-2c');
  } else if (task.phase && task.phase.includes('Phase 3')) {
    task.labels.push('📍 phase-3');
  } else if (task.phase && task.phase.includes('Phase 4')) {
    task.labels.push('📍 phase-4');
  }

  // 6. STATUS LABELS
  if (directory === 'completed') {
    task.labels.push('✅ completed');
  } else {
    task.labels.push('📋 todo');
  }

  // Add blocked label if has unmet dependencies
  if (task.requires.length > 0) {
    task.labels.push('🚧 has-dependencies');
  }

  // 7. SPECIAL CATEGORIES
  // Accessibility
  if (task.title.match(/accessibility|a11y|wcag|aria/i)) {
    task.labels.push('♿ accessibility');
  }

  // Performance
  if (task.title.match(/performance|optimization|bundle/i)) {
    task.labels.push('⚡ performance');
  }

  // Security
  if (task.title.match(/security|audit/i)) {
    task.labels.push('🔒 security');
  }

  return task;
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
    return `"${value.replace(/"/g, '""')}"`;
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
    const idA = parseInt(a.taskId.replace('TASK-', ''));
    const idB = parseInt(b.taskId.replace('TASK-', ''));
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
