import { getApolloClient } from '@/lib/apollo-client'
import { GET_LANDING_PAGE } from '@/lib/queries'
import type { LandingPage, ParagraphType } from '@/lib/types'
import { ParagraphList } from './components/paragraphs/ParagraphRenderer'
import SetupGuide from './components/SetupGuide'
import DemoHomepage from './components/DemoHomepage'
import { isDemoMode } from '@/lib/demo-mode'

// Helper to extract .value from Text type fields
function extractTextValue(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(extractTextValue)

  // Check if this is a Text type object (has value property and is simple)
  const record = obj as Record<string, unknown>
  if ('value' in record && typeof record.value === 'string' && Object.keys(record).length <= 3) {
    // Text type has: value, processed, format
    return record.value
  }

  // Recursively process nested objects
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(record)) {
    result[key] = extractTextValue(value)
  }
  return result
}

function transformSections(sections: unknown[]): ParagraphType[] {
  return sections.map(section => extractTextValue(section)) as ParagraphType[]
}

async function getHomepage(): Promise<LandingPage | null> {
  const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  if (!drupalUrl) {
    return null
  }

  const client = getApolloClient()

  // Try "/" first, then fallback to "/node/1" (Drupal default path)
  const pathsToTry = ['/', '/node/1']

  for (const path of pathsToTry) {
    try {
      const { data } = await client.query({
        query: GET_LANDING_PAGE,
        variables: { path },
        fetchPolicy: 'network-only',
      })

      const entity = data?.route?.entity
      if (entity) {
        // Transform nested Text type fields to plain strings
        return {
          ...entity,
          sections: transformSections(entity.sections || [])
        }
      }
    } catch (error) {
      console.error(`Error fetching homepage at ${path}:`, error)
    }
  }

  return null
}

export default async function HomePage() {
  const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  // Demo mode: show demo page with sample data
  if (isDemoMode()) {
    return <DemoHomepage />
  }

  // Show setup guide if Drupal is not configured
  if (!drupalUrl) {
    return <SetupGuide />
  }

  const page = await getHomepage()

  if (!page) {
    return <SetupGuide />
  }

  return (
    <>
      <ParagraphList sections={page.sections} />
    </>
  )
}
