'use client'

import Link from 'next/link'

import { levelOf } from '@/lib/levels'
import { useDone } from '@/lib/progress'

import type { GraphChapter } from './CommitGraph'

// Progress as a row of contribution squares: one per quest, filled once you mark it done.

export function Squares({ chapters }: { chapters: readonly GraphChapter[] }) {
  const done = useDone()
  const count = chapters.filter((chapter) => done.has(chapter.number)).length

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-wrap gap-1" aria-label="Quest progress">
        {chapters.map((chapter) => {
          const finished = done.has(chapter.number)
          return (
            <li key={chapter.number}>
              <Link
                href={`/workshop/${chapter.slug}`}
                title={`${chapter.number} ${chapter.title}${finished ? ' (done)' : ''}`}
                aria-label={`${chapter.number} ${chapter.title}${finished ? ', done' : ''}`}
                className="block size-4 rounded-[3px] border"
                style={{
                  background: finished ? levelOf(chapter.number).color : 'var(--surface-2)',
                  borderColor: finished ? 'transparent' : 'var(--line)',
                }}
              />
            </li>
          )
        })}
      </ul>
      <p className="text-[12.5px] text-muted" data-testid="progress">
        {count} of {chapters.length} quests done · kept in this browser only
      </p>
    </div>
  )
}
