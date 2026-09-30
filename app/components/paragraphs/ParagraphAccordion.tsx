'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import type { ParagraphAccordion as ParagraphAccordionType } from '@/lib/types'
import Badge from '../ui/Badge'

export function FaqItem({ question, answer, open = false }: { question: string; answer?: string; open?: boolean }) {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <div className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={clsx(
            'flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {answer && (
        <div className={clsx('overflow-hidden transition-all duration-200', isOpen ? 'max-h-96' : 'max-h-0')}>
          <div className="px-6 pb-6 prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: answer }} />
        </div>
      )}
    </div>
  )
}

export default function ParagraphAccordion({
  eyebrow,
  title,
  subtitle,
  items,
  children,
}: Omit<ParagraphAccordionType, '__typename' | 'id' | 'items'> & {
  items?: ParagraphAccordionType['items']
  /** Canvas passes list items as slotted child components instead of an array. */
  children?: React.ReactNode
}) {
  const listClass = 'bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-200'

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {(eyebrow || title || subtitle) && (
            <div className="text-center mb-12">
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

          {/* Accordion Items */}
          {Array.isArray(items) && items.length > 0 ? (
            <div className={listClass}>
              {items.map((item, index) => (
                <FaqItem key={item.id} question={item.question} answer={item.answer} open={index === 0} />
              ))}
            </div>
          ) : children ? (
            <div className={listClass}>{children}</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
