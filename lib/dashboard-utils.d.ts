export type DashboardMiner = {
  address: string;
  status: 'online' | 'offline';
  totalEarned: string;
  totalTasks: number;
  epochTasks: number;
  epochAccuracy: string;
  averageAccuracy: string;
  error?: string;
  originalIndex?: number;
};

export type DashboardTab = 'all' | 'zero';
export type DashboardSortKey =
  | 'index'
  | 'miner'
  | 'earned'
  | 'totalTasks'
  | 'epochTasks'
  | 'epochAccuracy'
  | 'averageAccuracy'
  | 'status';

export function isZeroActivityMiner(miner: DashboardMiner): boolean;
export function filterMinersByTab(miners: DashboardMiner[], tab: DashboardTab): DashboardMiner[];
export function sortMiners(
  miners: DashboardMiner[],
  sortKey: DashboardSortKey,
  direction?: 'asc' | 'desc'
): DashboardMiner[];
