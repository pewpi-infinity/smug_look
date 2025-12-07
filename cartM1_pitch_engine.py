#!/usr/bin/env python3
import math, struct, sys, wave, audioop
import sounddevice as sd

def get_frequency(duration=0.4, samplerate=44100):
    audio = sd.rec(int(duration * samplerate), samplerate=samplerate,
                   channels=1, dtype='int16')
    sd.wait()
    data = audio.tobytes()
    # Zero-crossing frequency detection
    crossings = 0
    last = 0
    count = 0
    for i in range(0, len(data), 2):
        sample = struct.unpack('<h', data[i:i+2])[0]
        if sample > 0 and last <= 0:
            crossings += 1
        last = sample
        count += 1
    freq = (crossings * samplerate) / (2 * count)
    return freq

if __name__ == "__main__":
    f = get_frequency()
    print(f"{f:.2f}")
