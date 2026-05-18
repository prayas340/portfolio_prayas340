export function initMagnetic() {
  if ('ontouchstart' in window) return;

  const elements = document.querySelectorAll('[data-magnetic]');

  elements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = el.classList.contains('btn') ? 0.25 : 0.35;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
