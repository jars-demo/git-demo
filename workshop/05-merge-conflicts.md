# Merge conflicts

> Two branches changed the same line, and git will not guess who is right. A conflict is not an error. It is git asking you a question.

**Time:** 15 minutes

## Goal

Read conflict markers, resolve a conflict calmly, finish the merge, and know how to back out.

## When git asks

Git merges changes to different lines on its own. When both branches changed the **same** lines, it stops and marks the file:

```text
<<<<<<< HEAD
The cat is called Mittens.
=======
The cat is called HEAD.
>>>>>>> rename
She likes boxes.
```

Between `<<<<<<< HEAD` and `=======` is your side: the branch you are on. Yes, that is her name in the marker; she did not plan it. Between `=======` and `>>>>>>> rename` is the branch you are merging in. Everything outside the markers merged fine.

## Resolve it

1. `git status` lists the files in conflict ("both modified").
2. Edit each one: keep what is right, which can be one side, the other, or a mix. Delete all three marker lines.
3. `git add` the file to mark it resolved.
4. `git commit` to finish the merge. Git writes the message for you.

Changed your mind halfway? `git merge --abort` puts everything back as it was before the merge.

## Quest 05

```bash
quest start 5
```

`main` calls the cat Mittens. The `rename` branch calls her HEAD. Merge `rename` into `main`, and resolve the conflict so the cat is called HEAD. Then `quest check`.

## Check it works

- `name.txt` has no markers and says `The cat is called HEAD.`
- `git log --oneline --graph` shows a merge commit joining both branches, and `quest check` passes.

## Exercise

Start the quest again and resolve it the other way: keep Mittens. Then run `git merge --abort` in the middle of another try and check with `git status` that nothing changed. Knowing the exit is half the confidence.

### More to try

- `git config --global merge.conflictStyle zdiff3` also shows the original line, from before either side changed it. Try the quest with it on.
- Editors such as VS Code show buttons over each conflict: "Accept Current", "Accept Incoming", "Accept Both". Match each to the markers.
