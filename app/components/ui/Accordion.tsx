'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  children: React.ReactNode
  className?: string
  type?: 'single' | 'multiple'
  defaultOpen?: string[]
}

interface AccordionItemProps {
  id: string
  title: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: (id: string) => void
  className?: string
}

export function AccordionItem({
  id,
  title,
  children,
  isOpen = false,
  onToggle,
  className,
}: AccordionItemProps) {
  return (
    <div className={clsx('border-b border-gray-200 last:border-0', className)}>
      <button
        type="button"
        onClick={() => onToggle?.(id)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={clsx(
            'h-5 w-5 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        )}
      >
        <div className="text-gray-600 prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Accordion({
  children,
  className,
  type = 'single',
  defaultOpen = [],
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const handleToggle = (id: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(id) ? [] : [id])
    } else {
      setOpenItems(
        openItems.includes(id)
          ? openItems.filter((item) => item !== id)
          : [...openItems, id]
      )
    }
  }

  return (
    <div className={clsx('divide-y divide-gray-200', className)}>
      {Array.isArray(children)
        ? children.map((child: any) => {
            if (child?.props?.id) {
              return {
                ...child,
                props: {
                  ...child.props,
                  isOpen: openItems.includes(child.props.id),
                  onToggle: handleToggle,
                },
              }
            }
            return child
          })
        : children}
    </div>
  )
}
