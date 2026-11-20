/* Reroot website: klein script zonder afhankelijkheden.
   1. Oude links (#coaching, #tarieven ...) doorsturen naar de nieuwe pagina's.
   2. Mobiel menu sluiten met Escape.
   3. Contactformulier: onderwerp vooraf invullen, controleren en verzenden. */
(function () {
  'use strict';

  // 0. zachte golven: waar een deel een andere achtergrondkleur heeft dan het deel erboven,
  //    rijst het in een glooiing op in plaats van met een rechte lijn (vormen in stijl.css, ".golf").
  //    De opening van de homepage heeft haar eigen golf.
  var vormen = ['golf-a', 'golf-b', 'golf-c'], golfNr = 0;
  Array.prototype.forEach.call(document.querySelectorAll('section.sec'), function (sec) {
    var boven = sec.previousElementSibling;
    if (!boven || boven.tagName !== 'SECTION' || boven.classList.contains('hero')) return;
    if (getComputedStyle(boven).backgroundColor === getComputedStyle(sec).backgroundColor) return;
    sec.classList.add('golf', vormen[golfNr++ % vormen.length]);
    boven.classList.add('voor-golf');
  });

  // 1. oude hash-links van de vorige versie
  var oud = { 'health-club': 'health-club.html', 'coaching': 'coaching.html', 'tarieven': 'tarieven.html',
    'over-reroot': 'over-reroot.html', 'contact': 'contact.html', 'kennisbank': 'kennisbank.html',
    'podcast': 'kennisbank.html#podcast', 'home': 'index.html' };
  var hash = (location.hash || '').slice(1);
  if (document.querySelector('.hero-word') && Object.prototype.hasOwnProperty.call(oud, hash)) { location.replace(oud[hash]); return; }

  // 1b. vaste menubalk: doorzichtig bovenaan de pagina, donker zodra je scrolt
  var balk = document.querySelector('.kop .hero-head');
  // 1c. opening van de homepage: beweging gekoppeld aan het scrollen.
  //     --p loopt van 0 naar 1 terwijl de opening uit beeld schuift.
  var opening = document.querySelector('.hero');
  var beweeg = opening && opening.querySelector('.hero-word') &&
    !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (beweeg) opening.classList.add('hero-scroll');
  // Twee routes: de kop komt woord per woord op en de kaarten schuiven naar elkaar toe, gekoppeld aan het scrollen.
  var routes = document.querySelector('[data-onthul]');
  var rustigNu = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var delen = [];
  if (routes && !rustigNu) {
    var kop = routes.querySelector('.ways-head h2');
    if (kop) {
      var woorden = kop.textContent.trim().split(/\s+/);
      kop.setAttribute('aria-label', kop.textContent.trim());
      kop.innerHTML = '';
      woorden.forEach(function (w, i) {
        var s = document.createElement('span'); s.className = 'w'; s.setAttribute('aria-hidden', 'true'); s.textContent = w;
        kop.appendChild(s); if (i < woorden.length - 1) kop.appendChild(document.createTextNode(' '));
        delen.push({ el: s, start: 0.04 * i, duur: 0.3 });
      });
    }
    var lead = routes.querySelector('.ways-head .lead');
    if (lead) delen.push({ el: lead, start: 0.3, duur: 0.3 });
    Array.prototype.slice.call(routes.querySelectorAll('.way')).forEach(function (k, i) {
      delen.push({ el: k, start: 0.38 + i * 0.08, duur: 0.45 });
    });
    routes.classList.add('onthul');
  }
  var onthul = function () {
    if (!delen.length) return;
    var r = routes.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    // 0 als de bovenkant van de sectie onderaan in beeld komt, 1 als ze tot een kwart van boven geschoven is
    var g = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
    delen.forEach(function (d) {
      var v = Math.min(1, Math.max(0, (g - d.start) / d.duur));
      v = 1 - Math.pow(1 - v, 3);
      d.el.style.setProperty('--v', v.toFixed(3));
    });
  };

  var bezig = false;
  var bijScroll = function () {
    bezig = false;
    var y = window.pageYOffset || 0;
    if (balk) balk.classList.toggle('bovenaan', y < 8 && !document.querySelector('details.mnav[open]'));
    if (beweeg) {
      var p = Math.min(1, Math.max(0, y / (opening.offsetHeight || 1)));
      opening.style.setProperty('--p', p.toFixed(3));
    }
    onthul();
  };
  window.addEventListener('scroll', function () {
    if (!bezig) { bezig = true; window.requestAnimationFrame(bijScroll); }
  }, { passive: true });
  var mnav = document.querySelector('details.mnav');
  if (mnav) mnav.addEventListener('toggle', bijScroll);
  bijScroll();

  // 1d. toestellen op de clubpagina: een cirkel die vanzelf van toestel naar toestel draait.
  //     Pauze bij aanwijzen of focus, en met de pauzeknop. Bij 'minder beweging' draait hij niet vanzelf.
  var tBlok = document.querySelector('[data-toestellen]');
  if (tBlok) (function () {
    var cirkel = tBlok.querySelector('.toestel-cirkel');
    var dias = Array.prototype.slice.call(tBlok.querySelectorAll('.toestel-dia'));
    if (!cirkel || dias.length < 2) return;
    var ring = tBlok.querySelector('.toestel-ring');
    var naam = tBlok.querySelector('[data-toestel-naam]');
    var groep = tBlok.querySelector('[data-toestel-groep]');
    var uitleg = tBlok.querySelector('[data-toestel-uitleg]');
    var nr = tBlok.querySelector('[data-toestel-nr]');
    var pauzeKnop = tBlok.querySelector('[data-toestel="pauze"]');
    var stil = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var twee = function (n) { return (n < 10 ? '0' : '') + n; };
    var huidig = -1, spelen = !stil, vast = false, zichtbaar = false, duur = 4500, t = 0, vorige = 0;
    tBlok.classList.add('js-toestel');
    tBlok.querySelector('.toestel-knoppen').hidden = false;
    tBlok.querySelector('[data-toestel-totaal]').textContent = twee(dias.length);
    var zet = function (i) {
      if (i === huidig) return;
      huidig = i;
      var fc = dias[i].querySelector('figcaption');
      naam.textContent = fc.querySelector('b').textContent;
      if (groep) groep.textContent = fc.querySelector('.toestel-g').textContent;
      if (uitleg) uitleg.textContent = fc.querySelector('.toestel-u').textContent;
      nr.textContent = twee(i + 1);
      [i + 1, i + 2].forEach(function (k) { var img = dias[k % dias.length].querySelector('img'); if (img) img.loading = 'eager'; });
    };
    var doel = null, doelKlok = 0;
    var ga = function (i) {
      i = (i + dias.length) % dias.length;
      doel = i; clearTimeout(doelKlok); doelKlok = setTimeout(function () { doel = null; }, 1200);
      cirkel.scrollTo({ left: i * cirkel.clientWidth, behavior: stil ? 'auto' : 'smooth' });
      zet(i); t = 0;
    };
    cirkel.addEventListener('scroll', function () {
      var i = Math.min(dias.length - 1, Math.max(0, Math.round(cirkel.scrollLeft / (cirkel.clientWidth || 1))));
      if (doel !== null) { if (i === doel) doel = null; return; }  // tijdens een geplande overgang de tussenstanden negeren
      zet(i);
    }, { passive: true });
    cirkel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); ga(huidig + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ga(huidig - 1); }
    });
    var toonPauze = function () {
      pauzeKnop.setAttribute('aria-label', spelen ? 'Pauzeer de cirkel' : 'Laat de cirkel draaien');
      pauzeKnop.firstElementChild.textContent = spelen ? '❙❙' : '▶';
    };
    tBlok.addEventListener('click', function (e) {
      var k = e.target.closest('[data-toestel]');
      if (!k) return;
      var w = k.getAttribute('data-toestel');
      if (w === 'vorige') ga(huidig - 1);
      if (w === 'volgende') ga(huidig + 1);
      if (w === 'pauze') { spelen = !spelen; toonPauze(); }
    });
    ring.addEventListener('mouseenter', function () { vast = true; });
    ring.addEventListener('mouseleave', function () { vast = false; });
    cirkel.addEventListener('focusin', function () { vast = true; });
    cirkel.addEventListener('focusout', function () { vast = false; });
    cirkel.addEventListener('touchstart', function () { t = 0; }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { zichtbaar = es[0].isIntersecting; }, { threshold: 0.4 }).observe(ring);
    } else { zichtbaar = true; }
    var tik = function (nu) {
      var dt = vorige ? nu - vorige : 0; vorige = nu;
      if (spelen && !vast && zichtbaar && !document.hidden) {
        t += dt / duur;
        if (t >= 1) ga(huidig + 1);
      }
      ring.style.setProperty('--t', (spelen ? Math.min(1, t) : 0).toFixed(3));
      window.requestAnimationFrame(tik);
    };
    zet(0); toonPauze();
    window.requestAnimationFrame(tik);
  })();

  // 2. menu
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var m = document.querySelector('details.mnav[open]');
    if (m) { m.open = false; m.querySelector('summary').focus(); }
  });

  // 2b. diensten van anderen (Google-reviews via EmbedSocial, Spotify-speler) laden pas na een klik.
  // Zo plaatst de site zelf geen cookies van derden zonder dat de bezoeker erom vraagt, en is geen cookiebanner nodig.
  var revPoort = document.querySelector('[data-poort-reviews]');
  if (revPoort) {
    revPoort.querySelector('[data-poort-knop]').addEventListener('click', function () {
      revPoort.hidden = true;
      if (document.getElementById('EmbedSocialHashtagScript')) return;
      var js = document.createElement('script');
      js.id = 'EmbedSocialHashtagScript';
      js.src = 'https://embedsocial.com/cdn/ht.js';
      document.head.appendChild(js);
    });
  }
  var spelers = document.querySelectorAll('[data-poort-speler]');
  for (var sp = 0; sp < spelers.length; sp++) (function (poort) {
    poort.querySelector('[data-poort-knop]').addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.className = 'art-speler';
      f.src = poort.getAttribute('data-poort-speler');
      f.title = poort.getAttribute('data-poort-titel');
      f.height = poort.getAttribute('data-poort-hoogte') || '232';
      f.allow = 'clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      poort.parentNode.replaceChild(f, poort);
      f.focus();
    });
  })(spelers[sp]);

  // 2c. de club in drie beelden: op desktop één vast beeldvlak dat wisselt tijdens het scrollen.
  // Zonder dit script, op smalle schermen en bij 'minder beweging' blijven het drie gewone beelden met tekst.
  var scene = document.querySelector('[data-scene]');
  if (scene && 'IntersectionObserver' in window && window.matchMedia) {
    var stage = scene.querySelector('.scene-stage');
    var items = Array.prototype.slice.call(scene.querySelectorAll('.scene-item'));
    var figs = items.map(function (it) { return it.querySelector('.scene-fig'); });
    var teller = scene.querySelector('[data-scene-nr]');
    var breed = window.matchMedia('(min-width:1000px)');
    var rustig = window.matchMedia('(prefers-reduced-motion: reduce)');
    var aan = false, kapot = false, sceneKijker = null;

    var actief = function (i) {
      items.forEach(function (it, k) {
        it.classList.toggle('is-actief', k === i);
        figs[k].classList.toggle('is-actief', k === i);
      });
      if (teller) teller.textContent = '0' + (i + 1);
    };
    var zetAan = function () {
      aan = true;
      figs.forEach(function (f) { f.querySelector('img').loading = 'eager'; stage.appendChild(f); });
      scene.classList.add('scene-aan');
      actief(0);
      // actief is het onderdeel dat het midden van het scherm kruist; terugscrollen werkt dus vanzelf omgekeerd
      sceneKijker = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) actief(items.indexOf(e.target)); });
      }, { rootMargin: '-50% 0px -50% 0px' });
      items.forEach(function (it) { sceneKijker.observe(it); });
    };
    var zetUit = function () {
      aan = false;
      if (sceneKijker) sceneKijker.disconnect();
      scene.classList.remove('scene-aan');
      items.forEach(function (it, k) {
        it.insertBefore(figs[k], it.firstChild);
        it.classList.remove('is-actief');
        figs[k].classList.remove('is-actief');
      });
    };
    var kies = function () {
      var wil = breed.matches && !rustig.matches && !kapot;
      if (wil && !aan) zetAan(); else if (!wil && aan) zetUit();
    };
    // laadt een beeld niet, dan vallen we terug op de gewone weergave
    figs.forEach(function (f) { f.querySelector('img').addEventListener('error', function () { kapot = true; kies(); }); });
    [breed, rustig].forEach(function (mq) {
      if (mq.addEventListener) mq.addEventListener('change', kies); else if (mq.addListener) mq.addListener(kies);
    });
    kies();
  }

  // 2d. reviewslider: alle Google-reviews, drie tegelijk (op de computer). Schuift om de 6 seconden door,
  //     pauzeert bij aanwijzen, focus of aanraken, stopt zodra de bezoeker zelf schuift, en draait niet vanzelf
  //     bij 'minder beweging'. Data zoals op Google ("3 maanden geleden"), lange teksten met "Meer lezen".
  (function () {
    var rv = document.querySelector('[data-rv]');
    if (!rv) return;
    var baan = rv.querySelector('[data-rv-baan]');
    var kaarten = baan.children;
    var teller = rv.querySelector('[data-rv-teller]');
    var totaal = kaarten.length;

    // datums zoals Google ze toont
    var nu = new Date();
    Array.prototype.forEach.call(rv.querySelectorAll('[data-rv-datum]'), function (t) {
      var d = new Date(t.getAttribute('datetime') + 'T12:00:00');
      if (isNaN(d)) return;
      var dagen = Math.floor((nu - d) / 864e5);
      var maanden = (nu.getFullYear() - d.getFullYear()) * 12 + nu.getMonth() - d.getMonth() - (nu.getDate() < d.getDate() ? 1 : 0);
      var tekst;
      if (dagen < 1) tekst = 'vandaag';
      else if (dagen < 7) tekst = dagen === 1 ? 'een dag geleden' : dagen + ' dagen geleden';
      else if (maanden < 1) tekst = Math.floor(dagen / 7) === 1 ? 'een week geleden' : Math.floor(dagen / 7) + ' weken geleden';
      else if (maanden < 12) tekst = maanden === 1 ? 'een maand geleden' : maanden + ' maanden geleden';
      else tekst = Math.floor(maanden / 12) === 1 ? 'een jaar geleden' : Math.floor(maanden / 12) + ' jaar geleden';
      t.title = t.textContent;
      t.textContent = tekst;
    });

    // "Meer lezen" alleen waar de tekst echt afgekapt is
    function meerKnoppen() {
      Array.prototype.forEach.call(rv.querySelectorAll('[data-rv-tekst]'), function (tk) {
        var knop = tk.nextElementSibling;
        if (!knop || tk.parentNode.classList.contains('open')) return;
        knop.hidden = tk.scrollHeight <= tk.clientHeight + 2;
      });
    }
    rv.addEventListener('click', function (e) {
      var knop = e.target.closest('[data-rv-meer]');
      if (!knop) return;
      var open = knop.parentNode.classList.toggle('open');
      knop.textContent = open ? 'Minder' : 'Meer lezen';
      knop.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    function stap() {
      var k = kaarten[0];
      return k ? k.getBoundingClientRect().width + parseFloat(getComputedStyle(baan).columnGap || 0) : baan.clientWidth;
    }
    function perKeer() { return Math.max(1, Math.round(baan.clientWidth / stap())); }
    function eerste() { return Math.round(baan.scrollLeft / stap()); }
    function werkTellerBij() {
      var a = eerste() + 1, b = Math.min(totaal, a + perKeer() - 1);
      teller.textContent = (a === b ? 'Review ' + a : 'Reviews ' + a + '–' + b) + ' van ' + totaal;
    }
    function ga(richting) {
      var aanEinde = baan.scrollLeft + baan.clientWidth >= baan.scrollWidth - 4;
      var aanBegin = baan.scrollLeft <= 4;
      if (richting > 0 && aanEinde) baan.scrollTo({ left: 0 });
      else if (richting < 0 && aanBegin) baan.scrollTo({ left: baan.scrollWidth });
      else baan.scrollBy({ left: richting * perKeer() * stap() });
    }

    var gestopt = false, pauze = false, inBeeld = false;
    var pauzeKnop = rv.querySelector('[data-rv-pauze]');
    function stop() {
      gestopt = true;
      if (pauzeKnop) { pauzeKnop.textContent = 'Speel af'; pauzeKnop.setAttribute('aria-pressed', 'true'); }
    }
    // pauzeknop: wie bewegende inhoud wil stilzetten, kan dat altijd (toegankelijkheid)
    if (pauzeKnop) pauzeKnop.addEventListener('click', function () {
      if (gestopt) {
        gestopt = false;
        pauzeKnop.textContent = 'Pauzeer';
        pauzeKnop.setAttribute('aria-pressed', 'false');
      } else stop();
    });
    rv.querySelector('[data-rv-volgende]').addEventListener('click', function () { stop(); ga(1); });
    rv.querySelector('[data-rv-vorige]').addEventListener('click', function () { stop(); ga(-1); });
    baan.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stop(); ga(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); ga(-1); }
    });
    ['touchstart', 'wheel'].forEach(function (s) { baan.addEventListener(s, stop, { passive: true }); });
    rv.addEventListener('mouseenter', function () { pauze = true; });
    rv.addEventListener('mouseleave', function () { pauze = false; });
    rv.addEventListener('focusin', function () { pauze = true; });
    rv.addEventListener('focusout', function () { pauze = false; });

    var wacht;
    baan.addEventListener('scroll', function () { clearTimeout(wacht); wacht = setTimeout(werkTellerBij, 80); }, { passive: true });
    window.addEventListener('resize', function () { werkTellerBij(); meerKnoppen(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(meerKnoppen);
    meerKnoppen();
    werkTellerBij();

    var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rustig || !('IntersectionObserver' in window)) return;
    if (pauzeKnop) pauzeKnop.hidden = false;
    new IntersectionObserver(function (items) { inBeeld = items[0].isIntersecting; }, { threshold: 0.4 }).observe(baan);
    setInterval(function () {
      if (!gestopt && !pauze && inBeeld && !document.hidden) ga(1);
    }, 6000);
  })();

  // 3. formulier
  var doos = document.getElementById('formulier');
  var form = document.getElementById('contactformulier');
  if (!doos || !form) return;

  var keuze = form.elements.onderwerp;
  var gevraagd = new URLSearchParams(location.search).get('onderwerp');
  if (gevraagd) {
    for (var i = 0; i < keuze.options.length; i++) {
      if (keuze.options[i].value === gevraagd) { keuze.selectedIndex = i; break; }
    }
  }

  // kop en uitleg passen zich aan het gekozen onderwerp aan
  var kop = document.getElementById('form-kop');
  var intro = document.getElementById('form-intro');
  var formBlok = document.getElementById('formulier');
  var intakeZin = (formBlok && formBlok.getAttribute('data-intake')) || '';
  var standaardKop = kop ? kop.textContent : '';
  function pasKopAan() {
    if (!kop || !intro) return;
    var w = keuze.value, naam = keuze.options[keuze.selectedIndex].text;
    if (w === 'kennismaking') {
      kop.textContent = 'Vraag een intakegesprek aan';
      intro.textContent = intakeZin + ' Dit is een aanvraag, nog geen afspraak: een van de coaches neemt contact met je op om een moment af te spreken. In het gesprek bespreken jullie je doel, je trainingservaring en hoe je week eruitziet.';
    } else if (w === 'freteffect') {
      kop.textContent = 'Vraag een intakegesprek aan bij Het Freteffect';
      intro.textContent = intakeZin + ' Vertel kort waar je nu staat en waar je naartoe wil. Dit is een aanvraag, nog geen afspraak: we nemen contact met je op om een moment af te spreken.';
    } else if (w && w !== 'anders') {
      kop.textContent = 'Je vraag over ' + naam;
      intro.textContent = 'Stel je vraag of vertel kort wat je zoekt. Een van de coaches antwoordt je persoonlijk.';
    } else {
      kop.textContent = standaardKop;
      intro.textContent = '';
    }
    intro.hidden = !intro.textContent;
    // de vraag naar online of in de studio hoort alleen bij een intakegesprek
    var vkVak = document.getElementById('vk-vak');
    var isIntake = (w === 'kennismaking' || w === 'freteffect');
    if (vkVak) vkVak.hidden = !isIntake;
    // bij een intake bellen we de aanvrager op: dan is het telefoonnummer verplicht
    var tel = form.elements.telefoon, telOpt = document.getElementById('tel-opt'), telHint = document.getElementById('tel-hint');
    if (tel) tel.required = isIntake;
    if (telOpt) telOpt.hidden = isIntake;
    if (telHint) telHint.hidden = !isIntake;
    if (tel && !isIntake) { var tv = tel.closest('.fld'); if (tv) tv.classList.remove('fout'); tel.removeAttribute('aria-invalid'); }
  }
  keuze.addEventListener('change', pasKopAan);
  pasKopAan();

  function toon(id, aan) {
    var el = document.getElementById(id);
    if (!el) return;
    if (aan) el.setAttribute('data-toon', ''); else el.removeAttribute('data-toon');
  }

  function controleer(veld) {
    // een telefoonnummer moet minstens 9 cijfers hebben (0465 07 67 97, +32 465 ...)
    if (veld.name === 'telefoon') {
      var cijfers = veld.value.replace(/\D/g, '').length;
      veld.setCustomValidity(veld.value && cijfers < 9 ? 'Vul een volledig telefoonnummer in.' : '');
    }
    var ok = veld.checkValidity();
    var vak = veld.closest('.fld');
    if (vak) vak.classList.toggle('fout', !ok);
    veld.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  // Welke velden verplicht zijn, hangt af van het onderwerp (telefoon bij een intake); daarom telkens opnieuw opzoeken.
  var teControleren = form.querySelectorAll('input, select, textarea');
  for (var j = 0; j < teControleren.length; j++) {
    teControleren[j].addEventListener('blur', function () { if (this.required || this.value) controleer(this); });
    teControleren[j].addEventListener('change', function () { if (this.required || this.value) controleer(this); });
  }

  function gegevens() {
    var vk = form.elements.voorkeur, vkVak = document.getElementById('vk-vak');
    return {
      voornaam: form.elements.voornaam.value.trim(),
      achternaam: form.elements.achternaam ? form.elements.achternaam.value.trim() : '',
      email: form.elements.email.value.trim(),
      telefoon: form.elements.telefoon.value.trim(),
      onderwerp: keuze.options[keuze.selectedIndex].text,
      intake: keuze.value === 'kennismaking' || keuze.value === 'freteffect',
      voorkeur: (vk && vkVak && !vkVak.hidden) ? (vk.value || 'Maakt niet uit') : '',
      bericht: form.elements.bericht.value.trim()
    };
  }

  // Wat in de mail aan Reroot komt: zo weinig mogelijk blokken, zodat alles in één oogopslag leesbaar is.
  // Naam en telefoon staan ook in de onderwerpregel: zo zie je in je postvak meteen wie je moet bellen.
  function mailVoorReroot(d, sleutel) {
    var naam = d.voornaam + (d.achternaam ? ' ' + d.achternaam : '');
    var soort = d.intake ? 'Intake' : 'Vraag';
    var m = {
      subject: soort + ': ' + naam + (d.telefoon ? ' · ' + d.telefoon : ''),
      from_name: 'Website Reroot',
      replyto: d.email
    };
    m['Contact'] = naam + ' · ' + (d.telefoon || 'geen telefoon') + ' · ' + d.email;
    var wat = d.onderwerp.replace(/^Een /, '');
    m['Aanvraag'] = wat.charAt(0).toUpperCase() + wat.slice(1) + (d.voorkeur ? ' · ' + d.voorkeur : '');
    m['Vraag of doel'] = d.bericht || '-';
    m.botcheck = false;
    if (sleutel) m.access_key = sleutel;
    return m;
  }

  var kopieerknop = document.getElementById('kopieerknop');
  if (kopieerknop) kopieerknop.addEventListener('click', function () {
    var veld = document.getElementById('bericht-kopie');
    var status = document.getElementById('kopie-status');
    function klaar(ok) { status.textContent = ok ? 'Gekopieerd.' : 'Kopiëren lukte niet. Selecteer de tekst en kopieer ze zelf.'; }
    function oud() { veld.focus(); veld.select(); try { klaar(document.execCommand('copy')); } catch (x) { klaar(false); } }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(veld.value).then(function () { klaar(true); }, oud);
    } else { oud(); }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    toon('melding-fout', false);
    toon('melding-mail', false);

    var eersteFout = null;
    var verplicht = form.querySelectorAll('[required], #tel');
    for (var k = 0; k < verplicht.length; k++) {
      if (!controleer(verplicht[k]) && !eersteFout) eersteFout = verplicht[k];
    }
    if (eersteFout) { eersteFout.focus(); return; }
    if (form.elements.website.value) return; // ingevuld lokveld: geen mens

    var d = gegevens();
    var url = doos.getAttribute('data-verzend-url');

    if (!url) {
      // Geen formulierdienst ingesteld: zet een e-mail klaar en zeg eerlijk dat die nog verstuurd moet worden.
      var tekst = 'Dag Reroot,\n\n' + (d.bericht ? d.bericht + '\n\n' : '') +
        'Onderwerp: ' + d.onderwerp + '\nNaam: ' + d.voornaam + (d.achternaam ? ' ' + d.achternaam : '') +
        '\nE-mail: ' + d.email + (d.telefoon ? '\nTelefoon: ' + d.telefoon : '') +
        (d.voorkeur ? '\nVoorkeur gesprek: ' + d.voorkeur : '') + '\n';
      var post = document.createElement('a');
      post.href = 'mailto:' + doos.getAttribute('data-email') +
        '?subject=' + encodeURIComponent('Aanvraag via de website: ' + d.onderwerp) +
        '&body=' + encodeURIComponent(tekst);
      post.style.display = 'none';
      document.body.appendChild(post);
      post.click();
      document.body.removeChild(post);
      var kopie = document.getElementById('bericht-kopie');
      if (kopie) kopie.value = 'Aan: ' + doos.getAttribute('data-email') + '\nOnderwerp: Aanvraag via de website: ' + d.onderwerp + '\n\n' + tekst;
      toon('melding-mail', true);
      return;
    }

    var knop = document.getElementById('verzendknop');
    var label = knop.textContent;
    knop.disabled = true;
    knop.textContent = 'Bezig met verzenden…';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(mailVoorReroot(d, doos.getAttribute('data-sleutel')))
    }).then(function (antwoord) {
      if (!antwoord.ok) throw new Error('status ' + antwoord.status);
      return antwoord.json().catch(function () { return {}; });
    }).then(function (resultaat) {
      // Web3Forms antwoordt met success: true of false; pas bij true is de mail onderweg.
      if (resultaat && resultaat.success === false) throw new Error('geweigerd');
      // Pas nu, nadat de dienst de aanvraag heeft aanvaard, tonen we succes.
      doos.setAttribute('data-status', 'verzonden');
      toon('melding-ok', true);
      document.getElementById('melding-ok').focus();
    }).catch(function () {
      toon('melding-fout', true);
      knop.disabled = false;
      knop.textContent = label;
    });
  });
})();
