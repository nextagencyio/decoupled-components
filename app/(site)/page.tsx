export const revalidate = 60

import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import SetupGuide from '@/app/components/SetupGuide'
import { getClient } from '@/lib/drupal-client'
import { transformSections } from '@/lib/drupal-utils'
import type { NodeLandingPage } from '@/schema/client'

export default async function HomePage() {
  if (!process.env.NEXT_PUBLIC_DRUPAL_BASE_URL && process.env.NEXT_PUBLIC_DEMO_MODE === 'false') {
    return <SetupGuide />
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
