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
| 1 | **Plug&Pay-verkooppagina** | Op `checkout.rerootcoaching.com/rerootcoaching` staat bij de blokken "Monthly Coaching" en "Open Gym" nog: "exclusieve open gym concept met een maximum van 200 Leden". De betaalpagina van het traject heet daar "Reroot Online Coaching". | Zelf aanpassen in Plug&Pay: 200 wordt 150, en de naam wordt "Reroot Monthly Online Coaching". |
| 2 | **Knop naar de app** | Voorbereid, maar nog niet zichtbaar. De app in `Reroot-proef` draait alleen lokaal op je Mac en heeft nog geen publiek adres. | Zodra de app online staat: vul het adres in bij `ledenapp_url` in `gegevens/site.json`. De knop "Open de app" verschijnt dan in het menu en in de voettekst. |
| 3 | **Merchfoto's** | De petfoto toont drie kleuren terwijl er één pet te koop is. | Nieuwe foto's volgen van Simon. |
| 4 | **Merknaam Marbo** | Op de site staat "Marbo Sport", de officiële naam van het merk. Simon schreef "Marbo sports". | Laat weten als je de andere schrijfwijze wil. |

## Dringend: algemene voorwaarden

De pagina "Algemene voorwaarden" op je huidige site (`www.rerootcoaching.com/algemene-voorwaarden`) bevat geen voorwaarden maar Latijnse opvultekst van de websitebouwer. Je betaalpagina's en je oude site verwijzen daar wel naar. Ik heb die tekst niet overgenomen en de nieuwe site verwijst nergens meer naar algemene voorwaarden. Zodra je echte voorwaarden hebt, vul je het adres in bij `algemene_voorwaarden` in `gegevens/site.json` en verschijnen de links vanzelf opnieuw.

## Overgezet van de huidige site

- Vijf artikels en vijf podcastafleveringen staan nu als eigen pagina's in de nieuwe site (`bron/artikels/`), met hun beeld of Spotify-speler. De tekst is letterlijk overgenomen; lijstjes met bolletjes zijn echte lijsten geworden.
- Het privacybeleid staat op een eigen pagina (`bron/paginas/privacybeleid.html`), letterlijk overgenomen. Het vermeldt nog niets over de reviewwidget van EmbedSocial, de lettertypes van Google en de Spotify-speler. Laat het nalezen en aanvullen.
- Eén artikel had op de oude site de categorie "Topic 5" (opvulling); dat is "Voeding" geworden.

## Sinds de vorige ronde verwerkt

- **Live Google-reviews:** de site gebruikt nu dezelfde EmbedSocial-widget als je Plug&Pay-pagina. De reviews worden live geladen en vullen zichzelf aan. De widget laadt pas wanneer de bezoeker in de buurt van het blok komt. Let op: dit is een externe dienst die bij het laden contact maakt met EmbedSocial; vermeld dat in je privacybeleid.
- **Foto van Kevin:** vervangen door een scherpe portretfoto. Alle tien aangeleverde foto's staan in `aangeleverd/kevin/`. Op enkele ervan is de naam van een andere gym zichtbaar; die heb ik niet gebruikt.

## Beslissingen die bij jou liggen

| # | Onderwerp | Toelichting |
|---|---|---|
| 16 | **Formulierdienst** | Het contactformulier zet nu een e-mail klaar bij de bezoeker. Dat werkt zonder extra dienst, maar is minder vlot dan echt verzenden. Kies je een dienst, dan is het één regel in `site.json` (zie de handleiding). Ik heb niets toegevoegd waarvoor je moet betalen of een account nodig hebt. |
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
