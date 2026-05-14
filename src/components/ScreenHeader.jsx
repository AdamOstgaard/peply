import { useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import './ScreenHeader.css'

function canNavigateBack() {
  if (typeof window === 'undefined') return false
  return (window.history.state?.idx ?? 0) > 0
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  transparent = false,
  fallback = '/',
}) {
  const navigate = useNavigate()
  const handleBack = () => {
    if (onBack) return onBack()
    if (canNavigateBack()) navigate(-1)
    else navigate(fallback, { replace: true })
  }
  return (
    <header className={`screen-header ${transparent ? 'screen-header--transparent' : ''}`}>
      <button
        type="button"
        className="screen-header__back"
        onClick={handleBack}
        aria-label="Go back"
      >
        <CaretLeft size={22} weight="bold" />
      </button>
      <div className="screen-header__titles">
        {title && <h1 className="t-headline">{title}</h1>}
        {subtitle && <div className="t-body-sm muted">{subtitle}</div>}
      </div>
      <div className="screen-header__right">{right}</div>
    </header>
  )
}
