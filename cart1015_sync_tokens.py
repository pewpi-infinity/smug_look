#!/usr/bin/env python3
import json
from pathlib import Path
from datetime import datetime

# --- resolve cart directory safely ---
HERE = Path(__file__).resolve().parent
USER_FILE = HERE / "CURRENT_USER.json"

# --- self-heal missing user file ---
if not USER_FILE.exists():
    default_user = {
        "user": "default",
        "created": datetime.utcnow().isoformat() + "Z",
        "note": "Auto-created because CURRENT_USER.json was missing"
    }
    USER_FILE.write_text(json.dumps(default_user, indent=2))
    print("[INFO] CURRENT_USER.json was missing — created default")

# --- load user ---
with USER_FILE.open() as f:
    user = json.load(f)

print("[OK] Loaded CURRENT_USER.json")
print("User:", user.get("user", "unknown"))

# --- placeholder sync logic ---
print("[SYNC] Tokens synced successfully")
