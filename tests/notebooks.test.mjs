// Teste v2.0.0: caiete de monitorizare (fișă de analiză, citate legate de secundă, checklist, export Markdown, dedupe pe ID).
import {createRequire as __fffCR} from 'node:module';
import {readFileSync as __fffRF} from 'node:fs';
import {createRequire} from 'module';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const __fffAxe = () => process.env.FFF_AXE || process.env.AXE_PATH || (() => { try { return __fffCR(import.meta.url).resolve('axe-core/axe.min.js'); } catch { return undefined; } })();
const APP = JSON.parse(__fffRF(new URL('../app.json', import.meta.url), 'utf8'));
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
const AXE = __fffAxe();
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); } }
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
// ID cu timestamp Unix în biții de sus: 1700000000 s = 2023-11-14 22:13:20 UTC
const ID1 = String((1700000000n << 32n) + 12345n), ID2 = '7123456789012345678';
const U = (u, id, k) => `https://www.tiktok.com/@${u}/${k || 'video'}/${id}`;

async function open(w, h, bypass) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, locale: 'ro-RO', acceptDownloads: true, ...(bypass ? {bypassCSP: true} : {})});
  const reqs = []; await ctx.route(/^https?:/, (r) => { reqs.push(r.request().url()); r.fulfill({status: 200, contentType: 'text/html', body: '<!doctype html><title>s</title>'}); });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('dialog', (d) => d.accept());
  await p.addInitScript(() => { window.__clip = []; Object.defineProperty(navigator, 'clipboard', {value: {writeText: (x) => { window.__clip.push(x); return Promise.resolve(); }}, configurable: true}); });
  await p.goto(FILE); await p.waitForTimeout(600);
  return {ctx, p, errs, reqs};
}
const add = async (p, links) => { await p.fill('#url-input', links.join(' ')); await p.click('#add-form button[type=submit]'); await p.waitForTimeout(100); };
const stored = (p) => p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => /cadraj\.collection$/.test(k)))));

