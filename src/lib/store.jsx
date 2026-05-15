import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import {
  afterLogCopy,
  evaluateUnlock,
  goalProgress,
  isGoalDueToday,
  loggedToday,
  nextScheduledLabel,
  nowISO,
  todayKey,
  uid,
} from './domain.js'
import {
  displayNameFromUser,
  isSupabaseConfigured,
  supabase,
} from './supabase.js'

const STORAGE_KEY = 'peply.v1'

const initialState = {
  user: { name: 'Friend' },
  goals: [],
  rewards: [],
  logs: [],
  toasts: [],
  celebration: null,
  hasOnboarded: false,
  // In-progress goal-builder draft, kept in the store so navigation away
  // (e.g. into reward creation) doesn't lose the user's progress.
  goalDraft: null,
  // Auth — null when signed out / Supabase not configured.
  auth: { status: 'unknown', user: null },
}

function loadState() {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    return {
      ...initialState,
      ...parsed,
      toasts: [],
      celebration: null,
    }
  } catch {
    return initialState
  }
}

function persistState(state) {
  if (typeof window === 'undefined') return
  // Auth comes from Supabase's own persistence; the other transient fields
  // shouldn't be persisted at all.
  // eslint-disable-next-line no-unused-vars
  const { toasts, celebration, auth, ...persistable } = state
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
  } catch {
    /* swallow */
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'set_user_name':
      return { ...state, user: { ...state.user, name: action.name } }

    case 'add_goal': {
      const goal = {
        id: uid('g'),
        createdAt: nowISO(),
        completedAt: null,
        ...action.goal,
      }
      return {
        ...state,
        goals: [goal, ...state.goals],
        hasOnboarded: true,
      }
    }

    case 'update_goal':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id ? { ...g, ...action.patch } : g,
        ),
      }

    case 'archive_goal':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id ? { ...g, archivedAt: nowISO() } : g,
        ),
      }

    case 'delete_goal':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.id),
        logs: state.logs.filter((l) => l.goalId !== action.id),
      }

    case 'add_milestone':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goalId
            ? {
                ...g,
                milestones: [
                  ...(g.milestones || []),
                  { id: uid('m'), label: action.label, completedAt: null },
                ],
              }
            : g,
        ),
      }

    case 'toggle_milestone':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goalId
            ? {
                ...g,
                milestones: (g.milestones || []).map((m) =>
                  m.id === action.milestoneId
                    ? { ...m, completedAt: m.completedAt ? null : nowISO() }
                    : m,
                ),
              }
            : g,
        ),
      }

    case 'delete_milestone':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goalId
            ? {
                ...g,
                milestones: (g.milestones || []).filter(
                  (m) => m.id !== action.milestoneId,
                ),
              }
            : g,
        ),
      }

    case 'add_reward': {
      const reward = {
        id: uid('r'),
        createdAt: nowISO(),
        unlockedAt: null,
        claimedAt: null,
        unlockCount: 0,
        unlockMode: 'each',
        ...action.reward,
      }
      return { ...state, rewards: [reward, ...state.rewards] }
    }

    case 'update_reward':
      return {
        ...state,
        rewards: state.rewards.map((r) =>
          r.id === action.id ? { ...r, ...action.patch } : r,
        ),
      }

    case 'claim_reward':
      return {
        ...state,
        rewards: state.rewards.map((r) =>
          r.id === action.id ? { ...r, claimedAt: nowISO() } : r,
        ),
      }

    case 'add_log': {
      const log = {
        id: uid('l'),
        createdAt: nowISO(),
        date: todayKey(),
        ...action.log,
      }
      return { ...state, logs: [log, ...state.logs] }
    }

    case 'remove_log':
      return { ...state, logs: state.logs.filter((l) => l.id !== action.id) }

    case 'push_toast':
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id: uid('t'),
            variant: 'success',
            ...action.toast,
          },
        ],
      }

    case 'dismiss_toast':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }

    case 'start_celebration':
      return { ...state, celebration: action.celebration }

    case 'end_celebration':
      return { ...state, celebration: null }

    case 'mark_onboarded':
      return { ...state, hasOnboarded: true }

    case 'set_goal_draft':
      return { ...state, goalDraft: action.draft }

    case 'patch_goal_draft':
      return {
        ...state,
        goalDraft: state.goalDraft
          ? {
              ...state.goalDraft,
              ...action.patch,
              data: { ...state.goalDraft.data, ...(action.patch.data || {}) },
            }
          : null,
      }

    case 'clear_goal_draft':
      return { ...state, goalDraft: null }

    case 'set_auth':
      return { ...state, auth: action.auth }

    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    persistState(state)
  }, [state])

  // Keep a ref to the latest state so action helpers can read it without
  // forcing a fresh actions object on every dispatch.
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Supabase auth bootstrap. If Supabase isn't configured we settle into the
  // "signed-out" status so consumers don't get stuck on the "unknown" loader.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      dispatch({
        type: 'set_auth',
        auth: { status: 'signed-out', user: null },
      })
      return
    }
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      const u = data.session?.user ?? null
      dispatch({
        type: 'set_auth',
        auth: { status: u ? 'signed-in' : 'signed-out', user: u },
      })
      // Seed user.name from the auth profile if the user hasn't set one.
      if (u && stateRef.current.user.name === 'Friend') {
        const name = displayNameFromUser(u)
        if (name) dispatch({ type: 'set_user_name', name })
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      dispatch({
        type: 'set_auth',
        auth: { status: u ? 'signed-in' : 'signed-out', user: u },
      })
      if (u && stateRef.current.user.name === 'Friend') {
        const name = displayNameFromUser(u)
        if (name) dispatch({ type: 'set_user_name', name })
      }
    })
    return () => {
      active = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const actions = useMemo(
    () => ({
      setUserName: (name) => dispatch({ type: 'set_user_name', name }),
      addGoal: (goal) => {
        const g = { ...goal, id: uid('g'), createdAt: nowISO() }
        dispatch({ type: 'add_goal', goal: g })
        return g
      },
      updateGoal: (id, patch) => dispatch({ type: 'update_goal', id, patch }),
      archiveGoal: (id) => dispatch({ type: 'archive_goal', id }),
      deleteGoal: (id) => dispatch({ type: 'delete_goal', id }),
      addMilestone: (goalId, label) =>
        dispatch({ type: 'add_milestone', goalId, label }),
      toggleMilestone: (goalId, milestoneId) =>
        dispatch({ type: 'toggle_milestone', goalId, milestoneId }),
      deleteMilestone: (goalId, milestoneId) =>
        dispatch({ type: 'delete_milestone', goalId, milestoneId }),
      addReward: (reward) => {
        const r = { ...reward, id: uid('r'), createdAt: nowISO() }
        dispatch({ type: 'add_reward', reward: r })
        return r
      },
      updateReward: (id, patch) =>
        dispatch({ type: 'update_reward', id, patch }),
      claimReward: (id) => dispatch({ type: 'claim_reward', id }),
      addLog: (log) => dispatch({ type: 'add_log', log }),
      removeLog: (id) => dispatch({ type: 'remove_log', id }),
      pushToast: (toast) => dispatch({ type: 'push_toast', toast }),
      dismissToast: (id) => dispatch({ type: 'dismiss_toast', id }),
      startCelebration: (celebration) =>
        dispatch({ type: 'start_celebration', celebration }),
      endCelebration: () => dispatch({ type: 'end_celebration' }),
      markOnboarded: () => dispatch({ type: 'mark_onboarded' }),
      setGoalDraft: (draft) => dispatch({ type: 'set_goal_draft', draft }),
      patchGoalDraft: (patch) => dispatch({ type: 'patch_goal_draft', patch }),
      clearGoalDraft: () => dispatch({ type: 'clear_goal_draft' }),
      signUp: async ({ email, password, displayName }) => {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: displayName ? { display_name: displayName } : undefined,
          },
        })
        if (error) throw error
        return data
      },
      signIn: async ({ email, password }) => {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return data
      },
      signOut: async () => {
        if (!supabase) return
        await supabase.auth.signOut()
      },

      // Centralized "user tapped log" — handles the log entry, completion
      // detection, unlock-mode evaluation, celebration trigger, and the
      // post-log encouragement toast. Returns true if it logged anything.
      logProgress: (goal) => {
        const snap = stateRef.current
        const isCount = goal.type === 'count'
        if (goal.type === 'habit' && !isGoalDueToday(goal)) {
          dispatch({
            type: 'push_toast',
            toast: {
              message: `Not scheduled today. Next up: ${nextScheduledLabel(goal)}.`,
              variant: 'info',
            },
          })
          return false
        }
        if (!isCount && loggedToday(goal, snap.logs)) {
          dispatch({
            type: 'push_toast',
            toast: { message: 'Already logged today. Nice.' },
          })
          return false
        }

        const kind =
          goal.type === 'avoid'
            ? 'on-track'
            : isCount
              ? 'increment'
              : 'done'
        const log = {
          id: uid('l'),
          createdAt: nowISO(),
          date: todayKey(),
          goalId: goal.id,
          kind,
          value: 1,
        }
        dispatch({ type: 'add_log', log })

        const logsAfter = [log, ...snap.logs]
        const before = goalProgress(goal, snap.logs)
        const after = goalProgress(goal, logsAfter)
        const justCompleted = before.ratio < 1 && after.ratio >= 1

        if (!justCompleted) {
          dispatch({
            type: 'push_toast',
            toast: { message: afterLogCopy() },
          })
          return true
        }

        dispatch({
          type: 'update_goal',
          id: goal.id,
          patch: { completedAt: nowISO() },
        })

        const reward = goal.rewardId
          ? snap.rewards.find((r) => r.id === goal.rewardId)
          : null

        const decision = evaluateUnlock({
          goal,
          reward,
          goals: snap.goals,
          logsAfter,
        })

        if (reward && decision.markUnlocked) {
          dispatch({
            type: 'update_reward',
            id: reward.id,
            patch: {
              unlockedAt: nowISO(),
              unlockCount: (reward.unlockCount || 0) + 1,
              ...(decision.resetClaim ? { claimedAt: null } : {}),
            },
          })
        }

        if (decision.fireCelebration) {
          // Slight delay so the log animation has a beat to land first.
          setTimeout(() => {
            dispatch({
              type: 'start_celebration',
              celebration: { goal, reward },
            })
          }, 300)
        } else {
          dispatch({
            type: 'push_toast',
            toast: { message: afterLogCopy() },
          })
        }
        return true
      },
    }),
    [],
  )

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
