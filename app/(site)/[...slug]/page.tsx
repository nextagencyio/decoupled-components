export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import { getClient } from '@/lib/drupal-client'
import { transformSections } from '@/lib/drupal-utils'
import type { NodeLandingPage } from '@/schema/client'

interface PageProps {
  params: Promise<{ slug: string[] }>
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
