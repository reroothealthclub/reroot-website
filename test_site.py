#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Controleert de gebouwde website van Reroot.

    python3 test_site.py            bouwt de site en controleert alle pagina's
    python3 test_site.py --online   controleert daarnaast of de externe links bereikbaar zijn

Er wordt nooit iets besteld of betaald: van betaalpagina's wordt alleen
nagekeken of ze bestaan.
"""
import os
import sys
import tempfile
import urllib.error
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urlparse, parse_qs

import bouw

ALGEMENE_CHECKOUT = 'checkout.rerootcoaching.com/rerootcoaching'
VERBODEN_TEKST = ['te bevestigen', 'te controleren', 'tekst volgt', 'luisterlink volgt', 'prototype',
                  'laat ze goedkeuren', 'lorem ipsum', 'todo']


class Pagina(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.imgs, self.h1 = set(), [], [], 0
        self.title, self.desc, self.lang, self.viewport = '', '', '', False
        self.opties, self.klassen, self.tekst = [], set(), []
        self._a = None
        self._in_title = False
        self._skip = 0
        self.koppen, self.meta, self.rels, self.base = [], {}, {}, ''

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        for k in (a.get('class') or '').split():
            self.klassen.add(k)
        if tag == 'html':
            self.lang = a.get('lang', '')
        elif tag == 'meta':
            if a.get('name') == 'viewport':
                self.viewport = True
            if a.get('name') == 'description':
                self.desc = a.get('content', '')
            sleutel = a.get('property') or a.get('name')
            if sleutel:
                self.meta[sleutel] = a.get('content', '')
        elif tag == 'link':
            self.rels[a.get('rel', '')] = a.get('href', '')
        elif tag == 'base':
            self.base = a.get('href', '')
        elif tag in ('h2', 'h3', 'h4'):
            self.koppen.append(int(tag[1]))
        elif tag == 'title':
            self._in_title = True
        elif tag == 'h1':
            self.h1 += 1
            self.koppen.append(1)
        elif tag == 'img':
            self.imgs.append(a)
            if self._a is not None:
                self._a['tekst'] += ' ' + (a.get('alt') or '')
        elif tag == 'a':
            self._a = {'href': a.get('href'), 'tekst': '', 'target': a.get('target'), 'rel': a.get('rel') or ''}
        elif tag == 'option':
            self.opties.append(a.get('value', ''))
        elif tag in ('script', 'style'):
            self._skip += 1

    def handle_endtag(self, tag):
        if tag == 'a' and self._a is not None:
            self._a['tekst'] = ' '.join(self._a['tekst'].split())
            self.links.append(self._a)
            self._a = None
        elif tag == 'title':
            self._in_title = False
        elif tag in ('script', 'style'):
            self._skip -= 1

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._skip:
            return
        self.tekst.append(data)
        if self._a is not None:
            self._a['tekst'] += data


def main():
    online = '--online' in sys.argv
    fouten, ok = [], []

    def check(voorwaarde, melding):
        (ok if voorwaarde else fouten).append(melding)

    uit = tempfile.mkdtemp(prefix='reroot-test-')
    try:
        bestanden = bouw.bouw(uit=uit, stil=True)
    except bouw.Bouwfout as e:
        print('FOUT bij het bouwen: %s' % e)
        return 1
    g = bouw.verrijk(bouw.lees_gegevens())

    paginas = {}
    for b in bestanden:
        p = Pagina()
        with open(os.path.join(uit, b), encoding='utf-8') as f:
            ruw = f.read()
        p.feed(ruw)
        p.ruw = ruw
        paginas[b] = p

    verwacht = ['index.html', 'health-club.html', 'coaching.html', 'tarieven.html',
                'over-reroot.html', 'kennisbank.html', 'contact.html', 'privacybeleid.html', 'algemene-voorwaarden.html', '404.html', 'freteffect.html']
    for v in verwacht:
        check(v in paginas, 'pagina %s bestaat' % v)

    extern = {}
    titels = set()
    for naam, p in paginas.items():
        tekst = ' '.join(' '.join(p.tekst).split()).lower()
        check(p.lang.startswith('nl'), '%s: taal staat op Nederlands' % naam)
        check(p.viewport, '%s: viewport-meta aanwezig (mobiel)' % naam)
        check(p.h1 == 1, '%s: precies één h1 (gevonden: %d)' % (naam, p.h1))
        check(bool(p.title.strip()) and p.title not in titels, '%s: unieke paginatitel' % naam)
        titels.add(p.title)
        check(50 <= len(p.desc) <= 200, '%s: beschrijving van 50 tot 200 tekens (nu %d)' % (naam, len(p.desc)))
        check('note' not in p.klassen, '%s: geen interne notities (klasse "note")' % naam)
        for woord in VERBODEN_TEKST:
            check(woord not in tekst, '%s: geen werktekst "%s" zichtbaar' % (naam, woord))
        check('{{' not in p.ruw, '%s: geen niet-ingevulde {{velden}}' % naam)
        check(ALGEMENE_CHECKOUT not in p.ruw, '%s: geen knop naar de algemene checkoutpagina' % naam)

        for img in p.imgs:
            src = img.get('src', '')
            check(os.path.isfile(os.path.join(uit, src)), '%s: beeld %s bestaat' % (naam, src))
            check('alt' in img, '%s: beeld %s heeft een alt-attribuut (leeg mag alleen bij decoratie)' % (naam, src))

        # koppen: geen niveau overslaan (h2 -> h4)
        vorige = 0
        for niveau in p.koppen:
            check(niveau <= vorige + 1, '%s: koppen slaan geen niveau over (h%d na h%d)' % (naam, niveau, vorige))
            vorige = niveau
        # metadata voor delen en zoeken
        check(p.meta.get('og:image', '').startswith('https://'), '%s: deelbeeld (og:image) met volledig adres' % naam)
        check(p.meta.get('og:url', '').startswith(g['publicatie']['basis_url']), '%s: og:url wijst naar het publicatieadres' % naam)
        check(os.path.isfile(os.path.join(uit, p.rels.get('icon', 'x'))), '%s: favicon bestaat' % naam)
        heeft_noindex = 'noindex' in p.meta.get('robots', '')
        heeft_canoniek = 'canonical' in p.rels
        check(heeft_noindex != heeft_canoniek, '%s: ofwel noindex (testadres) ofwel een canonieke link, nooit allebei' % naam)

        for a in p.links:
            href, t = a['href'], a['tekst']
            check(bool(href) and href != '#', '%s: link "%s" heeft een echte bestemming' % (naam, t))
            check(bool(t), '%s: link naar %s heeft tekst' % (naam, href))
            if not href:
                continue
            if href.startswith(('http://', 'https://')):
                extern.setdefault(href, []).append('%s "%s"' % (naam, t))
                check(a['target'] == '_blank' and 'noopener' in a['rel'],
                      '%s: externe link "%s" opent veilig in een nieuw tabblad' % (naam, t))
            elif href.startswith(('mailto:', 'tel:')):
                pass
            else:
                u = urlparse(href)
                doel = u.path or naam
                check(doel in paginas, '%s: link "%s" -> %s bestaat' % (naam, t, doel))
                if u.fragment and doel in paginas:
                    check(u.fragment in paginas[doel].ids, '%s: anker #%s bestaat op %s' % (naam, u.fragment, doel))
                if u.query and doel in paginas:
                    onderwerp = parse_qs(u.query).get('onderwerp', [''])[0]
                    check(onderwerp in paginas[doel].opties,
                          '%s: link "%s" kiest onderwerp "%s" dat in het formulier bestaat' % (naam, t, onderwerp))

    def links(pagina, tekst=None, href=None):
        return [a for a in paginas[pagina].links
                if (tekst is None or a['tekst'] == tekst) and (href is None or a['href'] == href)]

    # ---- route Open Gym: home -> clubinfo -> tarief -> juiste checkout
    og = g['aanbod']['open_gym']
    check(links('index.html', href='health-club.html'), 'route Open Gym: home linkt naar de Health Club')
    check(links('health-club.html', og['actie_tekst'], og['actie_url']),
          'route Open Gym: knop "%s" op de clubpagina gaat naar %s' % (og['actie_tekst'], og['actie_url']))
    check('€ %s' % og['prijs'] in paginas['health-club.html'].ruw, 'route Open Gym: tarief staat op de clubpagina')
    for naam in paginas:
        for a in links(naam, og['actie_tekst']):
            check(a['href'] == og['actie_url'], '%s: elke knop "%s" gaat naar de Open Gym-bestemming' % (naam, og['actie_tekst']))

    # ---- route Coaching: home -> vergelijking -> passende vervolgstap per traject
    check(links('index.html', href='coaching.html'), 'route Coaching: home linkt naar Coaching')
    check('trajecten' in paginas['coaching.html'].ids, 'route Coaching: vergelijking van trajecten staat op de coachingpagina')
    bestemmingen = set()
    for sleutel in ('app_coaching', 'monthly_coaching', 'personal_training'):
        a = g['aanbod'][sleutel]
        for pag in ('coaching.html', 'tarieven.html'):
            check(links(pag, a['actie_tekst'], a['actie_url']),
                  'route Coaching: %s heeft op %s de knop "%s" -> %s' % (a['naam'], pag, a['actie_tekst'], a['actie_url']))
        if a['kan_kopen']:
            check(a['actie_url'] not in bestemmingen, 'route Coaching: %s heeft een eigen checkout' % a['naam'])
            bestemmingen.add(a['actie_url'])
        else:
            check(a['actie_tekst'].startswith('Vraag '), 'route Coaching: zonder checkout belooft de knop van %s geen aankoop' % a['naam'])

    # ---- homepage: opening en clubscène
    thuis = paginas['index.html']
    check(links('index.html', 'Zelfstandig trainen', 'health-club.html'), 'home: knop "Zelfstandig trainen" gaat naar de Health Club')
    check(links('index.html', 'Trainen met een coach', 'coaching.html'), 'home: knop "Trainen met een coach" gaat naar Coaching')
    check('Fitnessclub in %s' % g['adres']['gemeente'] in thuis.ruw and 'Verandering' in thuis.ruw, 'home: plaats en merkzin staan in de opening')
    check('class="kop"' in thuis.ruw, 'home: vaste menubalk aanwezig')
    check(thuis.ruw.count('class="scene-item"') == 3, 'home: de scrollscène met de drie pijlers telt drie onderdelen')
    check(thuis.ruw.count('fetchpriority="high"') == 1, 'home: precies één beeld krijgt laadprioriteit')
    check('ter illustratie' in thuis.ruw, 'home: het coachingvoorbeeld is als illustratief gelabeld')
    check('eerste-keer' in paginas['health-club.html'].ids, 'clubpagina: blok "Je eerste keer bij Reroot" aanwezig')
    for pag in ('index.html', 'coaching.html'):
        check(any(a['href'].startswith('kennisbank-') for a in paginas[pag].links), '%s: linkt naar een artikel of aflevering uit de Kennisbank' % pag)

    # ---- 404 en vindbaarheid
    p404 = paginas['404.html']
    check(p404.base == g['publicatie']['basis_pad'], '404: links werken vanaf elk adres (base = %s)' % g['publicatie']['basis_pad'])
    check('noindex' in p404.meta.get('robots', ''), '404: wordt niet geïndexeerd')
    check(links('404.html', href='index.html'), '404: terugroute naar de startpagina')
    if not g['publicatie'].get('zoekmachines_toelaten'):
        check(not os.path.exists(os.path.join(uit, 'sitemap.xml')), 'testadres: geen sitemap zolang zoekmachines niet toegelaten zijn')
    # proefbouw met zoekmachines toegelaten: sitemap, robots.txt en canonieke links moeten kloppen
    proef = bouw.lees_gegevens()
    proef['publicatie']['zoekmachines_toelaten'] = True
    uit2 = tempfile.mkdtemp(prefix='reroot-test-live-')
    bestanden2 = bouw.bouw(uit=uit2, stil=True, gegevens=proef)
    with open(os.path.join(uit2, 'sitemap.xml'), encoding='utf-8') as f:
        sitemap = f.read()
    for b in bestanden2:
        adres = proef['publicatie']['basis_url'] + ('' if b == 'index.html' else b)
        if b == '404.html':
            check(adres not in sitemap, 'live-proef: 404 staat niet in de sitemap')
            continue
        check('<loc>%s</loc>' % adres in sitemap, 'live-proef: %s staat in de sitemap' % b)
        with open(os.path.join(uit2, b), encoding='utf-8') as f:
            ruw2 = f.read()
        check('<link rel="canonical" href="%s">' % adres in ruw2 and 'noindex' not in ruw2, 'live-proef: %s heeft een canonieke link en geen noindex' % b)
    check(os.path.isfile(os.path.join(uit2, 'robots.txt')), 'live-proef: robots.txt verwijst naar de sitemap')
    # ---- oude adressen van de vorige site sturen door naar een bestaande pagina
    omleidingen = dict(g.get('omleidingen', {}))
    for art in bouw.lees_artikels():
        omleidingen['content/' + art['bronbestand'][:-5]] = art['url']
    for oud, nieuw in sorted(omleidingen.items()):
        stub = os.path.join(uit, oud, 'index.html')
        check(os.path.isfile(stub), 'omleiding: /%s heeft een doorstuurbestand' % oud)
        check(nieuw.split('#')[0].split('?')[0] in paginas, 'omleiding: /%s -> %s bestaat' % (oud, nieuw))
    check(len(omleidingen) >= 21, 'omleiding: alle bekende adressen van de vorige site zijn gedekt')

    # ---- publieke map: geen ontwikkel- of geheime bestanden
    for wortel, mappen, bestanden_uit in os.walk(uit):
        for b in bestanden_uit + mappen:
            check(not (b.startswith('.') or b.endswith(('.map', '.env', '.py', '.json', '.md'))),
                  'publieke map: geen ontwikkelbestand %s' % b)

    # ---- route Kennismaking: aanvraag, geen "plan"
    km = g['kennismaking']
    for naam, p in paginas.items():
        for a in p.links:
            if 'kennismaking' in a['tekst'].lower() or 'intake' in a['tekst'].lower():
                check(a['href'].startswith(('contact.html?onderwerp=kennismaking', 'contact.html?onderwerp=freteffect')),
                      '%s: "%s" gaat naar het aanvraagformulier' % (naam, a['tekst']))
                check('plan een' not in a['tekst'].lower(), '%s: knop belooft geen directe boeking ("%s")' % (naam, a['tekst']))
    check(links('index.html', km['knoptekst']), 'route Kennismaking: knop staat op de homepage')
    check('boek' not in km['knoptekst'].lower(), 'route Kennismaking: de knop zegt "aanvragen", geen "boeken" (er is geen boekingssysteem)')

    # ---- redactieronde 16 november: afgekeurde of onbevestigde formuleringen komen niet terug
    verboden = ['fysieke transformatie', 'een plan dat in je week past', 'haal het maximum', 'zet vandaag de eerste stap',
                'training met richting', 'boek je intakegesprek']
    for naam, p in paginas.items():
        if naam.startswith('kennisbank-'):
            continue  # bestaande artikels en afleveringen herschrijven we niet
        tekst = ' '.join(p.tekst).lower()
        for zin in verboden:
            check(zin not in tekst, '%s: geen "%s" op de pagina' % (naam, zin))
    check('Train zelfstandig of met een coach' in ' '.join(paginas['index.html'].tekst), 'homepage: kop "Train zelfstandig of met een coach"')

    # ---- Mijn Reroot en merch
    for naam in paginas:
        mijn = links(naam, g['links']['ledenapp_knoptekst'])
        if g['links']['ledenapp_url']:
            check(mijn and all(a['href'] == g['links']['ledenapp_url'] for a in mijn), '%s: de knop naar de app gaat naar de ingestelde URL' % naam)
        else:
            check(not mijn, '%s: geen knop naar de app zolang de URL onbekend is' % naam)
    for m in g['merch']['artikels']:
        if g['merch']['zichtbaar'] and m.get('checkout_url'):
            check(links('index.html', href=m['checkout_url']), 'merch: "%s" linkt naar zijn eigen bestelpagina' % m['naam'])

    # ---- contactformulier
    c = paginas['contact.html']
    check('formulier' in c.ids and 'contactformulier' in c.ids, 'contact: formulier aanwezig')
    check('melding-ok' in c.ids and 'melding-fout' in c.ids and 'melding-mail' in c.ids, 'contact: meldingen voor succes, fout en e-mail aanwezig')
    check(links('contact.html', href='tel:%s' % g['contact']['telefoon_link']), 'contact: telefoonnummer als alternatief')
    check(links('contact.html', href='mailto:%s' % g['contact']['email']), 'contact: e-mailadres als alternatief')
    check('medische gegevens' in c.ruw, 'contact: formulier vraagt uitdrukkelijk geen medische gegevens')
    if not g['formulier']['verzend_url']:
        check('Verstuur je bericht' not in c.ruw, 'contact: zonder formulierdienst belooft de knop geen verzending')
    sleutel = g['formulier'].get('web3forms_sleutel', '')
    if sleutel:
        check(('data-sleutel="%s"' % sleutel) in c.ruw and 'data-verzend-url="https://api.web3forms.com/submit"' in c.ruw,
              'contact: formulier verstuurt via Web3Forms met de ingestelde sleutel')
    check('name="achternaam"' in c.ruw and 'id="vk-vak"' in c.ruw, 'contact: velden achternaam en voorkeur voor het gesprek aanwezig')

    # ---- ontwerpteksten: niets online met nog in te vullen stukken
    for naam, p in paginas.items():
        check('class="invullen"' not in p.ruw,
              '%s: bevat geen stukken meer die Simon nog moet invullen (gele markering)' % naam)

    # ---- live reviews: alleen als de widget is ingesteld
    for pag in ('index.html', 'coaching.html'):
        heeft = 'data-live-reviews' in paginas[pag].ruw
        check(heeft == bool(g['reviews'].get('live_widget_embedsocial')), '%s: reviewwidget staat er alleen als hij is ingesteld' % pag)

    # ---- geen cookies of verzoeken naar derden zonder klik: lettertypes zelf gehost, iframes pas na een klik
    for naam, p in paginas.items():
        check('fonts.googleapis' not in p.ruw and 'fonts.gstatic' not in p.ruw, '%s: lettertypes komen niet van Google Fonts' % naam)
        check('<iframe' not in p.ruw, '%s: geen iframe van een externe dienst bij het laden' % naam)

    # ---- geen trackers of onverwachte externe scripts
    for naam, p in paginas.items():
        check('<script src="http' not in p.ruw and 'googletagmanager' not in p.ruw and 'facebook.net' not in p.ruw,
              '%s: geen trackers of externe scripts' % naam)

    # ---- externe links (optioneel)
    waarschuwingen = []
    if online:
        for url, waar in sorted(extern.items()):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (linkcontrole)'})
                with urllib.request.urlopen(req, timeout=15) as r:
                    status = r.status
            except urllib.error.HTTPError as e:
                status = e.code
            except Exception as e:  # noqa
                status = 'geen antwoord (%s)' % type(e).__name__
            if status == 200:
                ok.append('online: %s' % url)
            elif status in (401, 403, 429, 999) or 'google.' in url or 'g.page' in url or 'tiktok' in url or 'instagram' in url:
                waarschuwingen.append('%s gaf "%s" (deze sites weren vaak automatische controles; klik zelf even na) - %s' % (url, status, waar[0]))
            else:
                fouten.append('online: %s gaf "%s" - gebruikt in %s' % (url, status, waar[0]))

    print('%d controles geslaagd, %d mislukt.' % (len(ok), len(fouten)))
    if not online:
        print('%d externe links niet online gecontroleerd (gebruik --online).' % len(extern))
    for w in waarschuwingen:
        print('LET OP: ' + w)
    for f in fouten:
        print('MISLUKT: ' + f)
    return 1 if fouten else 0


if __name__ == '__main__':
    sys.exit(main())
