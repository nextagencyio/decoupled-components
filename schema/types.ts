// Auto-generated TypeScript types from Drupal GraphQL schema.
// Run `decoupled-cli schema sync` to regenerate.

export interface ParagraphAccordion {
  id: string;
  eyebrow: string;
  items: any[];
  subtitle: { value: string };
  title: string;
}

export interface ParagraphCard {
  id: string;
  description: { value: string };
  icon: string;
  linkText: string;
  linkUrl: string;
  title: string;
}

export interface ParagraphCardGroup {
  id: string;
  cards: any[];
  columns: string;
  eyebrow: string;
  subtitle: { value: string };
  title: string;
}

export interface ParagraphFaqItem {
  id: string;
  answer: { value: string };
  question: string;
}

export interface ParagraphFeatureItem {
  id: string;
  description: { value: string };
  icon: string;
  title: string;
}

export interface ParagraphHero {
  id: string;
  backgroundColor: string;
  backgroundImage: { url: string; alt: string; width: number; height: number };
  eyebrow: string;
  layout: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  subtitle: { value: string };
  title: string;
}

export interface ParagraphLogo {
  id: string;
  image: { url: string; alt: string; width: number; height: number };
  name: string;
  url: string;
}

export interface ParagraphLogoCollection {
  id: string;
  eyebrow: string;
  logos: any[];
  title: string;
}

export interface ParagraphNewsletter {
  id: string;
  backgroundColor: string;
  buttonText: string;
  eyebrow: string;
  placeholder: string;
  subtitle: { value: string };
  title: string;
}

export interface ParagraphPricing {
  id: string;
  eyebrow: string;
  subtitle: { value: string };
  tiers: any[];
  title: string;
}

export interface ParagraphPricingTier {
  id: string;
  billingPeriod: string;
  ctaText: string;
  ctaUrl: string;
  description: { value: string };
  features: any[];
  isFeatured: boolean;
  name: string;
  price: string;
}

export interface ParagraphQuote {
  id: string;
  eyebrow: string;
  layout: string;
  testimonials: any[];
  title: string;
}

export interface ParagraphSidebyside {
  id: string;
  content: { value: string };
  ctaText: string;
  ctaUrl: string;
  eyebrow: string;
  features: any[];
  image: { url: string; alt: string; width: number; height: number };
  imagePosition: string;
  title: string;
}

export interface ParagraphStat {
  id: string;
  backgroundColor: string;
  eyebrow: string;
  stats: any[];
  title: string;
}

export interface ParagraphStatItem {
  id: string;
  description: { value: string };
  label: string;
  value: string;
}

export interface ParagraphTestimonial {
  id: string;
  authorCompany: string;
  authorImage: { url: string; alt: string; width: number; height: number };
  authorName: string;
  authorTitle: string;
  quote: { value: string };
  rating: string;
}

export interface ParagraphTextBlock {
  id: string;
  alignment: string;
  content: { value: string };
  ctaText: string;
  ctaUrl: string;
  eyebrow: string;
  title: string;
}

export interface NodeLandingPage {
  id: string;
  path: string;
  sections: any[];
  title: string;
}
