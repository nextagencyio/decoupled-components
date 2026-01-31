'use client'

import type { ParagraphType } from '@/lib/types'
import ParagraphHero from './ParagraphHero'
import ParagraphCardGroup from './ParagraphCardGroup'
import ParagraphSidebyside from './ParagraphSidebyside'
import ParagraphAccordion from './ParagraphAccordion'
import ParagraphQuote from './ParagraphQuote'
import ParagraphPricing from './ParagraphPricing'
import ParagraphLogoCollection from './ParagraphLogoCollection'
import ParagraphStats from './ParagraphStats'
import ParagraphNewsletter from './ParagraphNewsletter'
import ParagraphText from './ParagraphText'

interface ParagraphRendererProps {
  paragraph: ParagraphType
}

export default function ParagraphRenderer({ paragraph }: ParagraphRendererProps) {
  switch (paragraph.__typename) {
    case 'ParagraphHero':
      return <ParagraphHero {...paragraph} />
    case 'ParagraphCardGroup':
      return <ParagraphCardGroup {...paragraph} />
    case 'ParagraphSidebyside':
      return <ParagraphSidebyside {...paragraph} />
    case 'ParagraphAccordion':
      return <ParagraphAccordion {...paragraph} />
    case 'ParagraphQuote':
      return <ParagraphQuote {...paragraph} />
    case 'ParagraphPricing':
      return <ParagraphPricing {...paragraph} />
    case 'ParagraphLogoCollection':
      return <ParagraphLogoCollection {...paragraph} />
    case 'ParagraphStat':
      return <ParagraphStats {...paragraph} />
    case 'ParagraphNewsletter':
      return <ParagraphNewsletter {...paragraph} />
    case 'ParagraphTextBlock':
      return <ParagraphText {...paragraph} />
    default:
      console.warn('Unknown paragraph type:', (paragraph as any).__typename)
      return null
  }
}

interface ParagraphListProps {
  sections: ParagraphType[]
}

export function ParagraphList({ sections }: ParagraphListProps) {
  return (
    <>
      {sections.map((section) => (
        <ParagraphRenderer key={section.id} paragraph={section} />
      ))}
    </>
  )
}
