'use client'

import { clsx } from 'clsx'
import * as LucideIcons from 'lucide-react'
import type { ParagraphSidebyside as ParagraphSidebysideType } from '@/lib/types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Check } from 'lucide-react'

// Convert http URLs to https
function secureUrl(url: string): string {
  return url.replace(/^http:\/\//, 'https://')
}

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name]
  if (!IconComponent) return <Check className={className} />
  return <IconComponent className={className} />
}

export default function ParagraphSidebyside({
  eyebrow,
  title,
  content,
  image,
  imagePosition = 'right',
  features,
  ctaText,
  ctaUrl,
}: ParagraphSidebysideType) {
  const isImageLeft = imagePosition === 'left'

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div
          className={clsx(
            'grid md:grid-cols-2 gap-12 md:gap-16 items-center',
            isImageLeft && 'md:flex-row-reverse'
          )}
        >
          {/* Content */}
          <div className={clsx(isImageLeft && 'md:order-2')}>
            {eyebrow && (
              <Badge variant="primary" className="mb-4">
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {title}
              </h2>
            )}
            {content && (
              <div
                className="prose prose-lg text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Features List */}
            {features && features.length > 0 && (
              <ul className="space-y-4 mb-8">
                {features.map((feature) => (
                  <li key={feature.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <DynamicIcon
                        name={feature.icon || 'Check'}
                        className="w-5 h-5 text-primary-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      {feature.description && (
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            {ctaText && ctaUrl && (
              <Button variant="primary" href={ctaUrl}>
                {ctaText}
              </Button>
            )}
          </div>

          {/* Image */}
          <div
            className={clsx(
              'relative aspect-square md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden bg-gray-100',
              isImageLeft && 'md:order-1'
            )}
          >
            {image?.url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={secureUrl(image.url)}
                alt={image.alt || title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/50 rounded-2xl flex items-center justify-center">
                  <DynamicIcon name="Image" className="w-12 h-12 text-primary-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
