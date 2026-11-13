# Opleverlijst Reroot-website (bijgewerkt op 13 november 2026, na het herontwerp)

Het herontwerp staat op de tak `herontwerp`, alleen op je Mac. De gepubliceerde versie is ongewijzigd.

## Oordeel

**Klaar voor je publicatieakkoord als testversie** op het GitHub-testadres. **Nog niet klaar om je echte domein te vervangen**: daarvoor ontbreken algemene voorwaarden en een beslissing over het formulier (zie "Blokkeert").

## Blokkeert de overstap naar je eigen domein

| # | Onderwerp | Wat nodig is |
|---|---|---|
| 1 | **Algemene voorwaarden** | De pagina op je huidige site bevat opvultekst, geen voorwaarden. Je verkoopt abonnementen, dus die moeten er zijn. Zodra je ze hebt: vul het adres in bij `algemene_voorwaarden` in `site.json`; de links verschijnen dan vanzelf. Het oude adres `/algemene-voorwaarden` heeft daarom nog geen omleiding. |
| 2 | **Privacybeleid** | Vermeldt de reviewwidget (EmbedSocial), de lettertypes van Google en de Spotify-speler nog niet. Laat het nalezen en aanvullen. |
| 3 | **Domein en DNS** | Ik weet niet waar je domeinen geregistreerd zijn. `www.reroothealthclub.com` gaf bij mijn controle geen antwoord (de naam werd niet gevonden). Niets aan DNS of domeinen is aangeraakt. |
| 4 | **Plug&Pay-teksten** | Op `checkout.rerootcoaching.com/rerootcoaching` staat nog "maximum van 200 Leden" en "Reroot Online Coaching". Zelf aanpassen: 150 leden en "Reroot Monthly Online Coaching". |

## Blokkeert niets, maar vraagt je antwoord

| # | Onderwerp | Toelichting |
|---|---|---|
| 5 | **Je eerste keer bij Reroot** | Het blok op de clubpagina toont nu alleen wat bevestigd is: adres, binnenkomen met de app, kennismaking en contact. Drie velden staan leeg en verschijnen pas als je ze invult bij `club` → `eerste_keer`: waar de ingang precies is, hoe een nieuw lid toegang krijgt na inschrijving, en wat je meebrengt. |
| 6 | **Coachingvoorbeeld op de homepage** | Het voorbeeld (drie keer per week kunnen trainen, schema voor vijf dagen) is door mij geschreven en duidelijk gelabeld als "Voorbeeld ter illustratie, geen echte klant". Lees het na: klopt dit met hoe jullie zo'n situatie aanpakken? Een echt, geanonimiseerd praktijkvoorbeeld is sterker. |
| 7 | **Teksten in de clubscène** | "Een volledige rij dumbbells" en "voor sledewerk, sprints en loopoefeningen" zijn afgeleid van je eigen foto's. Laat weten als je er cijfers bij wil (zwaarste dumbbell, lengte van de track). |
| 8 | **Formulierdienst** | Niet gekozen, dus niets toegevoegd. Het formulier zet een mail klaar. Kies je een dienst, dan is het één regel in `site.json`. |
| 9 | **Knop naar de app** | Blijft onzichtbaar tot `ledenapp_url` ingevuld is. |
| 10 | **Merchfoto's** | De petfoto toont drie kleuren terwijl er één pet te koop is. Nieuwe foto's volgen van jou. Afhaling of levering staat nergens vermeld, want dat is niet bevestigd. |

## Kan later

- **Video voor de opening.** Er is geen geschikte, gemonteerde video in de projectmap, en ik kan hier geen video monteren. De opening is een afgewerkte fotohero. Shots die je kunt opnemen (liggend, vanaf statief, 5 tot 8 seconden elk, zonder geluid): breed beeld vanaf de ingang; een hand die een schijf op de stang schuift; iemand midden in een set; een kort coachmoment. Ook een staand shot vanaf de ingang richting de sprinttrack voor mobiel.
- **Scrollgestuurde video in de clubscène.** Pas zinvol met drie eigen clips. De scène werkt nu met beeldwissels.
- **Lettertypes lokaal zetten.** Ze komen nu van Google Fonts. Lokaal is sneller en vermijdt een verbinding met Google bij elk bezoek. Daarvoor moet ik de lettertypebestanden downloaden; dat doe ik op je vraag.
- **Kleinere versie van de openingsfoto voor mobiel.** De foto weegt 125 kB; een aparte mobiele uitsnede bespaart weinig, dus nog niet gedaan.
- **Professionele foto's van vrije gewichten en sprinttrack.** De twee nieuwe beelden in de clubscène komen uit je eigen telefoonfoto's (map `Gym`). Ze zijn echt en bruikbaar, maar minder verzorgd dan de foto's van de fotograaf.
- **Merknaam Marbo.** Op de site staat "Marbo Sport".

