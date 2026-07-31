#!/usr/bin/env node
/**
 * Lightweight assertions for TMC Keep classification (mirrors lib/tmc/selection-kind.ts).
 * Run: node scripts/test-tmc-selection-kind.mjs
 */

const REPLACEMENT_PATTERN =
  /\b(replace|replacing|this to replace|to replace)\b/i;

function classify(review) {
  if (!review?.keep) return 'incomplete';
  const name = String(review.displayName || '').trim();
  if (!name) return 'incomplete';
  if (REPLACEMENT_PATTERN.test(name)) return 'image_replacement';
  return 'new_product';
}

const cases = [
  [{ keep: true, displayName: 'Arabella' }, 'new_product'],
  [{ keep: true, displayName: 'This to replace Unity images' }, 'image_replacement'],
  [{ keep: true, displayName: 'To replace Clarion Images' }, 'image_replacement'],
  [{ keep: true, displayName: 'Replace Aveline images & remove Hidden Halo Box' }, 'image_replacement'],
  [{ keep: true, displayName: '' }, 'incomplete'],
  [{ keep: false, displayName: 'Arabella' }, 'incomplete'],
];

let failed = 0;
for (const [input, expected] of cases) {
  const got = classify(input);
  if (got !== expected) {
    console.error('FAIL', input, 'expected', expected, 'got', got);
    failed += 1;
  } else {
    console.log('OK', expected, JSON.stringify(input));
  }
}

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log('\nAll classification checks passed.');
