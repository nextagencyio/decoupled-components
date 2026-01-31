'use client'

import { clsx } from 'clsx'
import * as LucideIcons from 'lucide-react'
import type { ParagraphCardGroup as ParagraphCardGroupType, Card as CardType } from '@/lib/types'
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

function FeatureCard({ card }: { card: CardType }) {
  return (
    <Card variant="bordered" className="h-full hover:border-primary-200 hover:shadow-md transition-all">
      {card.icon && (
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
          <DynamicIcon name={card.icon} className="w-6 h-6 text-primary-600" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {card.description && (
          <p className="text-gray-600 mb-4">{card.description}</p>
        )}
        {card.linkText && card.linkUrl && (
          <Button variant="ghost" href={card.linkUrl} className="p-0 h-auto text-primary-600 hover:text-primary-700">
            {card.linkText} →
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function ParagraphCardGroup({
  eyebrow,
  title,
  subtitle,
  columns = '3',
  cards,
}: ParagraphCardGroupType) {
  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="section-padding bg-white" id="features">
      <div className="container-wide">
        {/* Header */}
        {(eyebrow || title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            {eyebrow && (
              <Badge variant="primary" className="mb-4">
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {cards && cards.length > 0 ? (
          <div className={clsx('grid gap-6 md:gap-8', gridCols[columns])}>
            {cards.map((card) => (
              <FeatureCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No cards configured. Add cards in the Drupal admin.</p>
          </div>
        )}
      </div>
    </section>
  )
}
