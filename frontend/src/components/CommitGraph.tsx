'use client'

import Link from 'next/link'

import { LEVELS } from '@/lib/levels'
import { useDone } from '@/lib/progress'

// The quests drawn as `git log --graph`: basics on main, each later level a branch that forks
// off and merges back. Lines are plain CSS, so rows can grow when titles wrap on a phone.

export type GraphChapter = { slug: string; number: string; title: string; minutes: number }

const MAIN = LEVELS[0]!.color

function Line({
  x,
  color,
  from = '0',
  to = '0',
}: {
  x: number
  color: string
  from?: string
  to?: string
}) {
  return (
    <span
      aria-hidden="true"
      className="absolute w-0.5"
      style={{ left: x - 1, top: from, bottom: to, background: color }}
    />
  )
}

function Bend({ kind, color }: { kind: 'fork' | 'merge'; color: string }) {
  const d = kind === 'fork' ? 'M12 4C12 22 32 14 32 36' : 'M32 0C32 20 12 14 12 30'
  return (
    <svg width="48" height="36" viewBox="0 0 48 36" aria-hidden="true" className="shrink-0">
      <path d="M12 0V36" stroke={MAIN} strokeWidth="2" />
      <path d={d} stroke={color} strokeWidth="2" fill="none" />
      {kind === 'merge' ? (
        <circle cx="12" cy="30" r="4.5" fill="var(--canvas)" stroke={color} strokeWidth="2" />
      ) : null}
    </svg>
  )
}

export function CommitGraph({ chapters }: { chapters: readonly GraphChapter[] }) {
  const done = useDone()
  const byNumber = new Map(chapters.map((chapter) => [chapter.number, chapter]))

  return (
    <ol className="overflow-hidden rounded-md border border-line bg-surface" aria-label="Quests">
      {LEVELS.map((level, levelIndex) => {
        const lane = levelIndex === 0 ? 0 : 1
        const x = lane === 0 ? 12 : 32
        return [
          lane === 1 ? (
            <li
              key={`${level.id}-fork`}
              className="flex items-center gap-2 pr-4"
              aria-hidden="true"
            >
              <Bend kind="fork" color={level.color} />
              <span
                className="rounded-full border px-2 py-0.5 font-mono text-[11.5px]"
                style={{ borderColor: level.color, color: level.color }}
              >
                {level.branch}
              </span>
            </li>
          ) : null,
          ...level.numbers.map((number, index) => {
            const chapter = byNumber.get(number)
            if (!chapter) return null
            const finished = done.has(number)
            const first = levelIndex === 0 && index === 0
            return (
              <li key={number}>
                <Link
                  href={`/workshop/${chapter.slug}`}
                  className="group flex items-stretch gap-2 pr-4 hover:bg-surface-2"
                >
                  <span className="relative w-12 shrink-0">
                    <Line x={12} color={MAIN} from={first ? '50%' : '0'} />
                    {lane === 1 ? <Line x={32} color={level.color} /> : null}
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2"
                      style={{
                        left: x - 7,
                        borderColor: level.color,
                        background: finished ? level.color : 'var(--canvas)',
                      }}
                    />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5 py-3">
                    <span className="font-mono text-[12.5px] text-link">{number}</span>
                    <span className="min-w-0 text-[15px] font-medium group-hover:text-link">
                      {chapter.title}
                    </span>
                    {finished ? (
                      <span className="rounded-full bg-accent-wash px-2 text-[11.5px] text-accent">
                        done
                      </span>
                    ) : null}
                  </span>
                  <span className="self-center font-mono text-[12px] text-muted">
                    {chapter.minutes}m
                  </span>
                </Link>
              </li>
            )
          }),
          lane === 1 ? (
            <li
              key={`${level.id}-merge`}
              className="flex items-center gap-2 pr-4"
              aria-hidden="true"
            >
              <Bend kind="merge" color={level.color} />
              <span className="font-mono text-[11.5px] text-muted">
                Merge {level.branch} into main
              </span>
            </li>
          ) : null,
        ]
      })}
    </ol>
  )
}
