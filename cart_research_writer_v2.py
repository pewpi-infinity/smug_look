#!/usr/bin/env python3
import os, json, time, random
from generate_new_terms import new_terms
from check_existing_research import list_terms

def generate_paper(term):
    return {
        "token": random.randint(10000,99999),
        "infinity_value": random.randint(5000,12000),
        "term": term,
        "timestamp": time.time(),
        "content": (
            f"∞ Infinity Research File ∞\n"
            f"Topic: {term}\n"
            f"-----------------------------------------\n"
            f"This document provides a new Infinity OS analysis "
            f"expanding high-dimensional relationships, lattice physics, "
            f"hydrogen portal dynamics, or frequency-ionization effects.\n"
        )
    }

def main():
    os.makedirs("research_output", exist_ok=True)

    existing = list_terms()
    fresh = new_terms(20)

    clean_terms = [t for t in fresh if t not in existing]

    if not clean_terms:
        print("[∞] No new terms available. Generate again.")
        return

    for term in clean_terms:
        paper = generate_paper(term)
        name = f"research_output/{term}_{paper['token']}.json"
        with open(name, "w") as f:
            json.dump(paper, f, indent=2)
        print(f"[∞] New research saved → {name}")

if __name__ == "__main__":
    main()
