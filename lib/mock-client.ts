/**
 * Mock client implementing TypedClient for demo mode.
 * Reads from local JSON files — same interface as the live Drupal client.
 */

import type { TypedClient, ContentTypeName, ContentTypeMap, ContentNode, NodeLandingPage } from '@/schema/client'
import pagesData from '@/data/mock/pages.json'
import homepageData from '@/data/mock/homepage.json'

const allPages: NodeLandingPage[] = [
  { ...homepageData, path: '/', __typename: 'NodeLandingPage', created: { timestamp: 0 }, changed: { timestamp: 0 } } as NodeLandingPage,
  ...(pagesData.pages || []).map(p => ({
    ...p,
    __typename: 'NodeLandingPage' as const,
    created: { timestamp: 0 },
    changed: { timestamp: 0 },
  })) as NodeLandingPage[],
]

export function createMockClient(): TypedClient {
  return {
    async getEntries<K extends ContentTypeName>(type: K, options?: { first?: number }): Promise<ContentTypeMap[K][]> {
      if (type === 'NodeLandingPage') {
        const limit = options?.first ?? 10
        return allPages.slice(0, limit) as ContentTypeMap[K][]
      }
      return []
    },

    async getEntry<K extends ContentTypeName>(type: K, id: string): Promise<ContentTypeMap[K] | null> {
      if (type === 'NodeLandingPage') {
        return (allPages.find(p => p.id === id) ?? null) as ContentTypeMap[K] | null
      }
      return null
    },

    async getEntryByPath(path: string): Promise<ContentNode | null> {
      return allPages.find(p => p.path === path) ?? null
    },

    async raw(): Promise<never> {
      throw new Error('raw() is not available in demo mode')
    },
  }
}
