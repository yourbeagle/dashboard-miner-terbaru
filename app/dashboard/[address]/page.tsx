import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '@/app/page.module.css';
import { formatAddress } from '@/lib/miner-utils.js';

export const revalidate = 60;

type JsonRecord = Record<string, any>;

type MinerApiResponse = {
  profile?: {
    miner?: JsonRecord;
    validator?: JsonRecord;
    miner_summary?: JsonRecord;
    validator_summary?: JsonRecord;
    current_epoch?: {
      epoch_id?: number | string;
      miner?: JsonRecord;
      validator?: JsonRecord;
    };
  };
  history?: JsonRecord[];
};

function formatPercent(value: unknown) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function formatReward(value: unknown) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(value || 0));
}

function progressWidth(value: unknown) {
  return `${Math.min(Math.max(Number(value || 0), 0), 100)}%`;
}

async function fetchMinerDetail(address: string): Promise<MinerApiResponse | null> {
  try {
    const response = await fetch(`https://minework.net/api/miners/${address}`, {
      next: { revalidate: 60 },
      headers: { accept: 'application/json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function MinerDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const detail = await fetchMinerDetail(address);

  if (!detail?.profile) {
    notFound();
  }

  const profile = detail.profile ?? {};
  const miner = profile.miner ?? {};
  const validator = profile.validator ?? {};
  const minerSummary = profile.miner_summary ?? {};
  const validatorSummary = profile.validator_summary ?? {};
  const currentEpoch = profile.current_epoch ?? {};
  const currentMinerEpoch = currentEpoch.miner ?? {};
  const currentValidatorEpoch = currentEpoch.validator ?? {};
  const history = detail.history ?? [];

  return (
    <main className={styles.page}>
      <section className={styles.detailHero}>
        <div>
          <Link href="/dashboard" className={styles.backLink}>← Kembali ke dashboard</Link>
          <p className={styles.eyebrow}>Miner Detail</p>
          <h1>{formatAddress(address)}</h1>
          <p className={styles.description}>
            Halaman detail penuh untuk miner ini. Data diambil langsung dari Mine API dan divisualkan jadi snapshot,
            progress epoch, validator pulse, dan history terbaru.
          </p>
        </div>
        <div className={styles.addressHeroCard}>
          <span>Full address</span>
          <strong>{address}</strong>
          <p>Epoch aktif: {String(currentEpoch.epoch_id ?? '-')}</p>
        </div>
      </section>

      <section className={styles.detailGrid}>
        <article className={styles.detailCard}>
          <span>Miner status</span>
          <strong>{miner.online ? 'Online' : 'Offline'}</strong>
          <p>Credit: {String(miner.credit ?? 0)} • Tier: {String(miner.credit_tier ?? '-')}</p>
        </article>
        <article className={styles.detailCard}>
          <span>Validator status</span>
          <strong>{validator.online ? 'Online' : 'Offline'}</strong>
          <p>Eligible: {validator.eligible ? 'Yes' : 'No'} • Credit: {String(validator.credit ?? 0)}</p>
        </article>
        <article className={styles.detailCard}>
          <span>Stake validator</span>
          <strong>{String(validator.stake_amount ?? '0')}</strong>
          <p>Validator ID: {String(validator.validator_id ?? '-')}</p>
        </article>
        <article className={styles.detailCard}>
          <span>Current epoch</span>
          <strong>{String(currentEpoch.epoch_id ?? '-')}</strong>
          <p>Task: {String(currentMinerEpoch.task_count ?? 0)} • Pending: {String(currentMinerEpoch.pending_submission_count ?? 0)}</p>
        </article>
      </section>

      <section className={styles.minerDetailLayout}>
        <div className={styles.metricColumn}>
          <h3>Miner Snapshot</h3>
          <div className={styles.statList}>
            <div><span>Total reward</span><strong>{formatReward(minerSummary.total_rewards)}</strong></div>
            <div><span>Total epochs</span><strong>{String(minerSummary.total_epochs ?? 0)}</strong></div>
            <div><span>Total tasks</span><strong>{String(minerSummary.total_tasks ?? 0)}</strong></div>
            <div><span>Average score</span><strong>{formatPercent(minerSummary.avg_score)}</strong></div>
          </div>
        </div>

        <div className={styles.metricColumn}>
          <h3>Epoch Performance</h3>
          <div className={styles.progressCard}>
            <div>
              <span>Epoch accuracy</span>
              <strong>{formatPercent(currentMinerEpoch.avg_score)}</strong>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressBar} style={{ width: progressWidth(currentMinerEpoch.avg_score) }} />
            </div>
            <div className={styles.progressMeta}>
              Repeat task {String(currentMinerEpoch.repeat_task_count ?? 0)} • Sampled {String(currentMinerEpoch.sampled_score_count ?? 0)}
            </div>
          </div>
          <div className={styles.progressCard}>
            <div>
              <span>Validator accuracy</span>
              <strong>{formatPercent(currentValidatorEpoch.accuracy)}</strong>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressBarAlt} style={{ width: progressWidth(currentValidatorEpoch.accuracy) }} />
            </div>
            <div className={styles.progressMeta}>
              Eval {String(currentValidatorEpoch.eval_count ?? 0)} • Peer {String(currentValidatorEpoch.peer_count ?? 0)}
            </div>
          </div>
        </div>

        <div className={styles.metricColumn}>
          <h3>Validator Summary</h3>
          <div className={styles.statList}>
            <div><span>Total evals</span><strong>{String(validatorSummary.total_evals ?? 0)}</strong></div>
            <div><span>Total rewards</span><strong>{formatReward(validatorSummary.total_rewards)}</strong></div>
            <div><span>Total slashed</span><strong>{formatReward(validatorSummary.total_slashed)}</strong></div>
            <div><span>Avg accuracy</span><strong>{formatPercent(validatorSummary.avg_accuracy)}</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.historyPanel}>
        <div className={styles.historyHeader}>
          <h3>Recent History</h3>
          <span>{history.length} epoch record</span>
        </div>
        <div className={styles.historyList}>
          {history.length ? history.map((item) => (
            <article key={String(item.epoch_id)} className={styles.historyCard}>
              <div>
                <span>Epoch</span>
                <strong>{String(item.epoch_id ?? '-')}</strong>
              </div>
              <div>
                <span>Task</span>
                <strong>{String(item.task_count ?? 0)}</strong>
              </div>
              <div>
                <span>Avg score</span>
                <strong>{formatPercent(item.avg_score)}</strong>
              </div>
              <div>
                <span>Reward</span>
                <strong>{formatReward(item.reward_amount)}</strong>
              </div>
            </article>
          )) : <div className={styles.emptyHistory}>Belum ada history epoch.</div>}
        </div>
      </section>
    </main>
  );
}
