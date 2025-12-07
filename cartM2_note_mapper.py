#!/usr/bin/env python3
import math, sys, argparse

NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

def freq_to_note(freq, a4_ref=440.0, detailed=False):
    if freq <= 0: return ("Rest",0) if detailed else "Rest"
    try:
        n = 12*math.log2(freq/a4_ref)
        midi = round(n) + 69
        cents = (n-round(n))*100
        note = NOTE_NAMES[midi%12]
        octave = midi//12 - 1
        return (f"{note}{octave}", round(cents,2)) if detailed else f"{note}{octave}"
    except:
        return ("Error",0) if detailed else "Error"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(freq_to_note(float(sys.argv[1])))
