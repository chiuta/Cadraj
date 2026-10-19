# Cadraj

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

**Verzió:** 1.2.0 · **Utolsó frissítés:** 2026-10-19

A felület nyelvei: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Cadraj — TikTokhoz, fiók nélkül: személyes „kontaktlap” kézzel hozzáadott TikTok-klipekhez.

**Online alkalmazás:** https://chiuta.github.io/Cadraj/

![Képernyőkép](screenshot.png)

## Mi ez

A Cadraj egyetlen HTML-fájlból álló alkalmazás, amelyben kézzel adod hozzá egy szerző TikTok-klipjeinek hivatkozásait; az alkalmazás gyűjteményekbe csoportosítja őket (szerzőnként egybe), és a TikTok hivatalos beágyazott lejátszóján keresztül jeleníti meg, fiók és algoritmikus hírfolyam nélkül. Az alkalmazás kifejezetten kimondja, mit nem csinál: nem listázza automatikusan egy profil klipjeit, nem kerüli meg a TikTok védelmeit, és nem tölt le videófájlokat.

## Funkciók

- Klip hozzáadása hivatkozással (`https://www.tiktok.com/@szerzo/video/...`), állapotüzenettel; egyszerre több hivatkozást is beilleszthetsz (szóközzel, vesszővel vagy új sorral elválasztva) — az összegzés megmondja, hányat adott hozzá, hány volt már a gyűjteményben, és hányat hagyott figyelmen kívül.
- „Hivatkozások másolása”: a gyűjtemény összes hivatkozása soronként egy, a vágólapra.
- Nyomtatási stílus: csak a gyűjtemények listája nyomtatódik.
- Gyűjtemények szerzőnként, minden klipnél szöveges jegyzettel.
- TikTok-profil megnyitása új lapon („@szerző” mező, „Profil megnyitása ↗” gomb); offline állapotban a böngésző hibaoldala helyett magyarázó üzenet jelenik meg.
- Keresés a gyűjteményekben (szerző vagy a jegyzetek szavai szerint) és a „Csak a nem látott képkockák” szűrő.
- „Látott” jelölés minden képkockán (○/✓ gomb; automatikusan bejelölődik, amikor megnyitod a képkockát a lejátszóban), a lapon „N látott” számlálóval; megmarad a gyűjteményben és a JSON-exportban.
- Nagyított nézet (lightbox) ‹ / › navigációval, Balra nyíl / Jobbra nyíl billentyűkkel és Escape-pel a bezáráshoz.
- A gyűjtemény exportálása és importálása JSON-fájlként; „Összes törlése”.
- Felület 8 nyelven: RO, EN, FR, IT, ES, PT, DE, HU.

## Új funkciók (v1.1.0)

- **QR-kód egy gyűjteményhez**: csak a felhasználónevet és a képkockák azonosítóit tartalmazza (a `p` jellel jelölt fényképeket), a jegyzeteket és más gyűjteményeket nem. Egy kódban legfeljebb 40 klip, „40 / N” üzenettel. A QR-képből való beolvasás újra létrehozza a gyűjteményt; a második beolvasás nem duplikál, az idegen QR-t és az érvénytelen felhasználóneveket (pl. `__proto__`) elutasítja, az érvénytelen azonosítókat figyelmen kívül hagyja.
- **Akadálymentességi mód**: nagyobb szöveg (+25%), nagy kontraszt, animációk nélkül; a beállítások megmaradnak, és bekerülnek a `.fff.json` másolatba.
- **Lejátszó csapdába ejtett fókusszal**: megnyitáskor a háttér inaktívvá válik (`inert`), a Tab/Shift+Tab nem lép ki a lejátszóból, a Home/End/nyilak navigálnak, az Esc bezár, és a fókusz visszatér arra a képkockára, ahonnan megnyitották.
- **Készlet**: Átláthatóság és `.fff.json` másolat (a gyűjtemények), `core, label, bundle, qr`.
- **Nyelvek és fordítások**: Az új szövegek az alkalmazás 8 nyelvén vannak (RO, EN, FR, IT, ES, PT, DE, HU). Az FR/IT/ES/PT/DE/HU fordítások automatikusak, és **anyanyelvi beszélők nem ellenőrizték őket**; a készlet párbeszédablaka 8 nyelvű.

## Használati útmutató

1. Válaszd ki a nyelvet az RO / EN / FR / IT / ES / PT / DE / HU gombokkal.
2. Ha klipeket szeretnél találni, írd be a „@szerző” nevet a profilmezőbe, és nyomd meg a „Profil megnyitása ↗” gombot; a profil a TikTokon nyílik meg, külön lapon.
3. Másold ki egy klip hivatkozását, illeszd be a „Hivatkozás egy TikTok-klipre” mezőbe, és nyomd meg a „Hozzáadás” gombot.
4. A klip megjelenik a szerző gyűjteményében; alá jegyzetet írhatsz (az Enter jóváhagyja).
5. Kattints egy klipre, hogy megnyisd a lejátszóban; a ‹ › gombokkal vagy a billentyűzet nyilaival navigálsz, a ✕ gombbal vagy Escape-pel zársz be.
6. A szűréshez használd a „Keresés a gyűjteményekben” mezőt.
7. Az „Exportálás (JSON)” fájlba menti a gyűjteményt; az „Importálás” visszatölti; az „Összes törlése” kiüríti a gyűjteményt.

## Adatvédelem és hálózat

