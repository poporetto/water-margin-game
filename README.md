# Outlaws of the Marsh (水滸傳)

A 2D RPG in the browser that retells the whole of *Water Margin* (the 120-chapter edition), from the release of the
hundred and eight demons on Dragon-Tiger Mountain to the graves at Liaoerwa. The gameplay follows *Gensou Suikoden II*:

- **Field.** Free 8-direction movement, dashing, towns, dungeons and a world map.
- **Battles.** Turn-based, with a 6-member party in front and back rows, and weapon ranges (short, medium, long).
- **Skills.** Every hero who fights has three skills of their own, taken from their deeds in the novel (Lu Zhishen's Three Punches, Hua Rong's arrow through the wild goose, Li Kui's Black Whirlwind). The second opens at level 8 and the third at level 18. Like Suikoden's rune charges, each skill level has a number of uses, restored at an inn or with incense. Also Unite attacks, and a round menu of Fight / Bribe / Run / Auto / Let Go.
- **Duels.** One-on-one fights read from the enemy's lines: Attack beats Defend, Wild beats Attack, Defend beats Wild.
- **War battles.** Grid-based army battles where each unit is led by a hero with supporting heroes, terrain matters,
  and leaders have special abilities.
- **Liangshan, the castle.** It grows as Stars join. Every recruited hero lives there, and facility keepers open their
  workshops. The Roll of Heroes becomes the Stone Tablet after the Grand Assembly.

## Playing

The game uses no build step and no dependencies. Serve the folder and open `index.html`:

```bash
python3 tools/serve.py 8766
```

Then open <http://localhost:8766>.

- **Movement:** arrow keys or WASD. Hold Shift to dash.
- **Confirm:** Z, Enter or Space.
- **Cancel:** X, Escape or Backspace.
- **Menu:** C or Tab, or Cancel on the field.
- **Page:** Q and E turn pages in menus.

A copy of the playable page lives in `docs/` for GitHub Pages (Settings → Pages → deploy from branch, `/docs` folder). After changing the game, refresh it with `tools/build.sh`.

On phones and tablets, on-screen controls appear at the first touch: a D-pad, A (confirm), B (cancel), Menu, Dash, and L/R. In portrait the game sits above the controls. Landscape gives a larger picture, with the controls in the side bars.

Saves use the browser's `localStorage`, with 8 slots. Record keepers (the scribe NPCs) and the Liangshan records office offer saves.

Debug mode is `?debug` (for example <http://localhost:8766/?debug>). A **Chapters** button appears in the top-left corner: tap it to jump straight into any chapter, from the title screen or mid-game. F2 opens the full debug menu, which can also warp, level up, and recruit everyone. Without `?debug` none of this is shown.

## Story

`docs/STORY.md` holds the chapter plan, who joins when, the source table for the Fang La campaign deaths, and a note on
which arcs are played and which are condensed. Each game chapter is one file in `js/data/story/`, and its maps are in
`js/data/maps/`.

## Art

Illustrated members of the 108 Stars use muted yellow Chinese paper backgrounds;
other characters use blue paper. Preserve natural skin tones, distinct facial features,
and character-specific expressions and poses. Lu Da shares Lu Zhishen’s Star status;
Chao Gai is not one of the 108 Stars and keeps blue.

The prologue has six illustrated expressions each for Hong Xin, the Abbot of Shangqing,
the Herd-Boy and the temple Daoist. Preview them at `tools/prologue-portraits.html`.
Their `assets/portraits/<id>-expressions.png` sheets use a 3-column, 2-row layout:
normal, angry, sad, smile, shock, concerned. `assets/manifest.js` declares the layout;
dialogue tags such as `hongxin:shock` select a cell, with normal as the fallback.
Run `node tools/test-portrait-expressions.js` to check expression selection and prologue coverage.

Song Jiang, Lin Chong, Lu Zhishen, Wu Song, Wu Yong and Hua Rong use illustrated portraits. Other portraits, sprites, tiles and monsters are drawn procedurally in code. To replace the art for any character, drop
in a PNG and list its id in `assets/manifest.js`:

```js
WM.ASSETS = { portraits: ['linchong', 'songjiang'], sprites: ['linchong'] };
```

- `assets/portraits/<id>.png` can be any size. It is shown scaled into the 144x168 portrait frame, top-aligned without stretching, and
  the same image is used for every expression.
- `assets/sprites/<id>.png` is a field sprite sheet of 3 columns (stand, step, step) by 4 rows (down, left, right, up).
  Each cell is drawn at the procedural sprite's size, so 24x30 cells (a 72x120 sheet) fit best.

Character ids are in `js/data/chars.js` for the 108 and the guests, and in `WM.npc(...)` calls for everyone else.
Use the second Zhang Qing's id, `zhangqing2`, for "the Gardener"; `zhangqing` is "Featherless Arrow".

## Tools

```bash
node tools/validate.js
```

Checks static data: maps, exits and spawns that land on walkable tiles, items, troops, unites.

```bash
node tools/walk.js
```

The headless story walker. It plays every event of every chapter from the prologue to the ending, and checks:

- speakers, actors, tiles and warps;
- reachability on each map;
- that no hero joins twice;
- the running count of Stars at each chapter end;
- that no dead or departed hero appears in a later scene;
- the number of dead and departed at the end.

```bash
node tools/headless.js map <id>
```

Prints a map as ASCII.

Chapter 1 illustrated portraits cover 16 characters with six expressions each (96 cells).
Preview and test dialogue at `tools/chapter1-portraits.html`. Sheets load once on first use;
dialogue waits for its portrait, with procedural fallback if loading fails.
Lu Da retains hair and military clothing for his pre-monastery appearance.
Run `node tools/test-portrait-expressions.js` to check sheet mapping, fallback, and dialogue loading.

Chapter 2 adds 22 expression sheets and reuses four returning cast sheets: 26 characters,
156 expressions in `tools/chapter2-portraits.html`. The cast uses distinct facial designs
within the established painted anime style. Wang Jin, the duty officer and guard officer
also have revised identities; Wang Jin has a short beard, the duty officer a leaner build,
and the guard officer a more mature face. Generation prompts are in
`output/imagegen/chapter2-expression-prompts.json` and `chapter1-face-refinements.json`.

Chapter 3 adds 23 expression sheets and reuses seven returning cast sheets: 30 characters,
180 expressions in `tools/chapter3-portraits.html`. Story and duel dialogue use the same
six-expression mapping. The servant and Liangshan guide now show portraits too.
Lu Qian is clean-shaven to match his description in the chapter. Generated with the built-in
image tool; the complete prompt set is `output/imagegen/chapter3-expression-prompts.json`.

Chapter 4 adds six expression sheets and reuses Yang Zhi and Gao Qiu: eight characters,
48 expressions in `tools/chapter4-portraits.html`. All story speakers and the three
duels have portrait coverage. Prompts: `output/imagegen/chapter4-expression-prompts.json`.

Chapter 5 adds 18 expression sheets (including Song Jiang and Wu Yong expanded from their
approved portraits), plus seven returning sets: 25 characters and 150 expressions in
`tools/chapter5-portraits.html`. Story, duel and war speakers are covered. Wu Yong keeps
his feather fan; the Ruan brothers have individual facial designs. Built-in image generation
prompts are saved in `output/imagegen/chapter5-expression-prompts.json`.

Chapter 6 adds eight expression sheets, including Wu Song expanded from his approved
portrait, and reuses four returning sets: 12 characters and 72 expressions in
`tools/chapter6-portraits.html`. Every story speaker has portrait coverage; expressions
follow the chapter's emotional beats. Built-in image generation prompts and facial-design
refinements are saved in `output/imagegen/chapter6-expression-prompts.json` and
`output/imagegen/chapter6-refinements.json`.
