from pathlib import Path
from PIL import Image
import importlib.util,json
p=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('norm','/Users/andriastaniwan/.codex/plugins/cache/openai-curated-remote/game-studio/0.1.2/scripts/normalize_sprite_strip.py');norm=importlib.util.module_from_spec(spec);spec.loader.exec_module(norm)
raw=Image.open(p/'walking-raw.png').convert('RGBA');raw.putalpha(raw.getchannel('A').point(lambda a:255 if a>=200 else 0))
parts=[]
for row in range(4):
 strip=raw.crop((0,round(row*raw.height/4),raw.width,round((row+1)*raw.height/4)))
 parts += [norm.crop_to_content(f,200) for f in norm.split_strip(strip,3)]
scale=52/max(f.height for f in parts)
frames=[]
for row in range(4):
 seed=Image.open(p/f'stand-{row}.png').convert('RGBA')
 for col in range(3):
  f=norm.compose_frame(parts[row*3+col],64,scale).crop((8,0,56,64))
  # Lock the approved head at the exact pixel coordinates in every frame.
  f.paste(seed.crop((0,0,48,30)),(0,0))
  if col==0:f=seed.copy()
  f.save(p/f'{row}-{col}.png');frames.append(f)
sheet=Image.new('RGBA',(144,256))
for i,f in enumerate(frames):sheet.alpha_composite(f,((i%3)*48,(i//3)*64))
sheet.save(p/'songjiang-walking.png')
sheet.resize((576,1024),Image.Resampling.NEAREST).save(p/'walking-preview.png')
steps=[]
for col in [0,1,0,2]:
 out=Image.new('RGBA',(192,64))
 for row in range(4):out.alpha_composite(frames[row*3+col],(row*48,0))
 bg=Image.new('RGBA',out.size,'#77746b');bg.alpha_composite(out)
 steps.append(bg.convert('RGB').resize((768,256),Image.Resampling.NEAREST))
steps[0].save(p/'walk-cycle.gif',save_all=True,append_images=steps[1:],duration=180,loop=0,disposal=2)
checks={'size':sheet.size,'cell':[48,64],'shared_scale':scale,'heads_identical_to_master':all(frames[r*3+c].crop((0,0,48,30)).tobytes()==Image.open(p/f'stand-{r}.png').convert('RGBA').crop((0,0,48,30)).tobytes() for r in range(4) for c in range(3)), 'standing_identical_to_master':all(frames[r*3].tobytes()==Image.open(p/f'stand-{r}.png').convert('RGBA').tobytes() for r in range(4)), 'distinct_steps_each_direction':[frames[r*3+1].tobytes()!=frames[r*3+2].tobytes() for r in range(4)],'bottom_baselines':[f.getbbox()[3] for f in frames]}
(p/'checks.json').write_text(json.dumps(checks,indent=2));print(checks)
