export function formatAddress(address: string): string;
export function formatTokenAmount(value: string | number | null | undefined): string;
export function normalizeMinerProfile(payload: unknown): {
  address: string;
  status: 'online' | 'offline';
  totalEarned: string;
  totalTasks: number;
  epochTasks: number;
  epochAccuracy: string;
  averageAccuracy: string;
};
