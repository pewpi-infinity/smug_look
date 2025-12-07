#!/usr/bin/env python3
import os
import json
import time
import hashlib

# ---- Infinity Color Map ----
COLOR_MAP = {
    "hydrogen": "green",
    "lattice": "purple",
    "frequency": "yellow",
    "ionization": "red",
    "energy": "orange",
    "phase": "blue",
    "gradient": "cyan",
    "crystal": "pink",
}

# ---- Root directory ----
ROOT = os.path.expanduser("~/o")

def safe_read(path):
    """Reads file content safely and returns readable text."""
    try:
        with open(path, "r", errors="ignore") as f:
            text = f.read()
            return text
    except:
        return ""

def detect_color(text):
    """Find dominant color for this file from keywords."""
    text_low = text.lower()
    matches = []
    for k, c in COLOR_MAP.items():
        if k in text_low:
            matches.append(c)
    if matches:
        return matches[0]
    return "white"

def file_value(text):
    """Hash → Integer → Infinity Value."""
    h = hashlib.sha1(text.encode()).hexdigest()
    return int(h[:6], 16) % 5000 + 500

def index_everything():
    print("\n∞ Infinity Index — Live Scan\n--------------------------------\n")
    articles = []

    for root, dirs, files in os.walk(ROOT):
        for f in files:
            if f.endswith(".txt") or f.endswith(".json"):
                full = os.path.join(root, f)
                content = safe_read(full)
                if not content.strip():
                    continue

                color = detect_color(content)
                value = file_value(content)
                timestamp = time.ctime(os.path.getmtime(full))

                articles.append({
                    "file": f,
                    "path": full,
                    "color": color,
                    "value": value,
                    "time": timestamp,
                    "preview": content[:250].replace("\n", " ")
                })

    # Highest-value/relevance first
    articles.sort(key=lambda x: x["value"], reverse=True)

    # Print clean feed
    for a in articles:
        print(f"[{a['color'].upper()}]  {a['file']}")
        print(f"Infinity Value: {a['value']}")
        print(f"Timestamp: {a['time']}")
        print(f"Preview: {a['preview']}\n")
        print("-" * 60)

if __name__ == "__main__":
    index_everything()
