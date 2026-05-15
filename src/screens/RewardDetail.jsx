import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle,
  Gift,
  LockSimple,
  Plus,
  Sparkle,
  Target,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Button } from '../components/Button.jsx'
import { ProgressRing } from '../components/ProgressRing.jsx'
import { ScreenHeader } from '../components/ScreenHeader.jsx'
import { useStore } from '../lib/store.jsx'
import {
  getGoalType,
  getUnlockMode,
  goalProgress,
  goalsLinkedTo,
  rewardProgressSummary,
  rewardStatus,
} from '../lib/domain.js'
import './RewardDetail.css'

const TIER_GRADIENTS = {
  small: 'var(--gradient-cool)',
  medium: 'var(--gradient-warm)',
  big: 'var(--gradient-primary)',
  dream: 'var(--gradient-celebration)',
}

const TIER_LABELS = {
  small: 'Small treat',
  medium: 'Medium reward',
  big: 'Big reward',
  dream: 'Dream reward',
}

export function RewardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    state: { rewards, goals, logs },
    actions: { claimReward, pushToast },
  } = useStore()

  const reward = rewards.find((r) => r.id === id)

  const detail = useMemo(() => {
    if (!reward) return null
    const linkedGoals = goalsLinkedTo(reward.id, goals)
    const summary = rewardProgressSummary(reward, linkedGoals, logs)
    const status = rewardStatus(reward, linkedGoals, logs, summary)
    const events = rewardEvents(reward, goals)
    return { linkedGoals, summary, status, events }
  }, [goals, logs, reward])

  if (!reward || !detail) {
    return (
      <div className="reward-detail">
        <ScreenHeader title="Reward" fallback="/rewards" />
        <div className="reward-detail__missing">
          <p className="t-body">This reward isn't here anymore.</p>
          <Button onClick={() => navigate('/rewards')}>Back to rewards</Button>
        </div>
      </div>
    )
  }

  const { linkedGoals, summary, status, events } = detail
  const mode = getUnlockMode(reward.unlockMode)
  const earned = reward.unlockCount || (reward.unlockedAt ? 1 : 0)
  const focusGoal =
    summary.focusGoal ||
    linkedGoals.find((g) => !g.archivedAt && !g.completedAt) ||
    linkedGoals[0]

  const handleClaim = () => {
    claimReward(reward.id)
    pushToast({ message: `${reward.name} claimed. Enjoy it.`, variant: 'success' })
  }

  const handlePrimary = () => {
    if (status === 'unlocked') {
      handleClaim()
      return
    }
    if (focusGoal) {
      navigate(`/goal/${focusGoal.id}`)
      return
    }
    navigate('/goal/new', { state: { prefillRewardId: reward.id } })
  }

  return (
    <div className="reward-detail">
      <ScreenHeader title="Reward" fallback="/rewards" />

      <section
        className={`reward-detail__hero reward-detail__hero--${status}`}
        style={{
          '--reward-grad': TIER_GRADIENTS[reward.tier] || TIER_GRADIENTS.medium,
        }}
      >
        <div className="reward-detail__hero-bg" aria-hidden />
        <div className="reward-detail__hero-content">
          <div className="reward-detail__emoji" aria-hidden>
            {reward.emoji || '🎁'}
          </div>
          <div>
            <div className="reward-detail__status t-label">
              {statusLabel(status)}
            </div>
            <h1 className="t-headline">{reward.name}</h1>
            <p className="t-body-sm reward-detail__tier">
              {TIER_LABELS[reward.tier] || 'Reward'} · {mode.emoji}{' '}
              {mode.label}
            </p>
          </div>
        </div>
        <div className="reward-detail__ring">
          <ProgressRing
            value={summary.ratio}
            size="lg"
            preset="celebration"
            trackColor="rgba(255,255,255,0.22)"
          >
            <span className="t-mono reward-detail__pct">
              {Math.round(summary.ratio * 100)}%
            </span>
          </ProgressRing>
        </div>
      </section>

      <section className="reward-detail__section reward-detail__summary">
        <Stat
          icon={<Sparkle size={18} weight="fill" />}
          label="Earned"
          value={earned > 0 ? `${earned}x` : 'Not yet'}
        />
        <Stat
          icon={<Target size={18} weight="fill" />}
          label="Linked"
          value={`${linkedGoals.length}`}
        />
        <Stat
          icon={<Gift size={18} weight="fill" />}
          label="Created"
          value={formatShortDate(reward.createdAt)}
        />
      </section>

      {reward.note && (
        <section className="reward-detail__section">
          <div className="t-label muted">Note</div>
          <p className="reward-detail__note t-body">{reward.note}</p>
        </section>
      )}

      <section className="reward-detail__section">
        <Button
          block
          variant={status === 'unlocked' ? 'celebration' : 'primary'}
          leftIcon={
            status === 'unlocked' ? (
              <CheckCircle size={20} weight="bold" />
            ) : focusGoal ? (
              <Target size={20} weight="bold" />
            ) : (
              <Plus size={20} weight="bold" />
            )
          }
          onClick={handlePrimary}
        >
          {status === 'unlocked'
            ? 'Claim reward'
            : focusGoal
              ? `Continue: ${focusGoal.name}`
              : 'Link a goal'}
        </Button>
      </section>

      <section className="reward-detail__section">
        <div className="reward-detail__section-head">
          <div className="t-label muted">Progress</div>
          <span className={`reward-detail__chip reward-detail__chip--${status}`}>
            {statusIcon(status)}
            {progressText({ reward, status, summary })}
          </span>
        </div>

        {linkedGoals.length === 0 ? (
          <button
            type="button"
            className="reward-detail__empty-link"
            onClick={() =>
              navigate('/goal/new', { state: { prefillRewardId: reward.id } })
            }
          >
            <Plus size={18} weight="bold" />
            Create a goal for this reward
          </button>
        ) : (
          <ul className="reward-detail__goals">
            {linkedGoals.map((goal) => (
              <GoalProgressRow
                key={goal.id}
                goal={goal}
                logs={logs}
                onClick={() => navigate(`/goal/${goal.id}`)}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="reward-detail__section">
        <div className="t-label muted">History</div>
        <ul className="reward-detail__timeline">
          {events.map((event) => (
            <li key={event.id} className="reward-detail__event">
              <span className={`reward-detail__event-dot reward-detail__event-dot--${event.kind}`} />
              <div>
                <div className="t-body-sm">{event.label}</div>
                <div className="t-caption muted">{formatDate(event.at)}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function GoalProgressRow({ goal, logs, onClick }) {
  const type = getGoalType(goal.type)
  const progress = goalProgress(goal, logs)
  const complete = Boolean(goal.completedAt) || progress.ratio >= 1

  return (
    <li>
      <motion.button
        type="button"
        className="reward-detail__goal"
        onClick={onClick}
        whileTap={{ scale: 0.985 }}
        style={{ '--goal-grad': type.gradient }}
      >
        <span className="reward-detail__goal-icon" aria-hidden>
          {goal.emoji || type.emoji}
        </span>
        <span className="reward-detail__goal-body">
          <span className="t-body-lg">{goal.name}</span>
          <span className="t-body-sm muted">
            {complete
              ? `Completed ${formatShortDate(goal.completedAt)}`
              : `${progress.current} of ${progress.target}`}
          </span>
        </span>
        <ProgressRing
          value={progress.ratio}
          size="xs"
          preset={type.id}
          ariaLabel={`${goal.name} progress`}
        />
      </motion.button>
    </li>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div className="reward-detail__stat">
      <span className="reward-detail__stat-icon">{icon}</span>
      <span className="t-caption muted">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function rewardEvents(reward, goals) {
  const unlockEvents =
    reward.unlockHistory?.length > 0
      ? reward.unlockHistory
      : reward.unlockedAt
        ? [{ id: 'legacy-unlocked', at: reward.unlockedAt }]
        : []

  const claimEvents =
    reward.claimHistory?.length > 0
      ? reward.claimHistory
      : reward.claimedAt
        ? [{ id: 'legacy-claimed', at: reward.claimedAt }]
        : []

  return [
    ...unlockEvents.map((event, index) => {
      const goal = goals.find((g) => g.id === event.goalId)
      return {
        id: `unlock-${event.id || index}`,
        kind: 'unlock',
        at: event.at,
        label: goal ? `Achieved through ${goal.name}` : 'Reward achieved',
      }
    }),
    ...claimEvents.map((event, index) => ({
      id: `claim-${event.id || index}`,
      kind: 'claim',
      at: event.at,
      label: 'Reward claimed',
    })),
    {
      id: 'created',
      kind: 'created',
      at: reward.createdAt,
      label: 'Reward created',
    },
  ]
    .filter((event) => event.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
}

function statusLabel(status) {
  if (status === 'unlocked') return 'Ready to claim'
  if (status === 'claimed') return 'Claimed'
  if (status === 'draft') return 'Not linked'
  return 'In progress'
}

function statusIcon(status) {
  if (status === 'unlocked') return <Sparkle size={12} weight="fill" />
  if (status === 'claimed') return <CheckCircle size={12} weight="fill" />
  if (status === 'draft') return <Gift size={12} weight="fill" />
  return <LockSimple size={12} weight="fill" />
}

function progressText({ reward, status, summary }) {
  if (status === 'unlocked') return 'Unlocked'
  if (status === 'claimed') return 'Claimed'
  if (!summary.total) return 'No goals yet'
  const pct = `${Math.round(summary.ratio * 100)}%`
  if ((reward.unlockMode || 'each') === 'all' && summary.total > 1) {
    return `${summary.completed}/${summary.total} goals · ${pct}`
  }
  if ((reward.unlockMode || 'each') === 'any' && summary.total > 1) {
    return `Best goal · ${pct}`
  }
  return pct
}

function formatDate(value) {
  if (!value) return 'No date yet'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatShortDate(value) {
  if (!value) return 'Not yet'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}
