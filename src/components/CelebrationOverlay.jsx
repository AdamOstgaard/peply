import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'
import confetti from 'canvas-confetti'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store.jsx'
import { pickRandom } from '../lib/domain.js'
import './CelebrationOverlay.css'

const IDENTITY_COPY = [
  "You're becoming someone who follows through.",
  'Proof that consistency pays off.',
  'You worked for this. It is yours now.',
  'You became someone who keeps promises to yourself.',
]

export function CelebrationOverlay() {
  const {
    state: { celebration },
    actions: { endCelebration, claimReward },
  } = useStore()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const fired = useRef(false)

  useEffect(() => {
    if (!celebration) {
      fired.current = false
      return
    }
    if (reduce || fired.current) return
    fired.current = true
    fireConfetti()
  }, [celebration, reduce])

  const identity = useMemo(
    () => pickRandom(IDENTITY_COPY),
    // Intentionally re-pick when a new celebration begins.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [celebration?.goal?.id],
  )

  const goal = celebration?.goal
  const reward = celebration?.reward

  const handleClaim = () => {
    if (reward) claimReward(reward.id)
    endCelebration()
    if (reward) navigate('/rewards')
    else navigate('/')
  }

  const handleKeepGoing = () => {
    endCelebration()
    navigate('/goal/new')
  }

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          key="celebration"
          className="celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${goal?.name ?? 'Goal'} complete${
            reward ? `, ${reward.name} unlocked` : ''
          }`}
        >
          <motion.div
            className="celebration__halo"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            aria-hidden
          />

          {reward && (
            <motion.div
              className="celebration__reward"
              initial={{ scale: 0.3, opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ scale: [0.3, 1.12, 1], opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.2,
              }}
            >
              <div className="celebration__reward-emoji" aria-hidden>
                {reward.emoji || '🎁'}
              </div>
              <div className="celebration__reward-name">{reward.name}</div>
              <div className="t-label celebration__reward-tier">Unlocked</div>
            </motion.div>
          )}

          <motion.div
            className="celebration__copy"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="t-display celebration__head">You did it.</div>
            <div className="t-title celebration__sub">
              {goal?.name} complete.
            </div>
            <div className="t-body-lg celebration__identity">{identity}</div>
          </motion.div>

          <motion.div
            className="celebration__actions"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 1.0 }}
          >
            {reward ? (
              <button
                type="button"
                className="btn btn--celebration btn--lg btn--block"
                onClick={handleClaim}
              >
                Claim {reward.name} →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--celebration btn--lg btn--block"
                onClick={() => {
                  endCelebration()
                  navigate('/')
                }}
              >
                Take the win →
              </button>
            )}
            <button
              type="button"
              className="celebration__next"
              onClick={handleKeepGoing}
            >
              Keep going — create your next goal →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function fireConfetti() {
  const end = Date.now() + 900
  const colors = ['#F9F871', '#FFB347', '#FF6B6B', '#845EC2', '#00C9A7']
  const tick = () => {
    confetti({
      particleCount: 4,
      startVelocity: 35,
      spread: 70,
      origin: { x: Math.random(), y: Math.random() * 0.3 + 0.1 },
      colors,
      scalar: 0.9,
      ticks: 200,
    })
    if (Date.now() < end) requestAnimationFrame(tick)
  }
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.5 },
    colors,
    scalar: 1.1,
    ticks: 220,
  })
  tick()
}
