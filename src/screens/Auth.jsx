import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/Button.jsx'
import { ScreenHeader } from '../components/ScreenHeader.jsx'
import { useStore } from '../lib/store.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'
import './Auth.css'

export function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.returnTo || '/profile'

  const {
    actions: { signUp, signIn, pushToast },
  } = useStore()

  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const valid =
    email.includes('@') && password.length >= 6 && (mode === 'signin' || displayName.trim().length >= 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid || loading) return
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { user, session } = await signUp({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
        })
        if (!session && user) {
          // Email confirmation required by the project settings.
          pushToast({
            message: 'Check your email to confirm your account.',
            variant: 'info',
          })
          setMode('signin')
        } else {
          pushToast({
            message: `Welcome${displayName ? `, ${displayName}` : ''}!`,
            variant: 'success',
          })
          navigate(returnTo, { replace: true })
        }
      } else {
        await signIn({ email: email.trim(), password })
        pushToast({ message: 'Welcome back.', variant: 'success' })
        navigate(returnTo, { replace: true })
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <ScreenHeader title="" fallback={returnTo} />

      <div className="auth__hero">
        <motion.div
          className="auth__mark"
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          aria-hidden
        >
          ✨
        </motion.div>
        <h1 className="t-headline">
          {mode === 'signup'
            ? 'Build something for yourself.'
            : 'Welcome back.'}
        </h1>
        <p className="t-body muted">
          {mode === 'signup'
            ? 'Sign up to save your goals across devices.'
            : 'Pick up where you left off.'}
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <div className="auth__notice">
          <strong>Sign-in is offline right now.</strong>
          <p className="t-body-sm muted">
            Add a Supabase URL and publishable key to{' '}
            <code>.env.local</code> to enable accounts. Your goals still save
            on this device.
          </p>
        </div>
      ) : (
        <form className="auth__form" onSubmit={handleSubmit}>
          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                key="name"
                className="auth__field"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <label className="t-label muted" htmlFor="auth-name">
                  Your name
                </label>
                <input
                  id="auth-name"
                  className="auth__input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex"
                  autoComplete="name"
                  maxLength={48}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="auth__field">
            <label className="t-label muted" htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              className="auth__input"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth__field">
            <label className="t-label muted" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              className="auth__input"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
            />
          </div>

          {error && (
            <motion.div
              className="auth__error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="auth__cta">
            <Button
              type="submit"
              block
              disabled={!valid || loading}
              onClick={handleSubmit}
            >
              {loading
                ? 'One sec…'
                : mode === 'signup'
                  ? 'Create account →'
                  : 'Sign in →'}
            </Button>
          </div>

          <button
            type="button"
            className="auth__switch"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
            }}
          >
            {mode === 'signin'
              ? "New here? Create an account →"
              : 'Already have an account? Sign in →'}
          </button>
        </form>
      )}

      <p className="auth__skip">
        <button type="button" className="ghost-link" onClick={() => navigate('/')}>
          Keep using offline →
        </button>
      </p>
    </div>
  )
}
