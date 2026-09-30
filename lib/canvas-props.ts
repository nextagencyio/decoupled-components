/**
 * Adapters from Canvas prop shapes to the shapes the paragraph components
 * already use for GraphQL data, so both sources render the same markup.
 */
import type { Image } from './types'

/** A Canvas image prop (json-schema-definitions://canvas.module/image). */
export interface CanvasImage {
  src?: string
  alt?: string
  width?: number
  height?: number
}

export function toImage(image?: CanvasImage | null): Image | undefined {
  if (!image?.src) return undefined
  // Canvas appends an ?alternateWidths= srcset template to media image URLs.
  const url = image.src.replace(/[?&]alternateWidths=[^&]*/, '')
  return { url, alt: image.alt, width: image.width, height: image.height }
}

/** Splits a rich-text list (or newline separated text) into plain items. */
export function toLines(html?: string | null): string[] {
  if (!html) return []
  return html
    .split(/<\/li>|<\/p>|<br\s*\/?>|\n/i)
    .map((line) => line.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim())
    .filter(Boolean)
}
