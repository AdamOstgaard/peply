import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BottomNav } from './components/BottomNav.jsx'
import { ToastHost } from './components/Toast.jsx'
import { CelebrationOverlay } from './components/CelebrationOverlay.jsx'
import { Home } from './screens/Home.jsx'
import { GoalBuilder } from './screens/GoalBuilder.jsx'
import { GoalDetail } from './screens/GoalDetail.jsx'
import { GoalsList } from './screens/GoalsList.jsx'
import { RewardVault } from './screens/RewardVault.jsx'
import { RewardDetail } from './screens/RewardDetail.jsx'
import { RewardCreate } from './screens/RewardCreate.jsx'
import { Profile } from './screens/Profile.jsx'
import { Auth } from './screens/Auth.jsx'
import { Achievements } from './screens/Achievements.jsx'
import './App.css'

const enter = { x: '100%', opacity: 0 }
const center = {
  x: 0,
  opacity: 1,
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
}
const exit = {
  x: '-30%',
  opacity: 0,
  transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
}

const fadeEnter = { opacity: 0 }
const fadeCenter = { opacity: 1, transition: { duration: 0.18 } }
const fadeExit = { opacity: 0, transition: { duration: 0.15 } }

export default function App() {
  const location = useLocation()
  const reduce = useReducedMotion()

  const motionPreset = reduce
    ? { initial: fadeEnter, animate: fadeCenter, exit: fadeExit }
    : { initial: enter, animate: center, exit }

  return (
    <div className="app-shell">
      <ToastHost />
      <CelebrationOverlay />
      <main className="app-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="route-frame"
            {...motionPreset}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/goals" element={<GoalsList />} />
              <Route path="/goal/new" element={<GoalBuilder />} />
              <Route path="/goal/:id" element={<GoalDetail />} />
              <Route path="/goal/:id/edit" element={<GoalBuilder />} />
              <Route path="/rewards" element={<RewardVault />} />
              <Route path="/rewards/:id" element={<RewardDetail />} />
              <Route path="/reward/new" element={<RewardCreate />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
