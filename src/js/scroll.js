import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateLangBars } from './github.js';

gsap.registerPlugin(ScrollTrigger);

export function initScroll() {
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 0.85,
    smartphone: { smooth: true },
    tablet: { smooth: true },
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

  initRevealAnimations(scroll);
  initCounters();

  // Handle smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        scroll.scrollTo(target, {
          duration: 1000,
          easing: [0.16, 1, 0.3, 1], // easeOutExpo
        });
      }
    });
  });

  return scroll;
}

function initRevealAnimations(scroll) {
  gsap.utils.toArray('.split-line').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        scroller: '[data-scroll-container]',
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
        scroller: '[data-scroll-container]',
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
        scroller: '[data-scroll-container]',
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
        scroller: '[data-scroll-container]',
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  ScrollTrigger.create({
    trigger: '#github',
    scroller: '[data-scroll-container]',
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
      scroller: '[data-scroll-container]',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });

}

function initCounters() {
  document.querySelectorAll('.stat__number').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);

    ScrollTrigger.create({
      trigger: el,
      scroller: '[data-scroll-container]',
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
