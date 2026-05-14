import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Pencil, Check, SignOut, SignIn } from '@phosphor-icons/react'
import { useStore } from '../lib/store.jsx'
import { MomentumMeter } from '../components/MomentumMeter.jsx'
import { Button } from '../components/Button.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'
import './Profile.css'

export function Profile() {
  const navigate = useNavigate()
  const {
    state: { user, goals, rewards, logs, auth },
    actions: { setUserName, signOut, pushToast },
  } = useStore()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(user.name)
  const [signingOut, setSigningOut] = useState(false)

  const activeCount = goals.filter((g) => !g.archivedAt && !g.completedAt).length
  const completedCount = goals.filter((g) => g.completedAt).length
  const unlockedCount = rewards.filter((r) => r.unlockedAt).length
  const totalLogs = logs.length

  const isSignedIn = auth.status === 'signed-in'
  const email = auth.user?.email

  const save = () => {
    setUserName(draft.trim() || 'Friend')
    setEditing(false)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      pushToast({ message: 'Signed out. See you soon.', variant: 'info' })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="profile">
      <header className="profile__head">
        <motion.div
          className="profile__avatar"
          aria-hidden
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          {user.name?.[0]?.toUpperCase() ?? '·'}
        </motion.div>
        {editing ? (
          <div className="profile__edit">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="unit-input"
              maxLength={32}
              onKeyDown={(e) => e.key === 'Enter' && save()}
            />
            <button type="button" className="profile__save" onClick={save}>
              <Check size={20} weight="bold" />
            </button>
          </div>
        ) : (
          <>
            <h1 className="t-headline">{user.name}</h1>
            <button
              type="button"
              className="ghost-link"
              onClick={() => {
                setDraft(user.name)
                setEditing(true)
              }}
            >
              <Pencil size={14} weight="fill" /> Edit name
            </button>
          </>
        )}
      </header>

      <section className="profile__stats">
        <Stat number={activeCount} label="Active goals" />
        <Stat number={completedCount} label="Goals completed" />
        <Stat number={unlockedCount} label="Rewards earned" />
        <Stat number={totalLogs} label="Times you showed up" />
      </section>

      <section className="profile__section">
        <MomentumMeter logs={logs} />
      </section>

      <section className="profile__section profile__account">
        <div className="t-label muted">Account</div>
        {isSignedIn ? (
          <div className="account-card">
            <div className="account-card__row">
              <div className="account-card__email">{email}</div>
              <span className="account-card__badge">Signed in</span>
            </div>
            <button
              type="button"
              className="account-card__action"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              <SignOut size={18} weight="bold" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        ) : (
          <div className="account-card">
            <p className="t-body-sm muted account-card__hint">
              {isSupabaseConfigured
                ? 'Save your goals across devices.'
                : 'Sign-in is offline right now — your goals stay on this device.'}
            </p>
            <Button
              variant="primary"
              size="md"
              block
              leftIcon={<SignIn size={18} weight="bold" />}
              onClick={() =>
                navigate('/auth', { state: { returnTo: '/profile' } })
              }
              disabled={!isSupabaseConfigured}
            >
              Sign in or create account
            </Button>
          </div>
        )}
      </section>

      <section className="profile__section">
        <p className="t-body muted profile__footer">
          {isSignedIn
            ? 'Peply is offline-first. Your goals stay on this device and sync once data sync ships.'
            : 'Peply works offline-first. Your goals live on this device.'}
        </p>
      </section>
    </div>
  )
}

function Stat({ number, label }) {
  return (
    <div className="stat-card">
      <div className="t-mono-lg">{number}</div>
      <div className="t-caption muted">{label}</div>
    </div>
  )
}
