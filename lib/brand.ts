/**
 * Brand config fetcher — pulls resolved brand tokens from Drupal's
 * /api/dc-brand/settings endpoint at build time and exposes them in the
 * shape our RootLayout + Tailwind config expect.
 *
 * Cached per build in prod (module-level promise). In dev we bypass that
 * cache so edits in Drupal appear on reload.
 */

const DEFAULT_BASE_URL = 'http://localhost'

export interface BrandColorScale {
  h: number
  s: number
  l: number
  css: string // "221 83% 53%"
}

export interface BrandColor {
  hex: string
  scale: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', BrandColorScale>
}

export interface BrandFont {
  family: string
  href: string | null
  weights: number[]
  category: 'sans' | 'serif' | 'mono' | 'display' | 'handwriting'
}

export interface BrandLogo {
  url: string
  alt: string
}

export interface BrandConfig {
  fonts: {
    heading: BrandFont
    body: BrandFont
  }
  colors: {
    primary: BrandColor
    secondary: BrandColor
    accent: BrandColor
    neutral: BrandColor
    background: BrandColor
  }
  logos: {
    light: BrandLogo | null
    dark: BrandLogo | null
  }
}

let _cache: Promise<BrandConfig> | null = null
// Only surface the "couldn't reach dc_brand" warning once per process.
let _warnedOnce = false

const FALLBACK: BrandConfig = {
  fonts: {
    heading: { family: 'Inter', href: null, weights: [400, 500, 600, 700], category: 'sans' },
    body:    { family: 'Inter', href: null, weights: [400, 500, 600, 700], category: 'sans' },
  },
  colors: {
    primary:    synthScale('#7c3aed'),
    secondary:  synthScale('#14b8a6'),
    accent:     synthScale('#4f46e5'),
    neutral:    synthScale('#6b7280'),
    background: synthScale('#ffffff'),
  },
  logos: { light: null, dark: null },
}

export async function getBrandConfig(): Promise<BrandConfig> {
  // In dev, bypass the module-level cache so edits in Drupal show up on
  // reload. In prod (next build / ISR), cache for the whole build.
  if (process.env.NODE_ENV === 'development') {
    return fetchBrand()
  }
  if (_cache) return _cache
  _cache = fetchBrand()
  return _cache
}

async function fetchBrand(): Promise<BrandConfig> {
  const baseUrl =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ??
    process.env.DRUPAL_BASE_URL ??
    DEFAULT_BASE_URL
  const url = `${baseUrl.replace(/\/$/, '')}/api/dc-brand/settings`
  try {
    // cache: 'no-store' in dev (we bypass above anyway); otherwise let
    // Next.js data cache handle it for the build lifetime.
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
    })
    if (!res.ok) {
      warnOnce(
        res.status === 404
          ? `[dc_brand] module not enabled on ${baseUrl} — rendering with default brand tokens`
          : `[dc_brand] ${url} returned ${res.status} — rendering with default brand tokens`
      )
      return FALLBACK
    }
    return (await res.json()) as BrandConfig
  } catch (err) {
    warnOnce(`[dc_brand] fetch failed (${(err as Error).message}) — rendering with default brand tokens`)
    return FALLBACK
  }
}

function warnOnce(msg: string): void {
  if (_warnedOnce) return
  console.warn(msg)
  _warnedOnce = true
}

export function brandCssVars(config: BrandConfig): string {
  const lines: string[] = [':root {']
  for (const [name, color] of Object.entries(config.colors)) {
    for (const [stop, value] of Object.entries(color.scale)) {
      lines.push(`  --brand-${name}-${stop}: ${value.css};`)
    }
    lines.push(`  --brand-${name}-hex: ${color.hex};`)
  }
  lines.push(`  --brand-font-heading: '${config.fonts.heading.family}';`)
  lines.push(`  --brand-font-body: '${config.fonts.body.family}';`)
  lines.push('}')
  return lines.join('\n')
}

export function brandFontHrefs(config: BrandConfig): string[] {
  const hrefs = new Set<string>()
  if (config.fonts.heading.href) hrefs.add(config.fonts.heading.href)
  if (config.fonts.body.href)    hrefs.add(config.fonts.body.href)
  return [...hrefs]
}

