"""Twelve quests. Each builds a real repository with a real problem, and checks your fix."""

import shutil
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from quest.repo import Repo

Check = tuple[str, bool]


@dataclass(frozen=True)
class Quest:
    number: int
    slug: str
    title: str
    story: str
    goals: list[str]
    hints: list[str]
    setup: Callable[[Path], None]
    check: Callable[[Path], list[Check]]

    @property
    def folder(self) -> str:
        return f"{self.number:02}-{self.slug}"


def start_tag(repo: Repo) -> None:
    repo.git("tag", "quest-start")


# 01 Hello, HEAD ------------------------------------------------------------------------------


def setup_01(path: Path) -> None:
    path.mkdir(parents=True)
    Repo(path).write("cat.txt", "Name: HEAD\nLikes: boxes, commits, sunny windows\n")


def check_01(path: Path) -> list[Check]:
    repo = Repo(path)
    real = repo.is_repo()
    return [
        ("this folder is a git repository", real),
        ("git knows your name", real and repo.git("config", "user.name", ok=True) != ""),
        ("there is at least one commit", real and repo.has("HEAD")),
        ("cat.txt is in that commit", real and "cat.txt" in repo.git("ls-files", ok=True)),
        ("nothing is left uncommitted", real and repo.clean()),
    ]


# 02 Stage and commit -------------------------------------------------------------------------


def setup_02(path: Path) -> None:
    repo = Repo(path).init()
    repo.write("menu.txt", "breakfast: biscuits\n")
    repo.write("toys.txt", "favourite: cardboard box\n")
    repo.commit("Start HEAD's house")
    start_tag(repo)
    repo.write("menu.txt", "breakfast: biscuits\ndinner: tuna\n")
    repo.write("toys.txt", "favourite: cardboard box\nnew: laser pointer\n")
    repo.write("naps.txt", "09:00 sunny window\n13:00 keyboard\n")


def check_02(path: Path) -> list[Check]:
    repo = Repo(path)
    new = repo.commits("quest-start..HEAD")
    touched = [repo.files(commit) for commit in new]
    return [
        ("exactly two new commits", len(new) == 2),
        ("one commit has only naps.txt", {"naps.txt"} in touched),
        ("one commit has menu.txt and toys.txt", {"menu.txt", "toys.txt"} in touched),
        ("nothing is left uncommitted", repo.clean()),
    ]


# 03 Time travel ------------------------------------------------------------------------------

RULE = "Rule 3: never sit on the keyboard during a deploy."


def setup_03(path: Path) -> None:
    repo = Repo(path).init()
    rules = f"# House rules\n\nRule 1: naps are sacred.\nRule 2: boxes are for sitting.\n{RULE}\n"
    repo.write("README.md", rules)
    repo.commit("Write the house rules")
    repo.write("toys.txt", "yarn\nbottle cap\n")
    repo.commit("Add the toy list")
    repo.write("README.md", rules.replace(RULE + "\n", ""))
    repo.commit("Tidy the README")
    repo.write("naps.txt", "all day\n")
    repo.commit("Add the nap plan")
    start_tag(repo)


def check_03(path: Path) -> list[Check]:
    repo = Repo(path)
    return [
        ("rule 3 is back in README.md", RULE in repo.read("README.md")),
        ("rule 3 is back in a new commit", RULE in repo.show("HEAD", "README.md")),
        ("history was not rewritten", repo.contains("quest-start")),
        ("naps.txt is still there", repo.show("HEAD", "naps.txt") != ""),
        ("nothing is left uncommitted", repo.clean()),
    ]


# 04 Branches ---------------------------------------------------------------------------------


def setup_04(path: Path) -> None:
    repo = Repo(path).init()
    repo.write("day.txt", "wake up\n")
    repo.commit("Plan the day")
    start_tag(repo)
    repo.git("switch", "-q", "-c", "treats")
    repo.write("treats.txt", "salmon\n")
    repo.commit("Add salmon treats")
    repo.write("treats.txt", "salmon\nchicken\n")
    repo.commit("Add chicken treats")
    repo.git("switch", "-q", "main")


