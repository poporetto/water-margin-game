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
  // ---------------- the towns, one theme each, after what happens there ----------------
  // Written for a small folk band (xiao, dizi, pipa, ruan, guqin, zheng, erhu, sheng, bells, wood and small drums), in
  // the spirit of a JRPG's town themes: a tune you can hum, a regional colour, a little ache. Every theme is sixteen
  // bars (A A' B A''). The tune is written out once and handed between instruments bar by bar (part); the band
  // under it is worked out from one chord per bar (band), so its parts can never fall out of step with the tune.
  function rest16(bars) { return new Array(bars * 16 + 1).join('0 '); }
  function bars(str) { return str.split('|').map(function (b) { return b.trim(); }); }
  function mask(m) { return m.replace(/\s/g, '').split(''); }
  function deg(d) {   // a scale degree counted on past 7 (8 is 1 an octave up, 0 is 7 an octave down) as a jianpu note
    var o = Math.floor((d - 1) / 7), n = ((d - 1) % 7 + 7) % 7 + 1;
    return n + (o > 0 ? new Array(o + 1).join("'") : o < 0 ? new Array(-o + 1).join(',') : '');
  }
  function low(r) { return r >= 5 ? r - 7 : r; }   // a chord's root kept low, under the tune
  function triad(r) { var l = low(r); return deg(l) + '+' + deg(l + 2) + '+' + deg(l + 4); }
  // the band's figures, a bar each: steps above the chord's root (4 its fifth, 7 its octave, 9 its third above),
  // '-' holds, 'r' rests, 'C' the whole chord at once
  var FIG = {
    arp: [0, '-', 4, 7, 9, '-', 7, 4],       // a broken chord, rising and falling back
    lilt: [0, '-', '-', 4, '-', '-', 7, '-'], // three, three and two: a lilting step
    walk: [0, '-', -3, '-', 0, '-', -3, '-'], // root and the fifth below: a street band's bass
    hop: [0, 'r', -3, 'r', 0, 'r', -3, 'r'],  // the same, plucked short
    roll: [0, 4, 7, 4, 9, 4, 7, 4],           // running eighths, like water
    pulse: [0, '-', 7, '-', 0, '-', 7, '-'],  // a steady octave beat
    bass: [0, '-', '-', '-', '-', '-', '-', '-'],
    bass2: [0, '-', '-', '-', 4, '-', '-', '-'],
    pad: ['C', '-', '-', '-', '-', '-', '-', '-'],
    stab: ['r', 'r', 'C', '-', 'r', 'r', 'C', '-']
  };
  // chords: sixteen bars, each one root ('6') or two for half a bar each ('4/5'); m: which bars this part plays
  function band(chords, fig, m) {
    var on = m ? mask(m) : null, f = FIG[fig];
    return chords.map(function (ch, b) {
      if (on && on[b] === '0') return '0 0 0 0 0 0 0 0';
      var rs = String(ch).split('/').map(Number), out = [];
      rs.forEach(function (r, h) {
        var steps = rs.length > 1 ? f.slice(0, 4) : f;
        steps.forEach(function (s) { out.push(s === '-' ? '-' : s === 'r' ? '0' : s === 'C' ? triad(r) : deg(low(r) + s)); });
      });
      return out.join(' ');
    }).join(' | ');
  }
  // the tune's bars that this instrument plays (the rest are silent for it)
  function part(tune, m) { var on = mask(m); return bars(tune).map(function (b, i) { return on[i] === '1' ? b : '0 0 0 0 0 0 0 0'; }).join(' | '); }
  // zheng runs in sixteenths between the phrases: 'u' up from the chord's root, 'd' down to it, in the bar's second half
  function runs(chords, m) {
    var P = [], on = m.replace(/\s/g, '').split('');
    for (var o = -1; o <= 2; o++) [1, 2, 3, 5, 6].forEach(function (d) { P.push(d + 7 * o); });
    return chords.map(function (ch, b) {
      if (on[b] !== 'u' && on[b] !== 'd') return rest16(1);
      var r = Number(String(ch).split('/').pop()), i = 0;
      while (P[i] < r) i++;
      var run = P.slice(i, i + 8).map(deg);
      if (on[b] === 'd') run.reverse();
      return '0 0 0 0 0 0 0 0 ' + run.join(' ') + ' ';
    }).join('| ');
  }
  function town(id, title, desc, t) { t.group = 'towns'; track(id, title, desc, t); }

  // The Eastern Capital: the court's refinement and the rot under it (Gao Qiu's city; Lin Chong's wife wronged at the
  // temple, Yang Zhi selling his sabre). Gong mode: an elegant pipa over a court clapper; the dizi's verse turns minor.
  (function () {
    var C = [1, 6, 4, 5, 1, '3/6', '4/5', 1, 6, 3, 4, '2/5', 1, 6, '4/5', 1];
    var tune = "1' - 2' 1' 6 5 6 1' | 3' - - 2' 1' - 6 - | 6 1' 2' 1' 6 - 5 - | 5 - 6 5 2 - - - |" +
      "1' - 2' 1' 6 5 6 1' | 3' - 5' 3' 2' - 1' - | 6 - 1' 6 5 - 2 - | 1 - - - - - 0 0 |" +
      "3' - - 2' 3' - 6 - | 5 - 6 5 3 - - - | 6 - 1' 6 5 - 3 5 | 2 - - 3 5 - 6 - |" +
      "1' - 2' 1' 6 5 6 1' | 3' - - 5' 6' - 5' 3' | 2' - 1' 6 5 - 6 5 | 1' - - - - - 0 0";
    town('town_kaifeng', 'Lanterns over Bianliang', 'The Eastern Capital: refinement and splendour, and the rot under it (Gao Qiu\'s city).', {
      bpm: 96, key: 'Eb', ch: [
        { inst: 'pipa', oct: 4, vol: 0.34, trem: true, pan: -0.15, notes: part(tune, '11111111 00001111') },
        { inst: 'dizi', oct: 4, vol: 0.15, pan: 0.1, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.11, pan: -0.3, notes: band(C, 'arp') },
        { inst: 'sheng', oct: 4, vol: 0.07, pan: 0.3, notes: band(C, 'stab', '11111111 00001111') },
        { inst: 'sheng', oct: 4, vol: 0.06, pan: 0.3, notes: band(C, 'pad', '00000000 11110000') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass2') },
        { inst: 'zheng', oct: 4, div: 2, vol: 0.12, pan: 0.4, notes: runs(C, '000u000d 000u0000') },
        { inst: 'paiban', perc: true, vol: 0.25, pan: -0.1, notes: 'x.......' },
        { inst: 'xiaogu', perc: true, f: 220, vol: 0.07, notes: '........o...o...' },
        { inst: 'pengling', perc: true, f: 2400, vol: 0.04, pan: 0.3, notes: rest(64) }
      ] });
  })();

  // Daming, the Northern Capital: Yang Zhi's contest on the drill ground, Lu Junyi's great house, and the execution
  // ground. Shang mode, a march: the erhu's stern tune over a walking bass and a small drum; the dizi has the parade.
  (function () {
    var C = [2, 5, 6, 2, 2, 4, 5, 2, 4, 1, 6, 5, 2, 5, '4/5', 2];
    var tune = "2' - - 1' 6 - 5 6 | 1' - 6 5 3 - 2 - | 3 - 5 6 1' - 6 - | 2' - 1' 2' 3' - 2' - |" +
      "2' - - 1' 6 - 5 6 | 1' - 2' 1' 6 - 5 - | 6 - 5 3 2 - 3 5 | 2 - - - - - 0 0 |" +
      "1 - 2 3 5 - 3 2 | 1 - - 6, 5, - 6, 1 | 3 - 5 3 2 - 1 2 | 2 - 3 5 6 - 5 - |" +
      "2' - - 1' 6 - 5 6 | 1' - 6 5 3 - 2 - | 6 - 1' 6 5 - 3 - | 2 - - - - - 0 0";
    town('town_daming', 'Drill Ground of the Northern Capital', 'Daming: a garrison prefecture of parades and rich houses, and an execution ground.', {
      bpm: 100, key: 'D', ch: [
        { inst: 'erhu', oct: 4, vol: 0.15, notes: part(tune, '11111111 00001111') },
        { inst: 'dizi', oct: 5, vol: 0.13, pan: 0.15, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.14, pan: -0.3, notes: band(C, 'walk') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass') },
        { inst: 'zheng', oct: 4, div: 2, vol: 0.12, pan: 0.4, notes: runs(C, '000d0000 000u0000') },
        { inst: 'xiaogu', perc: true, f: 230, vol: 0.12, pan: 0.1, notes: 'x.o.x.o.x.x.x.o.' }
      ] });
  })();

  // Yanmen, a county under the frontier pass: Lu Da hiding, the Jin family's gratitude. Yu mode, an autumn wind: the
  // xiao's wide, lonely tune; the erhu's warmer middle verse is the kindness of the Jins.
  (function () {
    var C = [6, 4, 5, 6, 6, 3, '4/5', 6, 1, 5, 4, 5, 6, 4, 5, 6];
    var tune = "6 - - - 3' - 2' 1' | 6 - - 5 3 - - - | 2 - 3 5 6 - 5 - | 5 - 3 2 6, - - - |" +
      "6 - - - 3' - 2' 1' | 5 - 6 1' 2' - 3' - | 2' - 1' 6 5 - 3 - | 6 - - - - - 0 0 |" +
      "5 - 6 1' 2' - 1' 6 | 5 - - 3 2 - 3 5 | 6 - 5 6 1' - 2' - | 3' - - 2' 1' - 2' - |" +
      "6 - - - 3' - 2' 1' | 6 - - 5 3 - - - | 2 - 3 5 6 - 1' 6 | 6 - - - - - 0 0";
    town('town_yanmen', 'Autumn Wind at Yanmen Pass', 'Yanmen: a frontier county under the pass, where a fugitive finds kindness (Lu Da and the Jins).', {
      bpm: 80, key: 'C', ch: [
        { inst: 'xiao', oct: 4, vol: 0.15, pan: 0.15, notes: part(tune, '11111111 00001111') },
        { inst: 'erhu', oct: 4, vol: 0.14, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.12, pan: -0.3, notes: band(C, 'lilt') },
        { inst: 'guqin', oct: 2, vol: 0.11, notes: band(C, 'bass') },
        { inst: 'sheng', oct: 4, vol: 0.06, pan: 0.3, notes: band(C, 'pad', '00000000 11110000') },
        { inst: 'zheng', oct: 4, div: 2, vol: 0.11, pan: 0.4, notes: runs(C, '000d000d 00000000') },
        { inst: 'xiaogu', perc: true, f: 150, vol: 0.08, notes: 'x...............' }
      ] });
  })();

  // Cangzhou in summer: Lin Chong in exile, the prison camp, an old friend's tea house. Yu mode and slow, a scholar's
  // lament: the guqin itself carries the tune, the xiao takes the middle verse; almost nothing under them.
  (function () {
    var C = [6, 3, 4, 6, 6, 2, 3, 6, 4, 1, 2, 3, 6, 4, 3, 6];
    var tune = "6 - - - 5 6 1' - | 3' - - 2' 1' - 6 - | 1' - 2' 1' 6 - 5 - | 6 - - - - - 0 0 |" +
      "6 - - - 5 6 1' - | 2' - - 1' 2' - 3' - | 3' - 2' 1' 6 - 5 - | 6 - - - - - 0 0 |" +
      "3 - 5 6 5 - 3 2 | 1 - - 2 3 - 5 - | 6 - - 5 6 - 1' - | 5 - - 3 2 - - - |" +
      "6 - - - 5 6 1' - | 1' - 2' 1' 6 - 5 - | 3' - 2' 1' 5 - 6 - | 6 - - - - - 0 0";
    town('town_cangzhou', 'An Exile\'s Summer in Cangzhou', 'Cangzhou out of the snow: Lin Chong in exile, the prison camp, an old friend\'s tea house.', {
      bpm: 66, key: 'G', ch: [
        { inst: 'guqin', oct: 3, vol: 0.14, notes: part(tune, '11111111 00001111') },
        { inst: 'xiao', oct: 4, vol: 0.15, pan: 0.2, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.1, pan: -0.3, notes: band(C, 'lilt') },
        { inst: 'zheng', oct: 4, div: 2, vol: 0.09, pan: 0.4, notes: runs(C, '0000000d 00000000') },
        { inst: 'pengling', perc: true, f: 2200, vol: 0.035, pan: 0.3, notes: rest(64) }
      ] });
  })();

  // Yanggu: the town that cheered Wu Song for the tiger, where his brother sold buns, and where he was murdered. Zhi
  // mode: a storyteller's pipa patter over the clapper, until the erhu's middle verse grieves.
  (function () {
    var C = [5, 1, 6, 5, 5, 4, '2/5', 5, 6, 3, 4, 5, 5, 1, '4/2', 5];
    var tune = "5 5 6 5 2' - 1' 2' | 3' - 2' 1' 5 - 6 - | 1' 6 5 6 3 - 5 - | 2 3 5 6 5 - - - |" +
      "5 5 6 5 2' - 1' 2' | 1' - 6 1' 2' - 1' 6 | 5 6 5 3 2 - 3 - | 5 - - - - - 0 0 |" +
      "6 - - 5 3 - 2 3 | 5 - - 6 5 3 2 - | 1 - 2 3 2 - 1 6, | 2 - - 3 2 - 5 - |" +
      "5 5 6 5 2' - 1' 2' | 3' - 2' 1' 5 - 6 - | 1' 6 5 6 2 - 3 - | 5 - - - - - 0 0";
    town('town_yanggu', 'The Storyteller of Yanggu', 'Yanggu: cheers for the tiger-killer, buns sold in the street, a brother murdered, a debt repaid.', {
      bpm: 92, key: 'C', ch: [
        { inst: 'pipa', oct: 4, vol: 0.36, trem: true, pan: -0.1, notes: part(tune, '11111111 00001111') },
        { inst: 'erhu', oct: 4, vol: 0.16, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.12, pan: -0.3, notes: band(C, 'pulse') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass2') },
        { inst: 'sheng', oct: 4, vol: 0.06, pan: 0.3, notes: band(C, 'pad', '00000000 11110000') },
        { inst: 'zheng', oct: 4, div: 2, vol: 0.11, pan: 0.4, notes: runs(C, '000u0000 00000000') },
        { inst: 'paiban', perc: true, vol: 0.28, pan: 0.15, notes: 'x...x...' }
      ] });
  })();

  // Mengzhou: Shi En's Happy Forest, a strip of taverns and gambling dens that Jiang the Door God took by force; the
  // Mandarin Duck Tower. Shang mode with a swagger: the dizi struts over a plucked street bass; the erhu's verse is the night at the tower.
  (function () {
    var C = [2, 5, 2, 6, 2, 4, 5, 2, 6, 3, 4, 5, 2, 5, '4/5', 2];
    var tune = "2' - 2' 1' 6 - 5 6 | 5 - 6 5 2 - 3 5 | 6 - 1' 2' 3' 2' 1' 6 | 6 - 5 3 6 - - - |" +
      "2' - 2' 1' 6 - 5 6 | 1' - 2' 1' 6 - 5 - | 5 6 1' 2' 3' - 2' - | 2' - - - 2 - 0 0 |" +
      "6 - - 5 6 - 3 - | 5 - - 3 2 - 3 - | 1' - - 6 5 - 3 - | 2 - - - 3 - 5 - |" +
      "2' - 2' 1' 6 - 5 6 | 5 - 6 5 2 - 3 5 | 1' - 6 5 2 - 3 - | 2' - - - 2 - 0 0";
    town('town_mengzhou', 'Taverns of the Happy Forest', 'Mengzhou: a strip of taverns and gambling dens fought over by strongmen; the Mandarin Duck Tower.', {
      bpm: 108, key: 'G', ch: [
        { inst: 'dizi', oct: 4, vol: 0.17, pan: 0.1, notes: part(tune, '11111111 00001111') },
        { inst: 'erhu', oct: 4, vol: 0.15, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.14, pan: -0.3, notes: band(C, 'hop') },
        { inst: 'sheng', oct: 4, vol: 0.07, pan: 0.3, notes: band(C, 'stab', '11111111 00001111') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass', '00000000 11110000') },
        { inst: 'xiaogu', perc: true, f: 240, vol: 0.11, notes: 'x..x..x.x...o.o.' },
        { inst: 'muyu', perc: true, f: 720, vol: 0.06, pan: 0.35, notes: '..o...o.' }
      ] });
  })();

  // Qingfeng Fort: the Lantern Festival, where Song Jiang was seen, seized and caged; Hua Rong the archer. Gong mode,
  // festive: the dizi's lantern tune over the sheng and little bells; the erhu's minor verse is the arrest.
  (function () {
    var C = [1, 4, 1, 5, 1, 4, '2/5', 1, 6, 3, 2, 5, 1, 4, 5, 1];
    var tune = "5 6 1' - 6 5 3 5 | 6 - 1' 6 5 - 6 - | 1' 2' 3' 2' 1' 6 5 6 | 5 - - 3 2 - - - |" +
      "5 6 1' - 6 5 3 5 | 6 - 1' 2' 1' - 6 - | 6 5 3 5 2 - 3 - | 1 - - - - - 0 0 |" +
      "6 - - - 5 3 6 - | 3' - - 2' 1' - 6 - | 2' - 1' 6 5 - 6 - | 5 - - - 2 - 3 5 |" +
      "5 6 1' - 6 5 3 5 | 6 - 1' 6 5 - 6 - | 2' - 1' 6 5 - 2' - | 1' - - - - - 0 0";
    town('town_qingfeng', 'Lantern Night at Qingfeng', 'Qingfeng Fort: lanterns in every street on festival night, and a cage waiting for Song Jiang.', {
      bpm: 104, key: 'F', ch: [
        { inst: 'dizi', oct: 4, vol: 0.17, pan: 0.1, notes: part(tune, '11111111 00001111') },
        { inst: 'erhu', oct: 4, vol: 0.15, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.12, pan: -0.3, notes: band(C, 'arp') },
        { inst: 'sheng', oct: 4, vol: 0.08, pan: 0.3, notes: band(C, 'stab', '11111111 00001111') },
        { inst: 'sheng', oct: 4, vol: 0.06, pan: 0.3, notes: band(C, 'pad', '00000000 11110000') },
        { inst: 'zheng', oct: 4, div: 2, vol: 0.12, pan: 0.4, notes: runs(C, '000u0000 000u0000') },
        { inst: 'xiaogu', perc: true, f: 230, vol: 0.09, notes: 'x...o.o.x.o.o...' },
        { inst: 'pengling', perc: true, f: 2600, vol: 0.045, pan: 0.35, notes: 'x...............' }
      ] });
  })();

  // Jiangzhou on the Yangzi: Xunyang Tower, where Song Jiang wrote his rebel poem drunk, and the execution ground. Yu
  // mode, a southern river town: the moon lute runs like water under the erhu; the zheng recites the poem.
  (function () {
    var C = [6, 4, 5, 6, 6, 2, 3, 6, 4, 1, 2, 5, 6, 4, 5, 6];
    var tune = "3' - - 2' 1' 2' 6 - | 1' - - 6 5 - 3 - | 2 - 3 5 6 - 5 3 | 6 - - 5 6 - - - |" +
      "3' - - 2' 1' 2' 6 - | 1' - 2' 3' 5' - 3' - | 2' - 1' 6 5 - 3 - | 6 - - - - - 0 0 |" +
      "6' 5' 6' 1'' 6' - 5' - | 3' - 5' 6' 5' 3' 2' - | 1' 2' 3' 5' 3' - 2' 1' | 2' - - - 5 - - - |" +
      "3' - - 2' 1' 2' 6 - | 1' - - 6 5 - 3 - | 2 - 3 5 6 - 1' 6 | 6 - - - - - 0 0";
    town('town_jiangzhou', 'A Poem on Xunyang Tower', 'Jiangzhou: a river city on the Yangzi, a tower where a drunk clerk wrote treason, an execution ground.', {
      bpm: 84, key: 'Bb', ch: [
        { inst: 'erhu', oct: 3, vol: 0.16, notes: part(tune, '11111111 00001111') },
        { inst: 'zheng', oct: 3, vol: 0.16, pan: 0.3, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.09, pan: -0.3, notes: band(C, 'roll') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass') },
        { inst: 'sheng', oct: 4, vol: 0.05, pan: 0.3, notes: band(C, 'pad', '00000000 00001111') },
        { inst: 'muyu', perc: true, f: 560, vol: 0.05, pan: 0.2, notes: 'o.......o...o...' }
      ] });
  })();

  // Jieyang: a market town by the river where Xue Yong did his staff tricks for coins and the Mu brothers ruled the
  // street. Zhi mode, a fairground: a jaunty dizi, the performer's gong; the pipa's verse is the show itself.
  (function () {
    var C = [5, 1, 5, '2/5', 5, 4, '6/2', 5, 1, 4, 6, '2/5', 5, 1, '4/2', 5];
    var tune = "5 5 6 1' 2' - 1' 6 | 5 - 3 5 6 - 5 - | 5 5 6 1' 2' - 3' 2' | 1' 6 5 6 5 - - - |" +
      "5 5 6 1' 2' - 1' 6 | 1' - 6 1' 2' 1' 6 5 | 3 5 6 5 2 - 3 - | 5 - - - - - 0 0 |" +
      "1' 1' 2' 3' 2' 1' 6 1' | 6 - 5 6 1' - 6 5 | 3 3 5 6 5 3 2 3 | 2 - 3 5 5 - - - |" +
      "5 5 6 1' 2' - 1' 6 | 5 - 3 5 6 - 5 - | 1' - 6 5 6 - 2' - | 5 - - - - - 0 0";
    town('town_jieyang', 'Street Show at Jieyang', 'Jieyang: a riverside market where a wandering performer passes the hat, and the local bullies don\'t like it.', {
      bpm: 116, key: 'D', ch: [
        { inst: 'dizi', oct: 4, vol: 0.17, pan: 0.1, notes: part(tune, '11111111 00001111') },
        { inst: 'pipa', oct: 4, vol: 0.34, pan: -0.15, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.14, pan: -0.3, notes: band(C, 'walk') },
        { inst: 'sheng', oct: 4, vol: 0.07, pan: 0.3, notes: band(C, 'stab', '00000000 00001111') },
        { inst: 'xiaogu', perc: true, f: 250, vol: 0.11, notes: 'x.x.o.x.x.o.x.o.' },
        { inst: 'paiban', perc: true, vol: 0.22, pan: -0.1, notes: 'x.......' },
        { inst: 'gong', perc: true, f: 260, vol: 0.05, pan: 0.3, notes: rest(64) }
      ] });
  })();

  // Jizhou: Yang Xiong the executioner and Shi Xiu the firewood seller; a wife, a monk, a temple's wooden fish at
  // dawn, and Cuiping Mountain. Yu mode, sly: the zheng picks its way with rests; the xiao's verse is the mountain.
  (function () {
    var C = [6, 3, 4, 6, 6, 2, '3/6', 6, 4, 5, 6, 3, 6, 2, 3, 6];
    var tune = "6 0 6 1' 6 0 5 3 | 5 0 3 0 2 - 3 - | 1 0 2 3 5 0 3 2 | 6, - - - 6, 0 0 0 |" +
      "6 0 6 1' 6 0 5 3 | 2 0 3 5 6 0 5 3 | 5 0 3 2 1 - 6, - | 6, - - - 0 0 0 0 |" +
      "6 - - 5 6 - 1' - | 2' - - 1' 6 - 5 - | 6 - 5 3 2 - 3 5 | 3 - - - - - 0 0 |" +
      "6 0 6 1' 6 0 5 3 | 2 0 3 5 6 0 5 3 | 5 0 3 2 3 - 5 - | 6, - - - 0 0 0 0";
    town('town_jizhou', 'Wooden Fish at Dawn in Jizhou', 'Jizhou: an executioner and a firewood seller sworn brothers, a faithless wife, a monk, Cuiping Mountain.', {
      bpm: 88, key: 'F', ch: [
        { inst: 'zheng', oct: 4, vol: 0.17, pan: 0.2, notes: part(tune, '11111111 00001111') },
        { inst: 'xiao', oct: 4, vol: 0.17, pan: 0.1, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.11, pan: -0.3, notes: band(C, 'lilt') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass') },
        { inst: 'muyu', perc: true, f: 680, vol: 0.06, pan: -0.2, notes: 'x...x...x...x...' },
        { inst: 'pengling', perc: true, f: 2800, vol: 0.04, pan: 0.3, notes: rest(32) }
      ] });
  })();

  // The inn below Dulong Ridge: Shi Qian steals the inn's rooster for supper, and the inn burns. Shang mode, a sly
  // tiptoe: the pipa plucked short over a hopping bass and the wooden fish; the dizi crows.
  (function () {
    var C = [2, 6, 2, 5, 2, 6, '4/5', 2, 4, 5, 3, 6, 2, 6, '4/5', 2];
    var tune = "2 0 2 3 5 0 3 0 | 6 0 5 0 3 - - 0 | 2 0 2 3 5 6 5 3 | 2 0 1 0 6, - - 0 |" +
      "2 0 2 3 5 0 3 0 | 6 0 5 0 3 - - 0 | 1 0 2 0 3 5 3 2 | 2 - - 0 2 0 0 0 |" +
      "6 - 5 6 1' - 0 0 | 2' - 1' 2' 5 - 0 0 | 3 5 3 2 1 2 3 0 | 6, - - - 0 0 0 0 |" +
      "2 0 2 3 5 0 3 0 | 6 0 5 0 3 - - 0 | 1 0 2 0 3 5 3 2 | 2 - - 0 2' 0 0 0";
    town('town_zhuinn', 'A Rooster for Supper', 'The inn below Dulong Ridge: a thief, a stolen rooster, an angry innkeeper and a fire.', {
      bpm: 112, key: 'A', ch: [
        { inst: 'pipa', oct: 4, vol: 0.5, pan: -0.15, notes: part(tune, '11111111 00001111') },
        { inst: 'dizi', oct: 5, vol: 0.16, pan: 0.15, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.17, pan: -0.3, notes: band(C, 'hop') },
        { inst: 'muyu', perc: true, f: 640, vol: 0.07, pan: 0.3, notes: 'x..x..x.' },
        { inst: 'xiaogu', perc: true, f: 260, vol: 0.07, notes: '........o.......' }
      ] });
  })();

  // Gaotang: Yin Tianxi takes the garden of Chai Jin's uncle; the governor Gao Lian raises winds and spirit soldiers
  // with his sorcery. Yu mode, uncanny: the sheng's clusters hang in the air over the low guqin; one chromatic step in the tune.
  (function () {
    var C = [6, 6, 4, 5, 6, 3, 4, 6, 2, 3, 4, 5, 6, 4, 5, 6];
    var tune = "6 - - - - - 5 6 | 1' - - 6 3' - - - | 2' - - 1' 6 - 5 - | 5 - - - 6 - - - |" +
      "6 - - - - - 5 6 | 3' - - 2' 3' - 5' - | 3' - 4#' 3' 2' - 1' - | 6 - - - - - 0 0 |" +
      "2' - - 3' 2' - 6 - | 3' - - 5' 3' - 2' - | 1' - - 2' 1' - 6 - | 2' - - - - - 0 0 |" +
      "6 - - - - - 5 6 | 2' - - 1' 6 - 5 - | 5 - - - 6 - 5 - | 6 - - - - - 0 0";
    town('town_gaotang', 'The Sorcerer\'s Prefecture', 'Gaotang: a garden seized by the governor\'s kin, and a governor who raises winds and spirit soldiers.', {
      bpm: 74, key: 'Bb', ch: [
        { inst: 'erhu', oct: 3, vol: 0.16, notes: part(tune, '11111111 00001111') },
        { inst: 'xiao', oct: 3, vol: 0.17, pan: 0.2, notes: part(tune, '00000000 11110000') },
        { inst: 'sheng', oct: 4, vol: 0.07, pan: 0.3, notes: band(C, 'pad') },
        { inst: 'guqin', oct: 2, vol: 0.12, notes: band(C, 'bass2') },
        { inst: 'muyu', perc: true, f: 450, vol: 0.06, pan: -0.2, notes: 'x.....x.........' },
        { inst: 'pengling', perc: true, f: 3200, vol: 0.04, pan: 0.35, notes: rest(32) }
      ] });
  })();

  // Dengzhou by the sea: the Xie brothers' tiger falls into the wrong man's garden, and their cousin the Tigress breaks
  // them out of prison. Zhi mode, bold and open: the dizi over rolling waves of the moon lute; the erhu's verse is the sea.
  (function () {
    var C = [5, 1, 5, 2, 5, 4, '1/2', 5, 6, 3, 4, '2/5', 5, 1, '4/2', 5];
    var tune = "5 - - 6 1' - 2' 3' | 3' - 2' 1' 6 - 5 - | 5 - 6 1' 2' 3' 5' 3' | 2' - - 1' 2' - - - |" +
      "5 - - 6 1' - 2' 3' | 6 - 1' 6 5 - 3 - | 1' - 3' 2' 1' - 6 - | 5 - - - - - 0 0 |" +
      "3 - 5 6 1' - 6 5 | 5 - - 3 2 - 3 - | 6 - 1' 2' 1' - 6 - | 2' - 1' 6 5 - - - |" +
      "5 - - 6 1' - 2' 3' | 3' - 2' 1' 6 - 5 - | 6 - 1' 6 2' - 1' - | 5 - - - - - 0 0";
    town('town_dengzhou', 'Tigers by the Eastern Sea', 'Dengzhou: a harbour town on the sea, hunters who lost their tiger, a tigress who opened the prison.', {
      bpm: 90, key: 'E', ch: [
        { inst: 'dizi', oct: 4, vol: 0.17, pan: 0.1, notes: part(tune, '11111111 00001111') },
        { inst: 'erhu', oct: 4, vol: 0.15, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.09, pan: -0.3, notes: band(C, 'roll') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass2') },
        { inst: 'zheng', oct: 4, div: 2, vol: 0.12, pan: 0.4, notes: runs(C, '000u000d 00000000') },
        { inst: 'xiaogu', perc: true, f: 200, vol: 0.09, notes: 'x.......x...x...' }
      ] });
  })();

  // Wugang Market: the smithy, where Tang Long forges the hooked lances. Gong mode, a work song: the pipa over a
  // steady octave beat, and the ring of the anvil.
  (function () {
    var C = [1, 1, 4, 5, 1, 6, '4/5', 1, 4, 1, 6, 5, 1, 6, '4/5', 1];
    var tune = "1' - 1' 6 5 - 6 1' | 2' - 1' 2' 3' - - - | 6 - 6 5 6 1' 6 5 | 5 - 3 2 2 - - - |" +
      "1' - 1' 6 5 - 6 1' | 3' - 2' 1' 6 - - - | 6 1' 6 5 2 - 3 - | 1 - - - 1' - 0 0 |" +
      "6 - 5 6 1' - - - | 5 - 3 5 6 - 5 - | 3 - 2 3 5 - 3 2 | 2 - - - - - 0 0 |" +
      "1' - 1' 6 5 - 6 1' | 3' - 2' 1' 6 - - - | 6 1' 6 5 2 - 3 - | 1 - - - 1' - 0 0";
    town('town_wugang', 'Hammers at Wugang Market', 'Wugang Market: the smithy\'s fire and anvil, where the hooked lances are forged.', {
      bpm: 104, key: 'C', ch: [
        { inst: 'pipa', oct: 4, vol: 0.34, trem: true, pan: -0.15, notes: part(tune, '11111111 00001111') },
        { inst: 'dizi', oct: 5, vol: 0.12, pan: 0.15, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.13, pan: -0.3, notes: band(C, 'pulse') },
        { inst: 'guqin', oct: 2, vol: 0.1, notes: band(C, 'bass') },
        { inst: 'sheng', oct: 4, vol: 0.06, pan: 0.3, notes: band(C, 'stab', '00000000 11110000') },
        { inst: 'pengling', perc: true, f: 1800, vol: 0.05, pan: 0.3, notes: 'x...x...' },
        { inst: 'muyu', perc: true, f: 900, vol: 0.05, pan: -0.2, notes: '..o...o.' }
      ] });
  })();

  // Jiankang, the old southern capital: the physician An Daoquan, fetched across the Yangzi to save Song Jiang. Gong
  // mode, a Jiangnan scholar's garden: the xiao and the guqin take turns, gently, with hope in it.
  (function () {
    var C = [1, 6, 2, 5, 1, 3, '4/5', 1, 4, 3, 2, 5, 1, 6, '4/5', 1];
    var tune = "3 - - 5 6 - 5 3 | 1' - - 6 5 - 3 - | 2 - 3 2 1 - 6, - | 2 - - - 5 - - - |" +
      "3 - - 5 6 - 5 3 | 5 - 6 1' 2' - 1' - | 6 - 5 3 2 - 3 - | 1 - - - - - 0 0 |" +
      "6 - - 5 6 - 1' - | 5 - - 3 5 - 6 - | 1' - 6 5 6 - - - | 5 - - - - - - - |" +
      "3 - - 5 6 - 5 3 | 1' - - 6 5 - 3 - | 6 - 5 3 2 - 3 - | 1 - - - - - 0 0";
    town('town_jiankang', 'A Physician in Jiankang', 'Jiankang, the old southern capital: gardens and scholars, and a doctor fetched across the river to save a life.', {
      bpm: 72, key: 'Eb', ch: [
        { inst: 'xiao', oct: 4, vol: 0.17, pan: 0.15, notes: part(tune, '11111111 00001111') },
        { inst: 'guqin', oct: 3, vol: 0.2, notes: part(tune, '00000000 11110000') },
        { inst: 'ruan', oct: 3, vol: 0.1, pan: -0.3, notes: band(C, 'arp') },
        { inst: 'guqin', oct: 2, vol: 0.08, notes: band(C, 'bass', '11111111 00001111') },
        { inst: 'sheng', oct: 4, vol: 0.05, pan: 0.3, notes: band(C, 'pad', '00000000 00001111') },
        { inst: 'pengling', perc: true, f: 2400, vol: 0.04, pan: 0.3, notes: rest(64) }
      ] });
  })();
})();
