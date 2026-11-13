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
  if (document.querySelector('.opening') && oud[hash]) { location.replace(oud[hash]); return; }

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
      kop.textContent = 'Vraag een kennismaking aan';
      intro.textContent = 'Laat je naam en e-mailadres achter. Een van de coaches neemt persoonlijk contact op om een moment af te spreken. De kennismaking is vrijblijvend.';
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
