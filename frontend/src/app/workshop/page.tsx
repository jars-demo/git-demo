import type { Metadata } from 'next'

import { CommitGraph } from '@/components/CommitGraph'
import { Squares } from '@/components/Squares'
import { CHAPTERS } from '@/lib/workshop'

export const metadata: Metadata = { title: 'Quests' }

const GRAPH = CHAPTERS.map(({ slug, number, title, minutes }) => ({ slug, number, title, minutes }))

export default function Workshop() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pt-12 pb-24">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-[12.5px] text-muted">git log --graph --reverse</p>
        <h1 className="text-[2.4rem] font-semibold tracking-[-0.03em]">All quests</h1>
        <p className="text-[16px] leading-relaxed text-ink-2">
          Twelve quests in three levels. Go in order: each one uses what the last one taught. Every
          chapter ends with a real repository to fix.
        </p>
        <Squares chapters={GRAPH} />
      </header>
      <CommitGraph chapters={GRAPH} />
    </div>
  )
}
