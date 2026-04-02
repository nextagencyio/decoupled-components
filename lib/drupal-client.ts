/**
 * Unified Drupal client — returns a TypedClient for both demo and live mode.
 *
 * Demo mode: reads from data/mock/ JSON files
 * Live mode: queries Drupal GraphQL with OAuth via decoupled-client
 */

import { createClient } from 'decoupled-client'
import { createTypedClient } from '@/schema/client'
import type { TypedClient } from '@/schema/client'
import { isDemoMode } from './demo-mode'
import { createMockClient } from './mock-client'

let _liveClient: TypedClient | null = null

function getLiveClient(): TypedClient {
  if (_liveClient) return _liveClient

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  const clientId = process.env.DRUPAL_CLIENT_ID
  const clientSecret = process.env.DRUPAL_CLIENT_SECRET

  if (!baseUrl || !clientId || !clientSecret) {
    throw new Error('Missing Drupal credentials. Set NEXT_PUBLIC_DRUPAL_BASE_URL, DRUPAL_CLIENT_ID, and DRUPAL_CLIENT_SECRET.')
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

  _liveClient = createTypedClient(base)
  return _liveClient
}

/**
 * Get the appropriate client based on the current mode.
 * Same interface regardless of data source.
 */
export function getClient(): TypedClient {
  if (isDemoMode()) {
    return createMockClient()
  }
  return getLiveClient()
}
