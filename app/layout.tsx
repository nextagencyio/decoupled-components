import type { Metadata } from 'next'
import './globals.css'
import { getBrandConfig, brandCssVars, brandFontHrefs } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'LaunchPad - Ship Products Faster',
  description: 'The platform built for modern teams to ship products faster with powerful components and integrations.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const brand = await getBrandConfig()
  const cssVars = brandCssVars(brand)
  const fontHrefs = brandFontHrefs(brand)
  const favicon = brand.logos.light?.url ?? '/favicon.svg'

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={favicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {fontHrefs.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
