'use client'

import { usePathname } from 'next/navigation'

import { head } from '@kit/companions/head/head'
import { Companion } from '@kit/react/Companion'

import { HEAD_ANSWERS } from '@/lib/answers'

// HEAD the cat, from the Companion Kit. Her answers are fixed, so she never makes anything up.

export function HeadCompanion() {
  const pathname = usePathname()
  return (
    <Companion
      character={head}
      answers={HEAD_ANSWERS}
      greeting="Hi, I'm HEAD. I always know where you are."
      routeKey={pathname}
      size={76}
    />
  )
}
