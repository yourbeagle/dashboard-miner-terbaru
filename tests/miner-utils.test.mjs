import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAddress, formatTokenAmount, normalizeMinerProfile } from '../lib/miner-utils.js';

test('formatAddress shortens EVM addresses for cards', () => {
  assert.equal(formatAddress('0x8eD50cDb2048f788cc3bD034c38aCB0732B6cf23'), '0x8eD5...cf23');
});

test('formatTokenAmount converts wei-like 18 decimals into readable integer string', () => {
  assert.equal(formatTokenAmount('1234500000000000000000'), '1,234.5');
  assert.equal(formatTokenAmount(0), '0');
});

test('normalizeMinerProfile extracts dashboard metrics from Mine API payload', () => {
  const normalized = normalizeMinerProfile({
    profile: {
      address: '0xabc',
      miner: { online: true },
      miner_summary: { total_rewards: 12.34, total_tasks: 45, avg_score: 67.89 },
      current_epoch: { miner: { task_count: 9, avg_score: 81.23 } }
    }
  });

  assert.deepEqual(normalized, {
    address: '0xabc',
    status: 'online',
    totalEarned: '12.34',
    totalTasks: 45,
    epochTasks: 9,
    epochAccuracy: '81.23%',
    averageAccuracy: '67.89%'
  });
});
