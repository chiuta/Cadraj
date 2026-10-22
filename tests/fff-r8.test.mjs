// Teste R8 pentru Cadraj 1.1.0: cod QR pentru colecții, mod de accesibilitate, player cu focus prins.
import {createRequire} from 'module';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
const AXE = process.env.FFF_AXE || '/tmp/claude-0/-home-claude/78529928-3825-51c3-b9bd-0e81655ab6bc/scratchpad/sweep/node_modules/axe-core/axe.min.js';
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); } }
const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox']});
async function open(w, h, hash) {
  const ctx = await b.newContext({viewport: {width: w, height: h}});
  let net = 0; await ctx.route(/^https?:/, (r) => { net++; r.abort(); });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror ' + e.message));
  p.on('console', (m) => { if (/Content Security|Refused/i.test(m.text())) errs.push('csp ' + m.text().slice(0, 120)); });
  p.on('dialog', (d) => d.accept());
  await p.goto(FILE + (hash || '')); await p.waitForTimeout(3600);
  return {ctx, p, errs, net: () => net};
}
async function axe(w, h, prep, label) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, bypassCSP: true}); await ctx.route(/^https?:/, (r) => r.abort());
  const p = await ctx.newPage(); await p.goto(FILE); await p.waitForTimeout(3600);
  await p.addScriptTag({content: fs.readFileSync(AXE, 'utf8')});
  if (prep) await prep(p);
  const v = await p.evaluate(async () => (await axe.run(document)).violations.map((x) => x.id + ':' + x.nodes.length));
  t('axe 0 violări ' + label + ' ' + w + 'px', v.length === 0, v.join(','));
  await ctx.close();
}
const ID = (n) => String(7123456789012345000n + BigInt(n));
async function add(p, links) { await p.fill('#url-input', links.join(' ')); await p.click('#add-form button[type=submit]'); }
async function qrPng(p) {
  return p.evaluate(async () => {
    const svg = document.querySelector('dialog.r8-dlg .r8-qr svg').outerHTML;
    const url = URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}));
    const img = new Image(); await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = url; });
    const c = document.createElement('canvas'); c.width = 560; c.height = 560; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 560, 560); g.drawImage(img, 0, 0, 560, 560);
    const blob = await new Promise((r) => c.toBlob(r, 'image/png')); return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
}
const U = (u, n, k) => `https://www.tiktok.com/@${u}/${k || 'video'}/${ID(n)}`;

console.log('Pornire și versiune');
{
  const {ctx, p, errs, net} = await open(1280, 800);
  t('0 pageerror/CSP', errs.length === 0, errs.join('|'));
  t('0 cereri de rețea', net() === 0);
  t('versiune 1.2.6', await p.evaluate(() => document.querySelector('meta[name=application-version]').content === '1.2.6' && /v 1\.2\.6 · 2026-10-23/.test(document.getElementById('app-version').textContent)));
  t('kit prezent', await p.evaluate(() => !!(window.FFF && FFF.label && FFF.bundle && FFF.qr)));
  await ctx.close();
}

