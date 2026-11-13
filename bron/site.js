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
    if ('IntersectionObserver' in window) {
      var kijker = new IntersectionObserver(function (items) {
        if (items[0].isIntersecting) { kijker.disconnect(); laad(); }
      }, { rootMargin: '600px' });
      kijker.observe(live);
      // vangnet: laad de widget hoe dan ook kort nadat de pagina klaar is
      window.addEventListener('load', function () { setTimeout(laad, 3500); });
    } else { laad(); }
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
      location.href = 'mailto:' + doos.getAttribute('data-email') +
        '?subject=' + encodeURIComponent('Aanvraag via de website: ' + d.onderwerp) +
        '&body=' + encodeURIComponent(tekst);
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
