import type { NextConfig } from 'next'
import { withCanvas } from '@drupal-canvas/headless-next/config'

// The Canvas SDK reads its Drupal origin from CANVAS_SITE_URL; decoupled.io
// frontends are configured with NEXT_PUBLIC_DRUPAL_BASE_URL.
process.env.CANVAS_SITE_URL ||= process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['decoupled-client'],
  turbopack: {
    root: process.cwd(),
  },
}

// Drupal Canvas headless: generates the component manifest from ./canvas at
// build time and keeps the component registry current in development.
export default withCanvas(nextConfig)
