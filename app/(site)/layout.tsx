import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { getBrandConfig } from '@/lib/brand'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const brand = await getBrandConfig()
  return (
    <div className="flex min-h-screen flex-col">
      <Header logo={brand.logos.light} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
