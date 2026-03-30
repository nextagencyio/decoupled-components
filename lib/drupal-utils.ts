import type { ParagraphType } from './types'

/**
 * Extract .value from Drupal Text type fields.
 * Text fields return { value: "...", format: "...", processed: "..." }.
 * This recursively unwraps them to plain strings.
 */
export function extractTextValue(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(extractTextValue)

  const record = obj as Record<string, unknown>
  if ('value' in record && typeof record.value === 'string' && Object.keys(record).length <= 3) {
    return record.value
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(record)) {
    result[key] = extractTextValue(value)
  }
  return result
}

export function transformSections(sections: unknown[]): ParagraphType[] {
  return sections.map(section => extractTextValue(section)) as ParagraphType[]
}
