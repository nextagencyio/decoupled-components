import { createDraftRouteHandlers } from '@drupal-canvas/headless-next'

// Enables draft mode from a signed Drupal preview assertion (?assertion=<jwt>).
export const GET = createDraftRouteHandlers().draft.GET
