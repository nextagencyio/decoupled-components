/**
 * Drupal Canvas page loading.
 *
 * Canvas pages are resolved by Drupal routing through the Canvas content
 * API and are draft-aware: inside the Canvas editor iframe (or after
 * /api/draft) the editor's unsaved changes are returned. Paths Drupal
 * resolves but Canvas does not manage (e.g. paragraph-based landing pages)
 * return null here so callers can fall back to the GraphQL client.
 */
import { cache } from 'react'
import { fetchPage, isPageRedirect } from '@drupal-canvas/headless-next'
import { isDemoMode } from './demo-mode'

export const loadCanvasPage = cache(async (path: string) => {
  if (isDemoMode() || !process.env.CANVAS_SITE_URL) return null
  try {
    const result = await fetchPage(path)
    if (!result) return null
    if (isPageRedirect(result)) return result
    return result.content ? result : null
  } catch (error) {
    console.error(`Canvas: failed to load ${path}:`, error)
    return null
  }
})

export { isPageRedirect }
