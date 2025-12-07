# cart042_hydrogen_expansion_engine.py
"""
Cart 042: Hydrogen Expansion Engine
Computational stretch/shrink engine for hydrogen power planning:
- Scaling functions: stretch (expand energy window), shrink (conserve)
- Profiles: mission, factory, research
- Outputs: scaled kWh budgets, logs, and manifests
- Artifacts + audit logs
"""

import sys, os, json, time

ROOT=os.path.dirname(os.path.abspath(__file__))
LOGS=os.path.join(ROOT,"logs"); os.makedirs(LOGS,exist_ok=True)
ART=os.path.join(ROOT,"artifacts"); os.makedirs(ART,exist_ok=True)

AUDIT=os.path.join(LOGS,"hydrogen_expansion_audit.jsonl")

def now(): return time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
def audit(e): e=dict(e); e["t"]=now(); 
with open(AUDIT,"a",encoding="utf-8") as f: f.write(json.dumps(e)+"\n")

def save_artifact(name,obj):
    p=os.path.join(ART,f"{name}.json")
    with open(p,"w",encoding="utf-8") as f: json.dump(obj,f,indent=2)
    return p

# ---------- Scaling ----------
def stretch(kwh: float, factor: float) -> float:
    return max(0.0, kwh * (1.0 + abs(factor)))

def shrink(kwh: float, factor: float) -> float:
    return max(0.0, kwh * (1.0 - min(abs(factor), 0.99)))

def plan(profile: str, base_kwh: float, stretch_factor: float = 0.0, shrink_factor: float = 0.0):
    k1 = stretch(base_kwh, stretch_factor)
    k2 = shrink(k1, shrink_factor)
    out={"profile":profile,"base_kWh":base_kwh,"stretch_factor":stretch_factor,"shrink_factor":shrink_factor,"planned_kWh":round(k2,6)}
    path=save_artifact(f"hydrogen_expansion_{profile}_{int(time.time())}", out)
    audit({"action":"plan","profile":profile,"base":base_kwh,"planned":k2})
    return {"ok":True,"path":path,"planned":out}

def main():
    a=sys.argv[1:]
    if not a:
        print("Usage: plan --profile mission|factory|research --base kWh [--stretch f] [--shrink f]")
        return
    if a[0]=="plan":
        profile="mission"; base=1.0; sf=0.2; rf=0.1
        for i,x in enumerate(a):
            if x=="--profile" and i+1<len(a): profile=a[i+1]
            if x=="--base" and i+1<len(a): base=float(a[i+1])
            if x=="--stretch" and i+1<len(a): sf=float(a[i+1])
            if x=="--shrink" and i+1<len(a): rf=float(a[i+1])
        print(json.dumps(plan(profile, base, sf, rf), indent=2)); return
    print(json.dumps({"error":"unknown command"}, indent=2))

if __name__=="__main__": main()