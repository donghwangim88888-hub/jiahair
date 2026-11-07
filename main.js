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

  // Christmas offers: each part shows only before its data-until date in Sydney, so it disappears on its own.
  const timed = document.querySelectorAll('[data-until]');
  if (timed.length) {
    let today;
    try {
      today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch (_) {
      today = new Date().toISOString().slice(0, 10);
    }
    timed.forEach(el => { el.hidden = !(today < el.dataset.until); });
  }
  const xmasToggle = document.querySelector('.xmas-toggle');
  if (xmasToggle && !xmasToggle.closest('.xmas').hidden) {
    // While the offers run, the logo wears a Santa hat (style.css).
    document.documentElement.classList.add('xmas-on');
    const panel = document.getElementById(xmasToggle.getAttribute('aria-controls'));
    const more = xmasToggle.querySelector('.xmas-more');
    function setOpen(open) {
      xmasToggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      more.textContent = open ? xmasToggle.dataset.less : xmasToggle.dataset.more;
    }
    xmasToggle.addEventListener('click', () => setOpen(xmasToggle.getAttribute('aria-expanded') !== 'true'));
    // The card on the hero photo opens the same panel and brings it into view.
    const card = document.querySelector('.xmas-card');
    if (card) card.addEventListener('click', () => {
      setOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      xmasToggle.focus({ preventScroll: true });
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
