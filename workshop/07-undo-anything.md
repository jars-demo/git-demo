# Undo anything

> Almost everything in git can be undone. The trick is knowing which undo fits: has the mistake been committed, and has it been pushed?

**Time:** 15 minutes

## Goal

Pick the right undo for each mistake, fix your last commit, and keep a secret out of history.

## The undo map

| You want to undo                      | Command                     |
| ------------------------------------- | --------------------------- |
| changes to a file you have not staged | `git restore file`          |
| staging a file (keep the changes)     | `git restore --staged file` |
| the last commit's message or files    | `git commit --amend`        |
| the last commit, keeping its changes  | `git reset --soft HEAD~1`   |
| the last commit, and its changes      | `git reset --hard HEAD~1`   |
| a commit that is already pushed       | `git revert <commit>`       |

`git restore file` and `git reset --hard` throw changes away for good, so run `git status` and `git diff` first. Everything else keeps your work.

## The golden rule

**Rewrite only what you have not pushed.** Amending or resetting changes commit hashes. If others already have the old commits, rewriting splits history between you. On your own branch, before review, rewrite freely. If you must push a rewrite of your own branch, use `git push --force-with-lease`, which refuses if someone else pushed in the meantime.

## Secrets

Committed a key or password? Removing the file in a new commit is not enough: it is still in history. If it was never pushed, rewrite the commit, as in this quest. If it was pushed, **rotate the secret first**: treat it as leaked, make a new one, and only then clean history. Then add the file to `.gitignore`, so it cannot happen again. AI agents read and write `.env` files too, which makes this mistake more common, not less.

## Quest 07

```bash
quest start 7
```

The last commit has a typo in its message, "Add feeding schedul", and a secret in `.env`. It is not pushed. Fix it so there is still one commit, with the message `Add feeding schedule`, with `feeding.txt` and without `.env`. Then make sure `.env` is ignored. Then `quest check`.

## Check it works

- `git show --stat` lists `feeding.txt` and `.gitignore`, not `.env`, under the right message.
- `quest check` passes.

## Exercise

Make a throwaway commit, then try `reset --soft`, `reset --mixed` (the default) and `reset --hard` on it in turn. After each, run `git status`. Where did your change go each time?

### More to try

- `git commit --amend --no-edit` adds staged changes to the last commit without touching the message.
- Look up `git rm --cached`. Why does the quest need it, when `.gitignore` alone does not help?
