import ParagraphQuote from '@/app/components/paragraphs/ParagraphQuote'

export default function Testimonials({ testimonials, ...props }: any) {
  return <ParagraphQuote {...props}>{testimonials}</ParagraphQuote>
}
