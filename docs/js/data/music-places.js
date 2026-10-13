// Location themes: one for each kind of place, so a city does not sound like a temple, nor a temple like a ruin.
// Written like js/data/music.js: jianpu, one token per eighth note, eight per bar, eight bars a loop.
// ' raises an octave, , lowers; # and b sharpen and flatten; '-' holds; '0' rests. Percussion: x hit, o soft, . rest.
// Tracks built on 6 (la) rather than 1 (do) take the darker, minor-sounding pentatonic mode.
'use strict';
(function () {
  var A = WM.audio;
  function track(id, title, desc, t) { t.title = title; t.desc = desc; A.defTrack(id, t); }
  function rest(n) { return 'x' + new Array(n).join('.'); }   // one hit, then silence until the loop comes round

  // ---------------- cities and towns ----------------
  track('capital', 'Lanterns of the Eastern Capital',
    'The imperial city: grand and crowded, wealth and bustle on every street (Kaifeng).', {
    bpm: 116, key: 'D',
    ch: [
      { inst: 'pipa', oct: 5, vol: 0.2, notes:
        '1\' - 6 5 6 1\' 2\' 3\' | 2\' 1\' 6 5 3 - 5 - | 6 1\' 6 5 3 5 2 3 | 5 - - 6 5 - - - |' +
        '3\' - 2\' 1\' 2\' 3\' 5\' 3\' | 2\' 1\' 2\' 3\' 1\' - 6 - | 5 6 1\' 2\' 3\' 2\' 1\' 6 | 1\' - - 2\' 1\' - - -' },
      { inst: 'dizi', oct: 5, vol: 0.11, notes:
        '5 - - - 6 - - - | 5 - - - 3 - - - | 6 - - - 5 - - - | 2 - - - 3 - - - |' +
        '1\' - - - 6 - - - | 5 - - - 6 - - - | 5 - - - 3 - - - | 5 - - - 1\' - - -' },
      { inst: 'zheng', oct: 3, vol: 0.12, notes:
        '1 5 1\' 5 1 5 1\' 5 | 6, 3 6 3 6, 3 6 3 | 4, 1 4 1 5, 2 5 2 | 1 5 1\' 5 1 5 1\' 5 |' +
        '6, 3 6 3 6, 3 6 3 | 2, 6, 2 6, 5, 2 5 2 | 4, 1 4 1 5, 2 5 2 | 1 5 1\' 5 1 - - -' },
      { inst: 'bass', oct: 2, vol: 0.18, notes:
        '1 - - - 5, - - - | 6, - - - 3, - - - | 4, - - - 5, - - - | 1 - - - 1 - - - |' +
        '6, - - - 3, - - - | 2 - - - 5, - - - | 4, - - - 5, - - - | 1 - - - 1 - - -' },
      { inst: 'drum', perc: true, vol: 0.22, notes: 'x...o...x.x.o...' },
      { inst: 'clap', perc: true, vol: 0.06, notes: '..x...x...x...x.' }
    ]
  });

  track('county', 'Willow Shade over a Quiet County',
    'A small county seat where nothing much happens: unhurried, sunlit, a little drowsy (Yanggu, Yuncheng).', {
    bpm: 84, key: 'G',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.18, notes:
        '3 - 5 6 5 - 3 2 | 1 - 2 3 2 - - - | 3 5 6 1\' 6 5 3 5 | 6 - - 5 3 - - - |' +
        '5 - 6 5 3 2 1 2 | 3 - 5 3 2 - 1 6, | 1 - 2 3 5 3 2 3 | 1 - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.12, notes:
        '1 5 3\' 5 1 5 3\' 5 | 6, 3 1\' 3 6, 3 1\' 3 | 4, 1 6 1 4, 1 6 1 | 5, 2 7 2 5, 2 5 2 |' +
        '1 5 3\' 5 1 5 3\' 5 | 6, 3 1\' 3 5, 2 5 2 | 4, 1 6 1 5, 2 7 2 | 1 5 3\' 5 1 - - -' },
      { inst: 'bass', oct: 2, vol: 0.15, notes:
        '1 - - - - - - - | 6, - - - - - - - | 4, - - - - - - - | 5, - - - - - - - |' +
        '1 - - - - - - - | 6, - - - 5, - - - | 4, - - - 5, - - - | 1 - - - - - - -' },
      { inst: 'clap', perc: true, vol: 0.035, notes: 'o.......o.......' }
    ]
  });

  track('riverport', 'Sails on the Xunyang',
    'A river port of boatmen and fish-brokers: flowing water, a wistful southern air (Jiangzhou, Jieyang, Wuweijun).', {
    bpm: 100, key: 'F',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.13, notes:
        '6 - 1\' 2\' 3\' - 2\' 1\' | 6 - 5 6 1\' - - - | 2\' 3\' 5\' 3\' 2\' 1\' 6 1\' | 2\' - - 1\' 6 - - - |' +
        '3 5 6 1\' 2\' - 1\' 6 | 5 6 1\' 6 5 - 3 - | 2 3 5 6 5 3 2 1 | 6, - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.13, notes:
        '6, 3 6 1\' 6 3 6, 3 | 4, 1 4 6 4 1 4, 1 | 2, 6, 2 4 2 6, 2, 6, | 3, 7, 3 5 3 7, 3, 7, |' +
        '6, 3 6 1\' 6 3 6, 3 | 1 5 1\' 3\' 1\' 5 1 5 | 2, 6, 2 4 3, 7, 3 5 | 6, 3 6 1\' 6 - - -' },
      { inst: 'bass', oct: 2, vol: 0.16, notes:
        '6, - - - 6, - - - | 4, - - - 4, - - - | 2 - - - 2 - - - | 3 - - - 3 - - - |' +
        '6, - - - 6, - - - | 1 - - - 1 - - - | 2 - - - 3 - - - | 6, - - - 6, - - -' },
      { inst: 'drum', perc: true, vol: 0.1, notes: 'o.......o...o...' }
    ]
  });

  track('frontier', 'Wind through the Northern Pass',
    'A garrison city on the cold northern marches: stern, windswept, soldiers on the walls (Daming, Yanmen, Cangzhou).', {
    bpm: 92, key: 'D',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.14, notes:
        '6 - - 5 6 1\' 2\' - | 1\' - 6 5 3 - - - | 5 6 5 3 2 3 5 - | 6 - - - - - 0 0 |' +
        '3\' - 2\' 1\' 2\' - 6 - | 1\' 2\' 1\' 6 5 - 3 - | 2 3 5 6 5 3 2 3 | 6, - - - - - 0 0' },
      { inst: 'dizi', oct: 5, vol: 0.09, notes:
        '0 0 0 0 0 0 0 0 | 3 - - - - - - - | 0 0 0 0 0 0 0 0 | 6 - - - 5 - - - |' +
        '0 0 0 0 0 0 0 0 | 1\' - - - - - - - | 0 0 0 0 0 0 0 0 | 6 - - - - - - -' },
      { inst: 'bass', oct: 2, vol: 0.18, notes:
        '6, - - - 6, - - - | 6, - - - 3, - - - | 5, - - - 5, - - - | 6, - - - 6, - - - |' +
        '6, - - - 6, - - - | 4, - - - 5, - - - | 5, - - - 3, - - - | 6, - - - 6, - - -' },
      { inst: 'drum', perc: true, vol: 0.2, notes: 'x.......x...x...' },
      { inst: 'gong', perc: true, vol: 0.1, f: 92, notes: rest(64) }
    ]
  });

  track('lakecity', 'Mist on West Lake',
    'An elegant southern city of lakes, gardens and painted boats (Hangzhou, Runzhou).', {
    bpm: 76, key: 'Eb',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.17, notes:
        '5 - 6 1\' 2\' - 1\' 6 | 5 - - 3 5 - - - | 6 1\' 2\' 3\' 2\' 1\' 6 5 | 6 - - - 0 0 0 0 |' +
        '3\' - 2\' 3\' 5\' - 3\' 2\' | 1\' - 6 1\' 2\' - - - | 3\' 2\' 1\' 6 5 6 1\' 6 | 5 - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.12, notes:
        '1 5 1\' 2\' 3\' 2\' 1\' 5 | 6, 3 6 1\' 3\' 1\' 6 3 | 4, 1 4 6 1\' 6 4 1 | 5, 2 5 6 2\' 6 5 2 |' +
        '6, 3 6 1\' 3\' 1\' 6 3 | 4, 1 4 6 1\' 6 4 1 | 2, 6, 2 4 6 4 2 6, | 1 5 1\' 2\' 3\' - - -' },
      { inst: 'bass', oct: 2, vol: 0.13, notes:
        '1 - - - - - - - | 6, - - - - - - - | 4, - - - - - - - | 5, - - - - - - - |' +
        '6, - - - - - - - | 4, - - - - - - - | 2 - - - 5, - - - | 1 - - - - - - -' }
    ]
  });

  // ---------------- the countryside ----------------
  track('village', 'Smoke above the Village Roofs',
    'A farming village: a folk tune for threshing floors and wine at the headman\'s gate (Shi Family Village, Peach Blossom Village).', {
    bpm: 108, key: 'C',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.17, notes:
        '1 2 3 5 3 2 1 - | 6, 1 2 3 2 - - - | 3 5 6 5 3 2 3 5 | 2 - 3 2 1 - - - |' +
        '5 6 1\' 6 5 3 2 3 | 5 - 6 5 3 - - - | 2 3 5 3 2 1 6, 1 | 1 - - - 1 - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.12, notes:
        '1 5 1 5 1 5 1 5 | 6, 3 6, 3 6, 3 6, 3 | 1 5 1 5 4, 1 4, 1 | 5, 2 5, 2 1 5 1 5 |' +
        '1 5 1 5 4, 1 4, 1 | 1 5 1 5 6, 3 6, 3 | 5, 2 5, 2 5, 2 5, 2 | 1 5 1 5 1 - - -' },
      { inst: 'bass', oct: 2, vol: 0.15, notes:
        '1 - - - 1 - - - | 6, - - - 6, - - - | 1 - - - 4, - - - | 5, - - - 1 - - - |' +
        '1 - - - 4, - - - | 1 - - - 6, - - - | 5, - - - 5, - - - | 1 - - - 1 - - -' },
      { inst: 'clap', perc: true, vol: 0.06, notes: 'x.o.x.o.' },
      { inst: 'drum', perc: true, vol: 0.12, notes: 'x.......x.......' }
    ]
  });

  track('fishing', 'Nets at Dusk in Shijie',
    'A fishing village among the reeds: rocking boats, nets drying, an evening song (Shijie, East Creek).', {
    bpm: 80, key: 'A',
    ch: [
      { inst: 'zheng', oct: 4, vol: 0.15, notes:
        '3 - 5 3 2 - 1 2 | 3 - - 5 6 - 5 3 | 2 - 3 2 1 - 6, 1 | 2 - - - 3 - - - |' +
        '5 - 6 5 3 - 2 3 | 5 - - 6 1\' - 6 5 | 3 - 2 3 1 - 6, 2 | 1 - - - - - 0 0' },
      { inst: 'dizi', oct: 5, vol: 0.1, notes:
        '0 0 0 0 3 - - - | 5 - - - 3 - - - | 0 0 0 0 1 - - - | 2 - - - - - - - |' +
        '0 0 0 0 5 - - - | 6 - - - 5 - - - | 0 0 0 0 3 - - - | 1 - - - - - - -' },
      { inst: 'bass', oct: 2, vol: 0.14, notes:
        '1 - - - 5, - - - | 1 - - - 6, - - - | 4, - - - 1 - - - | 5, - - - 5, - - - |' +
        '1 - - - 5, - - - | 4, - - - 6, - - - | 4, - - - 5, - - - | 1 - - - 1 - - -' },
      { inst: 'clap', perc: true, vol: 0.03, notes: 'o.....o.....o...' }
    ]
  });

  track('marsh', 'Eight Hundred Li of Water',
    'The great marsh: open water and endless reeds, wide sky, a hidden road for those who know it (Liangshan Marsh, Liaoerwa).', {
    bpm: 72, key: 'F',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.17, notes:
        '1 - - 2 3 - 5 - | 6 - - 5 3 - - - | 2 - - 3 5 - 6 1\' | 6 - - - 5 - - - |' +
        '3 - - 5 6 - 1\' 2\' | 1\' - 6 5 6 - - - | 5 - 3 2 3 - 5 3 | 1 - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.11, notes:
        '1 3 5 3 1 3 5 3 | 6, 1 3 1 6, 1 3 1 | 2 4 6 4 2 4 6 4 | 4, 6, 1 6, 5, 7, 2 7, |' +
        '6, 1 3 1 6, 1 3 1 | 4, 6, 1 6, 4, 6, 1 6, | 5, 7, 2 7, 5, 7, 2 7, | 1 3 5 3 1 - - -' },
      { inst: 'bass', oct: 2, vol: 0.13, notes:
        '1 - - - - - - - | 6, - - - - - - - | 2 - - - - - - - | 4, - - - 5, - - - |' +
        '6, - - - - - - - | 4, - - - - - - - | 5, - - - - - - - | 1 - - - - - - -' }
    ]
  });

  track('forest', 'Shadows in Wild Boar Forest',
    'A dark wood where travellers are robbed and prisoners murdered: hushed, watchful, a heartbeat underneath (Wild Boar Forest).', {
    bpm: 70, key: 'C',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.13, notes:
        '6, - - - 1 - 7, - | 6, - - - 3, - - - | 6, - 1 2 3 - 2 1 | 7, - - - - - 0 0 |' +
        '3 - - 2 3 - 5 - | 4 - - 3 2 - - - | 1 - 7, 6, 5, - 7, - | 6, - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.1, notes:
        '6, 0 3 0 6, 0 3 0 | 6, 0 3 0 6, 0 3 0 | 4, 0 1 0 4, 0 1 0 | 3, 0 7, 0 3, 0 7, 0 |' +
        '6, 0 3 0 6, 0 3 0 | 4, 0 1 0 4, 0 1 0 | 2, 0 6, 0 3, 0 7, 0 | 6, 0 3 0 6, 0 0 0' },
      { inst: 'bass', oct: 2, vol: 0.16, notes:
        '6, - - - - - - - | 6, - - - - - - - | 4, - - - - - - - | 3, - - - - - - - |' +
        '6, - - - - - - - | 4, - - - - - - - | 2 - - - 3, - - - | 6, - - - - - - -' },
      { inst: 'drum', perc: true, vol: 0.14, notes: 'x.o.....x.o.....' }
    ]
  });

  // ---------------- temples ----------------
  track('temple', 'Bells of Mount Wutai',
    'A Buddhist monastery: incense, chanting, the great bell; calm and very still (Mount Wutai, Liuhe Pagoda, Mount Tai).', {
    bpm: 60, key: 'F',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.15, notes:
        '5 - - - 6 - 5 3 | 2 - - - - - - - | 3 - - 5 6 - - 5 | 3 - - - - - - - |' +
        '1\' - - 6 5 - 6 1\' | 2\' - - - 1\' - - - | 6 - 5 3 2 - 3 5 | 1 - - - - - - -' },
      { inst: 'zheng', oct: 3, vol: 0.1, notes:
        '1 0 5 0 1\' 0 0 0 | 6, 0 3 0 6 0 0 0 | 4, 0 1 0 4 0 0 0 | 6, 0 3 0 6 0 0 0 |' +
        '1 0 5 0 1\' 0 0 0 | 2, 0 6, 0 2 0 0 0 | 4, 0 1 0 5, 0 2 0 | 1 0 5 0 1\' 0 0 0' },
      { inst: 'bass', oct: 2, vol: 0.12, notes:
        '1 - - - - - - - | 6, - - - - - - - | 4, - - - - - - - | 6, - - - - - - - |' +
        '1 - - - - - - - | 2 - - - - - - - | 4, - - - 5, - - - | 1 - - - - - - -' },
      { inst: 'gong', perc: true, vol: 0.12, f: 110, notes: rest(16) },
      { inst: 'clap', perc: true, vol: 0.03, notes: 'o...o...o...o...' }
    ]
  });

  track('daoist', 'Clouds over Dragon-Tiger Mountain',
    'A Daoist mountain of immortals and hermits: high, airy and a little uncanny (Dragon-Tiger Mountain, Erxian Mountain, Mount Xiyue).', {
    bpm: 66, key: 'G',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.16, notes:
        '3\' - - 2\' 1\' - 6 - | 5 - 6 1\' 2\' - - - | 1\' - 6 5 3 - 5 6 | 5 - - - - - 0 0 |' +
        '6 - 1\' 2\' 3\' - 5\' 3\' | 2\' - 1\' 6 1\' - - - | 2\' 1\' 6 5 6 - 3 5 | 6 - - - - - 0 0' },
      { inst: 'zheng', oct: 4, vol: 0.09, notes:
        '1 3 5 1\' 5 3 1 3 | 6, 1 3 6 3 1 6, 1 | 4, 6, 1 4 1 6, 4, 6, | 5, 7, 2 5 2 7, 5, 7, |' +
        '6, 1 3 6 3 1 6, 1 | 2, 4, 6, 2 6, 4, 2, 4, | 4, 6, 1 4 5, 7, 2 5 | 6, 1 3 6 3 - - -' },
      { inst: 'bass', oct: 2, vol: 0.12, notes:
        '1 - - - - - - - | 6, - - - - - - - | 4, - - - - - - - | 5, - - - - - - - |' +
        '6, - - - - - - - | 2 - - - - - - - | 4, - - - 5, - - - | 6, - - - - - - -' },
      { inst: 'gong', perc: true, vol: 0.08, f: 130, notes: rest(32) }
    ]
  });

  track('haunted', 'Lamps Gutter in the Ruined Hall',
    'A fallen temple where something is wrong: cold drafts, dripping water, a shape in the dark (Waguan Monastery, the Hall of Subdued Demons, Centipede Ridge).', {
    bpm: 62, key: 'E',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.13, notes:
        '6, - - 7, 1 - 7, 6, | 5#, - - - 6, - - - | 6, - 1 3b 2 - 1 7, | 6, - - - - - 0 0 |' +
        '3 - - 4 3 - 2 1 | 2 - - 3b 2 - 1 7, | 1 - 7, 6, 5#, - 6, - | 6, - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.09, notes:
        '6, 0 0 0 0 0 3 0 | 0 0 7, 0 0 0 0 0 | 6, 0 0 0 0 0 4 0 | 0 0 3 0 0 0 0 0 |' +
        '6, 0 0 0 0 0 3 0 | 0 0 4 0 0 0 3b 0 | 6, 0 0 0 0 0 7, 0 | 0 0 0 0 0 0 0 0' },
      { inst: 'bass', oct: 2, vol: 0.14, notes:
        '6, - - - - - - - | 6, - - - - - - - | 4, - - - - - - - | 6, - - - - - - - |' +
        '6, - - - - - - - | 4, - - - - - - - | 3, - - - - - - - | 6, - - - - - - -' },
      { inst: 'drum', perc: true, vol: 0.08, notes: 'o.o.............' },
      { inst: 'gong', perc: true, vol: 0.1, f: 70, notes: rest(64) }
    ]
  });

  // ---------------- outlaws and their enemies ----------------
  track('bandits', 'Banners on the Bandit Peak',
    'A bandit stronghold up a mountain road: swagger, rough laughter, a chief who answers to no one (Shaohua, Erlong, Qingfeng, Mangdang).', {
    bpm: 116, key: 'D',
    ch: [
      { inst: 'pipa', oct: 5, vol: 0.2, notes:
        '6 6 1\' 6 5 - 3 - | 5 6 5 3 2 - - - | 3 3 5 3 2 1 6, 1 | 2 - 3 5 6 - - - |' +
        '1\' 1\' 2\' 1\' 6 - 5 - | 6 1\' 6 5 3 - 5 - | 2 3 5 3 2 1 2 3 | 6, - - - 6, - 0 0' },
      { inst: 'erhu', oct: 4, vol: 0.1, notes:
        '6, - - - 3 - - - | 5 - - - 2 - - - | 3 - - - 6, - - - | 2 - - - 6 - - - |' +
        '1\' - - - 6 - - - | 6 - - - 3 - - - | 2 - - - 2 - - - | 6, - - - - - - -' },
      { inst: 'bass', oct: 2, vol: 0.18, notes:
        '6, - 6, - 3, - 3, - | 5, - 5, - 2 - 2 - | 3, - 3, - 6, - 6, - | 2 - 2 - 6, - 6, - |' +
        '6, - 6, - 3, - 3, - | 6, - 6, - 3, - 3, - | 2 - 2 - 5, - 5, - | 6, - 6, - 6, - - -' },
      { inst: 'drum', perc: true, vol: 0.22, notes: 'x..x..x.x...x...' },
      { inst: 'clap', perc: true, vol: 0.06, notes: '....x.......x...' }
    ]
  });

  track('manor', 'Wine and Guests at the Manor',
    'A great family\'s country house: courtesy, open gates, a feast for wandering heroes (Chai Jin\'s manor, the Li and Kong manors).', {
    bpm: 86, key: 'Bb',
    ch: [
      { inst: 'zheng', oct: 4, vol: 0.16, notes:
        '5 6 1\' 2\' 1\' 6 5 - | 3 5 6 5 3 2 1 - | 2 3 5 6 5 3 2 3 | 5 - - - 6 - 5 - |' +
        '1\' 2\' 3\' 2\' 1\' 6 5 6 | 1\' - 6 5 3 - 5 - | 6 5 3 2 1 2 3 5 | 1 - - - - - 0 0' },
      { inst: 'dizi', oct: 5, vol: 0.1, notes:
        '3 - - - 5 - - - | 1 - - - 6, - - - | 2 - - - 3 - - - | 2 - - - 1 - - - |' +
        '3 - - - 5 - - - | 6 - - - 5 - - - | 3 - - - 2 - - - | 1 - - - - - - -' },
      { inst: 'bass', oct: 2, vol: 0.14, notes:
        '1 - - - 4, - - - | 6, - - - 1 - - - | 5, - - - 6, - - - | 5, - - - 4, - - - |' +
        '1 - - - 6, - - - | 4, - - - 1 - - - | 4, - - - 5, - - - | 1 - - - 1 - - -' },
      { inst: 'clap', perc: true, vol: 0.04, notes: 'o.......o...o...' }
    ]
  });

  track('shadyinn', 'Dumplings at Cross Slope',
    'A roadside inn with a smiling host and drugged wine: sly, playful, not quite safe (Cross Slope, Jieling Ridge, Zhu Gui\'s tavern).', {
    bpm: 100, key: 'G',
    ch: [
      { inst: 'pipa', oct: 5, vol: 0.2, notes:
        '6 0 6 1\' 6 0 5 0 | 3 0 5 0 6 - - 0 | 6 0 6 1\' 2\' 1\' 6 0 | 5 0 3 0 2 - - 0 |' +
        '3 0 3 5 6 0 5 3 | 2 0 1 0 6, - - 0 | 1 0 2 0 3 5 3 2 | 6, - - 0 6, 0 0 0' },
      { inst: 'erhu', oct: 4, vol: 0.11, notes:
        '0 0 0 0 0 0 3 - | 2 - - - 0 0 0 0 | 0 0 0 0 0 0 6 - | 5 - - - 0 0 0 0 |' +
        '0 0 0 0 0 0 1\' - | 6 - - - 0 0 0 0 | 0 0 0 0 0 0 5 - | 6 - - - - - 0 0' },
      { inst: 'bass', oct: 2, vol: 0.16, notes:
        '6, 0 6, 0 3, 0 3, 0 | 5, 0 5, 0 6, 0 6, 0 | 6, 0 6, 0 4, 0 4, 0 | 3, 0 3, 0 2 0 2 0 |' +
        '6, 0 6, 0 3, 0 3, 0 | 2 0 2 0 6, 0 6, 0 | 4, 0 4, 0 5, 0 5, 0 | 6, 0 6, 0 6, 0 0 0' },
      { inst: 'clap', perc: true, vol: 0.06, notes: 'x..x..x.' }
    ]
  });

  track('fortress', 'Walls of the Zhu Family Village',
    'An enemy stronghold: watchtowers, trip-ropes and a maze of lanes; ominous and martial (the Zhu Family Village, Zengtou City, Qingxi).', {
    bpm: 104, key: 'D',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.14, notes:
        '6, - 6, 1 2 - 1 6, | 5, - - - 6, - - - | 6, - 6, 1 3 - 2 1 | 2 - - - 3 - - - |' +
        '6 - 5 3 5 - 3 2 | 3 - 2 1 2 - - - | 1 - 2 3 2 1 7, 5, | 6, - - - - - 0 0' },
      { inst: 'pipa', oct: 4, vol: 0.12, notes:
        '6, 6, 6, 6, 6, 6, 6, 6, | 5, 5, 5, 5, 6, 6, 6, 6, | 6, 6, 6, 6, 1 1 1 1 | 2 2 2 2 3 3 3 3 |' +
        '6 6 6 6 5 5 5 5 | 3 3 3 3 2 2 2 2 | 1 1 1 1 7, 7, 5, 5, | 6, 6, 6, 6, 6, - - -' },
      { inst: 'bass', oct: 2, vol: 0.18, notes:
        '6, - - - 6, - - - | 5, - - - 6, - - - | 6, - - - 1 - - - | 2 - - - 3 - - - |' +
        '6, - - - 5, - - - | 3, - - - 2 - - - | 1 - - - 5, - - - | 6, - - - 6, - - -' },
      { inst: 'drum', perc: true, vol: 0.2, notes: 'x...x...x.x.x...' },
      { inst: 'gong', perc: true, vol: 0.1, f: 85, notes: rest(32) }
    ]
  });
})();
