# Decoupled Components

Next.js frontend for Drupal with section-based landing pages, a visual editor (Puck), and AI-powered page generation. Uses `decoupled-client` for type-safe Drupal queries — no hand-written GraphQL needed.

## Quick Start

```bash
npm install
npm run setup                # Interactive: create space, write .env.local, import content
npm run sync-schema          # Introspect GraphQL → generate typed client + interfaces
npm run build && npm start   # Production mode (recommended for Puck)
```

Default port: 3000

## Typed Client

All data fetching uses `decoupled-client` with auto-generated types from the Drupal GraphQL schema.

### How it works

1. `npm run sync-schema` introspects Drupal and generates `schema/client.ts`
2. `schema/client.ts` contains TypeScript interfaces for every content type + a `createTypedClient()` factory with pre-built queries
3. `lib/drupal-client.ts` exports `getClient()` which returns a `TypedClient` — same interface for both demo mode (mock data) and live mode (Drupal GraphQL)

### Usage in pages

```typescript
import { getClient } from '@/lib/drupal-client'
import type { NodeLandingPage } from '@/schema/client'

const client = getClient()
const page = await client.getEntryByPath('/about') as NodeLandingPage | null
// page.title — string
// page.sections — ParagraphUnion[] (narrowable by __typename)
```

### Adding a new content type

1. Create the content type in Drupal (via admin UI or `import_content` MCP tool)
2. Run `npm run sync-schema`
3. Import the new type: `import type { NodeArticle } from '@/schema/client'`
4. Fetch it: `const articles = await client.getEntries('NodeArticle', { first: 10 })`

Full autocomplete on all fields. Build fails if you reference a field that doesn't exist.

### MCP content import format

When using the `import_content` MCP tool, always call `get_import_example` first to see the correct JSON structure. Key rules:

- **Content type prefix**: Use `node.bundle` (e.g., `"type": "node.article"`), not just `"article"`. Without the `node.` prefix, entities are silently created as paragraphs instead of nodes.
- **Values wrapper**: Fields go inside a `"values"` object, not at the top level.
- **Path aliases**: Set via `"path"` at the top level (not inside values).
- **References**: Use `@id` syntax to reference other content items defined earlier in the array.
- **Payload size limit**: The `import_content` API will return a 502 Bad Gateway if the payload is too large. Break imports into smaller batches:
  1. **Model first**: Import all content type definitions with `"content": []` (empty). Split into batches of 3-4 type definitions per call if the model is large.
  2. **Content in batches**: Import content separately, grouped logically (e.g., homepage + its paragraphs in one call, articles in another, events + team in another).
  3. **Paragraph references**: Keep `@id` references and the items they reference in the same batch — the API resolves references **only within a single import call**. Cross-batch references silently fail. This means a landing page node and **all** of its paragraph sections must be in the same API call. **Prioritize keeping references together over keeping batches small** — a batch of 30+ items that resolves correctly is better than a smaller batch with broken references. Only split when you hit 502 errors.
  4. **Never split a node from its paragraphs**: If a landing page has 8 sections with nested child paragraphs (e.g., card_group → cards, stats → stat_items), all of those paragraphs AND the node must be in one call. Plan the batch around the node, not around an arbitrary item count.
- **Existing nodes are skipped, not updated**: If a node with the same path OR same title already exists, `import_content` will skip it. You cannot overwrite existing content — you must create a new node with a different path and a different title. If a node is created with broken references, you cannot fix it by re-importing; you must create a new node.
- **Ensure all paragraph fields match Drupal**: After importing model definitions, the generated `schema/client.ts` may include fields in its GraphQL queries that don't exist on the Drupal type (e.g., querying `eyebrow` on a type that doesn't have it). This causes runtime GraphQL errors. Always cross-check `schema/schema.graphql` against `schema/client.ts` after running `sync-schema`. If they diverge, add the missing field to Drupal and re-run `sync-schema`.

```json
{
  "model": [{ "bundle": "article", "label": "Article", "fields": [...] }],
  "content": [
    {
      "id": "article1",
      "type": "node.article",
      "path": "/news/my-article",
      "values": {
        "title": "My Article",
        "body": "<p>Content here</p>"
      }
    }
  ]
}
```

### Creating a new Drupal space

When building a new site, always create a dedicated space via `create_space` MCP tool rather than reusing an existing one. Spaces take ~90-100 seconds to provision — check status with `get_space` before importing content.

### Connecting frontend to Drupal

After creating a space and importing content:

1. Get credentials via `get_oauth_credentials` MCP tool
2. Set these in `.env.local`:
   ```env
   NEXT_PUBLIC_DRUPAL_BASE_URL=https://your-space.decoupled.website
   DRUPAL_CLIENT_ID=your-client-id
   DRUPAL_CLIENT_SECRET=your-client-secret
   DRUPAL_REVALIDATE_SECRET=your-secret
   NEXT_PUBLIC_DEMO_MODE=false
   ```
3. Run `npm run sync-schema` to generate typed client from the live schema
4. Restart the dev server

### Path aliases

Drupal's pathauto module may auto-generate path aliases from node titles, overriding the `path` requested during import. After importing, verify actual aliases via GraphQL:
```graphql
{ nodeLandingPages(first: 10) { nodes { id title path } } }
```
Update navigation links to match the actual aliases. The homepage (`app/(site)/page.tsx`) falls back to `getEntries('NodeLandingPage', { first: 1 })` if the `/` path doesn't resolve.

### Generated files (schema/)

| File | Purpose |
|------|---------|
| `schema/client.ts` | Typed interfaces, queries, and `createTypedClient()` factory |
| `schema/types.ts` | Standalone type definitions (simpler, no queries) |
| `schema/schema.graphql` | Full GraphQL SDL |
| `schema/introspection.json` | Raw introspection result |

