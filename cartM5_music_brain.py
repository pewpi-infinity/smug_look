#!/usr/bin/env python3
from cartM1_pitch_engine import get_frequency
from cartM2_note_mapper import freq_to_note
from cartM4_staff_renderer import render_staff

notes = []

print("∞ Infinity Music Brain — Whistle to record notes. Ctrl+C to stop.")

while True:
    try:
        f = get_frequency()
        note = freq_to_note(f)
        notes.append(note)
        print(f"\nDetected: {note}")
        print(render_staff(notes))
    except KeyboardInterrupt:
        print("\nSession:")
        print(notes)
        break
