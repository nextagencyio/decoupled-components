/**
 * Unified Drupal client — same TypedClient interface for demo and live mode.
 *
 * Demo mode: reads from data/mock/ JSON files
 * Live mode: queries Drupal GraphQL with OAuth via decoupled-client
 */

import { createClient } from 'decoupled-client'
import type { TypedClient } from '@/schema/client'
import { isDemoMode } from './demo-mode'
import { createMockClient } from './mock-client'
import { GET_LANDING_PAGE } from './queries'

let _liveClient: TypedClient | null = null

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

  _liveClient = {
    async getEntries(type, options) {
      if (type === 'NodeLandingPage') {
        const data = await base.query(`
          query { nodeLandingPages(first: ${options?.first ?? 10}) { nodes { id title path } } }
        `)
        return (data as any).nodeLandingPages?.nodes ?? []
      }
      return []
    },

    async getEntry(type, id) {
      const data = await base.query(`
        query { node(id: "${id}") { __typename ... on NodeLandingPage { id title path } } }
      `)
      return (data as any).node ?? null
    },

    async getEntryByPath(path) {
      return base.queryByPath(path, GET_LANDING_PAGE)
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