/**
 * Canonical Tailwind v3 scales (HSL). If the input hex matches any stop of
 * one of these palettes, synthScale returns the full scale for an exact
 * perceptual match with the Tailwind original (e.g. components.decoupled.io).
 */
type StopHsl = [number, number, number]
const KNOWN_SCALES: Record<string, Record<keyof BrandColor['scale'], StopHsl>> = {
  violet: {
    '50': [250, 100, 98.0], '100': [251, 91, 95.5], '200': [251, 95, 91.8],
    '300': [252, 94, 85.0], '400': [255, 92, 76.3], '500': [258, 90, 66.3],
    '600': [262, 83, 57.8], '700': [263, 70, 50.4], '800': [263, 69, 42.2],
    '900': [264, 68, 34.9],
  },
  teal: {
    '50': [166, 76, 96.7], '100': [167, 85, 89.2], '200': [168, 84, 78.2],
    '300': [171, 77, 64.1], '400': [172, 66, 50.4], '500': [173, 80, 40.0],
    '600': [175, 84, 32.2], '700': [175, 77, 26.1], '800': [176, 69, 21.8],
    '900': [176, 61, 18.8],
  },
  indigo: {
    '50': [226, 100, 96.7], '100': [226, 100, 93.9], '200': [228, 96, 88.8],
    '300': [230, 94, 82.2], '400': [234, 89, 73.9], '500': [239, 84, 66.7],
    '600': [243, 75, 58.6], '700': [245, 58, 50.8], '800': [244, 55, 41.4],
    '900': [242, 47, 34.3],
  },
  gray: {
    '50': [210, 40, 98.0], '100': [220, 14, 95.9], '200': [220, 13, 90.9],
    '300': [216, 12, 83.9], '400': [218, 11, 64.9], '500': [220, 9, 46.1],
    '600': [215, 14, 34.1], '700': [217, 19, 26.7], '800': [215, 28, 17.1],
    '900': [221, 39, 11.0],
  },
}
let _hexToPalette: Record<string, string> | null = null

function matchKnownPalette(hex: string): string | null {
  if (!_hexToPalette) {
    _hexToPalette = {}
    for (const [name, scale] of Object.entries(KNOWN_SCALES)) {
      for (const [, hsl] of Object.entries(scale)) {
        _hexToPalette[hslToHex(...hsl).toLowerCase()] = name
      }
    }
  }
  let n = hex.replace(/^#/, '').toLowerCase()
  if (n.length === 3) n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]
  return _hexToPalette[n] ?? null
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lN - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60)       [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else              [r, g, b] = [c, 0, x]
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return toHex(r) + toHex(g) + toHex(b)
}

function synthScale(hex: string): BrandColor {
  const palette = matchKnownPalette(hex)
  if (palette) {
    const scale = {} as BrandColor['scale']
    for (const [stop, hsl] of Object.entries(KNOWN_SCALES[palette]) as Array<[keyof BrandColor['scale'], StopHsl]>) {
      const [h, s, l] = hsl
      scale[stop] = { h, s, l, css: `${Math.round(h)} ${s.toFixed(1)}% ${l.toFixed(1)}%` }
    }
    return { hex, scale }
  }
  const [h, s, l] = hexToHsl(hex)
  const stops: Array<[keyof BrandColor['scale'], number]> = [
    ['50', 97], ['100', 93], ['200', 85], ['300', 74], ['400', 62],
    ['500', l],  ['600', 42], ['700', 33], ['800', 24], ['900', 15],
  ]
  const scale = {} as BrandColor['scale']
  for (const [stop, lightness] of stops) {
    scale[stop] = { h, s, l: lightness, css: `${Math.round(h)} ${s.toFixed(1)}% ${lightness.toFixed(1)}%` }
  }
  return { hex, scale }
}

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let hue = 0
  if (max === r)      hue = ((g - b) / d) + (g < b ? 6 : 0)
  else if (max === g) hue = ((b - r) / d) + 2
  else                hue = ((r - g) / d) + 4
  return [hue * 60, s * 100, l * 100]
}
