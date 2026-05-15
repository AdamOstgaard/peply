// Pure domain helpers — no React, no JSX. Kept separate from store.jsx so
// React fast-refresh stays happy and helpers can be used anywhere.

export const GOAL_TYPES = [
  {
    id: 'count',
    name: 'Count it up',
    description: 'Track reps, sessions, glasses, pages…',
    emoji: '🔢',
    color: 'var(--goal-count)',
    gradient: 'var(--goal-count-grad)',
    cta: 'Log +1',
  },
  {
    id: 'habit',
    name: 'Recurring habit',
    description: 'Show up on the days you choose.',
    emoji: '📆',
    color: 'var(--goal-habit)',
    gradient: 'var(--goal-habit-grad)',
    cta: 'Mark done today',
  },
  {
    id: 'avoid',
    name: 'Stay clear',
    description: 'Break a pattern. Stay on track.',
    emoji: '🛡️',
    color: 'var(--goal-avoid)',
    gradient: 'var(--goal-avoid-grad)',
    cta: 'On track today',
  },
  {
    id: 'milestone',
    name: 'One big win',
    description: 'A single meaningful achievement.',
    emoji: '🎯',
    color: 'var(--goal-milestone)',
    gradient: 'var(--goal-milestone-grad)',
    cta: 'Log progress',
  },
]

export function nowISO() {
  return new Date().toISOString()
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

export function getGoalType(id) {
  return GOAL_TYPES.find((t) => t.id === id) ?? GOAL_TYPES[0]
}

export function goalProgress(goal, logs) {
  const goalLogs = logs.filter((l) => l.goalId === goal.id)
  if (goal.type === 'milestone') {
    const done = goalLogs.some((l) => l.kind === 'done')
    return { current: done ? 1 : 0, target: 1, ratio: done ? 1 : 0, goalLogs }
  }
  if (goal.type === 'habit') {
    const target = goal.target || 30
    const done = goalLogs.filter((l) => l.kind === 'done').length
    return {
      current: done,
      target,
      ratio: Math.min(1, done / target),
      goalLogs,
    }
  }
  if (goal.type === 'avoid') {
    const target = goal.target || 30
    const onTrack = goalLogs.filter((l) => l.kind === 'on-track').length
    return {
      current: onTrack,
      target,
      ratio: Math.min(1, onTrack / target),
      goalLogs,
    }
  }
  const target = goal.target || 1
  const sum = goalLogs.reduce((acc, l) => acc + (l.value || 1), 0)
  return {
    current: sum,
    target,
    ratio: Math.min(1, sum / target),
    goalLogs,
  }
}

export function loggedToday(goal, logs) {
  const today = todayKey()
  return logs.some((l) => l.goalId === goal.id && l.date === today)
}

export const WEEKDAYS = [
  { id: 'sun', short: 'Sun', narrow: 'S' },
  { id: 'mon', short: 'Mon', narrow: 'M' },
  { id: 'tue', short: 'Tue', narrow: 'T' },
  { id: 'wed', short: 'Wed', narrow: 'W' },
  { id: 'thu', short: 'Thu', narrow: 'T' },
  { id: 'fri', short: 'Fri', narrow: 'F' },
  { id: 'sat', short: 'Sat', narrow: 'S' },
]

export function weekdayId(d = new Date()) {
  return WEEKDAYS[d.getDay()].id
}

export function isGoalDueOn(goal, d = new Date()) {
  if (goal.type !== 'habit') return true
  const schedule = goal.schedule || []
  if (schedule.length === 0) return true
  return schedule.includes(weekdayId(d))
}

export function isGoalDueToday(goal) {
  return isGoalDueOn(goal)
}

export function scheduleLabel(schedule = []) {
  if (!schedule.length || schedule.length === 7) return 'Every day'
  const ordered = WEEKDAYS.filter((d) => schedule.includes(d.id)).map(
    (d) => d.short,
  )
  return ordered.join(', ')
}

export function nextScheduledLabel(goal, from = new Date()) {
  if (goal.type !== 'habit') return 'Today'
  const schedule = goal.schedule || []
  if (schedule.length === 0 || schedule.length === 7) return 'Today'

  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(from)
    d.setDate(from.getDate() + offset)
    if (schedule.includes(weekdayId(d))) {
      if (offset === 0) return 'Today'
      if (offset === 1) return 'Tomorrow'
      return WEEKDAYS[d.getDay()].short
    }
  }
  return scheduleLabel(schedule)
}

export const UNLOCK_MODES = [
  {
    id: 'each',
    label: 'Each time',
    description: 'Earn the reward once for every goal that finishes.',
    emoji: '🔁',
  },
  {
    id: 'any',
    label: 'Once — any goal',
    description: 'The first goal to finish unlocks the reward.',
    emoji: '⚡',
  },
  {
    id: 'all',
    label: 'Once — all goals',
    description: 'Unlocks only after every linked goal is complete.',
    emoji: '🏁',
  },
]

export function getUnlockMode(id) {
  return UNLOCK_MODES.find((m) => m.id === id) ?? UNLOCK_MODES[0]
}

// Goals (non-archived) linked to a given reward.
export function goalsLinkedTo(rewardId, goals) {
  if (!rewardId) return []
  return goals.filter((g) => g.rewardId === rewardId && !g.archivedAt)
}

