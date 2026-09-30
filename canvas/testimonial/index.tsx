import { TestimonialCard } from '@/app/components/paragraphs/ParagraphQuote'
import { toImage } from '@/lib/canvas-props'

export default function Testimonial({ authorImage, ...props }: any) {
  return <TestimonialCard testimonial={{ ...props, authorImage: toImage(authorImage) }} />
}
