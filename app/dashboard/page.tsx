import { MinerDashboard } from '@/components/miner-dashboard';
import { fetchAllMiners } from '@/lib/miners';

function getTotals(miners: Awaited<ReturnType<typeof fetchAllMiners>>) {
  const onlineCount = miners.filter((miner) => miner.status === 'online').length;
  const totalTasks = miners.reduce((sum, miner) => sum + miner.totalTasks, 0);
  const epochTasks = miners.reduce((sum, miner) => sum + miner.epochTasks, 0);
  const totalEarned = miners.reduce((sum, miner) => sum + Number(String(miner.totalEarned).replace(/,/g, '')), 0);
  return {
    onlineCount,
    totalTasks,
    epochTasks,
    totalEarned: totalEarned.toLocaleString('en-US', { maximumFractionDigits: 2 }),
  };
}

export default async function DashboardPage() {
  const miners = await fetchAllMiners();
  const totals = getTotals(miners);

  return <MinerDashboard miners={miners} totals={totals} />;
}
