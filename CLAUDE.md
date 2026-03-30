# Decoupled Components

Next.js frontend for Drupal with section-based landing pages and a visual editor (Puck).

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

- `app/(site)/` — public pages rendered via GraphQL from Drupal
- `app/(editor)/` — Puck visual editor (authenticated via Drupal token)
- `data/components-content.json` — content model + sample content (imported to Drupal via MCP)
- `lib/puck-config.tsx` — auto-generates Puck editor config from components-content.json
- `lib/component-registry.tsx` — maps component names to React components
- `app/components/paragraphs/` — React components for each paragraph type
