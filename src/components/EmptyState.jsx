import { motion, useReducedMotion } from 'framer-motion'
import './EmptyState.css'

export function EmptyState({ illustration, title, body, action }) {
  const reduce = useReducedMotion()
  return (
    <div className="empty-state">
      <motion.div
        className="empty-state__art"
        initial={{ scale: reduce ? 1 : 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1.0] }}
        aria-hidden
      >
        {illustration}
      </motion.div>
      <motion.h3
        className="t-title"
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="t-body muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.3 }}
      >
        {body}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  )
}

export function SeedIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <defs>
        <linearGradient id="seed-pot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
        <linearGradient id="seed-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C9A7" />
          <stop offset="100%" stopColor="#3FC1C9" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="68" fill="rgba(255,179,71,0.12)" />
      <path
        d="M55 110 L105 110 L100 145 L60 145 Z"
        fill="url(#seed-pot)"
      />
      <ellipse cx="80" cy="110" rx="25" ry="5" fill="#6B3B1F" opacity="0.4" />
      <path
        d="M80 110 C80 85 65 80 60 60 C72 65 80 72 80 95 Z"
        fill="url(#seed-leaf)"
      />
      <path
        d="M80 110 C80 85 95 80 100 60 C88 65 80 72 80 95 Z"
        fill="url(#seed-leaf)"
        opacity="0.85"
      />
      <circle cx="60" cy="60" r="4" fill="#F9F871" />
      <circle cx="100" cy="60" r="4" fill="#F9F871" />
      <circle cx="80" cy="45" r="3" fill="#F9F871" />
    </svg>
  )
}

export function GiftIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <defs>
        <linearGradient id="gift-box" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#845EC2" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="68" fill="rgba(132,94,194,0.12)" />
      <rect x="40" y="70" width="80" height="60" rx="10" fill="url(#gift-box)" />
      <rect x="74" y="70" width="12" height="60" fill="#F9F871" />
      <rect x="40" y="92" width="80" height="10" fill="#F9F871" />
      <path d="M58 70 C58 55 75 50 80 70 C75 50 92 55 92 70" stroke="#FFB347" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="50" r="4" fill="#FFB347" />
      <circle cx="128" cy="46" r="3" fill="#00C9A7" />
      <circle cx="124" cy="118" r="3" fill="#F9F871" />
    </svg>
  )
}

export function CalendarIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="80" r="68" fill="rgba(0,201,167,0.12)" />
      <rect x="36" y="44" width="88" height="76" rx="12" fill="#FFFFFF" stroke="#845EC2" strokeWidth="3" />
      <rect x="36" y="44" width="88" height="22" rx="12" fill="#845EC2" />
      <rect x="50" y="38" width="6" height="14" rx="3" fill="#FF6B6B" />
      <rect x="104" y="38" width="6" height="14" rx="3" fill="#FF6B6B" />
      <circle cx="56" cy="84" r="5" fill="#00C9A7" />
      <circle cx="80" cy="84" r="5" fill="#FFB347" />
      <circle cx="104" cy="84" r="5" fill="#FF6B6B" />
      <circle cx="56" cy="104" r="5" fill="#FFB347" />
      <circle cx="80" cy="104" r="5" fill="#00C9A7" />
      <circle cx="104" cy="104" r="5" stroke="#845EC2" strokeWidth="2" fill="none" />
    </svg>
  )
}
