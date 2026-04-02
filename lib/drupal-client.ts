/**
 * Unified Drupal client — returns a TypedClient-compatible interface
 * for both demo mode and live mode.
 *
 * Uses the hand-crafted queries from lib/queries.ts (not the generated
 * ROUTE_QUERY which is too large for deeply nested paragraph unions).
 */

import { createClient, type DecoupledClient } from 'decoupled-client'
import type { TypedClient } from '@/schema/client'
import { isDemoMode } from './demo-mode'
import { createMockClient } from './mock-client'
import { GET_LANDING_PAGE } from './queries'

let _liveClient: TypedClient | null = null

// Extract the query string from the gql tagged template
function extractQuery(gqlResult: any): string {
  if (typeof gqlResult === 'string') return gqlResult
  // Apollo's gql returns a DocumentNode — extract the query string from loc.source.body
  return gqlResult?.loc?.source?.body || ''
}

function getLiveClient(): TypedClient {
  if (_liveClient) return _liveClient

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  const clientId = process.env.DRUPAL_CLIENT_ID
  const clientSecret = process.env.DRUPAL_CLIENT_SECRET

  if (!baseUrl || !clientId || !clientSecret) {
    throw new Error('Missing Drupal credentials.')
  }

  const base = createClient({
    baseUrl,
    clientId,
    clientSecret,
    fetch: ((url: any, options?: any) =>
      globalThis.fetch(url, {
        ...options,
        next: { tags: ['drupal'] },
      } as RequestInit)) as typeof globalThis.fetch,
  })

  const landingPageQuery = extractQuery(GET_LANDING_PAGE)

  _liveClient = {
    async getEntries(type, options) {
      // For now, only landing pages are supported via the hand-crafted queries
      if (type === 'NodeLandingPage') {
        const data = await base.query(`
          query { nodeLandingPages(first: ${options?.first ?? 10}) { nodes { id title path } } }
        `)
        return (data as any).nodeLandingPages?.nodes ?? []
      }
      return []
    },

    async getEntry(type, id) {
      const data = await base.query(`query { node(id: "${id}") { __typename ... on NodeLandingPage { id title path } } }`)
      return (data as any).node ?? null
    },

    async getEntryByPath(path) {
      return base.queryByPath(path, landingPageQuery)
    },

    async raw(query, variables) {
      return base.query(query, variables)
    },
  }

  return _liveClient
}

export function getClient(): TypedClient {
  if (isDemoMode()) {
    return createMockClient()
  }
  return getLiveClient()
}
