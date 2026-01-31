'use client'

import type { ParagraphLogoCollection as ParagraphLogoCollectionType } from '@/lib/types'
import Badge from '../ui/Badge'

// Tech stack brand colors for hover effect
const brandColors: Record<string, string> = {
  'next.js': '#000000',
  'nextjs': '#000000',
  'drupal': '#0678BE',
  'graphql': '#E10098',
  'tailwind': '#06B6D4',
  'tailwindcss': '#06B6D4',
  'typescript': '#3178C6',
  'vercel': '#000000',
  'react': '#61DAFB',
}

// Inline SVG icons for tech brands
const TechLogos: Record<string, React.FC<{ className?: string }>> = {
  'next.js': ({ className }) => (
    <svg className={className} viewBox="0 0 180 180" fill="currentColor">
      <mask id="nextMask" style={{ maskType: 'alpha' }}>
        <circle cx="90" cy="90" r="90" fill="black"/>
      </mask>
      <g mask="url(#nextMask)">
        <circle cx="90" cy="90" r="90" fill="black"/>
        <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#nextGrad1)"/>
        <path d="M115 54h12v72h-12z" fill="url(#nextGrad2)"/>
      </g>
      <defs>
        <linearGradient id="nextGrad1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="nextGrad2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  'nextjs': ({ className }) => TechLogos['next.js']({ className }),
  'drupal': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.78 5.113C14.09 3.425 12.48 1.815 11.998 0c-.48 1.815-2.09 3.425-3.778 5.113-2.534 2.53-5.405 5.4-5.405 9.702a9.184 9.184 0 1018.368 0c0-4.303-2.871-7.171-5.405-9.702M6.72 16.954c-.563-.019-2.64-3.6 1.215-7.416l2.55 2.788a.218.218 0 01-.016.325c-.61.625-3.204 3.227-3.527 4.126-.066.186-.164.18-.222.177M12 21.677a3.158 3.158 0 01-3.158-3.159 3.291 3.291 0 01.787-2.087c.57-.696 1.181-1.389 1.785-2.063a.218.218 0 01.332 0c.604.674 1.215 1.367 1.785 2.063a3.29 3.29 0 01.787 2.087A3.158 3.158 0 0112 21.677m5.282-4.723c-.323-.9-2.916-3.501-3.527-4.126a.218.218 0 01-.016-.325l2.551-2.788c3.855 3.816 1.778 7.397 1.215 7.416-.058.003-.156.009-.223-.177"/>
    </svg>
  ),
  'graphql': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.002 0a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm8.54 4.931a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm0 9.862a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm-8.54 4.931a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm-8.542-4.93a2.138 2.138 0 100 4.276 2.138 2.138 0 100-4.277zm0-9.863a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm8.542-3.378L2.953 6.777v10.448l9.049 5.224 9.047-5.224V6.777zm0 1.601l7.66 13.27H4.34zm-1.387.371L3.97 15.037V7.363zm2.774 0l6.646 3.838v7.674zM5.355 17.44h13.293l-6.646 3.836z"/>
    </svg>
  ),
  'tailwind': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
    </svg>
  ),
  'tailwindcss': ({ className }) => TechLogos['tailwind']({ className }),
  'typescript': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
    </svg>
  ),
  'vercel': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 22.525H0l12-21.05 12 21.05z"/>
    </svg>
  ),
  'react': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.235-2.236 2.236 2.236 0 012.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 00-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 00-3.107-.534A23.892 23.892 0 0012.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 00-3.113.538 15.02 15.02 0 01-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 01-4.412.005 26.64 26.64 0 01-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 011.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0112 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 00-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 00-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 001.341-2.338zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143a22.005 22.005 0 01-2.006-.386c.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295a1.185 1.185 0 01-.553-.132c-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
    </svg>
  ),
}

// Convert http URLs to https
function secureUrl(url: string): string {
  return url.replace(/^http:\/\//, 'https://')
}

export default function ParagraphLogoCollection({
  eyebrow,
  title,
  logos,
}: ParagraphLogoCollectionType) {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-gray-100">
      <div className="container-wide">
        {/* Header */}
        {(eyebrow || title) && (
          <div className="text-center mb-8">
            {eyebrow && (
              <Badge variant="default" className="mb-2">
                {eyebrow}
              </Badge>
            )}
            {title && (
              <p className="text-gray-500">{title}</p>
            )}
          </div>
        )}

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-14">
          {logos.map((logo) => {
            const nameKey = logo.name.toLowerCase()
            const LogoIcon = TechLogos[nameKey]
            const brandColor = brandColors[nameKey]

            // Check if there's a valid image URL (starts with http)
            const hasValidImage = logo.image?.url && logo.image.url.startsWith('http')

            // Prioritize inline SVG icons for known tech brands
            const content = LogoIcon ? (
              <div className="flex items-center gap-2 group">
                <LogoIcon className="h-8 w-8 md:h-10 md:w-10 text-gray-400 group-hover:text-current transition-colors" />
                <span className="font-semibold text-gray-400 group-hover:text-current transition-colors text-sm md:text-base hidden sm:inline">
                  {logo.name}
                </span>
              </div>
            ) : hasValidImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={secureUrl(logo.image.url)}
                alt={logo.name}
                className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
              />
            ) : (
              <span className="font-semibold text-gray-400 hover:text-gray-700 transition-colors text-sm md:text-base">
                {logo.name}
              </span>
            )

            return (
              <div
                key={logo.id}
                className="flex items-center justify-center transition-colors"
                style={{ '--brand-color': brandColor } as React.CSSProperties}
              >
                {logo.url ? (
                  <a
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => {
                      if (brandColor) {
                        e.currentTarget.style.color = brandColor
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'inherit'
                    }}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