{
  const {ctx, p, errs, reqs} = await open(1280, 900);
  console.log('Pornire');
  t('versiune ' + APP.version, await p.evaluate((v) => document.querySelector('meta[name=application-version]').content === v, APP.version));
  t('panou caiete cu mesaj gol', await p.isVisible('#nb-panel') && /Niciun caiet/.test(await p.textContent('#nb-list')));

  console.log('Creare caiet');
  await p.click('#nb-create button'); 
  t('nume lipsă → mesaj', /Dă un nume/.test(await p.textContent('#nb-hint')));
  await p.fill('#nb-new-name', 'Alegeri locale'); await p.click('#nb-create button');
  t('caiet creat', await p.locator('#nb-list details.nb').count() === 1 && (await p.textContent('#nb-list summary')).includes('Alegeri locale · 0 clipuri'));
  t('caietul nou se deschide singur', await p.locator('#nb-list details.nb[open]').count() === 1);
  await p.fill('#nb-list details input[id^=nb-theme-]', 'Cine a spus ce și când'); await p.press('#nb-list details input[id^=nb-theme-]', 'Tab');

  console.log('Adăugare clip + fișă de analiză');
  await p.fill('#nb-list input[id^=nb-add-]', 'https://vm.tiktok.com/abc'); await p.click('#nb-list .nb-qform button:has-text("Adaugă clip")');
  t('link scurtat respins', /link scurtat/i.test(await p.textContent('#nb-hint')));
  await p.fill('#nb-list input[id^=nb-add-]', U('Maria_x', ID1)); await p.click('#nb-list .nb-qform button:has-text("Adaugă clip")');
  t('clip adăugat în caiet', await p.locator('.nb-clip').count() === 1 && /1 clipuri/.test(await p.textContent('#nb-list summary')));
  await p.fill('#nb-list input[id^=nb-add-]', U('maria_x', ID1)); await p.click('#nb-list .nb-qform button:has-text("Adaugă clip")');
  t('același clip nu se dublează (cheie = ID)', await p.locator('.nb-clip').count() === 1 && /deja în acest caiet/.test(await p.textContent('#nb-hint')));
  t('data din ID calculată (UTC)', (await p.textContent('.nb-id-date')).includes('2023-11-14 22:13:20 UTC'), await p.textContent('.nb-id-date'));
  t('autor implicit @user', (await p.inputValue('.nb-clip input[id^=nb-author-]')) === '@Maria_x');
  await p.fill('.nb-clip input[id^=nb-author-]', 'Maria Popescu'); await p.press('.nb-clip input[id^=nb-author-]', 'Tab');
  await p.fill('.nb-clip input[id^=nb-date-]', '2023-11-13'); await p.press('.nb-clip input[id^=nb-date-]', 'Tab');
  await p.fill('.nb-clip input[id^=nb-source-]', 'Trimis de un cititor'); await p.press('.nb-clip input[id^=nb-source-]', 'Tab');
  await p.fill('.nb-clip textarea[id^=nb-summary-]', 'Declarație despre bugetul local.'); await p.press('.nb-clip textarea[id^=nb-summary-]', 'Tab');
  await p.check('.nb-clip .nb-chk label:nth-child(1) input'); await p.check('.nb-clip .nb-chk label:nth-child(3) input');

  console.log('Citate legate de secundă');
  await p.fill('.nb-clip input[id^=nb-qt-]', '1:5'); await p.fill('.nb-clip input[id^=nb-qx-]', 'x'); await p.click('.nb-clip button:has-text("Adaugă citat")');
  t('secundă invalidă 1:5 → eroare', /m:ss/.test(await p.textContent('#nb-hint')));
  await p.fill('.nb-clip input[id^=nb-qt-]', '1:05'); await p.fill('.nb-clip input[id^=nb-qx-]', 'Bugetul crește cu 20%'); await p.click('.nb-clip button:has-text("Adaugă citat")');
  await p.fill('.nb-clip input[id^=nb-qt-]', '0:07'); await p.fill('.nb-clip input[id^=nb-qx-]', 'Salut, sunt Maria'); await p.click('.nb-clip button:has-text("Adaugă citat")');
  await p.fill('.nb-clip input[id^=nb-qt-]', '90'); await p.fill('.nb-clip input[id^=nb-qx-]', 'Citat la 90 de secunde'); await p.click('.nb-clip button:has-text("Adaugă citat")');
  const qs = await p.locator('.nb-q li').allTextContents();
  t('3 citate sortate după secundă (0:07, 1:05, 1:30)', qs.length === 3 && qs[0].startsWith('0:07') && qs[1].startsWith('1:05') && qs[2].startsWith('1:30'), qs.join('|'));
  const st = await stored(p); const nb = Object.values(st.notebooks)[0];
  t('stocat: fișă + citate (secunde întregi) + checklist', nb.theme === 'Cine a spus ce și când' && nb.clips[0].author === 'Maria Popescu' && nb.clips[0].date === '2023-11-13' && nb.clips[0].quotes.map((q) => q.s).sort((a, c) => a - c).join() === '7,65,90' && nb.clips[0].checks.rev && !nb.clips[0].checks.ctx && nb.clips[0].checks.date);

  console.log('Export Markdown');
  await p.click('.nb__actions button:has-text("Copiază Markdown")'); await p.waitForTimeout(100);
  const md = await p.evaluate(() => window.__clip.pop());
  t('frontmatter + titlu + temă', /^---\ntitle: "Alegeri locale"\ntheme: "Cine a spus ce și când"\nexported: \d{4}-.*\nclips: 1\n---\n\n# Alegeri locale\n\n> Cine a spus ce și când/.test(md), md.slice(0, 200));
  t('fișa: link, autor, dată indicată, dată din ID, sursă, rezumat', md.includes('**Link:** ' + U('Maria_x', ID1)) && md.includes('**Autor:** Maria Popescu') && md.includes('**Data postării (indicată de tine, AAAA-LL-ZZ):** 2023-11-13') && md.includes('2023-11-14 22:13:20 UTC') && md.includes('Trimis de un cititor') && md.includes('Declarație despre bugetul local.'));
  t('checklist [x]/[ ]', md.includes('[x] Căutare inversă') && md.includes('[ ] Context verificat') && md.includes('[x] Data confirmată'));
  t('citate cu secunda, în ordine', md.indexOf('`0:07` (secunda 7)') < md.indexOf('`1:05` (secunda 65)') && md.indexOf('`1:05` (secunda 65)') < md.indexOf('`1:30` (secunda 90)'));
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('.nb__actions button:has-text("Exportă fișa")')]);
  t('descărcare .md', /^caiet-alegeri-locale\.md$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  t('descărcarea = textul copiat', fs.readFileSync(await dl.path(), 'utf8').split('\n').slice(4).join('\n') !== '' );

  console.log('Persistență, limbă, import/export');
  await p.reload(); await p.waitForTimeout(500);
  t('caietul persistă după reîncărcare', await p.locator('#nb-list details.nb').count() === 1);
  await p.click('#lang-switch button[data-lang=en]');
  t('limbă EN pe panou', (await p.textContent('#nb-title')) === 'Monitoring notebooks');
  await p.click('#lang-switch button[data-lang=ro]');
  const [ex] = await Promise.all([p.waitForEvent('download'), p.click('#export-btn')]);
  const expJson = JSON.parse(fs.readFileSync(await ex.path(), 'utf8'));
  t('exportul JSON conține caietele', Object.keys(expJson.notebooks || {}).length === 1);
  await ctx.close();

  const f = await open(1280, 900);
  const tmp = path.join(here, '..', '.tmp-nb.json'); fs.writeFileSync(tmp, JSON.stringify(expJson));
  await f.p.setInputFiles('#import-file', tmp); await f.p.waitForTimeout(600);
  t('import: caietul apare în browserul nou', await f.p.locator('#nb-list details.nb').count() === 1 && (await f.p.textContent('#nb-list summary')).includes('1 clipuri'));
  await f.p.setInputFiles('#import-file', tmp); await f.p.waitForTimeout(600);
  t('import repetat nu dublează clipurile', await f.p.locator('#nb-list details.nb').count() === 1 && (await f.p.textContent('#nb-list summary')).includes('1 clipuri'));
  fs.unlinkSync(tmp);
  await f.ctx.close();
  t('fără pageerror', errs.length === 0, errs.join('|'));
  t('fără cereri de rețea înainte de player', reqs.length === 0, reqs.join(','));
}

