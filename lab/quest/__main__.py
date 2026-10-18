"""quest: real git problems to solve, with HEAD the cat.

list            every quest, and which ones you have finished
start N         build quest N in ~/git-good, ready to solve
check [N]       check your fix (inside a quest folder, N is optional)
hint [N]        a nudge from HEAD
"""

import argparse
import os
import shutil
import stat
import sys
from pathlib import Path

from quest.quests import QUESTS, Quest, find

# Quests live outside this repository, so their repos never nest inside it.
PLAY = Path(os.environ.get("GIT_GOOD_HOME", Path.home() / "git-good"))


def say(text: str) -> None:
    print(" /\\_/\\")
    print(f"( o.o )  {text}")
    print(" > ^ <")


def where(quest: Quest) -> Path:
    return PLAY / quest.folder


def remove(path: Path) -> None:
    def unlock(func, name, _exc):  # git marks its objects read-only on Windows
        Path(name).chmod(stat.S_IWRITE)
        func(name)

    shutil.rmtree(path, onexc=unlock)


def here() -> int | None:
    """The quest whose folder you are standing in, if any."""
    cwd = Path.cwd().resolve()
    for quest in QUESTS:
        folder = where(quest).resolve()
        if cwd == folder or folder in cwd.parents:
            return quest.number
    return None


def chosen(args: argparse.Namespace) -> Quest:
    number = args.n or here()
    if number is None:
        sys.exit("which quest? add its number, or run this inside its folder")
    return find(number)


def passed(quest: Quest) -> bool:
    return where(quest).exists() and all(ok for _, ok in quest.check(where(quest)))


def cmd_list(args: argparse.Namespace) -> None:
    for quest in QUESTS:
        mark = "done" if passed(quest) else ("open" if where(quest).exists() else "")
        print(f"  {quest.number:>2}  {quest.title:<26} {mark}")


def cmd_start(args: argparse.Namespace) -> None:
    quest = find(args.n)
    path = where(quest)
    if path.exists():
        remove(path)
    quest.setup(path)
    say(quest.story)
    print()
    for goal in quest.goals:
        print(f"  [ ] {goal}")
    print()
    print(f"cd {path}")
    print("then, inside it: quest check")


def cmd_check(args: argparse.Namespace) -> None:
    quest = chosen(args)
    if not where(quest).exists():
        sys.exit(f"start it first: quest start {quest.number}")
    results = quest.check(where(quest))
    for label, ok in results:
        print(f"  {'PASS' if ok else 'TODO'}  {label}")
    print()
    if all(ok for _, ok in results):
        say(f"Purr. Quest {quest.number} done!")
    else:
        say(f"Not yet. Try: quest hint {quest.number}")
        sys.exit(1)


def cmd_hint(args: argparse.Namespace) -> None:
    quest = chosen(args)
    say("Here is what I would try:")
    for hint in quest.hints:
        print(f"  - {hint}")


def main() -> None:
    parser = argparse.ArgumentParser(prog="quest", description="Real git problems to solve.")
    sub = parser.add_subparsers(required=True)
    sub.add_parser("list", help="every quest and your progress").set_defaults(func=cmd_list)
    numbers = range(1, len(QUESTS) + 1)
    p = sub.add_parser("start", help="build quest N in ~/git-good")
    p.add_argument("n", type=int, choices=numbers, metavar="N")
    p.set_defaults(func=cmd_start)
    for name, func, text in [("check", cmd_check, "check your fix"), ("hint", cmd_hint, "a nudge")]:
        p = sub.add_parser(name, help=text)
        p.add_argument("n", type=int, nargs="?", choices=numbers, metavar="N")
        p.set_defaults(func=func)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
