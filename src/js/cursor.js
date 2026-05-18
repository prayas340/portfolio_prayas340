export function initCursor() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('is-touch');
    return;
  }

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  const magneticTargets = document.querySelectorAll('a, button, [data-magnetic]');

  magneticTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }

  animateRing();
}
