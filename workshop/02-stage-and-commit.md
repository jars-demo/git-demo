# Stage and commit

> The staging area lets you choose exactly what goes into each commit. Small commits about one thing are the habit that makes everything else in git easy.

**Time:** 12 minutes

## Goal

Read what changed, stage only some of it, and make two commits that each say one thing.

## See what changed

```bash
git status            # which files changed
git diff              # the lines that changed, not yet staged
git diff --staged     # the lines that will go into the next commit
```

`git add` puts a file's current state on the stage. `git commit` saves exactly what is on the stage, nothing else. Change a file after staging it, and the commit gets the staged version: `git status` shows the file twice to warn you.

## One commit, one idea

A good commit is about one thing, and its message says why:

| Message                                 | Why it is good or bad                    |
| --------------------------------------- | ---------------------------------------- |
| `update stuff`                          | says nothing                             |
| `Add tuna to the dinner menu`           | one thing, in the imperative             |
| `Fix nap times shown in the wrong zone` | says what was wrong, so a reviewer knows |

This matters even more when an AI agent writes the code. Small commits are small diffs, and small diffs are what humans actually review.

## Quest 02

```bash
quest start 2
```

Three files changed while HEAD was napping: `naps.txt` is about sleep, and `menu.txt` and `toys.txt` are about her new things. Make one commit for each idea:

- commit `naps.txt` on its own
- commit `menu.txt` and `toys.txt` together

Use `git status`, `git add` with file names, and `git diff --staged` before each commit. Then `quest check`.

## Check it works

- `git log --oneline` shows your two new commits, each with a clear message.
- `quest check` passes.

## Exercise

Change two lines in one file, far apart. Stage only one of them with `git add -p` (patch mode): answer `y` for the hunk you want and `n` for the other. Commit, then look at `git status`. The other change is still waiting.

### More to try

- `git commit` with no `-m` opens your editor for a longer message: a short first line, a blank line, then the why. Try it.
- `git log --stat` shows which files each commit touched.
