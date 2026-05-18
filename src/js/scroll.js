import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateLangBars } from './github.js';

gsap.registerPlugin(ScrollTrigger);

export function initScroll() {
  const isMobile = window.innerWidth <= 1024 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  let scroll = null;

  if (!isMobile) {
    scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
      multiplier: 0.85,
    });

    scroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop(value) {
        if (arguments.length) {
          scroll.scrollTo(value, { duration: 0, disableLerp: true });
          return value;
        }
        return scroll.scroll?.instance?.scroll?.y ?? 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.querySelector('[data-scroll-container]').style.transform
        ? 'transform'
        : 'fixed',
    });

    ScrollTrigger.addEventListener('refresh', () => scroll.update());
    ScrollTrigger.refresh();
  }

  initRevealAnimations(scroll);
  initCounters(scroll);

  // Handle smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        if (scroll) {
          scroll.scrollTo(target, {
            duration: 1000,
            easing: [0.16, 1, 0.3, 1], // easeOutExpo
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  return scroll;
}

function initRevealAnimations(scroll) {
  const scrollerElement = scroll ? '[data-scroll-container]' : window;

  gsap.utils.toArray('.split-line').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        scroller: scrollerElement,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.utils.toArray('.split-chars').forEach((el) => {
    const text = el.textContent;
    el.innerHTML = '';
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      el.appendChild(span);
    });

    gsap.to(el.querySelectorAll('.char'), {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        scroller: scrollerElement,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.utils.toArray('.stack__item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      y: 50,
      duration: 0.7,
      delay: i * 0.04,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        scroller: scrollerElement,
        start: 'top 92%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      duration: 0.9,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        scroller: scrollerElement,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  ScrollTrigger.create({
    trigger: '#github',
    scroller: scrollerElement,
    start: 'top 70%',
    onEnter: animateLangBars,
    once: true,
  });

  gsap.from('.github__panel', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.github__panel',
      scroller: scrollerElement,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
}

function initCounters(scroll) {
  const scrollerElement = scroll ? '[data-scroll-container]' : window;

  document.querySelectorAll('.stat__number').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);

    ScrollTrigger.create({
      trigger: el,
      scroller: scrollerElement,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = Math.round(this.targets()[0].val);
            },
          }
        );
      },
    });
  });
}
