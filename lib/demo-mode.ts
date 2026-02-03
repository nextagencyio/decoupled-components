/**
 * Demo Mode Module
 *
 * This file contains ALL demo/mock mode functionality.
 * To remove demo mode from a real project:
 * 1. Delete this file (lib/demo-mode.ts)
 * 2. Delete the data/mock/ directory
 * 3. Delete app/components/DemoHomepage.tsx
 * 4. Delete app/components/DemoModeBanner.tsx
 * 5. Remove DemoModeBanner from app/layout.tsx
 * 6. Remove demo mode check from app/page.tsx
 */

import pagesData from '@/data/mock/pages.json'
import type { LandingPage } from './types'

/**
 * Check if demo mode is enabled via environment variable
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

/**
 * Get all mock pages for demo mode
 */
export function getMockPages(): LandingPage[] {
  return (pagesData?.pages || []) as LandingPage[]
}

/**
 * Get mock page by path
 */
export function getMockPageByPath(path: string): LandingPage | null {
  const pages = getMockPages()
  return pages.find(p => p.path === path) || null
}
