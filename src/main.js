import VanillaTilt from 'vanilla-tilt';
import { initCursor } from './js/cursor.js';
import { initMagnetic } from './js/magnetic.js';
import { initTypewriter } from './js/typewriter.js';
import { initHeroScene } from './js/hero-scene.js';
import { initContactScene } from './js/contact-scene.js';
import { renderStack } from './js/stack.js';
import { initGitHub } from './js/github.js';
import { initScroll } from './js/scroll.js';

function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  VanillaTilt.init(cards, {
    glare: true,
    'max-glare': 0.15,
    scale: 1.02,
  });
}

function initHeroEntrance() {
  document.querySelectorAll('.hero__eyebrow, .hero__title-line, .hero__role').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px)';
    setTimeout(() => {
      el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });

  document.querySelectorAll('.hero__actions a').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 900 + i * 100);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderStack();
  initCursor();
  initMagnetic();
  initTypewriter();
  initHeroScene(document.getElementById('hero-canvas'));
  initContactScene(document.getElementById('contact-canvas'));
  initNav();
  initTilt();
  initHeroEntrance();
  initGitHub();
  initScroll();
});
