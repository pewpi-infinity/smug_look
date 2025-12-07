#!/usr/bin/env python3
# Creates a basic MIDI file without external libs

HEADER = bytes([
    0x4D,0x54,0x68,0x64,  # "MThd"
    0x00,0x00,0x00,0x06,
    0x00,0x01,
    0x00,0x01,
    0x00,0x60
])

def note_to_midi(note):
    name = note[:-1]
    octave = int(note[-1])
    MAP = {"C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11}
    return MAP[name] + (octave+1)*12

def write_midi(notes, outfile="output.mid"):
    track = bytearray()
    for n in notes:
        midi = note_to_midi(n)
        track += bytes([0x00,0x90,midi,0x64]) # note on
        track += bytes([0x60,0x80,midi,0x40]) # note off
    chunk = b"MTrk" + len(track).to_bytes(4,"big") + track
    with open(outfile,"wb") as f:
        f.write(HEADER + chunk)
    return outfile

if __name__ == "__main__":
    print(write_midi(["A4","C5","E5"]))
