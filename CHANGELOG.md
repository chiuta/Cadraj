# Jurnal de modificări

Format SemVer (MAJOR.MINOR.PATCH).

## 2.3.3 — 2026-11-20

- fff-kit 1.8.1: când `localStorage`/`sessionStorage` aruncă sau lipsesc (cookie-uri și date de site blocate, WebView fără stocare, `<iframe sandbox>`), kitul pune în loc o stocare în memorie, iar pagina pornește în loc să se oprească; datele nu se păstrează după închiderea paginii
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși)

## 2.3.2 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.

## 2.3.1 — 2026-11-15

- Nou: butoane de distribuire pe rețele sociale (vertical, pe marginea din stânga; fără scripturi externe, doar linkuri deschise la clic); bara de zoom cu lupă și „potrivire ecran” revine pe marginea din dreapta, centrată pe verticală; corectat afișarea suprapusă la zoom mare (panourile cu înălțimi în vh/vw nu mai ies din ecran).

## 2.3.0 — 2026-11-15

- Nou: accesibilitate pe toate ecranele — butonul „Aa” (mărimea textului, contrast ridicat, fără animații, text lizibil, linkuri subliniate, citire cu voce), săgeata „Înapoi sus” și „Sari la conținut”; fereastra se potrivește mereu ecranului; zoom-ul cu lupă și „potrivire ecran” stau acum pe marginea din stânga (fff-kit 1.6.0).

## 2.2.13 — 2026-11-15

- Nou: texturi fractale hiper-detaliate (fff-texturi 1.1.2) — fundalul și suprafețele mari (carduri, panouri, antete, butoane; filele și dialogurile ascunse la încărcare, când se deschid) primesc un material generat local (WebGL2, fără rețea și fără imagini), care se repetă fără cusătură; culorile aplicației rămân ale ei. Se oprește din dialogul „Transparență” sau cu `?notex=1`.

## 2.2.8 — 2026-11-08

- Nou: avertisment în panoul de filtrare că un clip șters de autor lasă doar linkul, autorul și notița (aplicația nu face fetch de titlu/miniatură) — descrie clipul în notiță; 8 limbi.

## 2.2.5 — 2026-11-03

Etapa 7 (audit axe): butonul A/B al motorului comun are acum numele accesibil „A/B — …”, care conține textul vizibil (regula label-content-name-mismatch).

## 2.2.4 — 2026-11-03

Etapa 4: motorul A/B comun («Ce variantă e mai bună?», clasament Elo, rezultat în plicul experiment/ab)

## 2.2.3 — 2026-11-03

Accesibilitate: meniul „Trimite către…” / „Primește…” stă într-un reper ARIA (regula axe «region»); secțiunea seifului folosește h2. Cod comun din hub.

## 2.2.2 — 2026-11-03

Plic FFF (.fff.json) v1: butonul „Trimite către…” (aplicații, fișier, clipboard, cod QR, alte file) și „Primește…”. Cod comun din hub: tools/fff-envelope.js (injectat, nu copiat de mână). Colecțiile se trimit ca table/csv; se primesc linkuri TikTok.

## 2.2.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.2.0 — 2026-10-27

Anterior: v2.1.0.

- Verificat: notițele pe clip erau deja în exporturile JSON, Markdown și CSV (v2.1.0); acum există un test explicit pentru toate trei.
- Nou: casetă opțională „cu notițe” lângă „Copiază linkurile”: liniile copiate devin `link<TAB>notiță` (notițele aplatizate pe o linie); implicit rămâne doar linkul. Etichetă în 8 limbi (fr/it/es/pt/de/hu automate, neverificate de vorbitori nativi).
- Neschimbat intenționat: codul QR nu conține notițe; limita notițelor rămâne 140 de caractere.
- Teste: `tests/copy-notes.test.mjs` (19 verificări); `export` și `notebooks` trec.
- Nu s-a făcut: notițe mai lungi (ar schimba modelul de date și importul), verificarea traficului real către TikTok.

## 2.1.0 — 2026-10-27

Anterior: v2.0.0.

- Nou: „Exportă note (Markdown)” și „Exportă (CSV)” pentru colecții, cu notițele pe clip, marcajul văzut/nevăzut și data adăugării; celulele CSV care încep cu `= + - @` sunt neutralizate.
- Nou: panoul „Ce se întâmplă cu datele tale și ce află TikTok” (8 limbi).
- Descriere extinsă (meta, `app.json`, README) cu ce rămâne local și ce primește TikTok la redare.
- Documentație: „Stare” și „Offline” în README.
- Teste: `tests/export.test.mjs`.
- Notă: traducerile noilor texte în FR/IT/ES/PT/DE/HU sunt automate, neverificate de vorbitori nativi.
