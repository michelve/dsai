#!/usr/bin/env node

/**
 * Export DSAi tasks to GitHub Issues CSV format
 *
 * Converts markdown task files to CSV format compatible with
 * benbalter/bulk-issue-creator GitHub Action
 *
 * Usage:
 *   node tools/scripts/export-tasks-to-github-csv.js
 *
 * Output:
 *   config/data.csv (for bulk-issue-creator)
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse markdown task file
 */
function parseTaskFile(filePath, directory) {
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
    description: ''
  };

  // Extract metadata
  let descriptionLines = [];
  let inDescription = false;

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

  // Add labels based on directory
  if (directory === '01-critical') {
    task.labels.push('critical', 'phase-0');
  } else if (directory === '02-high') {
    task.labels.push('high-priority');
  } else if (directory === '03-medium') {
    task.labels.push('medium-priority');
  } else if (directory === 'completed') {
    task.labels.push('completed');
  }

  // Add component label for component tasks
  if (task.taskId && parseInt(task.taskId.replace('TASK-', '')) >= 21 &&
      parseInt(task.taskId.replace('TASK-', '')) <= 45) {
    task.labels.push('component');
  }

  // Add token label for token-related tasks
  if (task.title && (task.title.toLowerCase().includes('token') ||
      task.title.toLowerCase().includes('color') ||
      task.title.toLowerCase().includes('typography'))) {
    task.labels.push('design-tokens');
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
        const task = parseTaskFile(fullPath, directory);

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
  const tasks = allTasks.filter(task => !task.labels.includes('completed'));

  console.log(`📋 Found ${tasks.length} tasks (${allTasks.length - tasks.length} completed tasks excluded)`);

  // Sort by task ID
  tasks.sort((a, b) => {
    const idA = parseInt(a.taskId.replace('TASK-', ''));
    const idB = parseInt(b.taskId.replace('TASK-', ''));
    return idA - idB;
  });

  // Generate CSV with required columns for bulk-issue-creator
  const csvLines = [
    'repository,title,labels,assignees,milestone,task_id,priority,estimate,phase'
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
      escapeCsv(task.phase)
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
    byPhase: {}
  };

  tasks.forEach(task => {
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

