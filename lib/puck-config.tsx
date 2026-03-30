'use client'

import type { Config } from '@puckeditor/core'
import { componentRegistry } from './component-registry'
import { ImageField } from '@/app/components/puck/ImageField'
import contentJson from '@/data/components-content.json'

/**
 * Auto-generates Puck editor config from components-content.json.
 *
 * The JSON model defines paragraph types with field schemas and puck config.
 * This function transforms them into Puck component definitions with:
 * - Field types mapped from dc_import format to Puck format
 * - Nested paragraph references → Puck array fields
 * - React render functions from the component registry
 * - Default props from sample content in the JSON
 */

// Category titles for the sidebar.
const CATEGORY_TITLES: Record<string, string> = {
  hero: 'Hero',
  content: 'Content',
  social: 'Social Proof',
  conversion: 'Conversion',
}

// __typename mapping: bundle → GraphQL typename (used by paragraph components).
const TYPENAME_MAP: Record<string, string> = {
  hero: 'ParagraphHero',
  card_group: 'ParagraphCardGroup',
  sidebyside: 'ParagraphSidebyside',
  accordion: 'ParagraphAccordion',
  quote: 'ParagraphQuote',
  pricing: 'ParagraphPricing',
  logo_collection: 'ParagraphLogoCollection',
  stats: 'ParagraphStat',
  newsletter: 'ParagraphNewsletter',
  text_block: 'ParagraphTextBlock',
}

interface ModelField {
  id: string
  type: string
  label: string
}

interface ParagraphModel {
  entity?: string
  bundle: string
  label: string
  puck?: { name?: string; category: string; render: string }
  fields: ModelField[]
}

/**
 * Convert a snake_case field id to camelCase prop name.
 */
function toCamelCase(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

/**
 * Parse a dc_import field type string into a Puck field definition.
 */
function parseFieldType(fieldType: string, label: string, allModels: ParagraphModel[]): any {
  // select(opt1|opt2|opt3)
  const selectMatch = fieldType.match(/^select\(([^)]+)\)$/)
  if (selectMatch) {
    const options = selectMatch[1].split('|').map(opt => ({
      label: opt ? opt.charAt(0).toUpperCase() + opt.slice(1).replace(/-/g, ' ') : 'Default',
      value: opt,
    }))
    return { type: 'select', label, options }
  }

  // paragraph(type)[] — nested paragraph reference
  const paragraphMatch = fieldType.match(/^paragraph\(([^)]+)\)\[\]$/)
  if (paragraphMatch) {
    const childBundle = paragraphMatch[1]
    const childModel = allModels.find(m => m.bundle === childBundle)
    if (childModel) {
      const arrayFields: Record<string, any> = {}
      for (const field of childModel.fields) {
        const propName = toCamelCase(field.id)
        arrayFields[propName] = parseFieldType(field.type.replace('!', ''), field.label, allModels)
      }
      return { type: 'array', label, arrayFields, getItemSummary: undefined }
    }
    return { type: 'textarea', label }
  }

  // image
  if (fieldType === 'image') {
    return {
      type: 'custom',
      label,
      render: ({ value, onChange }: any) => (
        <ImageField value={value || ''} onChange={onChange} label={label} />
      ),
      ai: {
        schema: { type: 'string', description: 'Image URL (https://...)' },
      },
    }
  }

  // text / text! — long text
  if (fieldType.startsWith('text')) {
    return { type: 'textarea', label }
  }

  // bool
  if (fieldType === 'bool') {
    return {
      type: 'radio',
      label,
      options: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }],
    }
  }

  // string[] — multi-value string (features list)
  if (fieldType === 'string[]') {
    return { type: 'textarea', label: label + ' (one per line)' }
  }

  // string / string! — default to text input
  return { type: 'text', label }
}

/**
 * Find the first content item matching a paragraph bundle to use as default props.
 */
function findDefaultContent(bundle: string): Record<string, any> | null {
  // Find a top-level section content item that uses this bundle.
  const item = contentJson.content.find(c => c.type === `paragraph.${bundle}`)
  return item?.values ?? null
}

/**
 * Build default props for a child array field from sample content.
 */
