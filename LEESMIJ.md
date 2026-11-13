# Website Reroot Health Club & Coaching: handleiding

Deze map bevat de volledige publieke website. De ledenapp zit hier niet in en wordt nergens aangepast.

Je hebt alleen **Python 3** nodig (staat standaard op je Mac) en de app **Terminal**.
Open Terminal en ga eerst naar deze map:

```bash
cd pad/naar/reroot-website
```

## Waar staat wat

| Wat | Bestand |
|---|---|
| Prijzen, openingsuren, adres, telefoon, e-mail, alle links, coaches, reviews, merch, artikels | `gegevens/site.json` |
| Tekst en opbouw per pagina | `bron/paginas/` (één bestand per pagina) |
| Menu bovenaan en voettekst (op elke pagina hetzelfde) | `bron/onderdelen/kop.html` en `bron/onderdelen/voet.html` |
| Coachkaarten, ervaringen, de drie stappen, contactformulier | `bron/onderdelen/` |
| Foto's en logo | `bron/assets/` |
| Kleuren, lettertypes, opmaak | `bron/stijl.css` |
| De gebouwde site die online komt | `publiek/` (niet met de hand aanpassen, wordt telkens opnieuw gemaakt) |
| De versie waarmee we begonnen | `origineel/` |
| Schermafbeeldingen vóór en na het herontwerp | `vergelijking/` |

## Snel opzoeken: wat pas ik waar aan?

Alles hieronder staat in `gegevens/site.json`. Bewaar het bestand en herlaad de pagina.

| Ik wil ... | Zoek in `site.json` naar |
|---|---|
| een prijs wijzigen | `"aanbod"` → het traject → `"prijs"` |
| de openingsuren wijzigen | `"openingsuren"` → `"dagen"` |
| telefoon of e-mail wijzigen | `"contact"` |
| het adres of de routelink wijzigen | `"adres"` |
| een betaallink wijzigen | `"aanbod"` → het traject → `"checkout_url"` |
| de knop naar de ledenapp tonen | `"links"` → `"ledenapp_url"` (leeg = geen knop) |
| Instagram, TikTok, Spotify, Google-links | `"links"` |
| een merchartikel aanpassen | `"merch"` → `"artikels"` |
| uitleg toevoegen bij "Je eerste keer" | `"club"` → `"eerste_keer"` (leeg = niet getoond) |
| het adres van de site zelf | `"publicatie"` → `"basis_url"` |

## De site lokaal openen

```bash
python3 bouw.py --bekijk
```

Open daarna <http://localhost:8000> in je browser. Zolang dit commando loopt, zie je elke wijziging na het herladen van de pagina. Stoppen doe je met `Ctrl + C`.

## Een prijs wijzigen

1. Open `gegevens/site.json`.
2. Zoek het aanbod, bijvoorbeeld `"open_gym"`, en pas `"prijs": "35"` aan. Alleen het getal, zonder euroteken.
3. Bewaar. De prijs verandert overal op de site tegelijk.

Hetzelfde geldt voor openingsuren (`"openingsuren"` → `"dagen"`), telefoon, e-mail, adres en alle links.
Laat `"open"` en `"sluit"` van een dag leeg om die dag als gesloten te tonen.

Let op de komma's en aanhalingstekens in dit bestand. Vergeet je er één, dan zegt het bouwscript op welke regel het misloopt en blijft de vorige versie staan.

## Een knop naar een betaalpagina wijzigen

Elk aanbod heeft een `"checkout_url"`.

- **Ingevuld**: de knop is een koopknop (tekst uit `"knoptekst_kopen"`) en gaat naar die betaalpagina.
- **Leeg** (`""`): de knop wordt automatisch "Vraag … aan" en gaat naar het contactformulier, met dat aanbod al gekozen.

`"ledenapp_url"` onder `"links"` werkt op dezelfde manier: leeg is geen knop naar de app, ingevuld verschijnt de knop "Open de app" in het menu en in de voettekst.

## Een foto wijzigen

