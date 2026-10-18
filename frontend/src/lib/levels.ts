// Three levels, drawn as branches of one history. Basics live on main; each later level forks
// off main and merges back, like a feature branch.

export type Level = {
  id: 'basics' | 'intermediate' | 'advanced'
  name: string
  branch: string
  blurb: string
  color: string
  numbers: readonly string[]
}

export const LEVELS: readonly Level[] = [
  {
    id: 'basics',
    name: 'Basics',
    branch: 'main',
    blurb: 'Commits, history, branches.',
    color: '#58a6ff',
    numbers: ['01', '02', '03', '04'],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    branch: 'level/intermediate',
    blurb: 'Conflicts, remotes, undo, stash.',
    color: '#f0883e',
    numbers: ['05', '06', '07', '08'],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    branch: 'level/advanced',
    blurb: 'Rebase, bisect, reflog, AI agents.',
    color: '#a371f7',
    numbers: ['09', '10', '11', '12'],
  },
]

export function levelOf(number: string): Level {
  return LEVELS.find((level) => level.numbers.includes(number)) ?? LEVELS[0]!
}

export const REPO_URL = 'https://github.com/jars-demo/git-demo'
