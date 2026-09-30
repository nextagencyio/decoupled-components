import { LogoItem } from '@/app/components/paragraphs/ParagraphLogoCollection'
import { toImage } from '@/lib/canvas-props'

export default function Logo({ image, ...props }: any) {
  return <LogoItem logo={{ ...props, image: toImage(image) }} />
}
