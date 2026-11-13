# Opleverlijst Reroot-website (13 november 2026)

Alles wat hieronder staat, is uit de publieke weergave gehaald of neutraal geformuleerd tot jij het bevestigt. Niets hiervan blokkeert de site.

## Graag bevestigen vóór livegang

| # | Onderwerp | Wat er nu op de site staat | Wat ik van jou nodig heb |
|---|---|---|---|
| 1 | **Betaalknoppen per aanbod** | Elke knop gaat naar de eigen betaalpagina die op `checkout.rerootcoaching.com/rerootcoaching` aan dat aanbod hangt. Titel en prijs van elke bestemming zijn nagekeken (Open Gym € 35, App Coaching € 99, Monthly Coaching € 185, 10-beurtenkaart € 640, drie merchartikels € 25). Er is niets besteld. | Je akkoord dat bezoekers coaching rechtstreeks mogen kopen zonder kennismaking. Wil je dat niet, maak dan de `checkout_url` van dat traject leeg; de knop wordt dan vanzelf "Vraag … aan". |
| 2 | **Naam Monthly Coaching** | De site zegt "Monthly Coaching", de betaalpagina heet "Reroot Online Coaching". | Welke naam is de juiste? Eén van beide aanpassen. |
| 3 | **Inhoud Monthly Coaching** | "Wekelijkse feedback op je dagboek en een maandelijkse check-up." De eerdere bewering "toegang tot de Health Club via de app" is weggelaten, want de betaalpagina vermeldt ze niet. | Zit toegang tot de Health Club erin? Is de check-up live of online? |
| 4 | **Inhoud App Coaching** | "Wekelijkse feedback via de app", zoals op de betaalpagina. Over toegang tot de Health Club zegt de site niets. | Bevestigen, en of gymtoegang inbegrepen is. |
| 5 | **Beurtenkaart** | € 64 per sessie, 10-beurtenkaart € 640 incl. btw, één-op-één of kleine groep. "6% btw" is geschrapt: de betaalpagina zegt alleen "inclusief BTW". | Geldigheidsduur van de kaart en het btw-tarief. |
| 6 | **Open Gym-voorwaarden** | "Maandelijks abonnement, zonder jaarcontract", toegang via de app. | Opzegtermijn en eventuele inschrijfkosten, als je die wil vermelden. Ook: wil je het maximum van 200 leden vermelden? Ik heb het weggelaten. |
| 7 | **Google-score** | Verborgen. Google toonde mij alleen een toestemmingsscherm, dus ik kon "4,9 op 58 reviews" niet nakijken. | Kijk de score en het aantal na en zet `google_score_tonen` op `true` in `gegevens/site.json`. |
| 8 | **Reviews** | Drie citaten van je huidige site (Naomi Van Rulo, Leentje Beckers, Shana Laenen), letterlijk overgenomen en ingekort. De drie Google-fragmenten uit de preview staan klaar in `site.json` met `tonen: false`. | Je akkoord, en bij voorkeur dat van de personen zelf, om hun naam te blijven tonen. |
| 9 | **Bio's van de coaches** | Herschreven vanuit de teksten op je huidige site. | Nalezen door Simon en Kevin. |
| 10 | **Foto van Kevin** | De foto is maar 520 pixels breed en oogt wazig op een groot scherm. | Een scherpere foto (minstens 1000 pixels breed). |
| 11 | **Missietekst** | Weggelaten. De zin was: "Een toegankelijke maar hoogwaardige omgeving voor mensen die bewust willen investeren in zichzelf." | Wil je die terug, dan zet ik ze op de pagina Over Reroot. |
| 12 | **Openingsuren op feestdagen** | Niet vermeld. | Wijken ze af, dan voeg ik een regel toe. |
| 13 | **Oppervlakte en toestellen** | "Circa 250 m²", vijf merken en vijf soorten uitrusting, overgenomen uit de preview. | Bevestigen. |
| 14 | **Ledenapp "Mijn Reroot"** | Knop weggelaten: de URL is niet bekend. | De URL; invullen bij `ledenapp_url`. |
| 15 | **Merch** | Zwart T-shirt, beige T-shirt en pet, elk € 25 met eigen bestelknop. "Hoodies" is geschrapt (niet te koop op de betaalpagina), net als de vermelding van beperkte oplages. | Bevestigen. De petfoto toont drie kleuren, terwijl er één pet te koop is. |

## Beslissingen die bij jou liggen

| # | Onderwerp | Toelichting |
|---|---|---|
| 16 | **Formulierdienst** | Het contactformulier zet nu een e-mail klaar bij de bezoeker. Dat werkt zonder extra dienst, maar is minder vlot dan echt verzenden. Kies je een dienst, dan is het één regel in `site.json` (zie de handleiding). Ik heb niets toegevoegd waarvoor je moet betalen of een account nodig hebt. |
| 17 | **Artikels en podcast** | De Kennisbank linkt naar de bestaande artikels en afleveringen op `www.rerootcoaching.com/content/...`. Vervangt deze site de huidige op hetzelfde domein, dan verdwijnen die pagina's. Dan moeten de artikels eerst overgezet worden (de opmaak voor een artikelpagina zit nog in `origineel/index.html`). |
| 18 | **Privacybeleid en voorwaarden** | Linken ook nog naar de huidige site. Zelfde aandachtspunt als hierboven. |
| 19 | **Lettertypes** | Worden van Google Fonts geladen, zoals in de preview. Wil je geen verbinding met Google bij elk bezoek, dan kunnen ze lokaal in de site gezet worden. |
| 20 | **Hosting en domein** | Niet gekozen in dit project. De site bestaat uit gewone bestanden in `publiek/` en werkt overal. Er is niets live gezet. |
| 21 | **Favicon en deelafbeelding** | Niet aanwezig. Kan uit het logo gemaakt worden zodra je een vierkante versie op een effen achtergrond aanlevert. |

## Wat getest is

- `python3 test_site.py --online`: alle controles geslaagd, inclusief de bereikbaarheid van alle externe links.
- In de browser nagekeken op 320, 375 en 1440 pixels breed: geen horizontale overloop op de zeven pagina's.
- Contactformulier: leeg versturen, ongeldig e-mailadres, dienst die weigert (foutmelding, geen succes) en dienst die aanvaardt (succes).

## Wat niet getest is

- Een echte betaling of bestelling.
- Het openen van een mailprogramma op een echt toestel (het formulier zet de mail klaar; dat hangt af van het toestel van de bezoeker).
- Echte telefoons en Safari. De controle gebeurde in één browser met nagebootste schermbreedtes.
- Laadsnelheid op een mobiel netwerk.
