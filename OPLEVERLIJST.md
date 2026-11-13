# Opleverlijst Reroot-website (bijgewerkt op 13 november 2026)

## Bevestigd door Simon en verwerkt

- Directe koopknoppen naar de Plug&Pay-betaalpagina's mogen, ook voor coaching.
- Het traject heet **Monthly Online Coaching**.
- Monthly Online Coaching: elke week een check-up, één keer per maand live en de andere weken via de app. Geen toegang tot de Health Club.
- App Coaching: wekelijkse check-up via de app. Geen toegang tot de Health Club.
- Personal Training: 10-beurtenkaart van € 640 incl. 6% btw, één sessie per week, kaart één jaar geldig.
- Open Gym: zonder jaarcontract, zonder inschrijfkosten, opzeggen tot 10 dagen voor het einde van de maand, maximaal 150 leden.
- Google-score 4,9 op 58 reviews klopt en staat weer op de site.
- De bio's blijven voorlopig zoals ze zijn.
- De missietekst staat terug, op de pagina Over Reroot.
- De Open Gym is ook op feestdagen open; coaching en personal training zijn op afspraak.
- 250 m² (zonder "circa") en acht merken: Nautilus, Panatta, Technogym, ATX, Sterling, Marbo Sport, StairMaster en Xebex.
- De knop "Mijn Reroot" blijft weg.

## Nog open

| # | Onderwerp | Stand | Wat nodig is |
|---|---|---|---|
| 1 | **Google-reviews als citaat** | De citaten van de oude site zijn verwijderd. Er staan nu geen citaten, alleen de score en de link naar Google. Google Maps toonde mij de reviews niet, dus ik kon ze niet zelf overnemen. | Plak de reviews die je wil tonen (tekst en naam) in de chat, of bevestig dat de drie fragmenten in `site.json` (Steff Knoors, Annabelle Vandooren, Peter Koolen) letterlijk kloppen. |
| 2 | **Betaalpagina's in Plug&Pay** | De site is aangepast, de betaalpagina's niet (daar kan en mag ik niet aan). | Zelf aanpassen: de naam "Reroot Online Coaching" wordt "Reroot Monthly Online Coaching", en de Open Gym-pagina's spreken nog van 200 leden en "nog 57 beschikbaar" in plaats van 150. |
| 3 | **Foto's van Kevin** | De huidige foto is 520 pixels breed en oogt wazig op een groot scherm. | Nieuwe foto's volgen van Simon. |
| 4 | **Merchfoto's** | De petfoto toont drie kleuren terwijl er één pet te koop is. | Nieuwe foto's volgen van Simon. |
| 5 | **Merknaam Marbo** | Op de site staat "Marbo Sport", de officiële naam van het merk. Simon schreef "Marbo sports". | Laat weten als je de andere schrijfwijze wil. |
| 6 | **Koppeling met de ledenapp** | Niet gebouwd. Simon wil bezoekers naar de app sturen; wat dat precies inhoudt, is nog niet afgesproken. | Zie de vraag in de chat. |

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
