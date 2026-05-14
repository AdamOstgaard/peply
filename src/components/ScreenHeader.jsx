import { useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import './ScreenHeader.css'

export function ScreenHeader({ title, subtitle, onBack, right, transparent = false }) {
  const navigate = useNavigate()
  const handleBack = () => {
    if (onBack) return onBack()
    navigate(-1)
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
