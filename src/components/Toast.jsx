import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { CheckCircle, Info, Warning } from '@phosphor-icons/react'
import { useStore } from '../lib/store.jsx'
import './Toast.css'

const ICONS = {
  success: CheckCircle,
  warning: Warning,
  info: Info,
}

export function ToastHost() {
  const {
    state: { toasts },
    actions: { dismissToast },
  } = useStore()

  return (
    <div className="toast-host" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onDismiss={() => dismissToast(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const id = setTimeout(onDismiss, toast.duration ?? 2800)
    return () => clearTimeout(id)
  }, [onDismiss, toast.duration])

  const Icon = ICONS[toast.variant] ?? CheckCircle

  return (
    <motion.button
      type="button"
      onClick={onDismiss}
      className={`toast toast--${toast.variant ?? 'success'}`}
      initial={{ y: -40, opacity: 0, scale: 0.92 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 480, damping: 28 }}
    >
      <span className="toast__icon" aria-hidden>
        <Icon size={20} weight="fill" />
      </span>
      <span className="toast__message t-body-sm">{toast.message}</span>
    </motion.button>
  )
}
