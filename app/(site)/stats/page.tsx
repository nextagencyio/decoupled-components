export const dynamic = 'force-dynamic'

import { getClient } from '@/lib/drupal-client'
import type {
  NodeLandingPage,
  ParagraphHero,
  ParagraphStat,
  ParagraphStatItem,
  ParagraphCardGroup,
  ParagraphCard,
} from '@/schema/client'

// Type guard — narrows a ParagraphUnion to a specific type
function isParagraph<T extends { __typename: string }>(
  section: { __typename?: string },
  typename: T['__typename'],
): section is T {
  return section?.__typename === typename
}

export default async function StatsPage() {
  const client = getClient()
  const page = await client.getEntryByPath('/node/1') as NodeLandingPage | null

  if (!page?.sections) {
    return <p className="p-8 text-gray-500">No content found.</p>
  }

  // Extract specific sections by type — fully typed, IDE autocomplete works
  const hero = page.sections.find((s): s is ParagraphHero =>
    isParagraph(s, 'ParagraphHero')
  )

  const stats = page.sections.find((s): s is ParagraphStat =>
    isParagraph(s, 'ParagraphStat')
  )

  const features = page.sections.find((s): s is ParagraphCardGroup =>
    isParagraph(s, 'ParagraphCardGroup')
  )

  return (
    <div className="container-wide py-16 space-y-16">
      {/* Hero data — every field is typed */}
      {hero && (
        <div className="text-center max-w-3xl mx-auto">
          {hero.eyebrow && (
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
              {hero.eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="mt-4 text-lg text-gray-600">{hero.subtitle.value}</p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            Layout: {hero.layout} · Background: {hero.backgroundColor}
          </p>
        </div>
      )}

      {/* Stats — typed all the way down to StatItem fields */}
      {stats?.stats && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {stats.title || 'Key Metrics'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(stats.stats as ParagraphStatItem[]).map((stat) => (
              <div key={stat.id} className="bg-white rounded-xl border p-6 text-center">
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">{stat.label}</div>
                {stat.description && (
                  <div className="text-xs text-gray-500 mt-1">{stat.description.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature cards — typed cards array */}
      {features?.cards && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {features.title}
          </h2>
          {features.subtitle && (
            <p className="text-gray-600 mb-6">{features.subtitle.value}</p>
          )}
          <div className="grid md:grid-cols-3 gap-6">
            {(features.cards as ParagraphCard[]).map((card) => (
              <div key={card.id} className="bg-white rounded-xl border p-6">
                {card.icon && (
                  <div className="text-2xl mb-3">{card.icon}</div>
                )}
                <h3 className="font-bold text-gray-900">{card.title}</h3>
                {card.description && typeof card.description === 'object' && (
                  <p className="text-sm text-gray-600 mt-2">{card.description.value}</p>
                )}
                {card.linkText && card.linkUrl && (
                  <a href={card.linkUrl} className="text-sm text-primary-600 font-semibold mt-3 inline-block">
                    {card.linkText} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw data dump to show what the typed client returns */}
      <details className="bg-gray-50 rounded-xl border p-6">
        <summary className="font-semibold cursor-pointer">Raw typed data (click to expand)</summary>
        <pre className="mt-4 text-xs overflow-auto max-h-96">
          {JSON.stringify({
            title: page.title,
            path: page.path,
            sectionTypes: page.sections.map(s => s.__typename),
            heroFields: hero ? Object.keys(hero) : [],
            statsFields: stats ? Object.keys(stats) : [],
          }, null, 2)}
        </pre>
      </details>
    </div>
  )
}
