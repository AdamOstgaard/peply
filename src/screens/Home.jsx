import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus } from '@phosphor-icons/react'
import { GoalCard } from '../components/GoalCard.jsx'
import { MomentumMeter } from '../components/MomentumMeter.jsx'
import { EmptyState, SeedIllustration } from '../components/EmptyState.jsx'
import { Button } from '../components/Button.jsx'
import { useStore } from '../lib/store.jsx'
import {
  getGoalType,
  goalProgress,
  loggedToday,
  recoveryCopy,
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

  const activeRewards = useMemo(() => {
    const linked = new Set(activeGoals.map((g) => g.rewardId).filter(Boolean))
    return rewards.filter((r) => linked.has(r.id) && !r.claimedAt)
  }, [activeGoals, rewards])

  const completedRecent = useMemo(() => {
    return goals
      .filter((g) => g.completedAt)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
      .slice(0, 5)
  }, [goals])

  const greeting = useMemo(() => timeOfDayGreeting(), [])
  const allLoggedToday =
    activeGoals.length > 0 &&
    activeGoals.every((g) => loggedToday(g, logs))

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

  const handleLog = (goal) => logProgress(goal)

  return (
    <div className="home">
      <Header
        greeting={greeting}
        name={user.name}
        celebrate={allLoggedToday}
        recovery={showRecovery ? recoveryLine : null}
      />

      {activeRewards.length > 0 && (
        <section className="home__rewards" aria-label="Active rewards">
          <div className="home__rewards-scroll">
            {activeRewards.map((reward) => {
              const linkedGoal = activeGoals.find((g) => g.rewardId === reward.id)
              const progress = linkedGoal
                ? goalProgress(linkedGoal, logs).ratio
                : 0
              return (
                <RewardTeaser
                  key={reward.id}
                  reward={reward}
                  progress={progress}
                  onClick={() => navigate('/rewards')}
                />
              )
            })}
          </div>
        </section>
      )}

      <section className="home__section">
        {activeGoals.length > 0 && (
          <div className="home__section-head">
            <h2 className="t-title">Today</h2>
            <span className="chip">{activeGoals.length}</span>
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
            {activeGoals.slice(0, 6).map((goal) => (
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

      {completedRecent.length > 0 && (
        <section className="home__section">
          <div className="t-label muted home__wins-label">Recent wins</div>
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

function Header({ greeting, name, celebrate, recovery }) {
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
      </div>
      <div className="home-header__avatar" aria-hidden>
        {name?.[0]?.toUpperCase() ?? '·'}
      </div>
    </div>
  )
}

function RewardTeaser({ reward, progress, onClick }) {
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
        <div className="t-body-sm muted">You're {pct}% there</div>
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
