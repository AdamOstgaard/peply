import { motion, useReducedMotion } from 'framer-motion'
import { Check, Plus } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { getGoalType, goalProgress, loggedToday } from '../lib/domain.js'
import { ProgressRing } from './ProgressRing.jsx'
import './GoalCard.css'

export function GoalCard({ goal, logs, onLog }) {
  const navigate = useNavigate()
  const type = getGoalType(goal.type)
  const progress = goalProgress(goal, logs)
  const isLoggedToday = loggedToday(goal, logs)
  const isDailyDone = goal.type !== 'count' && isLoggedToday
  const isComplete = progress.ratio >= 1
  const reduce = useReducedMotion()

  const handleCardTap = () => navigate(`/goal/${goal.id}`)
  const handleLog = (e) => {
    e.stopPropagation()
    if (isComplete || isDailyDone) return
    onLog?.(goal)
  }

  const progressText = formatProgressText(goal, progress)

  const handleCardKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardTap()
    }
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleCardTap}
      onKeyDown={handleCardKey}
      whileTap={{ scale: reduce ? 1 : 0.985 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`goal-card ${isDailyDone || isComplete ? 'goal-card--logged' : ''} ${
        isComplete ? 'goal-card--complete' : ''
      }`}
      style={{ '--strip': type.color }}
      aria-label={`${goal.name}, ${progressText}`}
    >
      <span className="goal-card__strip" aria-hidden />
      <span
        className="goal-card__icon"
        style={{ background: type.gradient }}
        aria-hidden
      >
        <span className="goal-card__emoji">{goal.emoji || type.emoji}</span>
      </span>
      <div className="goal-card__content">
        <div className="goal-card__title t-body-lg">{goal.name}</div>
        <div className="goal-card__meta t-body-sm muted">{progressText}</div>
        <div className="goal-card__bar" aria-hidden>
          <motion.span
            className="goal-card__bar-fill"
            style={{ background: type.gradient }}
            initial={{ width: 0 }}
            animate={{ width: `${progress.ratio * 100}%` }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          />
        </div>
      </div>
      <motion.button
        type="button"
        className={`goal-card__log ${
          isLoggedToday ? 'goal-card__log--done' : ''
        }`}
        whileTap={{ scale: reduce ? 1 : 0.85 }}
        transition={{ type: 'spring', stiffness: 700, damping: 22 }}
        onClick={handleLog}
        disabled={isComplete || isDailyDone}
        aria-label={
          isComplete
            ? `${goal.name} complete`
            : isDailyDone
              ? `${goal.name} logged today`
              : `Log ${goal.name}`
        }
        style={!isDailyDone && !isComplete ? { background: type.gradient } : undefined}
      >
        {isDailyDone || isComplete ? (
          <Check size={22} weight="bold" />
        ) : (
          <Plus size={22} weight="bold" />
        )}
      </motion.button>
    </motion.div>
  )
}

function formatProgressText(goal, progress) {
  if (goal.type === 'milestone') {
    return progress.ratio >= 1 ? 'Complete' : 'Tap when you make it happen'
  }
  if (goal.type === 'habit') {
    return `${progress.current} of ${progress.target} sessions`
  }
  if (goal.type === 'avoid') {
    return `${progress.current} on-track days`
  }
  const unit = goal.unit ? ` ${goal.unit}` : ''
  return `${progress.current} / ${progress.target}${unit}`
}

// Small variant for active-rewards strip
export function GoalRing({ goal, logs, size = 'md' }) {
  const type = getGoalType(goal.type)
  const p = goalProgress(goal, logs)
  return (
    <ProgressRing
      value={p.ratio}
      size={size}
      preset={type.id}
      ariaLabel={`${goal.name} progress`}
    >
      <span style={{ fontSize: size === 'lg' ? 28 : 20 }}>
        {goal.emoji || type.emoji}
      </span>
    </ProgressRing>
  )
}
