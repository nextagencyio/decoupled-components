import ParagraphStats from '@/app/components/paragraphs/ParagraphStats'

export default function Stats({ stats, ...props }: any) {
  return <ParagraphStats {...props}>{stats}</ParagraphStats>
}
