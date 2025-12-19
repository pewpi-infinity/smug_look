#!/usr/bin/env python3
import subprocess
from pathlib import Path
from datetime import datetime

HERE = Path(__file__).resolve().parent

def run(cart_name):
    cart_path = HERE / cart_name
    if not cart_path.exists():
        print(f"[WARN] Missing {cart_name}, skipping")
        return
    print(f"[RUN] {cart_name}")
    subprocess.run(
        ["python", str(cart_path)],
        cwd=str(HERE),
        check=False
    )

print("[SYNC] Starting multi-device sync...")

run("cart1015_sync_tokens.py")
run("cart1016_sync_ledger.py")

print("[SYNC] Multi-device sync complete. Login now.")
