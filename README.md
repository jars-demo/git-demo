# Git good

A playful, hands-on Git workshop with **HEAD the cat**. Twelve quests in three levels: each builds a real repository with a real problem, you fix it with real git, and `quest check` tells you when you got it. From your first commit to merge conflicts, rebase, bisect, the reflog, and keeping AI agents in line.

**Workshop site:** [git.jishanahmed.in](https://git.jishanahmed.in)

## Quick start

You need [git](https://git-scm.com/downloads) and [uv](https://docs.astral.sh/uv/).

```bash
git clone https://github.com/jars-demo/git-demo.git
cd git-demo/lab
uv tool install --editable .
quest start 1
```

Quests are built in `~/git-good`, outside this repository. Inside a quest folder, `quest check` checks your fix and `quest hint` gives a nudge. Remove the command with `uv tool uninstall git-good-lab`.

## The quests

| Level        | #   | Quest                                                               | You learn                                    |
| ------------ | --- | ------------------------------------------------------------------- | -------------------------------------------- |
| Basics       | 01  | [Hello, HEAD](workshop/01-hello-head.md)                            | what git keeps, init, config, first commit   |
|              | 02  | [Stage and commit](workshop/02-stage-and-commit.md)                 | status, diff, the staging area, good commits |
|              | 03  | [Time travel](workshop/03-time-travel.md)                           | log, show, revert, restore                   |
|              | 04  | [Branches](workshop/04-branches.md)                                 | switch, merge, fast-forward, the graph       |
| Intermediate | 05  | [Merge conflicts](workshop/05-merge-conflicts.md)                   | conflict markers, resolve, abort             |
|              | 06  | [Remotes and the GitHub flow](workshop/06-remotes.md)               | fetch, pull --rebase, push, pull requests    |
|              | 07  | [Undo anything](workshop/07-undo-anything.md)                       | restore, reset, amend, secrets               |
|              | 08  | [Stash and switch](workshop/08-stash-and-switch.md)                 | stash, pop, switching safely                 |
| Advanced     | 09  | [Rewrite history](workshop/09-rewrite-history.md)                   | interactive rebase: squash, fixup, reword    |
|              | 10  | [Find the bug with bisect](workshop/10-find-the-bug-with-bisect.md) | bisect by hand and with bisect run           |
|              | 11  | [The reflog saves you](workshop/11-the-reflog-saves-you.md)         | finding and rescuing lost commits            |
|              | 12  | [Git and AI agents](workshop/12-git-and-ai-agents.md)               | reviewing agent diffs, add -p, worktrees     |

## Layout

```text
lab/quest/quests.py   the twelve quests: how each repository is built, and how it is checked
lab/quest/repo.py     a thin wrapper around the real git command
lab/quest/__main__.py the quest command: list, start, check, hint
lab/tests/            solves every quest with real git (the answers, if you are truly stuck)
workshop/             the chapters, in Markdown
frontend/             the workshop site (Next.js), with HEAD the cat from the Companion Kit
```

Quest history is written by HEAD at fixed times, so every learner sees the same commit hashes. Run the lab's tests with `cd lab && uv run pytest`.

## Run the site locally

```bash
cd frontend
npm ci
npm run dev
```

## License

[MIT](LICENSE)
