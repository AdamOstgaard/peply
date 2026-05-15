import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/Button.jsx'
import { ScreenHeader } from '../components/ScreenHeader.jsx'
import { RewardCard } from '../components/RewardCard.jsx'
import { useStore } from '../lib/store.jsx'
import './RewardCreate.css'

const EMOJI_POOL = [
  '🎁', '☕', '👟', '🎧', '🍰', '🎮', '📚', '🧴', '✈️', '🏖️', '🪑',
  '💍', '🚗', '🎸', '🍷', '🧖', '🍣', '💐', '🍫', '🛍️',
]

const TIERS = [
  { id: 'small', label: 'Small treat' },
  { id: 'medium', label: 'Medium' },
  { id: 'big', label: 'Big' },
  { id: 'dream', label: 'Dream' },
]

export function RewardCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.returnTo
  const editGoalId = location.state?.editGoalId
  const {
    actions: { addReward, pushToast, patchGoalDraft, updateGoal },
  } = useStore()

  const [step, setStep] = useState(0)
  const [data, setData] = useState(() => ({
    name: '',
    note: '',
    emoji: EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)],
    tier: 'medium',
    cost: '',
  }))

  const update = (patch) => setData((d) => ({ ...d, ...patch }))
  const valid = data.name.trim().length >= 2

  const handleSubmit = () => {
    const reward = addReward({
      name: data.name.trim(),
      note: data.note.trim(),
      emoji: data.emoji,
      tier: data.tier,
      cost: data.cost ? Number(data.cost) : null,
    })
    pushToast({ message: 'Reward saved.', variant: 'success' })
    if (editGoalId) {
      updateGoal(editGoalId, { rewardId: reward.id })
      navigate(returnTo || `/goal/${editGoalId}/edit`, { replace: true })
      return
    }
    if (returnTo) {
      // Returning into the goal builder — pre-link the reward we just made
      // so the user lands back on the reward step with it already selected.
      patchGoalDraft({ data: { rewardId: reward.id }, step: 3 })
      navigate(returnTo, { replace: true })
    } else {
      navigate('/rewards', { replace: true })
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1)
      return
    }
    navigate(returnTo || '/rewards', { replace: true })
  }

  return (
    <div className="reward-create">
      <ScreenHeader title="New reward" onBack={handleBack} />
      <div className="reward-create__dots" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`builder__dot ${i === step ? 'builder__dot--active' : ''} ${
              i < step ? 'builder__dot--done' : ''
            }`}
          />
        ))}
      </div>
      <div className="reward-create__stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.25 }}
            className="reward-create__step"
          >
            {step === 0 && (
              <>
                <h2 className="t-headline builder__q">Name your reward</h2>
                <p className="t-body muted builder__hint">
                  Make it something you'd actually want.
                </p>
                <input
                  className="hero-input"
                  autoFocus
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="A really good coffee"
                  maxLength={60}
                />
                <textarea
                  className="why-input"
                  value={data.note}
                  onChange={(e) => update({ note: e.target.value.slice(0, 160) })}
                  rows={3}
                  placeholder="Optional note — why this reward means something."
                />
                <div
                  className="builder__emoji-row"
                  role="radiogroup"
                  aria-label="Reward emoji"
                >
                  {EMOJI_POOL.map((e) => (
                    <button
                      key={e}
                      type="button"
                      role="radio"
                      aria-checked={data.emoji === e}
                      aria-label={e}
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
                  <Button block disabled={!valid} onClick={() => setStep(1)}>
                    Next →
                  </Button>
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h2 className="t-headline builder__q">How big is this?</h2>
                <p className="t-body muted builder__hint">
                  Bigger rewards take more effort — that's the whole point.
                </p>
                <div className="tier-grid">
                  {TIERS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => update({ tier: t.id })}
                      aria-pressed={data.tier === t.id}
                      className={`tier-card tier-card--${t.id} ${
                        data.tier === t.id ? 'tier-card--active' : ''
                      }`}
                    >
                      <div className="t-title">{t.label}</div>
                    </button>
                  ))}
                </div>
                <label className="cost-label t-label muted">
                  Estimated cost (optional)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  className="unit-input"
                  value={data.cost}
                  onChange={(e) => update({ cost: e.target.value })}
                  placeholder="0"
                />
                <div className="builder__cta">
                  <Button block onClick={() => setStep(2)}>
                    Next →
                  </Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="t-headline builder__q">Looks good?</h2>
                <p className="t-body muted builder__hint">
                  This is what you're working toward.
                </p>
                <div className="reward-create__preview">
                  <RewardCard
                    reward={{ ...data, unlockedAt: null }}
                    progress={0.4}
                    size="lg"
                    highlight
                  />
                </div>
                <div className="builder__cta">
                  <Button block onClick={handleSubmit}>
                    Save reward ✓
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
