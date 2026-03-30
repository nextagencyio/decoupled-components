'use client'

/**
 * Registry of React components available as Puck render functions.
 *
 * The key matches the "puck.render" value in components-content.json.
 * To add a new component: import it and add one line here.
 */

import ParagraphHero from '@/app/components/paragraphs/ParagraphHero'
import ParagraphText from '@/app/components/paragraphs/ParagraphText'
import ParagraphNewsletter from '@/app/components/paragraphs/ParagraphNewsletter'
import ParagraphCardGroup from '@/app/components/paragraphs/ParagraphCardGroup'
import ParagraphSidebyside from '@/app/components/paragraphs/ParagraphSidebyside'
import ParagraphAccordion from '@/app/components/paragraphs/ParagraphAccordion'
import ParagraphQuote from '@/app/components/paragraphs/ParagraphQuote'
import ParagraphPricing from '@/app/components/paragraphs/ParagraphPricing'
import ParagraphLogoCollection from '@/app/components/paragraphs/ParagraphLogoCollection'
import ParagraphStats from '@/app/components/paragraphs/ParagraphStats'

export const componentRegistry: Record<string, React.ComponentType<any>> = {
  ParagraphHero,
  ParagraphText,
  ParagraphNewsletter,
  ParagraphCardGroup,
  ParagraphSidebyside,
  ParagraphAccordion,
  ParagraphQuote,
  ParagraphPricing,
  ParagraphLogoCollection,
  ParagraphStats,
}
