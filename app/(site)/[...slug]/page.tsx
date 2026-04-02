export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import { isDemoMode } from '@/lib/demo-mode'
import { getClient } from '@/lib/drupal-client'
import { transformSections } from '@/lib/drupal-utils'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const path = `/${slug.join('/')}`

  if (!isDemoMode() && !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) {
    notFound()
  }

  const client = getClient()

  try {
    const page = await client.getEntryByPath(path)
    if (!page || !('sections' in page)) notFound()

    const sections = transformSections((page as any).sections || [])
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
    return { title: page ? `${page.title}` : 'Page Not Found' }
  } catch {
    return { title: 'Page Not Found' }
  }
}
