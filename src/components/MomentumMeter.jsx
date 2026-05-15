import { motion, useReducedMotion } from 'framer-motion'
import {
  lastNDays,
  momentumLabel,
  momentumScore,
  momentumStats,
  todayKey,
} from '../lib/domain.js'
import './MomentumMeter.css'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function MomentumMeter({ logs }) {
  const reduce = useReducedMotion()
  const stats = momentumStats(logs)
  const label = momentumLabel(stats)
  const days = lastNDays(7)
  const today = todayKey()

  const dayState = days.map((d) => {
    if (logs.some((l) => l.date === d)) return 'active'
    if (d === today) return 'today'
    return 'empty'
  })

  // Re-order labels so they map to the actual weekday of each day in the 7-day window.
  const labels = days.map((d) => {
    const day = new Date(d).getDay() // 0=Sun
    return DAY_LABELS[(day + 6) % 7]
  })

  return (
    <section className="momentum" aria-label={`Momentum: ${label.label}`}>
      <header className="momentum__head">
        <div>
          <div className="t-label muted">Momentum</div>
          <div className="momentum__label">
            <span aria-hidden>{label.emoji}</span> {label.label}
          </div>
          <div className="momentum__meaning t-body-sm muted">
            {stats.activeCount} of 7 days checked in
          </div>
        </div>
        <div className="momentum__side">
          <span
            className={`momentum__today ${
              stats.todayActive ? 'momentum__today--active' : ''
            }`}
          >
            {stats.todayActive ? 'Today done' : 'Today open'}
          </span>
          <div className="t-body-sm muted momentum__copy">{label.copy}</div>
        </div>
      </header>
      <div className="momentum__row" role="list">
        {dayState.map((s, i) => (
          <div className="momentum__cell" key={days[i]} role="listitem">
            <motion.div
              className={`momentum__dot momentum__dot--${s}`}
              initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: reduce ? 0 : 0.04 * i,
                type: 'spring',
                stiffness: 380,
                damping: 22,
              }}
              aria-label={`${labels[i]} ${s}`}
            />
            <span className="t-caption muted">{labels[i]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function MomentumBar({ logs }) {
  const stats = momentumStats(logs)
  const score = momentumScore(logs)
  const label = momentumLabel(stats)
  return (
    <div className="momentum-bar">
      <div className="momentum-bar__head">
        <span>
          <span className="t-label muted">Goal rhythm</span>
          <span className="momentum-bar__meaning t-caption muted">
            {stats.activeCount}/7 days
          </span>
        </span>
        <span className="t-body-sm momentum-bar__status">
          <span aria-hidden>{label.emoji}</span> {label.label}
        </span>
      </div>
      <div className="momentum-bar__track">
        <motion.div
          className="momentum-bar__fill"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}
