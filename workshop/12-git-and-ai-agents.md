# Git and AI agents

> Coding agents write a lot of code, fast. Git is how you stay in charge: review what they did, keep what is good, split it into honest commits, and give each agent its own desk.

**Time:** 18 minutes

## Goal

Review an agent's changes with git, commit them in clean pieces, keep junk and secrets out, and run two agents side by side with worktrees.

## Before the agent starts

- **Start clean.** Commit or stash first, so `git diff` afterwards shows only the agent's work.
- **Give it a branch.** `git switch -c agent/cat-facts`. If it goes badly, `main` never knew.
- **Ignore what must not be committed.** `.env`, logs, build output. Agents create files you did not ask for.

## After the agent finishes

Review like you review a teammate, because you are the one who signs the commit:

```bash
git status                # which files it touched, and which it created
git diff --stat           # how much, per file
git diff                  # every line
git add -p                # stage hunk by hunk, saying yes only to what you understand
git restore file.py       # throw away a file's changes you do not want
```

If the whole attempt is wrong, `git restore .` and `git clean -n` (a dry run, then `-f`) take you back to clean. Cheap retries are the point of starting clean.

Then commit in pieces, one idea per commit, as in chapter 02. Small commits make agent work reviewable, revertable and bisectable.

## One desk per agent: worktrees

A **worktree** is a second folder checked out from the same repository, on its own branch. Two agents, two folders, no stashing, no stepping on each other:

```bash
git worktree add -b agent-b ../agent-b   # a new folder on a new branch
git worktree list                        # every desk
git worktree remove ../agent-b           # tidy up when the branch is merged
```

Each worktree has its own files and its own HEAD, and they share history. Commit in one and the other can see it at once.

## Quest 12

```bash
quest start 12
```

An agent was asked to add a cat facts page and tidy the CSS. It did both, and left a debug log behind. Nothing is committed. Inside the `app` folder:

1. Commit the feature on its own: `facts.py` and `routes.py`.
2. Commit the CSS tidy-up on its own.
3. Never commit `agent-debug.log`: make git ignore it.
4. Add a worktree on a new branch `agent-b` next to `app`, for a second agent.

Then `quest check`.

## Check it works

- `git log --stat` shows the feature and the CSS in separate commits, and no log file.
- `git worktree list` shows two folders, and `quest check` passes.

## Exercise

Take a real change an AI agent made in one of your projects, or ask one for a small change now. Before committing, write down three things `git diff` showed you that the agent's own summary did not mention. Then commit it in at least two pieces.

### More to try

- Some agents add a `Co-authored-by:` line to commits. Look up trailers with `git interpret-trailers`, and decide your team's rule.
- A pre-commit hook can block secrets before they are committed. Read `.git/hooks/pre-commit.sample`, then look at tools like gitleaks.
