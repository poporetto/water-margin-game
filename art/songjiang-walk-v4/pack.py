"""Pack the generated eye correction and synchronized upper-body motion."""
from pathlib import Path
from PIL import Image
import json

p = Path(__file__).resolve().parent
source = p.parent / "songjiang-walk-v3"
edited = Image.open(p / "eye-edit.png").convert("RGBA")
seed = Image.open(source / "stand-0.png").convert("RGBA")
# Register only the edited eye region; retain the rest of the original artwork.
patch = edited.crop((227, 665, 440, 773)).resize((4, 2), Image.Resampling.NEAREST)
palette = list({rgb for rgb in seed.getdata() if rgb[3] == 255})
patch.putdata([
    min(palette, key=lambda c: sum((c[k] - px[k]) ** 2 for k in range(3)))
    for px in patch.getdata()
])
frames = []
for row in range(4):
    for col in range(3):
        frame = Image.open(source / f"{row}-{col}.png").convert("RGBA")
        if row == 0:
            frame.paste(patch, (18, 24))
        if col:
            # Translate head, neck, shoulders and robe together. No rescaling.
            # Keep planted feet and the existing lower-leg motion on the ground.
            upper = frame.crop((0, 0, 48, 53))
            frame.paste((0, 0, 0, 0), (0, 0, 48, 54))
            frame.paste(upper, (0, 1))
        frame.save(p / f"{row}-{col}.png")
        frames.append(frame)

sheet = Image.new("RGBA", (144, 256))
for i, frame in enumerate(frames):
    sheet.paste(frame, ((i % 3) * 48, (i // 3) * 64))
sheet.save(p / "songjiang-walking.png")
sheet.resize((576, 1024), Image.Resampling.NEAREST).save(p / "walking-preview.png")
sequence = []
for col in [0, 1, 0, 2]:
    canvas = Image.new("RGBA", (192, 64), "#77746b")
    for row in range(4):
        canvas.alpha_composite(frames[row * 3 + col], (row * 48, 0))
    sequence.append(canvas.convert("RGB").resize((768, 256), Image.Resampling.NEAREST))
sequence[0].save(p / "walk-cycle.gif", save_all=True, append_images=sequence[1:],
                 duration=180, loop=0, disposal=2)
heads_move = all(
    frames[row*3].crop((0, 0, 48, 30)).tobytes()
    == frames[row*3+col].crop((0, 1, 48, 31)).tobytes()
    for row in range(4) for col in [1, 2]
)
assert heads_move
assert all(frame.getbbox()[3] == 64 for frame in frames)
(p / "checks.json").write_text(json.dumps({
    "frame_size": [48, 64], "sheet_size": list(sheet.size),
    "step_head_offset": [0, 1], "exact_head_translation": heads_move,
    "foot_baseline": 64, "eye_patch_uses_original_palette": True,
}, indent=2))
