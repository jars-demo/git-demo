# Remotes and the GitHub flow

> A remote is another copy of the repository, usually on GitHub. Push your commits up, pull other people's down, and learn why a push gets rejected.

**Time:** 15 minutes

## Goal

Understand `origin`, fetch, pull and push, fix a rejected push without a mess, and know the pull request flow.

## Remotes in one table

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `git clone URL`     | copy a repository, and remember it as `origin`                 |
| `git fetch`         | download new commits from `origin`; change nothing of yours    |
| `git pull`          | fetch, then merge `origin/main` into your `main`               |
| `git pull --rebase` | fetch, then replay your new commits on top of `origin/main`    |
| `git push`          | send your commits up; only works if you have everything it has |

`origin/main` is your copy of where `main` was on `origin` the last time you fetched. `git status` compares the two: "ahead by 1" means you have a commit to push.

## Quest 06

The quest has a real remote, `origin.git`, a folder playing the part of GitHub. Your teammate pushed a commit after you cloned, and you made a commit too.

```bash
quest start 6
```

Go into the `laptop` folder inside it and push:

```text
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to '.../git-good/06-remotes/origin.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
```

Git refuses to throw away your teammate's work. Get it first with `git pull --rebase`, which puts your commit after theirs in a straight line, then push. Look at `git log --oneline --graph --all` before and after. Then `quest check`.

## The GitHub flow

How most teams work on GitHub:

1. Pull `main`, then make a branch: `git switch -c add-cat-facts`.
2. Commit in small steps, and push the branch: `git push -u origin add-cat-facts`.
3. Open a **pull request**: on github.com, or with `gh pr create` from the GitHub CLI.
4. Teammates review the diff and comment; CI runs the tests; you push fixes to the same branch.
5. Merge on GitHub, then `git switch main` and `git pull`.

## Check it works

- `origin.git` has both commits in a straight line, and your laptop matches it.
- `quest check` passes.

## Exercise

Start the quest again and fix it with plain `git pull` instead. Draw the graph: where did the merge commit come from? Then set `git config --global pull.rebase true` if you prefer straight lines.

### More to try

- `git remote -v` shows where `origin` points. Add a second remote with `git remote add`.
- `git fetch`, then `git log main..origin/main` lists what is waiting for you before you pull.
