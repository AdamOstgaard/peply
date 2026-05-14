import { NavLink, useLocation } from 'react-router-dom'
import { House, Target, Gift, User } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import './BottomNav.css'

const TABS = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const location = useLocation()
  // Hide on celebration / builder / auth screens for focus.
  const hide =
    location.pathname.startsWith('/goal/new') ||
    location.pathname.startsWith('/reward/new') ||
    location.pathname.startsWith('/auth')

  if (hide) return null

  return (
    <nav className="bottom-nav" aria-label="Main navigation" role="navigation">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          to={to}
          key={to}
          end={end}
          className={({ isActive }) =>
            `bottom-nav__tab ${isActive ? 'bottom-nav__tab--active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
              <span className="t-caption">{label}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    className="bottom-nav__indicator"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
