import ParagraphCardGroup from '@/app/components/paragraphs/ParagraphCardGroup'

export default function CardGroup({ cards, ...props }: any) {
  return <ParagraphCardGroup {...props}>{cards}</ParagraphCardGroup>
}
