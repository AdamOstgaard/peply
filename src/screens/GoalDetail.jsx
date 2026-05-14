import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUUpLeft } from '@phosphor-icons/react'
import { Button } from '../components/Button.jsx'
import { ProgressRing } from '../components/ProgressRing.jsx'
import { MomentumBar } from '../components/MomentumMeter.jsx'
import { ScreenHeader } from '../components/ScreenHeader.jsx'
import { useStore } from '../lib/store.jsx'
import {
  getGoalType,
  goalProgress,
  loggedToday,
  todayKey,
} from '../lib/domain.js'
import './GoalDetail.css'

export function GoalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    state: { goals, logs, rewards },
    actions: { removeLog, pushToast, archiveGoal, logProgress },
  } = useStore()

  const goal = goals.find((g) => g.id === id)

  const reward = useMemo(
    () => (goal?.rewardId ? rewards.find((r) => r.id === goal.rewardId) : null),
    [goal, rewards],
  )

  if (!goal) {
    return (
      <div className="goal-detail">
        <ScreenHeader title="Goal" />
        <div className="goal-detail__missing">
          <p className="t-body">This goal isn't here anymore.</p>
          <Button onClick={() => navigate('/')}>Back home</Button>
        </div>
      </div>
    )
  }

  const type = getGoalType(goal.type)
  const progress = goalProgress(goal, logs)
  const isLoggedToday = loggedToday(goal, logs)
  const isComplete = progress.ratio >= 1
  const goalLogs = progress.goalLogs.slice(0, 10)

  const cta = type.cta
  const ctaVariant =
    type.id === 'count'
      ? 'warm'
      : type.id === 'habit'
        ? 'celebration'
        : type.id === 'avoid'
          ? 'cool'
          : 'primary'

  const handleLog = () => {
    if (type.id !== 'count' && isLoggedToday) return
    logProgress(goal)
  }

  const handleUndo = () => {
    const today = todayKey()
    const todayLog = logs.find((l) => l.goalId === goal.id && l.date === today)
    if (todayLog) {
      removeLog(todayLog.id)
      pushToast({ message: 'Undone. No harm done.', variant: 'info' })
    }
  }

  return (
    <div className="goal-detail">
      <ScreenHeader transparent />

      <div className="goal-detail__hero" style={{ '--type-grad': type.gradient }}>
        <div className="goal-detail__hero-art" aria-hidden />
        <div className="goal-detail__hero-content">
          <span className="goal-detail__emoji" aria-hidden>
            {goal.emoji || type.emoji}
          </span>
          <h1 className="t-headline">{goal.name}</h1>
          <span className="t-label hero-chip">{type.name}</span>
        </div>
        <div className="goal-detail__ring">
          <ProgressRing
            value={progress.ratio}
            size="lg"
            preset={type.id}
            trackColor="rgba(255,255,255,0.2)"
          >
            <span className="t-mono goal-detail__ring-pct">
              {Math.round(progress.ratio * 100)}%
            </span>
          </ProgressRing>
        </div>
      </div>

      <section className="goal-detail__action">
        {isComplete ? (
          <Button variant="cool" block disabled>
            Complete ✓
          </Button>
        ) : (
          <Button
            variant={ctaVariant}
            block
            onClick={handleLog}
            disabled={type.id !== 'count' && isLoggedToday}
          >
            {isLoggedToday && type.id !== 'count' ? 'Done for today ✓' : cta}
          </Button>
        )}
        {isLoggedToday && type.id !== 'count' && (
          <button type="button" className="undo-btn" onClick={handleUndo}>
            <ArrowUUpLeft size={14} weight="bold" /> Undo today's log
          </button>
        )}
      </section>

      <section className="goal-detail__stats">
        <div className="t-mono-lg goal-detail__count">
          {progress.current}
          <span className="t-body-sm muted"> / {progress.target}</span>
        </div>
        <div className="t-body-sm muted">
          {type.id === 'count' && (goal.unit || 'completed')}
          {type.id === 'habit' && 'sessions logged'}
          {type.id === 'avoid' && 'on-track days'}
          {type.id === 'milestone' &&
            (isComplete ? 'milestone achieved' : 'one big win to go')}
        </div>
        <motion.div
          className="goal-detail__bar"
          aria-hidden
        >
          <motion.span
            className="goal-detail__bar-fill"
            style={{ background: type.gradient }}
            initial={{ width: 0 }}
            animate={{ width: `${progress.ratio * 100}%` }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          />
        </motion.div>
        {reward && progress.ratio < 1 && (
          <p className="t-body-sm muted goal-detail__hint">
            Keep going — {Math.max(1, progress.target - progress.current)} more
            to unlock <strong>{reward.name}</strong>.
          </p>
        )}
        <MomentumBar logs={logs.filter((l) => l.goalId === goal.id)} />
      </section>

      {reward && (
        <section className="goal-detail__section">
          <div className="t-label muted">Reward</div>
          <button
            className={`reward-link ${
              progress.ratio >= 0.7 ? 'reward-link--glow' : ''
            }`}
            onClick={() => navigate('/rewards')}
            type="button"
          >
            <span className="reward-link__emoji">{reward.emoji || '🎁'}</span>
            <div className="reward-link__body">
              <div className="t-body-lg">{reward.name}</div>
              <div className="t-body-sm muted">
                {progress.ratio >= 1 ? 'Unlocked!' : 'Locked — for now.'}
              </div>
            </div>
          </button>
        </section>
      )}

      {!reward && progress.ratio < 1 && (
        <section className="goal-detail__section">
          <button
            type="button"
            className="reward-attach"
            onClick={() => navigate('/rewards')}
          >
            <span>🎁</span> Add a reward to work toward →
          </button>
        </section>
      )}

      {goalLogs.length > 0 && (
        <section className="goal-detail__section">
          <div className="t-label muted">Recent activity</div>
          <ul className="log-list">
            {goalLogs.map((l) => (
              <li key={l.id} className="log-list__row">
                <span className="t-body-sm">{l.date}</span>
                <span className="t-body-sm muted">
                  {l.kind === 'increment'
                    ? `+${l.value || 1}`
                    : l.kind === 'on-track'
                      ? 'On track'
                      : 'Done'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="goal-detail__section">
        <p className="goal-detail__motivation t-body muted">
          {isComplete
            ? "You did this. That's the version of you that follows through."
            : goal.motivation
              ? `"${goal.motivation}"`
              : 'Small progress still moves you forward.'}
        </p>
      </section>

      <section className="goal-detail__section goal-detail__actions">
        <button
          type="button"
          className="ghost-link"
          onClick={() => {
            archiveGoal(goal.id)
            pushToast({ message: 'Goal archived. No judgment.', variant: 'info' })
            navigate('/')
          }}
        >
          Archive goal
        </button>
      </section>
    </div>
  )
}
