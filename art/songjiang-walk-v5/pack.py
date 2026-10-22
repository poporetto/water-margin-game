"""Repair the source-frame seam through the complete beard and collar."""
from pathlib import Path
from PIL import Image
import json

p = Path(__file__).resolve().parent
source = p.parent / "songjiang-walk-v4"
frames = []
for row in range(4):
    idle = Image.open(source / f"{row}-0.png").convert("RGBA")
    for col in range(3):
        frame = Image.open(source / f"{row}-{col}.png").convert("RGBA")
        if row < 3 and col:
            # Replace the entire seam region, including transparent pixels.
            # Alpha-over alone would retain the old dangling beard underneath.
            frame.paste((0, 0, 0, 0), (0, 0, 48, 37))
            frame.paste(idle.crop((0, 0, 48, 36)), (0, 1))
        frame.save(p / f"{row}-{col}.png")
        frames.append(frame)

sheet = Image.new("RGBA", (144, 256))
for i, frame in enumerate(frames):
    sheet.paste(frame, ((i % 3) * 48, (i // 3) * 64))
sheet.save(p / "songjiang-walking.png")
sheet.resize((576, 1024), Image.Resampling.NEAREST).save(p / "walking-preview.png")
sequence = []
closeups = []
for col in [0, 1, 0, 2]:
    canvas = Image.new("RGBA", (192, 64), "#77746b")
    detail = Image.new("RGBA", (144, 30), "#77746b")
    for row in range(4):
        canvas.alpha_composite(frames[row * 3 + col], (row * 48, 0))
        if row < 3:
            detail.alpha_composite(frames[row * 3 + col].crop((0, 10, 48, 40)), (row*48, 0))
    sequence.append(canvas.convert("RGB").resize((768, 256), Image.Resampling.NEAREST))
    closeups.append(detail.convert("RGB").resize((864, 180), Image.Resampling.NEAREST))
for name, images in [("walk-cycle.gif", sequence), ("chin-check.gif", closeups)]:
    images[0].save(p / name, save_all=True, append_images=images[1:],
                   duration=200, loop=0, disposal=2)

for row in range(3):
    for col in [1, 2]:
        assert frames[row*3].crop((0, 0, 48, 36)).tobytes() == frames[row*3+col].crop((0, 1, 48, 37)).tobytes()
for row in range(4):
    for col in range(3):
        original = Image.open(source / f"{row}-{col}.png").convert("RGBA")
        assert frames[row*3+col].crop((0, 37, 48, 64)).tobytes() == original.crop((0, 37, 48, 64)).tobytes()
assert all(f.getbbox()[3] == 64 for f in frames)
(p / "checks.json").write_text(json.dumps({
    "head_beard_collar_exact_translation": True,
    "bob_pixels": 1, "unchanged_lower_body": True,
    "foot_baseline": 64, "frame_duration_ms": 200,
    "sequence": [0, 1, 0, 2],
}, indent=2))
