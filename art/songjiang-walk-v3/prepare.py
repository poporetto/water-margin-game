from PIL import Image
from pathlib import Path
p=Path(__file__).resolve().parent
im=Image.open(p.parent/'songjiang-game-preview/design.png').convert('RGBA')
crops=[(80,96,416,832),(1120,96,352,832),(1120,96,352,832),(576,96,432,832)]
sheet=Image.new('RGBA',(144,256))
for row,(x,y,w,h) in enumerate(crops):
 part=im.crop((x,y,x+w,y+h)).resize((w//16,h//16),Image.Resampling.NEAREST)
 frame=Image.new('RGBA',(48,64));frame.alpha_composite(part,((48-part.width)//2,64-part.height))
 if row==2:frame=frame.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 frame.putalpha(frame.getchannel('A').point(lambda a:255 if a>=200 else 0))
 frame.save(p/f'stand-{row}.png')
 for col in range(3):sheet.alpha_composite(frame,(48*col,64*row))
sheet.save(p/'seed-sheet.png');sheet.resize((864,1536),Image.Resampling.NEAREST).save(p/'edit-canvas.png')
