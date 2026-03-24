import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary'
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--secondary)] text-[var(--foreground)]',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    primary: 'bg-[var(--primary)]/20 text-[var(--primary)]',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}