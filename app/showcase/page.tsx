import type { Metadata } from 'next'
import ParagraphHero from '../components/paragraphs/ParagraphHero'
import ParagraphLogoCollection from '../components/paragraphs/ParagraphLogoCollection'
import ParagraphStats from '../components/paragraphs/ParagraphStats'
import ParagraphCardGroup from '../components/paragraphs/ParagraphCardGroup'
import ParagraphSidebyside from '../components/paragraphs/ParagraphSidebyside'
import ParagraphPricing from '../components/paragraphs/ParagraphPricing'
import ParagraphQuote from '../components/paragraphs/ParagraphQuote'
import ParagraphAccordion from '../components/paragraphs/ParagraphAccordion'
import ParagraphNewsletter from '../components/paragraphs/ParagraphNewsletter'
import ParagraphText from '../components/paragraphs/ParagraphText'

export const metadata: Metadata = {
  title: 'Component Showcase | LaunchPad',
  description: 'Preview all available paragraph components',
}

// Component showcase data
const components = [
  {
    name: 'Hero',
    description: 'Full-width hero with gradient/image backgrounds, multiple layouts',
    component: (
      <ParagraphHero
        __typename="ParagraphHero"
        id="hero-showcase"
        eyebrow="Component Showcase"
        title="Beautiful Hero Sections"
        subtitle="Full-width hero with support for gradient and image backgrounds, centered or left-aligned layouts, and multiple CTAs."
        layout="centered"
        backgroundColor="gradient"
        primaryCtaText="Primary Action"
        primaryCtaUrl="#"
        secondaryCtaText="Secondary Action"
        secondaryCtaUrl="#"
      />
    ),
  },
  {
    name: 'Logo Collection',
    description: 'Partner/client logos grid for trust signals',
    component: (
      <ParagraphLogoCollection
        __typename="ParagraphLogoCollection"
        id="logos-showcase"
        title="Trusted by leading companies"
        logos={[
          { id: '1', name: 'Acme Corp' },
          { id: '2', name: 'TechFlow' },
          { id: '3', name: 'Quantum' },
          { id: '4', name: 'NovaSoft' },
          { id: '5', name: 'CloudBase' },
        ]}
      />
    ),
  },
  {
    name: 'Stats',
    description: 'Key statistics/metrics display',
    component: (
      <ParagraphStats
        __typename="ParagraphStat"
        id="stats-showcase"
        eyebrow="By the numbers"
        title="Our Impact"
        backgroundColor="light"
        stats={[
          { id: '1', value: '10M+', label: 'Users', description: 'Worldwide' },
          { id: '2', value: '99.9%', label: 'Uptime', description: 'Last 12 months' },
          { id: '3', value: '4.9', label: 'Rating', description: 'App Store' },
          { id: '4', value: '24/7', label: 'Support', description: 'Always available' },
        ]}
      />
    ),
  },
  {
    name: 'Card Group',
    description: 'Flexible grid of feature/stat cards (2-4 columns)',
    component: (
      <ParagraphCardGroup
        __typename="ParagraphCardGroup"
        id="cards-showcase"
        eyebrow="Features"
        title="Powerful Capabilities"
        subtitle="Everything you need in one platform"
        columns="3"
        cards={[
          { id: '1', icon: 'Sparkles', title: 'AI-Powered', description: 'Smart suggestions and automation built right in.', linkText: 'Learn more', linkUrl: '#' },
          { id: '2', icon: 'Globe', title: 'Global CDN', description: 'Lightning-fast delivery to users worldwide.', linkText: 'Learn more', linkUrl: '#' },
          { id: '3', icon: 'Shield', title: 'Enterprise Security', description: 'SOC2 compliant with end-to-end encryption.', linkText: 'Learn more', linkUrl: '#' },
        ]}
      />
    ),
  },
  {
    name: 'Side by Side (Image Right)',
    description: 'Two-column layout with image + content + features',
    component: (
      <ParagraphSidebyside
        __typename="ParagraphSidebyside"
        id="sidebyside-1-showcase"
        eyebrow="How It Works"
        title="Simple, Intuitive Workflow"
        content="<p>Get started in minutes with our streamlined onboarding process. No complex setup required.</p>"
        imagePosition="right"
        features={[
          { id: '1', icon: 'Download', title: 'Install', description: 'One command to get started' },
          { id: '2', icon: 'Settings', title: 'Configure', description: 'Customize to your needs' },
          { id: '3', icon: 'Play', title: 'Launch', description: 'Deploy with confidence' },
        ]}
        ctaText="Get Started"
        ctaUrl="#"
      />
    ),
  },
  {
    name: 'Side by Side (Image Left)',
    description: 'Two-column layout with reversed positioning',
    component: (
      <ParagraphSidebyside
        __typename="ParagraphSidebyside"
        id="sidebyside-2-showcase"
        eyebrow="Integrations"
        title="Works With Your Stack"
        content="<p>Connect to 100+ tools and services you already use. Seamless integrations that just work.</p>"
        imagePosition="left"
        features={[
          { id: '1', icon: 'Database', title: 'Databases', description: 'PostgreSQL, MySQL, MongoDB' },
          { id: '2', icon: 'Cloud', title: 'Cloud', description: 'AWS, GCP, Azure' },
          { id: '3', icon: 'GitBranch', title: 'Version Control', description: 'GitHub, GitLab, Bitbucket' },
        ]}
        ctaText="View Integrations"
        ctaUrl="#"
      />
    ),
  },
  {
    name: 'Pricing',
    description: 'Pricing tier cards with features',
    component: (
      <ParagraphPricing
        __typename="ParagraphPricing"
        id="pricing-showcase"
        eyebrow="Pricing"
        title="Choose Your Plan"
        subtitle="Start free, scale as you grow"
        tiers={[
          { id: '1', name: 'Free', price: '$0', billingPeriod: '/month', description: 'For personal projects', features: ['1 project', '1GB storage', 'Community support'], isFeatured: false, ctaText: 'Get Started', ctaUrl: '#' },
          { id: '2', name: 'Pro', price: '$29', billingPeriod: '/month', description: 'For growing teams', features: ['Unlimited projects', '50GB storage', 'Priority support', 'Analytics'], isFeatured: true, ctaText: 'Start Trial', ctaUrl: '#' },
          { id: '3', name: 'Enterprise', price: 'Custom', description: 'For large organizations', features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA'], isFeatured: false, ctaText: 'Contact Us', ctaUrl: '#' },
        ]}
      />
    ),
  },
  {
    name: 'Testimonials',
    description: 'Customer testimonials with author info',
    component: (
      <ParagraphQuote
        __typename="ParagraphQuote"
        id="quotes-showcase"
        eyebrow="Testimonials"
        title="What Our Customers Say"
        layout="grid"
        testimonials={[
          { id: '1', quote: 'This product changed everything for us. Highly recommended!', authorName: 'Jane Smith', authorTitle: 'CEO', authorCompany: 'TechCorp', rating: 5 },
          { id: '2', quote: 'Incredible developer experience. The team is super responsive.', authorName: 'John Doe', authorTitle: 'CTO', authorCompany: 'StartupXYZ', rating: 5 },
          { id: '3', quote: "We've cut our development time in half since switching.", authorName: 'Sarah Johnson', authorTitle: 'Lead Developer', authorCompany: 'DevAgency', rating: 5 },
        ]}
      />
    ),
  },
  {
    name: 'Accordion / FAQ',
    description: 'Collapsible FAQ sections with animations',
    component: (
      <ParagraphAccordion
        __typename="ParagraphAccordion"
        id="faq-showcase"
        eyebrow="FAQ"
        title="Common Questions"
        subtitle="Find answers to frequently asked questions"
        items={[
          { id: '1', question: 'How do I get started?', answer: '<p>Sign up for a free account and follow our quick-start guide. You\'ll be up and running in under 5 minutes.</p>' },
          { id: '2', question: 'Is there a free trial?', answer: '<p>Yes! Our Pro plan comes with a 14-day free trial. No credit card required.</p>' },
          { id: '3', question: 'Can I cancel anytime?', answer: '<p>Absolutely. You can cancel your subscription at any time with no questions asked.</p>' },
          { id: '4', question: 'Do you offer support?', answer: '<p>We offer community support for free users and priority support for Pro and Enterprise customers.</p>' },
        ]}
      />
    ),
  },
  {
    name: 'Text',
    description: 'Rich text with eyebrow/title/buttons',
    component: (
      <ParagraphText
        __typename="ParagraphTextBlock"
        id="text-showcase"
        eyebrow="About Us"
        title="Our Mission"
        content="<p>We believe that building great software shouldn't be complicated. That's why we created this platform - to help teams of all sizes ship products faster and with more confidence.</p><p>Our team is made up of engineers, designers, and product people who have experienced the pain of slow development cycles firsthand. We're here to change that.</p>"
        alignment="left"
        ctaText="Learn More"
        ctaUrl="#"
      />
    ),
  },
  {
    name: 'Newsletter',
    description: 'Email signup form section',
    component: (
      <ParagraphNewsletter
        __typename="ParagraphNewsletter"
        id="newsletter-showcase"
        eyebrow="Newsletter"
        title="Stay in the loop"
        subtitle="Get the latest updates, tips, and news delivered to your inbox."
        placeholder="Enter your email"
        buttonText="Subscribe"
        backgroundColor="dark"
      />
    ),
  },
]

export default function ShowcasePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-12">
        <div className="container-wide">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Showcase
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Preview all 10 paragraph components available in this starter. Each component is fully customizable through the Drupal CMS.
          </p>
        </div>
      </div>

      {/* Component List */}
      {components.map((item, index) => (
        <div key={item.name} id={item.name.toLowerCase().replace(/\s+/g, '-')}>
          {/* Component Info */}
          <div className="bg-white border-b border-gray-200 py-6">
            <div className="container-wide flex items-center gap-4">
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                {index + 1}/{components.length}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </div>

          {/* Component Preview */}
          {item.component}
        </div>
      ))}

      {/* Footer CTA */}
      <div className="bg-gray-900 py-16 text-center">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Run the setup wizard to create your Drupal space and start customizing these components with your own content.
          </p>
          <code className="bg-gray-800 text-gray-200 px-6 py-3 rounded-lg text-lg inline-block">
            npm run setup
          </code>
        </div>
      </div>
    </div>
  )
}
