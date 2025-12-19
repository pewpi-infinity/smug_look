#!/data/data/com.termux/files/usr/bin/bash
set -e

# 🧱🤖🧱
# C13b0² BRAIN ↔ HANDS CART
# Purpose:
# - Brain leaves a token where it stopped
# - Hands pick it up and continue
# - Clarifies why `cd ~` shows o/mongoose (HOME anchor)
# Software package
# No folders
# Run = push • Re-run = repush
# C13b0² always acknowledged

# Anchor explicitly to repo root (not ~)
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

SYMBOL="🧱🤖🧱"
VERSION="C13b0²"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPO="$(basename "$ROOT")"

# Brain leaves a resume token
TOKEN="C13b0_BRAIN_HANDS_${TS}.json"

cat << JSON > "$TOKEN"
{
  "symbol": "$SYMBOL",
  "version": "$VERSION",
  "acknowledged": true,
  "repo": "$REPO",
  "timestamp": "$TS",
  "brain": {
    "state": "paused",
    "cwd": "$ROOT",
    "note": "work left here"
  },
  "hands": {
    "state": "ready",
    "action": "resume_from_token"
  },
  "clarity": {
    "cd_home_means": "~ resolves to HOME",
    "why_you_saw": "HOME contains o/mongoose",
    "rule": "always return to git root for carts"
  }
}
JSON

git add -A
git commit -m "$SYMBOL $VERSION brain↔hands $TS" || true
git push || true

echo "$SYMBOL $VERSION BRAIN↔HANDS OK"