export function rewardProgressSummary(reward, linkedGoals, logs) {
  const mode = reward?.unlockMode || 'each'
  const items = linkedGoals.map((goal) => {
    const progress = goalProgress(goal, logs)
    const complete = Boolean(goal.completedAt) || progress.ratio >= 1
    return { goal, progress, complete }
  })

  const total = items.length
  const completed = items.filter((i) => i.complete).length
  const incomplete = items.filter((i) => !i.complete)
  const best = [...items].sort(
    (a, b) => b.progress.ratio - a.progress.ratio,
  )[0]
  const bestIncomplete = [...incomplete].sort(
    (a, b) => b.progress.ratio - a.progress.ratio,
  )[0]

  if (!total) {
    return {
      mode,
      ratio: 0,
      total,
      completed,
      remaining: 0,
      focusGoal: null,
      items,
    }
  }

  if (mode === 'all') {
    const ratio =
      (reward.unlockCount || 0) > 0
        ? 1
        : items.reduce((sum, item) => sum + item.progress.ratio, 0) / total
    return {
      mode,
      ratio,
      total,
      completed,
      remaining: Math.max(0, total - completed),
      focusGoal: bestIncomplete?.goal || best?.goal || null,
      items,
    }
  }

  if (mode === 'any') {
    return {
      mode,
      ratio: (reward.unlockCount || 0) > 0 ? 1 : best?.progress.ratio || 0,
      total,
      completed,
      remaining: completed > 0 ? 0 : 1,
      focusGoal: best?.goal || null,
      items,
    }
  }

  const focus =
    reward.unlockedAt && !reward.claimedAt ? best : bestIncomplete || best
  return {
    mode,
    ratio: focus?.progress.ratio || 0,
    total,
    completed,
    remaining: incomplete.length,
    focusGoal: focus?.goal || null,
    items,
  }
}

export function rewardStatus(reward, linkedGoals, logs, summary = null) {
  const progress = summary || rewardProgressSummary(reward, linkedGoals, logs)
  if (!progress.total) return 'draft'
  if (reward.unlockedAt && !reward.claimedAt) return 'unlocked'
  if ((reward.unlockMode || 'each') === 'each' && progress.remaining > 0) {
    return 'in-progress'
  }
  if (reward.claimedAt) return 'claimed'
  return 'in-progress'
}

// Decide what should happen to a reward when the given goal just hit 100%.
// Returns: { fireCelebration, markUnlocked, resetClaim }.
//   fireCelebration — show the celebration overlay
//   markUnlocked    — set unlockedAt + bump unlockCount on the reward
//   resetClaim      — clear claimedAt so 'each'-mode rewards become claimable again
export function evaluateUnlock({ goal, reward, goals, logsAfter }) {
  if (!reward) return { fireCelebration: true, markUnlocked: false, resetClaim: false }

  const mode = reward.unlockMode || 'each'
  const linked = goalsLinkedTo(reward.id, goals)

  if (mode === 'each') {
    return { fireCelebration: true, markUnlocked: true, resetClaim: true }
  }

  if (mode === 'any') {
    // Fire only the first time. unlockCount is the source of truth.
    if ((reward.unlockCount || 0) > 0) {
      return { fireCelebration: false, markUnlocked: false, resetClaim: false }
    }
    return { fireCelebration: true, markUnlocked: true, resetClaim: false }
  }

  // 'all' — fire only when every linked goal is now complete.
  const everyComplete = linked.every((g) => {
    if (g.id === goal.id) return true
    if (g.completedAt) return true
    return goalProgress(g, logsAfter).ratio >= 1
  })
  if (!everyComplete) {
    return { fireCelebration: false, markUnlocked: false, resetClaim: false }
  }
  if ((reward.unlockCount || 0) > 0) {
    return { fireCelebration: false, markUnlocked: false, resetClaim: false }
  }
  return { fireCelebration: true, markUnlocked: true, resetClaim: false }
}

export function lastNDays(n) {
  const days = []
  const base = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    days.push(todayKey(d))
  }
  return days
}

export function momentumScore(logs) {
  const days = lastNDays(7)
  const active = days.filter((d) => logs.some((l) => l.date === d)).length
  return Math.round((active / 7) * 100)
}

export function momentumLabel(score) {
  if (score >= 90)
    return { label: 'In flow', emoji: '⚡', copy: "You're in the zone." }
  if (score >= 70)
    return {
      label: 'Strong',
      emoji: '💪',
      copy: 'This is becoming part of you.',
    }
  if (score >= 40)
    return {
      label: 'Building',
      emoji: '🔥',
      copy: "You're building consistency.",
    }
  if (score >= 16)
    return {
      label: 'Warming up',
      emoji: '✨',
      copy: "You're finding your rhythm.",
    }
  return {
    label: 'Getting started',
    emoji: '🌱',
    copy: 'Every step counts from here.',
  }
}

export function timeOfDayGreeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Night mode — rest counts too.'
  if (h < 12) return 'Good morning — today is a good day to build something.'
  if (h < 17) return "You've got time. One more step."
  if (h < 21) return 'Even a small win today counts.'
  return 'Evening wind-down — tomorrow starts with tonight.'
}

const AFTER_LOG = [
  "Nice. That's real progress.",
  'One more log in the books.',
  'You showed up. That counts.',
  "Logged. You're building consistency.",
  'Small steps are working.',
]

export function afterLogCopy() {
  return AFTER_LOG[Math.floor(Math.random() * AFTER_LOG.length)]
}

const RECOVERY = [
  'Welcome back — your goals are still here.',
  'One difficult stretch does not erase what you have built.',
  'Today is a fresh start.',
  'Missing days is human. Coming back is the skill.',
]

export function recoveryCopy() {
  return RECOVERY[Math.floor(Math.random() * RECOVERY.length)]
}

export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