1. Zet de nieuwe foto in `bron/assets/` (liefst `.webp` of `.jpg`, ongeveer 1400 pixels breed).
2. **Zelfde plek, nieuwe foto:** geef het bestand dezelfde naam als de oude foto en vervang die.
3. **Foto van een coach of merchartikel:** pas in `gegevens/site.json` het veld `"foto"` aan en beschrijf de foto in `"foto_alt"`.

De foto's van de homepage:

| Plek | Bestand in `bron/assets/` |
|---|---|
| Opening (het eerste scherm) | `hchero.webp` (liggend, 2000 pixels breed) |
| Clubscène: vrije gewichten | `club-gewichten.jpg` (staand, 1000 × 1250) |
| Clubscène: krachttoestellen | `legext.webp` (staand) |
| Clubscène: sprinttrack | `club-sprinttrack.jpg` (staand, 1000 × 1250) |
| Coachingvoorbeeld | `intake.webp` (staand) |
| Beeld bij het delen van een link | `deelbeeld.jpg` (1200 × 630) |

De teksten bij die beelden staan in `bron/paginas/index.html`. Foto's rechtstreeks van je telefoon zijn te zwaar en bevatten gegevens over je toestel: verklein ze eerst (bijvoorbeeld in Voorvertoning: Extra → Pas grootte aan) en exporteer ze opnieuw.

Welk artikel op de homepage en de coachingpagina uitgelicht wordt, bepaal je met de regel `uitgelicht: ja` bovenaan een artikel in `bron/artikels/`. De recentste podcastaflevering is die met het laagste getal bij `volgorde`.

## Een review, coach of merchartikel aanpassen

Alles staat in `gegevens/site.json`:

- **Reviews**: de Google-reviews komen live uit je EmbedSocial-widget (`"live_widget_embedsocial"`); daar hoef je niets voor te doen. Pas `"google_score"` en `"google_aantal"` aan als je score verandert.
- **Coaches**: naam, focus, bio, foto en sociale links.
- **Merch**: zet `"tonen": false` om het hele blok te verbergen, of pas de artikels aan.

## Een artikel of podcastaflevering toevoegen

1. Kopieer een bestaand bestand in `bron/artikels/` en geef het een nieuwe naam, zonder spaties of hoofdletters (bijvoorbeeld `slaap-en-herstel.html`).
2. Pas bovenaan tussen de `---` de titel, beschrijving, soort (`artikel` of `podcast`), categorie en volgorde aan. Het laagste volgordenummer staat eerst.
3. Zet een beeld in `bron/assets/artikels/` en verwijs ernaar bij `beeld`, of plak bij `spotify` het adres van de aflevering dat begint met `https://open.spotify.com/embed/`.
4. Schrijf daaronder de tekst met `<p>` voor een alinea, `<h2>` voor een tussenkop en `<ul><li>` voor een lijst.

Het artikel verschijnt vanzelf in de Kennisbank.

## Controleren vóór je iets online zet

```bash
python3 test_site.py
```

Dit bouwt de site en kijkt onder meer na of elke knop een bestaande bestemming heeft, of er geen interne notities zichtbaar zijn en of de routes naar Open Gym, coaching en kennismaking kloppen. Met

```bash
python3 test_site.py --online
```

