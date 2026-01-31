'use client'

import { clsx } from 'clsx'
import type { ParagraphHero as ParagraphHeroType } from '@/lib/types'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function ParagraphHero({
  eyebrow,
  title,
  subtitle,
  layout = 'centered',
  backgroundColor,
  backgroundImage,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
}: ParagraphHeroType) {
  const isGradient = backgroundColor === 'gradient'
  const isDark = backgroundColor === 'dark' || isGradient

  return (
    <section
      className={clsx(
        'relative overflow-hidden',
        isGradient && 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900',
        backgroundColor === 'dark' && 'bg-gray-900',
        backgroundColor === 'light' && 'bg-gray-50',
        !backgroundColor && 'bg-white'
      )}
    >
      {/* Background image */}
      {backgroundImage?.url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage.url})` }}
        >
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>
      )}

      {/* Decorative elements */}
      {isGradient && (
        <>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
        </>
      )}

      <div
        className={clsx(
          'relative container-wide py-20 md:py-28 lg:py-36',
          layout === 'centered' && 'text-center',
          layout === 'left-aligned' && 'text-left'
        )}
      >
        <div className={clsx(layout === 'centered' && 'max-w-4xl mx-auto')}>
          {/* Eyebrow */}
          {eyebrow && (
            <Badge
              variant={isDark ? 'primary' : 'default'}
              size="md"
              className="mb-6"
            >
              {eyebrow}
            </Badge>
          )}

          {/* Title */}
          <h1
            className={clsx(
              'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6',
              isDark || backgroundImage ? 'text-white' : 'text-gray-900'
            )}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={clsx(
                'text-lg md:text-xl max-w-2xl mb-10',
                layout === 'centered' && 'mx-auto',
                isDark || backgroundImage ? 'text-gray-200' : 'text-gray-600'
              )}
            >
              {subtitle}
            </p>
          )}

          {/* CTAs */}
          {(primaryCtaText || secondaryCtaText) && (
            <div
              className={clsx(
                'flex flex-col sm:flex-row gap-4',
                layout === 'centered' && 'justify-center'
              )}
            >
              {primaryCtaText && primaryCtaUrl && (
                <Button
                  variant={isDark ? 'secondary' : 'primary'}
                  size="lg"
                  href={primaryCtaUrl}
                >
                  {primaryCtaText}
                </Button>
              )}
              {secondaryCtaText && secondaryCtaUrl && (
                <Button
                  variant={isDark ? 'outline' : 'outline'}
                  size="lg"
                  href={secondaryCtaUrl}
                  className={isDark ? 'border-white text-white hover:bg-white/10' : ''}
                >
                  {secondaryCtaText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
