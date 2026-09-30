import ParagraphAccordion from '@/app/components/paragraphs/ParagraphAccordion'

export default function Accordion({ items, ...props }: any) {
  return <ParagraphAccordion {...props}>{items}</ParagraphAccordion>
}
