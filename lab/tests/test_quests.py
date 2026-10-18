"""Every quest starts unsolved, and a real solution with real git passes its checks.

These are the answers. Peek only when you are truly stuck: the quests teach more than the tests.
"""

import re
import subprocess
from pathlib import Path

import pytest

from quest.quests import QUESTS, find

ME = [
    "-c",
    "user.name=Learner",
    "-c",
    "user.email=learner@example.com",
    "-c",
    "core.autocrlf=false",
]


def git(path: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *ME, *args], cwd=path, capture_output=True, text=True, encoding="utf-8"
    )
    return result.stdout + result.stderr


def write(path: Path, text: str) -> None:
    path.write_bytes(text.encode())


def solve_01(p: Path) -> None:
    git(p, "init", "-q", "-b", "main")
    git(p, "config", "user.name", "Learner")
    git(p, "add", "cat.txt")
    git(p, "commit", "-q", "-m", "Introduce HEAD")


def solve_02(p: Path) -> None:
    git(p, "add", "naps.txt")
    git(p, "commit", "-q", "-m", "Plan HEAD's naps")
    git(p, "add", "menu.txt", "toys.txt")
    git(p, "commit", "-q", "-m", "Add tuna and a laser pointer")


def solve_03(p: Path) -> None:
    git(p, "revert", "--no-edit", "HEAD~1")


def solve_04(p: Path) -> None:
    git(p, "merge", "treats")
    git(p, "switch", "-c", "nap-time")
    write(p / "naps.txt", "13:00 the warm laptop\n")
    git(p, "add", "naps.txt")
    git(p, "commit", "-q", "-m", "Plan nap time")
    git(p, "switch", "main")
    git(p, "merge", "nap-time")


def solve_05(p: Path) -> None:
    git(p, "merge", "rename")
    write(p / "name.txt", "The cat is called HEAD.\nShe likes boxes.\n")
    git(p, "add", "name.txt")
    git(p, "commit", "-q", "--no-edit")


def solve_06(p: Path) -> None:
    laptop = p / "laptop"
    git(laptop, "pull", "--rebase")
    git(laptop, "push")


def solve_07(p: Path) -> None:
    git(p, "rm", "-q", "--cached", ".env")
    write(p / ".gitignore", ".env\n")
    git(p, "add", ".gitignore")
    git(p, "commit", "-q", "--amend", "-m", "Add feeding schedule")


def solve_08(p: Path) -> None:
    git(p, "stash")
    git(p, "switch", "main")
    write(p / "README.md", "# Scratching post\n\nBuilt for the cat.\n")
    git(p, "commit", "-q", "-am", "Fix a typo in the README")
    git(p, "switch", "scratching-post")
    git(p, "stash", "pop")


def solve_09(p: Path) -> None:
    git(p, "reset", "--soft", "quest-start")
    git(p, "restore", "--staged", "water.txt")
    git(p, "commit", "-q", "-m", "Add a ceramic food bowl")
    git(p, "add", "water.txt")
    git(p, "commit", "-q", "-m", "Add a water fountain")


def solve_10(p: Path) -> None:
    first = git(p, "rev-list", "--max-parents=0", "HEAD").strip()
    git(p, "bisect", "start", "HEAD", first)
    out = git(p, "bisect", "run", "sh", "check.sh")
    culprit = re.search(r"([0-9a-f]{40}) is the first bad commit", out).group(1)
    git(p, "branch", "culprit", culprit)
    git(p, "bisect", "reset")


def solve_11(p: Path) -> None:
    reflog = git(p, "reflog", "--format=%H %gs")
    lost = next(line.split()[0] for line in reflog.splitlines() if "Write step 3" in line)
    git(p, "branch", "rescued", lost)


def solve_12(p: Path) -> None:
    app = p / "app"
    git(app, "add", "facts.py", "routes.py")
    git(app, "commit", "-q", "-m", "Add a cat facts page")
    git(app, "add", "style.css")
    git(app, "commit", "-q", "-m", "Format the CSS")
    write(app / ".gitignore", ".env\n*.log\n")
    git(app, "commit", "-q", "-am", "Ignore log files")
    git(app, "worktree", "add", "-b", "agent-b", "../agent-b")


SOLUTIONS = {n: globals()[f"solve_{n:02}"] for n in range(1, 13)}


def test_there_are_twelve_quests_with_a_solution_each():
    assert [quest.number for quest in QUESTS] == list(SOLUTIONS)


@pytest.mark.parametrize("number", list(SOLUTIONS))
def test_quest_starts_unsolved_and_a_real_fix_passes(tmp_path, number):
    quest = find(number)
    path = tmp_path / quest.folder
    quest.setup(path)
    assert not all(ok for _, ok in quest.check(path))

    SOLUTIONS[number](path)

    failed = [label for label, ok in quest.check(path) if not ok]
    assert failed == []


def test_quest_history_is_the_same_for_everyone(tmp_path):
    find(10).setup(tmp_path / "a")
    find(10).setup(tmp_path / "b")

    assert git(tmp_path / "a", "rev-parse", "HEAD") == git(tmp_path / "b", "rev-parse", "HEAD")