function buildChildDefaults(childBundle: string, childModel: ParagraphModel): any[] {
  const items = contentJson.content.filter(c => c.type === `paragraph.${childBundle}`)
  if (items.length === 0) {
    // Generate one default item from the child model fields.
    const item: Record<string, any> = {}
    for (const field of childModel.fields) {
      item[toCamelCase(field.id)] = ''
    }
    return [item]
  }
  return items.slice(0, 3).map(item => {
    const props: Record<string, any> = {}
    for (const field of childModel.fields) {
      const val = (item.values as any)?.[field.id]
      if (val !== undefined) {
        props[toCamelCase(field.id)] = typeof val === 'object' && val?.url ? val.url : val
      } else {
        props[toCamelCase(field.id)] = ''
      }
    }
    return props
  })
}

function generateConfig(): Config {
  const models = contentJson.model as ParagraphModel[]
  const topLevelModels = models.filter(m => m.puck)
  const categories: Record<string, { title: string; components: string[] }> = {}
  const components: Record<string, any> = {}

  for (const model of topLevelModels) {
    const puck = model.puck!
    // Use explicit name from JSON, or derive from render name.
    const puckName = puck.name || puck.render.replace(/^Paragraph/, '')
    const Component = componentRegistry[puck.render]

    if (!Component) {
      console.warn(`No component registered for ${puck.render}`)
      continue
    }

    // Build category.
    if (!categories[puck.category]) {
      categories[puck.category] = {
        title: CATEGORY_TITLES[puck.category] || puck.category,
        components: [],
      }
    }
    categories[puck.category].components.push(puckName)

    // Build fields.
    const fields: Record<string, any> = {}
    const defaultProps: Record<string, any> = {}
    const sampleContent = findDefaultContent(model.bundle) || {}

    for (const field of model.fields) {
      const propName = toCamelCase(field.id)
      const cleanType = field.type.replace('!', '')
      fields[propName] = parseFieldType(cleanType, field.label, models)

      // Default prop from sample content.
      const sampleVal = sampleContent[field.id]
      if (sampleVal !== undefined) {
        if (typeof sampleVal === 'object' && sampleVal !== null && 'url' in sampleVal) {
          defaultProps[propName] = sampleVal.url
        } else if (Array.isArray(sampleVal) && sampleVal.length > 0 && typeof sampleVal[0] === 'string' && sampleVal[0].startsWith('@')) {
          // Paragraph reference array — build from child content.
          const childMatch = cleanType.match(/^paragraph\(([^)]+)\)\[\]$/)
          if (childMatch) {
            const childModel = models.find(m => m.bundle === childMatch[1])
            if (childModel) {
              defaultProps[propName] = buildChildDefaults(childMatch[1], childModel)
            }
          }
        } else {
          defaultProps[propName] = sampleVal
        }
      } else {
        defaultProps[propName] = ''
      }
    }

    // Build render function.
    const typename = TYPENAME_MAP[model.bundle] || `Paragraph${puckName}`

    components[puckName] = {
      label: model.label,
      fields,
      defaultProps,
      render: ({ puck: _puck, ...props }: any) => {
        // Map nested arrays: add id to each item for React keys.
        const mappedProps: Record<string, any> = { __typename: typename, id: props.id || 'preview' }

        for (const field of model.fields) {
          const propName = toCamelCase(field.id)
          const val = props[propName]

          const cleanType = field.type.replace('!', '')
          const paragraphMatch = cleanType.match(/^paragraph\(([^)]+)\)\[\]$/)

          if (paragraphMatch && Array.isArray(val)) {
            mappedProps[propName] = val.map((item: any, i: number) => ({
              id: String(i),
              ...Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v ?? ''])),
              ...(item.authorImageUrl ? { authorImage: { url: item.authorImageUrl, alt: item.authorName || '' } } : {}),
            }))
          } else if (paragraphMatch) {
            mappedProps[propName] = []
          } else if (cleanType === 'image' && typeof val === 'string' && val) {
            mappedProps[propName] = { url: val, alt: '' }
          } else if (cleanType === 'image') {
            mappedProps[propName] = undefined
          } else if (cleanType === 'bool') {
            mappedProps[propName] = val === 'true' || val === true
          } else if (cleanType === 'string[]' && typeof val === 'string') {
            mappedProps[propName] = val.split('\n').filter(Boolean)
          } else {
            // For string/text/select fields: always pass a string, never undefined.
            mappedProps[propName] = (val != null && val !== '') ? val : undefined
          }
        }

        return <Component {...mappedProps} />
      },
    }
  }

  return { categories, components }
}

export const puckConfig: Config = generateConfig()
