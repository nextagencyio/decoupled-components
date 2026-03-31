# Decoupled Components

Next.js frontend for Drupal with section-based landing pages, a visual editor (Puck), and AI-powered page generation.

## Quick Start

```bash
npm install
npm run build && npm start   # Production mode (recommended for Puck)
# OR
npm run dev                  # Dev mode (HMR can cause memory issues with Puck)
```

Default port: 3000

## Environment Variables

```env
# Drupal Backend (required)
NEXT_PUBLIC_DRUPAL_BASE_URL=https://your-space.decoupled.website
DRUPAL_CLIENT_ID=your-client-id
DRUPAL_CLIENT_SECRET=your-client-secret
DRUPAL_REVALIDATE_SECRET=your-random-secret

# Write OAuth (for Puck editor save operations)
DRUPAL_WRITE_CLIENT_ID=your-write-client-id
DRUPAL_WRITE_CLIENT_SECRET=your-write-client-secret

# Puck Cloud AI (for AI page generation in the editor)
PUCK_API_KEY=your-puck-cloud-api-key

# Optional
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud     # Image uploads
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
UNSPLASH_ACCESS_KEY=your-key                      # Stock photos in AI
```

### Getting a Puck Cloud API Key

1. Sign up at https://cloud.puckeditor.com/login
2. Create a project in the dashboard
3. Generate an API key
4. Set `PUCK_API_KEY` in `.env.local`

Pro plan is $25/month and includes $25 in AI credits (~80 page generations).

### Local Development with Drupal

For local Drupal at localhost:8888:
```env
NEXT_PUBLIC_DRUPAL_BASE_URL=http://localhost:8888
DRUPAL_CLIENT_ID=local-frontend-client
DRUPAL_CLIENT_SECRET=local-frontend-secret
DRUPAL_WRITE_CLIENT_ID=local-write-client
DRUPAL_WRITE_CLIENT_SECRET=local-write-secret
DRUPAL_REVALIDATE_SECRET=local-dev-secret
```

Set the Puck editor URL in Drupal state:
```bash
docker exec drupal-web-local drush php-eval "\Drupal::state()->set('dc_puck.editor_url', 'http://localhost:3000');"
docker exec drupal-web-local drush cr
```

## Creating Content

Use the `import_content` MCP tool. Do NOT use `create_content` — it can't handle nested paragraphs.

### Import format

```json
{
  "model": [],
  "content": [
    { "id": "my-hero", "type": "paragraph.hero", "values": { "title": "Hello", "subtitle": "World" } },
    { "id": "my-page", "type": "node.landing_page", "path": "/my-page", "values": { "title": "My Page", "sections": ["@my-hero"] } }
  ]
}
```

Key rules:
- `model: []` — skip if content types already exist on the space
- Child paragraphs are defined first, then referenced with `@id` in parent arrays
- `path` on nodes sets the URL alias (e.g. `/about`, `/services`)
- Images use `{ "url": "https://...", "alt": "description" }` format

### Available section types

All defined in `data/components-content.json`. The model array is the schema, the content array has examples.

| Section | Bundle | Key fields |
|---------|--------|------------|
| Hero | `paragraph.hero` | title, subtitle, eyebrow, layout (centered\|left-aligned), background_color, background_image, CTAs |
| Card Group | `paragraph.card_group` | title, subtitle, columns (2\|3\|4), cards → `paragraph.card` |
| Side by Side | `paragraph.sidebyside` | title, content (HTML), image, image_position (left\|right), features → `paragraph.feature_item` |
| Accordion/FAQ | `paragraph.accordion` | title, subtitle, items → `paragraph.faq_item` (question + answer) |
| Testimonials | `paragraph.quote` | title, layout (grid\|single), testimonials → `paragraph.testimonial` |
| Pricing | `paragraph.pricing` | title, subtitle, tiers → `paragraph.pricing_tier` (name, price, features list) |
| Logo Collection | `paragraph.logo_collection` | title, logos → `paragraph.logo` (name, image, url) |
| Stats | `paragraph.stats` | title, background_color, stats → `paragraph.stat_item` (value, label) |
| Newsletter | `paragraph.newsletter` | title, subtitle, placeholder, button_text, background_color |
| Text Block | `paragraph.text_block` | title, content (HTML), alignment (left\|center), CTA |

