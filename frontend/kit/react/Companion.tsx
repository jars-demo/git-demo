'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import {
  lookVector,
  nextStrollDelay,
  pickStrollTarget,
  pickTrick,
  strollBounds,
  walkDuration,
} from '../core/behaviour'
import type { CharacterDefinition, CompanionAnswer, Mood, Trick } from '../core/types'

import { Figure } from './Figure'

// A small companion that lives along the bottom of the page. Now and then it strolls somewhere
// new and maybe does a trick; otherwise it rests and peeks. Its eyes follow the pointer. Tapping
// it opens a panel with fixed answers, so it never makes anything up. It keeps still while open,
// while the tab is hidden, and for people who prefer reduced motion.

export type CompanionProps = {
  character: CharacterDefinition
  /** Quick questions with fixed answers. Without any, tapping just makes it wave. */
  answers?: readonly CompanionAnswer[]
  /** First line in the panel. Defaults to "Hi, I'm {name}." */
  greeting?: string
  /** Walk along the bottom edge now and then. Default true. */
  stroll?: boolean
  /** Flip, spin or jump after some strolls. Default true. */
  tricks?: boolean
  /** Change this (for example to the current path) to make it flip like a turning page. */
  routeKey?: string
  /** Pixels to keep clear on the right, for a back-to-top button or chat widget. Default 80. */
  avoidRight?: number
  /** Pixel size of the companion's width. Default 88. */
  size?: number
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Companion({
  character,
  answers = [],
  greeting,
  stroll = true,
  tricks = true,
  routeKey,
  avoidRight = 80,
  size = 88,
}: CompanionProps) {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [x, setX] = useState(24)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [walkMs, setWalkMs] = useState<number | null>(null)
  const [awake, setAwake] = useState(false)
  const [trick, setTrick] = useState<Trick | null>(null)
  const [waving, setWaving] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const state = useRef({ open, x })
  const firstRoute = useRef(true)

  useEffect(() => {
    state.current = { open, x }
  }, [open, x])

  // Eyes follow the pointer.
  useEffect(() => {
    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = button.current?.getBoundingClientRect()
        if (!rect) return
        setLook(
          lookVector(
            { x: rect.left + rect.width / 2, y: rect.top + rect.height / 3 },
            { x: event.clientX, y: event.clientY },
          ),
        )
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  const doTrick = useCallback((next: Trick | null) => {
    if (!next) return
    setTrick(next)
    window.setTimeout(() => setTrick(null), 1000)
  }, [])

  const takeStroll = useCallback(() => {
    const bounds = strollBounds(window.innerWidth, size, avoidRight)
    const target = pickStrollTarget(state.current.x, bounds, Math.random)
    if (target === null) return
    const ms = walkDuration(state.current.x, target)
    setFacing(target >= state.current.x ? 1 : -1)
    setAwake(true)
    setWalkMs(ms)
    setX(target)
    window.setTimeout(() => {
      setWalkMs(null)
      if (tricks) doTrick(pickTrick(Math.random))
      window.setTimeout(() => setAwake(false), 2600)
    }, ms)
  }, [avoidRight, doTrick, size, tricks])

  // Stroll now and then, never constantly.
  useEffect(() => {
    if (!stroll || prefersReducedMotion()) return
    let timer = 0
    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        if (!state.current.open && !document.hidden) takeStroll()
        schedule(nextStrollDelay(Math.random))
      }, delay)
    }
    schedule(6_000)
    return () => window.clearTimeout(timer)
  }, [stroll, takeStroll])

  // A new route: turn like a page.
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false
      return
    }
    if (!tricks || prefersReducedMotion()) return
    const start = window.setTimeout(() => {
      setAwake(true)
      doTrick('flip')
    }, 0)
    const rest = window.setTimeout(() => setAwake(false), 1600)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(rest)
    }
  }, [routeKey, tricks, doTrick])

  // Stay on screen after a resize.
  useEffect(() => {
    const onResize = () => {
      const { min, max } = strollBounds(window.innerWidth, size, avoidRight)
      setX((current) => Math.min(Math.max(current, min), max))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [avoidRight, size])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function onTap() {
    setWalkMs(null)
    if (answers.length === 0) {
      setWaving(true)
      window.setTimeout(() => setWaving(false), 1800)
      return
    }
    setOpen((value) => !value)
    setAnswer(null)
  }

  const mood: Mood = open || waving ? 'waving' : walkMs !== null ? 'walking' : 'idle'
  const onRight = typeof window !== 'undefined' && x > window.innerWidth / 2

  return (
    <div
      className="cmp-root"
      style={{
        transform: `translateX(${x}px)`,
        transition: walkMs !== null ? `transform ${walkMs}ms linear` : 'none',
      }}
    >
      {open ? (
        <div
          role="dialog"
          aria-label={`Questions for ${character.name}`}
          className={`cmp-panel ${onRight ? 'cmp-panel-right' : ''}`}
        >
          <div className="cmp-panel-head">
            <p>
              <strong>{greeting ?? `Hi, I’m ${character.name}.`}</strong>
            </p>
            <button
              type="button"
              className="cmp-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="m4 4 8 8m0-8-8 8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {answer ? (
            <p className="cmp-answer" aria-live="polite">
              {answer}
            </p>
          ) : null}
          <ul className="cmp-questions">
            {answers.map((item) => (
              <li key={item.question}>
                <button
                  type="button"
                  aria-pressed={answer === item.answer}
                  onClick={() => setAnswer(item.answer)}
                >
                  {item.question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <button
        ref={button}
        type="button"
        aria-expanded={answers.length > 0 ? open : undefined}
        aria-label={answers.length > 0 ? `Ask ${character.name}` : `Say hi to ${character.name}`}
        onClick={onTap}
        className={`cmp-button ${open || walkMs !== null || awake || waving ? 'is-up' : ''}`}
        style={{ width: size, height: size * 1.25 }}
      >
        <span className="cmp-facing" style={{ transform: `scaleX(${facing})` }}>
          <span className={`cmp-trick ${trick ? `cmp-trick-${trick}` : ''}`}>
            <Figure character={character} mood={mood} look={{ x: look.x * facing, y: look.y }} />
          </span>
        </span>
      </button>
    </div>
  )
}
