/**
 * Unified Drupal client — same TypedClient interface for demo and live mode.
 *
 * Demo mode: reads from data/mock/ JSON files
 * Live mode: queries Drupal GraphQL with OAuth via decoupled-client
 *
 * Uses the generated typed client for getEntries/getEntry (auto-generated
 * queries from schema introspection), but overrides getEntryByPath with
 * the hand-crafted landing page query (the generated ROUTE_QUERY is too
 * large for deeply nested paragraph unions).
 */

import { createClient } from 'decoupled-client'
import { createTypedClient } from '@/schema/client'
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

  // Use the generated typed client for getEntries/getEntry
  const typed = createTypedClient(base)

  // Override getEntryByPath to use the hand-crafted landing page query
  // (the generated ROUTE_QUERY is too large for nested paragraph unions)
  _liveClient = {
    ...typed,
    async getEntryByPath(path) {
      return base.queryByPath(path, GET_LANDING_PAGE)
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
