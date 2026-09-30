import ParagraphSidebyside from '@/app/components/paragraphs/ParagraphSidebyside'
import { toImage } from '@/lib/canvas-props'

export default function SideBySide({ image, features, ...props }: any) {
  return (
    <ParagraphSidebyside {...props} image={toImage(image)}>
      {features}
    </ParagraphSidebyside>
  )
}