def check_04(path: Path) -> list[Check]:
    repo = Repo(path)
    nap = repo.has("nap-time")
    return [
        ("main has the treats", repo.has("treats") and repo.contains("treats", "main")),
        ("a branch called nap-time exists", nap),
        (
            "nap-time has a commit of its own",
            nap
            and len(repo.commits("quest-start..nap-time")) > 0
            and not repo.contains("nap-time", "treats"),
        ),
        ("nap-time is merged into main", nap and repo.contains("nap-time", "main")),
        ("you are back on main", repo.branch() == "main"),
    ]


# 05 Merge conflicts --------------------------------------------------------------------------


def setup_05(path: Path) -> None:
    repo = Repo(path).init()
    repo.write("name.txt", "The cat is called Whiskers.\nShe likes boxes.\n")
    repo.commit("Name the cat")
    repo.git("switch", "-q", "-c", "rename")
    repo.write("name.txt", "The cat is called HEAD.\nShe likes boxes.\n")
    repo.commit("Call her HEAD")
    repo.git("switch", "-q", "main")
    repo.write("name.txt", "The cat is called Mittens.\nShe likes boxes.\n")
    repo.commit("Call her Mittens")
    start_tag(repo)


def check_05(path: Path) -> list[Check]:
    repo = Repo(path)
    text = repo.read("name.txt")
    parents = repo.parents("main")
    return [
        ("main has a merge commit", len(parents) == 2),
        ("the merge brought in rename", repo.has("rename") and repo.contains("rename", "main")),
        ("no conflict markers are left", "<<<<<<<" not in text and ">>>>>>>" not in text),
        ("the cat is called HEAD", "The cat is called HEAD." in text),
        ("the merge is finished", not (path / ".git" / "MERGE_HEAD").exists() and repo.clean()),
    ]


# 06 Remotes ----------------------------------------------------------------------------------


def setup_06(path: Path) -> None:
    path.mkdir(parents=True)
    origin = path / "origin.git"
    Repo(path).git("init", "-q", "--bare", "-b", "main", str(origin))
    first = Repo(path / "seed").init()
    first.write("visitors.txt", "Monday: the postman\n")
    first.commit("Start the visitor log")
    first.git("remote", "add", "origin", str(origin))
    first.git("push", "-q", "origin", "main")
    Repo(path).git("clone", "-q", str(origin), "laptop")
    laptop = Repo(path / "laptop")
    laptop.git("config", "core.autocrlf", "false")
    laptop.write("snacks.txt", "crunchy biscuits\n")
    laptop.commit("Add the snack list")
    first.write("visitors.txt", "Monday: the postman\nTuesday: the neighbour's dog\n")
    first.commit("Log Tuesday's visitor")
    first.git("push", "-q", "origin", "main")
    shutil.rmtree(path / "seed", ignore_errors=True)


def check_06(path: Path) -> list[Check]:
    origin, laptop = Repo(path / "origin.git"), Repo(path / "laptop")
    log = origin.git("log", "--format=%s", "main", ok=True)
    merges = origin.git("rev-list", "--merges", "main", ok=True)
    return [
        ("origin has your snack list", "Add the snack list" in log),
        ("origin still has Tuesday's visitor", "Log Tuesday's visitor" in log),
        ("origin's history is a straight line", merges == ""),
        (
            "your laptop matches origin",
            laptop.git("rev-parse", "HEAD", ok=True) == origin.git("rev-parse", "main", ok=True),
        ),
        ("nothing is left uncommitted on the laptop", laptop.clean()),
    ]


# 07 Undo -------------------------------------------------------------------------------------


def setup_07(path: Path) -> None:
    repo = Repo(path).init()
    repo.write("README.md", "# HEAD's feeding app\n")
    repo.commit("Start the feeding app")
    start_tag(repo)
    repo.write("feeding.txt", "08:00 biscuits\n18:00 tuna\n")
    repo.write(".env", "CAT_API_KEY=not-a-real-key-but-pretend-it-is\n")
    repo.commit("Add feeding schedul")


