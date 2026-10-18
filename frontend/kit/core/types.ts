import type { ReactNode } from 'react'

// The shape every companion character follows. A character only draws its body and says where
// its face and limbs attach; the kit draws eyes, mouth, arms and legs, and animates them.
// All coordinates are in a 120 x 160 viewBox. Keep the body between y = 10 and y = 136 so the
// legs (drawn from y = 136 to 154) stay visible.

export type Point = readonly [x: number, y: number]

export type CharacterPalette = {
  /** Body fill. */
  body: string
  /** Outline, eyes, limbs and mouth. */
  ink: string
  /** Cheek blush. */
  cheek: string
  /** Accent used by the character's own details. */
  accent: string
}

export type CharacterDefinition = {
  /** Unique, lowercase, used in URLs and props. */
  id: string
  name: string
  /** One short line shown in the directory. */
  tagline: string
  /** A few words on how it behaves, for people choosing one. */
  personality: string
  palette: CharacterPalette
  /** The body and its details, drawn in the 120 x 160 viewBox. */
  body: (palette: CharacterPalette) => ReactNode
  face: { leftEye: Point; rightEye: Point; mouth: Point }
  /** Where the arms join the body. Arms are drawn outward from these points. */
  arms: { left: Point; right: Point }
  /** Where the legs join the body. Legs are drawn downward from these points. */
  legs: { left: Point; right: Point }
}

export type CompanionAnswer = { question: string; answer: string }

export type Trick = 'flip' | 'spin' | 'jump'

export type Mood = 'idle' | 'walking' | 'waving'
