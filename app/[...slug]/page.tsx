import { notFound } from 'next/navigation'
import { getApolloClient } from '@/lib/apollo-client'
import { GET_LANDING_PAGE, GET_ALL_LANDING_PAGES } from '@/lib/queries'
import type { LandingPage, ParagraphType } from '@/lib/types'
import { ParagraphList } from '../components/paragraphs/ParagraphRenderer'
import { isDemoMode, getMockPageByPath, getMockPages } from '@/lib/demo-mode'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

const isDrupalConfigured = () => !!process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

// Helper to extract .value from Text type fields
function extractTextValue(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(extractTextValue)

  const record = obj as Record<string, unknown>
  if ('value' in record && typeof record.value === 'string' && Object.keys(record).length <= 3) {
    return record.value
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(record)) {
    result[key] = extractTextValue(value)
  }
  return result
}

function transformSections(sections: unknown[]): ParagraphType[] {
  return sections.map(section => extractTextValue(section)) as ParagraphType[]
}

async function getPage(path: string): Promise<LandingPage | null> {
  // Demo mode: return mock page
  if (isDemoMode()) {
    return getMockPageByPath(path)
  }

  if (!isDrupalConfigured()) {
    return null
  }

  try {
    const client = getApolloClient()
    const { data } = await client.query({
      query: GET_LANDING_PAGE,
      variables: { path },
      fetchPolicy: 'network-only',
    })

    const entity = data?.route?.entity
    if (!entity) return null

    return {
      ...entity,
      sections: transformSections(entity.sections || [])
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export async function generateStaticParams() {
  // Demo mode: return mock page paths
  if (isDemoMode()) {
    return getMockPages()
      .filter(page => page.path !== '/')
      .map(page => ({
        slug: page.path.split('/').filter(Boolean),
      }))
  }

  if (!isDrupalConfigured()) {
    return []
  }

  try {
    const client = getApolloClient()
    const { data } = await client.query({
      query: GET_ALL_LANDING_PAGES,
      fetchPolicy: 'network-only',
    })

    const pages = data?.nodeLandingPages?.nodes || []

    return pages
      .filter((page: any) => page?.path && page.path !== '/')
      .map((page: any) => ({
        slug: page.path.split('/').filter(Boolean),
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const path = `/${slug.join('/')}`

  const page = await getPage(path)

  if (!page) {
    notFound()
  }

  return (
    <>
      <ParagraphList sections={page.sections} />
    </>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const path = `/${slug.join('/')}`

  const page = await getPage(path)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: `${page.title} | LaunchPad`,
    description: `${page.title} - Built with Decoupled.io`,
  }
}
