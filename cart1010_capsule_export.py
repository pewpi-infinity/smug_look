#!/usr/bin/env python3
from pathlib import Path
from c13b0_fs import cart_dir, ensure_dir, load_json, timestamp

HERE = cart_dir(__file__)
STATE = ensure_dir(HERE / "state")
USER = load_json(
    HERE / "CURRENT_USER.json",
    {"user": "default", "created": timestamp()}
)

OUT = ensure_dir(HERE / "capsules")
capsule = OUT / f"capsule_{timestamp().replace(':','_')}.txt"

capsule.write_text(
    f"Capsule export\nUser: {USER['user']}\nTime: {timestamp()}\n"
)

print("[OK] Capsule exported:", capsule.name)
