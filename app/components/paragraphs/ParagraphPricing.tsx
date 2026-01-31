'use client'

import { clsx } from 'clsx'
import { Check } from 'lucide-react'
import type { ParagraphPricing as ParagraphPricingType, PricingTier } from '@/lib/types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Card from '../ui/Card'

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <Card
      variant={tier.isFeatured ? 'highlighted' : 'bordered'}
      className={clsx(
        'h-full flex flex-col relative',
        tier.isFeatured && 'scale-105 z-10'
      )}
    >
      {tier.isFeatured && (
        <Badge
          variant="primary"
          className="absolute -top-3 left-1/2 -translate-x-1/2"
        >
          Most Popular
        </Badge>
      )}

      {/* Tier Name & Price */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {tier.name}
        </h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl md:text-5xl font-bold text-gray-900">
            {tier.price}
          </span>
          {tier.billingPeriod && (
            <span className="text-gray-500">{tier.billingPeriod}</span>
          )}
        </div>
        {tier.description && (
          <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
        )}
      </div>

      {/* Features */}
      {tier.features && tier.features.length > 0 && (
        <ul className="flex-1 space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      {tier.ctaText && tier.ctaUrl && (
        <Button
          variant={tier.isFeatured ? 'primary' : 'outline'}
          href={tier.ctaUrl}
          className="w-full justify-center"
        >
          {tier.ctaText}
        </Button>
      )}
    </Card>
  )
}

export default function ParagraphPricing({
  eyebrow,
  title,
  subtitle,
  tiers,
}: ParagraphPricingType) {
  return (
    <section className="section-padding bg-gray-50" id="pricing">
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

        {/* Pricing Tiers */}
        {tiers && tiers.length > 0 ? (
          <div
            className={clsx(
              'grid gap-6 md:gap-8 items-start',
              tiers.length === 2 && 'md:grid-cols-2 max-w-4xl mx-auto',
              tiers.length === 3 && 'md:grid-cols-3',
              tiers.length >= 4 && 'md:grid-cols-2 lg:grid-cols-4'
            )}
          >
            {tiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No pricing tiers configured. Add tiers in the Drupal admin.</p>
          </div>
        )}
      </div>
    </section>
  )
}
