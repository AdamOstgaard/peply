import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from '@phosphor-icons/react'
import { GoalCard } from '../components/GoalCard.jsx'
import { EmptyState, SeedIllustration } from '../components/EmptyState.jsx'
import { Button } from '../components/Button.jsx'
import { useStore } from '../lib/store.jsx'
import { isGoalDueToday } from '../lib/domain.js'
import './GoalsList.css'

const TABS = [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'archived', label: 'Archived' },
]

export function GoalsList() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('active')
  const {
    state: { goals, logs },
    actions: { logProgress },
  } = useStore()

  const filtered = useMemo(() => {
    if (tab === 'active')
      return goals.filter((g) => !g.archivedAt && !g.completedAt)
    if (tab === 'completed') return goals.filter((g) => g.completedAt)
    return goals.filter((g) => g.archivedAt)
  }, [goals, tab])

  const handleLog = (goal) => logProgress(goal)

  return (
    <div className="goals-list">
      <header className="goals-list__head">
        <h1 className="t-headline">Goals</h1>
        <p className="t-body muted">All of your projects in one place.</p>
      </header>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab ${tab === t.id ? 'tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          illustration={<SeedIllustration />}
          title={
            tab === 'active'
              ? 'No active goals'
              : tab === 'completed'
                ? 'Nothing complete yet'
                : 'Nothing archived'
          }
          body={
            tab === 'active'
              ? 'Start one. Even a tiny one counts.'
              : tab === 'completed'
                ? 'Your first win will show up here.'
                : 'Archived goals stay here without judgment.'
          }
          action={
            tab === 'active' && (
              <Button onClick={() => navigate('/goal/new')}>Create a goal</Button>
            )
          }
        />
      ) : (
        <motion.ul
          className="goals-list__items"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {filtered.map((g) => (
            <motion.li
              key={g.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            >
              <GoalCard
                goal={g}
                logs={logs}
                onLog={handleLog}
                due={isGoalDueToday(g)}
              />
            </motion.li>
          ))}
        </motion.ul>
      )}

      <Link to="/goal/new" className="fab" aria-label="New goal">
        <Plus size={28} weight="bold" />
      </Link>
    </div>
  )
}
