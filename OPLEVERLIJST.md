# Opleverlijst Reroot-website (bijgewerkt op 16 november 2026, na de redactieronde)

Het herontwerp staat op de tak `herontwerp`, alleen op je Mac. De gepubliceerde versie is ongewijzigd.

## Oordeel

**Klaar voor je publicatieakkoord als testversie** op het GitHub-testadres. **Nog niet klaar om je echte domein te vervangen**: daarvoor ontbreken algemene voorwaarden en een beslissing over het formulier (zie "Blokkeert").

## Redactieronde (16 november)

Alle commerciële en informatieve teksten herschreven in de bestaande pagina's. Ontwerp, kleuren, logo, foto's, animaties, routes, formulierlogica en betaallinks zijn ongewijzigd. Staat lokaal op de tak `herontwerp`, niet gepubliceerd. Herstelpunt: tag `voor-redactie-2026-11-16`.

- **Knop:** "Vraag een intake aan" (menubalk op mobiel: "Intake aanvragen"). "Vraag een intakegesprek aan" brak op telefoons over twee regels; de kortere tekst past overal op één regel. De formulierkop zegt wel voluit "Vraag een intakegesprek aan". Het formulier verstuurt een aanvraag, geen boeking. De formulierkop zegt nu letterlijk: "Dit is een aanvraag, nog geen afspraak."
- **Homepage:** kop "Train zelfstandig of met een coach"; bovenaan staat wat Reroot is en waar. De pijlers leggen uit hoe ze elkaar beïnvloeden. Het coachingvoorbeeld (ploegenwerk) heeft een scherpere beslissing en een vierde stap "Opvolging": wat er bijgehouden wordt en wanneer de coach opnieuw beslist. Geen resultaat toegevoegd.
- **Tarieven:** per formule een nieuwe rij "Niet inbegrepen", en een vraag met de totaalprijs als je coaching combineert met Open Gym (€ 134 en € 220, berekend uit de prijzen in `site.json`).
- **Health Club:** duidelijk dat Open Gym een lidmaatschap is, geen coachingtraject: geen schema, geen voedingsbegeleiding, geen opvolging.
- **Coaching:** "Wat een coach opvolgt" en de stappen tonen per formule wat je bij de start krijgt.
- **Over Reroot:** dezelfde drie pijlers als op de homepage (in plaats van vier andere), concrete waarden in plaats van labels.
- **Coachprofielen:** Simon en Kevin hebben een concreet label en een nieuwe tekst over hoe ze werken.
- **Het Freteffect:** concrete beschrijving van online coaching en technieksessies; nieuw blok "Sporters van Kevin" met de tien foto's van 16 november (zeven wedstrijdfoto's, Kevin achter de schermen, twee voor-en-nafoto's). Geen namen, wedstrijden of klasseringen, wel de zin "Resultaten verschillen per persoon". Camera- en locatiegegevens zijn uit de foto's gehaald.
- **Weggehaald:** "vrijblijvend" (niet bevestigd, zie hieronder), "fysieke transformatie", "een plan dat in je week past", "training met richting", "het maximum uit je lichaam", "stok achter de deur", "meer dan een fitnesscentrum" en losse slotzinnen zonder inhoud. De testsuite controleert nu dat ze niet terugkomen.
- **Kennisbank:** alleen de introducties; artikels en afleveringen zijn niet aangeraakt.

**Na je feedback (16 november, later):**
- De wortels onder "Train zelfstandig of met een coach" zijn weg. In de plaats komt de kop woord per woord op en schuiven de twee kaarten vanuit de zijkanten naar elkaar toe terwijl je scrolt. Bij "minder beweging" staat alles stil.
- Tarieventabel: de knoppen stonden over "Goed om te weten" omdat een oude regel de tabel op 7 rijen hield. Nu 8 rijen, alles staat weer onder elkaar.
- Geen lichtgroen meer: "Sterker worden begint met begrijpen", "Je eerste keer bij Reroot" en "Kom langs in Maaseik" zijn bosgroen met beige letters; "Maximaal 150 leden" is beige. Ook de kleine accenten (labels, hovers) zijn beige.

