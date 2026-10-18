import type { CharacterDefinition, Mood } from '../core/types'

// Draws a character with the parts every companion shares: legs, arms, eyes, cheeks and mouth.
// Pure render: give it a mood and a look direction and it draws the right frame. The CSS in
// companion.css animates the classes it sets.

export function Figure({
  character,
  mood = 'idle',
  look = { x: 0, y: 0 },
  className = '',
}: {
  character: CharacterDefinition
  mood?: Mood
  look?: { x: number; y: number }
  className?: string
}) {
  const { palette: p, face, arms, legs } = character
  const walking = mood === 'walking'
  const waving = mood === 'waving'
  const [lx, ly] = arms.left
  const [rx, ry] = arms.right
  const [mx, my] = face.mouth

  return (
    <svg viewBox="0 0 120 160" className={`cmp-figure ${className}`} aria-hidden="true">
      <g className={walking ? 'cmp-legs-walk' : ''} stroke={p.ink} strokeWidth="4" fill="none">
        <path
          className="cmp-leg-a"
          style={{ transformOrigin: `${legs.left[0]}px ${legs.left[1]}px` }}
          d={`M${legs.left[0]} ${legs.left[1]} l-2 16 l-8 1`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="cmp-leg-b"
          style={{ transformOrigin: `${legs.right[0]}px ${legs.right[1]}px` }}
          d={`M${legs.right[0]} ${legs.right[1]} l2 16 l8 1`}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className={walking ? 'cmp-bob' : ''}>
        <path
          className={walking ? 'cmp-swing-late' : ''}
          style={{ transformOrigin: `${lx}px ${ly}px` }}
          d={`M${lx} ${ly} c-12 6 -16 16 -12 26`}
          fill="none"
          stroke={p.ink}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          className={waving ? 'cmp-wave' : walking ? 'cmp-swing' : ''}
          style={{ transformOrigin: `${rx}px ${ry}px` }}
          d={`M${rx} ${ry} c14 -8 20 -20 16 -32`}
          fill="none"
          stroke={p.ink}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {character.body(p)}
        <g className="cmp-blink" style={{ transformOrigin: `${mx}px ${face.leftEye[1]}px` }}>
          {[face.leftEye, face.rightEye].map(([ex, ey]) => (
            <g key={`${ex}-${ey}`}>
              <circle cx={ex} cy={ey} r="9.5" fill="#fff" />
              <circle cx={ex} cy={ey} r="7" fill={p.ink} />
              <circle cx={ex + 2 + look.x * 2.5} cy={ey - 3 + look.y * 2.5} r="2.5" fill="#fff" />
            </g>
          ))}
        </g>
        <circle cx={mx - 22} cy={my - 4} r="4" fill={p.cheek} opacity="0.4" />
        <circle cx={mx + 22} cy={my - 4} r="4" fill={p.cheek} opacity="0.4" />
        <path
          d={
            waving
              ? `M${mx - 10} ${my - 3} Q ${mx} ${my + 9} ${mx + 10} ${my - 3}`
              : `M${mx - 8} ${my - 2} Q ${mx} ${my + 5} ${mx + 8} ${my - 2}`
          }
          fill="none"
          stroke={p.ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
