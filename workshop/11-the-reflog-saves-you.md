# The reflog saves you

> Deleted a branch? Reset too far? Rebased into a mess? Git quietly wrote down everywhere HEAD has been. Your "lost" commits are almost certainly still there.

**Time:** 12 minutes

## Goal

Read the reflog, find commits no branch points at, and bring them back.

## Git's diary

Every time HEAD moves (a commit, a switch, a reset, a rebase), git writes a line in the **reflog**. It is local to your machine and kept for months: 90 days for most entries, and 30 for commits no branch can reach any more.

```bash
git reflog
```

In quest 11 it shows:

```text
730017c HEAD@{0}: checkout: moving from secret-recipe to main
3a3f932 HEAD@{1}: commit: Write step 3
8ffd2e3 HEAD@{2}: commit: Write step 2
355a4c6 HEAD@{3}: commit: Write step 1
730017c HEAD@{4}: checkout: moving from main to secret-recipe
730017c HEAD@{5}: commit (initial): Start the recipe book
```

Read it from the bottom up: a branch was made, three steps were committed, then someone went back to `main` and deleted `secret-recipe`. The commits did not go anywhere. Only the label did.

## Bring them back

Put a new label on the lost commit:

```bash
git branch rescued 3a3f932
```

`HEAD@{1}` works too: it means "where HEAD was one move ago". Undoing a bad `git reset --hard` is the same move: find the line before the reset, and `git reset --hard` back to it.

## Quest 11

```bash
quest start 11
```

Someone deleted the `secret-recipe` branch with three commits on it. Find them in the reflog and put them on a branch called `rescued`. Then `quest check`.

## Check it works

- `git log --oneline rescued` shows all three recipe steps.
- `quest check` passes.

## Exercise

Make it harder on purpose: on `rescued`, run `git reset --hard HEAD~2`, so two steps vanish. Then use `git reflog` to undo your reset. Breathe easier next time you reset.

### More to try

- `git reflog show rescued` shows one branch's own history.
- What can the reflog **not** save? Think about changes you never committed or stashed.