**Toestellencirkel op de clubpagina (16 november):** in "Wat je er vindt" draait een cirkel langs alle 46 toestellen uit je map `Gym` (bureaublad). Naast de cirkel staan de groep (Cardio, Rekken en vrije gewichten, Krachttoestellen, Functionele training), de naam en één of twee zinnen uitleg. Om de 4,5 seconden komt het volgende toestel. Een mintgroene boog rond de cirkel loopt vol tot het volgende toestel. Er zijn knoppen voor vorige, pauze en volgende; je kunt ook swipen of de pijltjestoetsen gebruiken. De cirkel pauzeert als je erop wijst en draait niet vanzelf bij "minder beweging". De foto's zijn vierkant uitgesneden en zonder camera- of locatiegegevens. Namen en volgorde pas je aan in `gegevens/site.json` → `club` → `toestellen`.

**Kenniscentrum (16 november):** de Kennisbank heet nu Kenniscentrum, in het menu, de voettekst, het kruimelpad en alle verwijzingen. De pagina heeft vier delen met knoppen bovenaan: Voeding (de vijf artikels), Beweging (afleveringen 1, 3 en 5), Levensstijl (afleveringen 2 en 4) en Recepten (nieuw). De CoachCabin Podcast blijft onderaan met de Spotify-knop. Het adres blijft `kennisbank.html`, zodat gedeelde links blijven werken.

### Te bevestigen door Simon

