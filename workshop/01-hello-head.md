# Hello, HEAD

> Meet git, meet HEAD the cat, and make your very first commit. Git is a camera for folders, and you are about to take the first photo.

**Time:** 12 minutes

## Goal

Install the tools, understand what git keeps, tell git who you are, and turn a folder into a repository with one commit in it.

## What git is

Git takes **snapshots** of a folder. Each snapshot is a **commit**: every file as it was, who saved it, when, why, and which commit came before. Commits link into a history you can read, compare, undo and share.

Three places matter, and every git command moves things between them:

| Place                | What it is                                      |
| -------------------- | ----------------------------------------------- |
| the **working tree** | your files, as you edit them                    |
| the **staging area** | what will go into the next commit (the "index") |
| the **repository**   | every commit, kept in the hidden `.git` folder  |

And **HEAD** is git's name for "where you are right now": the commit you are standing on. Our cat is named after it. She always knows where you are.

## Set up

You need [git](https://git-scm.com/downloads), [uv](https://docs.astral.sh/uv/) and a terminal. Check git:

```bash
git --version
```

Get the workshop and install the `quest` command, which builds real repositories with real problems for you to fix:

```bash
git clone https://github.com/jars-demo/git-demo.git
cd git-demo/lab
uv tool install --editable .
```

Quests live in a `git-good` folder in your home directory, away from everything else. Remove the command later with `uv tool uninstall git-good-lab`.

## Tell git who you are

Every commit records a name and an email. Set them once for your machine, and pick `main` as the name of the first branch:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

Use the email of your GitHub account if you have one, so your commits link to you.

## Quest 01

```bash
quest start 1
```

```text
 /\_/\
( o.o )  HEAD the cat wrote a file about herself. Nothing is saved yet: there is no repository.
 > ^ <

  [ ] Turn this folder into a git repository.
  [ ] Tell git your name and email.
  [ ] Commit cat.txt.
```

Go into the folder it prints, then:

```bash
git init
git status
git add cat.txt
git status
git commit -m "Introduce HEAD"
git log
```

Run `git status` between every step. It is the most useful command in git: it always tells you where things are and what to do next. Then check your work:

```bash
quest check
```

## Check it works

- `quest check` shows five `PASS` lines and HEAD purrs.
- `git log` shows one commit with your name on it.

## Exercise

Change `cat.txt`, then run `git status` and `git diff`. Read what they say, then commit the change with a message that says why, not just what.

### More to try

- Look inside `.git`. Find `HEAD` (a text file) and read it. What does it point at?
- Run `quest list` to see every quest. Twelve to go. Well, eleven.
