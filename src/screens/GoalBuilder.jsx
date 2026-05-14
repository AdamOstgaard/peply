import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Check } from '@phosphor-icons/react'
import { Button } from '../components/Button.jsx'
import { ScreenHeader } from '../components/ScreenHeader.jsx'
import { useStore } from '../lib/store.jsx'
import {
  GOAL_TYPES,
  UNLOCK_MODES,
  getGoalType,
  goalsLinkedTo,
} from '../lib/domain.js'
import './GoalBuilder.css'

const EMOJI_POOL = [
  '🎯', '⚡', '🌱', '🏃', '🧘', '📚', '✍️', '💧', '🥗', '🛌', '🎨',
  '🎸', '🧠', '💪', '🪴', '🧹', '💰', '☀️', '🚭', '📱', '💸', '🧴',
]

const STEPS = ['name', 'type', 'target', 'reward', 'why', 'confirm']

function freshDraft() {
  return {
    data: {
      name: '',
      emoji: EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)],
      type: 'habit',
      target: 7,
      unit: '',
      schedule: ['mon', 'wed', 'fri'],
      rewardId: null,
      motivation: '',
    },
    step: 0,
  }
}

export function GoalBuilder() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const {
    state: { rewards, goals, goalDraft },
    actions: {
      addGoal,
      pushToast,
      setGoalDraft,
      clearGoalDraft,
      updateReward,
    },
  } = useStore()

  // Hydrate from the persisted draft on first mount (covers the round-trip
  // through reward creation). If none, seed a fresh one and persist it.
  const [initial] = useState(() => goalDraft ?? freshDraft())
  const [step, setStep] = useState(initial.step)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState(initial.data)

  useEffect(() => {
    // Seed the store so a side-trip can hydrate on return.
    if (!goalDraft) setGoalDraft(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setGoalDraft({ data, step })
  }, [data, step, setGoalDraft])

  const update = (patch) => setData((d) => ({ ...d, ...patch }))

  const goNext = () => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const goBack = () => {
    if (step === 0) {
      clearGoalDraft()
      return navigate(-1)
    }
    setDirection(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  const handleSubmit = () => {
    const goal = addGoal({
      name: data.name.trim(),
      emoji: data.emoji,
      type: data.type,
      target: data.target,
      unit: data.unit,
      schedule: data.schedule,
      rewardId: data.rewardId,
      motivation: data.motivation.trim(),
    })
    clearGoalDraft()
    pushToast({ message: "Goal saved. Let's go.", variant: 'info' })
    navigate(`/goal/${goal.id}`, { replace: true })
  }

  return (
    <div className="builder">
      <ScreenHeader onBack={goBack} title="" />
      <div className="builder__dots" aria-hidden>
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`builder__dot ${
              i === step ? 'builder__dot--active' : ''
            } ${i < step ? 'builder__dot--done' : ''}`}
          />
        ))}
      </div>

      <div className="builder__stage">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: reduce ? 0 : direction * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : -direction * 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className="builder__step"
          >
            {step === 0 && (
              <StepName data={data} update={update} onNext={goNext} />
            )}
            {step === 1 && (
              <StepType
                data={data}
                update={(t) => {
                  update({ type: t })
                  setTimeout(goNext, 220)
                }}
              />
            )}
            {step === 2 && (
              <StepTarget data={data} update={update} onNext={goNext} />
            )}
            {step === 3 && (
              <StepReward
                data={data}
                update={update}
                rewards={rewards}
                goals={goals}
                onUnlockModeChange={(rewardId, mode) =>
                  updateReward(rewardId, { unlockMode: mode })
                }
                onNext={goNext}
                onCreate={() =>
                  navigate('/reward/new', {
                    state: { returnTo: '/goal/new' },
                  })
                }
              />
            )}
            {step === 4 && (
              <StepWhy data={data} update={update} onNext={goNext} />
            )}
            {step === 5 && (
              <StepConfirm data={data} onSubmit={handleSubmit} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------ Steps ------------------------ */

function StepName({ data, update, onNext }) {
  const valid = data.name.trim().length >= 3
  return (
    <>
      <h2 className="builder__q t-headline">What are you working on?</h2>
      <p className="t-body muted builder__hint">
        Name it like you'd describe it to a friend.
      </p>
      <input
        className="hero-input"
        autoFocus
        value={data.name}
        onChange={(e) => update({ name: e.target.value })}
        placeholder="Run 3x a week"
        maxLength={60}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && valid) onNext()
        }}
      />
      <div className="builder__emoji-row" role="radiogroup" aria-label="Goal emoji">
        {EMOJI_POOL.map((e) => (
          <button
            key={e}
            type="button"
            role="radio"
            aria-checked={data.emoji === e}
            className={`builder__emoji ${
              data.emoji === e ? 'builder__emoji--active' : ''
            }`}
            onClick={() => update({ emoji: e })}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="builder__cta">
        <Button disabled={!valid} onClick={onNext} block>
          Looks good →
        </Button>
      </div>
    </>
  )
}

function StepType({ data, update }) {
  return (
    <>
      <h2 className="builder__q t-headline">What kind of goal?</h2>
      <p className="t-body muted builder__hint">
        Pick the shape that fits — you can refine the details next.
      </p>
      <div className="type-grid">
        {GOAL_TYPES.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => update(t.id)}
            className={`type-card ${
              data.type === t.id ? 'type-card--active' : ''
            }`}
            style={{ '--type-grad': t.gradient }}
          >
            <span className="type-card__emoji">{t.emoji}</span>
            <span className="t-title type-card__name">{t.name}</span>
            <span className="t-body-sm muted">{t.description}</span>
          </motion.button>
        ))}
      </div>
    </>
  )
}

