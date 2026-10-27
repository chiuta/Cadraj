# Jurnal de modificări

Format SemVer (MAJOR.MINOR.PATCH).

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
