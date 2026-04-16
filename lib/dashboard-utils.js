function parsePercent(value) {
  return Number.parseFloat(String(value || '0').replace('%', '')) || 0;
}

function parseNumber(value) {
  return Number.parseFloat(String(value || '0').replace(/,/g, '')) || 0;
}

export function isZeroActivityMiner(miner) {
  return (
    parsePercent(miner.epochAccuracy) === 0 &&
    Number(miner.epochTasks || 0) === 0 &&
    parsePercent(miner.averageAccuracy) === 0
  );
}

export function filterMinersByTab(miners, tab) {
  if (tab === 'zero') {
    return miners.filter(isZeroActivityMiner);
  }
  return miners;
}

export function sortMiners(miners, sortKey, direction = 'desc') {
  const sorted = [...miners];
  const modifier = direction === 'asc' ? 1 : -1;

  sorted.sort((left, right) => {
    let leftValue;
    let rightValue;

    switch (sortKey) {
      case 'index':
        leftValue = left.originalIndex ?? 0;
        rightValue = right.originalIndex ?? 0;
        break;
      case 'miner':
        leftValue = String(left.address || '').toLowerCase();
        rightValue = String(right.address || '').toLowerCase();
        break;
      case 'earned':
        leftValue = parseNumber(left.totalEarned);
        rightValue = parseNumber(right.totalEarned);
        break;
      case 'totalTasks':
        leftValue = Number(left.totalTasks || 0);
        rightValue = Number(right.totalTasks || 0);
        break;
      case 'epochTasks':
        leftValue = Number(left.epochTasks || 0);
        rightValue = Number(right.epochTasks || 0);
        break;
      case 'epochAccuracy':
        leftValue = parsePercent(left.epochAccuracy);
        rightValue = parsePercent(right.epochAccuracy);
        break;
      case 'averageAccuracy':
        leftValue = parsePercent(left.averageAccuracy);
        rightValue = parsePercent(right.averageAccuracy);
        break;
      case 'status':
        leftValue = left.status === 'online' ? 1 : 0;
        rightValue = right.status === 'online' ? 1 : 0;
        break;
      default:
        leftValue = left.originalIndex ?? 0;
        rightValue = right.originalIndex ?? 0;
        break;
    }

    if (leftValue < rightValue) return -1 * modifier;
    if (leftValue > rightValue) return 1 * modifier;
    return Number(left.originalIndex || 0) - Number(right.originalIndex || 0);
  });

  return sorted;
}
