import ParagraphPricing from '@/app/components/paragraphs/ParagraphPricing'

export default function Pricing({ tiers, ...props }: any) {
  return <ParagraphPricing {...props}>{tiers}</ParagraphPricing>
}