wordt ook nagekeken of de externe links (betaalpagina's, artikels, sociale media) bereikbaar zijn. Er wordt nooit iets besteld.

## Een nieuwe versie bouwen

```bash
python3 bouw.py
```

De map `publiek/` bevat daarna de volledige site. Die map zet je online: upload de **inhoud** van `publiek/` naar je webhosting. De site bestaat uit gewone HTML-bestanden en werkt bij elke hostingpartij.

## Online zetten via GitHub

De site staat op GitHub in het project `reroothealthclub/reroot-website`. Alleen de tak `main` komt online: telkens die doorgestuurd wordt, test en bouwt GitHub de site en zet het ze op het testadres <https://reroothealthclub.github.io/reroot-website/>. Dat duurt een minuut of twee.

Het herontwerp van de homepage staat op een aparte tak, `herontwerp`. Die staat alleen op je Mac en is niet online. Kijken welke tak je voor je hebt:

```bash
git branch --show-current
```

Het herontwerp online zetten doe je pas na je akkoord, met deze drie commando's:

```bash
git checkout main
```

```bash
git merge herontwerp
```

```bash
git push
```

Mislukt een test, dan blijft de vorige versie online staan. De uitslag zie je op <https://github.com/reroothealthclub/reroot-website/actions>.

Zolang `"zoekmachines_toelaten"` in `gegevens/site.json` op `false` staat, neemt Google het testadres niet op. Zet dat op `true` op de dag dat de site op je echte domein komt.

## Een versie bewaren

Bewaar elke werkende versie, zodat je altijd terug kunt:

```bash
git add -A
git commit -m "Prijs Open Gym aangepast"
```

## Terugkeren naar de vorige werkende versie

Wijzigingen weggooien die je nog **niet** bewaard hebt:

```bash
git restore .
python3 bouw.py
```

De laatst bewaarde wijziging ongedaan maken:

```bash
git revert --no-edit HEAD
python3 bouw.py
```

Alle bewaarde versies bekijken:

```bash
git log --oneline
```

De allereerste versie (zoals ze in de preview stond) blijft bewaard onder de naam `origineel`, de opgeleverde versie onder `oplevering-2026-11-13` en de versie van vlak vóór het herontwerp onder `voor-herontwerp-2026-11-13`.

Staat het herontwerp online en wil je terug naar de versie van daarvoor:

```bash
git revert --no-edit -m 1 HEAD
```

```bash
git push
```

## Verhuizen naar je eigen domein

Dit doe je pas als je beslist hebt dat de nieuwe site je huidige vervangt. De site is erop voorbereid:

1. Zet in `gegevens/site.json` bij `"publicatie"` het veld `"basis_url"` op het nieuwe adres, bijvoorbeeld `https://www.rerootcoaching.com/`, en `"zoekmachines_toelaten"` op `true`. De site maakt dan vanzelf een sitemap, een `robots.txt`, een `llms.txt` en de juiste canonieke links.
2. Koppel het domein in GitHub (Settings → Pages → Custom domain) en pas de DNS aan bij de partij waar je domein geregistreerd is. **Let op:** `checkout.rerootcoaching.com` (Plug&Pay) en je e-mail op `@rerootcoaching.com` moeten blijven werken. Verander alleen de records voor `www` en het kale domein, en laat de MX-records en het record voor `checkout` staan.
3. De adressen van je vorige site (zoals `/about`, `/podcast` en `/content/...`) sturen vanzelf door naar de nieuwe pagina's. De lijst staat in `site.json` onder `"omleidingen"`. Komt er een adres bij, voeg het daar toe.
4. `reroothealthclub.com` laat je bij je domeinbeheerder doorverwijzen naar het hoofddomein.

Test na de verhuis de oude adressen, het formulier en de betaalknoppen opnieuw.

## Het contactformulier

Er is nog geen formulierdienst gekozen. Daarom zet het formulier nu een e-mail klaar in het mailprogramma van de bezoeker en zegt het er eerlijk bij dat die mail nog verstuurd moet worden. Gaat er geen mailprogramma open, dan kan de bezoeker het bericht kopiëren en zelf mailen. Telefoon en e-mailadres staan er altijd naast. De kop van het formulier past zich aan het gekozen onderwerp aan ("Vraag een kennismaking aan").

Kies je later een dienst die formulieren ontvangt, vul dan het adres in bij `"formulier"` → `"verzend_url"`. Vanaf dan verstuurt de site zelf, toont ze "Bedankt, je bericht is aangekomen" pas nadat de dienst de aanvraag heeft aanvaard, en toont ze bij een fout je telefoonnummer en e-mailadres. De site stuurt de velden voornaam, email, telefoon, onderwerp en bericht als JSON.

## Goed om te weten

- Zet nooit wachtwoorden of geheime sleutels in deze map. Alles hierin is publiek.
- Veelgestelde vragen en de langere teksten staan in de paginabestanden zelf (`bron/paginas/`). Prijzen en uren daarin komen wel uit `site.json`.
- De kop "Twee coaches, één aanpak" is gewone tekst. Komt er een coach bij, pas die dan aan in `bron/paginas/index.html` en `bron/paginas/coaching.html`.
