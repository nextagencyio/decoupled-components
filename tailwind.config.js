/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Color tokens reference CSS custom properties set in RootLayout from
      // the dc_brand Drupal config. Any utility class like `bg-primary-500`
      // or `text-accent-700` reflects whatever the marketer picked in
      // Drupal — no rebuild of this config needed per-site.
      colors: {
        primary:   scale('primary'),
        secondary: scale('secondary'),
        accent:    scale('accent'),
        neutral:   scale('neutral'),
        surface:   scale('background'),
      },
      fontFamily: {
        sans:    ['var(--brand-font-body)',    'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--brand-font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': { color: theme('colors.primary.700') },
            },
            h1: { color: theme('colors.gray.900') },
            h2: { color: theme('colors.gray.900') },
            h3: { color: theme('colors.gray.900') },
            h4: { color: theme('colors.gray.900') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

function scale(name) {
  const stops = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  const out = {}
  for (const stop of stops) {
    out[stop] = `hsl(var(--brand-${name}-${stop}) / <alpha-value>)`
  }
  out['950'] = `hsl(var(--brand-${name}-900) / <alpha-value>)`
  out.DEFAULT = `hsl(var(--brand-${name}-500) / <alpha-value>)`
  return out
}