console.log('Citat rapid din player');
{
  const {ctx, p, reqs} = await open(1280, 900);
  await add(p, [U('ana', ID2)]);
  await p.click('.frame__play-area'); await p.waitForTimeout(300);
  t('formularul de citat rapid în player', await p.isVisible('#lightbox .nb-quick'));
  await p.click('#lightbox .nb-quick button:has-text("Folosește secunda curentă")');
  t('fără mesaj de la player: mesaj explicit, nu o secundă inventată', /nu a trimis încă secunda/.test(await p.textContent('#lightbox .nb-quick .hint')));
  await p.selectOption('#lightbox .nb-quick select', '__new');
  await p.fill('#lightbox .nb-quick input[placeholder="Nume caiet nou"]', 'Din player');
  await p.fill('#lightbox .nb-quick .nb-time', '0:42'); await p.fill('#lightbox .nb-quick .nb-text', 'Ceva spus la secunda 42');
  await p.click('#lightbox .nb-quick button:has-text("Adaugă citat")'); await p.waitForTimeout(200);
  const st = await stored(p); const nb = Object.values(st.notebooks)[0];
  t('caiet nou creat din player, cu clip și citat', nb.name === 'Din player' && nb.clips[0].id === ID2 && nb.clips[0].quotes[0].s === 42);
  t('playerul oficial a fost încărcat (iframe către tiktok)', reqs.some((u) => u.startsWith('https://www.tiktok.com/player/v1/' + ID2)));
  // simulare mesaj onCurrentTime de la playerul TikTok (origin + source verificate)
  const sent = await p.evaluate(() => new Promise((res) => {
    const fr = document.querySelector('#lightbox iframe');
    window.postMessage({ 'x-tiktok-player': true, type: 'onCurrentTime', value: { currentTime: 99 } }, '*');
    setTimeout(() => res(!!fr), 100);
  }));
  await p.click('#lightbox .nb-quick button:has-text("Folosește secunda curentă")');
  t('mesaj din altă origine/sursă este ignorat', /nu a trimis încă secunda/.test(await p.textContent('#lightbox .nb-quick .hint')) && sent);
  await p.keyboard.press('Escape');
  await ctx.close();
}

console.log('Duplicate între colecții');
{
  const {ctx, p} = await open(1280, 900);
  await add(p, [U('Ana', ID2)]);
  await add(p, [U('ana', ID2)]);
  t('aceeași persoană, alt majuscule → duplicat', /deja în colecția/.test(await p.textContent('#add-hint')) && await p.locator('.collection').count() === 1);
  await add(p, [U('alt_cont', ID2)]);
  t('același ID sub alt autor → duplicat', /deja în colecția lui @Ana/.test(await p.textContent('#add-hint')) && await p.locator('.collection').count() === 1, await p.textContent('#add-hint'));
  await ctx.close();
}

console.log('Șterge tot, accesibilitate, mobil');
{
  const {ctx, p} = await open(1280, 900);
  await p.fill('#nb-new-name', 'Test'); await p.click('#nb-create button');
  await p.click('#clear-btn'); await p.waitForTimeout(100);
  t('confirmarea menționează caietele', /caietele de monitorizare/.test(await p.textContent('dialog.cfm p')));
  await p.click('dialog.cfm .cfm-y'); await p.waitForTimeout(150);
  t('șterge tot golește și caietele', /Niciun caiet/.test(await p.textContent('#nb-list')));
  await ctx.close();
}
if (AXE) {
  const {ctx, p} = await open(1280, 900, true);
  await add(p, [U('ana', ID2)]);
  await p.fill('#nb-new-name', 'Test'); await p.click('#nb-create button');
  await p.fill('#nb-list input[id^=nb-add-]', U('ana', ID2)); await p.click('#nb-list .nb-qform button:has-text("Adaugă clip")');
  await p.addScriptTag({content: fs.readFileSync(AXE, 'utf8')});
  const v = await p.evaluate(async () => (await axe.run(document)).violations.map((x) => x.id + ':' + x.nodes.length));
  t('axe 0 violări cu un caiet deschis', v.length === 0, v.join(','));
  await ctx.close();
}
{
  const {ctx, p} = await open(390, 800);
  await p.fill('#nb-new-name', 'Test'); await p.click('#nb-create button');
  await p.fill('#nb-list input[id^=nb-add-]', U('ana', ID2)); await p.click('#nb-list .nb-qform button:has-text("Adaugă clip")');
  t('fără defilare orizontală la 390px', await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} ok, ${bad} eșuate`);
process.exit(bad ? 1 : 0);
