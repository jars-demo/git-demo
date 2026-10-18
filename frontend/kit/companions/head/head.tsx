import type { CharacterDefinition } from '../../core/types'

// HEAD: a small white cat who always knows where you are, like git's HEAD.
// Body only; the kit draws the eyes, mouth, arms and legs at the points below.

export const head: CharacterDefinition = {
  id: 'head',
  name: 'HEAD',
  tagline: 'A small cat who always knows where you are.',
  personality: 'Curious, a little smug, never loses a commit.',
  palette: { body: '#f0f3f6', ink: '#0d1117', cheek: '#ff8182', accent: '#f0883e' },
  body: (p) => (
    <>
      {/* The tail, behind everything: an ink outline with the body colour inside. */}
      <path
        d="M96 122c22-4 24-30 10-42"
        fill="none"
        stroke={p.ink}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M96 122c22-4 24-30 10-42"
        fill="none"
        stroke={p.body}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Ears, then the round body over their bases. */}
      <path
        d="M24 66 31 24 56 48Z"
        fill={p.body}
        stroke={p.ink}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M96 66 89 24 64 48Z"
        fill={p.body}
        stroke={p.ink}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M32 54 35 36 46 47Z" fill={p.cheek} opacity="0.7" />
      <path d="M88 54 85 36 74 47Z" fill={p.cheek} opacity="0.7" />
      <ellipse cx="60" cy="90" rx="43" ry="43" fill={p.body} stroke={p.ink} strokeWidth="3.5" />
      {/* Tabby stripes on the forehead. */}
      <path
        d="M52 52l2 9M60 50v10M68 52l-2 9"
        stroke={p.ink}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Whiskers. */}
      <path
        d="M30 96l-16-3M30 102l-16 2M90 96l16-3M90 102l16 2"
        stroke={p.ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* A collar with a little tag. */}
      <path d="M30 116q30 16 60 0" fill="none" stroke={p.accent} strokeWidth="6" />
      <circle cx="60" cy="125" r="5" fill="#f9c513" stroke={p.ink} strokeWidth="2" />
    </>
  ),
  face: { leftEye: [47, 84], rightEye: [73, 84], mouth: [60, 98] },
  arms: { left: [18, 100], right: [102, 100] },
  legs: { left: [46, 131], right: [74, 131] },
}
