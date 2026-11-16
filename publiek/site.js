/* Reroot website: klein script zonder afhankelijkheden.
   1. Oude links (#coaching, #tarieven ...) doorsturen naar de nieuwe pagina's.
   2. Mobiel menu sluiten met Escape.
   3. Contactformulier: onderwerp vooraf invullen, controleren en verzenden. */
(function () {
  'use strict';

  // 1. oude hash-links van de vorige versie
  var oud = { 'health-club': 'health-club.html', 'coaching': 'coaching.html', 'tarieven': 'tarieven.html',
    'over-reroot': 'over-reroot.html', 'contact': 'contact.html', 'kennisbank': 'kennisbank.html',
    'podcast': 'kennisbank.html#podcast', 'home': 'index.html' };
  var hash = (location.hash || '').slice(1);
  if (document.querySelector('.hero-word') && oud[hash]) { location.replace(oud[hash]); return; }

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

  // 2. menu
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var m = document.querySelector('details.mnav[open]');
    if (m) { m.open = false; m.querySelector('summary').focus(); }
  });

  // 2b. live Google-reviews: de widget wordt pas geladen als de bezoeker in de buurt komt
  var live = document.querySelector('[data-live-reviews]');
  if (live) {
    var laad = function () {
      if (document.getElementById('EmbedSocialHashtagScript')) return;
      var js = document.createElement('script');
      js.id = 'EmbedSocialHashtagScript';
      js.src = 'https://embedsocial.com/cdn/ht.js';
      document.head.appendChild(js);
    };
    var gedaan = false;
    var nabij = function () {
      if (gedaan) return;
      if (live.getBoundingClientRect().top < window.innerHeight + 900) {
        gedaan = true;
        window.removeEventListener('scroll', nabij);
        laad();
      }
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (items, kijker) {
        if (items[0].isIntersecting) { kijker.disconnect(); gedaan = true; laad(); }
      }, { rootMargin: '900px' }).observe(live);
    }
    // vangnet voor browsers waar de kijker niet afgaat
    window.addEventListener('scroll', nabij, { passive: true });
    nabij();
  }

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
  var standaardKop = kop ? kop.textContent : '';
  function pasKopAan() {
    if (!kop || !intro) return;
    var w = keuze.value, naam = keuze.options[keuze.selectedIndex].text;
    if (w === 'kennismaking') {
      kop.textContent = 'Vraag een intakegesprek aan';
      intro.textContent = 'Dit is een aanvraag, nog geen afspraak. Een van de coaches neemt contact met je op om een moment af te spreken. In het gesprek bespreken jullie je doel, je trainingservaring en hoe je week eruitziet.';
    } else if (w === 'freteffect') {
      kop.textContent = 'Vraag een intakegesprek aan bij Het Freteffect';
      intro.textContent = 'Vertel kort waar je nu staat en waar je naartoe wil. Dit is een aanvraag, nog geen afspraak: we nemen contact met je op om een moment af te spreken.';
    } else if (w && w !== 'anders') {
      kop.textContent = 'Je vraag over ' + naam;
      intro.textContent = 'Stel je vraag of vertel kort wat je zoekt. Een van de coaches antwoordt je persoonlijk.';
    } else {
      kop.textContent = standaardKop;
      intro.textContent = '';
    }
    intro.hidden = !intro.textContent;
  }
  keuze.addEventListener('change', pasKopAan);
  pasKopAan();

  function toon(id, aan) {
    var el = document.getElementById(id);
    if (!el) return;
    if (aan) el.setAttribute('data-toon', ''); else el.removeAttribute('data-toon');
  }

  function controleer(veld) {
    var ok = veld.checkValidity();
    var vak = veld.closest('.fld');
    if (vak) vak.classList.toggle('fout', !ok);
    veld.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  var verplicht = form.querySelectorAll('[required]');
  for (var j = 0; j < verplicht.length; j++) {
    verplicht[j].addEventListener('blur', function () { controleer(this); });
    verplicht[j].addEventListener('change', function () { controleer(this); });
  }

  function gegevens() {
    return {
      voornaam: form.elements.voornaam.value.trim(),
      email: form.elements.email.value.trim(),
      telefoon: form.elements.telefoon.value.trim(),
      onderwerp: keuze.options[keuze.selectedIndex].text,
      bericht: form.elements.bericht.value.trim()
    };
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
        'Onderwerp: ' + d.onderwerp + '\nNaam: ' + d.voornaam + '\nE-mail: ' + d.email +
        (d.telefoon ? '\nTelefoon: ' + d.telefoon : '') + '\n';
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
      body: JSON.stringify(d)
    }).then(function (antwoord) {
      if (!antwoord.ok) throw new Error('status ' + antwoord.status);
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
