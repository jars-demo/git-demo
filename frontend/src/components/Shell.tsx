import Link from 'next/link'

import { REPO_URL } from '@/lib/levels'

import { BackToTop } from './BackToTop'
import { HeadCompanion } from './HeadCompanion'

export function CatMark({ size = 24 }: { size?: number }) {
  // HEAD's face: two ears, two green eyes.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 10 6 3.5l4.5 4M19.5 10 18 3.5l-4.5 4" fill="#f0f3f6" />
      <ellipse cx="12" cy="13.5" rx="8.5" ry="7.5" fill="#f0f3f6" />
      <circle cx="9" cy="13" r="1.4" fill="#2ea043" />
      <circle cx="15" cy="13" r="1.4" fill="#2ea043" />
      <path d="M11 16.2h2l-1 1z" fill="#ff8182" />
    </svg>
  )
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <nav
          aria-label="Main"
          className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4"
        >
          <Link href="/" className="inline-flex min-w-0 items-center gap-2.5 text-[15px]">
            <CatMark />
            <span className="truncate">
              <span className="text-muted">jars-demo / </span>
              <span className="font-semibold">git good</span>
            </span>
          </Link>
          <ul className="flex items-center gap-1 text-[14px]">
            <li>
              <Link href="/workshop" className="rounded-md px-3 py-1.5 hover:bg-surface-2">
                Quests
              </Link>
            </li>
            <li>
              <a href={REPO_URL} className="rounded-md px-3 py-1.5 text-muted hover:bg-surface-2">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 pb-28 text-[13px] text-muted sm:flex-row sm:justify-between sm:pb-6">
          <span>Git good · MIT licensed</span>
          <a href={REPO_URL} className="hover:text-ink">
            GitHub
          </a>
        </div>
      </footer>
      <BackToTop />
      <HeadCompanion />
    </>
  )
}
