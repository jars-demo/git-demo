# Branches

> A branch is just a name that points at a commit. That is why they are cheap, fast and nothing to be scared of.

**Time:** 15 minutes

## Goal

Make branches, switch between them, see history as a graph, and merge.

## A branch is a sticky note

`main` is a label on one commit. When you commit on `main`, the label moves to the new commit. A new branch is a new label; HEAD says which label you are carrying.

```bash
git branch                       # list branches; * marks yours
git switch -c nap-time           # create a branch here and move onto it
git switch main                  # move back
git log --oneline --graph --all  # every branch, drawn as a graph
```

Make `git log --oneline --graph --all` a habit. It turns branches from a mystery into a picture.

## Two kinds of merge

`git merge treats` brings the commits of `treats` into the branch you are on.

- **Fast-forward.** If your branch has not moved since `treats` started, git just slides your label forward. No new commit.
- **Three-way merge.** If both branches have new commits, git makes a **merge commit** with two parents, joining the lines in the graph.

## Quest 04

```bash
quest start 4
```

The `treats` branch is ready. Then HEAD wants to plan nap time on a branch of her own:

1. Merge `treats` into `main`.
2. Make a branch called `nap-time`, and commit something on it.
3. Merge `nap-time` into `main`, and finish on `main`.

Draw the graph after every step. Then `quest check`.

## Check it works

- `git log --oneline --graph --all` shows both branches inside `main`.
- `quest check` passes.

## Exercise

Make a commit on `main` and another on a new branch, so both have moved, then merge. Look at the graph: there is your three-way merge commit, with two parents. `git show --format=%P -s HEAD` prints them.

### More to try

- Delete a merged branch with `git branch -d nap-time`. The commits stay; only the label goes.
- Try `git merge --no-ff` on a fast-forward. When would a team want that?
