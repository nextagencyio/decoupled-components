'use client'

import { clsx } from 'clsx'
import type { ParagraphText as ParagraphTextType } from '@/lib/types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function ParagraphText({
  eyebrow,
  title,
  content,
  alignment = 'left',
  ctaText,
  ctaUrl,
}: ParagraphTextType) {
  const isCentered = alignment === 'center'

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div
          className={clsx(
            'max-w-3xl',
            isCentered ? 'mx-auto text-center' : ''
          )}
        >
          {/* Eyebrow */}
          {eyebrow && (
            <Badge variant="primary" className="mb-4">
              {eyebrow}
            </Badge>
          )}

          {/* Title */}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}

          {/* Content */}
          <div
            className={clsx(
              'prose prose-lg max-w-none',
              isCentered && 'prose-center'
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* CTA */}
          {ctaText && ctaUrl && (
            <div className={clsx('mt-8', isCentered && 'text-center')}>
              <Button variant="primary" href={ctaUrl}>
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
