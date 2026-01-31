'use client'

import ParagraphHero from './paragraphs/ParagraphHero'
import ParagraphLogoCollection from './paragraphs/ParagraphLogoCollection'
import ParagraphStats from './paragraphs/ParagraphStats'
import ParagraphCardGroup from './paragraphs/ParagraphCardGroup'
import ParagraphSidebyside from './paragraphs/ParagraphSidebyside'
import ParagraphPricing from './paragraphs/ParagraphPricing'
import ParagraphQuote from './paragraphs/ParagraphQuote'
import ParagraphAccordion from './paragraphs/ParagraphAccordion'
import ParagraphNewsletter from './paragraphs/ParagraphNewsletter'

// Demo data for showcasing components without Drupal
const demoData = {
  hero: {
    __typename: 'ParagraphHero' as const,
    id: 'hero-1',
    eyebrow: 'LaunchPad',
    title: 'Ship products faster with the platform built for modern teams',
    subtitle: 'Everything you need to build, deploy, and scale your product. Powerful components, seamless integrations, and world-class support.',
    layout: 'centered' as const,
    backgroundColor: 'gradient',
    primaryCtaText: 'Get Started Free',
    primaryCtaUrl: '/signup',
    secondaryCtaText: 'Book a Demo',
    secondaryCtaUrl: '/demo',
  },
  logos: {
    __typename: 'ParagraphLogoCollection' as const,
    id: 'logos-1',
    title: 'Trusted by 10,000+ teams worldwide',
    logos: [
      { id: '1', name: 'Acme Corp' },
      { id: '2', name: 'TechFlow' },
      { id: '3', name: 'Quantum' },
      { id: '4', name: 'NovaSoft' },
      { id: '5', name: 'CloudBase' },
      { id: '6', name: 'DataStream' },
    ],
  },
  stats: {
    __typename: 'ParagraphStat' as const,
    id: 'stats-1',
    backgroundColor: 'light',
    stats: [
      { id: '1', value: '500K+', label: 'Active Users', description: 'Developers and teams use LaunchPad daily' },
      { id: '2', value: '99.9%', label: 'Uptime', description: 'Enterprise-grade reliability' },
      { id: '3', value: '4.9/5', label: 'Rating', description: 'From over 2,000 reviews' },
      { id: '4', value: '50+', label: 'Integrations', description: 'Connect with your favorite tools' },
    ],
  },
  features: {
    __typename: 'ParagraphCardGroup' as const,
    id: 'features-1',
    eyebrow: 'Features',
    title: 'Everything you need to build faster',
    subtitle: 'Powerful tools and components designed for modern development teams.',
    columns: '3' as const,
    cards: [
      { id: '1', icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed with instant page loads and real-time updates. Build experiences your users will love.', linkText: 'Learn more', linkUrl: '#' },
      { id: '2', icon: 'Shield', title: 'Enterprise Security', description: 'SOC2 compliant with end-to-end encryption. Your data is protected with industry-leading security measures.', linkText: 'Learn more', linkUrl: '#' },
      { id: '3', icon: 'Blocks', title: 'Modular Components', description: 'Pre-built, customizable components that work together seamlessly. Mix and match to create your perfect stack.', linkText: 'Learn more', linkUrl: '#' },
    ],
  },
  sidebyside1: {
    __typename: 'ParagraphSidebyside' as const,
    id: 'sidebyside-1',
    eyebrow: 'How It Works',
    title: 'From idea to production in minutes',
    content: '<p>LaunchPad streamlines your entire development workflow. Write code with our powerful components, preview changes instantly, and ship to production with confidence.</p>',
    imagePosition: 'right' as const,
    features: [
      { id: '1', icon: 'Code', title: 'Write Code', description: 'Use our intuitive API and components to build your product quickly' },
      { id: '2', icon: 'GitBranch', title: 'Preview Changes', description: 'Every branch gets a preview deployment for easy collaboration' },
      { id: '3', icon: 'Rocket', title: 'Ship to Production', description: 'One-click deployments with automatic scaling and optimization' },
    ],
    ctaText: 'Start Building',
    ctaUrl: '#',
  },
  sidebyside2: {
    __typename: 'ParagraphSidebyside' as const,
    id: 'sidebyside-2',
    eyebrow: 'Integrations',
    title: 'Connect with the tools you already use',
    content: '<p>LaunchPad integrates seamlessly with your existing tech stack. No need to change how you work - we adapt to your workflow.</p>',
    imagePosition: 'left' as const,
    features: [
      { id: '1', icon: 'Database', title: 'Database Integrations', description: 'PostgreSQL, MySQL, MongoDB, and more with automatic backups' },
      { id: '2', icon: 'Cloud', title: 'Cloud Providers', description: 'Deploy to AWS, GCP, Azure, or our managed infrastructure' },
      { id: '3', icon: 'Lock', title: 'Auth Providers', description: 'Built-in support for OAuth, SAML, and custom authentication' },
    ],
    ctaText: 'View All Integrations',
    ctaUrl: '#',
  },
  pricing: {
    __typename: 'ParagraphPricing' as const,
    id: 'pricing-1',
    eyebrow: 'Pricing',
    title: 'Simple, transparent pricing',
    subtitle: 'Start free and scale as you grow. No hidden fees, no surprises.',
    tiers: [
      { id: '1', name: 'Starter', price: '$0', billingPeriod: 'forever', description: 'Perfect for side projects and learning', features: ['Up to 3 projects', '1GB storage', 'Community support', 'Basic analytics', 'SSL certificates'], isFeatured: false, ctaText: 'Get Started', ctaUrl: '#' },
      { id: '2', name: 'Pro', price: '$29', billingPeriod: '/month', description: 'For professionals and growing teams', features: ['Unlimited projects', '50GB storage', 'Priority support', 'Advanced analytics', 'Custom domains', 'Team collaboration', 'API access'], isFeatured: true, ctaText: 'Start Free Trial', ctaUrl: '#' },
      { id: '3', name: 'Enterprise', price: 'Custom', billingPeriod: '', description: 'For large teams with custom needs', features: ['Everything in Pro', 'Unlimited storage', '24/7 dedicated support', 'Custom integrations', 'SLA guarantee', 'SAML SSO', 'Audit logs', 'On-premise option'], isFeatured: false, ctaText: 'Contact Sales', ctaUrl: '#' },
    ],
  },
  quotes: {
    __typename: 'ParagraphQuote' as const,
    id: 'quotes-1',
    eyebrow: 'Testimonials',
    title: 'Loved by developers worldwide',
    layout: 'grid' as const,
    testimonials: [
      { id: '1', quote: 'LaunchPad has completely transformed how our team builds products. We shipped our last feature in half the time it usually takes.', authorName: 'Sarah Chen', authorTitle: 'CTO', authorCompany: 'TechFlow', rating: 5 },
      { id: '2', quote: "The component library is incredible. Everything just works together seamlessly. It's like having an extra engineer on the team.", authorName: 'Marcus Johnson', authorTitle: 'Lead Developer', authorCompany: 'Quantum Labs', rating: 5 },
      { id: '3', quote: 'We evaluated 10 different platforms before choosing LaunchPad. The developer experience and support are unmatched.', authorName: 'Emily Rodriguez', authorTitle: 'Engineering Manager', authorCompany: 'NovaSoft', rating: 5 },
    ],
  },
  faq: {
    __typename: 'ParagraphAccordion' as const,
    id: 'faq-1',
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    subtitle: "Everything you need to know about LaunchPad. Can't find what you're looking for? Contact our support team.",
    items: [
      { id: '1', question: 'How do I get started with LaunchPad?', answer: "<p>Getting started is easy! Sign up for a free account, and you'll have access to our starter tier immediately. Follow our quick-start guide to deploy your first project in under 5 minutes.</p>" },
      { id: '2', question: 'Can I migrate my existing project to LaunchPad?', answer: '<p>Absolutely! We support migrations from most major platforms. Our CLI tool can help automate the process, and our support team is available to assist with complex migrations.</p>' },
      { id: '3', question: 'What languages and frameworks are supported?', answer: '<p>LaunchPad supports all major languages and frameworks including React, Vue, Next.js, Node.js, Python, Go, and more. If you can containerize it, we can run it.</p>' },
      { id: '4', question: 'Is there a limit on team members?', answer: '<p>The Starter plan includes up to 3 team members. Pro plans support unlimited team members. Enterprise customers can configure custom access controls and team structures.</p>' },
      { id: '5', question: 'How does billing work?', answer: '<p>We bill monthly or annually (with a 20% discount for annual plans). You can upgrade, downgrade, or cancel at any time. We prorate any changes to your subscription.</p>' },
      { id: '6', question: 'Do you offer refunds?', answer: "<p>Yes! If you're not satisfied within the first 30 days, we offer a full refund, no questions asked. We're confident you'll love LaunchPad.</p>" },
    ],
  },
  newsletter: {
    __typename: 'ParagraphNewsletter' as const,
    id: 'newsletter-1',
    eyebrow: 'Stay Updated',
    title: 'Ready to get started?',
    subtitle: 'Join thousands of developers building the future. Get product updates, tips, and exclusive content delivered to your inbox.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
    backgroundColor: 'dark' as const,
  },
}

export default function DemoHomepage() {
  return (
    <>
      <ParagraphHero {...demoData.hero} />
      <ParagraphLogoCollection {...demoData.logos} />
      <ParagraphStats {...demoData.stats} />
      <ParagraphCardGroup {...demoData.features} />
      <ParagraphSidebyside {...demoData.sidebyside1} />
      <ParagraphSidebyside {...demoData.sidebyside2} />
      <ParagraphPricing {...demoData.pricing} />
      <ParagraphQuote {...demoData.quotes} />
      <ParagraphAccordion {...demoData.faq} />
      <ParagraphNewsletter {...demoData.newsletter} />
    </>
  )
}
