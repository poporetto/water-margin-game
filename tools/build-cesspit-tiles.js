// The cesspit in the Xiangguo vegetable garden ('C'): the water autotiles recoloured to a murky olive sludge, so its
// banks blend into the grass the same way the river's do. Plain Node (zlib only): node tools/build-cesspit-tiles.js
'use strict';
const fs = require('fs'), zlib = require('zlib');
function readPng(f) {
  const b = fs.readFileSync(f); let o = 8, w, h, idat = [];
  while (o < b.length) { const len = b.readUInt32BE(o), t = b.toString('ascii', o + 4, o + 8), d = b.slice(o + 8, o + 8 + len);
    if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); if (d[8] !== 8 || d[9] !== 6 || d[12]) throw new Error('need 8-bit RGBA, not interlaced'); }
    if (t === 'IDAT') idat.push(d); o += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)), px = Buffer.alloc(w * h * 4), s = w * 4;
  for (let y = 0; y < h; y++) { const f = raw[y * (s + 1)];
    for (let x = 0; x < s; x++) { const v = raw[y * (s + 1) + 1 + x], a = x >= 4 ? px[y * s + x - 4] : 0, up = y ? px[(y - 1) * s + x] : 0, ul = y && x >= 4 ? px[(y - 1) * s + x - 4] : 0;
      let r = v; if (f === 1) r += a; else if (f === 2) r += up; else if (f === 3) r += (a + up) >> 1;
      else if (f === 4) { const p = a + up - ul, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - ul); r += pa <= pb && pa <= pc ? a : pb <= pc ? up : ul; }
      px[y * s + x] = r & 255; } }
  return { w, h, px };
}
function writePng(f, w, h, px) {
  const s = w * 4, raw = Buffer.alloc(h * (s + 1)); for (let y = 0; y < h; y++) px.copy(raw, y * (s + 1) + 1, y * s, y * s + s);
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = (buf) => { let c = 0xffffffff; for (const x of buf) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  fs.writeFileSync(f, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
}
const { w, h, px } = readPng('assets/tiles/32/water.png');
for (let i = 0; i < px.length; i += 4) { const r = px[i], g = px[i + 1], b = px[i + 2];
  if (px[i + 3] && b > r + 12 && b >= g - 10) {   // a water pixel (blue leads) becomes sludge; the grassy banks stay as they are
    const l = r * 0.3 + g * 0.5 + b * 0.2; px[i] = Math.min(255, l * 0.62 + 18); px[i + 1] = Math.min(255, l * 0.6 + 16); px[i + 2] = Math.min(255, l * 0.3 + 8); }
  else if (px[i + 3] && Math.min(r, g, b) > 120 && Math.max(r, g, b) - Math.min(r, g, b) < 60) {   // the river's pale foam line becomes a muddy bank
    const l = (r + g + b) / 3; px[i] = l * 0.55; px[i + 1] = l * 0.42; px[i + 2] = l * 0.26; } }
writePng('assets/tiles/32/cesspit.png', w, h, px);
console.log('assets/tiles/32/cesspit.png', w + 'x' + h);
