# cart001A_infinity_runcommands.py
"""
Cart 001A: Infinity Run Commands Module
Provides Infinity run commands functionality for the mongoose.os BMX scripting system.

Features:
- Command registry with aliases, categories, and help text
- Macro system (save, list, run macros composed of multiple commands)
- Audit logging to JSONL
- Config file loader/saver (YAML or JSON)
- CLI interface with --run, --macro, and --list commands
- Extensible router for adding new actions (scan, commit, wallet, status)
"""

import sys
import os
import json
import time
from typing import Dict, List, Callable, Any, Optional

# ---------- Paths and config ----------
ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT, "data")
LOGS_DIR = os.path.join(ROOT, "logs")
CONFIG_PATH = os.path.join(DATA_DIR, "infinity_runcommands_config.json")
MACROS_PATH = os.path.join(DATA_DIR, "infinity_macros.json")
AUDIT_LOG = os.path.join(LOGS_DIR, "runcommands_audit.jsonl")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

# ---------- Utilities ----------
def now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())

def write_audit(entry: Dict[str, Any]) -> None:
    entry = dict(entry)
    entry["t"] = now_iso()
    with open(AUDIT_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

def load_json(path: str, default: Any) -> Any:
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[WARN] Failed to load {path}: {e}")
        return default

def save_json(path: str, obj: Any) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)

# ---------- Command registry ----------
class Command:
    def __init__(self, name: str, func: Callable[..., Any], help_text: str, category: str = "general", aliases: Optional[List[str]] = None):
        self.name = name
        self.func = func
        self.help_text = help_text
        self.category = category
        self.aliases = aliases or []

class Registry:
    def __init__(self):
        self.commands: Dict[str, Command] = {}
        self.alias_map: Dict[str, str] = {}

    def register(self, cmd: Command):
        self.commands[cmd.name] = cmd
        for al in cmd.aliases:
            self.alias_map[al] = cmd.name

    def resolve(self, name: str) -> Optional[Command]:
        if name in self.commands:
            return self.commands[name]
        if name in self.alias_map:
            return self.commands.get(self.alias_map[name])
        return None

    def list_commands(self) -> List[Dict[str, Any]]:
        out = []
        for name, cmd in sorted(self.commands.items()):
            out.append({
                "name": name,
                "category": cmd.category,
                "aliases": cmd.aliases,
                "help": cmd.help_text
            })
        return out

REG = Registry()

# ---------- Built-in actions ----------
CONFIG = load_json(CONFIG_PATH, {
    "wallet": {"octave": 0, "infinity": 0, "mongoose": 0},
    "user": {"name": "guest"},
    "defaults": {"scan_depth": 3}
})

def act_status() -> Dict[str, Any]:
    return {"status": "online", "modules_loaded": len(REG.commands), "user": CONFIG["user"]["name"]}

def act_scan(depth: int = None) -> Dict[str, Any]:
    depth = depth or CONFIG["defaults"]["scan_depth"]
    # Mock scan results (extend with real source hooks later)
    topics = ["quantum-processors", "ai-materials", "hydrogen-storage", "bio-computing", "color-logic"]
    res = topics[:max(1, min(depth, len(topics)))]
    return {"scan_depth": depth, "found": res}

def act_commit(message: str = "commit research") -> Dict[str, Any]:
    entry = {"action": "commit", "msg": message}
    write_audit(entry)
    return {"ok": True, "committed": message}

def act_wallet() -> Dict[str, Any]:
    return {"wallet": CONFIG["wallet"]}

def act_mint(coin: str, amount: int = 1) -> Dict[str, Any]:
    if coin not in CONFIG["wallet"]:
        return {"ok": False, "error": f"Unknown coin: {coin}"}
    CONFIG["wallet"][coin] += int(amount)
    save_json(CONFIG_PATH, CONFIG)
    write_audit({"action": "mint", "coin": coin, "amount": amount})
    return {"ok": True, "wallet": CONFIG["wallet"]}

