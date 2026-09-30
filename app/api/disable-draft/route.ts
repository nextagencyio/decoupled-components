import { createDraftRouteHandlers } from '@drupal-canvas/headless-next'

// POST, not GET: exiting draft mode changes state, and a prefetched GET link
// could silently end the session.
export const POST = createDraftRouteHandlers().disableDraft.POST
