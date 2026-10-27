(() => {
  'use strict';
  const config = JSON.parse(document.getElementById('page-config').textContent);
  const allowed = ['en', 'zh-HK', 'ko'];
  const key = 'jia-v12-language';
  const links = [...document.querySelectorAll('[data-language]')];
  // Never inspect navigator.language. A fresh visit always serves English.
  // Only a deliberate language-link click is remembered; v8's key is not reused.
  links.forEach(link => link.addEventListener('click', () => {
    try { localStorage.setItem(key, link.dataset.language); } catch (_) { /* Links still work. */ }
  }));
  if (config.language === 'en') {
    let saved;
    try { saved = localStorage.getItem(key); } catch (_) { /* English is the fallback. */ }
    if (allowed.includes(saved) && saved !== 'en') {
      const target = links.find(link => link.dataset.language === saved);
      if (target) location.replace(target.href);
    }
  }
  const service = document.getElementById('service');
  const preferred = document.getElementById('preferred');
  const sms = document.getElementById('sms-builder');
  const stylist = document.getElementById('stylist');
  const consultation = document.getElementById('consultation');
  const reference = document.getElementById('reference');
  const referenceField = document.getElementById('reference-field');
  const referenceClear = document.getElementById('reference-clear');
  // The enquiry form lives on the home page only; the work page links back to it with ?style=.
  if (sms) {
    function updateSMS() {
      const message = config.sms.replace('{service}', service.value || config.anyService)
        .replace('{time}', preferred.value.trim() || config.timeUnset)
        .replace('{stylist}', stylist.value.trim() || config.stylistUnset)
        .replace('{consultation}', consultation.value)
        .replace('{reference}', reference.value ? config.referenceSentence.replace('{reference}', reference.value) : '');
      // iOS uses &body after the recipient; other handlers use ?body.
      const appleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const href = 'sms:' + config.phone + (appleMobile ? '&body=' : '?body=') + encodeURIComponent(message);
      sms.href = href;
      document.querySelectorAll('a[href^="sms:"]').forEach(link => { link.href = href; });
    }
    function setReference(value) {
      reference.value = value;
      referenceField.hidden = !value;
      updateSMS();
    }
    service.addEventListener('change', updateSMS);
    preferred.addEventListener('input', updateSMS);
    stylist.addEventListener('input', updateSMS);
    consultation.addEventListener('change', updateSMS);
    stylist.addEventListener('change', updateSMS);
    document.querySelectorAll('[data-stylist]').forEach(link => {
      link.addEventListener('click', () => {
        stylist.value = link.dataset.stylist;
        updateSMS();
      });
    });
    referenceClear.addEventListener('click', () => setReference(''));
    document.querySelectorAll('[data-gallery]').forEach(link => {
      link.addEventListener('click', () => setReference(link.dataset.gallery));
    });
    document.querySelectorAll('[data-service]').forEach(link => {
      link.addEventListener('click', () => {
        service.value = link.dataset.service;
        updateSMS();
      });
    });
    let style = '';
    try { style = (new URLSearchParams(location.search).get('style') || '').slice(0, 80); } catch (_) { /* Older browsers: no prefill. */ }
    if (style) setReference(style); else updateSMS();
  }

  // Enhance plain anchor links into keyboard-accessible tabs; no-JS shows all prices.
  const tabs = [...document.querySelectorAll('[data-category]')];
  if (tabs.length) {
    const panels = tabs.map(tab => document.getElementById(tab.dataset.category));
    const tablist = tabs[0].parentElement;
    tablist.setAttribute('role', 'tablist');
    function activate(key, focus = false) {
      tabs.forEach((tab, index) => {
        const active = tab.dataset.category === key;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panels[index].id);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', tab.id);
        panels[index].tabIndex = 0;
        panels[index].hidden = !active;
        if (active && focus) tab.focus();
      });
    }
    const keys = tabs.map(tab => tab.dataset.category);
    const initial = location.hash.slice(1);
    activate(keys.includes(initial) ? initial : keys[0]);
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', event => {
        event.preventDefault();
        activate(tab.dataset.category);
      });
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          activate(tabs[next].dataset.category, true);
        }
      });
    });
    window.addEventListener('hashchange', () => {
      const key = location.hash.slice(1);
      if (keys.includes(key)) activate(key);
    });
  }

  // Presentation only: header shadow, floating booking bar after the first screen, scroll reveals.
  const header = document.getElementById('site-header');
  const bar = document.querySelector('.booking-bar');
  const hero = document.querySelector('.hero, .work-hero');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (bar && hero) bar.classList.toggle('show', hero.getBoundingClientRect().bottom < 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }
})();