### Example: full page import

```json
{
  "model": [],
  "content": [
    {
      "id": "services-hero",
      "type": "paragraph.hero",
      "values": {
        "eyebrow": "Services",
        "title": "What we offer",
        "subtitle": "End-to-end solutions for modern teams",
        "layout": "centered",
        "background_color": "gradient",
        "primary_cta_text": "Get Started",
        "primary_cta_url": "/contact"
      }
    },
    { "id": "card-1", "type": "paragraph.card", "values": { "icon": "Code", "title": "Development", "description": "Full-stack web development with modern frameworks." } },
    { "id": "card-2", "type": "paragraph.card", "values": { "icon": "Palette", "title": "Design", "description": "Beautiful, accessible interfaces that convert." } },
    { "id": "card-3", "type": "paragraph.card", "values": { "icon": "Rocket", "title": "Deployment", "description": "CI/CD pipelines and infrastructure automation." } },
    {
      "id": "services-cards",
      "type": "paragraph.card_group",
      "values": {
        "eyebrow": "Our Services",
        "title": "Built for scale",
        "columns": "3",
        "cards": ["@card-1", "@card-2", "@card-3"]
      }
    },
    {
      "id": "services-page",
      "type": "node.landing_page",
      "path": "/services",
      "values": {
        "title": "Services",
        "sections": ["@services-hero", "@services-cards"]
      }
    }
  ]
}
```

## Architecture

```
app/(site)/                  Public pages (GraphQL from Drupal)
app/(editor)/editor/[nid]/   Puck visual editor (Drupal token auth)
app/api/
  ├── drupal-puck/[...path]/ Puck load/save proxy to Drupal
  ├── puck/[...all]/         Puck Cloud AI proxy (requires PUCK_API_KEY)
  ├── auth/validate/         Token validation for editor access
  ├── graphql/               GraphQL proxy with OAuth
  ├── revalidate/            ISR revalidation webhook
  └── upload/                Image upload proxy

data/components-content.json Content model + sample content (single source of truth)
lib/puck-config.tsx          Auto-generates Puck editor config from model
lib/component-registry.tsx   Maps component names to React components
app/components/paragraphs/   React components for each paragraph type (10)
```

## Puck AI Integration

Two AI providers are available, switched via `NEXT_PUBLIC_PUCK_AI_PROVIDER`:

### Groq (default — free)
- Provider: `puck-plugin-ai` with Vercel AI SDK + `@ai-sdk/groq`
- Endpoint: `/api/ai/generate`
- Model: `llama-3.3-70b-versatile` (configurable via `GROQ_MODEL`)
- Cost: Free (Groq free tier)
- Key files: `lib/ai-plugin-groq.ts`, `app/api/ai/generate/route.ts`

### Puck Cloud (paid)
- Provider: `@puckeditor/plugin-ai` + `@puckeditor/cloud-client`
- Endpoint: `/api/puck/[...all]` (proxies to Puck Cloud)
- Cost: $25/mo + ~$0.30/generation
- Key files: `lib/ai-plugin-puck-cloud.ts`, `app/api/puck/[...all]/route.ts`

### Switching providers
Change `NEXT_PUBLIC_PUCK_AI_PROVIDER` in `.env.local` and rebuild:
- `groq` — uses Groq/Llama (default)
- `puck-cloud` — uses Puck Cloud

Both support the same actions:
- "Create a landing page about X" → generates a full page
- "Add a pricing section" → appends to the existing page
- "Rewrite the hero copy" → updates a specific section

## Puck Editor Access

The editor is accessed via Drupal's "Design Studio" tab on landing page nodes:

1. Log into Drupal admin
2. Navigate to a landing_page node
3. Click the "Design Studio" tab
4. Drupal generates a signed HMAC token and redirects to `/editor/{nid}?token=...`
5. Next.js validates the token, creates a session, and loads the Puck editor

The editor URL is stored in Drupal state at `dc_puck.editor_url`.
