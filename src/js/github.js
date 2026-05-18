const FALLBACK_LANGS = [
  { name: 'Python', pct: 72, color: '#3572A5' },
  { name: 'HTML', pct: 14, color: '#e34c26' },
  { name: 'C', pct: 8, color: '#555555' },
  { name: 'Other', pct: 6, color: '#9b59b6' },
];

export async function initGitHub() {
  const bioEl = document.getElementById('github-bio');
  const avatarEl = document.getElementById('github-avatar');
  const graphEl = document.getElementById('contribution-graph');
  const langBarsEl = document.getElementById('lang-bars');

  try {
    const res = await fetch('https://api.github.com/users/Prayas340');
    if (res.ok) {
      const user = await res.json();
      if (bioEl && user.bio) bioEl.textContent = user.bio;
      else if (bioEl)
        bioEl.textContent = user.public_repos + ' public repositories · Open to collaborate';
      if (avatarEl && user.avatar_url) avatarEl.src = user.avatar_url;
    }
  } catch {
    if (bioEl)
      bioEl.textContent =
        'Python developer · Google Cloud Certified · Building cool things with code.';
  }

  renderContributionGraph(graphEl);
  renderLangBars(langBarsEl, FALLBACK_LANGS);
}

function renderContributionGraph(container) {
  if (!container) return;

  const weeks = 52;
  const days = 7;
  const cells = [];

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const level = Math.random() > 0.55 ? Math.floor(Math.random() * 4) + 1 : 0;
      const cell = document.createElement('div');
      cell.className = 'github__cell';
      cell.dataset.level = String(level);
      cells.push(cell.outerHTML);
    }
  }

  container.innerHTML = cells.join('');
}

function renderLangBars(container, langs) {
  if (!container) return;

  container.innerHTML = langs
    .map(
      (lang) => `
    <div class="lang-bar">
      <div class="lang-bar__header">
        <span>${lang.name}</span>
        <span>${lang.pct}%</span>
      </div>
      <div class="lang-bar__track">
        <div class="lang-bar__fill" style="--pct: ${lang.pct}%; background: linear-gradient(90deg, #00aaff, ${lang.color});"></div>
      </div>
    </div>
  `
    )
    .join('');
}

export function animateLangBars() {
  document.querySelectorAll('.lang-bar__fill').forEach((bar) => {
    bar.classList.add('is-animated');
  });
}
