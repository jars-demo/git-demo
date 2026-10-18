# Stash and switch

> Halfway through something, and an urgent fix lands. Put your work in a drawer, fix the fire, and pick up exactly where you left off.

**Time:** 12 minutes

## Goal

Set unfinished work aside without committing it, switch branches safely, and get the work back.

## The drawer

```bash
git stash                 # put your uncommitted changes away; the tree is clean again
git stash list            # what is in the drawer
git stash pop             # take the newest back out, and remove it from the drawer
git stash apply           # take it back out, but keep a copy in the drawer
git stash push -m "sisal rope, half done"   # stash with a note
```

Git will not let you switch branches if your uncommitted changes would be overwritten. Stash first, or commit to your branch first. Both are fine. A stash is quicker for minutes; a commit is safer for days.

## Quest 08

```bash
quest start 8
```

You are on `scratching-post`, halfway through adding a sisal rope. Then the README on `main` turns out to say "teh cat".

1. Stash your work.
2. Switch to `main`, fix the typo, and commit.
3. Switch back to `scratching-post` and pop your work.

Then `quest check`.

## Check it works

- `main` has your fix, you are on `scratching-post`, and `git diff` shows the sisal rope again.
- `git stash list` is empty, and `quest check` passes.

## Exercise

Stash twice with notes, then `git stash list`. Pop the older one with `git stash pop stash@{1}`. Which one is `stash@{0}`?

### More to try

- `git stash -u` also stashes new, untracked files. Make one and see what plain `git stash` does with it.
- Chapter 12 shows `git worktree`: a second folder on another branch, so you never need to stash at all.