def check_07(path: Path) -> list[Check]:
    repo = Repo(path)
    new = repo.commits("quest-start..HEAD")
    ignored = repo.git("check-ignore", ".env", ok=True) == ".env"
    return [
        ("still exactly one commit after the start", len(new) == 1),
        ("the message is fixed", repo.message() == "Add feeding schedule"),
        ("feeding.txt is in it", repo.show("HEAD", "feeding.txt") != ""),
        (
            ".env is in no commit",
            repo.git("log", "--all", "--format=%h", "--", ".env", ok=True) == "",
        ),
        (".env is ignored from now on", ignored),
        ("nothing is left uncommitted", repo.clean()),
    ]


# 08 Stash ------------------------------------------------------------------------------------


def setup_08(path: Path) -> None:
    repo = Repo(path).init()
    repo.write("README.md", "# Scratching post\n\nBuilt for teh cat.\n")
    repo.write("post.txt", "height: 80 cm\n")
    repo.commit("Plan the scratching post")
    start_tag(repo)
    repo.git("switch", "-q", "-c", "scratching-post")
    repo.write("post.txt", "height: 80 cm\nrope: sisal, 3 layers\n")


def check_08(path: Path) -> list[Check]:
    repo = Repo(path)
    readme = repo.show("main", "README.md")
    return [
        ("main has a new commit", len(repo.commits("quest-start..main")) == 1),
        ("the typo is fixed on main", "the cat" in readme and "teh" not in readme),
        ("you are back on scratching-post", repo.branch() == "scratching-post"),
        ("your sisal work is back, uncommitted", "sisal" in repo.git("diff", ok=True)),
        ("the stash is empty", repo.git("stash", "list", ok=True) == ""),
    ]


# 09 Rewrite history --------------------------------------------------------------------------

BOWL = "A ceramic bowl, wide and shallow.\n"
WATER = "A fountain that hums quietly.\n"


def setup_09(path: Path) -> None:
    repo = Repo(path).init()
    repo.write("README.md", "# Kitchen\n")
    repo.commit("Open the kitchen")
    start_tag(repo)
    repo.git("switch", "-q", "-c", "kitchen")
    repo.write("bowl.txt", "A bowl.\n")
    repo.commit("Add bowl")
    repo.write("bowl.txt", "A ceramik bowl, wide and shallow.\n")
    repo.commit("wip")
    repo.write("bowl.txt", BOWL)
    repo.commit("fix typo")
    repo.write("water.txt", "A fountain.\n")
    repo.commit("Add water")
    repo.write("water.txt", WATER)
    repo.commit("wip again")


def check_09(path: Path) -> list[Check]:
    repo = Repo(path)
    new = repo.commits("quest-start..kitchen")
    messages = [repo.message(commit).lower() for commit in new]
    return [
        ("kitchen has exactly two commits", len(new) == 2),
        ("the first has only bowl.txt", len(new) == 2 and repo.files(new[0]) == {"bowl.txt"}),
        ("the second has only water.txt", len(new) == 2 and repo.files(new[1]) == {"water.txt"}),
        ("no wip or fix messages", not any("wip" in m or "fix" in m for m in messages)),
        (
            "the files ended up the same",
            repo.show("kitchen", "bowl.txt") + "\n" == BOWL
            and repo.show("kitchen", "water.txt") + "\n" == WATER,
        ),
    ]


# 10 Bisect -----------------------------------------------------------------------------------

BAD = 23


def setup_10(path: Path) -> None:
    repo = Repo(path).init()
    repo.write(
        "check.sh",
        "#!/bin/sh\n# Passes while HEAD only purrs. Fails once she hisses.\n"
        "! grep -q hiss purr.txt\n",
    )
    lines = []
    for n in range(1, 41):
        lines.append("hiss" if n == BAD else f"purr {n}")
        repo.write("purr.txt", "\n".join(lines) + "\n")
        repo.commit("More purring")
    start_tag(repo)


def check_10(path: Path) -> list[Check]:
    repo = Repo(path)
    culprit = repo.commits("quest-start")[BAD - 1] if repo.has("quest-start") else ""
    return [
        ("a branch called culprit exists", repo.has("culprit")),
        (
            "it points at the first commit with a hiss",
            repo.has("culprit") and repo.git("rev-parse", "culprit") == culprit,
        ),
        ("bisect is finished", not (path / ".git" / "BISECT_LOG").exists()),
    ]


# 11 Reflog -----------------------------------------------------------------------------------

STEP = "Step 3: a pinch of catnip."