- A „határok nélküli” készlet (`fff-kit`, `core, label, bundle, qr` modulok) be van illesztve az `index.html`-be: nem küld hálózati kéréseket. Az „Átláthatóság” párbeszédablak (kattintás a verzióra) megmutatja a deklarált hálózatot (0 külső kérés), a `localStorage` kulcsait, a fájl SHA-256 ujjlenyomatát, és `.fff.json` biztonsági másolatot kínál (opcionálisan jelszóval titkosítva, AES-GCM). A QR-kódokat helyben állítja elő és olvassa be; a beolvasás csak a felhasználó által kiválasztott képből történik, kamera nélkül.

- Helyi: a gyűjtemény (hivatkozások és jegyzetek) a böngésző `localStorage`-ában tárolódik, a `tiktok-fara-cont:v1` kulcs alatt. Nincs fiók és nincs az alkalmazásnak saját szervere; az ellenőrzött kódban nincsenek `fetch` hívások.
- Hálózat: az alkalmazás nem teljesen offline (hálózat nélkül a nézet magyarázó üzenetet mutat). Egy klip megtekintésekor egy `sandbox` attribútumú iframe-ben betöltődik a hivatalos `https://www.tiktok.com/player/v1/<id>` lejátszó, így a TikTok megkapja a kérést (és saját sütiket/szabályzatokat alkalmazhat). A profilgomb és a klipekre mutató hivatkozások a `www.tiktok.com` oldalt nyitják meg. A kódban nincsenek más külső gazdák.
- Az alkalmazás lábléce mostantól kifejezetten kimondja: „fiók nélkül · telemetria nélkül · saját szerver nélkül · egy klip lejátszása betölti a TikTok lejátszóját” (a „telemetria nélkül” állítás magára az alkalmazásra vonatkozik, nem az iframe-ben lévő TikTok-lejátszóra).
- Védjegyek: a TikTok tulajdonosának védjegye, leíró jelleggel használva (az alkalmazás nem áll kapcsolatban a TikTokkal).

## Helyi / offline futtatás

Töltsd le az `index.html` fájlt, és nyisd meg egy böngészőben. A gyűjtemény és a felület helyben működik; a klipek lejátszásához és a profilok megnyitásához internet szükséges.

## Licenc

MIT az alkalmazás kódjára és szerkezetére — lásd a `LICENSE` fájlt. A fájlba esetlegesen beépített külső könyvtárak megtartják saját licencüket.

## Előzmények / Changelog

- 1.1.0 — 2026-10-14: QR-kód gyűjteményekhez, akadálymentességi mód, lejátszó csapdába ejtett fókusszal, „határok nélküli” készlet. Tesztek: `tests/fff-r8.test.mjs`.

### 1.0.0 — 2026-10-12
- A verzió és az utolsó frissítés dátuma megjelenik az alkalmazásban (lábléc, 7 nyelven).

### 2026. október 11. (7. kör)
- Javítva: egy profil offline megnyitása mostantól az alkalmazásban jelenít meg üzenetet (7 nyelven), nem a böngésző hibaoldalát.
- Új: „látott” jelölés képkockánként, számláló a lapon és a „Csak a nem látott képkockák” szűrő (új `seen` kulcs a mentett/exportált gyűjteményben).

### 2026. október 11. (6. kör)
- Hozzáadva: hivatkozások tömeges hozzáadása, a „Hivatkozások másolása” gomb, nyomtatási stílus, új üzenetek 7 nyelven.
- Biztonság: CSP hash alapú `script-src`-vel (szkripthez `'unsafe-inline'` nélkül).

### 2026. október 11.
- Hozzáadva: `sandbox` attribútum a TikTok-lejátszó iframe-jén és CSP-szabályzat (frame-src csak `www.tiktok.com`, connect-src nélkül).
- Hozzáadva: egyértelmű üzenet a nézetben, ha a böngésző offline (üres keret helyett), mind a 7 nyelven.
- Javítva: az oldal tartalma mostantól `<main>` elembe van foglalva (0 axe-core-szabálysértés 1280 és 360 px szélességen).

## Szerző

Alexio — Alexandru-Ionuț Chiuță, elérhetőség: alexio@trom.tf

## Összefoglaló

A Cadraj egyfájlos HTML-eszköz személyes kontaktlap építéséhez kézzel, hivatkozással hozzáadott TikTok-klipekből, szerzők szerint csoportosítva, a TikTok hivatalos beágyazott lejátszóján keresztül lejátszva, jegyzetekkel, kereséssel, lightboxszal, tömeges hivatkozás-beillesztéssel, az összes hivatkozás másolásával és JSON-exporttal/-importtal. Az adatok a localStorage-ban maradnak; a lejátszás a tiktok.com oldalt tölti be egy iframe-ben, ezért internet kell hozzá. 8 felületi nyelv. Nem gyűjt adatot a profilokról, és nem tölt le videókat.

## Audit

Audit: 2026-10-10 — ellenőrizve: 0 JS-hiba, 0 súlyos/kritikus axe-probléma; az egyetlen külső forgalom a hivatalos `tiktok.com/player/v1/<id>` lejátszó iframe-je (az azonosító `\d{5,25}` érvényesítésen megy át, a JSON-import megtisztított, a szövegek `textContent`-tel kerülnek beszúrásra). A „fiók nélkül · telemetria nélkül · szerver nélkül” lábléc az alkalmazásra vonatkozik; egy TikTok-klip lejátszásakor a TikTok megkapja az IP-címet és a klip azonosítóját (az alkalmazás ezt az „Info” panelben közli). Az alkalmazás nem áll kapcsolatban a TikTokkal; a TikTok beágyazásokra vonatkozó feltételeinek betartása a felhasználó feladata.
