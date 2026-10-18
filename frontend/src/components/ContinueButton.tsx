'use client'

import Link from 'next/link'

import { useDone } from '@/lib/progress'

import type { GraphChapter } from './CommitGraph'

// "Start quest 01" for newcomers; "Continue: quest 06" once you have some done.

export function ContinueButton({ chapters }: { chapters: readonly GraphChapter[] }) {
  const done = useDone()
  const next = chapters.find((chapter) => !done.has(chapter.number))
  const started = done.size > 0
  const target = next ?? chapters[0]!
  const label = !started
    ? 'Start quest 01'
    : next
      ? `Continue: quest ${next.number}`
      : 'All done. Review quest 01'
  return (
    <Link
      href={`/workshop/${target.slug}`}
      className="inline-flex h-10 items-center rounded-md border border-[#2ea043] bg-button px-4 text-[14px] font-semibold text-white hover:bg-[#2ea043]"
    >
      {label}
    </Link>
  )
}
