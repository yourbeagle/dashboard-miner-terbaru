"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '@/app/page.module.css';
import { filterMinersByTab, sortMiners, type DashboardSortKey, type DashboardTab } from '@/lib/dashboard-utils.js';
import { formatAddress } from '@/lib/miner-utils.js';
import type { MinerCardData } from '@/lib/miners';

type MinerWithIndex = MinerCardData & { originalIndex: number };

const HEADERS: Array<{ key: DashboardSortKey; label: string }> = [
  { key: 'index', label: 'No' },
  { key: 'miner', label: 'Miner' },
  { key: 'earned', label: 'Earned' },
  { key: 'totalTasks', label: 'Total Task' },
  { key: 'epochTasks', label: 'Task Epoch Ini' },
  { key: 'epochAccuracy', label: 'Akurasi Epoch Ini' },
  { key: 'averageAccuracy', label: 'Rata-rata Akurasi' },
  { key: 'status', label: 'Status' },
];

export function MinerDashboard({
  miners,
  totals,
}: {
  miners: MinerCardData[];
  totals: { onlineCount: number; totalTasks: number; epochTasks: number; totalEarned: string };
}) {
  const indexedMiners = useMemo<MinerWithIndex[]>(
    () => miners.map((miner, index) => ({ ...miner, originalIndex: index + 1 })),
    [miners]
  );
  const [activeTab, setActiveTab] = useState<DashboardTab>('all');
  const [sortKey, setSortKey] = useState<DashboardSortKey>('index');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const visibleMiners = useMemo<MinerWithIndex[]>(() => {
    const filtered = filterMinersByTab(indexedMiners, activeTab) as MinerWithIndex[];
    return sortMiners(filtered, sortKey, sortDirection) as MinerWithIndex[];
  }, [indexedMiners, activeTab, sortKey, sortDirection]);

  const zeroMiners = useMemo(() => filterMinersByTab(indexedMiners, 'zero'), [indexedMiners]);

  function handleSort(nextKey: DashboardSortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(nextKey);
    setSortDirection(nextKey === 'index' || nextKey === 'miner' ? 'asc' : 'desc');
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Mine Miner Monitor</p>
          <h1>Dashboard miner siap deploy ke Vercel</h1>
          <p className={styles.description}>
            Sumber address diambil dari file <code>miners.txt</code>. Sekarang tabel bisa di-sort, punya tab miner nol aktivitas,
            dan tiap row punya tombol detail yang masuk ke halaman stats miner tersendiri.
          </p>
        </div>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}><span>Total miners</span><strong>{miners.length}</strong></div>
          <div className={styles.summaryCard}><span>Online</span><strong>{totals.onlineCount}</strong></div>
          <div className={styles.summaryCard}><span>Total tasks</span><strong>{totals.totalTasks}</strong></div>
          <div className={styles.summaryCard}><span>Task epoch ini</span><strong>{totals.epochTasks}</strong></div>
          <div className={styles.summaryCardWide}><span>Total earn</span><strong>{totals.totalEarned}</strong></div>
        </div>
      </section>

      <section className={styles.tabBar}>
        <button type="button" className={activeTab === 'all' ? styles.tabActive : styles.tabButton} onClick={() => setActiveTab('all')}>
          Semua Miner <span>{indexedMiners.length}</span>
        </button>
        <button type="button" className={activeTab === 'zero' ? styles.tabActive : styles.tabButton} onClick={() => setActiveTab('zero')}>
          Zero Activity <span>{zeroMiners.length}</span>
        </button>
      </section>

      <section className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {HEADERS.map((header) => {
                const active = sortKey === header.key;
                return (
                  <th key={header.key}>
                    <button type="button" className={styles.sortButton} onClick={() => handleSort(header.key)}>
                      {header.label}
                      <span className={active ? styles.sortActive : styles.sortIcon}>
                        {active ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  </th>
                );
              })}
              <th>Address</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visibleMiners.map((miner) => (
              <tr key={miner.address}>
                <td className={styles.indexCell}>{miner.originalIndex}</td>
                <td className={styles.nameCell}>{formatAddress(miner.address)}</td>
                <td>{miner.totalEarned}</td>
                <td>{miner.totalTasks}</td>
                <td>{miner.epochTasks}</td>
                <td>{miner.epochAccuracy}</td>
                <td>{miner.averageAccuracy}</td>
                <td>
                  <span className={miner.status === 'online' ? styles.online : styles.offline}>{miner.status}</span>
                  {miner.error ? <small className={styles.errorText}>{miner.error}</small> : null}
                </td>
                <td className={styles.addressCell}>{miner.address}</td>
                <td>
                  <Link href={`/dashboard/${miner.address}`} className={styles.detailButton}>
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
