#!/usr/bin/env python3
import os, json, random, datetime, textwrap

# ===== CONFIG =====
ARTICLES_PER_BATCH = 100
OUTPUT_DIR = "research_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Color states for terminal + embed
COLORS = {
    "RED": "\033[91m",
    "YELLOW": "\033[93m",
    "GREEN": "\033[92m",
    "PURPLE": "\033[95m",
    "END": "\033[0m"
}

# Load topic matrix if available
matrix_file = "CART250_TOPIC_MATRIX.json"
if os.path.exists(matrix_file):
    with open(matrix_file) as f:
        MATRIX = json.load(f)
else:
    MATRIX = {"terms": ["hydrogen","water","solution","python","executive","cat"]}

# Helper: pick random
def pick(arr):
    return random.choice(arr)

# Infinity value calculation
def compute_value():
    base = random.randint(1500, 3500)
    noise = random.randint(-200, 200)
    return max(50, base + noise)

# Pick color state
def color_state(value):
    if value > 3000: return "PURPLE"
    if value > 2500: return "YELLOW"
    if value > 2000: return "GREEN"
    return "RED"


# ===== MAIN GENERATOR =====
def generate_article(idx):
    token_num = 1500 + idx
    value = compute_value()
    color = color_state(value)
    now = datetime.datetime.utcnow().isoformat()

    # Topic selection
    term1 = pick(MATRIX["terms"])
    term2 = pick(MATRIX["terms"])
    term3 = pick(MATRIX["terms"])

    topic = f"{term1.title()} {term2.title()} {term3.title()} Theory"

    # Fake structured research
    exec_summary = (
        f"The topic *{topic.lower()}* examines depth interactions between "
        f"{term1}, {term2}, and {term3} inside complex material-science and "
        "quantum-field frameworks. This summary outlines the primary scientific "
        "mechanisms relevant to the research domain."
    )

    arxiv_section = (
        f"**Exploration of {term1}-based quantum interactions**\n"
        f"Abstracts across arXiv show relationships between {term1} dynamics, "
        f"solution-state transitions involving {term2}, and emergent lattice "
        f"effects influenced by {term3}."
    )

    crossref_section = (
        f"**Crossref Literature on {term2}-structured media**\n"
        f"Published works indicate strong correlation between solution-phase "
        f"behavior and field-driven resonance cycles."
    )

    openalex_section = (
        f"**High-density OpenAlex entries referencing {term3} mechanics**\n"
        f"Scholarly flows include material-microstructure, catalytic pathways, and "
        f"advanced computational simulations."
    )

    infinity_layer = (
        f"The Infinity OS physics engine maps {term1}/{term2}/{term3} into a "
        "unified structure through hydrogen-electronic doorway matching, lattice "
        "resonance, and oxide-transition spectral gates."
    )

    conclusion = (
        "High cross-reference density increases Infinity Token richness.\n"
        "This article serves as a root node for expansion in future research layers."
    )

    # Build file content
    text = f"""
# ∞ Infinity Research Article — {topic}

### Token #{token_num}
### Infinity Value: {value}
### Color State: {color}
### Generated: {now}

## Executive Summary
{textwrap.fill(exec_summary, width=90)}

---

## Main Scientific Findings
### arXiv Papers
{textwrap.fill(arxiv_section, width=90)}

### Crossref Literature
{textwrap.fill(crossref_section, width=90)}

### OpenAlex Research
{textwrap.fill(openalex_section, width=90)}

---

## Infinity Interpretation Layer
{textwrap.fill(infinity_layer, width=90)}

---

## Conclusion
{textwrap.fill(conclusion, width=90)}
"""

    # Save
    filename = os.path.join(OUTPUT_DIR, f"research_{token_num}.txt")
    with open(filename, "w") as f:
        f.write(text.strip())

    # Print colored output to terminal
    print(f"{COLORS[color]}[∞ ARTICLE GENERATED] Token #{token_num} — {topic}{COLORS['END']}")
    return filename


# === RUN ===
print("=== Infinity Research Batch Generator (100 Articles) ===")
files = []
for i in range(ARTICLES_PER_BATCH):
    files.append(generate_article(i))

print("\n[∞ COMPLETE] 100 research articles generated.")
print(f"[∞ STORED IN] {OUTPUT_DIR}/")
print("[∞ READY FOR ZIP + PUSH]")
