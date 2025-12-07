#!/usr/bin/env python3

STAFF_LINES = ["F5","E5","D5","C5","B4","A4","G4","F4","E4","D4"]

def render_staff(notes):
    grid = {line:"" for line in STAFF_LINES}
    for n in notes:
        for line in STAFF_LINES:
            if n == line:
                grid[line] += " ● "
            else:
                grid[line] += "   "
    return "\n".join(f"{k} |{v}" for k,v in grid.items())

if __name__ == "__main__":
    print(render_staff(["A4","C5","E5"]))
