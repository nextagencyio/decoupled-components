// Revalidate every 10 seconds — pages are pre-built at build time
// and refreshed frequently so content changes appear quickly.
export const revalidate = 10

import { notFound } from 'next/navigation'
import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import { getClient } from '@/lib/drupal-client'
import { isDemoMode } from '@/lib/demo-mode'
import { transformSections } from '@/lib/drupal-utils'
import type { NodeLandingPage } from '@/schema/client'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// Pre-build known pages at build time (SSG + ISR)
export async function generateStaticParams() {
  if (isDemoMode()) {
    return [
      { slug: ['about'] },
    ]
  }

  try {
    const client = getClient()
    const pages = await client.getEntries('NodeLandingPage', { first: 20 })
    return pages
      .filter((p: any) => p.path && p.path !== '/')
      .map((p: any) => ({
        slug: p.path.replace(/^\//, '').split('/'),
      }))
  } catch {
    return []
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const path = `/${slug.join('/')}`

  const client = getClient()

  try {
    const page = await client.getEntryByPath(path) as NodeLandingPage | null
    if (!page?.sections) notFound()

    const sections = transformSections(page.sections)
    return <ParagraphList sections={sections} />
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const path = `/${slug.join('/')}`

  try {
    const client = getClient()
    const page = await client.getEntryByPath(path)
    return { title: page?.title || 'Page Not Found' }
  } catch {
    return { title: 'Page Not Found' }
  }
}
