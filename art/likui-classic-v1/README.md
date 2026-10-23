# Li Kui · Approved Classic standing

Standing design approved by the user on 23 October 2026. Not installed in the game. Authored directions are front, left and back; right, walking and battle are pending.

Li Kui’s own portrait supplies wild tied black hair, a full beard, dark tan skin, a scarred exposed chest and ragged sleeveless charcoal vest with rope fastenings. Song Jiang’s original Classic is the proportions/style anchor. Lu Zhishen supplies the broad build reference, with a distinct costume and silhouette.

- `likui-original.png`: exact native transparent generated source, preserved unchanged.
- `prompt-v1.txt` and `generation.json`: exact prompt, built-in generation provenance and reference paths.
- `likui-front.png`, `likui-left.png`, `likui-back.png`: 192 × 256 transparent cells.
- `likui-turnaround.png`: 576 × 256 front/left/back strip.
- `likui-review-sheet.png`: 576 × 1024 with repeated standing front/left/back rows and a completely blank right row. It is not a walking animation.
- `pack.cjs` and `packing.json`: alpha > 200 figure detection, two-pixel crop padding, one shared nearest-neighbour scale from native source, 236-pixel target height, baseline 255 and lossless RGBA copying. No palette reduction or scripted recolouring.
- `in-game.html` / `in-game.js`: standalone preview comparing Song Jiang Classic, Li Kui and Lu Zhishen on tavern interior, marsh tavern and Liangshan courtyard. Logical size 24 × 32, artScale 8, 8× world buffer.
- `compare.html`: enlarged packed strips, native source and original Classic reference.
- `check-browser.cjs` / `browser-checks.json`: local HTTP/Chrome preview verification; screenshots begin `game-`.

Open through an HTTP server rooted at the repository. The standalone preview intentionally exposes only the three authored directions.

Standing design approved by the user on 23 October 2026; four-direction animation is now in progress in a separate motion folder.
