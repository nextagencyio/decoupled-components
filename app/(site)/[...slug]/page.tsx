export const dynamic = 'force-dynamic'

import CanvasComponentTree from '@drupal-canvas/headless-next/CanvasComponentTree'
import { toNextMetadata } from '@drupal-canvas/headless-next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import { getClient } from '@/lib/drupal-client'
import { transformSections } from '@/lib/drupal-utils'
import { loadCanvasPage, isPageRedirect } from '@/lib/canvas'
import type { NodeLandingPage } from '@/schema/client'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

async function getPath(params: PageProps['params']) {
  const { slug } = await params
  return `/${slug.map(encodeURIComponent).join('/')}`
}

export default async function DynamicPage({ params }: PageProps) {
  const path = await getPath(params)

  // 1. Drupal Canvas pages (draft-aware inside the Canvas editor).
  const canvasPage = await loadCanvasPage(path)
  if (canvasPage) {
    if (isPageRedirect(canvasPage)) {
      const { statusCode, url } = canvasPage.redirect
      if (statusCode === 301 || statusCode === 308) permanentRedirect(url)
      redirect(url)
    }
    return <CanvasComponentTree tree={canvasPage.content} context={canvasPage.context} />
  }

  // 2. Paragraph-based landing pages over GraphQL.
  let page: NodeLandingPage | null = null
  try {
    page = await getClient().getEntryByPath(path) as NodeLandingPage | null
  } catch {
    // Page not found
  }
  if (!page?.sections) notFound()

  return <ParagraphList sections={transformSections(page.sections)} />
}

export async function generateMetadata({ params }: PageProps) {
  const path = await getPath(params)

  const canvasPage = await loadCanvasPage(path)
  if (canvasPage && !isPageRedirect(canvasPage)) {
    return toNextMetadata(canvasPage.head)
  }

  try {
    const page = await getClient().getEntryByPath(path)
    return { title: page?.title || 'Page Not Found' }
  } catch {
    return { title: 'Page Not Found' }
  }
}