## Niet van toepassing

- **Accounts, database, sms, AI-functies:** de publieke site heeft ze niet. Niets gebouwd.
- **Source maps, `.env`, bundelaar, React of Vite:** de site is gewone HTML, CSS en één klein script. Er is niets te splitsen of op te ruimen.
- **Betaalbedragen vanuit de browser:** de site rekent niets af. Elke koopknop is een gewone link naar jouw Plug&Pay-pagina, waar product en prijs vastliggen.
- **`robots.txt` op het testadres:** GitHub leest die alleen op domeinniveau, niet onder `/reroot-website/`. Het testadres blijft uit Google door `noindex` op elke pagina.
- **Reviewscore in de zoekmarkering:** niet toegevoegd. Zoekmachines aanvaarden geen zelf gepubliceerde score voor het eigen bedrijf.

## Wat veranderd is in deze ronde

- **Homepage:** nieuwe opening met een breed beeld van de eigen trainingsruimte; "De club, in drie beelden" (vrije gewichten, krachttoestellen, sprinttrack) met op desktop één vast beeldvlak dat wisselt tijdens het scrollen; een concreet coachingvoorbeeld (situatie, beslissing, waarom); "Sterker worden begint met begrijpen" linkt nu naar een echt artikel en de recentste aflevering.
- **Kennismaking:** de kop van het formulier volgt het onderwerp; uitleg dat de knop je mailprogramma opent; kopieerbaar bericht voor wie geen mailprogramma heeft.
- **Clubpagina:** blok "Je eerste keer bij Reroot".
- **Coachingpagina:** links naar een artikel en een aflevering.
- **Techniek:** 404-pagina, favicon, deelbeeld, og-gegevens, kruimelpad op artikels, sitemap en canonieke links (worden actief zodra zoekmachines toegelaten zijn), omleidingen voor 21 adressen van de vorige site, reviewwidget laadt pas als je in de buurt scrolt, camera-gegevens uit de foto's gehaald.

## Wat getest is

- `python3 test_site.py --online`: 3688 controles geslaagd, plus de bereikbaarheid van de externe links.
- In de browser (één Chromium-venster, nagebootste breedtes 320, 375, 768 en 1440): geen horizontale overloop op elf pagina's, na één herstelde kop.
- Clubscène op 1440: het actieve onderdeel volgt het scrollen, vooruit en terug; het beeldvlak blijft op zijn plaats. Onder 1000 pixels staan de drie beelden gewoon onder elkaar.
- Contactformulier: leeg versturen (fouten, focus op het eerste veld), mail klaarzetten (geen succesmelding, kopieerbaar bericht), dienst die weigert (foutmelding, invoer blijft staan), dienst die aanvaardt (succes). De laatste twee met een nagebootste dienst; er is niets echt verstuurd.
- 404-pagina vanaf een diep adres onder `/reroot-website/`: opmaak, logo en links werken.
- Gebouwde map: geen verborgen bestanden, geen ontwikkelbestanden, geen sleutels. Externe bronnen: Google Fonts, EmbedSocial (reviews), Spotify (afleveringen) en links naar Plug&Pay, Google, Instagram en TikTok.

## Wat niet getest is

- Een echte betaling of bestelling. Van de betaalpagina's is alleen nagekeken dat ze bestaan.
- Safari en echte telefoons. `position: sticky` en de mobiele uitsnede zijn alleen in Chromium bekeken.
- "Minder beweging" in de browser. De code zet de scrollscène dan uit; dat is nagelezen, niet in een browser bekeken.
- Laadsnelheid. LCP en INP kon ik in het testvenster niet meten. Wel gemeten (lab, lokaal): geen layoutverschuiving (CLS 0) vóór en na. Het eerste scherm laadt nu één foto van 125 kB in plaats van 95 kB; de reviewwidget van EmbedSocial wordt niet meer vanzelf na 3,5 seconden geladen.
- De omleidingen op het echte domein. Ze zijn lokaal getest onder het pad `/reroot-website/`.
- De Spotify-speler op de afleveringspagina's heb ik in het testvenster niet zien laden.
