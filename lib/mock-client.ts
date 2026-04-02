/**
 * Mock client implementing the same TypedClient interface as the real
 * Drupal client. Reads from local JSON files in data/mock/.
 *
 * Pages use the same code regardless of data source:
 *   const client = getClient()  // returns mock or real based on env
 */

import type { TypedClient, ContentTypeName, ContentTypeMap, ContentNode } from '@/schema/client'
import pagesData from '@/data/mock/pages.json'
import homepageData from '@/data/mock/homepage.json'

// Combine all mock pages into a single lookup
const allPages = [
  { ...homepageData, path: '/' },
  ...(pagesData.pages || []),
] as any[]

export function createMockClient(): TypedClient {
  return {
    async getEntries(type, options) {
      // Mock only supports landing pages for now
      if (type === 'NodeLandingPage') {
        const limit = options?.first ?? 10
        return allPages.slice(0, limit) as any
      }
      return []
    },

    async getEntry(type, id) {
      if (type === 'NodeLandingPage') {
        return allPages.find((p: any) => p.id === id) ?? null
      }
      return null
    },

    async getEntryByPath(path) {
      return allPages.find((p: any) => p.path === path) ?? null
    },

    async raw() {
      throw new Error('raw() is not available in demo mode')
    },
  }
}
