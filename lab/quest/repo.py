"""A thin, honest wrapper around the real git command."""

import os
import subprocess
from pathlib import Path

# Quest history is written by HEAD the cat at fixed times, so every learner gets the same hashes.
CAT = {
    "GIT_AUTHOR_NAME": "HEAD the cat",
    "GIT_AUTHOR_EMAIL": "head@cat.example",
    "GIT_COMMITTER_NAME": "HEAD the cat",
    "GIT_COMMITTER_EMAIL": "head@cat.example",
}
SAFE = ["-c", "core.autocrlf=false", "-c", "commit.gpgsign=false", "-c", "core.hooksPath="]


class Repo:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.minute = 0

    def git(self, *args: str, ok: bool = False) -> str:
        """Run git here. With ok=True a failure returns "" instead of raising."""
        result = subprocess.run(
            ["git", *SAFE, *args],
            cwd=self.path,
            capture_output=True,
            text=True,
            encoding="utf-8",
            env={**os.environ, "GIT_TERMINAL_PROMPT": "0"},
        )
        if result.returncode and not ok:
            raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr.strip()}")
        return result.stdout.strip() if result.returncode == 0 else ""

    def init(self, branch: str = "main") -> "Repo":
        self.path.mkdir(parents=True, exist_ok=True)
        self.git("init", "-q", "-b", branch)
        self.git("config", "core.autocrlf", "false")
        return self

    def write(self, name: str, text: str) -> None:
        target = self.path / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(text.encode())

    def read(self, name: str) -> str:
        target = self.path / name
        return target.read_bytes().decode() if target.exists() else ""

    def commit(self, message: str, *files: str) -> str:
        """Commit as HEAD the cat, one minute after the last commit."""
        self.git("add", *(files or ["-A"]))
        self.minute += 1
        when = f"2026-01-01T09:{self.minute:02}:00+00:00"
        env = {**os.environ, **CAT, "GIT_AUTHOR_DATE": when, "GIT_COMMITTER_DATE": when}
        subprocess.run(
            ["git", *SAFE, "commit", "-q", "-m", message],
            cwd=self.path,
            env=env,
            check=True,
            capture_output=True,
        )
        return self.git("rev-parse", "HEAD")

    # Questions the checks ask.

    def is_repo(self) -> bool:
        return (self.path / ".git").exists() and self.git("rev-parse", "--git-dir", ok=True) != ""

    def commits(self, rev_range: str) -> list[str]:
        out = self.git("rev-list", "--reverse", rev_range, ok=True)
        return out.split() if out else []

    def files(self, commit: str) -> set[str]:
        out = self.git(
            "diff-tree", "--root", "--no-commit-id", "--name-only", "-r", commit, ok=True
        )
        return set(out.split("\n")) if out else set()

    def message(self, commit: str = "HEAD") -> str:
        return self.git("log", "-1", "--format=%s", commit, ok=True)

    def parents(self, commit: str = "HEAD") -> list[str]:
        return self.git("log", "-1", "--format=%P", commit, ok=True).split()

    def show(self, commit: str, name: str) -> str:
        return self.git("show", f"{commit}:{name}", ok=True)

    def clean(self) -> bool:
        return self.git("status", "--porcelain", ok=True) == ""

    def branch(self) -> str:
        return self.git("branch", "--show-current", ok=True)

    def has(self, ref: str) -> bool:
        return self.git("rev-parse", "--verify", "--quiet", ref, ok=True) != ""

    def contains(self, ancestor: str, descendant: str = "HEAD") -> bool:
        result = subprocess.run(
            ["git", "merge-base", "--is-ancestor", ancestor, descendant],
            cwd=self.path,
            capture_output=True,
        )
        return result.returncode == 0
