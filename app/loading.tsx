import {
  SkeletonHero,
  SkeletonStats,
  SkeletonCardGroup,
  SkeletonSidebyside,
  SkeletonTestimonials,
  SkeletonPricing,
  SkeletonAccordion,
  SkeletonNewsletter,
} from './components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <SkeletonHero />

      {/* Logo bar skeleton */}
      <div className="py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <SkeletonStats />

      {/* Features card group skeleton */}
      <SkeletonCardGroup columns={3} />

      {/* Side by side skeletons */}
      <SkeletonSidebyside imagePosition="right" />
      <SkeletonSidebyside imagePosition="left" className="bg-gray-50" />

      {/* Pricing skeleton */}
      <SkeletonPricing />

      {/* Testimonials skeleton */}
      <SkeletonTestimonials />

      {/* FAQ skeleton */}
      <SkeletonAccordion />

      {/* Newsletter skeleton */}
      <SkeletonNewsletter />
    </div>
  )
}
