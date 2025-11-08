/*
  Safe token collections merger
  - Merges all JSON files in ../collections into a single JSON object
  - Preserves existing data; on primitive conflicts, keeps the first value and logs a warning
  - Never deletes keys; only adds
  - Output written to ../tokens/combined.tokens.json

  Usage (from repo root or tokens folder):
    node scripts/merge-tokens.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COLLECTIONS_DIR = path.join(ROOT, 'collections');
const OUTPUT_DIR = path.join(ROOT, 'tokens');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'combined.tokens.json');
const COLLECTION_NAME = 'Design System';

/** Deep merge that:
 * - merges objects recursively
 * - for arrays: concatenates unique items (by JSON string)
 * - for primitives: if conflict, keeps existing and records a warning
 */
function deepMerge(target, source, ctx, conflicts) {
  if (Array.isArray(target) && Array.isArray(source)) {
    const seen = new Set(target.map((x) => JSON.stringify(x)));
    for (const item of source) {
      const key = JSON.stringify(item);
      if (!seen.has(key)) {
        target.push(item);
        seen.add(key);
      }
    }
    return target;
  }

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key of Object.keys(source)) {
      const nextCtx = ctx.concat(key);
      if (!(key in target)) {
        // add new key
        target[key] = clone(source[key]);
      } else {
        const tVal = target[key];
        const sVal = source[key];
        if (isPlainObject(tVal) && isPlainObject(sVal)) {
          deepMerge(tVal, sVal, nextCtx, conflicts);
        } else if (Array.isArray(tVal) && Array.isArray(sVal)) {
          deepMerge(tVal, sVal, nextCtx, conflicts);
        } else if (JSON.stringify(tVal) === JSON.stringify(sVal)) {
          // identical primitive or structure, nothing to do
        } else {
          // conflict on primitive or mismatched types – keep existing, log
          conflicts.push({ path: nextCtx.join('.'), kept: tVal, skipped: sVal });
        }
      }
    }
    return target;
  }

  // Fallback: if types differ at the root, prefer target and record
  if (JSON.stringify(target) !== JSON.stringify(source)) {
    conflicts.push({ path: ctx.join('.'), kept: target, skipped: source });
  }
  return target;
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${filePath} -> ${e.message}`);
  }
}

function main() {
  if (!fs.existsSync(COLLECTIONS_DIR)) {
    throw new Error(`Collections directory not found: ${COLLECTIONS_DIR}`);
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(COLLECTIONS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.json') && f.toLowerCase() !== 'index.json')
    .sort();

  if (files.length === 0) {
    console.warn('No collection JSON files found to merge.');
    return;
  }

  // Build a single collection to ensure all aliases live in one collection for Figma
  const accumulator = [{ [COLLECTION_NAME]: { modes: { 'Light Mode': {}, 'Dark Mode': {} } } }];
  const combinedModes = accumulator[0][COLLECTION_NAME].modes;
  const conflicts = [];

  for (const file of files) {
    const full = path.join(COLLECTIONS_DIR, file);
    const data = readJson(full);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`Skipping ${file}: expected an array with at least one object.`);
      continue;
    }

    for (const entry of data) {
      if (!isPlainObject(entry)) {
        console.warn(`Skipping non-object entry in ${file}.`);
        continue;
      }
      // Each file has a single top-level collection key (e.g., "Colors", "Semantic", "Typography", "Components | Button")
      for (const topKey of Object.keys(entry)) {
        const collection = entry[topKey];
        if (!collection || !isPlainObject(collection) || !isPlainObject(collection.modes)) continue;

        // For each mode, merge inner groups into the unified collection's same mode
        for (const modeName of Object.keys(collection.modes)) {
          const srcMode = collection.modes[modeName];
          if (!isPlainObject(srcMode)) continue;

          // Determine if this is a component collection: topKey starts with 'Components'
          const isComponent = /^components/i.test(topKey);
          if (isComponent) {
            // srcMode has a single key: the component namespace (e.g., button, card, input)
            for (const compKey of Object.keys(srcMode)) {
              if (!combinedModes[modeName].components) combinedModes[modeName].components = {};
              if (!combinedModes[modeName].components[compKey])
                combinedModes[modeName].components[compKey] = {};
              deepMerge(
                combinedModes[modeName].components[compKey],
                srcMode[compKey],
                [COLLECTION_NAME, 'modes', modeName, 'components', compKey],
                conflicts
              );
            }
          } else {
            // Foundation collections: merge their inner namespaces directly (colors, semantic, typography, etc.)
            for (const nsKey of Object.keys(srcMode)) {
              if (!combinedModes[modeName][nsKey]) combinedModes[modeName][nsKey] = {};
              deepMerge(
                combinedModes[modeName][nsKey],
                srcMode[nsKey],
                [COLLECTION_NAME, 'modes', modeName, nsKey],
                conflicts
              );
            }
          }
        }
      }
    }
  }

  const output = JSON.stringify(accumulator, null, 2);
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

  // Emit conflict report next to output as a log file
  const logFile = OUTPUT_FILE.replace(/\.json$/, '.merge.log');
  if (conflicts.length) {
    const log = [
      `Merge completed with ${conflicts.length} conflict(s).`,
      'Conflicts kept existing value; skipped incoming value:',
      ...conflicts.map(
        (c, i) =>
          `#${i + 1} @ ${c.path}\n  kept: ${JSON.stringify(c.kept)}\n  skipped: ${JSON.stringify(c.skipped)}`
      ),
    ].join('\n');
    fs.writeFileSync(logFile, log + '\n', 'utf8');
    console.warn(`Merge completed with conflicts. See log: ${path.relative(ROOT, logFile)}`);
  } else {
    fs.writeFileSync(logFile, 'Merge completed with 0 conflicts.\n', 'utf8');
    console.log('Merge completed with 0 conflicts.');
  }

  console.log(`Wrote merged tokens to: ${path.relative(ROOT, OUTPUT_FILE)}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
