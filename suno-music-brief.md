# Outlaws of the Marsh: Music Brief for Suno

This brief covers every piece of background music (BGM) in the game. Each piece has its own entry: where it plays, what is happening in the story there, the tone and emotion it should carry, how it should be arranged, and a ready-to-paste Suno **Style** prompt.

The track ids (`field`, `town_yanggu`, …) are the names the game uses. Name your exported files after them (for example `town_yanggu.mp3`) so they can be wired in later.

---

## 1. The sound of the world

### The brief

A melodic, historical Chinese folk-fantasy soundtrack, inspired by the storytelling and world-building of Miki Higashino's score for *Gensō Suikoden II*, reimagined for the Song dynasty.

- **What it should be:** warm, nostalgic, poetic, adventurous, slightly melancholic, and clearly a JRPG soundtrack.
- **Instruments:** dizi, xiao, pipa, ruan, guqin, guzheng, erhu, sheng, bells, wooden percussion and small drums.
- **Traditions it draws on:** Chinese folk, literati (scholar's) music, temple music, court music, river-town music and frontier music.
- **What it must not be:** no generic cinematic wuxia, no Hollywood orchestra, no trailer drums, no constant epic brass.

### What to take from Miki Higashino's Suikoden II style

Suno will not accept her name or the game's name in a prompt, so every prompt below describes these qualities in plain musical terms. They are the heart of the brief.

1. **Melody first.** Every piece has a tune you could hum after one listen.
   - Phrases are long and singable. They climb to one high point and settle back down.
   - The tune is stated, varied, and stated again (A A′ B A′).
   - Write the melody as a folk song, not as a texture.
2. **Folk instruments, played intimately.** Her score leans on whistle, fiddle, acoustic guitar, mandolin, harp and accordion, played by a small band in a room. Here each has a Chinese counterpart:
   - tin whistle / recorder → **dizi**, and **xiao** for the low, breathy, sad voice
   - fiddle → **erhu**
   - guitar / mandolin → **ruan** for warm broken chords, **pipa** for bright plucked lead and tremolo
   - harp → **guzheng**, with glissandi between phrases
   - accordion / reed organ → **sheng**, for soft held chords
   - piano / low strings → **guqin**, for deep, slow, scholarly notes
3. **Chamber scale.** Usually three to six instruments, each one audible. Restraint is the point: a solo instrument with light accompaniment is often the most moving choice.
4. **A sound for each place.** Each town and region has its own colour, tempo and lead instrument. A frontier town should not sound like a southern river port, and a temple should not sound like a tavern.
5. **Bittersweet harmony.** Major-key warmth with minor turns, deceptive cadences and suspended chords. Joy always has a little ache, and sadness is tender rather than despairing. Pentatonic folk modes fit this naturally:
   - **gong**, built on do: bright
   - **shang**, built on re: stern
   - **zhi**, built on sol: folk-like and open
   - **yu**, built on la: minor and wistful
6. **Gentle rhythm.** Hand percussion, a wooden fish, a clapper, a small drum. Battles drive with ostinatos (repeated riffs) and snare-like drums, not huge booms.
7. **Warm, slightly vintage production.** Late-1990s RPG warmth: close-miked acoustic instruments, a natural room reverb, no heavy compression, no synth pads.

### The palette in one line (to adapt as needed)

> Chinese folk chamber ensemble, Song dynasty, melodic JRPG soundtrack, memorable folk melody, dizi, xiao, erhu, pipa, ruan, guzheng, guqin, sheng, wooden fish, small hand drum, intimate acoustic recording, warm room reverb, bittersweet, nostalgic, instrumental

---

## 2. How to use this with Suno

- **Mode:** Custom. Turn **Instrumental** on.
- **Style of Music:** paste the track's **Style** block. Each one stands on its own and is under 400 characters (current Suno versions accept 1,000).
  - On an older version with a 200-character limit, keep the opening up to the lead instrument plus the mood words, and drop the rest.
- **Exclude styles** (if your plan has it), the same for every track:
  ```
  vocals, choir, lyrics, epic orchestral, trailer music, hybrid orchestral, cinematic drums, taiko, dubstep, EDM, synth pads, electric guitar, rock drums, heavy brass, hip hop beat, lo-fi beat
  ```
- **Lyrics box:** leave it empty with Instrumental on, or use section tags to steer the form, for example `[Intro] [Main Theme] [Variation] [Bridge] [Main Theme] [Outro]`.
  - For battle and dungeon pieces, `[Instrumental Loop]` or `[Seamless Loop]` sometimes helps, but don't rely on it.
- **Generate several takes.** Generate 2–4 takes per track and keep the one whose melody is strongest. Melody matters more than sound quality.
  - If a take is close, use **Extend** or **Cover** rather than starting over.
- **Looping for the game.** Field and town music loops. Pick a clean phrase boundary near the end, cut there, and crossfade back to the start of the main theme (Audacity or any editor works).
  - Short pieces marked *plays once* (victory and inn) are stingers and don't loop.
- **Length:** 2–3 minutes is plenty for looping pieces. Victory: 10–20 seconds. Inn: 15–25 seconds.
- **Keep it consistent.** If a take drifts into orchestral or vocal territory, add the offending style to Exclude and regenerate.

---

## 3. All tracks at a glance

| id | Title | Where it plays | Mood | Tempo |
|---|---|---|---|---|
| `theme` | A Hundred and Eight Stars (**the theme song**) | Title screen; its melody recurs across the game | gentle, hopeful, uplifting at the end | 76 |
| `title` | Moon over the Marsh | The prologue's opening | calm, moonlit, the saga ahead | 66 |
| `world` | Roads under Heaven | World map | setting out, longing for the road | 104 |
| `field` | Willows along the Highway | Countryside maps, villages | light, pastoral, warm | 96 |
| `ending` | Their Names Fill the Land | Last card, credits | elegy for the 108 | 56 |
| `market` | Market Day in the County Town | Weizhou | lively, everyday bustle | 112 |
| `town` | Old Streets of the County Town | Yuncheng | wistful, looking back | 78 |
| `town_kaifeng` | Lanterns over Bianliang | The Eastern Capital (Kaifeng) | splendour with rot beneath | 96 |
| `town_daming` | Drill Ground of the Northern Capital | Daming | stern, martial, proud | 100 |
| `town_yanmen` | Autumn Wind at Yanmen Pass | Yanmen | lonely frontier, kindness | 80 |
| `town_cangzhou` | An Exile's Summer in Cangzhou | Cangzhou (summer visits) | exile's lament | 66 |
| `town_yanggu` | The Storyteller of Yanggu | Yanggu | folk tale turned tragedy | 92 |
| `town_mengzhou` | Taverns of the Happy Forest | Mengzhou | swagger, menace | 108 |
| `town_qingfeng` | Lantern Night at Qingfeng | Qingfeng Fort | festive, with a trap inside | 104 |
| `town_jiangzhou` | A Poem on Xunyang Tower | Jiangzhou | river melancholy, poetry | 84 |
| `town_jieyang` | Street Show at Jieyang | Jieyang | fairground, cheeky | 116 |
| `town_jizhou` | Wooden Fish at Dawn in Jizhou | Jizhou | sly, temple-tinged | 88 |
| `town_zhuinn` | A Rooster for Supper | Inn below Dulong Ridge | comic, tiptoeing | 112 |
| `town_gaotang` | The Sorcerer's Prefecture | Gaotang | uncanny, oppressive | 74 |
| `town_dengzhou` | Tigers by the Eastern Sea | Dengzhou | bold, open sea | 90 |
| `town_wugang` | Hammers at Wugang Market | Wugang Market, the smithy | hearty work song | 104 |
| `town_jiankang` | A Physician in Jiankang | Jiankang | gentle, hopeful, scholarly | 72 |
| `castle` | The Hall of Loyalty | Liangshan (early) | brotherhood, pride | 92 |
| `stronghold` | Banners over the Marsh | Liangshan once it is yours | home, bustle, hope | 118 |
| `sad` | Rain on a Fresh Grave | Deaths, partings, Game Over | grief | 58 |
| `tense` | Footsteps in the Dark | Plots, ambushes, chases | suspense | 100 |
| `heroic` | Bare Fists on Jingyang Ridge | Heroic deeds | rousing triumph | 108 |
| `palace` | Incense in the Jade Hall | The court, ceremonies | stately, cold grandeur | 72 |
| `snow` | Snow on the Mountain God's Temple | Lin Chong in the snow; Cangzhou in winter | cold and alone | 70 |
| `inn` | Lamplight at the Inn | Resting at an inn (plays once) | cosy, quiet | 90 |
| `dungeon` | Into the Darkened Halls | Caves, deep woods, closed halls | wary, dark | 76 |
| `battle` | Clash of Blades | Ordinary fights | fast, driving | 150 |
| `boss` | The Tiger Bares Its Teeth | Boss fights | heavy, dangerous | 160 |
| `duel` | Thirty Bouts, No Victor | One-on-one duels | tense, pulsing | 132 |
| `war` | Drums along the Riverbank | Army battles | marching armies | 132 |
| `victory` | Wine for the Victors | After a won battle (plays once) | short fanfare | 128 |
| `capital` … `fortress` | 16 place themes | Not on any map yet (see section 10) | various | — |

---

## 4. The theme song

### `theme`: A Hundred and Eight Stars
**Plays:** the title screen, the first music a player hears. It is the game's signature melody: other pieces should quote it (see below), so that in a sense it plays all the time. **Tempo/key:** 76 bpm, D major, gong mode. **Length:** about 2½–3½ minutes, built to loop.

**Story:** the novel's 108 heroes are stars of destiny, scattered across the land and gathered one by one into a single brotherhood at Liangshan. The theme is that promise: many lonely roads becoming one.

**Tone and emotion:** gentle and hopeful from the first note, never loud at the start. It carries a small ache in the middle (the road is long and not everyone will make it home), then lifts. The last section should feel like sunrise: warm, uplifting, full of quiet confidence. The listener should end feeling that something good is about to begin.

**Arrangement and form:**

| Section | Bars | What happens |
|---|---|---|
| Intro | 4 | A guzheng plays the opening motif alone, high and clear like a music box. A guqin note underneath, one small bell. |
| Verse | 8 | A gentle, breathy xiao sings the main tune over soft ruan broken chords. The motif opens with a hopeful upward leap (do → sol → la). |
| Middle | 4 | The erhu takes over with a short turn to the minor: the ache of the journey. Sheng chords start breathing underneath. |
| Final verse | 8 | The whole small band returns with the tune: dizi and erhu an octave apart, sheng chords, gentle hand drum, bells. The melody climbs to its highest note in the second-to-last phrase, then settles warmly on the home note. |

- **Keep it chamber-sized** even at the end: the lift comes from the melody climbing and more instruments joining, not from volume or drums.
- An optional final lift: move the last verse up a whole step (key change) for extra uplift. Suno sometimes does this by itself if you ask for "key change up in the final chorus".

**The melody, for reference** (numbered notation, key of D, one number per eighth note, `-` holds the note, `'` is the octave above):
- **Motif:** `1 - 5 - 6 - - -`, then `6 - 5 - 3 - - -`
- **Verse opening:** `1 - 5 - 6 5 3 5 | 6 - - 1' 6 - 5 -`
- **The climb:** `1' - 2' 3' 5' - 3' 2'`

If Suno invents a better melody that keeps this shape (an upward leap at the start, a climb to a peak near the end), keep Suno's version.

**Style:**
```
gentle hopeful Chinese folk theme song, main theme of a JRPG, 76 bpm, D major pentatonic, opens with solo guzheng music-box motif, breathy xiao flute sings a tender memorable melody, soft ruan arpeggios, short minor erhu bridge, final verse full warm folk band with dizi and erhu in octaves, sheng chords, gentle hand drum, small bells, rising to an uplifting sunrise ending, nostalgic, intimate, instrumental
```

**Quoting the theme elsewhere.** A Suikoden-style score ties itself together by bringing its main melody back in other pieces. Once you have a `theme` you love, consider:
- `title` (prologue): the motif slowly on solo dizi
- `world`: the verse opening as the bridge
- `castle` and `stronghold`: the verse in a proud, marching version
- `ending`: the whole theme, slower, as the final farewell

In Suno, use **Cover** on your chosen `theme` take with the other track's Style prompt, so the melody carries over.

---

## 5. Title and the journey

### `title`: Moon over the Marsh
**Plays:** the opening of the prologue, under the story's first narration. **Tempo/key:** 66 bpm, D, gong mode.

**Tone and emotion:** the whole saga lies ahead. A quiet moonlit night over Liangshan's reeds: calm, wondering, a little sad, the way an old story feels before it is told. It should make the player lean in, not sit up.

**Arrangement:**
- A solo dizi states the main theme over slow guzheng broken chords, with a low guqin note and one soft gong at the start.
- The second time round, the erhu joins in a gentle counter-line.
- No drums.

**Style:**
```
Chinese folk chamber music, melodic JRPG title theme, slow 66 bpm, solo dizi bamboo flute singing a long nostalgic folk melody, slow guzheng arpeggios, deep guqin bass notes, soft distant gong, erhu counter-melody on the repeat, moonlit night over a reed marsh, calm, wondering, bittersweet, intimate acoustic recording, warm room reverb, instrumental
```

### `world`: Roads under Heaven
**Plays:** the world map, travelling between places. **Tempo/key:** 104 bpm, A, yu mode turning to major.

**Tone and emotion:** setting out on a long journey. It's adventurous and forward-moving, with the longing of someone far from home. This is the "overworld theme," so the melody must be the most memorable in the game after the title.

**Arrangement:**
- The dizi plays the lead over a steady walking ruan and a light small drum keeping a travelling pace.
- The erhu takes the bridge, which turns minor for a moment and then lifts back to the theme.

**Style:**
```
melodic JRPG world map theme, Chinese folk ensemble, 104 bpm, adventurous travelling melody on dizi flute, walking ruan lute rhythm, light small hand drum, guzheng flourishes between phrases, erhu takes the bridge in a minor key then lifts back, wide open roads, hopeful, longing for home, warm acoustic chamber recording, instrumental
```

### `field`: Willows along the Highway
**Plays:** country roads, villages and hillsides (Shi Family Village, Peach Blossom Village, Wutai town and others; 27 maps). **Tempo/key:** 96 bpm, G, gong mode.

**Tone and emotion:** light and pastoral. Willows, sunshine, farmers in the fields, the first steps of an adventure. Warm and gently happy, with a touch of nostalgia. It is the first music most players hear while walking.

**Arrangement:**
- The dizi melody runs over ruan broken chords, with a soft wooden-fish tick for the walking pace.
- The xiao answers in the second verse.
- The erhu sings a warmer middle section.
- Guzheng glissandi link the phrases.

**Style:**
```
pastoral Chinese folk JRPG field theme, 96 bpm, cheerful singable dizi melody, gentle ruan lute arpeggios, soft xiao flute answering phrases, warm erhu middle section, guzheng glissandos between phrases, light wooden fish tick, sunny countryside, willow trees, warm, gentle, slightly nostalgic, intimate acoustic folk band, instrumental
```

### `ending`: Their Names Fill the Land
**Plays:** the last chapter card and the credits. **Tempo/key:** 56 bpm, D.

**Tone and emotion:** an elegy for the 108 heroes, most of whom die in the southern campaign. Grief turns into remembrance and gratitude: the feeling of an old storyteller closing the book. It should quote the title theme's melody, slower and fuller.

**Arrangement:**
- The guqin opens alone, then the xiao enters, then the erhu.
- For the final statement of the theme, the whole band plays together: guzheng, sheng chords and soft bells. Even then it stays chamber-sized and never swells to an orchestra.

**Style:**
```
emotional JRPG ending theme, Chinese chamber folk elegy, slow 56 bpm, begins with solo guqin, xiao flute enters with the main theme, erhu takes the melody, final full statement with guzheng, soft sheng chords and small bronze bells, remembrance of fallen heroes, grief turning to gratitude, nostalgic, tender, never bombastic, intimate warm recording, instrumental
```

---

## 6. Towns

Each town has its own theme written around what happens there in the story. Exteriors and interiors share the same music, so it doesn't restart at every door.

### `market`: Market Day in the County Town
**Plays:** Weizhou (where Lu Da kills the butcher Zheng). **Tempo/key:** 112 bpm, D, gong mode.

**Tone and emotion:** an ordinary, busy town of stalls, porters and a lively crowd. Cheerful and bustling, everyday life before trouble starts.

**Arrangement:**
- A bright pipa melody, with a dizi holding long notes above it.
- A bouncy plucked bass, a woodblock and a small drum.

**Style:**
```
lively Chinese market town theme, JRPG town music, 112 bpm, bright bouncy pipa melody, dizi sustained notes above, plucked ruan bass on the beat, woodblock clapper and small drum, busy street stalls and porters, cheerful, bustling, folk, warm acoustic band, instrumental
```

### `town`: Old Streets of the County Town
**Plays:** Yuncheng, Song Jiang's home county, which he leaves as a fugitive and returns to. **Tempo/key:** 78 bpm, D, yu mode resolving to major.

**Tone and emotion:** tiled roofs and old streets, familiar and wistful, looking back. The melody sits on the minor side and only comes home to the major at the very end of the loop, so each repeat starts in the minor again.

**Arrangement:**
- The pipa plays the theme in a slow rolling tremolo.
- The erhu remembers the middle verse; the xiao brings the tune home.
- Ruan broken chords and a low guqin underneath. A soft wooden fish every two bars, and a small bell.

**Style:**
```
nostalgic Chinese county town theme, wistful JRPG town music, 78 bpm, pipa melody in slow tremolo, erhu middle verse, xiao flute closing phrase, gentle ruan arpeggios, low guqin, soft sheng chords, sparse wooden fish and small bell, mostly minor, resolving to major only at the end, home remembered, bittersweet, intimate acoustic recording, instrumental
```

### `town_kaifeng`: Lanterns over Bianliang
**Plays:** the Eastern Capital, Kaifeng. **Tempo/key:** 96 bpm, E♭, gong mode.

**Story:** the emperor's city of splendour and silk, ruled in practice by Marshal Gao Qiu. Lin Chong's wife is harassed at a temple fair, Lin Chong is framed, and Yang Zhi sells his heirloom sabre because he has nothing left.

**Tone and emotion:** refined and elegant on the surface, with something rotten underneath. Court-music poise, then a middle section that turns minor and uneasy.

**Arrangement:**
- A pipa lead with tremolo; the dizi takes the minor middle.
- The sheng plays off-beat court chords. A wooden clapper marks each bar.
- Guzheng runs and small bells.

**Style:**
```
elegant Chinese imperial capital town theme, Song dynasty court music flavour, JRPG, 96 bpm, refined pipa melody with tremolo, sheng mouth organ chords, wooden clapper marking the bar, guzheng runs, small bells, middle section turns minor and uneasy on dizi, splendour with corruption underneath, graceful but troubled, chamber ensemble, warm recording, instrumental
```

### `town_daming`: Drill Ground of the Northern Capital
**Plays:** Daming Prefecture. **Tempo/key:** 100 bpm, D, shang mode.

**Story:** Yang Zhi proves himself against Suo Chao on the drill ground. Later it is the city of the rich squire Lu Junyi, who is betrayed by his steward, and of the execution ground where Shi Xiu leaps from a tower to save him.

**Tone and emotion:** stern, proud and martial: a garrison city of parades. Disciplined rather than cheerful, with dignity and a hard edge.

**Arrangement:**
- A stern erhu melody over a walking ruan bass and a crisp small drum marching rhythm.
- The dizi plays the parade-like middle section.

**Style:**
```
Chinese northern garrison city theme, JRPG, 100 bpm march feel, stern proud erhu melody, walking ruan bass, crisp small snare-like hand drum in march rhythm, bright dizi parade section, guzheng runs, military drill ground, dignified, disciplined, a hard edge, folk chamber band not orchestra, instrumental
```

### `town_yanmen`: Autumn Wind at Yanmen Pass
**Plays:** Yanmen County, under the frontier pass. **Tempo/key:** 80 bpm, C (A minor), yu mode.

**Story:** Lu Da, wanted for killing the butcher, hides here. He sees his own wanted poster, and the Jin family he saved repays him with shelter.

**Tone and emotion:** lonely and windswept, a cold autumn frontier, with a warm middle section that is the kindness of the Jins.

**Arrangement:**
- A wide-leaping, lonely xiao melody over a lilting ruan and a low guqin.
- The middle section on erhu, with soft sheng chords for warmth.
- Falling guzheng runs, a single distant drum beat.

**Style:**
```
lonely Chinese frontier town theme, JRPG, 80 bpm, minor pentatonic, breathy xiao flute melody with wide leaps, lilting ruan lute, low guqin notes, falling guzheng runs, sparse distant drum, warm erhu middle section with soft sheng chords, autumn wind, mountain pass, solitude and unexpected kindness, intimate acoustic, instrumental
```

### `town_cangzhou`: An Exile's Summer in Cangzhou
**Plays:** Cangzhou on later, summer visits. In winter it plays `snow`. **Tempo/key:** 66 bpm, G (E minor), yu mode.

**Story:** Lin Chong, an honest instructor ruined by Gao Qiu, serves his exile here in the prison camp and finds an old friend's tea house.

**Tone and emotion:** a scholar's lament. Quiet dignity in exile, the ache of a life taken away, summer heat and stillness.

**Arrangement:**
- The guqin itself carries the tune, slow and resonant.
- The xiao takes the middle verse, with a lilting ruan far underneath.
- One falling guzheng run and a small bell. No percussion.

**Style:**
```
Chinese literati lament, exile town theme, JRPG, slow 66 bpm, solo guqin zither carrying a slow melancholy melody, xiao flute middle verse, very soft ruan, one falling guzheng run, single small bell, no drums, quiet dignity, exile, loss, still summer air, minor pentatonic, intimate, sparse, instrumental
```

### `town_yanggu`: The Storyteller of Yanggu
**Plays:** Yanggu County. **Tempo/key:** 92 bpm, C, zhi mode.

**Story:** the town cheers Wu Song for killing the tiger on Jingyang Ridge. His brother Wu Dalang sells steamed buns in the street. Pan Jinlian and Ximen Qing murder Wu Dalang, and Wu Song takes his revenge.

**Tone and emotion:** told like a street storyteller's tale. It starts with folk patter, lively and proud, but the middle section grieves. Comedy and tragedy in one town.

**Arrangement:**
- A pipa in storyteller patter (repeated notes, then tremolo), with a wooden clapper on the beats.
- The middle section is a grieving erhu over soft sheng chords.

**Style:**
```
Chinese storyteller folk tune, JRPG county town theme, 92 bpm, pipa playing chatty storytelling melody with tremolo, wooden clapper on the beat like a street storyteller, steady ruan, low guqin, middle section turns to grieving erhu with soft sheng chords, heroic tale turning tragic, lively then sorrowful, folk chamber band, instrumental
```

### `town_mengzhou`: Taverns of the Happy Forest
**Plays:** Mengzhou. **Tempo/key:** 108 bpm, G, shang mode.

**Story:** Shi En's "Happy Forest," a strip of taverns and gambling dens taken by force by Jiang the Door God. Wu Song, drinking at every inn on the way, beats Jiang, and later brings vengeance to the Mandarin Duck Tower.

**Tone and emotion:** swagger and menace. A tough strip of taverns, drunken bravado, danger in the air; the middle section is the night at the tower.

**Arrangement:**
- A strutting dizi lead over a short, hopping plucked bass and sheng off-beat stabs.
- A small drum and wooden fish. A darker erhu middle section.

**Style:**
```
swaggering Chinese tavern street theme, JRPG, 108 bpm, strutting dizi melody, short hopping plucked ruan bass, sheng off-beat chord stabs, small drum and wooden fish, darker erhu middle section, drunken bravado, gambling dens, menace under the fun, shang mode, folk band, instrumental
```

### `town_qingfeng`: Lantern Night at Qingfeng
**Plays:** Qingfeng Fort. **Tempo/key:** 104 bpm, F, gong mode.

**Story:** the Lantern Festival. Song Jiang goes out to see the lanterns, is recognised by the commander's wife, seized and put in a cage. The archer Hua Rong breaks him out.

**Tone and emotion:** festive and glittering, with a trap inside it. Joyful lantern-night music whose middle section turns ominous.

**Arrangement:**
- A dizi lantern melody with sheng chords and tinkling small bells.
- Ruan broken chords and a small festive drum.
- The middle section is a minor erhu over held sheng.

**Style:**
```
festive Chinese lantern festival town theme, JRPG, 104 bpm, joyful dizi melody, sheng mouth organ chords, tinkling small bells, ruan arpeggios, light festive hand drum, guzheng runs, middle section suddenly minor and ominous on erhu, celebration with danger hidden inside, sparkling, folk chamber ensemble, instrumental
```

### `town_jiangzhou`: A Poem on Xunyang Tower
**Plays:** Jiangzhou, on the Yangzi. **Tempo/key:** 84 bpm, B♭ (G minor), yu mode.

**Story:** Song Jiang in exile drinks alone at the Xunyang Tower and writes a rebellious poem on the wall. He is condemned, and the heroes storm the execution ground to save him.

**Tone and emotion:** southern river-town melancholy and poetry. Flowing water, wine and loneliness, a dangerous poem.

**Arrangement:**
- An erhu melody over running ruan figures, like water.
- The guzheng "recites the poem" in the middle section, with a low guqin and a soft wooden fish.
- Sheng chords enter for the last verse.

**Style:**
```
Chinese southern river town theme, Yangzi river, JRPG, 84 bpm, minor pentatonic, expressive erhu melody, flowing ruan lute like running water, guzheng solo middle section like reciting a poem, low guqin, soft wooden fish, sheng chords in the last verse, wine, loneliness, poetry, melancholy, intimate acoustic, instrumental
```

### `town_jieyang`: Street Show at Jieyang
**Plays:** Jieyang Town. **Tempo/key:** 116 bpm, D, zhi mode.

**Story:** the travelling martial artist Xue Yong performs staff tricks for coins in the market. Song Jiang tips him, and the Mu brothers, who run the town, take offence.

**Tone and emotion:** a fairground: cheeky, energetic and showy, with a hint of trouble from the local bullies.

**Arrangement:**
- A jaunty dizi; the pipa takes the "performance" middle section.
- A busy small drum, a clapper, and a small performer's gong every few bars.

**Style:**
```
energetic Chinese street performer fair theme, JRPG, 116 bpm, jaunty dizi melody, busy plucked ruan bass, punchy pipa middle section like a martial arts show, busy small hand drum, wooden clapper, small street gong every few bars, cheeky, showy, riverside market, folk band, instrumental
```

### `town_jizhou`: Wooden Fish at Dawn in Jizhou
**Plays:** Jizhou. **Tempo/key:** 88 bpm, F (D minor), yu mode.

**Story:** the executioner Yang Xiong and the firewood seller Shi Xiu swear brotherhood. Yang's wife is having an affair with a monk, the temple's wooden fish signals their meetings at dawn, and it ends on Cuiping Mountain.

**Tone and emotion:** sly and secretive with temple colour: whispering streets, a scandal under the incense.

**Arrangement:**
- A staccato guzheng melody, full of rests and sly.
- A steady temple wooden-fish knock, a lilting ruan, a low guqin, small bells.
- The middle section on xiao is the mountain.

**Style:**
```
sly secretive Chinese town theme with Buddhist temple colour, JRPG, 88 bpm, minor pentatonic, staccato guzheng melody with sneaky rests, steady temple wooden fish knock, lilting ruan, low guqin, small bronze bells, breathy xiao middle section, scandal and whispers, incense, folk chamber, instrumental
```

### `town_zhuinn`: A Rooster for Supper
**Plays:** the inn below Dulong Ridge. **Tempo/key:** 112 bpm, A, shang mode.

**Story:** the thief Shi Qian steals and cooks the innkeeper's prize rooster. The innkeeper's men come for them, the inn burns, and it starts the war with the Zhu Family Village.

**Tone and emotion:** comic and tiptoeing, cartoon-sneaky: mischief about to get out of hand.

**Arrangement:**
- A short, plucked pipa melody full of rests.
- A hopping plucked bass and wooden-fish knocks.
- The dizi crows in the middle.

**Style:**
```
comic sneaky Chinese inn theme, JRPG, 112 bpm, tiptoeing staccato pipa melody with rests, hopping plucked ruan bass, wooden fish knocks in a 3-3-2 pattern, playful dizi crowing like a rooster in the middle section, mischief, thief, playful, light, folk band, instrumental
```

### `town_gaotang`: The Sorcerer's Prefecture
**Plays:** Gaotang. **Tempo/key:** 74 bpm, B♭ (G minor), yu mode.

**Story:** Yin Tianxi, the governor's brother-in-law, seizes the garden of Chai Jin's uncle, who dies of the shame. The governor, Gao Lian, raises black winds and spirit soldiers with his sorcery until Gongsun Sheng breaks it.

**Tone and emotion:** uncanny and oppressive. Something unnatural hangs over the town: tyranny with magic behind it.

**Arrangement:**
- An erhu melody with one eerie chromatic step, over held sheng clusters that hang in the air.
- A low guqin. Very high, irregular bells, and an irregular wooden fish.
- The middle section is a breathy, low xiao.

**Style:**
```
uncanny Chinese town theme with dark Daoist sorcery, JRPG, slow 74 bpm, minor, erhu melody with an eerie chromatic step, sustained sheng mouth organ clusters hanging in the air, low guqin, irregular wooden fish, high faint bells, low breathy xiao middle section, oppressive, unnatural, mysterious, sparse, instrumental
```

### `town_dengzhou`: Tigers by the Eastern Sea
**Plays:** Dengzhou, on the coast. **Tempo/key:** 90 bpm, E, zhi mode.

**Story:** the hunter brothers Xie Zhen and Xie Bao kill a tiger that falls into a rich man's garden. He steals it and has them jailed, and their fierce cousin, the innkeeper Gu Dasao, breaks them out.

**Tone and emotion:** bold and open, with salt wind and wide horizons; brave common people.

**Arrangement:**
- A bold dizi over rolling ruan figures like waves, with a low guqin.
- An erhu middle section, "the sea."
- Guzheng runs; a small drum like rowing.

**Style:**
```
bold Chinese harbour town theme by the sea, JRPG, 90 bpm, brave open dizi melody, rolling ruan lute like waves, low guqin, guzheng runs, small drum like rowing strokes, erhu middle section, salt wind, wide horizon, hunters and tigers, courageous, warm folk ensemble, instrumental
```

### `town_wugang`: Hammers at Wugang Market
**Plays:** Wugang Market and its smithy. **Tempo/key:** 104 bpm, C, gong mode.

**Story:** the smith Tang Long, a cousin of Xu Ning, forges the hooked lances that break the chained cavalry.

**Tone and emotion:** a hearty work song with honest labour. Fire, sweat and pride in the craft.

**Arrangement:**
- A pipa melody over a steady octave pulse.
- A bright metallic ring on the beats like an anvil, plus a wooden knock.
- The dizi takes the middle section with sheng stabs.

**Style:**
```
hearty Chinese blacksmith work song, market town theme, JRPG, 104 bpm, pipa melody, steady ruan octave pulse, bright metallic anvil-like bell strikes on the beat, wooden knock, dizi middle section, sheng chord stabs, forge fire, honest labour, proud, energetic but warm, folk band, instrumental
```

### `town_jiankang`: A Physician in Jiankang
**Plays:** Jiankang, the old southern capital. **Tempo/key:** 72 bpm, E♭, gong mode.

**Story:** Zhang Shun crosses the Yangzi to fetch the famous physician An Daoquan to save Song Jiang, who is dying.

**Tone and emotion:** gentle, scholarly and hopeful: a Jiangnan garden, calm wisdom, a life that can still be saved.

**Arrangement:**
- The xiao and the guqin take turns with the melody.
- Soft ruan broken chords, sheng chords at the end, a small bell.

**Style:**
```
gentle Chinese Jiangnan scholar's garden theme, southern city, JRPG, slow 72 bpm, xiao flute and guqin zither taking turns with a tender melody, soft ruan arpeggios, warm sheng chords at the end, small bell, calm wisdom, healing, quiet hope, elegant, literati music, intimate acoustic, instrumental
```

---

## 7. Liangshan

### `castle`: The Hall of Loyalty
**Plays:** Liangshan in its early days (the stronghold, the Hall). **Tempo/key:** 92 bpm, F.

**Tone and emotion:** home, brotherhood and pride: outlaws who swore to act for Heaven. Noble and warm, steady, a little solemn: the "headquarters" theme.

**Arrangement:**
- A noble dizi melody over a steady ruan and low guqin.
- An erhu harmony a third below on the repeat, a measured hand drum, a small gong at the start of the loop.

**Style:**
```
noble Chinese brotherhood theme, outlaw stronghold headquarters, JRPG, 92 bpm, proud warm dizi melody, erhu harmony on the repeat, steady ruan, low guqin, measured hand drum, small gong at the start, loyalty, sworn brothers, dignity, warm, slightly solemn, folk chamber ensemble not orchestra, instrumental
```

### `stronghold`: Banners over the Marsh
**Plays:** Liangshan once it is truly yours, growing as heroes join. **Tempo/key:** 118 bpm, D.

**Tone and emotion:** bustling, hopeful home. The castle that fills with friends: busy, joyful and proud. This is the theme the player hears most in the second half, so it must stay pleasant on repeat.

**Arrangement:**
- A bright dizi and pipa duet over a bouncing bass.
- A clapper and small drum, sheng chords, and guzheng glissandi between sections.

**Style:**
```
joyful bustling Chinese home base theme, growing stronghold, JRPG, 118 bpm, bright dizi and pipa duet melody, bouncing ruan bass, wooden clapper and small drum, sheng chords, guzheng glissandos, banners in the wind, friends gathering, hopeful, proud, warm, catchy folk melody, instrumental
```

---

## 8. Story moods

### `sad`: Rain on a Fresh Grave
**Plays:** deaths and partings (20 scenes, the most used story cue) and Game Over. **Tempo/key:** 58 bpm, D (B minor), yu mode.

**Tone and emotion:** grief: a fresh grave in the rain. Tender, quiet sorrow rather than melodrama, the way a beloved character's death feels in a JRPG.

**Arrangement:**
- The erhu weeps the tune over a low guqin.
- The xiao takes the middle verse while soft sheng chords breathe underneath.
- One falling guzheng run; a single bell per loop.

**Style:**
```
tender Chinese lament, JRPG sad theme, slow 58 bpm, minor pentatonic, weeping erhu melody, low resonant guqin, breathy xiao middle verse, soft sustained sheng chords, one falling guzheng run, single small bell, rain on a grave, grief, mourning, quiet sorrow not melodrama, intimate, sparse, instrumental
```

### `tense`: Footsteps in the Dark
**Plays:** plots, ambushes, chases and sneaking (18 scenes and 30 map states). **Tempo/key:** 100 bpm, D minor.

**Tone and emotion:** suspense: someone is listening behind the screen. Taut and quiet, a pulse underneath, no big hits. It plays under dialogue a lot, so it must not be busy.

**Arrangement:**
- A low pizzicato ruan ostinato (a repeated figure) and a muffled hand drum like footsteps.
- Short, uneasy erhu phrases and occasional pipa tremolo stabs.

**Style:**
```
suspenseful Chinese folk underscore, JRPG tension theme, 100 bpm, low plucked ruan ostinato, muffled hand drum like footsteps, short uneasy erhu phrases, occasional pipa tremolo, minor, sparse, conspiracies, ambush, sneaking, quiet and taut, leaves room for dialogue, no big hits, instrumental
```

### `heroic`: Bare Fists on Jingyang Ridge
**Plays:** heroic deeds, such as Wu Song killing the tiger with his bare hands. **Tempo/key:** 108 bpm, G.

**Tone and emotion:** rousing triumph, the folk-hero moment. Brave and uplifting, the kind of melody that makes you sit up, while staying folk-sized.

**Arrangement:**
- A soaring dizi melody with erhu in octaves.
- A driving ruan rhythm, a hand drum building through the piece, and a cymbal crash at the climax.

**Style:**
```
rousing Chinese folk hero theme, JRPG, 108 bpm, soaring dizi melody doubled by erhu, driving ruan rhythm, building hand drums, guzheng glissandos, one small cymbal crash at the climax, bravery, triumph, a hero against a tiger, uplifting, folk ensemble not orchestra, instrumental
```

### `palace`: Incense in the Jade Hall
**Plays:** the imperial court, the residence of Marshal Gao, great ceremonies (11 maps, 6 scenes). **Tempo/key:** 72 bpm, E♭.

**Tone and emotion:** stately and ceremonial with a cold grandeur: power that doesn't care about the people. Formal and slow, beautiful but distant.

**Arrangement:**
- A formal guzheng melody with long dizi notes.
- Sheng chords, bronze bells, and a clapper marking slow beats. In the style of Song court music, never an orchestra.

**Style:**
```
stately Chinese imperial court music, Song dynasty ceremony, JRPG palace theme, slow 72 bpm, formal guzheng melody, long dizi notes, sheng mouth organ chords, bronze chime bells, slow wooden clapper, incense smoke, jade hall, grand but cold and distant, elegant, ritual, chamber court ensemble, instrumental
```

### `snow`: Snow on the Mountain God's Temple
**Plays:** Lin Chong's snowy night when the fodder depot burns (chapter 3), and Cangzhou in winter. **Tempo/key:** 70 bpm, B minor.

**Tone and emotion:** cold and alone; falling snow, a man with nothing left. Quiet, frozen, heartbroken, and about to snap.

**Arrangement:**
- A sparse solo dizi (or xiao) over high, slow guzheng harmonics like snowflakes.
- A low guqin on downbeats. Nothing else.

**Style:**
```
cold lonely Chinese winter theme, JRPG, slow 70 bpm, minor, sparse solo dizi flute melody, high slow guzheng harmonics like falling snowflakes, deep guqin notes on the downbeats, vast silence, heavy snow, a lone man at a mountain temple, heartbreak, frozen, quiet, very sparse, instrumental
```

### `inn`: Lamplight at the Inn *(plays once)*
**Plays:** resting at an inn. **Length:** 15–25 seconds, not looped. **Tempo/key:** 90 bpm, F.

**Tone and emotion:** cosy and quiet; lamplight, warm wine, a safe night's sleep. A small lullaby-like cadence.

**Style:**
```
short cosy Chinese inn rest jingle, JRPG, 90 bpm, gentle guzheng melody, soft ruan, warm lamplight, wine and rest, a short lullaby phrase that ends softly, about 20 seconds, peaceful, intimate, instrumental
```

### `dungeon`: Into the Darkened Halls
**Plays:** caves, deep woods, closed halls (15 maps). **Tempo/key:** 76 bpm, C♯ minor.

**Tone and emotion:** wary and dark, but still an adventure. Watchful exploration with a hint of mystery, not horror. It loops for a long time, so keep it calm.

**Arrangement:**
- A low guzheng ostinato, drawn-out erhu phrases, a soft muffled drum, and occasional dripping bell tones.

**Style:**
```
dark mysterious Chinese dungeon exploration theme, JRPG, 76 bpm, minor, low guzheng ostinato, long drawn-out erhu phrases, soft muffled hand drum, occasional echoing bell tones like dripping water, caves, dark forest, closed halls, wary, watchful, mysterious, calm enough to loop, instrumental
```

---

## 9. Battles

These may be faster and louder, but the same rules apply: a real melody and folk instruments, with snare-like hand drums rather than trailer drums, and no brass wall.

### `battle`: Clash of Blades
**Plays:** ordinary fights. **Tempo/key:** 150 bpm, E minor.

**Tone and emotion:** fast and driving, exciting not grim. Heard hundreds of times, so the melody must be catchy and the loop tight.

**Arrangement:**
- An erhu lead over a galloping pipa ostinato and a fast plucked bass.
- Driving small drums and a clapper, with a cymbal on phrase starts.

**Style:**
```
fast exciting Chinese folk battle theme, JRPG random battle, 150 bpm, minor, fiery erhu lead melody, galloping pipa ostinato, fast plucked ruan bass, driving small drums and clapper, cymbal on phrase starts, catchy and energetic, martial arts fight, acoustic folk instruments only, tight loop, instrumental
```

### `boss`: The Tiger Bares Its Teeth
**Plays:** boss fights. **Tempo/key:** 160 bpm, D minor.

**Tone and emotion:** heavier and faster; real danger. Fierce and relentless, but still melodic and folk-sized.

**Arrangement:**
- An erhu and pipa in unison over a pounding hand-drum pattern.
- Low guqin or ruan stabs and a gong on the downbeat of each phrase.

**Style:**
```
intense Chinese folk boss battle theme, JRPG, 160 bpm, minor, fierce erhu and pipa unison melody, pounding hand drums, low ruan and guqin stabs, gong hit at each phrase, cymbals, relentless, dangerous, powerful but acoustic folk ensemble, no orchestra, no trailer drums, instrumental
```

### `duel`: Thirty Bouts, No Victor
**Plays:** one-on-one duels between famous warriors. **Tempo/key:** 132 bpm, E minor.

**Tone and emotion:** tense and pulsing, two masters circling each other. Honour and focus more than chaos, like a Peking-opera combat scene.

**Arrangement:**
- A sharp erhu melody over clapper-and-drum patterns in the style of Peking opera percussion, accelerating, with pauses.
- A plucked bass pulse.

**Style:**
```
tense Chinese duel theme, JRPG one-on-one fight, 132 bpm, minor, sharp erhu melody, Peking opera style clapper and drum patterns with sudden pauses and accelerations, plucked bass pulse, two warriors circling, focus, honour, rising tension, acoustic, instrumental
```

### `war`: Drums along the Riverbank
**Plays:** army battles. **Tempo/key:** 132 bpm, D.

**Tone and emotion:** marching armies and banners: the one place a brighter, louder sound fits. The suona (shawm) may lead here. Keep it a folk military band, not an orchestra.

**Arrangement:**
- A suona melody with erhu and pipa, and a low horn swell.
- Marching war drums with cymbals, and a gong on phrase starts.

**Style:**
```
Chinese folk military march, JRPG army battle theme, 132 bpm, suona shawm melody with erhu and pipa, low horn swells, marching war drums, cymbals, gong on phrase starts, banners and spears along a riverbank, rousing, martial, traditional Chinese military band, not Hollywood orchestra, instrumental
```

### `victory`: Wine for the Victors *(plays once)*
**Plays:** after a battle is won. **Length:** 10–20 seconds. **Tempo/key:** 128 bpm, C.

**Tone and emotion:** a short, happy fanfare, raising cups. Instantly recognisable.

**Style:**
```
short joyful Chinese victory fanfare, JRPG battle won jingle, 128 bpm, bright dizi flourish, guzheng glissando, small drum roll, one gong at the end, raising wine cups, triumphant, about 12 seconds, ends cleanly, instrumental
```

---

## 10. Place themes (written, not yet on any map)

These 16 themes are already in the game's music room but no map plays them yet. Generate them if you want them ready for future areas.

### `capital`: Lanterns of the Eastern Capital
A grand, crowded imperial city, wealth and bustle on every street. 116 bpm, D.
```
grand bustling Chinese imperial capital theme, JRPG, 116 bpm, bright pipa melody, dizi, guzheng, plucked bass, small drum and clapper, crowded rich streets, lanterns, splendour, lively, folk chamber band, instrumental
```

### `county`: Willow Shade over a Quiet County
A small county seat where nothing much happens: unhurried, sunlit, a little drowsy. 84 bpm, G.
```
sleepy peaceful Chinese county town theme, JRPG, 84 bpm, lazy dizi melody, gentle guzheng arpeggios, soft plucked bass, light clapper, sunny afternoon, willow shade, unhurried, drowsy, content, instrumental
```

### `riverport`: Sails on the Xunyang
A river port of boatmen and fish-brokers: flowing water, a wistful southern air. 100 bpm, F.
```
wistful Chinese southern river port theme, JRPG, 100 bpm, erhu melody, flowing guzheng like water, ruan, soft drum, boatmen and sails, fish market, gentle rocking rhythm, wistful, warm, instrumental
```

### `frontier`: Wind through the Northern Pass
A garrison city on the cold northern marches: stern, windswept, soldiers on the walls. 92 bpm, D minor.
```
stern Chinese northern frontier garrison theme, JRPG, 92 bpm, minor, erhu melody, distant dizi, low drum, gong, cold wind, soldiers on the walls, windswept, lonely, dignified, instrumental
```

### `lakecity`: Mist on West Lake
An elegant southern city of lakes, gardens and painted boats. 76 bpm, E♭.
```
elegant Chinese West Lake theme, Hangzhou, JRPG, 76 bpm, graceful dizi melody, rippling guzheng, xiao, mist over the lake, painted boats, willow gardens, refined, serene, poetic, instrumental
```

### `village`: Smoke above the Village Roofs
A farming village: a folk tune for threshing floors and wine at the headman's gate. 108 bpm, C.
```
cheerful Chinese farming village folk dance, JRPG, 108 bpm, bouncy dizi melody, guzheng, plucked bass, clapper and small drum, threshing floor, harvest, village wine, simple happy folk song, instrumental
```

### `fishing`: Nets at Dusk in Shijie
A fishing village among the reeds: rocking boats, nets drying, an evening song. 80 bpm, A.
```
gentle Chinese fishing village evening song, JRPG, 80 bpm, rocking 6/8 feel, guzheng, dizi, soft plucked bass, light clapper, reeds, nets drying at dusk, boats rocking, peaceful, slightly melancholy, instrumental
```

### `marsh`: Eight Hundred Li of Water
The great marsh: open water and endless reeds, a wide sky, a hidden road for those who know it. 72 bpm, F.
```
vast open Chinese marshland theme, Liangshan marsh, JRPG, 72 bpm, long airy dizi melody, shimmering guzheng, deep guqin, endless reeds and water, wide sky, freedom, mystery, calm, instrumental
```

### `forest`: Shadows in Wild Boar Forest
A dark wood where travellers are robbed and prisoners murdered: hushed, watchful, a heartbeat underneath. 70 bpm, C minor.
```
dark hushed Chinese forest theme, JRPG, 70 bpm, minor, low erhu, sparse guzheng, heartbeat-like soft drum, dangerous woods, robbers, watchful, eerie quiet, instrumental
```

### `temple`: Bells of Mount Wutai
A Buddhist monastery: incense, chanting, the great bell; calm and very still. 60 bpm, F.
```
calm Buddhist monastery theme, Mount Wutai, JRPG, slow 60 bpm, temple bells, wooden fish, guzheng, soft dizi, low drone, incense, stillness, meditation, peaceful, sacred, no vocals, instrumental
```

### `daoist`: Clouds over Dragon-Tiger Mountain
A Daoist mountain of immortals and hermits: high, airy and a little uncanny. 66 bpm, G.
```
airy mystical Daoist mountain theme, JRPG, 66 bpm, floating dizi, guzheng harmonics, soft gong, sheng drone, immortals and hermits, clouds and peaks, otherworldly, serene, a little uncanny, instrumental
```

### `haunted`: Lamps Gutter in the Ruined Hall
A fallen temple where something is wrong: cold drafts, dripping water, a shape in the dark. 62 bpm, E minor.
```
eerie haunted ruined temple theme, JRPG, 62 bpm, minor, slow erhu glides, sparse guzheng, low drum, distant gong, dripping water, cold drafts, something wrong in the dark, creepy but restrained, instrumental
```

### `bandits`: Banners on the Bandit Peak
A bandit stronghold up a mountain road: swagger, rough laughter, a chief who answers to no one. 116 bpm, D.
```
rowdy Chinese mountain bandit stronghold theme, JRPG, 116 bpm, swaggering pipa and erhu melody, plucked bass, drums and clapper, rough laughter, banners, outlaws, bold, cocky, folk band, instrumental
```

### `manor`: Wine and Guests at the Manor
A great family's country house: courtesy, open gates, a feast for wandering heroes. 86 bpm, B♭.
```
warm hospitable Chinese country manor theme, JRPG, 86 bpm, graceful guzheng melody, dizi, soft bass, light clapper, a feast for guests, courtesy, open gates, generous, comfortable, instrumental
```

### `shadyinn`: Dumplings at Cross Slope
A roadside inn with a smiling host and drugged wine: sly, playful, not quite safe. 100 bpm, G minor.
```
sly playful Chinese roadside inn theme, JRPG, 100 bpm, minor, staccato pipa melody with rests, sneaky erhu replies, plucked bass, light clapper, smiling host, drugged wine, mischievous, not quite safe, instrumental
```

### `fortress`: Walls of the Zhu Family Village
An enemy stronghold: watchtowers, trip-ropes and a maze of lanes; ominous and martial. 104 bpm, D minor.
```
ominous Chinese enemy fortress village theme, JRPG, 104 bpm, minor, stern erhu melody, repeated pipa ostinato, drums, gong, watchtowers, maze of lanes, trip-ropes, menacing, martial, instrumental
```

---

## 11. A note on bringing the tracks into the game

The game currently plays all music from its own built-in synthesizer, using the notated tracks in `js/data/music.js` and `js/data/music-places.js`. Playing Suno recordings instead will need a small change to the audio engine: load an audio file per track id, loop it, and fall back to the synthesizer when no file exists.

Export each take as `<track id>.mp3` (or `.ogg`) and keep them in one folder. The ids in this brief are exactly the ones the maps and scenes ask for.
