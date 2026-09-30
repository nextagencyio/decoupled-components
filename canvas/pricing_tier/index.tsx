import { PricingCard } from '@/app/components/paragraphs/ParagraphPricing'
import { toLines } from '@/lib/canvas-props'

export default function PricingTier({ features, ...props }: any) {
  return <PricingCard tier={{ ...props, features: toLines(features) }} />
}