function StepTarget({ data, update, onNext }) {
  const type = getGoalType(data.type)
  return (
    <>
      <h2 className="builder__q t-headline">
        {type.id === 'milestone'
          ? 'When do you want this done?'
          : type.id === 'habit'
            ? 'Which days?'
            : type.id === 'avoid'
              ? 'How long do you want to stay clear?'
              : 'How much do you want to do?'}
      </h2>

      {type.id === 'count' && (
        <CountTarget data={data} update={update} />
      )}
      {type.id === 'habit' && <HabitTarget data={data} update={update} />}
      {type.id === 'avoid' && <CountTarget data={data} update={update} unitDefault="days" />}
      {type.id === 'milestone' && <MilestoneTarget data={data} update={update} />}

      <div className="builder__cta">
        <Button block onClick={onNext}>
          Looking good →
        </Button>
      </div>
    </>
  )
}

function CountTarget({ data, update, unitDefault = 'times' }) {
  const dec = () => update({ target: Math.max(1, (data.target || 1) - 1) })
  const inc = () => update({ target: (data.target || 0) + 1 })
  return (
    <div className="target-count">
      <div className="stepper">
        <button type="button" className="stepper__btn" onClick={dec} aria-label="Decrease">
          <Minus size={20} weight="bold" />
        </button>
        <div className="stepper__value t-mono-lg">{data.target || 1}</div>
        <button type="button" className="stepper__btn" onClick={inc} aria-label="Increase">
          <Plus size={20} weight="bold" />
        </button>
      </div>
      <input
        className="unit-input"
        value={data.unit}
        onChange={(e) => update({ unit: e.target.value })}
        placeholder={unitDefault}
        aria-label="Unit"
      />
    </div>
  )
}

const DAYS = [
  { id: 'mon', label: 'M' },
  { id: 'tue', label: 'T' },
  { id: 'wed', label: 'W' },
  { id: 'thu', label: 'T' },
  { id: 'fri', label: 'F' },
  { id: 'sat', label: 'S' },
  { id: 'sun', label: 'S' },
]

function HabitTarget({ data, update }) {
  const schedule = data.schedule || []
  const toggle = (id) => {
    const next = schedule.includes(id)
      ? schedule.filter((d) => d !== id)
      : [...schedule, id]
    update({ schedule: next, target: Math.max(7, next.length * 4) })
  }
  return (
    <div className="target-habit">
      <div className="day-row">
        {DAYS.map((d) => {
          const active = schedule.includes(d.id)
          return (
            <button
              key={d.id}
              type="button"
              className={`day-chip ${active ? 'day-chip--active' : ''}`}
              onClick={() => toggle(d.id)}
              aria-pressed={active}
            >
              {d.label}
            </button>
          )
        })}
      </div>
      <p className="t-body muted target-habit__copy">
        {schedule.length === 0
          ? 'Pick at least one day.'
          : `${schedule.length} ${
              schedule.length === 1 ? 'day' : 'days'
            } a week — aiming for ${data.target || schedule.length * 4} sessions total.`}
      </p>
    </div>
  )
}

function MilestoneTarget({ data, update }) {
  const [hasDate, setHasDate] = useState(Boolean(data.deadline))
  return (
    <div className="target-milestone">
      <label className="toggle">
        <input
          type="checkbox"
          checked={hasDate}
          onChange={(e) => {
            setHasDate(e.target.checked)
            if (!e.target.checked) update({ deadline: null })
          }}
        />
        <span>Set a target date</span>
      </label>
      {hasDate && (
        <input
          type="date"
          className="date-input"
          value={data.deadline || ''}
          onChange={(e) => update({ deadline: e.target.value })}
        />
      )}
      {!hasDate && (
        <p className="t-body muted">No date — just one big win when you're ready.</p>
      )}
    </div>
  )
}

