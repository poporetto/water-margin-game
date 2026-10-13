'use strict';
const assert = require('assert');
const fs = require('fs');
const { load } = require('./headless');
async function run() {
  const sb = load(), W = sb.WM, requests = [], crops = [];
  sb.Image = function () { requests.push(this); };
  W.util.makeCanvas = (width, height) => ({ width, height, getContext: () => ({ drawImage: (...args) => crops.push(args) }) });
  const spec = W.ASSETS.portraitSheets.hongxin;
  const pending = W.portraits.tryExpressionSheet('hongxin', spec);
  assert.strictEqual(W.portraits.tryExpressionSheet('hongxin', spec), pending);
  assert.strictEqual(requests.length, 1, 'Deduplicate in-flight sheet loads');
  const image = requests.pop(); image.width = 1422; image.height = 1106;
  image.onload(); assert.strictEqual(await pending, true);
  assert.strictEqual(crops.length, 6);
  assert.deepStrictEqual(crops.map(a => [a[1], a[2]]), [[0,0],[474,0],[948,0],[0,553],[474,553],[948,553]]);
  const normal = W.portraits.get('hongxin');
  assert.notStrictEqual(W.portraits.get('hongxin', 'angry'), normal);
  assert.strictEqual(W.portraits.get('hongxin', 'unknown'), normal);
  W.portraits.overrides.huarong = { isOverride: true };
  assert.strictEqual(W.portraits.get('huarong', 'shock'), W.portraits.overrides.huarong);
  const failed = W.portraits.tryExpressionSheet('missing', spec); requests.pop().onerror();
  assert.strictEqual(await failed, false); assert.strictEqual(W.portraits.overrides.missing, undefined);
  // A static portrait must not prevent a new expression sheet loading in menus.
  const staticLin = { isOverride: true };
  W.portraits.overrides.linchong = staticLin;
  assert.strictEqual(W.portraits.get('linchong', 'angry'), staticLin);
  const linImage = requests.pop();
  assert(linImage, 'Static fallback still starts expression loading');
  linImage.width = 1422; linImage.height = 1106; linImage.onload();
  const sheetNormal = W.portraits.get('linchong');
  W.portraits.tryOverride('linchong'); requests.pop().onload();
  assert.strictEqual(W.portraits.overrides.linchong, sheetNormal, 'Late static load cannot replace sheet normal');
  for (const id of Object.keys(W.ASSETS.portraitSheets)) {
    assert(fs.existsSync('assets/portraits/' + id + '-expressions.png'));
    assert.strictEqual(W.ui.resolveSpeaker(id).portrait, id);
  }
  const source = ['ch00_prologue.js', 'ch01_ninedragons.js', 'ch02_flowerymonk.js', 'ch03_pantherhead.js', 'ch04_blueface.js', 'ch05_birthdaygifts.js', 'ch06_timelyrain.js'].map(name => fs.readFileSync('js/data/story/' + name, 'utf8')).join('\n');
  const chapter3 = fs.readFileSync('js/data/story/ch03_pantherhead.js', 'utf8');
  for (const m of chapter3.matchAll(/s\.say\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter3.includes(id), 'Chapter 3 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter4 = fs.readFileSync('js/data/story/ch04_blueface.js', 'utf8');
  for (const m of chapter4.matchAll(/s\.say\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter4.includes(id), 'Chapter 4 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter5 = fs.readFileSync('js/data/story/ch05_birthdaygifts.js', 'utf8');
  for (const m of chapter5.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter5.includes(id), 'Chapter 5 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter6 = fs.readFileSync('js/data/story/ch06_timelyrain.js', 'utf8');
  for (const m of chapter6.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter6.includes(id), 'Chapter 6 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  for (const warId of ['ch5_shijie', 'ch5_huangan']) {
    const war = W.data.wars[warId];
    for (const unit of war.player.concat(war.enemy)) {
      const id = unit.leader || unit.portrait;
      if (id) assert(W.ASSETS.portraitSheets[id], warId + ': ' + id);
    }
    for (const phase of ['intro', 'win', 'lose']) {
      for (const [speaker] of war[phase] || []) {
        if (!speaker) continue;
        const [id, expr = 'normal'] = speaker.split(':');
        assert(W.ASSETS.portraitSheets[id].expressions.includes(expr), warId + ': ' + speaker);
      }
    }
  }
  for (const duelId of ['lin_hong', 'lin_yangzhi', 'yz_niuer', 'yz_zhoujin', 'yz_suochao', 'liutang_leiheng']) {
    const duel = W.data.duels[duelId];
    for (const phase of ['intro', 'win', 'lose', 'draw']) {
      for (const [speaker] of duel[phase] || []) {
        const [alias, expression = 'normal'] = speaker.split(':');
        const id = alias === 'hero' ? duel.hero : alias === 'foe' ? duel.foe : alias;
        assert(W.ASSETS.portraitSheets[id].expressions.includes(expression), duelId + ': ' + speaker);
      }
    }
  }
  for (const m of source.matchAll(/s\.say\('([^']+)'/g)) {
    const [id, expr = 'normal'] = m[1].split(':');
    if (W.ASSETS.portraitSheets[id]) assert(W.ASSETS.portraitSheets[id].expressions.includes(expr), m[1]);
  }
  W.gfx.ctx = sb.document.createElement('canvas').getContext('2d');
  const before = W.ui.stack.length;
  W.ui.message('wangjin:sad', 'A difficult farewell.');
  assert.strictEqual(W.ui.stack.length, before, 'Wait for first portrait before opening dialogue');
  const firstUse = requests.pop(); firstUse.width = 1422; firstUse.height = 1106; firstUse.onload();
  await Promise.resolve();
  assert.strictEqual(W.ui.stack.length, before + 1);
  assert.strictEqual(W.portraits.sheetSettled.wangjin, true);
  const failedBefore = W.ui.stack.length;
  W.ui.message('gaoqiu:angry', 'You dare defy me?');
  requests.pop().onerror();
  await Promise.resolve();
  assert.strictEqual(W.ui.stack.length, failedBefore + 1, 'A failed image must not block dialogue');
  console.log('PASS: expression selection, sheet crops, fallback, missing image, NPC speakers, first-use dialogue loading, and prologue/Chapter 1/Chapter 2/Chapter 3/Chapter 4/Chapter 5/Chapter 6 tags');
}
run().catch(e => { console.error(e); process.exit(1); });
