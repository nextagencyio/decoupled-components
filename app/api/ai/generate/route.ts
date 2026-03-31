import { generatePuckContent } from 'puck-plugin-ai/server'

const COMPONENT_DOCS = `
Hero:
  eyebrow (string): Small text above the title
  title (string, required): Main heading
  subtitle (text): Supporting text
  layout (select: centered|left-aligned): Layout style
  backgroundColor (select: |light|dark|gradient): Background color
  backgroundImage (image): Background image
  primaryCtaText (string): Primary button text
  primaryCtaUrl (string): Primary button URL
  secondaryCtaText (string): Secondary button text
  secondaryCtaUrl (string): Secondary button URL

CardGroup:
  eyebrow (string): Small text above title
  title (string): Section heading
  subtitle (string): Supporting text
  columns (select: 2|3|4): Number of columns
  cards (array of Card): Feature cards
    Card: icon (string, Lucide icon name), title (string), description (string), linkText (string), linkUrl (string)

SideBySide:
  eyebrow (string): Small text above title
  title (string): Section heading
  content (text/HTML): Rich text content
  image (image): Side image
  imagePosition (select: left|right): Image placement
  features (array of FeatureItem): Feature list
    FeatureItem: icon (string, Lucide icon name), title (string), description (string)
  ctaText (string): CTA button text
  ctaUrl (string): CTA button URL

Accordion:
  eyebrow (string): Small text above title
  title (string): Section heading
  subtitle (string): Supporting text
  items (array of FaqItem): Collapsible items
    FaqItem: question (string), answer (text)

Testimonials:
  eyebrow (string): Small text above title
  title (string): Section heading
  layout (select: grid|single): Display layout
  testimonials (array of Testimonial): Customer quotes
    Testimonial: quote (text), authorName (string), authorTitle (string), authorCompany (string), authorImage (image), rating (string, number 1-5)

Pricing:
  eyebrow (string): Small text above title
  title (string): Section heading
  subtitle (string): Supporting text
  tiers (array of PricingTier): Pricing plans
    PricingTier: name (string), price (string, e.g. "$29"), billingPeriod (string, e.g. "/month"), description (string), features (array of strings), isFeatured (boolean), ctaText (string), ctaUrl (string)

LogoCollection:
  eyebrow (string): Small text above title
  title (string): Section heading
  logos (array of Logo): Company logos
    Logo: name (string), image (image), url (string)

Stats:
  eyebrow (string): Small text above title
  title (string): Section heading
  backgroundColor (select: |light|dark): Background style
  stats (array of StatItem): Key metrics
    StatItem: value (string, e.g. "99.9%"), label (string), description (string)

Newsletter:
  eyebrow (string): Small text above title
  title (string): Section heading
  subtitle (string): Supporting text
  placeholder (string): Input placeholder
  buttonText (string): Submit button text
  backgroundColor (select: |light|dark): Background style

TextBlock:
  eyebrow (string): Small text above title
  title (string): Section heading
  content (text/HTML): Rich text content
  alignment (select: left|center): Text alignment
  ctaText (string): CTA button text
  ctaUrl (string): CTA button URL
`

export async function POST(request: Request) {
  const { prompt, currentData } = await request.json()

  const result = await generatePuckContent({
    prompt,
    currentData,
    componentDocs: COMPONENT_DOCS,
    groqApiKey: process.env.GROQ_API_KEY,
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
  })

  if (result.error) {
    return Response.json(result, { status: 500 })
  }

  return Response.json(result)
}
