import { ApolloProvider } from '@/app/components/providers/ApolloProvider'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
// DEMO MODE: Remove this import and <DemoModeBanner /> below for production-only builds
import { DemoModeBanner } from '@/app/components/DemoModeBanner'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DemoModeBanner />
      <ApolloProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </ApolloProvider>
    </>
  )
}
