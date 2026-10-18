import { head } from '@kit/companions/head/head'
import { Figure } from '@kit/react/Figure'

import { CommitGraph } from '@/components/CommitGraph'
import { ContinueButton } from '@/components/ContinueButton'
import { CopyButton } from '@/components/CopyButton'
import { Squares } from '@/components/Squares'
import { LEVELS, REPO_URL } from '@/lib/levels'
import { CHAPTERS } from '@/lib/workshop'

const GRAPH = CHAPTERS.map(({ slug, number, title, minutes }) => ({ slug, number, title, minutes }))

// Real output of `quest start 5`, then `git merge rename` inside it, wrapped to fit.
const TERMINAL = [
  { kind: 'cmd', text: 'quest start 5' },
  { kind: 'cat', text: ' /\\_/\\' },
  { kind: 'cat', text: '( o.o )  main calls the cat Mittens. The rename branch' },
  { kind: 'cat', text: ' > ^ <   calls her HEAD. Both changed the same line.' },
  { kind: 'cmd', text: 'git merge rename' },
  { kind: 'out', text: 'CONFLICT (content): Merge conflict in name.txt' },
  { kind: 'cmd', text: 'cat name.txt' },
  { kind: 'ours', text: '<<<<<<< HEAD' },
  { kind: 'out', text: 'The cat is called Mittens.' },
  { kind: 'mark', text: '=======' },
  { kind: 'out', text: 'The cat is called HEAD.' },
  { kind: 'theirs', text: '>>>>>>> rename' },
]

const COLORS: Record<string, string> = {
  cat: 'text-[#f0f3f6]',
  out: 'text-[#c9d1d9]',
  ours: 'text-[#58a6ff]',
  mark: 'text-[#8b949e]',
  theirs: 'text-[#f0883e]',
}

const STEPS = [
  ['quest start 5', 'HEAD builds a real repository with a real problem, in ~/git-good.'],
  ['git ...', 'You fix it with real git. Status, diff, merge, rebase: whatever it takes.'],
  ['quest check', 'Every line says PASS, and HEAD purrs. Stuck? quest hint.'],
]

const QUICKSTART = `git clone https://github.com/jars-demo/git-demo.git
cd git-demo/lab
uv tool install --editable .
quest start 1`

export default function Home() {
  const minutes = CHAPTERS.reduce((sum, chapter) => sum + chapter.minutes, 0)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 pt-12 pb-24 sm:pt-20">
      <section className="hero-glow -mx-4 -mt-12 grid items-center gap-12 px-4 pt-12 pb-4 sm:-mt-20 sm:pt-20 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <p className="flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
            <span className="rounded-full border border-line px-2.5 py-0.5">Public workshop</span>
            <span>
              {CHAPTERS.length} quests · 3 levels · about {Math.round(minutes / 60)} hours
            </span>
          </p>
          <h1 className="text-[3rem] leading-[1.02] font-semibold tracking-[-0.04em] sm:text-[4rem]">
            Git <span className="text-gradient">good.</span>
          </h1>
          <p className="max-w-xl text-[18px] leading-relaxed text-ink-2">
            Learn git by fixing real repositories. HEAD the cat sets up a problem, you solve it with
            real git commands, and a checker tells you when you got it. From your first commit to
            merge conflicts, rebase, bisect, the reflog, and keeping AI agents in line.
          </p>
          <div className="flex flex-wrap gap-3">
            <ContinueButton chapters={GRAPH} />
            <a
              href={REPO_URL}
              className="inline-flex h-10 items-center rounded-md border border-line-strong bg-surface-2 px-4 text-[14px] font-medium hover:border-muted"
            >
              View the code
            </a>
          </div>
        </div>

        <figure className="min-w-0 overflow-hidden rounded-md border border-line">
          <figcaption className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5 text-[12px] text-muted">
            <span className="size-2.5 rounded-full bg-[#f85149]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#d29922]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#3fb950]" aria-hidden="true" />
            <span className="ml-2">~/git-good/05-merge-conflicts</span>
          </figcaption>
          <div className="code overflow-x-auto px-4 py-4 text-[12.5px] leading-[1.7]">
            {TERMINAL.map((line, index) =>
              line.kind === 'cmd' ? (
                <div key={index} className="mt-2 whitespace-pre first:mt-0">
                  <span className="text-[#3fb950]">$ </span>
                  {line.text}
                </div>
              ) : (
                <div key={index} className={`whitespace-pre ${COLORS[line.kind]}`}>
                  {line.text}
                </div>
              ),
            )}
          </div>
        </figure>
      </section>

      <section aria-labelledby="map" className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-4">
          <h2 id="map" className="text-[1.6rem] font-semibold tracking-[-0.02em]">
            The map is a git graph
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-2">
            Basics live on <code className="font-mono text-ink">main</code>. Each later level is a
            branch that forks off and merges back, exactly like the work you will do.
          </p>
          <ul className="flex flex-col gap-2 text-[14px]">
            {LEVELS.map((level) => (
              <li key={level.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span
                  className="size-3 rounded-full"
                  style={{ background: level.color }}
                  aria-hidden="true"
                />
                <span className="font-medium">{level.name}</span>
                <span className="text-muted">{level.blurb}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 rounded-md border border-line bg-surface p-4">
            <p className="mb-3 text-[13px] font-medium">Your progress</p>
            <Squares chapters={GRAPH} />
          </div>
        </div>
        <CommitGraph chapters={GRAPH} />
      </section>

      <section aria-labelledby="how" className="flex flex-col gap-6">
        <h2 id="how" className="text-[1.6rem] font-semibold tracking-[-0.02em]">
          How a quest works
        </h2>
        <ol className="grid gap-3 md:grid-cols-3">
          {STEPS.map(([command, about], index) => (
            <li
              key={command}
              className="flex flex-col gap-3 rounded-md border border-line bg-surface p-5"
            >
              <span className="font-mono text-[12px] text-muted">step {index + 1}</span>
              <code className="font-mono text-[14px] text-accent">{command}</code>
              <span className="text-[14px] leading-relaxed text-ink-2">{about}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="meet"
        className="grid items-center gap-8 rounded-md border border-line bg-surface p-6 sm:grid-cols-[auto_1fr] sm:p-8"
      >
        <div className="mx-auto w-28">
          <Figure character={head} mood="waving" />
        </div>
        <div className="flex flex-col gap-3">
          <h2 id="meet" className="text-[1.6rem] font-semibold tracking-[-0.02em]">
            Meet HEAD
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-2">
            In git, HEAD points at the commit you are on. Our HEAD is a small cat who always knows
            where you are. She sets up every quest, checks your fix, and lives in the corner of this
            page. Tap her when you are stuck: her answers are short, fixed and true.
          </p>
        </div>
      </section>

      <section aria-labelledby="start" className="flex flex-col gap-4">
        <h2 id="start" className="text-[1.6rem] font-semibold tracking-[-0.02em]">
          Start in a minute
        </h2>
        <p className="text-[15px] text-ink-2">
          You need git and{' '}
          <a href="https://docs.astral.sh/uv/" className="text-link hover:underline">
            uv
          </a>
          . The <code className="font-mono text-ink">quest</code> command builds every quest for
          you.
        </p>
        <div className="code relative max-w-2xl overflow-x-auto rounded-md border border-line px-4 pt-10 pb-4 text-[13px] leading-relaxed">
          <div className="absolute top-2 right-2">
            <CopyButton text={QUICKSTART} />
          </div>
          <pre>{QUICKSTART}</pre>
        </div>
      </section>
    </div>
  )
}