def setup_11(path: Path) -> None:
    repo = Repo(path).init()
    repo.write("README.md", "# Recipes\n")
    repo.commit("Start the recipe book")
    start_tag(repo)
    repo.git("switch", "-q", "-c", "secret-recipe")
    steps = ["Step 1: warm the tuna.", "Step 2: add one biscuit.", STEP]
    for n in range(1, 4):
        repo.write("recipe.txt", "\n".join(steps[:n]) + "\n")
        repo.commit(f"Write step {n}")
    repo.git("switch", "-q", "main")
    repo.git("branch", "-q", "-D", "secret-recipe")


def check_11(path: Path) -> list[Check]:
    repo = Repo(path)
    rescued = repo.has("rescued")
    return [
        ("a branch called rescued exists", rescued),
        ("it has all three recipe steps", rescued and STEP in repo.show("rescued", "recipe.txt")),
        ("it has the whole history", rescued and len(repo.commits("quest-start..rescued")) == 3),
    ]


# 12 Git and AI agents ------------------------------------------------------------------------


def setup_12(path: Path) -> None:
    repo = Repo(path / "app").init()
    repo.write("routes.py", 'ROUTES = {\n    "/": "home",\n}\n')
    repo.write("style.css", "body{margin:0;font-family:sans-serif}\n")
    repo.write(".gitignore", ".env\n")
    repo.commit("Start the cat facts app")
    start_tag(repo)
    # What an agent left behind after "add a cat facts page, and tidy the CSS".
    repo.write("facts.py", 'def facts():\n    return ["Cats sleep 12 to 16 hours a day."]\n')
    repo.write("routes.py", 'ROUTES = {\n    "/": "home",\n    "/facts": "facts",\n}\n')
    repo.write("style.css", "body {\n  margin: 0;\n  font-family: sans-serif;\n}\n")
    repo.write("agent-debug.log", "step 1: read routes.py\nstep 2: wrote facts.py\n")


def check_12(path: Path) -> list[Check]:
    repo = Repo(path / "app")
    new = repo.commits("quest-start..main")
    touched = [repo.files(commit) - {".gitignore"} for commit in new]
    worktrees = repo.git("worktree", "list", "--porcelain", ok=True)
    return [
        (
            "one commit has the feature: facts.py and routes.py",
            {"facts.py", "routes.py"} in touched,
        ),
        ("one commit has only the CSS tidy-up", {"style.css"} in touched),
        (
            "the debug log is in no commit",
            repo.git("log", "--all", "--format=%h", "--", "agent-debug.log", ok=True) == "",
        ),
        ("the debug log is ignored", repo.git("check-ignore", "agent-debug.log", ok=True) != ""),
        ("a worktree is checked out on agent-b", "refs/heads/agent-b" in worktrees),
        ("nothing is left uncommitted", repo.clean()),
    ]


