import { getBrandConfig } from '@/lib/brand'

export const metadata = {
  title: 'Brand preview',
  description: 'Live preview of dc_brand tokens resolved from Drupal.',
}

const stops = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const
const colorKeys = ['primary', 'secondary', 'accent', 'neutral', 'background'] as const

export default async function BrandPreviewPage() {
  const brand = await getBrandConfig()

  return (
    <main className="min-h-screen bg-white text-gray-900 p-8 sm:p-12 max-w-6xl mx-auto">
      <header className="mb-12">
        <p className="text-sm font-mono uppercase tracking-widest text-neutral-500">dc_brand preview</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-display">Your brand, resolved.</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">
          Every color, font, and logo on this page comes from <code>/api/dc-brand/settings</code>.
          Change the values in Drupal at <code>/admin/config/brand</code>, reload.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 font-display">Fonts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="text-xs uppercase tracking-wider text-gray-500">Heading</p>
            <p className="mt-1 font-mono text-sm">{brand.fonts.heading.family}</p>
            <p className="mt-4 font-display text-4xl font-bold">The quick brown fox</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="text-xs uppercase tracking-wider text-gray-500">Body</p>
            <p className="mt-1 font-mono text-sm">{brand.fonts.body.family}</p>
            <p className="mt-4 font-sans text-base leading-relaxed">
              Structure your content once. Let your team, your agents, and your workflows run wild.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 font-display">Colors</h2>
        <div className="space-y-6">
          {colorKeys.map((key) => (
            <div key={key}>
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-semibold capitalize">{key}</h3>
                <code className="text-xs text-gray-500">{brand.colors[key].hex}</code>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
                {stops.map((stop) => (
                  <div key={stop} className="flex flex-col">
                    <div
                      className="aspect-square rounded border border-gray-200"
                      style={{ backgroundColor: `hsl(${brand.colors[key].scale[stop].css})` }}
                    />
                    <span className="mt-1 text-[10px] text-center font-mono text-gray-500">{stop}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 font-display">Logos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-8 flex items-center justify-center min-h-40">
            {brand.logos.light ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logos.light.url} alt={brand.logos.light.alt} className="max-h-24" />
            ) : (
              <span className="text-sm text-gray-400">Light logo — not uploaded</span>
            )}
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-8 flex items-center justify-center min-h-40">
            {brand.logos.dark ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logos.dark.url} alt={brand.logos.dark.alt} className="max-h-24" />
            ) : (
              <span className="text-sm text-gray-500">Dark logo — not uploaded</span>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 font-display">Tailwind tokens in use</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg bg-primary-500 text-white p-4 text-sm font-semibold">bg-primary-500</div>
          <div className="rounded-lg bg-secondary-500 text-white p-4 text-sm font-semibold">bg-secondary-500</div>
          <div className="rounded-lg bg-accent-500 text-white p-4 text-sm font-semibold">bg-accent-500</div>
          <div className="rounded-lg bg-neutral-500 text-white p-4 text-sm font-semibold">bg-neutral-500</div>
          <div className="rounded-lg border-2 border-primary-500 text-primary-700 p-4 text-sm font-semibold">border-primary-500</div>
          <div className="rounded-lg bg-primary-100 text-primary-900 p-4 text-sm font-semibold">bg-primary-100</div>
          <div className="rounded-lg bg-surface-900 text-surface-50 p-4 text-sm font-semibold">bg-surface-900</div>
          <div className="rounded-lg bg-accent-50 text-accent-900 p-4 text-sm font-semibold">bg-accent-50</div>
        </div>
      </section>
    </main>
  )
}
