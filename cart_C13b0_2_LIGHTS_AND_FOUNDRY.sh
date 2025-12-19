#!/data/data/com.termux/files/usr/bin/bash
set -e

# 🧱🚦🧱
# C13b0² LIGHTS + FOUNDRY CART
# Purpose:
# - Scan ALL repos in pewpi-infinity (≈330)
# - Acknowledge ID updates via lights
# - Turn GREEN when accepted
# - On every run, BIRTH a new repo (one per push)
# Software package
# No folders
# Run = push • Re-run = repush
# C13b0² always acknowledged

# Anchor to repo root (never HOME)
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

SYMBOL="🧱🚦🧱"
VERSION="C13b0²"
ORG="pewpi-infinity"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPO="$(basename "$ROOT")"

# Require gh
gh auth status >/dev/null 2>&1 || { echo "gh auth required"; exit 1; }

# ---- LIGHTS: acknowledge update, default GREEN
FIRST_COLOR="YELLOW"
SECOND_COLOR="GREEN"
RESULT="PROCEED"

# ---- SCAN ALL REPOS (names only)
REPOS_JSON=$(gh repo list "$ORG" --limit 500 --json name,updatedAt --jq '.')
COUNT=$(echo "$REPOS_JSON" | jq 'length')

# ---- FOUNDRY: create ONE new repo per run
NEW_REPO="c13b0_auto_$(date -u +%Y%m%d_%H%M%S)"
gh repo create "$ORG/$NEW_REPO" --public --confirm

# ---- RECORD STATE (ID + LIGHTS)
OUT="C13b0_LIGHTS_${TS}.json"
cat << JSON > "$OUT"
{
  "symbol": "$SYMBOL",
  "version": "$VERSION",
  "acknowledged": true,
  "org": "$ORG",
  "repo": "$REPO",
  "timestamp": "$TS",
  "lights": {
    "first": "$FIRST_COLOR",
    "second": "$SECOND_COLOR",
    "result": "$RESULT"
  },
  "scan": {
    "total_repos": $COUNT,
    "sample": $(echo "$REPOS_JSON" | jq '.[0:5]')
  },
  "foundry": {
    "new_repo_created": "$NEW_REPO",
    "policy": "one_new_repo_per_push"
  },
  "aim": "updates flip lights to GREEN and propagate system-wide"
}
JSON

git add -A
git commit -m "$SYMBOL $VERSION lights GREEN + foundry $TS" || true
git push || true

echo "$SYMBOL $VERSION LIGHTS GREEN • NEW REPO: $NEW_REPO"
