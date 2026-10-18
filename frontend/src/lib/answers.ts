import type { CompanionAnswer } from '@kit/core/types'

// HEAD's answers. Short, true, and each points at the chapter that explains more.

export const HEAD_ANSWERS: readonly CompanionAnswer[] = [
  {
    question: 'Why are you called HEAD?',
    answer:
      'In git, HEAD points at the commit you are on right now. I am the cat who always knows where you are. Chapter 01.',
  },
  {
    question: 'How do I undo my last commit?',
    answer:
      'Not pushed yet: git reset --soft HEAD~1 keeps your changes. Already pushed: git revert HEAD adds an undo commit. Chapter 07.',
  },
  {
    question: 'I committed to the wrong branch!',
    answer:
      'Not pushed? git branch right-branch to keep it, then git reset --hard HEAD~1 here. Check git status first. Chapter 07.',
  },
  {
    question: "Help, I'm in a merge conflict.",
    answer:
      'Breathe. Open the file, keep what is right, delete the markers, git add it, git commit. Or git merge --abort. Chapter 05.',
  },
  {
    question: 'I lost my work.',
    answer: 'If you ever committed or stashed it, git reflog still knows where it is. Chapter 11.',
  },
  {
    question: 'What should I run when I am confused?',
    answer: 'git status. It says where you are and what to do next. I run it every few minutes.',
  },
]
