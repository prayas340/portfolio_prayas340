const TAGLINE = 'Building cool things with code.';

export function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  let index = 0;
  let deleting = false;
  let pause = 0;

  function tick() {
    if (pause > 0) {
      pause--;
      requestAnimationFrame(() => setTimeout(tick, 80));
      return;
    }

    if (!deleting) {
      el.textContent = TAGLINE.slice(0, index + 1);
      index++;
      if (index >= TAGLINE.length) {
        deleting = true;
        pause = 40;
      }
    } else {
      el.textContent = TAGLINE.slice(0, index);
      index--;
      if (index < 0) {
        deleting = false;
        index = 0;
        pause = 12;
      }
    }

    const speed = deleting ? 35 : 65;
    setTimeout(tick, speed);
  }

  setTimeout(tick, 800);
}
