# Jurnal de modificări

Format SemVer (MAJOR.MINOR.PATCH).

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
