#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bouwt de website van Reroot.

    python3 bouw.py            bouwt de site in de map 'publiek'
    python3 bouw.py --bekijk   bouwt en toont de site op http://localhost:8000
                               (herbouwt vanzelf als je een bestand bewaart)

Gegevens (prijzen, uren, links, coaches ...) staan in gegevens/site.json.
Teksten en opmaak per pagina staan in bron/paginas/.
Dit script heeft alleen Python 3 nodig, geen extra pakketten.
"""
import hashlib
import html
import json
import os
import re
import shutil
import sys
from datetime import date
from urllib.parse import urlparse

HIER = os.path.dirname(os.path.abspath(__file__))
GEGEVENS = os.path.join(HIER, 'gegevens', 'site.json')
BRON = os.path.join(HIER, 'bron')
UIT = os.path.join(HIER, 'publiek')


class Bouwfout(Exception):
    pass


# ---------------------------------------------------------------- gegevens

def lees_gegevens(pad=GEGEVENS):
    try:
        with open(pad, encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise Bouwfout(
            'gegevens/site.json is niet geldig: regel %d, teken %d (%s).\n'
            'Meestal is dat een vergeten of overbodige komma, of een aanhalingsteken dat ontbreekt.'
            % (e.lineno, e.colno, e.msg))


def _minuten(tijd, waar):
    m = re.match(r'^(\d{1,2}):(\d{2})$', tijd or '')
    if not m or int(m.group(1)) > 24 or int(m.group(2)) > 59:
        raise Bouwfout('Openingsuur "%s" bij %s is niet geldig. Schrijf het als 06:00.' % (tijd, waar))
    return int(m.group(1)) * 60 + int(m.group(2))


def _url_ok(url):
    return url == '' or url.startswith('https://') or url.startswith('http://')


def _slug(sleutel):
    return sleutel.replace('_', '-')


def verrijk(g):
    """Controleert de gegevens en leidt er alles uit af wat de sjablonen nodig hebben."""
    for groep in ('bedrijf', 'adres', 'contact', 'formulier', 'openingsuren', 'club', 'links',
                  'aanbod', 'coaches', 'reviews', 'merch'):
        if groep not in g:
            raise Bouwfout('In gegevens/site.json ontbreekt het onderdeel "%s".' % groep)

    # --- publicatie: het adres waarop de site staat
    pub = g.setdefault('publicatie', {})
    basis = pub.get('basis_url', '')
    if not basis.startswith('https://') or not basis.endswith('/'):
        raise Bouwfout('publicatie.basis_url moet het volledige adres van de site zijn, '
                       'beginnen met https:// en eindigen op een /. Bijvoorbeeld "https://www.rerootcoaching.com/".')
    pub['basis_pad'] = urlparse(basis).path or '/'
    pub['deelbeeld_url'] = basis + pub.get('deelbeeld', 'assets/deelbeeld.jpg')
    _controleer_foto(pub.get('deelbeeld', 'assets/deelbeeld.jpg'), 'deelbeeld voor sociale media')

    # --- openingsuren
    dagen = g['openingsuren']['dagen']
    for d in dagen:
        d['gesloten'] = not (d.get('open') and d.get('sluit'))
        if d['gesloten']:
            d['links_pct'], d['breedte_pct'], d['tekst'] = '0', '0', 'Gesloten'
            continue
        a, b = _minuten(d['open'], d['dag']), _minuten(d['sluit'], d['dag'])
        if b <= a:
            raise Bouwfout('Bij %s ligt het sluitingsuur niet na het openingsuur.' % d['dag'])
        d['links_pct'] = '%.2f' % (a / 1440 * 100)
        d['breedte_pct'] = '%.2f' % ((b - a) / 1440 * 100)
        d['tekst'] = '%s – %s' % (d['open'], d['sluit'])
    open_dagen = [d for d in dagen if not d['gesloten']]
    gelijk = len(open_dagen) == len(dagen) and len({(d['open'], d['sluit']) for d in dagen}) == 1
    if gelijk:
        o, s = dagen[0]['open'], dagen[0]['sluit']
        uren = {
            'elke_dag_gelijk': True, 'open': o, 'sluit': s,
            'kort': '%s–%s' % (o, s),
            'kort_bijschrift': 'Open, 7 dagen per week',
            'zin': 'Elke dag van %s tot %s' % (o, s),
            'zin_klein': 'elke dag van %s tot %s' % (o, s),
            'zin_open': 'Elke dag open van %s tot %s' % (o, s),
        }
    else:
        uren = {
            'elke_dag_gelijk': False, 'open': '', 'sluit': '',
            'kort': 'Wisselende uren',
            'kort_bijschrift': 'Bekijk de uren per dag',
            'zin': 'Open volgens de openingsuren',
            'zin_klein': 'volgens de openingsuren',
            'zin_open': 'Open volgens de openingsuren',
        }
    uren['dagen'] = dagen
    g['uren'] = uren

    # --- club
    merken = g['club']['merken']
    g['club']['merken_zin'] = (', '.join(merken[:-1]) + ' en ' + merken[-1]) if len(merken) > 1 else ''.join(merken)
    kort = merken[:3]
    g['club']['merken_kort'] = (', '.join(kort[:-1]) + ' en ' + kort[-1]) if len(kort) > 1 else ''.join(kort)

    # --- aanbod: elke knop krijgt een bestemming die bestaat
    onderwerpen = []
    lijst = []
    for sleutel, a in g['aanbod'].items():
        for veld in ('naam', 'prijs', 'eenheid', 'checkout_url', 'knoptekst_kopen', 'beschrijving'):
            if veld not in a:
                raise Bouwfout('Bij aanbod "%s" ontbreekt het veld "%s".' % (sleutel, veld))
        if not re.match(r'^\d+([.,]\d{1,2})?$', a['prijs']):
            raise Bouwfout('De prijs van "%s" moet een bedrag zijn zonder euroteken, bv. "35".' % a['naam'])
        if not _url_ok(a['checkout_url']):
            raise Bouwfout('checkout_url van "%s" moet beginnen met https:// of leeg zijn.' % a['naam'])
        a['sleutel'] = _slug(sleutel)
        a['aanvraag_url'] = 'contact.html?onderwerp=%s#formulier' % a['sleutel']
        if a['checkout_url']:
            a['kan_kopen'] = True
            a['actie_url'] = a['checkout_url']
            a['actie_tekst'] = a['knoptekst_kopen']
            a['actie_attr'] = ' target="_blank" rel="noopener"'
        else:
            a['kan_kopen'] = False
            a['actie_url'] = a['aanvraag_url']
            a['actie_tekst'] = 'Vraag %s aan' % a['naam']
            a['actie_attr'] = ''
        lijst.append(a)
        onderwerpen.append({'sleutel': a['sleutel'], 'tekst': a['naam']})
    g['aanbod_lijst'] = lijst
    onderwerpen.insert(0, {'sleutel': 'kennismaking', 'tekst': 'Een intakegesprek'})
    onderwerpen.append({'sleutel': 'freteffect', 'tekst': 'Het Freteffect (bodybuilding met Kevin)'})
    onderwerpen.append({'sleutel': 'anders', 'tekst': 'Ik weet het nog niet / iets anders'})
    g['onderwerpen'] = onderwerpen
    g['kennismaking'] = {
        'url': 'contact.html?onderwerp=kennismaking#formulier',
        'knoptekst': g.get('intakegesprek', {}).get('knoptekst', 'Boek je intakegesprek nu'),
        'knoptekst_kort': g.get('intakegesprek', {}).get('knoptekst_kort', 'Boek intake'),
    }

    # --- links
    for naam, url in g['links'].items():
        if naam.startswith('uitleg') or naam.endswith('knoptekst'):
            continue
        if not _url_ok(url):
            raise Bouwfout('De link "%s" moet beginnen met https:// of leeg zijn.' % naam)
    if not _url_ok(g['formulier'].get('verzend_url', '')):
        raise Bouwfout('formulier.verzend_url moet beginnen met https:// of leeg zijn.')

    # --- coaches, merch: foto's moeten bestaan
    sociale = []
    for c in g['coaches']:
        _controleer_foto(c['foto'], 'coach %s' % c['naam'])
        sociale.extend(c.get('sociale_links', []))
    g['coach_links'] = sociale
    g['coach_op_naam'] = {c['naam'].lower(): c for c in g['coaches']}
    g['coach_namen'] = ' en '.join(c['naam'] for c in g['coaches'])
    g['merch']['artikels'] = [m for m in g['merch']['artikels']]
    for m in g['merch']['artikels']:
        _controleer_foto(m['foto'], 'merch "%s"' % m['naam'])
        if not _url_ok(m.get('checkout_url', '')):
            raise Bouwfout('checkout_url van merch "%s" moet beginnen met https:// of leeg zijn.' % m['naam'])
    g['merch']['zichtbaar'] = bool(g['merch'].get('tonen')) and bool(g['merch']['artikels'])

    # --- reviews
    r = g['reviews']
    r['zichtbaar'] = [c for c in r['citaten'] if c.get('tonen')]
    r['heeft_citaten'] = bool(r['zichtbaar'])

    # --- structured data voor zoekmachines (alleen bevestigde gegevens)
    ld = {
        '@context': 'https://schema.org',
        '@type': 'HealthClub',
        'name': g['bedrijf']['naam'],
        'url': basis,
        'image': pub['deelbeeld_url'],
        'sameAs': [u for u in (g['links'].get('instagram'), g['links'].get('tiktok')) if u],
        'telephone': g['contact']['telefoon_link'],
        'email': g['contact']['email'],
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': g['adres']['straat'],
            'postalCode': g['adres']['postcode'],
            'addressLocality': g['adres']['gemeente'],
            'addressCountry': 'BE',
        },
        'openingHoursSpecification': [
            {'@type': 'OpeningHoursSpecification', 'dayOfWeek': en, 'opens': d['open'], 'closes': d['sluit']}
            for d, en in zip(dagen, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            if not d['gesloten']
        ],
    }
    g['structured_data'] = _ld(ld)
    g['jaar'] = str(date.today().year)
    return g


def _ld(gegevens):
    return json.dumps(gegevens, ensure_ascii=False).replace('</', '<\\/')


def _controleer_foto(pad, waar):
    if not os.path.isfile(os.path.join(BRON, pad)):
        raise Bouwfout('De foto "%s" (%s) staat niet in de map bron/%s.' % (pad, waar, os.path.dirname(pad)))


# ---------------------------------------------------------------- sjablonen
# {{pad.naar.waarde}}      waarde invullen (veilig gemaakt voor HTML)
# {{{pad.naar.waarde}}}    waarde letterlijk invullen
# {{> naam}}               onderdeel uit bron/onderdelen/naam.html invoegen
# {{#each lijst}} ... {{dit.veld}} ... {{/each}}
# {{#if pad}} ... {{else}} ... {{/if}}

_TOKEN = re.compile(r'\{\{\{\s*(.+?)\s*\}\}\}|\{\{\s*(.+?)\s*\}\}', re.S)


def _ontleed(tekst, naam):
    wortel = []
    stapel = [('wortel', None, wortel, None)]
    pos = 0
    for m in _TOKEN.finditer(tekst):
        doel = stapel[-1][3] if stapel[-1][3] is not None else stapel[-1][2]
        if m.start() > pos:
            doel.append(('tekst', tekst[pos:m.start()]))
        pos = m.end()
        if m.group(1) is not None:
            doel.append(('rauw', m.group(1)))
            continue
        t = m.group(2)
        if t.startswith('!'):
            continue
        if t.startswith('>'):
            doel.append(('onderdeel', t[1:].strip()))
        elif t.startswith('#each '):
            stapel.append(('each', t[6:].strip(), [], None))
        elif t.startswith('#if '):
            stapel.append(('if', t[4:].strip(), [], None))
        elif t == 'else':
            soort, pad, ja, _ = stapel[-1]
            if soort != 'if':
                raise Bouwfout('%s: {{else}} staat niet binnen een {{#if}}.' % naam)
            stapel[-1] = (soort, pad, ja, [])
        elif t in ('/each', '/if'):
            soort, pad, ja, nee = stapel.pop()
            if soort != t[1:]:
                raise Bouwfout('%s: {{%s}} sluit een {{#%s}} af.' % (naam, t, soort))
            ouder = stapel[-1][3] if stapel[-1][3] is not None else stapel[-1][2]
            ouder.append((soort, pad, ja, nee or []))
        else:
            doel.append(('var', t))
    if len(stapel) != 1:
        raise Bouwfout('%s: een {{#%s %s}} is niet afgesloten.' % (naam, stapel[-1][0], stapel[-1][1]))
    if pos < len(tekst):
        wortel.append(('tekst', tekst[pos:]))
    return wortel


_ONBEKEND = object()


def _zoek(pad, scopes):
    delen = pad.split('.')
    for scope in reversed(scopes):
        if delen[0] in scope:
            waarde = scope[delen[0]]
            for d in delen[1:]:
                if isinstance(waarde, dict) and d in waarde:
                    waarde = waarde[d]
                else:
                    return _ONBEKEND
            return waarde
    return _ONBEKEND


class Sjablonen:
    def __init__(self, map_onderdelen):
        self.map = map_onderdelen
        self.cache = {}

    def onderdeel(self, naam):
        if naam not in self.cache:
            pad = os.path.join(self.map, naam + '.html')
            if not os.path.isfile(pad):
                raise Bouwfout('Onderdeel "%s" bestaat niet (verwacht: bron/onderdelen/%s.html).' % (naam, naam))
            with open(pad, encoding='utf-8') as f:
                self.cache[naam] = _ontleed(f.read(), 'bron/onderdelen/%s.html' % naam)
        return self.cache[naam]

    def toon(self, knopen, scopes, naam):
        uit = []
        for k in knopen:
            soort = k[0]
            if soort == 'tekst':
                uit.append(k[1])
            elif soort in ('var', 'rauw'):
                w = _zoek(k[1], scopes)
                if w is _ONBEKEND or isinstance(w, (dict, list)):
                    raise Bouwfout('%s: "{{%s}}" bestaat niet in gegevens/site.json. Kijk na op typfouten.' % (naam, k[1]))
                uit.append(str(w) if soort == 'rauw' else html.escape(str(w), quote=True))
            elif soort == 'onderdeel':
                uit.append(self.toon(self.onderdeel(k[1]), scopes, 'bron/onderdelen/%s.html' % k[1]))
            elif soort == 'if':
                w = _zoek(k[1], scopes)
                tak = k[2] if (w is not _ONBEKEND and w) else k[3]
                uit.append(self.toon(tak, scopes, naam))
            elif soort == 'each':
                w = _zoek(k[1], scopes)
                if w is _ONBEKEND or not isinstance(w, list):
                    raise Bouwfout('%s: "{{#each %s}}" verwijst niet naar een lijst in gegevens/site.json.' % (naam, k[1]))
                for i, item in enumerate(w):
                    scope = {'dit': item, 'nummer': i + 1, 'eerste': i == 0, 'laatste': i == len(w) - 1}
                    uit.append(self.toon(k[2], scopes + [scope], naam))
        return ''.join(uit)


def _voorblad(tekst, naam):
    m = re.match(r'^---\n(.*?)\n---\n', tekst, re.S)
    if not m:
        raise Bouwfout('%s: bovenaan ontbreekt het blokje tussen --- met titel en beschrijving.' % naam)
    meta = {}
    for regel in m.group(1).splitlines():
        if ':' in regel:
            k, v = regel.split(':', 1)
            meta[k.strip()] = v.strip()
    for veld in ('titel', 'beschrijving'):
        if not meta.get(veld):
            raise Bouwfout('%s: "%s" ontbreekt in het blokje bovenaan.' % (naam, veld))
    return meta, tekst[m.end():]


# ---------------------------------------------------------------- artikels

def lees_artikels():
    """Leest bron/artikels/*.html. Elk bestand begint met een blokje tussen --- met
    titel, beschrijving, soort (artikel of podcast), categorie, volgorde, beeld en spotify."""
    map_artikels = os.path.join(BRON, 'artikels')
    lijst = []
    if not os.path.isdir(map_artikels):
        return lijst
    for bestand in sorted(os.listdir(map_artikels)):
        if not bestand.endswith('.html'):
            continue
        naam = 'bron/artikels/' + bestand
        with open(os.path.join(map_artikels, bestand), encoding='utf-8') as f:
            meta, tekst = _voorblad(f.read(), naam)
        soort = meta.get('soort', 'artikel')
        if soort not in ('artikel', 'podcast'):
            raise Bouwfout('%s: "soort" moet artikel of podcast zijn.' % naam)
        beeld = meta.get('beeld', '')
        if beeld:
            _controleer_foto(beeld, 'artikel "%s"' % meta['titel'])
        spotify = meta.get('spotify', '')
        if spotify and not spotify.startswith('https://open.spotify.com/embed/'):
            raise Bouwfout('%s: "spotify" moet beginnen met https://open.spotify.com/embed/' % naam)
        kort = meta['beschrijving']
        if len(kort) > 180:
            kort = kort[:177].rsplit(' ', 1)[0] + '…'
        try:
            volgorde = int(meta.get('volgorde', '999'))
        except ValueError:
            raise Bouwfout('%s: "volgorde" moet een getal zijn.' % naam)
        lijst.append({
            'bronbestand': bestand, 'url': 'kennisbank-' + bestand,
            'titel': meta['titel'], 'beschrijving': meta['beschrijving'], 'beschrijving_kort': kort,
            'soort': soort, 'is_podcast': soort == 'podcast',
            'categorie': meta.get('categorie', '') or ('Podcast' if soort == 'podcast' else 'Artikel'),
            'volgorde': volgorde, 'beeld': beeld, 'spotify': spotify, 'tekst': tekst,
            'uitgelicht': meta.get('uitgelicht', '').lower() in ('ja', 'true', '1'),
        })
    lijst.sort(key=lambda a: (a['volgorde'], a['titel']))
    return lijst


# ---------------------------------------------------------------- bouwen

def _hash(pad):
    with open(pad, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()[:8]


def bouw(uit=UIT, stil=False, gegevens=None):
    g = verrijk(gegevens if gegevens is not None else lees_gegevens())
    sj = Sjablonen(os.path.join(BRON, 'onderdelen'))
    g['versie'] = {'css': _hash(os.path.join(BRON, 'stijl.css')), 'js': _hash(os.path.join(BRON, 'site.js'))}

    if os.path.isdir(uit):
        shutil.rmtree(uit)
    os.makedirs(uit)
    shutil.copytree(os.path.join(BRON, 'assets'), os.path.join(uit, 'assets'),
                    ignore=shutil.ignore_patterns('.DS_Store'))
    for bestand in ('stijl.css', 'site.js'):
        shutil.copy(os.path.join(BRON, bestand), os.path.join(uit, bestand))

    artikels = lees_artikels()
    g['kennis'] = {
        'artikels': [a for a in artikels if a['soort'] != 'podcast'],
        'afleveringen': [a for a in artikels if a['soort'] == 'podcast'],
    }
    # voor de homepage en de coachingpagina: het uitgelichte artikel en de recentste aflevering
    # (uitgelicht = het artikel met "uitgelicht: ja" bovenaan, anders het eerste in volgorde)
    uitgelicht = [a for a in g['kennis']['artikels'] if a['uitgelicht']] or g['kennis']['artikels']
    g['kennis']['uitgelicht'] = uitgelicht[:1]
    g['kennis']['recentste_aflevering'] = g['kennis']['afleveringen'][:1]
    basis = g['publicatie']['basis_url']
    indexeren = bool(g['publicatie'].get('zoekmachines_toelaten'))

    map_paginas = os.path.join(BRON, 'paginas')
    gebouwd = []
    for bestand in sorted(os.listdir(map_paginas)):
        if not bestand.endswith('.html'):
            continue
        naam = 'bron/paginas/' + bestand
        with open(os.path.join(map_paginas, bestand), encoding='utf-8') as f:
            meta, inhoud = _voorblad(f.read(), naam)
        sleutel = bestand[:-5]
        pagina = {
            'sleutel': sleutel, 'bestand': bestand,
            'titel': meta['titel'], 'beschrijving': meta['beschrijving'],
            'is_home': sleutel == 'index', 'is_404': sleutel == '404',
            'url': basis + ('' if sleutel == 'index' else bestand),
            'ld': g['structured_data'] if sleutel == 'index' else '',
        }
        pagina['indexeren'] = indexeren and not pagina['is_404']
        scopes = [g, {'pagina': pagina, 'actief': {sleutel.replace('-', '_'): True}}]
        pagina_html = sj.toon(_ontleed(inhoud, naam), scopes, naam)
        scopes.append({'inhoud': pagina_html})
        volledig = sj.toon(sj.onderdeel('basis'), scopes, 'bron/onderdelen/basis.html')
        with open(os.path.join(uit, bestand), 'w', encoding='utf-8') as f:
            f.write(volledig)
        gebouwd.append(bestand)
    # elk artikel en elke podcastaflevering krijgt een eigen pagina
    for a in artikels:
        naam = 'bron/artikels/' + a['bronbestand']
        andere = [x for x in artikels if x is not a and x['soort'] == a['soort']][:2]
        pagina = {
            'sleutel': 'kennisbank', 'bestand': a['url'],
            'titel': '%s | Kennisbank | Reroot' % a['titel'],
            'beschrijving': a['beschrijving_kort'], 'is_home': False, 'is_404': False,
            'url': basis + a['url'], 'indexeren': indexeren,
            'ld': _ld({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': basis},
                {'@type': 'ListItem', 'position': 2, 'name': 'Kennisbank', 'item': basis + 'kennisbank.html'},
                {'@type': 'ListItem', 'position': 3, 'name': a['titel'], 'item': basis + a['url']}]}),
        }
        scopes = [g, {'pagina': pagina, 'actief': {'kennisbank': True}, 'artikel': a, 'verder_lezen': andere}]
        tekst_html = sj.toon(_ontleed(a['tekst'], naam), scopes, naam)
        scopes.append({'artikel_tekst': tekst_html})
        pagina_html = sj.toon(sj.onderdeel('artikel'), scopes, 'bron/onderdelen/artikel.html')
        scopes.append({'inhoud': pagina_html})
        volledig = sj.toon(sj.onderdeel('basis'), scopes, 'bron/onderdelen/basis.html')
        with open(os.path.join(uit, a['url']), 'w', encoding='utf-8') as f:
            f.write(volledig)
        gebouwd.append(a['url'])
    # Oude adressen van de vorige site: een klein doorstuurbestand per adres.
    # GitHub Pages kan zelf niet omleiden; dit werkt op elke eenvoudige webruimte.
    omleidingen = dict(g.get('omleidingen', {}))
    for a in artikels:
        omleidingen['content/' + a['bronbestand'][:-5]] = a['url']
    g['omleidingen_lijst'] = sorted(omleidingen.items())
    for oud, nieuw in omleidingen.items():
        doelbestand = nieuw.split('#')[0].split('?')[0]
        if doelbestand not in gebouwd:
            raise Bouwfout('Omleiding "%s": de pagina "%s" bestaat niet.' % (oud, doelbestand))
        if not re.match(r'^[a-z0-9][a-z0-9/-]*$', oud):
            raise Bouwfout('Omleiding "%s": gebruik alleen kleine letters, cijfers, - en /.' % oud)
        doel_pad = html.escape(g['publicatie']['basis_pad'] + nieuw, quote=True)
        os.makedirs(os.path.join(uit, oud), exist_ok=True)
        with open(os.path.join(uit, oud, 'index.html'), 'w', encoding='utf-8') as f:
            f.write('<!DOCTYPE html>\n<html lang="nl-BE">\n<head>\n<meta charset="utf-8">\n'
                    '<title>Deze pagina is verhuisd | %s</title>\n'
                    '<meta name="robots" content="noindex">\n'
                    '<link rel="canonical" href="%s">\n'
                    '<meta http-equiv="refresh" content="0; url=%s">\n</head>\n'
                    '<body>\n<p>Deze pagina is verhuisd. <a href="%s">Ga verder naar de nieuwe pagina</a>.</p>\n</body>\n</html>\n'
                    % (html.escape(g['bedrijf']['naam']), html.escape(basis + doelbestand, quote=True), doel_pad, doel_pad))

    # Sitemap, robots.txt en llms.txt horen bij een site die gevonden mag worden.
    # Op een testadres (zoekmachines_toelaten = false) maken we ze niet: daar zegt elke pagina zelf "noindex".
    if indexeren:
        vandaag = date.today().isoformat()
        urls = [basis + ('' if b == 'index.html' else b) for b in gebouwd if b != '404.html']
        with open(os.path.join(uit, 'sitemap.xml'), 'w', encoding='utf-8') as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                    + ''.join('<url><loc>%s</loc><lastmod>%s</lastmod></url>\n' % (html.escape(u), vandaag) for u in urls)
                    + '</urlset>\n')
        with open(os.path.join(uit, 'robots.txt'), 'w', encoding='utf-8') as f:
            f.write('User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n' % basis)
        with open(os.path.join(uit, 'llms.txt'), 'w', encoding='utf-8') as f:
            f.write(_llms(g, basis))
    if not stil:
        print('Klaar: %d pagina\'s gebouwd in de map "%s".' % (len(gebouwd), os.path.relpath(uit, HIER)))
    return gebouwd


def _llms(g, basis):
    """Korte, feitelijke samenvatting voor AI-assistenten. Alleen gegevens uit site.json."""
    r = ['# %s' % g['bedrijf']['naam'], '',
         '> Fitnessclub in %s. Zelfstandig trainen in de Open Gym of werken met een coach.' % g['adres']['gemeente'], '',
         '- Adres: %s, %s %s, %s' % (g['adres']['straat'], g['adres']['postcode'], g['adres']['gemeente'], g['adres']['land']),
         '- Telefoon: %s' % g['contact']['telefoon'], '- E-mail: %s' % g['contact']['email'],
         '- Openingsuren Health Club: %s' % g['uren']['zin_klein'], '', '## Aanbod', '']
    for a in g['aanbod_lijst']:
        r.append('- %s: € %s %s. %s' % (a['naam'], a['prijs'], a['eenheid'], a['beschrijving']))
    r += ['', '## Pagina\'s', '']
    for naam, b in (('Health Club', 'health-club.html'), ('Coaching', 'coaching.html'), ('Tarieven', 'tarieven.html'),
                    ('Over Reroot', 'over-reroot.html'), ('Kennisbank', 'kennisbank.html'), ('Contact', 'contact.html')):
        r.append('- [%s](%s%s)' % (naam, basis, b))
    return '\n'.join(r) + '\n'


# ---------------------------------------------------------------- bekijken

def _laatste_wijziging():
    nieuwste = max(os.path.getmtime(GEGEVENS), os.path.getmtime(os.path.abspath(__file__)))
    for wortel, _, bestanden in os.walk(BRON):
        for b in bestanden:
            nieuwste = max(nieuwste, os.path.getmtime(os.path.join(wortel, b)))
    return nieuwste


def bekijk(poort=8000):
    import functools
    import http.server

    staat = {'gebouwd': 0.0}

    def herbouw_indien_nodig():
        t = _laatste_wijziging()
        if t > staat['gebouwd']:
            try:
                bouw(stil=True)
                print('Herbouwd.')
            except Bouwfout as e:
                print('\nFOUT, de vorige versie blijft staan:\n%s\n' % e)
            staat['gebouwd'] = t

    pad_prefix = lees_gegevens().get('publicatie', {}).get('basis_url', '')
    pad_prefix = urlparse(pad_prefix).path.rstrip('/') if pad_prefix else ''

    class Handler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            herbouw_indien_nodig()
            # de site werkt lokaal zowel op / als op het pad van het echte adres (bv. /reroot-website/)
            if pad_prefix and (self.path == pad_prefix or self.path.startswith(pad_prefix + '/')):
                self.path = self.path[len(pad_prefix):] or '/'
            doel = self.translate_path(self.path)
            if os.path.isdir(doel):
                doel = os.path.join(doel, 'index.html')
            if not os.path.isfile(doel):
                # net als GitHub Pages: een onbekend adres toont 404.html
                try:
                    with open(os.path.join(UIT, '404.html'), 'rb') as f:
                        inhoud = f.read()
                except OSError:
                    return super().do_GET()
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(inhoud)))
                self.end_headers()
                self.wfile.write(inhoud)
                return
            super().do_GET()

        def end_headers(self):
            self.send_header('Cache-Control', 'no-store')
            super().end_headers()

        def log_message(self, *a):
            pass

    herbouw_indien_nodig()
    handler = functools.partial(Handler, directory=UIT)
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(('127.0.0.1', poort), handler) as server:
        print('De site staat op http://localhost:%d  (stoppen: Ctrl+C)' % poort)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('\nGestopt.')


if __name__ == '__main__':
    try:
        if '--bekijk' in sys.argv:
            poort = 8000
            for a in sys.argv[1:]:
                if a.isdigit():
                    poort = int(a)
            bekijk(poort)
        else:
            bouw()
    except Bouwfout as e:
        print('FOUT: %s' % e)
        sys.exit(1)
