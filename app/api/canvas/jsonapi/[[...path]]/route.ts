import { createDraftRouteHandlers } from '@drupal-canvas/headless-next'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Same-origin JSON:API proxy carrying the draft session's authorization.
export const { GET, HEAD, POST, PATCH, DELETE, OPTIONS } = createDraftRouteHandlers().jsonApiProxy
