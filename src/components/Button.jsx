import { motion } from 'framer-motion'
import './Button.css'

const variants = {
  primary: 'btn btn--primary',
  warm: 'btn btn--warm',
  cool: 'btn btn--cool',
  celebration: 'btn btn--celebration',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  block = false,
  children,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) {
  const cls = [
    variants[variant] ?? variants.primary,
    `btn--${size}`,
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 600, damping: 28 }}
      className={cls}
      {...props}
    >
      {leftIcon && <span className="btn__icon">{leftIcon}</span>}
      <span className="btn__label">{children}</span>
      {rightIcon && <span className="btn__icon">{rightIcon}</span>}
    </motion.button>
  )
}
