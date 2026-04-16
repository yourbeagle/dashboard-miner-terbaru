export function formatAddress(address) {
  if (!address) return '-';
  const value = String(address);
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function formatTokenAmount(value) {
  if (value === null || value === undefined || value === '') return '0';

  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
  }

  const str = String(value).trim();
  if (!/^\d+$/.test(str)) {
    const numeric = Number(str);
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numeric);
    }
    return '0';
  }

  const normalized = str.replace(/^0+/, '') || '0';
  if (normalized === '0') return '0';

  const padded = normalized.padStart(19, '0');
  const whole = padded.slice(0, -18).replace(/^0+/, '') || '0';
  let fraction = padded.slice(-18).replace(/0+$/, '');
  fraction = fraction.slice(0, 2);
  return fraction ? `${Number(whole).toLocaleString('en-US')}.${fraction}` : Number(whole).toLocaleString('en-US');
}

export function normalizeMinerProfile(payload) {
  const profile = payload?.profile ?? {};
  const miner = profile?.miner ?? {};
  const summary = profile?.miner_summary ?? {};
  const currentEpoch = profile?.current_epoch?.miner ?? {};

  const totalRewards = summary?.total_rewards ?? 0;
  const averageScore = summary?.avg_score ?? 0;
  const epochScore = currentEpoch?.avg_score ?? 0;

  return {
    address: profile?.address ?? '-',
    status: miner?.online ? 'online' : 'offline',
    totalEarned: typeof totalRewards === 'number'
      ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(totalRewards)
      : formatTokenAmount(totalRewards),
    totalTasks: Number(summary?.total_tasks ?? 0),
    epochTasks: Number(currentEpoch?.task_count ?? 0),
    epochAccuracy: `${Number(epochScore || 0).toFixed(2)}%`,
    averageAccuracy: `${Number(averageScore || 0).toFixed(2)}%`
  };
}