All regenerated by `npm run sync-schema`. Do not edit manually.

### Demo mode

When `NEXT_PUBLIC_DEMO_MODE` is not `'false'`, the client reads from `data/mock/*.json` instead of Drupal. Same `TypedClient` interface — pages don't know the difference.

**Landing pages** (homepage, about) go through the `TypedClient` mock client. **Standalone content types** (articles, events, team) import their mock JSON directly in their page files — they don't use the mock client since they aren't part of the generated schema until `sync-schema` runs against a Drupal backend that has those types.

**Mock file status**: `data/mock/homepage.json` and `data/mock/pages.json` exist by default. The standalone mock files (`articles.json`, `events.json`, `team.json`) must be created manually when adding those content types — they are not auto-generated. The corresponding page files must also be created as standalone Next.js pages since the catch-all `[...slug]/page.tsx` only handles landing pages.

## Theming

Site colors are controlled via the `primary` palette in `tailwind.config.js`. All components (paragraphs, header, footer, standalone pages) use `primary-*` Tailwind classes (e.g., `bg-primary-700`, `text-primary-600`). To change the site's color scheme, update the `primary` object in `tailwind.config.js` — never hardcode color names like `green-700` or `blue-600` in components.

The `gradient` background option on hero sections uses the `gradient-primary` utility class defined in `app/globals.css`, which maps to `from-primary-600 to-primary-700`.

## Sync Schema

Always run `npm run sync-schema` after:
- Creating or modifying content types/fields in Drupal
- Connecting to a new Drupal space
- Adding fields via `import_content` MCP tool

The generated `schema/client.ts` is the single source of truth for TypeScript types and GraphQL queries. If the site throws GraphQL errors after schema changes, re-run `sync-schema` to regenerate.

## CLI Commands

```bash
npm run setup                # Interactive wizard: auth → create space → .env.local → import content
npm run setup-content        # Re-import content model + sample data
npm run sync-schema          # Introspect GraphQL → generate schema/client.ts + types
```

## Environment Variables

```env
# Drupal Backend (required)
NEXT_PUBLIC_DRUPAL_BASE_URL=https://your-space.decoupled.website
DRUPAL_CLIENT_ID=your-client-id
DRUPAL_CLIENT_SECRET=your-client-secret
DRUPAL_REVALIDATE_SECRET=your-random-secret

# Puck AI (optional — pick one)
NEXT_PUBLIC_PUCK_AI_PROVIDER=groq     # or puck-cloud
GROQ_API_KEY=your-groq-key            # for groq provider
PUCK_API_KEY=your-puck-cloud-key       # for puck-cloud provider

# Demo mode
NEXT_PUBLIC_DEMO_MODE=false            # set to anything else to use mock data
```

### Local Drupal (localhost:8888)

```env
NEXT_PUBLIC_DRUPAL_BASE_URL=http://localhost:8888
DRUPAL_CLIENT_ID=local-client
DRUPAL_CLIENT_SECRET=local-secret
```

## Architecture

```
app/(site)/
  page.tsx                   Homepage (landing page from Drupal)
  [...slug]/page.tsx         Catch-all (any landing page by path)
  node/[nid]/page.tsx        Puck preview by node ID

app/(editor)/
  editor/[nid]/page.tsx      Puck visual editor

app/api/
  drupal-puck/[...path]/     Puck load/save proxy
  puck/[...all]/             Puck Cloud AI proxy
  ai/generate/               Groq AI endpoint
  auth/validate/             Editor token validation
  graphql/                   GraphQL proxy with OAuth
  editor-presence/           Multi-editor detection
  revalidate/                ISR webhook

lib/
  drupal-client.ts           getClient() → TypedClient (mock or live)
  mock-client.ts             Mock TypedClient from data/mock/*.json
  demo-mode.ts               isDemoMode() check
  queries.ts                 Hand-crafted GraphQL for landing pages
  drupal-utils.ts            Text field extraction helpers
  puck-config.tsx            Auto-generated Puck config from content model
  component-registry.tsx     Maps component names to React components

schema/                      Auto-generated by sync-schema (do not edit)
  client.ts                  Typed interfaces + queries + factory
  types.ts                   Standalone type definitions
  schema.graphql             GraphQL SDL
  introspection.json         Raw introspection

data/
  components-content.json    Content model + sample content
  mock/                      Demo mode data (homepage.json, pages.json)

app/components/paragraphs/   React components for each paragraph type
```

## Content Model

All defined in `data/components-content.json`. Import with `npm run setup-content`.

| Section | Bundle | Key fields |
|---------|--------|------------|
| Hero | `paragraph.hero` | title, subtitle, eyebrow, layout, background_color, CTAs |
| Card Group | `paragraph.card_group` | title, columns, cards → `paragraph.card` |
| Side by Side | `paragraph.sidebyside` | title, content, image, features → `paragraph.feature_item` |
| Accordion | `paragraph.accordion` | title, items → `paragraph.faq_item` |
| Testimonials | `paragraph.quote` | title, layout, testimonials → `paragraph.testimonial` |
| Pricing | `paragraph.pricing` | title, tiers → `paragraph.pricing_tier` |
| Logo Collection | `paragraph.logo_collection` | title, logos → `paragraph.logo` |
| Stats | `paragraph.stats` | title, stats → `paragraph.stat_item` |
| Newsletter | `paragraph.newsletter` | title, subtitle, button_text |
| Text Block | `paragraph.text_block` | title, content, alignment, CTA |

## Puck Editor

Accessed via Drupal's "Design Studio" tab on landing page nodes. Two AI providers available via `NEXT_PUBLIC_PUCK_AI_PROVIDER` env var (`groq` or `puck-cloud`).
