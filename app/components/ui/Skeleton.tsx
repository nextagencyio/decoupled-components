'use client'

import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export default function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200'

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
    none: '',
  }

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={clsx(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  )
}

// Pre-built skeleton components for common patterns
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx('bg-white rounded-xl border border-gray-100 p-6', className)}>
      <Skeleton variant="circular" width={48} height={48} className="mb-4" />
      <Skeleton variant="text" height={24} className="w-3/4 mb-3" />
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={clsx('bg-gradient-to-br from-gray-100 to-gray-50 py-20 md:py-32', className)}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Skeleton variant="rounded" height={28} className="w-32 mx-auto mb-6" />
        <Skeleton variant="text" height={48} className="w-full mb-4" />
        <Skeleton variant="text" height={48} className="w-3/4 mx-auto mb-6" />
        <Skeleton variant="text" height={24} className="w-2/3 mx-auto mb-8" />
        <div className="flex justify-center gap-4">
          <Skeleton variant="rounded" width={140} height={48} />
          <Skeleton variant="rounded" width={140} height={48} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={clsx('py-16 bg-gray-50', className)}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton variant="text" height={40} className="w-24 mx-auto mb-2" />
              <Skeleton variant="text" height={20} className="w-20 mx-auto mb-1" />
              <Skeleton variant="text" height={14} className="w-32 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonCardGroup({ columns = 3, className }: { columns?: number; className?: string }) {
  return (
    <div className={clsx('py-16', className)}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton variant="rounded" height={24} className="w-24 mx-auto mb-4" />
          <Skeleton variant="text" height={36} className="w-96 max-w-full mx-auto mb-4" />
          <Skeleton variant="text" height={20} className="w-80 max-w-full mx-auto" />
        </div>
        <div className={clsx('grid gap-6', {
          'md:grid-cols-2': columns === 2,
          'md:grid-cols-3': columns === 3,
          'md:grid-cols-4': columns === 4,
        })}>
          {[...Array(columns)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonSidebyside({ imagePosition = 'right', className }: { imagePosition?: 'left' | 'right'; className?: string }) {
  return (
    <div className={clsx('py-16', className)}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={clsx('grid md:grid-cols-2 gap-12 items-center', imagePosition === 'left' && 'md:flex-row-reverse')}>
          <div className={imagePosition === 'left' ? 'md:order-2' : ''}>
            <Skeleton variant="rounded" height={24} className="w-24 mb-4" />
            <Skeleton variant="text" height={36} className="w-full mb-4" />
            <SkeletonText lines={3} className="mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton variant="rounded" width={40} height={40} />
                  <div className="flex-1">
                    <Skeleton variant="text" height={20} className="w-32 mb-2" />
                    <Skeleton variant="text" height={14} className="w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={clsx('aspect-square md:aspect-auto md:h-[400px]', imagePosition === 'left' && 'md:order-1')}>
            <Skeleton variant="rounded" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonTestimonials({ className }: { className?: string }) {
  return (
    <div className={clsx('py-16 bg-gray-50', className)}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton variant="rounded" height={24} className="w-28 mx-auto mb-4" />
          <Skeleton variant="text" height={36} className="w-80 max-w-full mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} variant="circular" width={20} height={20} />
                ))}
              </div>
              <SkeletonText lines={3} className="mb-6" />
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <Skeleton variant="circular" width={48} height={48} />
                <div>
                  <Skeleton variant="text" height={18} className="w-24 mb-1" />
                  <Skeleton variant="text" height={14} className="w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonPricing({ className }: { className?: string }) {
  return (
    <div className={clsx('py-16', className)}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton variant="rounded" height={24} className="w-20 mx-auto mb-4" />
          <Skeleton variant="text" height={36} className="w-72 max-w-full mx-auto mb-4" />
          <Skeleton variant="text" height={20} className="w-96 max-w-full mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={clsx(
              'bg-white rounded-xl border p-6',
              i === 1 ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-100'
            )}>
              <Skeleton variant="text" height={24} className="w-20 mb-2" />
              <div className="flex items-baseline gap-1 mb-4">
                <Skeleton variant="text" height={48} className="w-20" />
                <Skeleton variant="text" height={16} className="w-16" />
              </div>
              <Skeleton variant="text" height={16} className="w-full mb-6" />
              <div className="space-y-3 mb-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex gap-2">
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" height={16} className="flex-1" />
                  </div>
                ))}
              </div>
              <Skeleton variant="rounded" height={44} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonAccordion({ className }: { className?: string }) {
  return (
    <div className={clsx('py-16 bg-gray-50', className)}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton variant="rounded" height={24} className="w-16 mx-auto mb-4" />
          <Skeleton variant="text" height={36} className="w-80 max-w-full mx-auto mb-4" />
          <Skeleton variant="text" height={20} className="w-full mx-auto" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex justify-between items-center">
                <Skeleton variant="text" height={20} className="w-3/4" />
                <Skeleton variant="circular" width={24} height={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonNewsletter({ className }: { className?: string }) {
  return (
    <div className={clsx('py-16 bg-gray-900', className)}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Skeleton variant="rounded" height={24} className="w-28 mx-auto mb-4 bg-gray-700" />
        <Skeleton variant="text" height={36} className="w-72 max-w-full mx-auto mb-4 bg-gray-700" />
        <Skeleton variant="text" height={20} className="w-full mx-auto mb-8 bg-gray-700" />
        <div className="flex gap-3 max-w-md mx-auto">
          <Skeleton variant="rounded" height={48} className="flex-1 bg-gray-700" />
          <Skeleton variant="rounded" width={120} height={48} className="bg-gray-700" />
        </div>
      </div>
    </div>
  )
}
