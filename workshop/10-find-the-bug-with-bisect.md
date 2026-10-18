# Find the bug with bisect

> Forty commits ago it worked. Now it does not. Git can find the exact commit that broke it in about six steps, and it can do the steps for you.

**Time:** 15 minutes

## Goal

Binary-search history with `git bisect`, by hand and with a script, and name the commit that broke things.

## Halving the haystack

Tell git one commit that is **good** and one that is **bad**. It checks out the commit halfway between and asks you which it is. Each answer halves what is left: 40 commits take about six answers, a thousand take about ten.

```bash
git bisect start
git bisect bad              # the commit you are on is broken
git bisect good <hash>      # this old one worked
# git checks out a commit halfway: test it, then say
git bisect good             # or: git bisect bad
git bisect reset            # done: back to where you started
```

## Let a script answer

If a command can tell good from bad by its exit code (0 for good, anything from 1 to 127 except 125 for bad), git can run the whole search alone:

```bash
git bisect run sh check.sh
```

Any test command works: `npm test`, `pytest tests/test_naps.py`, or a three-line script.

## Quest 10

```bash
quest start 10
```

Forty commits of purring, and somewhere HEAD started hissing. `check.sh` passes while `purr.txt` has no hiss in it. Every commit has the same message, so reading the log will not help. Find the first commit where `check.sh` fails, put a branch called `culprit` on it, and finish the bisect.

Start with the newest commit as bad and the first commit as good:

```bash
git bisect start HEAD $(git rev-list --max-parents=0 HEAD)
git bisect run sh check.sh
```

This works the same in PowerShell. Git answers:

```text
Bisecting: 19 revisions left to test after this (roughly 4 steps)
...
1d035425aadde61fcca1784ebfce810594897d8d is the first bad commit
```

The hash is the same for everyone. Then `git branch culprit <hash>`, `git bisect reset`, and `quest check`.

## Check it works

- `culprit` points at `1d03542`, and `git show culprit` adds the hiss.
- `quest check` passes.

## Exercise

Start the quest again and bisect by hand: answer `git bisect good` or `git bisect bad` yourself after running `sh check.sh` (or reading `purr.txt`). Count your steps. Did you beat six?

### More to try

- `git log -S hiss --oneline` finds the commit that added the word, without bisect. When does bisect win anyway? (Think: a bug, not a word.)
- If a commit cannot be tested, `git bisect skip` moves on.
