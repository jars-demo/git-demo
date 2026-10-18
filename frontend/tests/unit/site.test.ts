import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { head } from '@kit/companions/head/head'
import { HEAD_ANSWERS } from '@/lib/answers'
import { LEVELS, levelOf } from '@/lib/levels'
import { parseDone } from '@/lib/progress'
import { CHAPTERS } from '@/lib/workshop'

const ROOT = path.join(process.cwd(), '..')
const QUESTS = fs.readFileSync(path.join(ROOT, 'lab/quest/quests.py'), 'utf8')

describe('chapters', () => {
  it('has twelve chapters numbered in order', () => {
    expect(CHAPTERS.map((chapter) => Number(chapter.number))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })

  it.each(CHAPTERS.map((chapter) => [chapter.slug, chapter] as const))(
    '%s has a summary, a time, the standard sections and its own quest',
    (_slug, chapter) => {
      expect(chapter.summary.length).toBeGreaterThan(10)
      expect(chapter.minutes).toBeGreaterThan(0)
      expect(chapter.body).toMatch(/^## Goal$/m)
      expect(chapter.body).toMatch(/^## Check it works$/m)
      expect(chapter.body).toMatch(/^## Exercise$/m)
      expect(chapter.body).toContain(`quest start ${Number(chapter.number)}`)
      expect(QUESTS).toContain(`Quest(\n        ${Number(chapter.number)},`)
    },
  )
})

describe('levels', () => {
  it('puts every chapter in exactly one level', () => {
    const numbers = LEVELS.flatMap((level) => level.numbers)
    expect(numbers.sort()).toEqual(CHAPTERS.map((chapter) => chapter.number))
    expect(levelOf('05').id).toBe('intermediate')
  })
})

describe('progress', () => {
  it('reads only lists of strings, and nothing else', () => {
    expect(parseDone('["01","05"]')).toEqual(['01', '05'])
    expect(parseDone('not json')).toEqual([])
    expect(parseDone('{"01":true}')).toEqual([])
  })
})

describe('HEAD the cat', () => {
  it('points every answer at a chapter that exists', () => {
    for (const { answer } of HEAD_ANSWERS) {
      const cited = /Chapter (\d{2})/.exec(answer)?.[1]
      if (cited) expect(CHAPTERS.some((chapter) => chapter.number === cited)).toBe(true)
    }
  })

  it('keeps her face and limbs inside the canvas', () => {
    const points = [
      ...Object.values(head.face),
      ...Object.values(head.arms),
      ...Object.values(head.legs),
    ]
    for (const [x, y] of points) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(120)
      expect(y).toBeGreaterThanOrEqual(10)
      expect(y).toBeLessThanOrEqual(136)
    }
  })
})