| # | Pagina | Vraag |
|---|---|---|
| A | ~~Alle pagina's~~ | **Bevestigd 16 november:** het intakegesprek is gratis en vrijblijvend, duurt 30 tot 60 minuten en kan online of in de studio in Maaseik. Staat nu op de site (zin in `site.json` → `intakegesprek` → `zin`). |
| B | Contact, intakeband | **Bevestigd 16 november:** het intakegesprek kan met Simon of met Kevin; dat hoeft niet op de site. Nog open: binnen welke termijn nemen jullie contact op na een aanvraag? (Staat nu nergens, dus er wordt niets beloofd.) |
| C | Tarieven, coaching | **App Coaching:** krijgt de klant bij de start een trainingsschema of voedingsplan, of alleen wekelijkse feedback op wat hij zelf doet? Nu staat alleen het laatste er. |
| D | Tarieven, coaching | **App Coaching en Monthly Online Coaching:** volgt altijd dezelfde coach op? Kan de klant kiezen tussen Simon en Kevin? |
| E | Tarieven, coaching | **Bevestigd 16 november:** dezelfde wekelijkse check-up als bij App Coaching, maar één keer per maand is die fysiek. Op de site staat nu overal "fysiek" in plaats van "live". Nog open, niet nodig voor de site: hoe lang duurt de fysieke check-up? |
| F | Tarieven | **App Coaching en Monthly Online Coaching:** opzegtermijn en eventuele minimale looptijd. Nu staat er alleen "Maandelijks abonnement". |
| G | Tarieven | **Monthly Online Coaching:** klopt "Niet inbegrepen: training met een coach in de gym"? |
| H | Tarieven, coaching | **Personal Training:** hoe lang duurt een sessie? Kost een sessie in een kleine groep ook € 64? Hoort er opvolging buiten de sessies bij? Mag je met een beurtenkaart buiten je sessies zelfstandig trainen zonder Open Gym? Daarom is de rij "Niet inbegrepen" bij Personal Training nog leeg. |
| I | Tarieven | Bestaat er een combinatiekorting voor coaching plus Open Gym? Nu staan de twee prijzen gewoon opgeteld. |
| J | Health Club, tarieven | **Open Gym:** klopt "geen schema, geen voedingsbegeleiding, geen opvolging"? Krijgt een nieuw lid bij de start uitleg of een rondleiding? Dan vermelden we dat. |
| K | Het Freteffect | **Bevestigd 16 november:** dezelfde prijzen; online coaching bij Kevin is een wekelijkse check-up via de app (staat nu op de pagina). Nog open: hoe lang duurt een technieksessie? |
| L | Het Freteffect | **Bevestigd 16 november:** de sporters gaven toestemming (de foto's staan ook op Instagram en hangen in de gym); jullie vragen het nog eens na. |
| M | Homepage, coaching, Over Reroot | Laat Simon en Kevin hun nieuwe profieltekst nalezen. Ik heb geen specialisaties toegevoegd, maar de beschrijving van hoe ze werken komt van mij. |
| N | Homepage | Coachingvoorbeeld: klopt de beslissing (tijdelijk van vier naar drie trainingen, een vaste maaltijd twee à drie uur voor de training, na een paar weken opnieuw bekijken) met hoe jullie in zo'n geval beslissen? |
| P | Health Club | **Toestellencirkel:** lees de 46 namen en uitlegzinnen na in `gegevens/site.json` → `club` → `toestellen`. Het minst zeker ben ik van: Belt squat (foto 7189), Hip thrust-toestel (7190), Lat pulldown met schijven (7186), Pullover (7208), Kuitentoestel zittend (7204), Bank voor hip thrusts (7216), Buikspierbank (7225) en Kabeltoren met bank (7220). Twee toestellen staan er nog niet in omdat ik ze niet kon benoemen: foto 7188 (zwarte ATX-bank met twee pressarmen erboven) en foto 7207 (toestel met zitje en een hendel met kussen laag achteraan). Geef hun naam door en ik voeg ze toe. Overzichtsfoto's, uitlegbordjes en dubbele foto's (meer dumbbells, schijven en de tweede curlbank) zijn weggelaten. |
| Q | Kenniscentrum | **Goedgekeurd 16 november:** de vier recepten blijven zo. |
| R | Kenniscentrum | **Indeling:** Beweging en Levensstijl bevatten nu alleen podcastafleveringen; artikels over training en levensstijl zijn er nog niet. Klopt de indeling van de afleveringen (1, 3, 5 bij Beweging; 2, 4 bij Levensstijl)? |
| O | Plug&Pay (buiten de site) | Nog altijd open: "maximum van 200 Leden" en "Reroot Online Coaching" op je verkooppagina wijken af van de site (150 leden, "Monthly Online Coaching"). |

### Wat ik gecontroleerd heb

- `python3 test_site.py`: 4478 controles geslaagd, waaronder nieuwe controles dat afgekeurde formuleringen en "vrijblijvend" niet op de pagina's staan en dat de knop niet "boeken" zegt.
- Gebouwde tarievenpagina nagelezen: per formule voor wie, wat je krijgt, opvolging, niet inbegrepen, voorwaarden, prijs en knop; combinatieprijzen € 134 en € 220.
- Formulenamen: overal Open Gym, App Coaching, Monthly Online Coaching en Personal Training; "trajecten" in knoppen en koppen is "formules" geworden.
- Op 320 en 375 pixels breed (Chromium, in een verborgen venster): geen horizontale overloop op acht pagina's; elke intakeknop op één regel, behalve "Twijfel je? Vraag een intake aan" op 320. Het nieuwe fotoblok laadt alle tien foto's, de voor-en-nafoto's staan op telefoon onder elkaar en op desktop naast elkaar.
- Niet gedaan: echte telefoons en Safari; de animaties kon ik in het verborgen venster niet zien bewegen (ze zijn niet aangeraakt).

## Blokkeert de overstap naar je eigen domein

| # | Onderwerp | Wat nodig is |
|---|---|---|
| 1 | **Algemene voorwaarden** | De pagina op je huidige site bevat opvultekst, geen voorwaarden. Je verkoopt abonnementen, dus die moeten er zijn. Zodra je ze hebt: vul het adres in bij `algemene_voorwaarden` in `site.json`; de links verschijnen dan vanzelf. Het oude adres `/algemene-voorwaarden` heeft daarom nog geen omleiding. |
| 2 | **Privacybeleid** | Vermeldt de reviewwidget (EmbedSocial), de lettertypes van Google en de Spotify-speler nog niet. Laat het nalezen en aanvullen. |
| 3 | **Domein en DNS** | Ik weet niet waar je domeinen geregistreerd zijn. `www.reroothealthclub.com` gaf bij mijn controle geen antwoord (de naam werd niet gevonden). Niets aan DNS of domeinen is aangeraakt. |
| 4 | **Plug&Pay-teksten** | Op `checkout.rerootcoaching.com/rerootcoaching` staat nog "maximum van 200 Leden" en "Reroot Online Coaching". Zelf aanpassen: 150 leden en "Reroot Monthly Online Coaching". |

## Het Freteffect (toegevoegd op 14 november)

Een eigen pagina voor Kevin, `freteffect.html`, met een aparte huisstijl: zwart en ivoor, de twee logo's van Team Freteffect, een schuin sportlettertype (Barlow Condensed, van Google Fonts) en schuin afgesneden vormen. De pagina is bereikbaar via het menu (op brede schermen en in het mobiele menu), de voettekst en de kaart van Kevin bij de coaches. Het formulier heeft een eigen onderwerp "Het Freteffect".

Wat ik niet wist en daarom niet op de pagina staat. Vul aan of laat Kevin nalezen:

| Onderwerp | Stand |
|---|---|
| **Prijzen** | Er staan geen prijzen op de pagina. Ik weet niet of Kevins online coaching en technieksessies dezelfde tarieven hebben als App Coaching (€ 99) en Personal Training (€ 64). Elke knop gaat naar het intakeformulier, niet naar een betaalpagina. |
| **Wedstrijden en titels** | De foto's tonen een podium en een medaille, maar ik noem geen wedstrijd, categorie of plaats. Geef door wat erbij mag staan. |
| **Wedstrijdvoorbereiding** | Niet vermeld. Je vorige site had een pagina "prepcoaching"; laat weten of Kevin dat aanbiedt. |
| **Teksten** | De twee beschrijvingen (online coaching, technieksessies) heb ik geschreven op basis van jouw bericht. Kevins bio is dezelfde als op de rest van de site. |
| **Rechten op de podiumfoto's** | Wedstrijdfoto's zijn meestal van een fotograaf. Controleer of jullie ze op de site mogen gebruiken. Op de achtergrond staan de logo's van de wedstrijdorganisatie. |
| **Niet gebruikte foto's** | Drie foto's zijn niet gebruikt: twee podiumfoto's die sterk op andere lijken, en één gymfoto waarop de naam van een andere gym leesbaar is. Alles staat in `aangeleverd/freteffect/` (blijft op je Mac). |
| **Logo** | Vervangen door de versie op zwart die je op 14 november stuurde. Het kleine FF-teken komt nog uit de eerste zending. |
| **Teamshirt** | Het blok "Het teamshirt" toont drie uitsneden uit het beeld dat je stuurde: de rug, het FF-logo van dichtbij en voor- en achterkant naast elkaar. Het beeld oogt als een ontwerpvoorstelling (mockup), geen foto van het echte shirt. Het deel met een gezicht heb ik weggelaten, omdat je eerder vroeg om geen gegenereerde gezichten; is het een echte foto, zeg het dan. Er staat geen prijs of bestelknop: ik weet niet wat het shirt kost en of het al te koop is. De link "Vraag naar het shirt" opent het formulier. |

## Het intakegesprek als hoofdknop

"Vraag een intake aan" is de hoofdknop van de site (sinds 16 november; daarvoor "Boek je intakegesprek nu"): in de menubalk (op mobiel als "Intake aanvragen"), in het mobiele menu, in elk slotblok en in een eigen oproepband op de homepage, de clubpagina en de tarievenpagina. "Word lid" staat er als gewone link naast. Het woord "kennismaking" is overal "intakegesprek" geworden.

Twee dingen om te weten:

- **Er is geen boekingssysteem.** Daarom zegt de knop "aanvragen" en staat op het formulier dat een aanvraag nog geen afspraak is.
- **Het formulier is de zwakke schakel van deze funnel.** Zonder formulierdienst zet het alleen een mail klaar. Wie die mail niet verstuurt, laat geen gegevens achter en jij ziet die persoon nooit. Wil je dat elke aanvraag binnenkomt, dan heb je een formulierdienst of een afsprakentool nodig. Dat is één regel in `site.json` zodra je er een kiest.

Ik heb geen kunstmatige schaarste, aftelklokken of beloofde resultaten toegevoegd.

## Laatste ronde (13 november, avond)

- Koppen "Twee manieren..." en "De drie pijlers..." lopen over de volle breedte.
- De foto's van de pijlers zijn niet meer bijgesneden; Voeding toont de foto waarop je proeft.
- De wortels groeien in drie golven mee met het scrollen en verkleuren van mintgroen naar bosgroen.
- De oproepband voor het intakegesprek is bosgroen in plaats van mintgroen, zodat de site bij het oorspronkelijke palet blijft (inktzwart, bosgroen, gebroken wit, mint alleen als accent).
- "Word lid" staat niet meer in de menubalk. De link staat nog in het mobiele menu, in de kaart "Health Club" en op de clubpagina.

## Blokkeert niets, maar vraagt je antwoord

| # | Onderwerp | Toelichting |
|---|---|---|
| 5 | **Je eerste keer bij Reroot** | Het blok op de clubpagina toont nu alleen wat bevestigd is: adres, binnenkomen met de app, kennismaking en contact. Drie velden staan leeg en verschijnen pas als je ze invult bij `club` → `eerste_keer`: waar de ingang precies is, hoe een nieuw lid toegang krijgt na inschrijving, en wat je meebrengt. |
| 6 | **Coachingvoorbeeld op de homepage** | Herschreven op je vraag: het koppelt nu slaap (ploegenwerk), voeding (eiwitverdeling, maaltijd vóór de training) en training (tijdelijk drie sessies) aan elkaar. Het blijft door mij geschreven en gelabeld als "Voorbeeld ter illustratie, geen echte klant". Lees de inhoud na: klopt dit met wat jullie in zo'n gesprek zouden beslissen? |
| 7 | **Teksten in de clubscène** | "Een volledige rij dumbbells" en "voor sledewerk, sprints en loopoefeningen" zijn afgeleid van je eigen foto's. Laat weten als je er cijfers bij wil (zwaarste dumbbell, lengte van de track). |
| 8 | **Formulierdienst** | Niet gekozen, dus niets toegevoegd. Het formulier zet een mail klaar. Kies je een dienst, dan is het één regel in `site.json`. |
| 9 | **Knop naar de app** | Blijft onzichtbaar tot `ledenapp_url` ingevuld is. |
| 10 | **Merchfoto's** | De petfoto toont drie kleuren terwijl er één pet te koop is. Nieuwe foto's volgen van jou. Afhaling of levering staat nergens vermeld, want dat is niet bevestigd. |

## Kan later

- **Video voor de opening.** Er is geen geschikte, gemonteerde video in de projectmap, en ik kan hier geen video monteren. De opening gebruikt een foto. Shots die je kunt opnemen (liggend, vanaf statief, 5 tot 8 seconden elk, zonder geluid): breed beeld vanaf de ingang; een hand die een schijf op de stang schuift; iemand midden in een set; een kort coachmoment. Ook een staand shot vanaf de ingang richting de sprinttrack voor mobiel.
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

- **Na je feedback van 13 november:** de vorige opening (woordmerk, boog en wortels) staat terug, nu met beweging die het scrollen volgt: het woordmerk schuift weg, de foto zoomt licht in en de wortels groeien de volgende sectie in. De menubalk blijft op elke pagina bovenaan vast. De kop is "Twee manieren om jouw fysieke transformatie te realiseren". Op de coachingpagina is het woord "Coaching" niet meer afgesneden, zijn de trajectknoppen even breed en is de intakefoto minder ingezoomd.
- **De drie pijlers:** de scrollscène toont nu Beweging, Voeding en Levensstijl in plaats van drie clubbeelden, met de boodschap dat de drie altijd samen horen. De drie beelden zijn je eigen foto's (aangeleverd op 13 november). Op de voedingsfoto zijn merken zichtbaar (Alpro, Arla, Myprotein); laat weten als je dat liever niet hebt. De foto van de gevel staat op de contactpagina en bij "Je eerste keer". De vijfde foto (proeven aan het aanrecht) is niet gebruikt en staat in `aangeleverd/`. De pijlers staan nu één keer op de homepage, niet meer ook in het blok "Sterker worden begint met begrijpen".
- **Homepage:** (eerste voorstel, vervangen door het bovenstaande) nieuwe opening met een breed beeld van de eigen trainingsruimte; "De club, in drie beelden" (vrije gewichten, krachttoestellen, sprinttrack) met op desktop één vast beeldvlak dat wisselt tijdens het scrollen; een concreet coachingvoorbeeld (situatie, beslissing, waarom); "Sterker worden begint met begrijpen" linkt nu naar een echt artikel en de recentste aflevering.
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

## Formulier naar je mailbox, algemene voorwaarden en privacybeleid (16 november, nog niet online)

**Formulier.** Het formulier kan nu zelf versturen via Web3Forms. Zodra de sleutel in `gegevens/site.json` staat (`formulier.web3forms_sleutel`), komt elke aanvraag als mail binnen met de onderwerpregel "Nieuwe intake-aanvraag: voornaam achternaam" en daaronder voornaam, achternaam, telefoon, e-mail, onderwerp, voorkeur voor het gesprek (online of in de studio, alleen bij een intake) en vraag of doel. Met "Beantwoorden" antwoord je meteen de aanvrager. Nieuwe velden: achternaam (optioneel) en voorkeur voor het gesprek (optioneel). Getest met een nep-ontvanger op deze Mac: succes verschijnt pas nadat de dienst de aanvraag aanvaardt, en bij een weigering verschijnt de foutmelding met e-mail en telefoon. Nog niet getest met de echte sleutel; dat doen we samen met één proefaanvraag.

**Algemene voorwaarden** (`algemene-voorwaarden.html`, nieuw) en **privacybeleid** (herschreven; het oude was een algemeen sjabloon met beloftes als "we garanderen de veiligheid"). Dit zijn ontwerpen, geen juridisch advies: laat ze bij voorkeur nalezen door een jurist (bv. via UNIZO of je boekhouder). De gele stukken moet je invullen; zolang er één staat, slaagt de test niet en gaat niets online.

| | Waar | In te vullen of te bevestigen |
|---|---|---|
| S | Voorwaarden 4 | Minimumleeftijd om lid te worden. |
| T | Voorwaarden 5 | Hoe en wanneer er betaald wordt (maandelijks vooraf, automatisch, welke betaalmethodes). |
| U | Voorwaarden 6 | Opzegtermijn en minimale looptijd van App Coaching en Monthly Online Coaching (= punt F). |
| V | Voorwaarden 7 | Tot hoeveel uur vooraf een personal-trainingsessie kosteloos verplaatst kan worden, en wat er gebeurt bij later afzeggen. |
| W | Voorwaarden 16, privacy | Datum waarop de teksten online komen. |
| X | Privacy | Hangen er camera's? Zo ja: doel, bewaartermijn, pictogram. |
| Y | Privacy | Naam van de app waarmee leden binnenkomen en klanten hun dagboek bijhouden. |
| Z | Voorstellen van mij, graag bevestigen | Opzeggen per e-mail; prijswijziging 30 dagen vooraf met kosteloze opzegging; ongebruikte beurten vervallen na een jaar; toegang opschorten bij uitblijvende betaling; bewaartermijnen in het privacybeleid (contactaanvraag 1 jaar, coachinggegevens 1 jaar na het traject, boekhouding 10 jaar); bestaat een pauze bij blessure of zwangerschap? |

Tip voor Web3Forms: in hun dashboard kun je instellen hoe lang ze aanvragen bewaren (standaard 3 jaar). Zet dat kort, bv. 30 dagen: de mail staat toch in je eigen mailbox.
