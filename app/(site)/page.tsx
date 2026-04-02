import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import SetupGuide from '@/app/components/SetupGuide'
import { isDemoMode } from '@/lib/demo-mode'
import { getClient } from '@/lib/drupal-client'
import { transformSections } from '@/lib/drupal-utils'

export default async function HomePage() {
  // In demo mode without Drupal, still works via mock client
  if (!isDemoMode() && !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) {
    return <SetupGuide />
  }

  const client = getClient()

  // Try common homepage paths
  for (const path of ['/', '/node/1']) {
    try {
      const page = await client.getEntryByPath(path)
      if (page && 'sections' in page) {
        const sections = transformSections((page as any).sections || [])
        return <ParagraphList sections={sections} />
      }
    } catch (error) {
      console.error(`Error fetching homepage at ${path}:`, error)
    }
  }

  return <SetupGuide />
}
