# Outlaws of the Marsh (水滸傳)

A 2D RPG in the browser that retells the whole of *Water Margin* (the 120-chapter edition), from the release of the
hundred and eight demons on Dragon-Tiger Mountain to the graves at Liaoerwa. The gameplay follows *Gensou Suikoden II*:

- **Field.** Free 8-direction movement, dashing, towns, dungeons and a world map.
- **Battles.** Turn-based, with a 6-member party in front and back rows, and weapon ranges (short, medium, long).
- **Rune-style talismans.** Charges per spell level. Unite attacks. A round menu of Fight / Bribe / Run / Auto / Let Go.
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
