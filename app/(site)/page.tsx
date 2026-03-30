import { getApolloClient } from '@/lib/apollo-client'
import { GET_LANDING_PAGE } from '@/lib/queries'
import type { LandingPage } from '@/lib/types'
import { ParagraphList } from '@/app/components/paragraphs/ParagraphRenderer'
import SetupGuide from '@/app/components/SetupGuide'
import DemoHomepage from '@/app/components/DemoHomepage'
import { isDemoMode } from '@/lib/demo-mode'
import { transformSections } from '@/lib/drupal-utils'

async function getHomepage(): Promise<LandingPage | null> {
  const drupalUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  if (!drupalUrl) return null

  const client = getApolloClient()
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
        return {
          ...entity,
          sections: transformSections(entity.sections || []),
        }
      }
    } catch (error) {
      console.error(`Error fetching homepage at ${path}:`, error)
    }
  }

  return null
}

export default async function HomePage() {
  if (isDemoMode()) {
    return <DemoHomepage />
  }

  if (!process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) {
    return <SetupGuide />
  }

  const page = await getHomepage()

  if (!page) {
    return <SetupGuide />
  }

  return <ParagraphList sections={page.sections} />
}
