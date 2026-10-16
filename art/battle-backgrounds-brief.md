# Battle and duel backgrounds

Water Margin, a Suikoden II–style RPG set in Northern Song China, c. 1120. Battles and one-on-one duels are fought in front of a painted backdrop, the same set for both. Today these are drawn by code (a sky gradient, a hill line and a few props); this list is for drawn replacements. Match the pixel-art style of the field tiles and character sprites already in the game.

## Format

- **Size: 480 × 260 px**, pixel art with hard edges, no anti-aliasing or blur. The game shows it at 960 × 520 (each pixel doubled). One PNG per background, no UI, no characters.
- **Composition:**
  - The horizon sits about **a third of the way down** (around y = 80 of 260).
  - Everything below the horizon is ground the fighters stand on: keep the lower two thirds fairly open and even, with detail at the edges, not the middle.
  - Fighters stand in two groups, enemies on the left half and the party on the right, feet at roughly y = 150–200.
  - A dialogue box covers the bottom of the screen, so nothing important belongs in the bottom 20 px.
- **View:** looking across level ground towards the horizon (a side-on stage), not top-down.
- **Palette:** earthy and muted, as in the field art. Night and fire scenes may be darker and warmer.

## The backgrounds, most used first

| # | Name | Used for | What it should show |
|---|---|---|---|
| 1 | **forest** | 39 fights: Black Pine Forest, Jingyang Ridge, Boar Forest, Jieling, Yinma River, the Zhu manor approach, Mount Mangdang; duels Lu Zhishen vs Shi Jin, Wu Song, Li Kui vs Li Yun, Fang La | dense mixed woodland: dark pines and broadleaf trees across the back, a forest floor of leaves and roots, light falling through gaps |
| 2 | **town** | 31 fights: the streets of Kaifeng, Weizhou, Yanmen, Daming, Yuncheng, Yanggu, Mengzhou, Jiangzhou, Jizhou; duels Lu Da vs Zheng the Butcher, Yang Zhi vs Niu Er | a Song-dynasty street: tiled roofs and plaster house fronts along the back, a shop banner or two, packed earth and paving underfoot |
| 3 | **field** | 23 fights: the Zhu, Li and Hu villages, Qingzhou, Zengtou, Lingzhou, Dongchang, the army camp; duels Hu Sanniang, Huyan Zhuo, Guan Sheng, Dong Ping, Zhang Qing and Qiongying | an open battlefield on the North China plain: flat earth trampled by horses, stubble fields, a far line of poplars and a distant walled manor (this one has no art of its own yet and borrows *plains*) |
| 4 | **plains** | 14 fights: the world map, Shi village, Peach Blossom village, Dongxi, the Song farm, Cross Slope; duels Wang Jin vs Shi Jin, Shi Jin vs Chen Da, Yang Zhi vs Zhou Jin and Suo Chao, Liu Tang vs Lei Heng | gentle green countryside: grass, a dirt track, low hills and a few trees on the horizon, wide sky |
| 5 | **snow** | 12 fights: Chai Jin's manor, Cangzhou, the fodder depot, the Kong manor, Qingfeng Mountain; duels Lin Chong vs Hong, Lin Chong vs Yang Zhi, Wu Song vs Kong Liang, Hua Rong vs Qin Ming | winter: deep snow on the ground, snow-laden pines, grey sky with snow falling, distant white mountains |
| 6 | **river** | 10 fights: Jieyang, White Dragon Temple, the Wei River, the Yangtze, Hangzhou; duels Li Kui vs Zhang Shun (on land and in the water) | a wide riverbank: sandy and muddy shore in front, broad water behind with a moored boat, the far bank low on the horizon |
| 7 | **night** | 8 fights: night raids and ambushes | dark blue-black sky with stars and a moon, a silhouetted treeline, ground lit faintly by moonlight |
| 8 | **palace** | 8 fights: Gao Qiu's mansion, the Ninth Heaven, the Western Peak temple, Taishan, Liuhe Temple; duels Yan Qing vs Ren Yuan, Yan Qing vs Gao Qiu | a palace courtyard: red lacquered columns and a hall with yellow-tiled roof behind, white marble or grey brick paving underfoot |
| 9 | **marsh** | 6 fights: Zhu Gui's tavern, Liangshan, Shijie, Feiyun, Liaoerwa | the Liangshan marsh: tall reeds, shallow water and mud flats, a reed-thatched hut, mist over the water |
| 10 | **interior** | 5 fights: inside Kaifeng houses; duel Wu Song vs Sun Erniang (the Cross Slope inn) | inside a timber building: wooden floor, plaster walls with dark posts, a lattice window, a table pushed aside |
| 11 | **mountain** | 5 fights: Shaohua Mountain, Wutai town, Twin Dragon Mountain, Centipede Ridge | rocky mountain path: grey crags, scrub and pines, a steep slope behind |
| 12 | **temple** | 5 fights: Mount Wutai, Daxiangguo Temple | a Buddhist temple courtyard: red walls and a hall with grey upturned eaves, a bronze censer, stone paving |
| 13 | **cave** | 3 fights: the dry well at Gaotang and other underground places | a dark cave or well bottom: rough rock walls, dripping water, a shaft of light from above |
| 14 | **fire** | 2 fights: burning manors | a building on fire at night: flames and smoke along the back, red glow on the ground, sparks in the air |
| 15 | **ridge** | 1 fight: Yellow Mud Ridge (the birthday-gift robbery) | a hot, dry ridge: dusty yellow earth, sparse pines, a road over the crest, harsh noon sun |

## Priority

1. **forest, town, field, plains**: these four cover most fights.
2. **snow, river, marsh**.
3. **night, palace, interior, temple, mountain**.
4. **cave, fire, ridge**.

## Optional (defined in the game, not used yet)

Seasonal and regional variants, if you want more variety later: **spring**, **summer** and **autumn** countryside; **dusk** (evening light); **south** (lush, darker green); **north** (dry, olive-brown steppe); and **hall** (a dark ceremonial hall at night).
