"""Pack generated poses; preserve source standing frames, shared scales, bottom anchors."""
from pathlib import Path
from PIL import Image
import importlib.util,json
root=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('normalize','/Users/andriastaniwan/.codex/plugins/cache/openai-curated-remote/game-studio/0.1.2/scripts/normalize_sprite_strip.py')
norm=importlib.util.module_from_spec(spec);spec.loader.exec_module(norm)
master=Image.open(root.parent/'songjiang-game-preview/design.png').convert('RGBA')
def hard_alpha(im):
 im=im.copy();im.putalpha(im.getchannel('A').point(lambda a:255 if a>=200 else 0));return im
crops=[(80,94,416,838),(1120,104,342,828),(1120,104,342,828),(575,94,425,838)]
seeds=[]
for row,(x,y,w,h) in enumerate(crops):
 part=master.crop((x,y,x+w,y+h)).resize((round(w*54/h),54),Image.Resampling.NEAREST)
 frame=Image.new('RGBA',(48,64));frame.alpha_composite(part,((48-part.width)//2,10))
 if row==2:frame=frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 seeds.append(hard_alpha(frame))
raw=hard_alpha(Image.open(root/'walking-raw.png').convert('RGBA'))
parts=[]
for row in range(4):
 strip=raw.crop((0,round(row*raw.height/4),raw.width,round((row+1)*raw.height/4)))
 parts+= [norm.crop_to_content(slot,200) for slot in norm.split_strip(strip,3)]
scale=min(54/max(p.height for p in parts),46/max(p.width for p in parts))
frames=[]
for i,p in enumerate(parts):
 f=norm.compose_frame(p,64,scale).crop((8,0,56,64))
 if i%3==0:f=seeds[i//3]
 frames.append(f)
walking=Image.new('RGBA',(144,256))
for i,f in enumerate(frames):walking.alpha_composite(f,((i%3)*48,(i//3)*64))
walking.save(root/'songjiang-walking.png')
raw=hard_alpha(Image.open(root/'jian-raw.png').convert('RGBA'))
battleparts=[norm.crop_to_content(slot,200) for slot in norm.split_strip(raw,3)]
# Body height estimated from the right half of each slot, excluding the raised blade.
body_heights=[]
for slot in norm.split_strip(raw,3):
 body=norm.crop_to_content(slot.crop((slot.width//2,0,slot.width,slot.height)),200)
 body_heights.append(body.height)
bs=min(54/max(body_heights),64/max(p.height for p in battleparts),46/max(p.width for p in battleparts))
battleframes=[norm.compose_frame(p,64,bs).crop((8,0,56,64)) for p in battleparts]
battle=Image.new('RGBA',(144,64))
for i,f in enumerate(battleframes):battle.alpha_composite(f,(i*48,0))
battle.save(root/'songjiang-jian.png')
walking.resize((576,1024),Image.Resampling.NEAREST).save(root/'walking-preview.png')
battle.resize((864,384),Image.Resampling.NEAREST).save(root/'jian-preview.png')
report={'walking_size':walking.size,'battle_size':battle.size,'frame_size':[48,64],'walking_shared_scale':scale,'battle_shared_scale':bs,'standing_frames_match_master':all(frames[r*3].tobytes()==seeds[r].tobytes() for r in range(4)),'walking_content_heights':[f.getbbox()[3]-f.getbbox()[1] for f in frames],'battle_content_heights':[f.getbbox()[3]-f.getbbox()[1] for f in battleframes], 'limits':'Generated moving poses are not pixel-identical to master proportions. Repeated stride phases still require cleanup. Right standing frame is mirrored.'}
(root/'checks.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
