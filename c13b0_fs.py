from pathlib import Path
import json
from datetime import datetime

def cart_dir(file):
    return Path(file).resolve().parent

def ensure_json(path: Path, default: dict):
    if not path.exists():
        path.write_text(json.dumps(default, indent=2))
        return False
    return True

def load_json(path: Path, default: dict):
    if not ensure_json(path, default):
        return default
    try:
        return json.loads(path.read_text())
    except Exception:
        path.write_text(json.dumps(default, indent=2))
        return default

def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)
    return path

def timestamp():
    return datetime.utcnow().isoformat() + "Z"
