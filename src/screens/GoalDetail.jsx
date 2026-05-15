import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUUpLeft, Plus, Trash, Check } from '@phosphor-icons/react'
import { Button } from '../components/Button.jsx'
import { ProgressRing } from '../components/ProgressRing.jsx'
import { MomentumBar } from '../components/MomentumMeter.jsx'
import { ScreenHeader } from '../components/ScreenHeader.jsx'
import { useStore } from '../lib/store.jsx'
import {
  getGoalType,
  goalProgress,
  isGoalDueToday,
  loggedToday,
  nextScheduledLabel,
  scheduleLabel,
  todayKey,
} from '../lib/domain.js'
import './GoalDetail.css'

export function GoalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    state: { goals, logs, rewards },
    actions: { removeLog, pushToast, archiveGoal, logProgress, addMilestone, toggleMilestone, deleteMilestone },
  } = useStore()

  const goal = goals.find((g) => g.id === id)

  const reward = useMemo(
    () => (goal?.rewardId ? rewards.find((r) => r.id === goal.rewardId) : null),
    [goal, rewards],
  )

  if (!goal) {
    return (
      <div className="goal-detail">
        <ScreenHeader title="Goal" fallback="/goals" />
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
  const isOffSchedule = type.id === 'habit' && !isGoalDueToday(goal)
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
    if (isOffSchedule) return
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
      <ScreenHeader transparent fallback="/goals" />

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
            disabled={isOffSchedule || (type.id !== 'count' && isLoggedToday)}
          >
            {isOffSchedule
              ? `Next session ${nextScheduledLabel(goal)}`
              : isLoggedToday && type.id !== 'count'
                ? 'Done for today ✓'
                : cta}
          </Button>
        )}
        {isOffSchedule && !isComplete && (
          <p className="goal-detail__schedule-note t-body-sm muted">
            Scheduled {scheduleLabel(goal.schedule)}.
          </p>
        )}
        {isLoggedToday && type.id !== 'count' && !isOffSchedule && (
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
          {type.id === 'habit' &&
            `sessions logged · ${scheduleLabel(goal.schedule)}`}
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

      <MilestonesSection
        goal={goal}
        onAdd={(label) => addMilestone(goal.id, label)}
        onToggle={(milestoneId) => toggleMilestone(goal.id, milestoneId)}
        onDelete={(milestoneId) => deleteMilestone(goal.id, milestoneId)}
      />

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

function MilestonesSection({ goal, onAdd, onToggle, onDelete }) {
  const [newLabel, setNewLabel] = useState('')
  const [adding, setAdding] = useState(false)
  const milestones = goal.milestones || []
  const completed = milestones.filter((m) => m.completedAt).length

  const handleAdd = () => {
    const label = newLabel.trim()
    if (!label) return
    onAdd(label)
    setNewLabel('')
    setAdding(false)
  }

  const handleCancel = () => {
    setAdding(false)
    setNewLabel('')
  }

  return (
    <section className="goal-detail__section">
      <div className="milestones__header">
        <div className="t-label muted">
          Milestones{milestones.length > 0 ? ` · ${completed}/${milestones.length}` : ''}
        </div>
        {!adding && (
          <button
            type="button"
            className="milestones__add-btn"
            onClick={() => setAdding(true)}
            aria-label="Add milestone"
          >
            <Plus size={14} weight="bold" /> Add
          </button>
        )}
      </div>

      {milestones.length > 0 && (
        <ul className="milestones__list">
          {milestones.map((m) => (
            <li key={m.id} className={`milestones__item ${m.completedAt ? 'milestones__item--done' : ''}`}>
              <button
                type="button"
                className="milestones__check"
                onClick={() => onToggle(m.id)}
                aria-label={m.completedAt ? `Uncheck ${m.label}` : `Check ${m.label}`}
              >
                {m.completedAt && <Check size={13} weight="bold" />}
              </button>
              <span className="milestones__label t-body-sm">{m.label}</span>
              <button
                type="button"
                className="milestones__delete"
                onClick={() => onDelete(m.id)}
                aria-label={`Delete ${m.label}`}
              >
                <Trash size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <div className="milestones__form">
          <input
            className="milestones__input"
            autoFocus
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Milestone description…"
            maxLength={80}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') handleCancel()
            }}
          />
          <div className="milestones__form-actions">
            <button type="button" className="milestones__save" onClick={handleAdd} disabled={!newLabel.trim()}>
              Save
            </button>
            <button type="button" className="milestones__cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {milestones.length === 0 && !adding && (
        <p className="t-body-sm muted">Break this goal into smaller steps.</p>
      )}
    </section>
  )
}