function StepReward({
  data,
  update,
  rewards,
  goals,
  onUnlockModeChange,
  onCreate,
  onNext,
}) {
  const selected = rewards.find((r) => r.id === data.rewardId)
  // Other goals already linked to the selected reward (the new goal isn't in
  // the goals list yet — we're still building it).
  const otherLinked = selected ? goalsLinkedTo(selected.id, goals) : []
  const isShared = otherLinked.length > 0
  const currentMode = selected?.unlockMode || 'each'

  return (
    <>
      <h2 className="builder__q t-headline">
        <span aria-hidden>🎁 </span>What will you earn?
      </h2>
      <p className="t-body muted builder__hint">
        Effort is sweeter when something good is waiting.
      </p>

      <div className="reward-pick">
        {rewards.length > 0 && (
          <div className="reward-pick__list">
            {rewards.slice(0, 6).map((r) => {
              const active = data.rewardId === r.id
              const sharedWith = goalsLinkedTo(r.id, goals).length
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => update({ rewardId: active ? null : r.id })}
                  className={`reward-pill ${active ? 'reward-pill--active' : ''}`}
                  aria-pressed={active}
                >
                  <span className="reward-pill__emoji">{r.emoji || '🎁'}</span>
                  <span className="reward-pill__name">{r.name}</span>
                  {sharedWith > 0 && (
                    <span className="reward-pill__count" aria-hidden>
                      {sharedWith} linked
                    </span>
                  )}
                  {active && <Check size={16} weight="bold" />}
                </button>
              )
            })}
          </div>
        )}
        <button type="button" className="reward-pick__create" onClick={onCreate}>
          + Create a new reward
        </button>
      </div>

      {selected && isShared && (
        <div className="unlock-mode">
          <div className="t-label muted">
            Shared with {otherLinked.length} other{' '}
            {otherLinked.length === 1 ? 'goal' : 'goals'}
          </div>
          <p className="t-body-sm muted unlock-mode__hint">
            How should you earn <strong>{selected.name}</strong>?
          </p>
          <div className="unlock-mode__list">
            {UNLOCK_MODES.map((m) => {
              const active = currentMode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onUnlockModeChange(selected.id, m.id)}
                  className={`unlock-card ${
                    active ? 'unlock-card--active' : ''
                  }`}
                  aria-pressed={active}
                >
                  <span className="unlock-card__emoji" aria-hidden>
                    {m.emoji}
                  </span>
                  <span className="unlock-card__body">
                    <span className="unlock-card__label">{m.label}</span>
                    <span className="t-body-sm muted">{m.description}</span>
                  </span>
                  {active && <Check size={18} weight="bold" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="builder__cta">
        <Button block onClick={onNext} variant={selected ? 'primary' : 'secondary'}>
          {selected ? `Continue with ${selected.name} →` : "I'll add a reward later →"}
        </Button>
      </div>
    </>
  )
}

function StepWhy({ data, update, onNext }) {
  const remaining = 140 - data.motivation.length
  return (
    <>
      <h2 className="builder__q t-headline">Your why</h2>
      <p className="t-body muted builder__hint">Optional — but powerful.</p>
      <textarea
        className="why-input"
        value={data.motivation}
        onChange={(e) => update({ motivation: e.target.value.slice(0, 140) })}
        placeholder="Because I want to feel strong in my body."
        maxLength={140}
        rows={4}
      />
      <div className="builder__counter t-caption muted">{remaining}</div>
      <div className="builder__cta">
        <Button block onClick={onNext}>
          {data.motivation.trim() ? 'Add this →' : 'Skip for now →'}
        </Button>
      </div>
    </>
  )
}

function StepConfirm({ data, onSubmit }) {
  const type = getGoalType(data.type)
  const targetText = useMemo(() => {
    if (type.id === 'count') return `${data.target}${data.unit ? ` ${data.unit}` : ''}`
    if (type.id === 'habit') return `${data.schedule?.length || 0} days a week`
    if (type.id === 'avoid') return `${data.target} ${data.unit || 'days'} clear`
    return data.deadline ? `by ${data.deadline}` : 'When ready'
  }, [data, type])

  return (
    <>
      <h2 className="builder__q t-headline">Ready?</h2>
      <p className="t-body muted builder__hint">You can always edit this later.</p>
      <div className="confirm-card" style={{ '--type-grad': type.gradient }}>
        <div className="confirm-card__emoji">{data.emoji}</div>
        <div className="confirm-card__name">{data.name}</div>
        <div className="confirm-card__row">
          <span className="t-label">{type.name}</span>
          <span className="confirm-card__dot">•</span>
          <span className="t-body-sm">{targetText}</span>
        </div>
        {data.motivation && (
          <div className="confirm-card__why">"{data.motivation}"</div>
        )}
      </div>
      <div className="builder__cta">
        <Button block onClick={onSubmit}>
          Start this goal ✓
        </Button>
      </div>
    </>
  )
}
