import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { Shell } from '@/components/Shell'

import './globals.css'

const sans = Geist({
  variable: '--font-face-sans',
  subsets: ['latin'],
})
const mono = Geist_Mono({
  variable: '--font-face-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: { default: 'Git good', template: '%s · Git good' },
  description:
    'A playful, hands-on Git workshop with HEAD the cat: twelve real quests from your first commit to merge conflicts, rebase, bisect, the reflog and working with AI agents.',
}

export const viewport: Viewport = { themeColor: '#0d1117' }

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
