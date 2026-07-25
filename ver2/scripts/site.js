/* AI勉強会 Ver.2 — 最小限のふるまい（依存ライブラリなし） */
(function () {
  'use strict';

  /* --- 読了プログレスバー --- */
  var prog = document.getElementById('prog');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (prog) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- スクロールで要素をふわっと出す --- */
  var rises = document.querySelectorAll('.rise');
  if ('IntersectionObserver' in window && rises.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    rises.forEach(function (el) { io.observe(el); });
    /* 保険：何らかの理由で監視が働かなかった場合も、本文は必ず表示する */
    setTimeout(function () {
      rises.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('in');
      });
    }, 1600);
  } else {
    rises.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- モバイルメニュー --- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- 現在地に応じてナビをハイライト --- */
  var targets = ['roadmap', 'ch1', 'ch2', 'ch3', 'ch4', 'closing']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && targets.length && nav) {
    var links = {};
    nav.querySelectorAll('a').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (a) a.classList.toggle('active', e.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }
})();
