#!/usr/bin/env node

/**
 * Update existing GitHub issues with new labels
 *
 * This script reads the CSV and updates existing issues
 * based on the task_id in the issue body or title
 *
 * Usage:
 *   export GITHUB_TOKEN=your_token
 *   node tools/scripts/github/update-issue-labels.cjs
 *
 * Prerequisites:
 *   npm install @octokit/rest csv-parse
 */

const fs = require('node:fs');
const path = require('node:path');

const { parse } = require('csv-parse/sync');

// Check if @octokit/rest is available
let Octokit;
try {
  const octokitModule = require('@octokit/rest');
  Octokit = octokitModule.Octokit;
} catch {
  console.error('❌ @octokit/rest not installed');
  console.error('Run: npm install @octokit/rest csv-parse');
  process.exit(1);
}

/**
 * Main update function
 */
async function updateIssueLabels() {
  // Get GitHub token
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable not set');
    console.error('Run: export GITHUB_TOKEN=your_token');
    process.exit(1);
  }

  // Initialize Octokit
  const octokit = new Octokit({ auth: token });

  // Parse repository from CSV
  const csvPath = path.join(__dirname, '../../config/data.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  if (records.length === 0) {
    console.error('❌ No tasks found in CSV');
    process.exit(1);
  }

  // Get repo info from first record
  const [owner, repo] = records[0].repository.split('/');

  console.log(`🔍 Updating issues in ${owner}/${repo}`);
  console.log(`📋 Found ${records.length} tasks in CSV\n`);

  // Get all open issues
  console.log('📥 Fetching existing issues...');
  const { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'all',
    per_page: 100,
  });

  console.log(`✅ Found ${issues.length} existing issues\n`);

  // Create a map of task_id to labels
  const taskLabelMap = new Map();
  records.forEach((record) => {
    taskLabelMap.set(record.task_id, record.labels.split(','));
  });

  // Update issues
  let updated = 0;
  let notFound = 0;

  for (const issue of issues) {
    // Try to find task_id in issue title or body
    const taskIdMatch = issue.title.match(/TASK-\d+/) || issue.body?.match(/TASK-\d+/);

    if (taskIdMatch) {
      const taskId = taskIdMatch[0];
      const newLabels = taskLabelMap.get(taskId);

      if (newLabels) {
        try {
          // Update issue labels
          await octokit.issues.update({
            owner,
            repo,
            issue_number: issue.number,
            labels: newLabels,
          });

          console.log(`✅ Updated #${issue.number}: ${taskId} - Added ${newLabels.length} labels`);
          updated++;

          // Rate limiting - wait a bit between requests
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Failed to update #${issue.number}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Issue #${issue.number} (${taskId}) - No labels found in CSV`);
        notFound++;
      }
    } else {
      console.log(`⏭️  Issue #${issue.number} - No task ID found, skipping`);
    }
  }

  console.log('\n📊 Update Summary:');
  console.log(`✅ Updated: ${updated}`);
  console.log(`⚠️  Not found in CSV: ${notFound}`);
  console.log(`⏭️  Skipped: ${issues.length - updated - notFound}`);
  console.log('\n🎉 Label update complete!');
}

// Run the update
updateIssueLabels().catch((error) => {
  console.error('❌ Update failed:', error);
  process.exit(1);
});
