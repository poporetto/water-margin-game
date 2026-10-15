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
  W.portraits.overrides.yangzhi = staticLin;
  assert.strictEqual(W.portraits.get('yangzhi', 'angry'), staticLin);
  const linImage = requests.pop();
  assert(linImage, 'Static fallback still starts expression loading');
  linImage.width = 1422; linImage.height = 1106; linImage.onload();
  const sheetNormal = W.portraits.get('yangzhi');
  W.portraits.tryOverride('yangzhi'); requests.pop().onload();
  assert.strictEqual(W.portraits.overrides.yangzhi, sheetNormal, 'Late static load cannot replace sheet normal');
  for (const id of Object.keys(W.ASSETS.portraitSheets)) {
    assert(fs.existsSync('assets/portraits/' + (W.ASSETS.portraitSheets[id].file || id) + '-expressions.png'));
    assert.strictEqual(W.ui.resolveSpeaker(id).portrait, W.data.npcs[id] && !W.data.npcs[id].face ? null : id);
  }
  W.portraits.cache['linchong_official:sad'] = {};
  W.portraits.cache['linchong_exile:sad'] = {};
  const savedState = W.state;
  W.state = { chapter: 3, flags: {} };
  assert.strictEqual(W.portraits.resolveId('linchong'), 'linchong_official');
  W.portraits.get('linchong', 'sad');
  const officialImage = requests.pop();
  assert(officialImage.src.endsWith('linchong-official-expressions.png'));
  officialImage.width = 1422; officialImage.height = 1106; officialImage.onload();
  const officialSad = W.portraits.get('linchong', 'sad');
  W.state.flags.ch3_exiled = true;
  assert.strictEqual(W.portraits.resolveId('linchong'), 'linchong_exile');
  W.portraits.get('linchong', 'sad');
  const exileImage = requests.pop();
  assert(exileImage.src.endsWith('linchong-exile-expressions.png'));
  exileImage.width = 1422; exileImage.height = 1106; exileImage.onload();
  assert.notStrictEqual(W.portraits.get('linchong', 'sad'), officialSad, 'Sentencing must switch already-cached expressions');
  W.state = { chapter: 4, flags: {} };
  assert.strictEqual(W.portraits.resolveId('linchong'), 'linchong_exile', 'Chapter select supports later saves');
  W.state = { chapter: 2, flags: {} };
  assert.strictEqual(W.portraits.get('linchong', 'sad'), officialSad, 'Earlier save restores official look');
  W.state = savedState;
  for (const spec of Object.values(W.ASSETS.portraitVariants)) {
    assert(fs.existsSync('assets/portraits/' + spec.file + '-expressions.png'));
  }
  for (const id of W.ASSETS.portraitGroups.courtAndTownsfolk) {
    const enabled = !['villager2', 'farmer', 'woman2', 'child', 'bandit', 'boatman', 'gambler', 'workman'].includes(id);
    assert.strictEqual(W.data.npcs[id].face, enabled, id + ' preserves existing portrait setting');
    assert.strictEqual(W.ASSETS.portraitSheets[id].expressions.length, 6);
    for (const expression of W.ASSETS.portraitSheets[id].expressions) {
      assert.strictEqual(W.ui.resolveSpeaker(id + ':' + expression).portrait, enabled ? id : null);
    }
  }
  const source = ['ch00_prologue.js', 'ch01_ninedragons.js', 'ch02_flowerymonk.js', 'ch03_pantherhead.js', 'ch04_blueface.js', 'ch05_birthdaygifts.js', 'ch06_timelyrain.js', 'ch07_pilgrim.js', 'ch08_qingfeng.js', 'ch09_xunyang.js', 'ch10_heavenlybooks.js', 'ch11_cuiping.js', 'ch12_zhujia.js', 'ch13_gaotang.js', 'ch14_chained.js', 'ch15_huazhou.js', 'ch16_zengtou.js', 'ch17_qilin.js', 'ch18_dongping.js'].map(name => fs.readFileSync('js/data/story/' + name, 'utf8')).join('\n');
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
  const chapter7 = fs.readFileSync('js/data/story/ch07_pilgrim.js', 'utf8');
  for (const m of chapter7.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter7.includes(id), 'Chapter 7 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter8 = fs.readFileSync('js/data/story/ch08_qingfeng.js', 'utf8');
  for (const m of chapter8.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter8.includes(id), 'Chapter 8 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter9 = fs.readFileSync('js/data/story/ch09_xunyang.js', 'utf8');
  for (const m of chapter9.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter9.includes(id), 'Chapter 9 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter10 = fs.readFileSync('js/data/story/ch10_heavenlybooks.js', 'utf8');
  for (const m of chapter10.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter10.includes(id), 'Chapter 10 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter11 = fs.readFileSync('js/data/story/ch11_cuiping.js', 'utf8');
  for (const m of chapter11.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter11.includes(id), 'Chapter 11 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  const chapter12 = fs.readFileSync('js/data/story/ch12_zhujia.js', 'utf8');
  for (const m of chapter12.matchAll(/s\.(?:say|ask)\('([^']+)'/g)) {
    const id = m[1].split(':')[0];
    assert(W.ASSETS.portraitGroups.chapter12.includes(id), 'Chapter 12 speaker missing portrait: ' + id);
    assert.strictEqual(W.ui.resolveSpeaker(m[1]).portrait, id);
  }
  for (const [chapter, file] of [[13, 'ch13_gaotang.js'], [14, 'ch14_chained.js'], [15, 'ch15_huazhou.js'], [16, 'ch16_zengtou.js'], [17, 'ch17_qilin.js'], [18, 'ch18_dongping.js']]) {
    const chapterSource = fs.readFileSync('js/data/story/' + file, 'utf8');
    for (const match of chapterSource.matchAll(/(?:s\.(?:say|ask)|WM\.npc)\('([^']+)'/g)) {
      const id = match[1].split(':')[0];
      assert(W.ASSETS.portraitGroups['chapter' + chapter].includes(id), 'Chapter ' + chapter + ' missing portrait: ' + id);
      assert.strictEqual(W.ui.resolveSpeaker(match[1]).portrait, id);
    }
  }
  for (const warId of ['ch5_shijie', 'ch5_huangan', 'ch8_qinming', 'ch9_river', 'ch12_second', 'ch12_third', 'ch13_gaotang1', 'ch13_gaotang2', 'ch14_chained', 'ch14_hooks', 'ch15_mangdang', 'ch17_daming', 'ch18_zengtou', 'ch18_dongchang']) {
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
  for (const duelId of ['lin_hong', 'lin_yangzhi', 'yz_niuer', 'yz_zhoujin', 'yz_suochao', 'liutang_leiheng', 'wusong_sunerniang', 'wusong_kongliang', 'huarong_qinming', 'likui_zhangshun_land', 'likui_zhangshun_water', 'likui_liyun', 'liying_zhubiao', 'wangying_hu', 'linchong_hu', 'sunli_shixiu', 'zhutong_likui', 'linchong_huyan', 'hu_pengqi', 'lu_huyan', 'yangzhi_huyan', 'linchong_zengkui', 'lu_likui', 'lu_luzhishen', 'lu_wusong', 'linchong_guansheng', 'likui_jiaoting', 'guansheng_shan', 'lu_shiwengong', 'xuning_dongping']) {
    const duel = W.data.duels[duelId];
    for (const phase of ['intro', 'win', 'lose', 'draw']) {
      for (const [speaker] of duel[phase] || []) {
        if (!speaker) continue;
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
  console.log('PASS: expression selection, sheet crops, fallback, missing image, NPC speakers, first-use dialogue loading, and prologue/Chapter 1/Chapter 2/Chapter 3/Chapter 4/Chapter 5/Chapter 6/Chapter 7/Chapter 8/Chapter 9/Chapter 10/Chapter 11/Chapter 12/Chapter 13/Chapter 14/Chapter 15/Chapter 16 tags');
}
run().catch(e => { console.error(e); process.exit(1); });
