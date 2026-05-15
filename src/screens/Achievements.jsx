import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Copy,
  Gift,
  Sparkle,
  Target,
  Trophy,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { EmptyState, SeedIllustration } from '../components/EmptyState.jsx'
import { Button } from '../components/Button.jsx'
import { useStore } from '../lib/store.jsx'
import { getGoalType } from '../lib/domain.js'
import './Achievements.css'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'goals', label: 'Goals' },
  { id: 'rewards', label: 'Rewards' },
]

export function Achievements() {
  const navigate = useNavigate()
  const {
    state: { goals, rewards },
    actions: { pushToast },
  } = useStore()
  const [tab, setTab] = useState('all')

  const accomplishments = useMemo(
    () => buildAccomplishments({ goals, rewards }),
    [goals, rewards],
  )

  const filtered = useMemo(() => {
    if (tab === 'goals') return accomplishments.filter((a) => a.kind === 'goal')
    if (tab === 'rewards')
      return accomplishments.filter((a) => a.kind === 'reward')
    return accomplishments
  }, [accomplishments, tab])

  const completedGoals = accomplishments.filter((a) => a.kind === 'goal').length
  const earnedRewards = accomplishments.filter((a) => a.kind === 'reward').length

  const copyBrag = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      pushToast({ message: 'Brag copied. Go be proud.', variant: 'success' })
    } catch {
      pushToast({ message: 'Could not copy right now.', variant: 'info' })
    }
  }

  const headline =
    accomplishments.length > 0
      ? `I completed ${completedGoals} ${completedGoals === 1 ? 'goal' : 'goals'} and earned ${earnedRewards} ${earnedRewards === 1 ? 'reward' : 'rewards'} with Peply.`
      : 'My Peply brag board is just getting started.'

  return (
    <div className="achievements">
      <header className="achievements__hero">
        <div className="achievements__hero-bg" aria-hidden />
        <div className="achievements__mark" aria-hidden>
          <Trophy size={34} weight="fill" />
        </div>
        <div className="t-label achievements__eyebrow">Brag board</div>
        <h1 className="t-headline">Proof you followed through.</h1>
        <p className="t-body achievements__copy">{headline}</p>
        {accomplishments.length > 0 && (
          <Button
            size="md"
            variant="celebration"
            leftIcon={<Copy size={18} weight="bold" />}
            onClick={() => copyBrag(headline)}
          >
            Copy brag
          </Button>
        )}
      </header>

      <section className="achievements__stats">
        <Stat icon={<Target size={18} weight="fill" />} value={completedGoals} label="Goals done" />
        <Stat icon={<Gift size={18} weight="fill" />} value={earnedRewards} label="Rewards earned" />
        <Stat icon={<Sparkle size={18} weight="fill" />} value={accomplishments.length} label="Total wins" />
      </section>

      <div className="tabs achievements__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab ${tab === t.id ? 'tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          illustration={<SeedIllustration />}
          title={tab === 'all' ? 'No wins yet' : `No ${tab} yet`}
          body="Finish a goal or claim a reward and it will live here."
          action={<Button onClick={() => navigate('/goal/new')}>Start a goal</Button>}
        />
      ) : (
        <motion.ul
          className="achievements__list"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {filtered.map((item) => (
            <motion.li
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.24 }}
            >
              <AchievementCard
                item={item}
                onOpen={() => navigate(item.href)}
                onCopy={() => copyBrag(item.brag)}
              />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}

function AchievementCard({ item, onOpen, onCopy }) {
  return (
    <article className={`achievement achievement--${item.kind}`}>
      <button
        type="button"
        className="achievement__main"
        onClick={onOpen}
        aria-label={`Open ${item.title}`}
      >
        <span className="achievement__icon" aria-hidden>
          {item.emoji}
        </span>
        <span className="achievement__body">
          <span className="achievement__type t-label">
            {item.kind === 'goal' ? 'Goal completed' : item.status}
          </span>
          <span className="achievement__title t-body-lg">{item.title}</span>
          <span className="t-body-sm muted">{item.detail}</span>
          <span className="achievement__date t-caption">{formatDate(item.date)}</span>
        </span>
      </button>
      <button
        type="button"
        className="achievement__copy"
        onClick={onCopy}
        aria-label={`Copy brag for ${item.title}`}
      >
        <Copy size={18} weight="bold" />
      </button>
    </article>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div className="achievements__stat">
      <span className="achievements__stat-icon">{icon}</span>
      <strong>{value}</strong>
      <span className="t-caption muted">{label}</span>
    </div>
  )
}

function buildAccomplishments({ goals, rewards }) {
  const goalWins = goals
    .filter((goal) => goal.completedAt)
    .map((goal) => {
      const type = getGoalType(goal.type)
      return {
        id: `goal-${goal.id}`,
        kind: 'goal',
        title: goal.name,
        emoji: goal.emoji || type.emoji,
        date: goal.completedAt,
        detail: type.name,
        href: `/goal/${goal.id}`,
        brag: `I completed "${goal.name}" with Peply.`,
      }
    })

  const rewardWins = rewards.flatMap((reward) => {
    const unlocks =
      reward.unlockHistory?.length > 0
        ? reward.unlockHistory
        : reward.unlockedAt
          ? [{ id: 'legacy', at: reward.unlockedAt }]
          : []

    return unlocks.map((unlock, index) => {
      const claim = findClaimForUnlock(reward, unlock.at)
      const achieved = claim?.at || unlock.at
      const claimed = Boolean(claim || reward.claimedAt)
      return {
        id: `reward-${reward.id}-${unlock.id || index}`,
        kind: 'reward',
        status: claimed ? 'Reward claimed' : 'Reward earned',
        title: reward.name,
        emoji: reward.emoji || '🎁',
        date: achieved,
        detail: claimed
          ? `Claimed ${formatDate(achieved)}`
          : `Earned ${formatDate(achieved)}`,
        href: `/rewards/${reward.id}`,
        brag: `I earned "${reward.name}" with Peply.`,
      }
    })
  })

  return [...goalWins, ...rewardWins].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

function findClaimForUnlock(reward, unlockedAt) {
  const claims = reward.claimHistory || []
  if (!claims.length) return reward.claimedAt ? { at: reward.claimedAt } : null
  const unlockTime = new Date(unlockedAt).getTime()
  return claims.find((claim) => new Date(claim.at).getTime() >= unlockTime)
}

function formatDate(value) {
  if (!value) return 'No date'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}
