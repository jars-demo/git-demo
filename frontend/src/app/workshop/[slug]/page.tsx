import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ChapterTree } from '@/components/ChapterTree'
import { headingsOf, Markdown } from '@/components/Markdown'
import { QuestBox } from '@/components/QuestBox'
import { levelOf } from '@/lib/levels'
import { CHAPTERS, findChapter } from '@/lib/workshop'

const TREE = CHAPTERS.map(({ slug, number, title, minutes }) => ({ slug, number, title, minutes }))

export function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ slug: chapter.slug }))
}

export async function generateMetadata(props: PageProps<'/workshop/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const chapter = findChapter(slug)
  return { title: chapter ? `${chapter.number}. ${chapter.title}` : 'Quest' }
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path d="M3.5 1.5h6l3 3v10h-9z" fill="none" stroke="#8b949e" strokeWidth="1.2" />
    </svg>
  )
}

export default async function ChapterPage(props: PageProps<'/workshop/[slug]'>) {
  const { slug } = await props.params
  const chapter = findChapter(slug)
  if (!chapter) notFound()
  const index = CHAPTERS.indexOf(chapter)
  const previous = CHAPTERS[index - 1]
  const next = CHAPTERS[index + 1]
  const level = levelOf(chapter.number)
  const headings = headingsOf(chapter.body)

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-8 pb-24 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_190px]">
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <ChapterTree chapters={TREE} current={chapter.slug} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        <details className="rounded-md border border-line bg-surface lg:hidden">
          <summary className="cursor-pointer px-4 py-3 text-[14px] font-medium">All quests</summary>
          <div className="border-t border-line p-2">
            <ChapterTree chapters={TREE} current={chapter.slug} />
          </div>
        </details>

        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[14px]">
          <span
            className="rounded-md border px-2 py-0.5 font-mono text-[12px]"
            style={{ borderColor: level.color, color: level.color }}
          >
            {level.branch}
          </span>
          <Link href="/workshop" className="text-link hover:underline">
            quests
          </Link>
          <span className="text-muted">/</span>
          <span className="text-link">{level.id}</span>
          <span className="text-muted">/</span>
          <span className="min-w-0 font-semibold break-all">{chapter.slug}.md</span>
        </nav>

        <article className="overflow-hidden rounded-md border border-line">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-4 py-2.5 text-[13px] text-muted">
            <span className="inline-flex min-w-0 items-center gap-2">
              <FileIcon />
              <span className="truncate">{chapter.slug}.md</span>
            </span>
            <span>
              {level.name} · {chapter.minutes} minutes
            </span>
          </div>
          <div className="px-4 py-8 sm:px-8">
            <header className="mb-8 flex flex-col gap-3 border-b border-line pb-6">
              <p className="font-mono text-[12.5px] text-muted">Quest {chapter.number}</p>
              <h1 className="text-[2.2rem] leading-tight font-semibold tracking-[-0.03em] text-balance">
                {chapter.title}
              </h1>
              <p className="text-[17px] leading-relaxed text-ink-2">{chapter.summary}</p>
            </header>
            <div className="prose-chapter">
              <Markdown>{chapter.body}</Markdown>
            </div>
            <QuestBox number={chapter.number} />
          </div>
        </article>

        <nav aria-label="Previous and next quest" className="grid gap-3 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/workshop/${previous.slug}`}
              className="flex flex-col gap-1 rounded-md border border-line p-4 hover:border-muted"
            >
              <span className="font-mono text-[12px] text-muted">Previous</span>
              <span className="font-medium text-link">
                {previous.number}. {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/workshop/${next.slug}`}
              className="flex flex-col gap-1 rounded-md border border-line p-4 text-right hover:border-muted"
            >
              <span className="font-mono text-[12px] text-muted">Next</span>
              <span className="font-medium text-link">
                {next.number}. {next.title}
              </span>
            </Link>
          ) : (
            <Link
              href="/workshop"
              className="flex flex-col gap-1 rounded-md border border-line p-4 text-right hover:border-muted"
            >
              <span className="font-mono text-[12px] text-muted">All done</span>
              <span className="font-medium text-link">Back to the map</span>
            </Link>
          )}
        </nav>
      </div>

      <aside className="hidden xl:block" aria-label="On this page">
        <div className="sticky top-20 flex flex-col gap-2 text-[13px]">
          <p className="font-medium text-ink">On this page</p>
          <ul className="flex flex-col gap-1.5 border-l border-line">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="-ml-px block border-l border-transparent pl-3 text-muted hover:border-muted hover:text-ink"
                >
                  {heading.text}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#quest-box"
                className="-ml-px block border-l border-transparent pl-3 text-accent hover:border-accent"
              >
                Mark it done
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