QUESTS = [
    Quest(
        1,
        "hello-head",
        "Hello, HEAD",
        "HEAD the cat wrote a file about herself. Nothing is saved yet: there is no repository.",
        [
            "Turn this folder into a git repository.",
            "Tell git your name and email.",
            "Commit cat.txt.",
        ],
        [
            "git init",
            'git config --global user.name "Your Name"',
            'git add cat.txt, then git commit -m "..."',
        ],
        setup_01,
        check_01,
    ),
    Quest(
        2,
        "stage-and-commit",
        "Stage and commit",
        "Three files changed while HEAD was napping. They are about two different things.",
        ["Commit naps.txt on its own.", "Commit menu.txt and toys.txt together."],
        [
            "git status shows what changed",
            "git add only the files you want, then commit",
            "git diff --staged shows what the next commit will hold",
        ],
        setup_02,
        check_02,
    ),
    Quest(
        3,
        "time-travel",
        "Time travel",
        "Somebody 'tidied' the README and rule 3 vanished. HEAD wants it back.",
        [
            "Bring rule 3 back with a new commit.",
            "Do not rewrite history.",
            "Keep everything else as it is now.",
        ],
        [
            "git log --oneline, then git show on each commit",
            "git revert undoes one commit",
            "or: git restore --source <commit> README.md, then commit",
        ],
        setup_03,
        check_03,
    ),
    Quest(
        4,
        "branches",
        "Branches",
        "The treats branch is ready. HEAD also wants to plan nap time, on a branch of its own.",
        [
            "Merge treats into main.",
            "Make a branch called nap-time and commit on it.",
            "Merge nap-time into main, and end on main.",
        ],
        [
            "git branch and git log --oneline --graph --all",
            "git merge treats",
            "git switch -c nap-time",
        ],
        setup_04,
        check_04,
    ),
    Quest(
        5,
        "merge-conflicts",
        "Merge conflicts",
        "main calls the cat Mittens. The rename branch calls her HEAD. Both changed the same line.",
        ["Merge rename into main.", "Resolve the conflict: the cat is called HEAD."],
        [
            "git merge rename, then open name.txt",
            "keep the line you want, delete the markers",
            "git add name.txt, then git commit",
        ],
        setup_05,
        check_05,
    ),
    Quest(
        6,
        "remotes",
        "Remotes",
        "You committed on your laptop. Meanwhile a teammate pushed. Now your push is rejected.",
        [
            "Work in the laptop folder.",
            "Get your teammate's commit.",
            "Push yours, keeping history a straight line.",
        ],
        [
            "cd laptop, then git push and read the error",
            "git pull --rebase",
            "git log --oneline --graph --all",
        ],
        setup_06,
        check_06,
    ),
    Quest(
        7,
        "undo",
        "Undo anything",
        "The last commit has a typo in its message and a secret in .env. It is not pushed yet.",
        [
            "Take .env out of the commit and ignore it.",
            "Fix the message to 'Add feeding schedule'.",
            "Keep it as one commit.",
        ],
        ["git rm --cached .env", "add .env to .gitignore", "git commit --amend"],
        setup_07,
        check_07,
    ),
    Quest(
        8,
        "stash",
        "Stash and switch",
        "You are halfway through the scratching post. Then: a typo on main, fix it now.",
        [
            "Put your work aside without committing it.",
            "Fix 'teh cat' on main, and commit.",
            "Go back and get your work back.",
        ],
        ["git stash", "git switch main", "git switch scratching-post, then git stash pop"],
        setup_08,
        check_08,
    ),
    Quest(
        9,
        "rewrite-history",
        "Rewrite history",
        "The kitchen branch has five messy commits. Tidy them into two before anyone reviews.",
        [
            "Two commits: one for bowl.txt, one for water.txt.",
            "No 'wip' or 'fix' messages.",
            "The files must end up exactly the same.",
        ],
        ["git rebase -i main", "fixup or squash the wip and fix commits", "reword the rest"],
        setup_09,
        check_09,
    ),
    Quest(
        10,
        "bisect",
        "Find the bug with bisect",
        "Forty commits of purring, and somewhere HEAD started hissing. check.sh can tell.",
        [
            "Find the first commit where check.sh fails.",
            "Make a branch called culprit there.",
            "Finish the bisect.",
        ],
        [
            "git bisect start HEAD <a good commit>",
            "git bisect run sh check.sh",
            "git branch culprit <hash>, then git bisect reset",
        ],
        setup_10,
        check_10,
    ),
    Quest(
        11,
        "reflog",
        "The reflog saves you",
        "Someone deleted the secret-recipe branch. Three commits, gone. Or are they?",
        ["Find the lost commits.", "Put them on a branch called rescued."],
        ["git reflog", "look for 'Write step 3'", "git branch rescued <hash>"],
        setup_11,
        check_11,
    ),
    Quest(
        12,
        "ai-agents",
        "Git and AI agents",
        "An agent added a cat facts page, tidied the CSS and left a debug log. All uncommitted.",
        [
            "Work in the app folder.",
            "Commit the feature (facts.py, routes.py) on its own.",
            "Commit the CSS tidy-up on its own.",
            "Never commit the debug log: ignore it.",
            "Add a worktree on a new branch agent-b, for a second agent.",
        ],
        [
            "git diff --stat, then git diff",
            "git add facts.py routes.py, commit, then the CSS",
            "git worktree add -b agent-b ../agent-b",
        ],
        setup_12,
        check_12,
    ),
]


def find(number: int) -> Quest:
    for quest in QUESTS:
        if quest.number == number:
            return quest
    raise KeyError(number)
