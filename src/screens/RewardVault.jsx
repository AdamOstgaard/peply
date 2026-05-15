import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LockSimple, Sparkle, Plus } from '@phosphor-icons/react'
import { RewardCard } from '../components/RewardCard.jsx'
import { EmptyState, GiftIllustration } from '../components/EmptyState.jsx'
import { Button } from '../components/Button.jsx'
import { useStore } from '../lib/store.jsx'
import {
  getUnlockMode,
  goalsLinkedTo,
  rewardProgressSummary,
  rewardStatus,
} from '../lib/domain.js'
import './RewardVault.css'

const TIER_RANK = { dream: 4, big: 3, medium: 2, small: 1 }

export function RewardVault() {
  const navigate = useNavigate()
  const {
    state: { rewards, goals, logs },
  } = useStore()

  const rewardWithProgress = useMemo(() => {
    return rewards.map((r) => {
      const linkedGoals = goalsLinkedTo(r.id, goals)
      const summary = rewardProgressSummary(r, linkedGoals, logs)
      const status = rewardStatus(r, linkedGoals, logs, summary)
      return {
        reward: r,
        progress: summary.ratio,
        status,
        linkedGoals,
        summary,
      }
    })
  }, [rewards, goals, logs])

  const active = rewardWithProgress.filter(
    (r) => r.status === 'in-progress' || r.status === 'unlocked',
  )

  const allSorted = [...rewardWithProgress].sort((a, b) => {
    const order = { 'in-progress': 0, unlocked: 1, draft: 2, claimed: 3 }
    if (order[a.status] !== order[b.status])
      return order[a.status] - order[b.status]
    return (TIER_RANK[b.reward.tier] || 0) - (TIER_RANK[a.reward.tier] || 0)
  })

  const openReward = (rewardId) => navigate(`/rewards/${rewardId}`)

  if (rewards.length === 0) {
    return (
      <div className="vault">
        <Heading title="Rewards" subtitle="Things you're working toward." />
        <EmptyState
          illustration={<GiftIllustration />}
          title="Your vault is empty"
          body="Create rewards to work toward — give your goals a reason."
          action={
            <Button onClick={() => navigate('/reward/new')}>
              Add your first reward
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="vault">
      <Heading title="Rewards" subtitle="Things you're working toward." />

      {active.length > 0 && (
        <section className="vault__section">
          <div className="t-label muted vault__label">Active</div>
          <div className="vault__row">
            {active.map(({ reward, progress, status }) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                progress={progress}
                status={status}
                onClick={() =>
                  openReward(reward.id)
                }
              />
            ))}
          </div>
        </section>
      )}

      <section className="vault__section">
        <div className="t-label muted vault__label">All rewards</div>
        <ul className="vault__list">
          {allSorted.map(({ reward, progress, status, linkedGoals, summary }, i) => {
            const mode = getUnlockMode(reward.unlockMode)
            const isShared = linkedGoals.length > 1
            const earned = reward.unlockCount || 0
            return (
              <motion.li
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.25 }}
              >
                <button
                  className="vault-row"
                  type="button"
                  onClick={() =>
                    openReward(reward.id)
                  }
                  aria-label={rewardActionLabel({ reward, status, linkedGoals })}
                >
                  <span className="vault-row__emoji">
                    {reward.emoji || '🎁'}
                  </span>
                  <div className="vault-row__body">
                    <div className="t-body-lg">{reward.name}</div>
                    <div className="vault-row__meta">
                      <span className={`status-chip status-chip--${status}`}>
                        {status === 'in-progress' && (
                          <>
                            <LockSimple size={12} weight="fill" />{' '}
                            {rewardProgressText({ reward, progress, summary })}
                          </>
                        )}
                        {status === 'unlocked' && (
                          <>
                            <Sparkle size={12} weight="fill" /> Unlocked
                            {earned > 1 ? ` ×${earned}` : ''}
                          </>
                        )}
                        {status === 'claimed' && '✓ Claimed'}
                        {status === 'draft' && 'Not linked'}
                      </span>
                      {isShared && (
                        <span className="t-caption muted">
                          · {mode.emoji} {mode.label.toLowerCase()}
                        </span>
                      )}
                      {!isShared && reward.tier && (
                        <span className="t-caption muted">
                          · {reward.tier === 'dream' ? 'Dream' : reward.tier} reward
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </section>

      <button
        type="button"
        className="vault__add"
        onClick={() => navigate('/reward/new')}
      >
        <Plus size={22} weight="bold" />
        Add a reward
      </button>
    </div>
  )
}

function rewardActionLabel({ reward, status, linkedGoals }) {
  if (status === 'unlocked') return `View and claim ${reward.name}`
  if (linkedGoals.length > 0) return `View details for ${reward.name}`
  return `View and link ${reward.name}`
}

function rewardProgressText({ reward, progress, summary }) {
  const pct = `${Math.round(progress * 100)}%`
  const mode = reward.unlockMode || 'each'
  if (mode === 'all' && summary.total > 1) {
    return `${summary.completed}/${summary.total} goals · ${pct}`
  }
  if (mode === 'any' && summary.total > 1) {
    return `Best goal · ${pct}`
  }
  if (mode === 'each' && (reward.unlockCount || 0) > 0) {
    return `Next earn · ${pct}`
  }
  return pct
}

function Heading({ title, subtitle }) {
  return (
    <div className="vault__head">
      <h1 className="t-headline">{title}</h1>
      <p className="t-body muted">{subtitle}</p>
    </div>
  )
}
