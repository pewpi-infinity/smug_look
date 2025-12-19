#!/usr/bin/env python3
from pathlib import Path
from c13b0_fs import cart_dir, ensure_dir, load_json, timestamp
import json

HERE = cart_dir(__file__)

# --- state directories ---
STATE = ensure_dir(HERE / "state")
LEDGER = ensure_dir(HERE / "ledger")

# --- user ---
USER = load_json(
    HERE / "CURRENT_USER.json",
    {
        "user": "default",
        "created": timestamp(),
        "note": "Auto-created by cart1016_sync_ledger"
    }
)

# --- ledger file ---
ledger_file = LEDGER / "ledger.json"
ledger = load_json(
    ledger_file,
    {
        "owner": USER["user"],
        "created": timestamp(),
        "entries": []
    }
)

# --- append entry ---
entry = {
    "ts": timestamp(),
    "action": "sync_ledger",
    "user": USER["user"]
}
ledger["entries"].append(entry)

ledger_file.write_text(json.dumps(ledger, indent=2))

print("[OK] Ledger synced")
print("Entries:", len(ledger["entries"]))
