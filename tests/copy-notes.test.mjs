// Teste v2.2.0: notițele pe clip în toate exporturile de date (JSON, Markdown, CSV) și „Copiază linkurile” cu notițe (opțional).
import {createRequire} from 'module';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); } }
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
const ctx = await b.newContext({viewport: {width: 1200, height: 900}, locale: 'ro-RO', acceptDownloads: true});
const reqs = []; await ctx.route(/^https?:/, (r) => { reqs.push(r.request().url()); r.abort(); });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/Content Security|Refused to/i.test(m.text())) errs.push(m.text()); });
await p.addInitScript(() => { window.__clip = null; Object.defineProperty(navigator, 'clipboard', {value: {writeText: (x) => { window.__clip = x; return Promise.resolve(); }}, configurable: true}); });
await p.goto(FILE); await p.waitForTimeout(500);
const L = (u, id) => `https://www.tiktok.com/@${u}/video/${id}`;
await p.fill('#url-input', [L('ana', '7111111111111111111'), L('ana', '7222222222222222222'), L('ion', '7333333333333333333')].join(' '));
await p.click('#add-form button[type=submit]'); await p.waitForTimeout(150);
const notes = p.locator('.frame__note');
await notes.nth(0).fill('prima notă'); await notes.nth(0).dispatchEvent('change');
await notes.nth(2).fill('notă   cu\tspații  multiple'); await notes.nth(2).dispatchEvent('change');

console.log('Notițe în exporturi');
let [dl] = await Promise.all([p.waitForEvent('download'), p.click('#export-btn')]);
const js = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
t('JSON: notițele sunt în fișier', JSON.stringify(js).includes('prima notă') && JSON.stringify(js).includes('spații'));
[dl] = await Promise.all([p.waitForEvent('download'), p.click('#md-btn')]);
t('Markdown: notițele sunt în fișier', fs.readFileSync(await dl.path(), 'utf8').includes('prima notă'));
[dl] = await Promise.all([p.waitForEvent('download'), p.click('#csv-btn')]);
t('CSV: notițele sunt în fișier', fs.readFileSync(await dl.path(), 'utf8').includes('prima notă'));

console.log('Copiază linkurile (cu/fără notițe)');
t('caseta „cu notițe” este debifată implicit', !(await p.isChecked('#copy-notes')));
await p.click('#copy-btn'); await p.waitForTimeout(150);
let clip = await p.evaluate(() => window.__clip);
t('fără bifă: doar linkuri (3 linii, fără TAB)', clip.split('\n').length === 3 && !clip.includes('\t') && !clip.includes('notă'), clip);
await p.check('#copy-notes'); await p.click('#copy-btn'); await p.waitForTimeout(150);
clip = await p.evaluate(() => window.__clip);
const lines = clip.split('\n');
t('cu bifă: link + TAB + notiță pe liniile cu notiță', lines.length === 3 && lines.filter((x) => x.includes('\t')).length === 2, clip);
t('prima linie: link TAB notă', lines.some((x) => x === L('ana', '7111111111111111111') + '\tprima notă'), lines);
t('spațiile din notiță sunt normalizate (o linie, un singur spațiu)', lines.some((x) => x.endsWith('\tnotă cu spații multiple')), lines);
t('linia fără notiță rămâne doar link', lines.some((x) => x === L('ana', '7222222222222222222')), lines);
const exp = {en: 'with notes', fr: 'avec notes', it: 'con note', es: 'con notas', pt: 'com notas', de: 'mit Notizen', hu: 'jegyzetekkel', ro: 'cu notițe'};
for (const [l, txt] of Object.entries(exp)) {
  await p.click('.lang-switch button[data-lang="' + l + '"]'); await p.waitForTimeout(60);
  t('eticheta „cu notițe” în ' + l, (await p.textContent('label[for="copy-notes"]')).trim() === txt, await p.textContent('label[for="copy-notes"]'));
}
t('0 erori / CSP', errs.length === 0, errs);
t('0 cereri de rețea', reqs.length === 0, reqs);
await b.close();
console.log(`\n${ok} ok, ${bad} eșuate`); process.exit(bad ? 1 : 0);
