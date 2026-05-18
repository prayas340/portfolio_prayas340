const STACK = [
  { name: 'Python', icon: '🐍' },
  { name: 'HTML5', icon: '🌐' },
  { name: 'C', icon: '⚙️' },
  { name: 'Rust', icon: '🦀' },
  { name: 'MySQL', icon: '🗄️' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'SQLite', icon: '📦' },
  { name: 'Google Cloud', icon: '☁️' },
  { name: 'Azure', icon: '🔷' },
  { name: 'Anaconda', icon: '🔬' },
  { name: 'After Effects', icon: '🎬' },
  { name: 'GitHub', icon: '🐙' },
];

export function renderStack() {
  const grid = document.getElementById('stack-grid');
  if (!grid) return;

  grid.innerHTML = STACK.map(
    (item) => `
    <div class="stack__item" data-scroll data-scroll-speed="0.05">
      <span class="stack__icon">${item.icon}</span>
      <span class="stack__name">${item.name}</span>
    </div>
  `
  ).join('');
}
