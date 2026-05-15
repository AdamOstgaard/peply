import { motion, useReducedMotion } from 'framer-motion'
import { LockSimple, Sparkle } from '@phosphor-icons/react'
import { ProgressRing } from './ProgressRing.jsx'
import './RewardCard.css'

const TIER_GRADIENTS = {
  small: 'var(--gradient-cool)',
  medium: 'var(--gradient-warm)',
  big: 'var(--gradient-primary)',
  dream: 'var(--gradient-celebration)',
}

const TIER_LABELS = {
  small: 'Small treat',
  medium: 'Medium reward',
  big: 'Big reward',
  dream: 'Dream goal',
}

export function RewardCard({
  reward,
  progress = 0,
  size = 'lg',
  onClick,
  highlight = false,
  status,
}) {
  const reduce = useReducedMotion()
  const unlocked = status ? status === 'unlocked' : Boolean(reward.unlockedAt)
  const claimed = status ? status === 'claimed' : Boolean(reward.claimedAt)
  const aspirational = progress >= 0.7 || highlight

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: reduce ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={`reward-card reward-card--${size} ${
        unlocked ? 'reward-card--unlocked' : ''
      } ${aspirational ? 'reward-card--aspirational' : ''}`}
      aria-label={`${reward.name}, ${unlocked ? 'unlocked' : 'locked'}`}
      style={{
        '--reward-grad': TIER_GRADIENTS[reward.tier] || TIER_GRADIENTS.medium,
      }}
    >
      <div className="reward-card__bg" />
      <div className="reward-card__scrim" />
      {!unlocked ? (
        <div className="reward-card__lock" aria-hidden>
          <LockSimple size={18} weight="fill" />
        </div>
      ) : (
        <div className="reward-card__sparkle" aria-hidden>
          <Sparkle size={18} weight="fill" />
        </div>
      )}

      <div className="reward-card__content">
        <div className="reward-card__emoji" aria-hidden>
          {reward.emoji || '🎁'}
        </div>
        <div className="reward-card__name t-title">{reward.name}</div>
        <div className="reward-card__tier t-label">
          {TIER_LABELS[reward.tier] || 'Reward'}
          {claimed && ' • Claimed ✓'}
        </div>
      </div>

      {size === 'lg' && progress > 0 && !claimed && (
        <div className="reward-card__ring">
          <ProgressRing
            value={progress}
            size="sm"
            preset="celebration"
            trackColor="rgba(255,255,255,0.25)"
            ariaLabel="Reward progress"
          >
            <span className="t-caption" style={{ color: 'white', fontWeight: 700 }}>
              {Math.round(progress * 100)}%
            </span>
          </ProgressRing>
        </div>
      )}
    </motion.button>
  )
}
