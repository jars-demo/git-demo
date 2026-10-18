# Rewrite history

> Your branch says "wip", "fix", "wip again". Before anyone reviews it, tell the story you wish you had told, with an interactive rebase.

**Time:** 18 minutes

## Goal

Squash, reword and reorder commits on your own branch, and know when not to.

## Rebase in one picture

`git rebase main` takes your branch's commits and replays them, one by one, on top of `main`. The result has the same changes and new hashes. `git rebase -i main` does the same, but first opens a list where you decide what happens to each commit:

```text
pick 1a2b3c4 Add bowl
pick 2b3c4d5 wip
pick 3c4d5e6 fix typo
pick 4d5e6f7 Add water
pick 5e6f7a8 wip again
```

Change the word at the start of a line to choose:

| Word     | What happens                                        |
| -------- | --------------------------------------------------- |
| `pick`   | keep the commit as it is                            |
| `reword` | keep it, but edit its message                       |
| `squash` | melt it into the commit above, and combine messages |
| `fixup`  | melt it into the commit above, and drop its message |
| `drop`   | delete the commit                                   |

You can also move lines to reorder commits. Save and close the editor, and git does the rest. If anything goes wrong, `git rebase --abort` puts the branch back.

The hashes in the list above are only an example; yours will differ. Make sure git opens an editor you know: `git config --global core.editor "code --wait"` for VS Code, or `nano`.

## Quest 09

```bash
quest start 9
```

The `kitchen` branch has five messy commits. Tidy them into exactly two: one for `bowl.txt`, one for `water.txt`, with no "wip" or "fix" in any message. The files must end up exactly as they are now. Then `quest check`.

## The rule from chapter 07, again

Rewrite only commits you have not shared. Tidying your own branch before a pull request is good manners. Rebasing `main` after others pulled it is how teams lose an afternoon.

## Check it works

- `git log --oneline main..kitchen` shows two clean commits.
- `quest check` passes.

## Exercise

The same tidy-up has a second solution with no editor at all: `git reset --soft main`, then commit the files again in two steps. Start the quest over and do it that way. Which would you rather explain to a teammate?

### More to try

- Make a commit called `fixup! Add bowl` with `git commit --fixup <hash>`, then run `git rebase -i --autosquash main`. Watch git pre-arrange the list for you.
- A rebase can hit conflicts, one commit at a time. Resolve, `git add`, then `git rebase --continue`.
