import { canvasMiddleware } from '@drupal-canvas/headless-next/middleware'

// Draft-session handling and the CSP frame-ancestors header that lets the
// Drupal Canvas editor embed this app as its live preview.
export default canvasMiddleware
