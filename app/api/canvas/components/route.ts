import { createComponentMetadataHandler } from '@drupal-canvas/headless-next'

// Segment config must be literal: discovery needs Node and the response is
// auth-gated per request.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// The component library (./canvas) Drupal Canvas syncs from, protected by a
// single-use Drupal preview assertion.
export const { GET, OPTIONS } = createComponentMetadataHandler()
