import ParagraphHero from '@/app/components/paragraphs/ParagraphHero'
import { toImage } from '@/lib/canvas-props'

export default function Hero({ backgroundImage, backgroundColor, ...props }: any) {
  return (
    <ParagraphHero
      {...props}
      backgroundColor={backgroundColor === 'white' ? undefined : backgroundColor}
      backgroundImage={toImage(backgroundImage)}
    />
  )
}
