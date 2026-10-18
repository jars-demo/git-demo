# AGENTS.md

Guidance for AI coding agents and developers. Humans: start with [README.md](README.md).

## What this is

"Git good": a twelve-quest Git workshop. `lab/` builds real repositories with real problems and
checks the fix; `workshop/` holds the chapters; `frontend/` is the site, with HEAD the cat built
on the Companion Kit in `frontend/kit/`.

## Map

```text
lab/quest/quests.py       Quest(number, slug, title, story, goals, hints, setup, check)
lab/quest/repo.py         Repo: git wrapper; HEAD the cat commits at fixed times (stable hashes)
lab/quest/__main__.py     CLI; quests live in ~/git-good (GIT_GOOD_HOME overrides)
lab/tests/test_quests.py  every quest starts unsolved and a real solution passes
frontend/kit/             Companion Kit core and React parts, plus kit/companions/head/
frontend/src/lib/         chapters, levels, HEAD's fixed answers, progress (localStorage)
frontend/src/components/  CommitGraph, Squares, ChapterTree, QuestBox, HeadCompanion
```

## Commands

```bash
cd lab && uv sync && uv run pytest && uv run ruff check .
cd frontend && npm ci && npm run verify
```

## Rules

1. **Standard library only** in `lab/`, plus the real `git` command.
2. **Every quest stays solvable.** Change a quest, update its solution in `lab/tests/`.
3. **Chapters quote real output.** Hashes in chapters come from the fixed quest history.
4. **HEAD's answers are fixed and true**, and each points at a chapter that exists.
5. **Writing style.** Plain English, short sentences, no em dashes. Conventional Commits, no AI
   attribution trailers.
