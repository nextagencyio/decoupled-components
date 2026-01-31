import { gql } from '@apollo/client'

// Fragment for all paragraph types
const PARAGRAPH_FRAGMENTS = gql`
  fragment HeroFields on ParagraphHero {
    id
    eyebrow
    title
    subtitle { value }
    layout
    backgroundColor
    backgroundImage {
      url
      alt
      width
      height
    }
    primaryCtaText
    primaryCtaUrl
    secondaryCtaText
    secondaryCtaUrl
  }

  fragment CardFields on ParagraphCard {
    id
    icon
    title
    description { value }
    linkText
    linkUrl
  }

  fragment CardGroupFields on ParagraphCardGroup {
    id
    eyebrow
    title
    subtitle { value }
    columns
    cards {
      ... on ParagraphCard {
        ...CardFields
      }
    }
  }

  fragment FeatureItemFields on ParagraphFeatureItem {
    id
    icon
    title
    description { value }
  }

  fragment SidebysideFields on ParagraphSidebyside {
    id
    eyebrow
    title
    content { value }
    image {
      url
      alt
      width
      height
    }
    imagePosition
    features {
      ... on ParagraphFeatureItem {
        ...FeatureItemFields
      }
    }
    ctaText
    ctaUrl
  }

  fragment FaqItemFields on ParagraphFaqItem {
    id
    question
    answer { value }
  }

  fragment AccordionFields on ParagraphAccordion {
    id
    eyebrow
    title
    subtitle { value }
    items {
      ... on ParagraphFaqItem {
        ...FaqItemFields
      }
    }
  }

  fragment TestimonialFields on ParagraphTestimonial {
    id
    quote { value }
    authorName
    authorTitle
    authorCompany
    authorImage {
      url
      alt
    }
    rating
  }

  fragment QuoteFields on ParagraphQuote {
    id
    eyebrow
    title
    layout
    testimonials {
      ... on ParagraphTestimonial {
        ...TestimonialFields
      }
    }
  }

  fragment PricingTierFields on ParagraphPricingTier {
    id
    name
    price
    billingPeriod
    description { value }
    isFeatured
    ctaText
    ctaUrl
  }

  fragment PricingFields on ParagraphPricing {
    id
    eyebrow
    title
    subtitle { value }
    tiers {
      ... on ParagraphPricingTier {
        ...PricingTierFields
      }
    }
  }

  fragment LogoFields on ParagraphLogo {
    id
    name
    image {
      url
      alt
    }
    url
  }

  fragment LogoCollectionFields on ParagraphLogoCollection {
    id
    eyebrow
    title
    logos {
      ... on ParagraphLogo {
        ...LogoFields
      }
    }
  }

  fragment StatItemFields on ParagraphStatItem {
    id
    value
    label
    description { value }
  }

  fragment StatsFields on ParagraphStat {
    id
    eyebrow
    title
    backgroundColor
    stats {
      ... on ParagraphStatItem {
        ...StatItemFields
      }
    }
  }

  fragment NewsletterFields on ParagraphNewsletter {
    id
    eyebrow
    title
    subtitle { value }
    placeholder
    buttonText
    backgroundColor
  }

  fragment TextFields on ParagraphTextBlock {
    id
    eyebrow
    title
    content { value }
    alignment
    ctaText
    ctaUrl
  }
`

export const GET_LANDING_PAGE = gql`
  ${PARAGRAPH_FRAGMENTS}

  query GetLandingPage($path: String!) {
    route(path: $path) {
      ... on RouteInternal {
        entity {
          ... on NodeLandingPage {
            id
            title
            path
            sections {
              __typename
              ... on ParagraphHero {
                ...HeroFields
              }
              ... on ParagraphCardGroup {
                ...CardGroupFields
              }
              ... on ParagraphSidebyside {
                ...SidebysideFields
              }
              ... on ParagraphAccordion {
                ...AccordionFields
              }
              ... on ParagraphQuote {
                ...QuoteFields
              }
              ... on ParagraphPricing {
                ...PricingFields
              }
              ... on ParagraphLogoCollection {
                ...LogoCollectionFields
              }
              ... on ParagraphStat {
                ...StatsFields
              }
              ... on ParagraphNewsletter {
                ...NewsletterFields
              }
              ... on ParagraphTextBlock {
                ...TextFields
              }
            }
          }
        }
      }
    }
  }
`

export const GET_ALL_LANDING_PAGES = gql`
  query GetAllLandingPages {
    nodeLandingPages(first: 100) {
      nodes {
        id
        title
        path
      }
    }
  }
`
