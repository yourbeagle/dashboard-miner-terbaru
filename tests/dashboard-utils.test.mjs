import test from 'node:test';
import assert from 'node:assert/strict';
import { filterMinersByTab, isZeroActivityMiner, sortMiners } from '../lib/dashboard-utils.js';

const miners = [
  {
    address: '0xbbb0000000000000000000000000000000000000',
    status: 'offline',
    totalEarned: '12.5',
    totalTasks: 4,
    epochTasks: 0,
    epochAccuracy: '0.00%',
    averageAccuracy: '0.00%',
    originalIndex: 2,
  },
  {
    address: '0xaaa0000000000000000000000000000000000000',
    status: 'online',
    totalEarned: '1,240.2',
    totalTasks: 90,
    epochTasks: 12,
    epochAccuracy: '88.40%',
    averageAccuracy: '70.00%',
    originalIndex: 1,
  },
  {
    address: '0xccc0000000000000000000000000000000000000',
    status: 'offline',
    totalEarned: '0',
    totalTasks: 0,
    epochTasks: 0,
    epochAccuracy: '0.00%',
    averageAccuracy: '0.00%',
    originalIndex: 3,
  },
];

test('isZeroActivityMiner detects miners with all zero epoch activity and zero average accuracy', () => {
  assert.equal(isZeroActivityMiner(miners[0]), true);
  assert.equal(isZeroActivityMiner(miners[1]), false);
});

test('filterMinersByTab returns only zero-activity miners for zero tab', () => {
  const result = filterMinersByTab(miners, 'zero');
  assert.deepEqual(result.map((miner) => miner.address), [
    '0xbbb0000000000000000000000000000000000000',
    '0xccc0000000000000000000000000000000000000',
  ]);
});

test('sortMiners sorts numeric and percent fields descending', () => {
  const result = sortMiners(miners, 'epochAccuracy', 'desc');
  assert.deepEqual(result.map((miner) => miner.address), [
    '0xaaa0000000000000000000000000000000000000',
    '0xbbb0000000000000000000000000000000000000',
    '0xccc0000000000000000000000000000000000000',
  ]);
});

test('sortMiners sorts text fields ascending', () => {
  const result = sortMiners(miners, 'miner', 'asc');
  assert.deepEqual(result.map((miner) => miner.address), [
    '0xaaa0000000000000000000000000000000000000',
    '0xbbb0000000000000000000000000000000000000',
    '0xccc0000000000000000000000000000000000000',
  ]);
});
