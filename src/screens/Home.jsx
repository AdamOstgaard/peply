import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Plus } from '@phosphor-icons/react'
import { GoalCard } from '../components/GoalCard.jsx'
import { MomentumMeter } from '../components/MomentumMeter.jsx'
import { EmptyState, SeedIllustration } from '../components/EmptyState.jsx'
import { Button } from '../components/Button.jsx'
import { useStore } from '../lib/store.jsx'
import {
  getGoalType,
  goalsLinkedTo,
  isGoalDueToday,
  loggedToday,
  nextScheduledLabel,
  recoveryCopy,
  rewardProgressSummary,
  rewardStatus,
  timeOfDayGreeting,
} from '../lib/domain.js'
import './Home.css'

export function Home() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const {
    state: { user, goals, rewards, logs },
    actions: { logProgress },
  } = useStore()

  const activeGoals = useMemo(
    () => goals.filter((g) => !g.archivedAt && !g.completedAt),
    [goals],
  )

  const dueGoals = useMemo(
    () => activeGoals.filter((g) => isGoalDueToday(g)),
    [activeGoals],
  )

  const upcomingGoals = useMemo(
    () => activeGoals.filter((g) => !isGoalDueToday(g)),
    [activeGoals],
  )

  const activeRewards = useMemo(() => {
    return rewards
      .map((reward) => {
        const linkedGoals = goalsLinkedTo(reward.id, goals)
        const summary = rewardProgressSummary(reward, linkedGoals, logs)
        const status = rewardStatus(reward, linkedGoals, logs, summary)
        return { reward, progress: summary.ratio, status, summary }
      })
      .filter((r) => r.status === 'in-progress' || r.status === 'unlocked')
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === 'unlocked' ? -1 : 1
        return b.progress - a.progress
      })
  }, [goals, logs, rewards])

  const completedRecent = useMemo(() => {
    return goals
      .filter((g) => g.completedAt)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
      .slice(0, 5)
  }, [goals])

  const greeting = useMemo(() => timeOfDayGreeting(), [])
  const allLoggedToday =
    dueGoals.length > 0 && dueGoals.every((g) => loggedToday(g, logs))

  const recentActivity = logs.length > 0
  const lastActiveDate = logs[0]?.date
  const showRecovery =
    recentActivity &&
    lastActiveDate &&
    daysSince(lastActiveDate) >= 3 &&
    !allLoggedToday

  // Re-pick a fresh copy line whenever the last-active date changes — the
  // useMemo dep is intentional, not a stable identity.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recoveryLine = useMemo(() => recoveryCopy(), [lastActiveDate])

  const heroAction = useMemo(() => {
    const unloggedGoal = dueGoals.find((g) => !loggedToday(g, logs))
    const readyReward = activeRewards.find((r) => r.status === 'unlocked')
    const nearestReward = activeRewards[0]

    if (readyReward) {
      return {
        eyebrow: 'Reward ready',
        label: `Claim ${readyReward.reward.name}`,
        to: `/rewards/${readyReward.reward.id}`,
      }
    }
    if (unloggedGoal) {
      return {
        eyebrow: 'Next up',
        label: `${getGoalType(unloggedGoal.type).cta}: ${unloggedGoal.name}`,
        to: `/goal/${unloggedGoal.id}`,
      }
    }
    if (nearestReward) {
      return {
        eyebrow: 'Reward in reach',
        label: `Check ${nearestReward.reward.name}`,
        to: `/rewards/${nearestReward.reward.id}`,
      }
    }
    if (upcomingGoals[0]) {
      return {
        eyebrow: 'Coming up',
        label: `${upcomingGoals[0].name} · ${nextScheduledLabel(upcomingGoals[0])}`,
        to: `/goal/${upcomingGoals[0].id}`,
      }
    }
    if (completedRecent[0]) {
      return {
        eyebrow: 'Recent win',
        label: 'Open your brag board',
        to: '/achievements',
      }
    }
    return {
      eyebrow: 'Start here',
      label: 'Create your first goal',
      to: '/goal/new',
    }
  }, [activeRewards, completedRecent, dueGoals, logs, upcomingGoals])

  const handleLog = (goal) => logProgress(goal)

  return (
    <div className="home">
      <Header
        greeting={greeting}
        name={user.name}
        celebrate={allLoggedToday}
        recovery={showRecovery ? recoveryLine : null}
        action={heroAction}
        onAction={() => navigate(heroAction.to)}
      />

      {activeRewards.length > 0 && (
        <section className="home__rewards" aria-label="Active rewards">
          <div className="home__rewards-head">
            <div>
              <div className="t-label muted">Rewards in motion</div>
              <div className="t-body-sm muted">
                {activeRewards.length === 1
                  ? 'One reward to keep an eye on'
                  : `${activeRewards.length} rewards · swipe to see more`}
              </div>
            </div>
            {activeRewards.length > 1 && (
              <span className="home__rewards-swipe">
                Swipe <ArrowRight size={13} weight="bold" />
              </span>
            )}
          </div>
          <div className="home__rewards-window">
            <div className="home__rewards-scroll">
              {activeRewards.map(({ reward, progress, status }) => {
                return (
                  <RewardTeaser
                    key={reward.id}
                    reward={reward}
                    progress={progress}
                    status={status}
                    onClick={() => navigate(`/rewards/${reward.id}`)}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="home__section">
        {dueGoals.length > 0 && (
          <div className="home__section-head">
            <h2 className="t-title">Today</h2>
            <span className="chip">{dueGoals.length}</span>
          </div>
        )}

        {activeGoals.length === 0 ? (
          <EmptyState
            illustration={<SeedIllustration />}
            title="Start your first goal"
            body="Every big change starts with one small decision."
            action={
              <Button onClick={() => navigate('/goal/new')}>
                Create your first goal
              </Button>
            }
          />
        ) : dueGoals.length === 0 ? (
          <div className="rest-day-card">
            <div className="rest-day-card__emoji" aria-hidden>
              ☕
            </div>
            <div>
              <div className="t-title">Nothing due today</div>
              <p className="t-body-sm muted">
                Your scheduled habits are resting. Pick up the next one{' '}
                {nextDueCopy(upcomingGoals[0])}.
              </p>
            </div>
          </div>
        ) : (
          <motion.ul
            className="home__list"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduce ? 0 : 0.06 },
              },
            }}
          >
            {dueGoals.slice(0, 6).map((goal) => (
              <motion.li
                key={goal.id}
                variants={{
                  hidden: { opacity: 0, y: reduce ? 0 : 12 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
              >
                <GoalCard goal={goal} logs={logs} onLog={handleLog} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>

      {activeGoals.length > 0 && (
        <section className="home__section">
          <MomentumMeter logs={logs} />
        </section>
      )}

      {upcomingGoals.length > 0 && (
        <section className="home__section">
          <div className="home__section-head">
            <h2 className="t-title">Upcoming</h2>
            <span className="chip">{upcomingGoals.length}</span>
          </div>
          <ul className="home__list">
            {upcomingGoals.slice(0, 3).map((goal) => (
              <li key={goal.id}>
                <GoalCard
                  goal={goal}
                  logs={logs}
                  onLog={handleLog}
                  due={false}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {completedRecent.length > 0 && (
        <section className="home__section">
          <div className="home__wins-head">
            <div className="t-label muted home__wins-label">Recent wins</div>
            <Link to="/achievements" className="home__wins-link">
              Brag board
            </Link>
          </div>
          <div className="home__wins">
            {completedRecent.map((g) => (
              <div className="win-chip" key={g.id}>
                <span>{g.emoji || getGoalType(g.type).emoji}</span>
                <span className="t-body-sm">{g.name} ✓</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link to="/goal/new" className="fab" aria-label="Add goal">
        <Plus size={28} weight="bold" />
      </Link>
    </div>
  )
}

function daysSince(dateStr) {
  const then = new Date(dateStr).getTime()
  const now = Date.now()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

function nextDueCopy(goal) {
  const label = nextScheduledLabel(goal)
  if (label === 'Today') return 'today'
  if (label === 'Tomorrow') return 'tomorrow'
  return `on ${label}`
}

function Header({ greeting, name, celebrate, recovery, action, onAction }) {
  return (
    <div className={`home-header ${celebrate ? 'home-header--celebrate' : ''}`}>
      <div className="home-header__bg" aria-hidden />
      <div className="home-header__noise" aria-hidden />
      <div className="home-header__content">
        <div className="t-label home-header__greet">
          {celebrate ? 'You showed up today 🎉' : 'Peply'}
        </div>
        <h1 className="t-headline home-header__name">
          {celebrate ? `Nice work, ${name}.` : `Hi ${name}.`}
        </h1>
        <p className="t-body home-header__tag">{recovery || greeting}</p>
        {action && (
          <button
            type="button"
            className="home-header__action"
            onClick={onAction}
          >
            <span>
              <span className="home-header__action-eyebrow">
                {action.eyebrow}
              </span>
              <span className="home-header__action-label">{action.label}</span>
            </span>
            <ArrowRight size={18} weight="bold" />
          </button>
        )}
      </div>
      <div className="home-header__avatar" aria-hidden>
        {name?.[0]?.toUpperCase() ?? '·'}
      </div>
    </div>
  )
}

function RewardTeaser({ reward, progress, status, onClick }) {
  const pct = Math.round(progress * 100)
  return (
    <button
      type="button"
      className="reward-teaser"
      onClick={onClick}
      aria-label={`${reward.name}, ${pct}% of the way there`}
    >
      <div className="reward-teaser__emoji" aria-hidden>
        {reward.emoji || '🎁'}
      </div>
      <div className="reward-teaser__body">
        <div className="t-body-sm muted">
          {status === 'unlocked' ? 'Ready to claim' : `You're ${pct}% there`}
        </div>
        <div className="t-body-lg reward-teaser__name">{reward.name}</div>
        <div className="reward-teaser__bar">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </button>
  )
}
