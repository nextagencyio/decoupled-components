export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getApolloClient } from '@/lib/apollo-client'
import { GET_LANDING_PAGE } from '@/lib/queries'
import type { LandingPage } from '@/lib/types'
import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import { isDemoMode, getMockPageByPath } from '@/lib/demo-mode'
import { transformSections } from '@/lib/drupal-utils'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

const isDrupalConfigured = () => !!process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

async function getPage(path: string): Promise<LandingPage | null> {
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
      sections: transformSections(entity.sections || []),
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const path = `/${slug.join('/')}`
  const page = await getPage(path)

  if (!page) {
    notFound()
  }

  return <ParagraphList sections={page.sections} />
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const path = `/${slug.join('/')}`
  const page = await getPage(path)

  return {
    title: page ? `${page.title} | LaunchPad` : 'Page Not Found',
  }
}