# Register commands
REG.register(Command("status", lambda: act_status(), "Show system status", "system", aliases=["stat"]))
REG.register(Command("scan", lambda depth=None: act_scan(depth), "Run tech scanner", "research"))
REG.register(Command("commit", lambda msg=None: act_commit(msg or "auto-commit"), "Commit current research", "research"))
REG.register(Command("wallet", lambda: act_wallet(), "Show wallet balances", "economy"))
REG.register(Command("mint", lambda coin="infinity", amount=1: act_mint(coin, amount), "Mint coins", "economy", aliases=["credit"]))

# ---------- Macros ----------
MACROS = load_json(MACROS_PATH, {"macros": {}})

def macros_list() -> Dict[str, Any]:
    return {"macros": list(MACROS["macros"].keys())}

def macros_save(name: str, steps: List[str]) -> Dict[str, Any]:
    MACROS["macros"][name] = steps
    save_json(MACROS_PATH, MACROS)
    write_audit({"action": "macro.save", "name": name, "steps": steps})
    return {"ok": True, "macro": name}

def macros_run(name: str) -> Dict[str, Any]:
    steps = MACROS["macros"].get(name)
    if not steps:
        return {"ok": False, "error": f"Macro not found: {name}"}
    results = []
    for step in steps:
        parts = step.split()
        cmd_name = parts[0]
        args = parts[1:]
        cmd = REG.resolve(cmd_name)
        if not cmd:
            results.append({"step": step, "error": "unknown command"})
            continue
        # Parse trivial args
        kwargs = {}
        for a in args:
            if "=" in a:
                k, v = a.split("=", 1)
                try:
                    kwargs[k] = int(v)
                except:
                    kwargs[k] = v
        res = cmd.func(**kwargs)
        results.append({"step": step, "result": res})
    write_audit({"action": "macro.run", "name": name, "steps": steps})
    return {"ok": True, "results": results}

# ---------- CLI ----------
def print_help():
    print("Infinity Run Commands")
    print("Usage:")
    print("  python cart001A_infinity_runcommands.py --list")
    print("  python cart001A_infinity_runcommands.py --run <command> [key=value ...]")
    print("  python cart001A_infinity_runcommands.py --macro save <name> <cmd1>;<cmd2>...")
    print("  python cart001A_infinity_runcommands.py --macro run <name>")
    print("Examples:")
    print("  --run status")
    print("  --run scan depth=4")
    print("  --run mint coin=octave amount=2")
    print("  --macro save quickscan 'scan depth=3;commit msg=autosave'")

def parse_kv(args: List[str]) -> Dict[str, Any]:
    out = {}
    for a in args:
        if "=" in a:
            k, v = a.split("=", 1)
            try:
                out[k] = int(v)
            except:
                out[k] = v
    return out

def main():
    argv = sys.argv[1:]
    if not argv:
        print_help()
        return
    if argv[0] == "--list":
        for cmd in REG.list_commands():
            aliases = f" (aliases: {', '.join(cmd['aliases'])})" if cmd["aliases"] else ""
            print(f"- {cmd['name']} [{cmd['category']}] {aliases} :: {cmd['help']}")
        return
    if argv[0] == "--run":
        if len(argv) < 2:
            print("Missing command. Use --list for available commands.")
            return
        name = argv[1]
        cmd = REG.resolve(name)
        if not cmd:
            print(f"Unknown command: {name}")
            return
        kwargs = parse_kv(argv[2:])
        write_audit({"action": "run", "command": name, "kwargs": kwargs})
        res = cmd.func(**kwargs)
        print(json.dumps(res, indent=2))
        return
    if argv[0] == "--macro":
        if len(argv) < 2:
            print("Macro usage: --macro save <name> <cmd1>;<cmd2>... | --macro run <name>")
            return
        action = argv[1]
        if action == "save":
            if len(argv) < 4:
                print("Usage: --macro save <name> <cmd1>;<cmd2>...")
                return
            name = argv[2]
            steps = argv[3].split(";")
            res = macros_save(name, steps)
            print(json.dumps(res, indent=2))
            return
        if action == "run":
            if len(argv) < 3:
                print("Usage: --macro run <name>")
                return
            name = argv[2]
            res = macros_run(name)
            print(json.dumps(res, indent=2))
            return
    print_help()

if __name__ == "__main__":
    main()