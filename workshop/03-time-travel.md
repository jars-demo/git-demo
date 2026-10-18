# Time travel

> Every commit is still there. Read the past, compare it with now, and bring back what was lost without pretending it never left.

**Time:** 15 minutes

## Goal

Read history, see exactly what a commit changed, and undo one old commit safely.

## Read the past

```bash
git log --oneline          # one line per commit, newest first
git show 21683d2           # what that commit changed
git diff eb1bf5a HEAD      # everything between then and now
git log -p README.md       # every change to one file
```

In quest 03, `git log --oneline` shows this. The hashes are the same on every machine, because HEAD the cat wrote the history at fixed times:

```text
9baebff Add the nap plan
21683d2 Tidy the README
36d0e1b Add the toy list
eb1bf5a Write the house rules
```

A short hash like `21683d2` is enough to name a commit. `HEAD~1` means "one before HEAD", and `HEAD~2` two before.

## Two ways to bring something back

**Revert a commit.** `git revert <commit>` makes a **new** commit that does the opposite. History stays as it was, plus one honest commit that says "this was undone". Safe on shared branches.

**Restore a file.** `git restore --source <commit> README.md` puts one file back as it was in that commit, in your working tree. Then you commit it like any change.

Never "go back" by deleting history on a branch other people use. Chapter 07 covers when rewriting is fine.

## Quest 03

```bash
quest start 3
```

Somebody "tidied" the README, and rule 3 vanished. Find the commit that removed it, and bring it back with a new commit. Keep `naps.txt` and the rest of history as they are. Then `quest check`.

## Check it works

- `README.md` has rule 3 again, and `git log --oneline` shows all four old commits plus yours.
- `quest check` passes.

## Exercise

Do the quest twice: once with `git revert`, once with `git restore --source`. Start over with `quest start 3` between them. Compare the two results with `git log -p -1`. When would you choose each?

### More to try

- `git switch --detach eb1bf5a` lets you look around an old commit. Run `git status`: git calls this "detached HEAD". Come back with `git switch main`.
- `git log -S "keyboard"` finds commits that added or removed that word. Try it on the quest.
