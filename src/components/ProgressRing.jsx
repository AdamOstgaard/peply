import { motion, useReducedMotion } from 'framer-motion'

const SIZES = {
  xs: { d: 32, sw: 3 },
  sm: { d: 48, sw: 4 },
  md: { d: 64, sw: 5 },
  lg: { d: 80, sw: 6 },
  xl: { d: 120, sw: 8 },
}

const PRESETS = {
  primary: ['#FF6B6B', '#845EC2'],
  warm: ['#FFB347', '#FF6B6B'],
  cool: ['#00C9A7', '#3FC1C9'],
  momentum: ['#845EC2', '#D65DB1'],
  celebration: ['#F9F871', '#FF6B6B'],
  count: ['#FF6B6B', '#FF8E53'],
  habit: ['#845EC2', '#D65DB1'],
  avoid: ['#00C9A7', '#3FC1C9'],
  milestone: ['#FFB347', '#F9F871'],
}

let gradCounter = 0

export function ProgressRing({
  value = 0,
  size = 'md',
  preset = 'warm',
  trackColor,
  children,
  ariaLabel = 'Progress',
}) {
  const { d, sw } = SIZES[size] ?? SIZES.md
  const r = (d - sw) / 2
  const c = 2 * Math.PI * r
  const ratio = Math.max(0, Math.min(1, value))
  const offset = c * (1 - ratio)
  const reduce = useReducedMotion()

  const id = `ring-grad-${++gradCounter}`
  const stops = PRESETS[preset] ?? PRESETS.warm

  return (
    <div
      style={{ width: d, height: d, position: 'relative' }}
      role="progressbar"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stops[0]} />
            <stop offset="100%" stopColor={stops[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          stroke={trackColor ?? 'var(--color-border)'}
          strokeWidth={sw}
        />
        <motion.circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? offset : c }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: [0.0, 0.0, 0.2, 1.0],
          }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      {children !== undefined && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
