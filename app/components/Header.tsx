'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Rocket } from 'lucide-react'
import Button from './ui/Button'

const DEFAULT_NAV = [
  { name: 'Features', href: '/#features' },
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'About', href: '/about' },
]

interface HeaderProps {
  // Uploaded light-mode logo from dc_brand. Resolved server-side in the
  // (site) layout and passed down here since Header is a client component.
  logo?: { url: string; alt: string } | null
  // Site name from Drupal's system.site.name. Fallback is "LaunchPad".
  siteName?: string
  // Nav items resolved from Drupal's main menu. Empty array falls
  // through to the hardcoded DEFAULT_NAV.
  nav?: Array<{ label: string; href: string }>
}

export default function Header({ logo = null, siteName, nav }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const brandLabel = siteName || 'LaunchPad'
  const configured = (nav ?? []).filter((n) => n.label && n.href)
  const navigation = configured.length > 0
    ? configured.map((n) => ({ name: n.label, href: n.href }))
    : DEFAULT_NAV

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="container-wide" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo — brand upload if present, else fallback wordmark. */}
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.url} alt={logo.alt || 'Logo'} className="h-8 w-auto" />
            ) : (
              <>
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">{brandLabel}</span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" href="#">
              Log in
            </Button>
            <Button variant="primary" href="#">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 font-medium px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                <Button variant="ghost" href="#" className="justify-center">
                  Log in
                </Button>
                <Button variant="primary" href="#" className="justify-center">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
