export async function register() {
  // The Canvas SDK reads its Drupal origin from CANVAS_SITE_URL; decoupled.io
  // frontends are configured with NEXT_PUBLIC_DRUPAL_BASE_URL.
  process.env.CANVAS_SITE_URL ||= process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'development') {
    // Node does not trust system CAs by default; local DDEV HTTPS (mkcert) needs them.
    const { trustSystemCertificates } = await import('@drupal-canvas/headless/node')
    trustSystemCertificates()
  }
}
