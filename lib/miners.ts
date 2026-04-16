import { promises as fs } from 'fs';
import path from 'path';
import { normalizeMinerProfile } from './miner-utils.js';

export type MinerCardData = {
  address: string;
  status: 'online' | 'offline';
  totalEarned: string;
  totalTasks: number;
  epochTasks: number;
  epochAccuracy: string;
  averageAccuracy: string;
  error?: string;
};

const API_BASE = 'https://minework.net/api/miners';
const MINERS_FILE = path.join(process.cwd(), 'miners.txt');

export async function readMinerAddresses(): Promise<string[]> {
  const raw = await fs.readFile(MINERS_FILE, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

export async function fetchMiner(address: string): Promise<MinerCardData> {
  try {
    const response = await fetch(`${API_BASE}/${address}`, {
      next: { revalidate: 60 },
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      return {
        address,
        status: 'offline',
        totalEarned: '0',
        totalTasks: 0,
        epochTasks: 0,
        epochAccuracy: '0.00%',
        averageAccuracy: '0.00%',
        error: `API ${response.status}`,
      };
    }

    const payload = await response.json();
    return normalizeMinerProfile(payload) as MinerCardData;
  } catch (error) {
    return {
      address,
      status: 'offline',
      totalEarned: '0',
      totalTasks: 0,
      epochTasks: 0,
      epochAccuracy: '0.00%',
      averageAccuracy: '0.00%',
      error: error instanceof Error ? error.message : 'Unknown fetch error',
    };
  }
}

export async function fetchAllMiners(): Promise<MinerCardData[]> {
  const addresses = await readMinerAddresses();
  return Promise.all(addresses.map(fetchMiner));
}
