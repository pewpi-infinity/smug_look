#!/data/data/com.termux/files/usr/bin/bash
set -e

# 🧱🚦🧱
# C13b0² SIGNAL LIGHT CART
# Purpose:
# - First color opens the step
# - Second color determines GO / TABLE TALK
# - Green = proceed
# - Not green = pause, present, analyze (quantum-level discussion)
# Software package
# No folders
# Run = push • Re-run = repush
# C13b0² always acknowledged

# Always anchor to repo root
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

SYMBOL="🧱🚦🧱"
VERSION="C13b0²"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPO="$(basename "$ROOT")"

# SIGNAL STATES
FIRST_COLOR="YELLOW"   # step identified / opened
SECOND_COLOR="GREEN"   # change to RED or ORANGE to force table talk

STATE="PROCEED"
if [ "$SECOND_COLOR" != "GREEN" ]; then
  STATE="TABLE_TALK"
fi

OUT="C13b0_SIGNAL_${TS}.json"

cat << JSON > "$OUT"
{
  "symbol": "$SYMBOL",
  "version": "$VERSION",
  "acknowledged": true,
  "repo": "$REPO",
  "timestamp": "$TS",
  "signal": {
    "first_color": "$FIRST_COLOR",
    "second_color": "$SECOND_COLOR",
    "result": "$STATE"
  },
  "meaning": {
    "GREEN": "advance to next operation",
    "NOT_GREEN": "pause system, present context, discuss complexity"
  },
  "note": "non-green states indicate unresolved or quantum-level problems"
}
JSON

git add -A
git commit -m "$SYMBOL $VERSION signal $STATE $TS" || true
git push || true

echo "$SYMBOL $VERSION SIGNAL → $STATE"
