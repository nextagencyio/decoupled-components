import ParagraphLogoCollection from '@/app/components/paragraphs/ParagraphLogoCollection'

export default function LogoCollection({ logos, ...props }: any) {
  return <ParagraphLogoCollection {...props}>{logos}</ParagraphLogoCollection>
}
