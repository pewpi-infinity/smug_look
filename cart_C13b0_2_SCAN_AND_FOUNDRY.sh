#!/data/data/com.termux/files/usr/bin/bash
set -e

# 🧱🚦🧱
# C13b0² SCAN + INTELLIGENT FOUNDRY
# Program behavior:
# - Scan EVERY repo under pewpi-infinity
# - Treat existing C13b0² carts as the running program
# - Derive a GREEN / TABLE state from scan signals
# - Create ONE new repo per run
# - Name the repo intelligently from scan results
# Software package • No folders
# Run = push • Re-run = repush
# C13b0² always acknowledged

# Anchor to git root (never HOME)
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

SYMBOL="🧱🚦🧱"
VERSION="C13b0²"
ORG="pewpi-infinity"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPO="$(basename "$ROOT")"

# Require GitHub CLI
gh auth status >/dev/null 2>&1 || { echo "gh auth required"; exit 1; }

# ── SCAN ALL REPOS (metadata only)
REPOS=$(gh repo list "$ORG" --limit 500 --json name,updatedAt,defaultBranchRef --jq '.')
TOTAL=$(echo "$REPOS" | jq 'length')

# ── SIGNAL DERIVATION
# Heuristic:
# - If many repos updated recently → GREEN (system alive)
# - Else → TABLE_TALK (present findings)
RECENT_COUNT=$(echo "$REPOS" | jq '[.[] | select(.updatedAt > (now - 86400 | todate))] | length')
FIRST_COLOR="YELLOW"
SECOND_COLOR="GREEN"
RESULT="PROCEED"
if [ "$RECENT_COUNT" -lt 5 ]; then
  SECOND_COLOR="ORANGE"
  RESULT="TABLE_TALK"
fi

# ── INTELLIGENT NAME (derived, deterministic)
# Name components:
# - signal
# - repo count bucket
# - date stamp
BUCKET=$(( (TOTAL / 50) * 50 ))
NEW_REPO="c13b0_${RESULT,,}_${BUCKET}repos_$(date -u +%Y%m%d_%H%M%S)"

# ── CREATE NEW REPO (one per run)
gh repo create "$ORG/$NEW_REPO" --public --confirm

# ── RECORD STATE
OUT="C13b0_SCAN_FOUNDRY_${TS}.json"
cat << JSON > "$OUT"
{
  "symbol": "$SYMBOL",
  "version": "$VERSION",
  "acknowledged": true,
  "org": "$ORG",
  "repo": "$REPO",
  "timestamp": "$TS",
  "program": "C13b0²",
  "scan": {
    "total_repos": $TOTAL,
    "recent_24h": $RECENT_COUNT
  },
  "lights": {
    "first": "$FIRST_COLOR",
    "second": "$SECOND_COLOR",
    "result": "$RESULT"
  },
  "foundry": {
    "created_repo": "$NEW_REPO",
    "naming_rule": "signal + repo_bucket + timestamp"
  },
  "aim": "GREEN propagates acceptance system-wide; non-green surfaces discussion"
}
JSON

git add -A
git commit -m "$SYMBOL $VERSION scan+foundry $RESULT $TS" || true
git push || true

echo "$SYMBOL $VERSION DONE → $NEW_REPO ($RESULT)"
