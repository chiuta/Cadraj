# Cadraj

Cadraj — pentru TikTok, fără cont: o „coală de contact" personală pentru clipuri TikTok adăugate manual.

**Live:** https://chiuta.github.io/Cadraj/

![Captura de ecran](screenshot.png)

**Versiune:** 1.0.0 · **Ultima actualizare:** 12 octombrie 2026

## Ce este

Cadraj este o aplicație dintr-un singur fișier HTML în care adaugi manual linkuri către clipuri TikTok ale unui autor, iar aplicația le grupează pe colecții (câte una pe autor) și le afișează prin playerul oficial de embed TikTok, fără cont și fără feed algoritmic. Aplicația spune explicit ce nu face: nu enumeră automat clipurile unui profil, nu ocolește protecțiile TikTok și nu descarcă fișiere video.

## Funcții

- Adăugare clip după link (`https://www.tiktok.com/@autor/video/...`), cu mesaj de stare; poți lipi mai multe linkuri deodată (separate prin spațiu, virgulă sau rând nou) — rezumatul spune câte au fost adăugate, câte erau deja în colecție și câte au fost ignorate.
- „Copiază linkurile”: toate linkurile din colecție, câte unul pe rând, în clipboard.
- Stil de tipărire: se tipărește doar lista de colecții.
- Colecții pe autor, cu notiță text pentru fiecare clip.
- Deschiderea unui profil TikTok într-un tab nou (câmpul „@autor", butonul „Deschide profilul ↗"); offline apare un mesaj explicativ în loc de pagina de eroare a browserului.
- Căutare în colecții (după autor sau cuvinte din notițe) și filtrul „Doar cadrele nevăzute”.
- Marcaj „văzut” pe fiecare cadru (buton ○/✓; se bifează automat când deschizi cadrul în player), cu numărătoare „N văzute” pe coală; se păstrează în colecție și în exportul JSON.
- Vizualizare mărită (lightbox) cu navigare ‹ / ›, tastele Săgeată stânga / Săgeată dreapta și Escape pentru închidere.
- Export și import al colecției ca fișier JSON; „Șterge tot".
- Interfață în 7 limbi: RO, EN, FR, IT, ES, PT, DE.

## Manual de utilizare

1. Alege limba din butoanele RO / EN / FR / IT / ES / PT / DE.
2. Dacă vrei să găsești clipuri, scrie „@autor" în câmpul de profil și apasă „Deschide profilul ↗"; profilul se deschide pe TikTok, într-un tab separat.
3. Copiază linkul unui clip, lipește-l în câmpul „Link către un clip TikTok" și apasă „Adaugă".
4. Clipul apare în colecția autorului; poți scrie o notiță sub el (Enter confirmă).
5. Apasă pe un clip pentru a-l deschide în player; navighezi cu ‹ › sau cu săgețile de la tastatură, închizi cu ✕ sau Escape.
6. Folosește „Caută în colecții" pentru a filtra.
7. „Exportă (JSON)" salvează colecția într-un fișier; „Importă" o încarcă înapoi; „Șterge tot" golește colecția.

## Confidențialitate și rețea

- Local: colecția (linkurile și notițele) se păstrează în `localStorage` al browserului, sub cheia `tiktok-fara-cont:v1`. Nu există cont și nici server propriu al aplicației; în codul verificat nu există apeluri `fetch`.
- Rețea: aplicația nu este complet offline (fără rețea, vizualizarea afișează un mesaj explicativ). La vizualizarea unui clip se încarcă, într-un iframe cu `sandbox`, playerul oficial `https://www.tiktok.com/player/v1/<id>`, deci TikTok primește cererea (și poate aplica propriile cookie-uri/politici). Butonul de profil și linkurile către clipuri deschid `www.tiktok.com`. Nu sunt alte gazde terțe în cod.
- Subsolul aplicației spune acum explicit: „fără cont · fără telemetrie · fără server propriu · redarea unui clip încarcă playerul TikTok” (afirmația „fără telemetrie” privește aplicația în sine, nu playerul TikTok din iframe).
- Mărci: TikTok este marcă a deținătorului ei, folosită descriptiv (aplicația nu este afiliată TikTok).

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser. Colecția și interfața funcționează local; redarea clipurilor și deschiderea profilurilor necesită internet.

## Licență

Licența nu este încă declarată explicit în acest repository; vezi nota din aplicație.

## Istoric / Changelog

### 1.0.0 — 2026-10-12
- Versiunea și data ultimei actualizări sunt afișate în aplicație (subsol, în 7 limbi).

### 11 octombrie 2026 (runda 7)
- Reparat: deschiderea unui profil offline afișează acum un mesaj în aplicație (7 limbi), nu pagina de eroare a browserului.
- Nou: marcaj „văzut” per cadru, numărătoare pe coală și filtrul „Doar cadrele nevăzute” (cheie nouă `seen` în colecția salvată/exportată).

### 11 octombrie 2026 (runda 6)
- Adăugat: adăugare în masă de linkuri, butonul „Copiază linkurile”, stil de tipărire, mesaje noi în 7 limbi.
- Securitate: CSP cu `script-src` pe hash (fără `'unsafe-inline'` pentru script).

### 11 octombrie 2026
- Adăugat: atribut `sandbox` pe iframe-ul playerului TikTok și politică CSP (frame-src doar `www.tiktok.com`, fără connect-src).
- Adăugat: mesaj clar în vizualizare când browserul e offline (în loc de un cadru gol), în toate cele 7 limbi.
- Reparat: conținutul paginii este acum încadrat în `<main>` (0 violări axe-core la 1280 și 360 px).

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

Cadraj is a single-file HTML tool for building a personal contact sheet of TikTok clips you add manually by link, grouped per author, played through TikTok's official embed player, with notes, search, lightbox, bulk link paste, copy-all-links, and JSON export/import. Data stays in localStorage; playback loads tiktok.com in an iframe, so it needs internet. 7 UI languages. It does not scrape profiles or download videos.

## Audit

Audit: 2026-10-10 — verificat: 0 erori JS, 0 probleme axe serious/critical; singurul trafic extern este iframe-ul playerului oficial `tiktok.com/player/v1/<id>` (ID-ul trece prin validare `\d{5,25}`, importul JSON este sanitizat, textele sunt inserate cu `textContent`). Subsolul „fără cont · fără telemetrie · fără server” se referă la aplicație; la redarea unui clip TikTok primește adresa IP și ID-ul clipului (aplicația spune asta în panoul „Info”). Aplicația nu este afiliată TikTok; respectarea termenilor TikTok pentru embed-uri rămâne în sarcina utilizatorului.
