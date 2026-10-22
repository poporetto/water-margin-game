// Original soundtrack, written in jianpu (numbered notation). Each token is an eighth note;
// ' raises an octave, , lowers; '-' holds; '0' rests. Eight tokens per bar.
'use strict';
(function () {
  var A = WM.audio;

  A.defTrack('title', {
    bpm: 66, key: 'D',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.22, notes:
        '3 - - 5 6 - 1\' - | 6 - 5 - 3 - - - | 2 - 3 5 3 - 2 1 | 6, - - - - - 0 0 |' +
        '1 - 2 3 5 - 6 5 | 3 - - 2 1 - 2 - | 3 - 5 3 2 - 1 6, | 1 - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.16, notes:
        '1 5 1\' 3\' 2\' 1\' 5 3 | 6, 3 6 1\' 6 3 1 3 | 5, 2 5 6 5 2 6, 2 | 6, 3 6 1\' 6 3 1 3 |' +
        '1 5 1\' 3\' 2\' 1\' 5 3 | 6, 3 6 1\' 6 3 1 3 | 5, 2 5 6 5 2 6, 2 | 1 5 1\' 3\' 5\' - - -' },
      { inst: 'bass', oct: 2, vol: 0.2, notes: '1 - - - - - - - | 6, - - - - - - - | 5, - - - - - - - | 6, - - - - - - - | 1 - - - - - - - | 6, - - - - - - - | 5, - - - - - - - | 1 - - - - - - -' },
      { inst: 'gong', perc: true, vol: 0.18, f: 98, notes: 'x...............................................................' }
    ]
  });

  A.defTrack('field', {
    bpm: 96, key: 'G',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.18, notes:
        '5 6 1\' - 6 5 3 5 | 6 - 5 3 2 - 3 - | 1 2 3 5 6 5 3 2 | 1 - - 6, 1 - - - |' +
        '3 5 6 1\' 2\' 1\' 6 5 | 6 - 1\' 6 5 - 3 - | 2 3 5 3 2 1 6, 1 | 2 - - 3 1 - - -' },
      { inst: 'zheng', oct: 3, vol: 0.13, notes:
        '1 5 3\' 5 1 5 3\' 5 | 6, 3 1\' 3 6, 3 1\' 3 | 1 5 3\' 5 1 5 3\' 5 | 5, 2 7 2 5, 2 7 2 |' +
        '1 5 3\' 5 1 5 3\' 5 | 4, 1 6 1 4, 1 6 1 | 5, 2 7 2 5, 2 7 2 | 1 5 3\' 5 1 - - -' },
      { inst: 'bass', oct: 2, vol: 0.17, notes: '1 - - - 5, - - - | 6, - - - 3, - - - | 1 - - - 5, - - - | 5, - - - 5, - - - | 1 - - - 5, - - - | 4, - - - 1 - - - | 5, - - - 2 - - - | 1 - - - 1 - - -' },
      { inst: 'clap', perc: true, vol: 0.05, notes: 'x...o...x...o...' }
    ]
  });

  A.defTrack('market', {   // Weizhou's own: the original lively town tune
    bpm: 112, key: 'D',
    ch: [
      { inst: 'pipa', oct: 5, vol: 0.2, notes:
        '1\' 6 5 6 1\' - 2\' - | 3\' 2\' 1\' 6 5 - - - | 6 5 3 5 6 1\' 6 5 | 3 - 2 3 5 - - - |' +
        '1\' 6 5 3 2 3 5 6 | 1\' - 6 1\' 2\' - - - | 3\' 2\' 1\' 6 5 6 1\' 6 | 5 - - 3 5 - - -' },
      { inst: 'dizi', oct: 5, vol: 0.09, notes: '1\' - - - - - - - | 5 - - - - - - - | 6 - - - - - - - | 5 - - - - - - - | 6 - - - - - - - | 1\' - - - - - - - | 2\' - - - - - - - | 5 - - - - - - -' },
      { inst: 'bass', oct: 2, vol: 0.18, notes: '1 . 5, . 1 . 5, . | 6, . 3, . 6, . 3, . | 6, . 3, . 6, . 3, . | 5, . 2 . 5, . 2 . | 6, . 3, . 6, . 3, . | 1 . 5, . 1 . 5, . | 1 . 5, . 1 . 5, . | 5, . 2 . 5, . 2 .' },
      { inst: 'clap', perc: true, vol: 0.06, notes: 'x.o.x.o.x.o.x.o.' },
      { inst: 'drum', perc: true, vol: 0.12, f: 90, notes: 'x.......x...x...' }
    ]
  });

  // Old Streets of the County Town (every town but Weizhou): looking back rather than bustling. The pipa sings the
  // tune in a slow rolling tremolo over the moon lute, the erhu remembers the middle verse, the xiao brings the tune
  // home; the sheng breathes under the second half, the zheng lets notes fall between the phrases. It turns on the
  // minor (6) and comes home to 1 only at the very end, so the loop always starts again in a minor key.
  function rest(n) { return 'x' + new Array(n).join('.'); }   // one hit, then silence until the loop comes round
  function rest16(bars) { return new Array(bars * 16 + 1).join('0 '); }   // bars of silence in a sixteenth-note line
  A.defTrack('town', {
    bpm: 78, key: 'D',
    ch: [
      { inst: 'pipa', oct: 4, vol: 0.36, trem: true, pan: -0.15, notes:
        '3\' - - 2\' 1\' - 6 - | 1\' - 2\' 1\' 6 - 5 - | 3 - 5 6 5 - 3 2 | 2 - - 3 2 - - - |' +
        '3\' - - 2\' 1\' - 6 - | 1\' - 2\' 3\' 5\' - 3\' - | 2\' - 3\' 2\' 1\' - 6 - | 6 - - - - - 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0' },
      { inst: 'erhu', oct: 4, vol: 0.15, notes:
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '6 - 1\' 2\' 3\' - 2\' 1\' | 2\' - - 1\' 6 - 5 - | 6 - 5 3 5 - 6 1\' | 2\' - - 3\' 2\' - - - |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0' },
      { inst: 'xiao', oct: 4, vol: 0.17, pan: 0.2, notes:
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '3\' - - 2\' 1\' - 6 - | 1\' - 2\' 1\' 6 - 5 - | 6 - 5 3 2 - 3 - | 1 - - - - - 0 0' },
      { inst: 'ruan', oct: 3, vol: 0.12, pan: -0.3, notes:
        '6, - 3 6 1\' - 6 3 | 4, - 1 4 6 - 4 1 | 1 - 5 1\' 3\' - 1\' 5 | 5, - 2 5 7 - 5 2 |' +
        '6, - 3 6 1\' - 6 3 | 4, - 1 4 6 - 4 1 | 2 - 6 2\' 5, - 2 5 | 6, - 3 6 1\' - - - |' +
        '4, - 1 4 6 - 4 1 | 1 - 5 1\' 3\' - 1\' 5 | 6, - 3 6 1\' - 6 3 | 5, - 2 5 7 - 5 2 |' +
        '6, - 3 6 1\' - 6 3 | 4, - 1 4 6 - 4 1 | 5, - 2 5 7 - 5 2 | 1 - 5 1\' 3\' - - -' },
      { inst: 'guqin', oct: 2, vol: 0.11, notes:
        '6 - - - - - - - | 4 - - - - - - - | 1 - - - - - - - | 5 - - - - - - - |' +
        '6 - - - - - - - | 4 - - - - - - - | 2 - - - 5 - - - | 6 - - - - - - - |' +
        '4 - - - - - - - | 1 - - - - - - - | 6 - - - - - - - | 5 - - - - - - - |' +
        '6 - - - - - - - | 4 - - - - - - - | 5 - - - - - - - | 1 - - - - - - -' },
      { inst: 'sheng', oct: 4, vol: 0.06, pan: 0.3, notes:
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '6,+1+4 - - - - - - - | 1+3+5 - - - - - - - | 6,+1+3 - - - - - - - | 5,+7,+2 - - - - - - - |' +
        '6,+1+3 - - - - - - - | 6,+1+4 - - - - - - - | 5,+7,+2 - - - - - - - | 1+3+5 - - - - - 0 0' },
      { inst: 'zheng', oct: 4, div: 2, vol: 0.12, pan: 0.4, notes:   // in sixteenths: notes falling between the phrases
        rest16(3) + '| 0 0 0 0 0 0 0 0 5\' 3\' 2\' 1\' 6 5 3 2 |' +
        rest16(3) + '| 0 0 0 0 0 0 0 0 1\' 6 5 3 2 1 6, - |' +
        rest16(3) + '| 0 0 0 0 0 0 0 0 2 3 5 6 1\' 2\' 3\' - |' +
        rest16(4) },
      { inst: 'muyu', perc: true, f: 600, vol: 0.05, pan: 0.2, notes: 'o...............' },
      { inst: 'pengling', perc: true, f: 2600, vol: 0.04, pan: 0.3, notes: rest(64) }
    ]
  });

  A.defTrack('world', {
    bpm: 104, key: 'A',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.2, notes:
        '6, 1 2 3 - 2 3 5 | 6 - 5 6 3 - - - | 2 3 5 6 1\' 6 5 3 | 5 - - 6 5 - - - |' +
        '6 - 1\' 2\' 3\' - 2\' 1\' | 6 - 5 6 1\' - - - | 3 5 6 5 3 2 1 2 | 6, - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.12, notes: '6, 3 6 3 6, 3 6 3 | 4, 1 4 1 4, 1 4 1 | 5, 2 5 2 5, 2 5 2 | 1 5 1\' 5 1 5 1\' 5 | 4, 1 4 1 4, 1 4 1 | 1 5 1\' 5 1 5 1\' 5 | 5, 2 5 2 5, 2 5 2 | 6, 3 6 3 6, - - -' },
      { inst: 'bass', oct: 2, vol: 0.2, notes: '6, - - - 6, - - - | 4, - - - 4, - - - | 5, - - - 5, - - - | 1 - - - 1 - - - | 4, - - - 4, - - - | 1 - - - 1 - - - | 5, - - - 5, - - - | 6, - - - 6, - - -' },
      { inst: 'drum', perc: true, vol: 0.16, f: 75, notes: 'x..x..x.x..x..x.' }
    ]
  });

  A.defTrack('battle', {
    bpm: 150, key: 'E',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.15, notes:
        '6 6 1\' 6 2\' 1\' 6 5 | 6 - 3 5 6 - - - | 6 6 1\' 2\' 3\' 2\' 1\' 6 | 5 - 6 5 3 - - - |' +
        '3 3 5 6 1\' 6 5 3 | 2 - 3 5 6 - 5 - | 3\' 2\' 1\' 6 1\' 6 5 3 | 6 - - - 6, - - -' },
      { inst: 'pipa', oct: 3, vol: 0.2, notes: '6, 6 3 6 6, 6 3 6 | 6, 6 3 6 6, 6 3 6 | 4, 4 1 4 4, 4 1 4 | 5, 5 2 5 5, 5 2 5 | 1 1\' 5 1\' 1 1\' 5 1\' | 5, 5 2 5 5, 5 2 5 | 4, 4 1 4 5, 5 2 5 | 6, 6 3 6 6, 6 3 6' },
      { inst: 'bass', oct: 2, vol: 0.22, notes: '6, . 6, . 6, . 3, . | 6, . 6, . 6, . 3, . | 4, . 4, . 4, . 1 . | 5, . 5, . 5, . 2 . | 1 . 1 . 1 . 5, . | 5, . 5, . 5, . 2 . | 4, . 4, . 5, . 5, . | 6, . 6, . 6, . 6, .' },
      { inst: 'drum', perc: true, vol: 0.22, f: 70, notes: 'x.x.x..xx.x.x..x' },
      { inst: 'clap', perc: true, vol: 0.06, notes: '..x...x...x...xx' },
      { inst: 'cymbal', perc: true, vol: 0.07, notes: 'x...............................' }
    ]
  });

  A.defTrack('boss', {
    bpm: 160, key: 'D',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.16, notes:
        '6, - 7, 1 7, 6, 3 - | 6, - 7, 1 2 1 7, - | 6, - 3 4 3 1 7, - | 6, - - - - - 0 0 |' +
        '3 - 4 6 4 3 1 - | 2 - 3 4 3 2 7, - | 1 - 2 3 2 1 7, 5, | 6, - - - - - 0 0' },
      { inst: 'pipa', oct: 3, vol: 0.2, notes: '6, 6, 3 6, 6, 6, 4 6, | 6, 6, 3 6, 6, 6, 4 6, | 4, 4, 1 4, 4, 4, 2 4, | 3, 3, 7, 3, 3, 3, 7, 3, |' + '6, 6, 3 6, 6, 6, 4 6, | 7,, 7,, 4, 7,, 7,, 7,, 4, 7,, | 1, 1, 5, 1, 3, 3, 7, 3, | 6, 6, 3 6, 6, 6, 3 6,' },
      { inst: 'bass', oct: 2, vol: 0.24, notes: '6, - 6, - 6, - 6, - | 6, - 6, - 6, - 6, - | 4, - 4, - 4, - 4, - | 3, - 3, - 3, - 3, - | 6, - 6, - 6, - 6, - | 7,, - 7,, - 7,, - 7,, - | 1, - 1, - 3, - 3, - | 6, - 6, - 6, - 6, -' },
      { inst: 'drum', perc: true, vol: 0.26, f: 60, notes: 'x..xx..xx..xx.x.' },
      { inst: 'gong', perc: true, vol: 0.12, f: 80, notes: 'x...............................................................' },
      { inst: 'cymbal', perc: true, vol: 0.06, notes: '....x.......x...' }
    ]
  });

  A.defTrack('victory', {
    bpm: 128, key: 'C', once: true,
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.22, notes: '1 3 5 1\' - 5 6 5 | 6 1\' 2\' 3\' - - - - | 2\' - 1\' 6 5 6 1\' - | 1\' - - - - - - -' },
      { inst: 'zheng', oct: 4, vol: 0.15, notes: '1 5 1\' 5 1 5 1\' 5 | 4, 1 4 6 4 1 4 6 | 5, 2 5 7 5 2 5 7 | 1 5 1\' 3\' 5\' - - -' },
      { inst: 'gong', perc: true, vol: 0.2, f: 110, notes: 'x.......................x.......' },
      { inst: 'drum', perc: true, vol: 0.2, f: 80, notes: 'x.x.x...x.x.x...x.x.x...x.x.x...' }
    ]
  });

  A.defTrack('castle', {
    bpm: 92, key: 'F',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.19, notes:
        '5 - 6 1\' 2\' - 1\' 6 | 1\' - - 6 5 - - - | 3 5 6 5 3 2 1 2 | 3 - - 5 3 - - - |' +
        '6 - 1\' 6 5 - 3 5 | 6 - 5 3 2 - 3 - | 5 3 2 1 6, 1 2 3 | 1 - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.13, notes: '1 5 1\' 2\' 3\' 2\' 1\' 5 | 4, 1 4 6 1\' 6 4 1 | 6, 3 6 1\' 3\' 1\' 6 3 | 1 5 1\' 2\' 3\' 2\' 1\' 5 | 4, 1 4 6 1\' 6 4 1 | 2, 6, 2 4 6 4 2 6, | 5, 2 5 7 2\' 7 5 2 | 1 5 1\' 3\' 5\' - - -' },
      { inst: 'bass', oct: 2, vol: 0.2, notes: '1 - - - 1 - - - | 4, - - - 4, - - - | 6, - - - 6, - - - | 1 - - - 1 - - - | 4, - - - 4, - - - | 2 - - - 2 - - - | 5, - - - 5, - - - | 1 - - - 1 - - -' },
      { inst: 'drum', perc: true, vol: 0.12, f: 80, notes: 'x.......x..x....' }
    ]
  });

  // Liangshan once it is the brothers' own: a bustling, hopeful village-fortress tune — a bright dizi over a running
  // pipa, a skipping bass and a light folk beat (original, written for the game)
  A.defTrack('stronghold', {
    bpm: 118, key: 'D',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.17, notes:
        '1 2 3 5 6 - 5 3 | 2 3 5 - 3 2 1 - | 6, 1 2 3 5 3 2 1 | 2 - - 3 2 - - - | 5 6 1\' 6 5 3 5 6 | 1\' - 2\' 1\' 6 - 5 - | 3 5 6 5 3 2 1 2 | 1 - - - 1 - 0 0 | 5 - 6 1\' 2\' - 3\' 2\' | 1\' 6 5 6 1\' - - - | 6 1\' 6 5 3 5 6 - | 5 3 2 3 5 - - - | 3 5 6 1\' 2\' 1\' 6 5 | 6 - 5 3 2 - 3 - | 5 3 2 1 6, 1 2 3 | 1 - - - - - 0 0' },
      { inst: 'pipa', oct: 3, vol: 0.1, notes: '1 5 1\' 5 3\' 5 1\' 5 | 5, 2 5 2 7 2 5 2 | 6, 3 6 3 1\' 3 6 3 | 5, 2 5 2 7 2 5 2 | 4, 1 4 1 6 1 4 1 | 1 5 1\' 5 3\' 5 1\' 5 | 5, 2 5 2 7 2 5 2 | 1 5 1\' 5 3\' 5 1\' 5 | 1 5 1\' 5 3\' 5 1\' 5 | 4, 1 4 1 6 1 4 1 | 6, 3 6 3 1\' 3 6 3 | 2 6 2\' 6 4\' 6 2\' 6 | 4, 1 4 1 6 1 4 1 | 5, 2 5 2 7 2 5 2 | 5, 2 5 2 7 2 5 2 | 1 5 1\' 5 3\' 5 1\' 5' },
      { inst: 'bass', oct: 3, vol: 0.18, notes: '1, - - - 1, - 1, - | 5, - - - 5, - 5, - | 6, - - - 6, - 6, - | 5, - - - 5, - 5, - | 4, - - - 4, - 4, - | 1, - - - 1, - 1, - | 5, - - - 5, - 5, - | 1, - - - 1, - 1, - | 1, - - - 1, - 1, - | 4, - - - 4, - 4, - | 6, - - - 6, - 6, - | 2, - - - 2, - 2, - | 4, - - - 4, - 4, - | 5, - - - 5, - 5, - | 5, - - - 5, - 5, - | 1, - - - 1, - 1, -' },
      { inst: 'drum', perc: true, vol: 0.13, f: 85, notes: 'x...x.x.x...x...' },
      { inst: 'clap', perc: true, vol: 0.06, notes: '....x.......x.x.' }
    ]
  });

  // Rain on a Fresh Grave: a lament for a small band. The erhu weeps the tune over the low guqin, the xiao takes the
  // middle verse while the sheng breathes under it, one zheng run falls between the halves, one bell for the loop.
  A.defTrack('sad', {
    bpm: 58, key: 'D',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.16, notes:
        '6 - - 1\' 3\' - 2\' 1\' | 2\' - - - 1\' 6 5 - | 5 - 6 1\' 2\' - 1\' 6 | 6 - - - - - 0 0 |' +
        '6 - - 1\' 3\' - 5\' 3\' | 2\' - - 3\' 2\' 1\' 6 - | 3 - 5 6 5 - 3 2 | 6 - - - - - 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '6 - - 1\' 3\' - 2\' 1\' | 2\' - - - 1\' 6 5 - | 3 - 2 1 2 - 3 - | 6 - - - - - 0 0' },
      { inst: 'xiao', oct: 4, vol: 0.17, pan: 0.2, notes:
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '1\' - - 6 5 - 6 - | 3 - 5 6 5 - 3 2 | 2 - 3 5 6 - 5 - | 6 - - - - - 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0' },
      { inst: 'guqin', oct: 2, vol: 0.12, notes:
        '6, - - - 3 - - - | 4 - - - 1\' - - - | 5, - - - 2 - - - | 6, - - - 3 - - - |' +
        '6, - - - 3 - - - | 2 - - - 6 - - - | 3 - - - 7 - - - | 6, - - - 3 - - - |' +
        '4 - - - 1\' - - - | 1 - - - 5 - - - | 5, - - - 2 - - - | 6, - - - 3 - - - |' +
        '6, - - - 3 - - - | 4 - - - 1\' - - - | 3 - - - 7 - - - | 6, - - - 3 - - -' },
      { inst: 'sheng', oct: 4, vol: 0.05, pan: 0.3, notes:
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |' +
        '4+6+1\' - - - - - - - | 1+3+5 - - - - - - - | 5,+7,+2 - - - - - - - | 6,+1+3 - - - - - - - |' +
        '6,+1+3 - - - - - - - | 4+6+1\' - - - - - - - | 3+5+7 - - - - - - - | 6,+1+3 - - - - - - -' },
      { inst: 'zheng', oct: 3, div: 2, vol: 0.1, pan: 0.4, notes:   // in sixteenths: one run falling between the halves
        new Array(7 * 16 + 1).join('0 ') + '0 0 0 0 0 0 0 0 2\'\' 1\'\' 6\' 5\' 3\' 2\' 1\' 6 ' + new Array(8 * 16 + 1).join('0 ') },
      { inst: 'pengling', perc: true, f: 2000, vol: 0.04, pan: 0.3, notes: 'x' + new Array(128).join('.') }
    ]
  });

  A.defTrack('duel', {
    bpm: 132, key: 'E',
    ch: [
      { inst: 'erhu', oct: 4, vol: 0.15, notes: '6, - 6, 1 6, - 3 2 | 1 - 7, - 6, - - - | 6, - 6, 1 2 - 3 5 | 3 - 2 - 3 - - - | 6 - 5 3 6 - 5 3 | 2 - 1 2 3 - - - | 6, - 6, 1 6, - 3 2 | 1 - 7, - 6, - - -' },
      { inst: 'drum', perc: true, vol: 0.24, f: 65, notes: 'x...x.x.x...x.xx' },
      { inst: 'clap', perc: true, vol: 0.08, notes: '..x...x...x...x.' },
      { inst: 'bass', oct: 2, vol: 0.2, notes: '6, . . 6, . . 6, . | 6, . . 6, . . 6, . | 4, . . 4, . . 4, . | 5, . . 5, . . 5, . | 6, . . 6, . . 6, . | 4, . . 4, . . 4, . | 6, . . 6, . . 6, . | 3, . . 3, . . 3, .' }
    ]
  });

  // the great battles: martial music in the manner of 'The General's Command' (將軍令) — the suona crying over the
  // army, erhu doubling it below, pipa strumming like hoofbeats, the great drum and tanggu, cymbals, a gong for each charge
  A.defTrack('war', {
    bpm: 132, key: 'D',
    ch: [
      { inst: 'suona', oct: 5, vol: 0.115, notes:
        '5 - - 6 1\' - - - | 6 5 3 5 6 - - - | 1\' - 2\' 1\' 6 5 6 1\' | 5 - - - - - 0 0 |' +
        '3 - 5 6 5 3 2 3 | 5 - 3 2 1 - 2 3 | 2 3 5 6 5 3 2 1 | 2 - - - - - 0 0 |' +
        '1\' - 1\' 2\' 1\' 6 5 6 | 1\' - - - 6 - 5 - | 6 1\' 6 5 3 5 6 - | 5 - - - - - - - |' +
        '3 5 6 1\' 2\' - 1\' 6 | 5 - 6 5 3 - 2 3 | 1 - 2 3 5 6 5 3 | 1 - - - - - - - |' },
      { inst: 'erhu', oct: 4, vol: 0.08, notes:
        '5 - - 6 1\' - - - | 6 5 3 5 6 - - - | 1\' - 2\' 1\' 6 5 6 1\' | 5 - - - - - 0 0 |' +
        '3 - 5 6 5 3 2 3 | 5 - 3 2 1 - 2 3 | 2 3 5 6 5 3 2 1 | 2 - - - - - 0 0 |' +
        '1\' - 1\' 2\' 1\' 6 5 6 | 1\' - - - 6 - 5 - | 6 1\' 6 5 3 5 6 - | 5 - - - - - - - |' +
        '3 5 6 1\' 2\' - 1\' 6 | 5 - 6 5 3 - 2 3 | 1 - 2 3 5 6 5 3 | 1 - - - - - - - |' },
      { inst: 'pipa', oct: 4, vol: 0.12, notes:
        '1 1 5 5 1 1 5 5 | 6, 6, 3 3 6, 6, 3 3 | 1 1 5 5 1 1 5 5 | 5, 5, 2 2 5, 5, 2 2 |' +
        '6, 6, 3 3 6, 6, 3 3 | 1 1 5 5 1 1 5 5 | 5, 5, 2 2 5, 5, 2 2 | 5, 5, 2 2 5, 5, 2 2 |' +
        '1 1 5 5 1 1 5 5 | 4, 4, 1 1 4, 4, 1 1 | 6, 6, 3 3 6, 6, 3 3 | 5, 5, 2 2 5, 5, 2 2 |' +
        '6, 6, 3 3 6, 6, 3 3 | 5, 5, 2 2 5, 5, 2 2 | 1 1 5 5 1 1 5 5 | 1 1 5 5 1 - - - |' },
      { inst: 'horn', oct: 2, vol: 0.09, notes:
        '1 - - - - - - - | 6, - - - - - - - | 1 - - - - - - - | 5, - - - - - - - |' +
        '6, - - - - - - - | 1 - - - - - - - | 5, - - - - - - - | 5, - - - - - - - |' +
        '1 - - - - - - - | 4, - - - - - - - | 6, - - - - - - - | 5, - - - - - - - |' +
        '6, - - - - - - - | 5, - - - - - - - | 1 - - - - - - - | 1 - - - - - - - |' },
      { inst: 'bass', oct: 2, vol: 0.16, notes:
        '1 - 1 - 1 - 1 - | 6, - 6, - 6, - 6, - | 1 - 1 - 1 - 1 - | 5, - 5, - 5, - 5, - |' +
        '6, - 6, - 6, - 6, - | 1 - 1 - 1 - 1 - | 5, - 5, - 5, - 5, - | 5, - 5, - 5, - 5, - |' +
        '1 - 1 - 1 - 1 - | 4, - 4, - 4, - 4, - | 6, - 6, - 6, - 6, - | 5, - 5, - 5, - 5, - |' +
        '6, - 6, - 6, - 6, - | 5, - 5, - 5, - 5, - | 1 - 1 - 1 - 1 - | 1 - 1 - 1 - 1 - |' },
      { inst: 'bigdrum', perc: true, vol: 0.34, f: 48, notes: 'x...x...x...x.x.' },
      { inst: 'drum', perc: true, vol: 0.2, f: 70, notes: '..x.oxx...x.oxxo' },
      { inst: 'cymbal', perc: true, vol: 0.09, notes: 'x...............x.......x.......' },
      { inst: 'gong', perc: true, vol: 0.2, f: 80, notes: 'x...............................................................' }
    ]
  });

  A.defTrack('dungeon', {
    bpm: 76, key: 'C#',
    ch: [
      { inst: 'zheng', oct: 4, vol: 0.15, notes: '3 0 0 4 3 0 0 7, | 1 0 0 0 7, 0 6, 0 | 3 0 0 4 6 0 0 4 | 3 0 0 0 0 0 0 0 | 6, 0 0 7, 1 0 0 2 | 3 0 0 0 2 0 7, 0 | 1 0 0 7, 6, 0 0 5, | 6, 0 0 0 0 0 0 0' },
      { inst: 'erhu', oct: 3, vol: 0.07, notes: '6 - - - - - - - | 5 - - - - - - - | 4 - - - - - - - | 3 - - - - - - - | 6 - - - - - - - | 7 - - - - - - - | 1\' - - - 7 - - - | 6 - - - - - - -' },
      { inst: 'bass', oct: 1, vol: 0.2, notes: '6 - - - - - - - | 6 - - - - - - - | 4 - - - - - - - | 3 - - - - - - -' },
      { inst: 'drum', perc: true, vol: 0.08, f: 50, notes: 'x...............' }
    ]
  });

  A.defTrack('snow', {
    bpm: 70, key: 'B',
    ch: [
      { inst: 'dizi', oct: 4, vol: 0.18, notes: '6 - 1\' - 6 5 3 - | 5 - 3 2 3 - - - | 2 - 3 5 3 2 1 - | 6, - - - - - - - | 3 - 5 6 5 3 2 - | 3 - 2 1 2 - - - | 1 - 2 3 2 1 6, - | 6, - - - - - - -' },
      { inst: 'zheng', oct: 3, vol: 0.11, notes: '6, 3 6 1\' 3\' 1\' 6 3 | 5, 2 5 7 2\' 7 5 2 | 4, 1 4 6 1\' 6 4 1 | 6, 3 6 1\' 3\' - - - | 1 5 1\' 3\' 5\' 3\' 1\' 5 | 5, 2 5 7 2\' 7 5 2 | 4, 1 4 6 1\' 6 4 1 | 6, 3 6 1\' 3\' - - -' }
    ]
  });

  A.defTrack('inn', {
    bpm: 90, key: 'F', once: true,
    ch: [
      { inst: 'zheng', oct: 4, vol: 0.18, notes: '5 3 5 6 1\' - 6 5 | 3 2 1 2 3 - - - | 5 3 2 1 6, - 1 - | 1 - - - - - - -' },
      { inst: 'bass', oct: 2, vol: 0.14, notes: '1 - - - 4, - - - | 1 - - - 5, - - - | 4, - - - 5, - - - | 1 - - - - - - -' }
    ]
  });

  A.defTrack('tense', {
    bpm: 100, key: 'D',
    ch: [
      { inst: 'pipa', oct: 3, vol: 0.16, notes: '6, 0 6, 0 7, 0 6, 0 | 6, 0 6, 0 1 0 7, 0 | 6, 0 6, 0 7, 0 6, 0 | 4, 0 4, 0 3, 0 0 0' },
      { inst: 'erhu', oct: 3, vol: 0.08, notes: '6 - - - - - - - | 7 - - - - - - - | 1\' - - - 7 - - - | 6 - - - - - - -' },
      { inst: 'drum', perc: true, vol: 0.14, f: 55, notes: 'x.......x.......' }
    ]
  });

  A.defTrack('heroic', {
    bpm: 108, key: 'G',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.2, notes: '1 - 2 3 5 - 6 1\' | 6 - 5 3 5 - - - | 6 - 1\' 2\' 3\' 2\' 1\' 6 | 5 - - - - - 0 0 | 3 - 5 6 1\' - 6 5 | 6 - 5 3 2 - 3 - | 5 - 3 2 1 2 3 5 | 1 - - - - - 0 0' },
      { inst: 'zheng', oct: 3, vol: 0.14, notes: '1 5 1\' 3\' 1 5 1\' 3\' | 6, 3 6 1\' 5, 2 5 7 | 4, 1 4 6 4, 1 4 6 | 5, 2 5 7 5, 2 5 7 | 1 5 1\' 3\' 1 5 1\' 3\' | 6, 3 6 1\' 2, 6, 2 4 | 5, 2 5 7 5, 2 5 7 | 1 5 1\' 3\' 5\' - - -' },
      { inst: 'bass', oct: 2, vol: 0.2, notes: '1 - - - 1 - - - | 6, - - - 5, - - - | 4, - - - 4, - - - | 5, - - - 5, - - - | 1 - - - 1 - - - | 6, - - - 2 - - - | 5, - - - 5, - - - | 1 - - - 1 - - -' },
      { inst: 'drum', perc: true, vol: 0.16, f: 75, notes: 'x...x.x.x...x.x.' }
    ]
  });

  A.defTrack('palace', {
    bpm: 72, key: 'Eb',
    ch: [
      { inst: 'zheng', oct: 4, vol: 0.16, notes: '1\' - 6 5 6 - 1\' - | 5 - 3 2 3 - - - | 2 - 3 5 6 5 3 2 | 1 - - - - - - - | 3 - 5 6 1\' - 2\' 1\' | 6 - 5 6 5 - - - | 3 5 6 5 3 2 1 2 | 1 - - - - - - -' },
      { inst: 'dizi', oct: 5, vol: 0.08, notes: '1 - - - - - - - | 5, - - - - - - - | 2 - - - - - - - | 1 - - - - - - - | 3 - - - - - - - | 6, - - - - - - - | 5, - - - - - - - | 1 - - - - - - -' },
      { inst: 'clap', perc: true, vol: 0.05, notes: 'x...............' }
    ]
  });

  A.defTrack('ending', {
    bpm: 56, key: 'D',
    ch: [
      { inst: 'dizi', oct: 5, vol: 0.2, notes:
        '3 - - 5 6 - 1\' - | 6 - 5 - 3 - - - | 2 - 3 5 3 - 2 1 | 6, - - - - - 0 0 |' +
        '1 - 2 3 5 - 6 5 | 3 - - 2 1 - 2 - | 3 - 5 3 2 - 1 6, | 6, - - - - - 0 0' },
      { inst: 'erhu', oct: 3, vol: 0.08, notes: '1 - - - - - - - | 6, - - - - - - - | 5, - - - - - - - | 6, - - - - - - - | 1 - - - - - - - | 6, - - - - - - - | 5, - - - - - - - | 6, - - - - - - -' },
      { inst: 'zheng', oct: 3, vol: 0.12, notes: '1 5 1\' - 3\' - - - | 6, 3 6 - 1\' - - - | 5, 2 5 - 6 - - - | 6, 3 6 - 1\' - - - | 1 5 1\' - 3\' - - - | 6, 3 6 - 1\' - - - | 5, 2 5 - 6 - - - | 6, 3 6 - - - - -' }
    ]
  });

  // titles and moods, for the music room and for anyone re-scoring the game
  var NAMES = {
    title: ['Moon over the Marsh', 'Title screen and chapter cards: calm, moonlit, the whole saga ahead.'],
    field: ['Willows along the Highway', 'Country roads and hillsides between towns: light and pastoral.'],
    market: ['Market Day in the County Town', 'Weizhou: a busy ordinary town, stalls, porters, a lively crowd.'],
    town: ['Old Streets of the County Town', 'Yuncheng, Song Jiang\'s home county: tiled roofs and old streets, familiar, wistful, looking back.'],
    world: ['Roads under Heaven', 'The world map: setting out on a long journey.'],
    battle: ['Clash of Blades', 'Ordinary fights: fast and driving.'],
    boss: ['The Tiger Bares Its Teeth', 'Boss fights: faster and heavier, real danger.'],
    victory: ['Wine for the Victors', 'A short fanfare after a battle is won.'],
    castle: ['The Hall of Loyalty', 'Liangshan itself: home, brotherhood, pride.'],
    stronghold: ['Banners over the Marsh', 'Liangshan once it is yours: bustling, hopeful, home.'],
    sad: ['Rain on a Fresh Grave', 'Deaths and partings, Game Over: grief.'],
    duel: ['Thirty Bouts, No Victor', 'One-on-one duels: tense and pulsing.'],
    war: ['Drums along the Riverbank', 'Army battles: marching drums.'],
    dungeon: ['Into the Darkened Halls', 'Caves, deep woods and closed halls: wary and dark.'],
    snow: ['Snow on the Mountain God\'s Temple', 'Lin Chong in the snow: cold and alone.'],
    inn: ['Lamplight at the Inn', 'Inns and rest: cosy and quiet.'],
    tense: ['Footsteps in the Dark', 'Plots, ambushes and chases: suspense.'],
    heroic: ['Bare Fists on Jingyang Ridge', 'Heroic deeds: rousing and triumphant.'],
    palace: ['Incense in the Jade Hall', 'The court and great ceremonies: stately.'],
    ending: ['Their Names Fill the Land', 'The last card and the credits: elegy for the 108.']
  };
  Object.keys(NAMES).forEach(function (id) { if (A.tracks[id]) { A.tracks[id].title = NAMES[id][0]; A.tracks[id].desc = NAMES[id][1]; } });
})();
