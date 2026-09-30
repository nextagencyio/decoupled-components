export const dynamic = 'force-dynamic'

import CanvasComponentTree from '@drupal-canvas/headless-next/CanvasComponentTree'
import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import SetupGuide from '@/app/components/SetupGuide'
import { getClient } from '@/lib/drupal-client'
import { transformSections } from '@/lib/drupal-utils'
import { loadCanvasPage, isPageRedirect } from '@/lib/canvas'
import type { NodeLandingPage } from '@/schema/client'

export default async function HomePage() {
  if (!process.env.NEXT_PUBLIC_DRUPAL_BASE_URL && process.env.NEXT_PUBLIC_DEMO_MODE === 'false') {
    return <SetupGuide />
  }

  // Canvas homepage: the Drupal front page, or a Canvas page aliased /home
  // (the Drupal front page on decoupled.io tenants is the admin landing).
  for (const path of ['/', '/home']) {
    const canvasPage = await loadCanvasPage(path)
    if (canvasPage && !isPageRedirect(canvasPage)) {
      return <CanvasComponentTree tree={canvasPage.content} context={canvasPage.context} />
    }
  }

  const client = getClient()

  for (const path of ['/', '/node/1']) {
    try {
      const page = await client.getEntryByPath(path) as NodeLandingPage | null
      if (page?.sections) {
        const sections = transformSections(page.sections)
        return <ParagraphList sections={sections} />
      }
    } catch (error) {
      console.error(`Error fetching homepage at ${path}:`, error)
    }
  }

  return <SetupGuide />
}
