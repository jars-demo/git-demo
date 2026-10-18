'use client'

import { useMemo, useSyncExternalStore } from 'react'

// Which quests this visitor has marked done. Kept in this browser only, as a convenience: it
// never leaves the device, and the page works the same without it.

const KEY = 'git-good:done'
const EVENT = 'git-good:done'

function read(): string {
  try {
    return window.localStorage.getItem(KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function parseDone(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) ? value.filter((n): n is string => typeof n === 'string') : []
  } catch {
    return []
  }
}

export function useDone(): ReadonlySet<string> {
  const raw = useSyncExternalStore(subscribe, read, () => '[]')
  return useMemo(() => new Set(parseDone(raw)), [raw])
}

export function toggleDone(number: string) {
  const done = new Set(parseDone(read()))
  if (done.has(number)) done.delete(number)
  else done.add(number)
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...done].sort()))
  } catch {
    // Storage blocked: nothing to keep, and nothing breaks.
  }
  window.dispatchEvent(new Event(EVENT))
}
