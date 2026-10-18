import type { CharacterDefinition, Trick } from './types'

// Pure behaviour rules: where to stroll, how long it takes, where to look, when to act next.
// No DOM and no timers here, so every rule is unit tested. Randomness is injected.

export type Random = () => number

export type Bounds = { min: number; max: number }

export const TRICKS: readonly Trick[] = ['flip', 'spin', 'jump']

/** The horizontal range a companion may stand in, keeping clear of a corner on the far side. */
export function strollBounds(viewportWidth: number, companionWidth: number, avoid = 80): Bounds {
  const min = viewportWidth < 640 ? 10 : 24
  return { min, max: Math.max(min, viewportWidth - companionWidth - avoid) }
}

/**
 * Picks somewhere new to walk to. Always at least `minStep` pixels away when the range allows,
 * so a stroll is never a shuffle on the spot. Returns null when there is no room to stroll.
 */
export function pickStrollTarget(
  current: number,
  bounds: Bounds,
  random: Random,
  minStep = 140,
): number | null {
  const span = bounds.max - bounds.min
  if (span < minStep) return null
  let target = bounds.min + random() * span
  if (Math.abs(target - current) < minStep) {
    const middle = (bounds.min + bounds.max) / 2
    target = current > middle ? bounds.min + random() * 60 : bounds.max - random() * 60
  }
  return Math.round(Math.min(Math.max(target, bounds.min), bounds.max))
}

/** Milliseconds to walk a distance at a steady pace. */
export function walkDuration(from: number, to: number, pixelsPerSecond = 120): number {
  return Math.round((Math.abs(to - from) / pixelsPerSecond) * 1000)
}

/** Unit vector from the companion's eyes towards the pointer; (0, 0) when they overlap. */
export function lookVector(
  eyes: { x: number; y: number },
  pointer: { x: number; y: number },
): { x: number; y: number } {
  const dx = pointer.x - eyes.x
  const dy = pointer.y - eyes.y
  const length = Math.hypot(dx, dy)
  if (length < 1) return { x: 0, y: 0 }
  return { x: dx / length, y: dy / length }
}

/** Delay before the next stroll: calm, irregular, never constant motion. */
export function nextStrollDelay(random: Random, min = 12_000, spread = 14_000): number {
  return Math.round(min + random() * spread)
}

/** Usually a trick after a stroll, sometimes none, so it stays a surprise. */
export function pickTrick(random: Random, chance = 0.7): Trick | null {
  if (random() >= chance) return null
  return TRICKS[Math.floor(random() * TRICKS.length)] ?? null
}

/** Checks a character definition before it is used, so a typo fails loudly in tests. */
export function validateCharacter(character: CharacterDefinition): string[] {
  const problems: string[] = []
  if (!/^[a-z][a-z0-9-]*$/.test(character.id))
    problems.push('id must be lowercase letters, digits or -')
  if (!character.name.trim()) problems.push('name is empty')
  const points = [
    character.face.leftEye,
    character.face.rightEye,
    character.face.mouth,
    character.arms.left,
    character.arms.right,
    character.legs.left,
    character.legs.right,
  ]
  for (const [x, y] of points) {
    if (x < 0 || x > 120 || y < 0 || y > 160)
      problems.push(`point ${x},${y} is outside the viewBox`)
  }
  if (character.face.leftEye[0] >= character.face.rightEye[0]) {
    problems.push('left eye must be left of the right eye')
  }
  return problems
}
