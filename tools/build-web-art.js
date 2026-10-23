#!/usr/bin/env node
// Streamable copies of the painted art, for playing from a web server. The originals stay where they are.
//   assets/portraits/*.png   -> assets/portraits-web/*.webp    each sheet cell 504 tall (3x the 168 frame)
//   assets/backgrounds/*.png -> assets/backgrounds-web/*.webp  kept at 1920x1440 (2x the 960x720 canvas)
// The game draws a portrait cell at 144x168 and the canvas backing scale k (js/core/gfx.js G.resize) reaches 3 on a
// full-screen high-DPI window, so 3x cells stay sharp; WebP does the rest (about 2.6 MB -> 180 KB a sheet).
// Sheet sizes are whole multiples of the grid, so the cells cut in PT.tryExpressionSheet never take a sliver of a
// neighbour. Up-to-date outputs are skipped; pass --force to rebuild. Needs cwebp (brew install webp).
// Usage: node tools/build-web-art.js [--force]   then sh tools/build.sh (or copy the -web folders) to refresh docs/.
'use strict';
var fs = require('fs'), path = require('path'), cp = require('child_process');
var root = path.join(__dirname, '..');
var force = process.argv.indexOf('--force') >= 0;
var CELL_H = 504, QUALITY = 85;

global.WM = {};
require(path.join(root, 'assets/manifest.js'));
var sheets = WM.ASSETS.portraitSheets || {};
var gridOf = {};   // sheet file name -> spec (a sheet may be shared through spec.file)
Object.keys(sheets).forEach(function (id) { gridOf[(sheets[id].file || id) + '-expressions.png'] = sheets[id]; });

function pngSize(file) {
  var b = Buffer.alloc(24); var fd = fs.openSync(file, 'r'); fs.readSync(fd, b, 0, 24, 0); fs.closeSync(fd);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
function fresh(src, out) { return !force && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs; }
function webp(src, out, w, h) {
  var args = ['-quiet', '-m', '6', '-q', String(QUALITY), '-sharp_yuv', '-metadata', 'none'];
  if (w) args.push('-resize', String(w), String(h));
  cp.execFileSync('cwebp', args.concat([src, '-o', out]));
}

var stats = { made: 0, skipped: 0, inBytes: 0, outBytes: 0 };
function convert(srcDir, outDir, sizeFor) {
  fs.mkdirSync(path.join(root, outDir), { recursive: true });
  fs.readdirSync(path.join(root, srcDir)).filter(function (f) { return /\.png$/.test(f); }).sort().forEach(function (f) {
    var src = path.join(root, srcDir, f), out = path.join(root, outDir, f.replace(/\.png$/, '.webp'));
    if (fresh(src, out)) stats.skipped++;
    else { var s = sizeFor(f, pngSize(src)); webp(src, out, s && s.w, s && s.h); stats.made++; }
    stats.inBytes += fs.statSync(src).size; stats.outBytes += fs.statSync(out).size;
  });
}

convert('assets/portraits', 'assets/portraits-web', function (f, size) {
  var spec = gridOf[f];
  var cols = spec ? spec.columns : 1, rows = spec ? spec.rows : 1;
  var cw = size.w / cols, ch = size.h / rows;
  if (ch <= CELL_H) return { w: Math.round(cw) * cols, h: Math.round(ch) * rows };   // already small: just even the grid
  return { w: Math.round(cw * CELL_H / ch) * cols, h: CELL_H * rows };
});
convert('assets/backgrounds', 'assets/backgrounds-web', function () { return null; });

var mb = function (n) { return (n / 1048576).toFixed(1) + ' MB'; };
console.log('made ' + stats.made + ', up to date ' + stats.skipped + '; ' + mb(stats.inBytes) + ' -> ' + mb(stats.outBytes));
