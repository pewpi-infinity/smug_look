# cart019_token_generation.py
"""
Cart 019: Token Generation
Manages daily auto grants, research grants, and media uploads registry.

Purpose in Infinity:
- Daily auto-pay: grant 48 Infinity/day to users (configurable)
- Research grants: mint research tokens based on proposals
- Media registry: record uploaded music/videos/documents for educational indexing
- Payment notes: record PayPal sales metadata (no payment processing)
- Artifacts + audit logs for provenance

CLI:
  python cart019_token_generation.py grant daily --user Kris --amount 48
  python cart019_token_generation.py grant research --user Kris --title "Hydrogen lattice"
  python cart019_token_generation.py upload music --user Kris --title "Whistle Study" --url https://...
  python cart019_token_generation.py sale paypal --user Kris --amount 10.00 --note "Support"
"""

import sys, os, json, time

ROOT = os.path.dirname(os.path.abspath(__file__))
LOGS = os.path.join(ROOT, "logs")
ART = os.path.join(ROOT, "artifacts")
DATA = os.path.join(ROOT, "data")
os.makedirs(LOGS, exist_ok=True); os.makedirs(ART, exist_ok=True); os.makedirs(DATA, exist_ok=True)

AUDIT = os.path.join(LOGS, "tokengen_audit.jsonl")
WALLET = os.path.join(DATA, "wallets.json")
UPLOADS = os.path.join(DATA, "uploads.json")

DEFAULT_WALLETS = {"users": {}}
DEFAULT_UPLOADS = {"items": []}

def audit(entry: dict):
    entry = dict(entry); entry["t"] = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
    with open(AUDIT, "a", encoding="utf-8") as f: f.write(json.dumps(entry) + "\n")

def load_wallets() -> dict:
    if not os.path.exists(WALLET): return DEFAULT_WALLETS.copy()
    try:
        with open(WALLET, "r", encoding="utf-8") as f: return json.load(f)
    except: return DEFAULT_WALLETS.copy()

def save_wallets(w: dict): 
    with open(WALLET, "w", encoding="utf-8") as f: json.dump(w, f, indent=2)

def load_uploads() -> dict:
    if not os.path.exists(UPLOADS): return DEFAULT_UPLOADS.copy()
    try:
        with open(UPLOADS, "r", encoding="utf-8") as f: return json.load(f)
    except: return DEFAULT_UPLOADS.copy()

def save_uploads(u: dict):
    with open(UPLOADS, "w", encoding="utf-8") as f: json.dump(u, f, indent=2)

def ensure_user(wallets: dict, user: str):
    wallets["users"].setdefault(user, {"octave": 0, "infinity": 0, "mongoose": 0})

def grant_daily(user: str, amount: int):
    w = load_wallets(); ensure_user(w, user)
    w["users"][user]["infinity"] += amount
    save_wallets(w); audit({"action": "grant.daily", "user": user, "amount": amount})
    path = os.path.join(ART, f"grant_daily_{user}_{int(time.time())}.json")
    with open(path, "w", encoding="utf-8") as f: json.dump({"user": user, "amount": amount, "wallet": w["users"][user]}, f, indent=2)
    print(json.dumps({"ok": True, "user": user, "amount": amount, "path": path}, indent=2))

def grant_research(user: str, title: str):
    token = {"kind": "research", "title": title, "author": user, "created": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime()), "color": "blue", "value_hint": "high"}
    path = os.path.join(ART, f"grant_research_{int(time.time())}.json")
    with open(path, "w", encoding="utf-8") as f: json.dump(token, f, indent=2)
    audit({"action": "grant.research", "user": user, "title": title})
    print(json.dumps({"ok": True, "token_path": path}, indent=2))

def register_upload(kind: str, user: str, title: str, url: str):
    u = load_uploads()
    item = {"kind": kind, "user": user, "title": title, "url": url, "created": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime()), "scan_status": "pending"}
    u["items"].append(item); save_uploads(u)
    path = os.path.join(ART, f"upload_{kind}_{int(time.time())}.json")
    with open(path, "w", encoding="utf-8") as f: json.dump(item, f, indent=2)
    audit({"action":"upload", "kind": kind, "user": user, "title": title})
    print(json.dumps({"ok": True, "path": path}, indent=2))

def record_sale_paypal(user: str, amount: float, note: str):
    sale = {"user": user, "amount": amount, "currency": "USD", "note": note, "platform": "paypal", "created": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())}
    path = os.path.join(ART, f"sale_paypal_{int(time.time())}.json")
    with open(path, "w", encoding="utf-8") as f: json.dump(sale, f, indent=2)
    audit({"action":"sale.paypal","user":user,"amount":amount})
    print(json.dumps({"ok": True, "path": path}, indent=2))

def main():
    args = sys.argv[1:]
    if not args:
        print("Usage: grant daily --user U --amount 48 | grant research --user U --title \"...\" | upload <music|video|doc> --user U --title \"...\" --url https://... | sale paypal --user U --amount 10.00 --note \"...\"")
        return
    if args[0] == "grant":
        kind = args[1]
        user="guest"; amount=48; title=None
        for i,a in enumerate(args):
            if a == "--user" and i+1 < len(args): user = args[i+1]
            if a == "--amount" and i+1 < len(args): amount = int(float(args[i+1]))
            if a == "--title" and i+1 < len(args): title = args[i+1]
        if kind == "daily": grant_daily(user, amount); return
        if kind == "research" and title: grant_research(user, title); return
    if args[0] == "upload":
        kind = args[1]; user="guest"; title="Untitled"; url=""
        for i,a in enumerate(args):
            if a == "--user" and i+1 < len(args): user = args[i+1]
            if a == "--title" and i+1 < len(args): title = args[i+1]
            if a == "--url" and i+1 < len(args): url = args[i+1]
        register_upload(kind, user, title, url); return
    if args[0] == "sale" and args[1] == "paypal":
        user="guest"; amount=0.0; note=""
        for i,a in enumerate(args):
            if a == "--user" and i+1 < len(args): user = args[i+1]
            if a == "--amount" and i+1 < len(args): amount = float(args[i+1])
            if a == "--note" and i+1 < len(args): note = args[i+1]
        record_sale_paypal(user, amount, note); return
    print("Unknown command.")

if __name__ == "__main__":
    main()