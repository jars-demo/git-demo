'use client'

import { toggleDone, useDone } from '@/lib/progress'

import { CopyButton } from './CopyButton'

// The end of every chapter: the commands for its quest, and a way to mark it done.

export function QuestBox({ number }: { number: string }) {
  const done = useDone().has(number)
  const commands = `quest start ${Number(number)}\n# ...fix it with real git...\nquest check`

  return (
    <section
      aria-labelledby="quest-box"
      className="mt-12 overflow-hidden rounded-md border border-line"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
        <h2 id="quest-box" className="text-[15px] font-semibold">
          Quest {number}
        </h2>
        <button
          type="button"
          onClick={() => toggleDone(number)}
          aria-pressed={done}
          className={`rounded-md border px-3 py-1.5 text-[13px] font-medium ${
            done
              ? 'border-accent/50 bg-accent-wash text-accent'
              : 'border-[#2ea043] bg-button text-white hover:bg-[#2ea043]'
          }`}
        >
          {done ? 'Done. Undo?' : 'Mark as done'}
        </button>
      </div>
      <div className="relative">
        <pre className="code overflow-x-auto px-4 pt-4 pb-4 text-[13px] leading-relaxed">
          {commands}
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={commands} />
        </div>
      </div>
      <p className="border-t border-line px-4 py-3 text-[13px] text-muted">
        Mark it done once <code className="font-mono text-ink-2">quest check</code> shows every line
        as PASS. Your progress stays in this browser.
      </p>
    </section>
  )
}
