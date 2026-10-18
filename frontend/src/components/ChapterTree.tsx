'use client'

import Link from 'next/link'

import { LEVELS } from '@/lib/levels'
import { useDone } from '@/lib/progress'

import type { GraphChapter } from './CommitGraph'

// The chapters as a file tree: one folder per level, one file per quest.

function Folder() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path d="M1.5 3.5h4.2l1.5 1.5h7.3v8.5h-13z" fill="#54aeff" opacity="0.85" />
    </svg>
  )
}

function File({ done }: { done: boolean }) {
  return done ? (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="6.5" fill="#2ea043" />
      <path d="M5 8.2l2 2 4-4.2" stroke="#fff" strokeWidth="1.6" fill="none" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path d="M3.5 1.5h6l3 3v10h-9z" fill="none" stroke="#8b949e" strokeWidth="1.2" />
    </svg>
  )
}

export function ChapterTree({
  chapters,
  current,
}: {
  chapters: readonly GraphChapter[]
  current?: string
}) {
  const done = useDone()
  const byNumber = new Map(chapters.map((chapter) => [chapter.number, chapter]))

  return (
    <nav aria-label="All quests" className="flex flex-col gap-3 text-[13.5px]">
      {LEVELS.map((level) => (
        <div key={level.id} className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 px-2 py-1 font-medium text-ink-2">
            <Folder />
            {level.id}/
          </div>
          <ul>
            {level.numbers.map((number) => {
              const chapter = byNumber.get(number)
              if (!chapter) return null
              const here = chapter.slug === current
              return (
                <li key={number}>
                  <Link
                    href={`/workshop/${chapter.slug}`}
                    aria-current={here ? 'page' : undefined}
                    className={`flex items-center gap-2 rounded-md py-1.5 pr-2 pl-7 ${
                      here ? 'bg-surface-2 font-medium text-ink' : 'text-ink-2 hover:bg-surface-2'
                    }`}
                  >
                    <File done={done.has(number)} />
                    <span className="truncate">
                      {number} {chapter.title}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
