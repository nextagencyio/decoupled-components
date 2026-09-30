'use client'

import { clsx } from 'clsx'
import type { ParagraphStats as ParagraphStatsType } from '@/lib/types'
import Badge from '../ui/Badge'

export function StatItem({ value, label, description }: { value: string; label: string; description?: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{value}</div>
      <div className="text-lg font-semibold text-gray-900 mb-1">{label}</div>
      {description && <div className="text-sm text-gray-500">{description}</div>}
    </div>
  )
}

export default function ParagraphStats({
  eyebrow,
  title,
  backgroundColor,
  stats,
  children,
}: Omit<ParagraphStatsType, '__typename' | 'id' | 'stats'> & {
  stats?: ParagraphStatsType['stats']
  /** Canvas passes list items as slotted child components instead of an array. */
  children?: React.ReactNode
}) {
  const isLight = backgroundColor === 'light'

  return (
    <section
      className={clsx(
        'section-padding',
        isLight ? 'bg-gray-50' : 'bg-white'
      )}
    >
      <div className="container-wide">
        {/* Header */}
        {(eyebrow || title) && (
          <div className="text-center mb-12">
            {eyebrow && (
              <Badge variant="primary" className="mb-4">
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {Array.isArray(stats) && stats.length > 0
            ? stats.map((stat) => <StatItem key={stat.id} {...stat} />)
            : children}
        </div>
      </div>
    </section>
  )
}
