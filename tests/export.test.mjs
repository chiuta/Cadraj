// Teste v2.1.0: export Markdown/CSV cu notițe, panoul „Ce se întâmplă cu datele”, traduceri.
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
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(FILE); await p.waitForTimeout(500);
const L = (u, id) => `https://www.tiktok.com/@${u}/video/${id}`;
await p.fill('#url-input', [L('ana', '7111111111111111111'), L('ana', '7222222222222222222'), L('ion', '7333333333333333333')].join(' '));
await p.click('#add-form button[type=submit]'); await p.waitForTimeout(150);
const notes = p.locator('.frame__note');
await notes.nth(0).fill('=1+1 formulă, cu "ghilimele", virgulă'); await notes.nth(0).dispatchEvent('change');
await notes.nth(1).fill('notă simplă'); await notes.nth(1).dispatchEvent('change');
await p.locator('.frame__seen').first().click();

console.log('Export Markdown');
let [dl] = await Promise.all([p.waitForEvent('download'), p.click('#md-btn')]);
t('nume de fișier .md', dl.suggestedFilename() === 'cadraj-colectii.md', dl.suggestedFilename());
const md = fs.readFileSync(await dl.path(), 'utf8');
t('frontmatter cu 3 cadre și 2 colecții', /collections: 2/.test(md) && /clips: 3/.test(md) && md.startsWith('---'));
t('apar linkurile cadrelor', md.includes(L('ana', '7111111111111111111')) && md.includes(L('ion', '7333333333333333333')));
t('apar notițele', md.includes('notă simplă') && md.includes('formulă, cu "ghilimele"'));
t('marcajul „văzut” se exportă', /✓ văzut/.test(md) && /○ nevăzut/.test(md));

console.log('Export CSV');
[dl] = await Promise.all([p.waitForEvent('download'), p.click('#csv-btn')]);
const csv = fs.readFileSync(await dl.path(), 'utf8');
t('antet + 3 rânduri', csv.replace(/^﻿/, '').trim().split(/\r\n/).length === 4, csv);
t('celula care începe cu = este neutralizată', csv.includes(`"'=1+1 formulă, cu ""ghilimele"", virgulă"`), csv);
t('BOM UTF-8 pentru Excel', csv.charCodeAt(0) === 0xFEFF);

console.log('Gol și limbi');
await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
await p.click('#md-btn'); t('colecție goală: mesaj, fără descărcare', /Nu există cadre/.test(await p.textContent('#add-hint')));
t('panoul „Ce se întâmplă cu datele” există', /TikTok/.test(await p.textContent('#data-details')));
for (const l of ['en', 'fr', 'it', 'es', 'pt', 'de', 'hu']) {
  await p.click(`#lang-switch button[data-lang=${l}]`);
  const s = await p.textContent('#data-details summary'), bt = await p.textContent('#md-btn');
  t(l + ': panou și buton traduse', s.length > 15 && s !== 'Ce se întâmplă cu datele tale și ce află TikTok' && bt !== 'Exportă note (Markdown)', s + ' | ' + bt);
}
t('nicio cerere de rețea făcută de aplicație', reqs.length === 0, reqs.join(','));
t('fără erori JS', errs.length === 0, errs.join('|'));
await b.close();
console.log('\n' + ok + ' ok, ' + bad + ' eșuate');
process.exit(bad ? 1 : 0);
