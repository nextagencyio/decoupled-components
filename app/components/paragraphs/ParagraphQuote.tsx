'use client'

import { clsx } from 'clsx'
import { Star, Quote } from 'lucide-react'
import type { ParagraphQuote as ParagraphQuoteType, Testimonial } from '@/lib/types'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

// Convert http URLs to https
function secureUrl(url: string): string {
  return url.replace(/^http:\/\//, 'https://')
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card variant="bordered" className="h-full flex flex-col">
      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={clsx(
                'w-5 h-5',
                i < testimonial.rating!
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-200'
              )}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="flex-1 mb-6">
        <Quote className="w-8 h-8 text-primary-200 mb-2" />
        <p className="text-gray-700 leading-relaxed">{testimonial.quote}</p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        {testimonial.authorImage?.url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={secureUrl(testimonial.authorImage.url)}
            alt={testimonial.authorName}
            width={48}
            height={48}
            className="rounded-full w-12 h-12 object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-lg">
              {testimonial.authorName.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">
            {testimonial.authorName}
          </div>
          {(testimonial.authorTitle || testimonial.authorCompany) && (
            <div className="text-sm text-gray-500">
              {testimonial.authorTitle}
              {testimonial.authorTitle && testimonial.authorCompany && ' at '}
              {testimonial.authorCompany}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function ParagraphQuote({
  eyebrow,
  title,
  layout = 'grid',
  testimonials,
}: ParagraphQuoteType) {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Header */}
        {(eyebrow || title) && (
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
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

        {/* Testimonials */}
        {layout === 'single' && testimonials.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <TestimonialCard testimonial={testimonials[0]} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