console.log('Cod QR pentru colecție');
{
  const {ctx, p, errs} = await open(1280, 800);
  await add(p, [U('tester', 1), U('tester', 2), U('tester', 3, 'photo'), U('altcineva', 9)]);
  t('două colecții create', (await p.locator('.collection').count()) === 2);
  await p.locator('.collection', {hasText: '@tester'}).locator('button', {hasText: 'QR'}).click();
  t('dialog cu SVG', (await p.locator('dialog.r8-dlg[open] svg').count()) === 1);
  const text = await p.inputValue('dialog.r8-dlg textarea');
  t('conținut: autor + id-uri, fotografia marcată cu p', text === `cadraj1;tester;${ID(1)},${ID(2)},${ID(3)}p`, text);
  t('nu conține notele/alte colecții', !/altcineva/.test(text));
  const png = await qrPng(p);
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  t('Escape închide și readuce focusul pe butonul QR', (await p.locator('dialog.r8-dlg').count()) === 0 && (await p.evaluate(() => document.activeElement.textContent)) === 'QR');
  await p.click('#clear-btn'); await p.locator('dialog.cfm .cfm-y').click();
  t('colecțiile șterse', (await p.locator('.collection').count()) === 0);
  await p.setInputFiles('#qr-file', {name: 'q.png', mimeType: 'image/png', buffer: Buffer.from(png)}); await p.waitForTimeout(900);
  t('imaginea QR recreează colecția', (await p.locator('.collection').count()) === 1 && (await p.locator('.collection__title').textContent()) === '@tester' && (await p.locator('.frame-card').count()) === 3, await p.textContent('#add-hint'));
  t('fotografia păstrează tipul', (await p.locator('.frame__kind-badge').count()) === 1);
  t('mesaj cu numărătoare', /3 clips added to @tester/.test(await p.textContent('#add-hint')));
  // a doua citire: doar duplicate
  await p.setInputFiles('#qr-file', {name: 'q.png', mimeType: 'image/png', buffer: Buffer.from(png)}); await p.waitForTimeout(900);
  t('a doua citire nu duplică', (await p.locator('.frame-card').count()) === 3 && /0 clips added/.test(await p.textContent('#add-hint')));
  // QR cu alt conținut
  const other = await p.evaluate(async () => { const c = FFF.qr.canvas('salut lume', {scale: 6}); const blob = await new Promise((r) => c.toBlob(r, 'image/png')); return Array.from(new Uint8Array(await blob.arrayBuffer())); });
  await p.setInputFiles('#qr-file', {name: 'o.png', mimeType: 'image/png', buffer: Buffer.from(other)}); await p.waitForTimeout(800);
  t('QR străin respins', /does not contain a Cadraj/.test(await p.textContent('#add-hint')));
  // utilizator invalid / id-uri invalide în payload
  const evil = await p.evaluate(async () => { const c = FFF.qr.canvas('cadraj1;__proto__;123,abc,7123456789012345999', {scale: 6}); const blob = await new Promise((r) => c.toBlob(r, 'image/png')); return Array.from(new Uint8Array(await blob.arrayBuffer())); });
  await p.setInputFiles('#qr-file', {name: 'e.png', mimeType: 'image/png', buffer: Buffer.from(evil)}); await p.waitForTimeout(800);
  t('nume de utilizator invalid respins (__proto__)', /does not contain a Cadraj/.test(await p.textContent('#add-hint')) && (await p.locator('.collection').count()) === 1);
  const evil2 = await p.evaluate(async () => { const c = FFF.qr.canvas('cadraj1;ok.user;123,abc,7123456789012345999', {scale: 6}); const blob = await new Promise((r) => c.toBlob(r, 'image/png')); return Array.from(new Uint8Array(await blob.arrayBuffer())); });
  await p.setInputFiles('#qr-file', {name: 'e2.png', mimeType: 'image/png', buffer: Buffer.from(evil2)}); await p.waitForTimeout(800);
  t('id-uri invalide ignorate, cel valid adăugat', (await p.locator('.collection', {hasText: '@ok.user'}).locator('.frame-card').count()) === 1);
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}
{
  // colecție mare: se taie la 40
  const {ctx, p, errs} = await open(1280, 800);
  await add(p, Array.from({length: 70}, (_, i) => U('mare', 100 + i)));
  await p.locator('.collection').locator('button', {hasText: 'QR'}).click();
  const text = await p.inputValue('dialog.r8-dlg textarea');
  t('doar 40 de clipuri în cod', text.split(',').length === 40, String(text.split(',').length));
  t('mesaj „40 of 70”', /40 of 70 clips/.test(await p.textContent('dialog.r8-dlg')));
  const png = await qrPng(p);
  const dec = await p.evaluate(async (arr) => { const f = new File([new Uint8Array(arr)], 'q.png', {type: 'image/png'}); return await FFF.qr.scan(f); }, png);
  t('codul de 40 de clipuri se decodează identic', dec === text);
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Mod de accesibilitate');
{
  const {ctx, p, errs} = await open(1280, 800);
  const fs0 = await p.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  await p.click('#a11y-details summary');
  await p.check('#a11y-large'); await p.check('#a11y-contrast'); await p.check('#a11y-still');
  t('text mai mare: rădăcina +25%', await p.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)) === fs0 * 1.25);
  t('contrast ridicat: fundal negru', await p.evaluate(() => getComputedStyle(document.body).backgroundColor) === 'rgb(0, 0, 0)');
  t('fără animații: clasă setată', await p.evaluate(() => document.documentElement.classList.contains('a11y-still')));
  await p.reload(); await p.waitForTimeout(3600);
  t('preferințele se păstrează după reîncărcare', await p.evaluate(() => ['a11y-large', 'a11y-contrast', 'a11y-still'].every((c) => document.documentElement.classList.contains(c))));
  await p.click('#a11y-details summary');
  t('casetele reflectă starea salvată', (await p.isChecked('#a11y-large')) && (await p.isChecked('#a11y-contrast')));
  await p.uncheck('#a11y-large'); await p.uncheck('#a11y-contrast'); await p.uncheck('#a11y-still');
  t('dezactivare readuce stilul', await p.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)) === fs0);
  t('bundle include preferințele', await p.evaluate(() => /a11y/.test(JSON.stringify(FFF.bundle.build().data))) === true);
  await p.click('[data-lang="ro"]');
  t('română: titlu secțiune', (await p.textContent('#a11y-details summary')) === 'Accesibilitate');
  await p.click('[data-lang="de"]');
  t('germană: titlu secțiune', (await p.textContent('#a11y-details summary')) === 'Barrierefreiheit');
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Player: focus prins, fundal inactiv, taste');
{
  const {ctx, p, errs} = await open(1280, 800);
  await add(p, [U('t', 1), U('t', 2), U('t', 3)]);
  await p.locator('.frame__play-area').first().focus();
  await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  t('lightbox deschis', await p.locator('#lightbox').isVisible());
  t('fundalul este inactiv (inert)', await p.evaluate(() => document.querySelector('main').hasAttribute('inert') && document.querySelector('footer.foot').hasAttribute('inert')));
  let outside = 0;
  for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); if (!(await p.evaluate(() => document.getElementById('lightbox').contains(document.activeElement)))) outside++; }
  t('Tab nu iese din player (12 apăsări)', outside === 0, String(outside));
  let outside2 = 0;
  for (let i = 0; i < 6; i++) { await p.keyboard.press('Shift+Tab'); if (!(await p.evaluate(() => document.getElementById('lightbox').contains(document.activeElement)))) outside2++; }
  t('Shift+Tab nu iese din player', outside2 === 0);
  const meta = () => p.textContent('#lightbox-meta span');
  t('începe la cadrul 1/3 (numerotare ca în aplicație)', /01\/03/.test(await meta()), await meta());
  await p.keyboard.press('End'); t('End → ultimul cadru', /03\/03/.test(await meta()), await meta());
  await p.keyboard.press('Home'); t('Home → primul cadru', /01\/03/.test(await meta()));
  await p.keyboard.press('ArrowRight'); t('→ merge la următorul', /02\/03/.test(await meta()));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  t('Esc închide, fundalul redevine activ', !(await p.locator('#lightbox').isVisible()) && !(await p.evaluate(() => document.querySelector('main').hasAttribute('inert'))));
  t('focusul revine pe cadrul de unde s-a deschis', await p.evaluate(() => document.activeElement.classList.contains('frame__play-area')));
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Kit: copie de siguranță');
{
  const {ctx, p, errs} = await open(1280, 800);
  await add(p, [U('kit', 1)]);
  const bundle = await p.evaluate(() => FFF.bundle.build());
  t('bundle include colecțiile', bundle.app === 'cadraj' && /kit/.test(bundle.data['cadraj.collection'] || ''));
  await p.click('#app-version'); await p.waitForTimeout(300);
  t('dialog „Transparență”', (await p.locator('dialog[open]').count()) === 1);
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Accesibilitate (axe) și dimensiuni');
for (const [w, h] of [[1280, 800], [360, 740]]) {
  const seed = async (p) => { await add(p, [U('ax', 1), U('ax', 2)]); };
  await axe(w, h, seed, 'pagină cu colecție');
  await axe(w, h, async (p) => { await seed(p); await p.click('#a11y-details summary'); await p.check('#a11y-large'); await p.check('#a11y-contrast'); }, 'mod accesibilitate');
  await axe(w, h, async (p) => { await seed(p); await p.locator('button', {hasText: 'QR'}).first().click(); await p.waitForTimeout(600); }, 'dialog QR');
  await axe(w, h, async (p) => { await seed(p); await p.locator('.frame__play-area').first().click(); await p.waitForTimeout(500); }, 'player deschis');
  await axe(w, h, async (p) => { await p.click('[data-lang="de"]'); await seed(p); await p.click('#a11y-details summary'); }, 'germană');
  await axe(w, h, async (p) => { await p.click('#app-version'); await p.waitForTimeout(300); }, 'dialog Transparență');
  const {ctx, p} = await open(w, h); await add(p, [U('ov', 1)]); await p.click('#a11y-details summary'); await p.check('#a11y-large');
  t('fără depășire orizontală ' + w + ' (text mărit)', await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} reușite, ${bad} eșuate`); process.exit(bad ? 1 : 0);
