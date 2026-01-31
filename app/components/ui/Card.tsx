'use client'

import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'bordered' | 'elevated' | 'highlighted'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  onClick,
}: CardProps) {
  const baseStyles = 'rounded-xl transition-all duration-200'

  const variants = {
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    highlighted: 'bg-white border-2 border-primary-500 shadow-lg',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const classes = clsx(
    baseStyles,
    variants[variant],
    paddings[padding],
    onClick && 'cursor-pointer',
    className
  )

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}

export function CardTitle({ children, className, as: Component = 'h3' }: CardTitleProps) {
  return (
    <Component className={clsx('font-semibold text-gray-900', className)}>
      {children}
    </Component>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={clsx('text-gray-600', className)}>
      {children}
    </div>
  )
}
