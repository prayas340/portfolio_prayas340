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

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday

  // Go back 52 full weeks (364 days) plus the days to get to the Sunday of week 0
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364 - dayOfWeek);

  // 1. Generate month labels dynamically aligned with the columns
  const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsContainer = document.getElementById('month-labels');
  
  if (monthsContainer) {
    monthsContainer.innerHTML = '';
    let prevMonth = -1;
    
    for (let w = 0; w < 53; w++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + w * 7);
      const currentMonth = weekDate.getMonth();
      
      // Only render month labels if the month changes during this week column
      if (currentMonth !== prevMonth) {
        const monthSpan = document.createElement('span');
        monthSpan.textContent = shortMonthNames[currentMonth];
        monthSpan.style.gridColumnStart = String(w + 1);
        monthsContainer.appendChild(monthSpan);
        prevMonth = currentMonth;
      }
    }
  }

  // 2. Generate cell data using a clustered activity simulator (Markov-like streaks)
  const cells = [];
  let totalContributions = 0;
  let baseActivity = Math.random(); // base activity level for a week

  for (let w = 0; w < 53; w++) {
    // 30% chance to shift base activity level each week to form organic clusters
    if (Math.random() < 0.3) {
      baseActivity = Math.random();
    }
    
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + w * 7 + d);
      
      const isFuture = cellDate > today;
      let level = 0;
      let count = 0;
      
      if (!isFuture) {
        const rand = Math.random();
        
        if (baseActivity < 0.25) {
          // Low activity week
          level = rand > 0.95 ? 1 : 0;
        } else if (baseActivity < 0.65) {
          // Moderate activity week
          if (rand > 0.88) level = 2;
          else if (rand > 0.6) level = 1;
          else level = 0;
        } else {
          // High activity week (heavy coding streak!)
          if (rand > 0.92) level = 4;
          else if (rand > 0.78) level = 3;
          else if (rand > 0.5) level = 2;
          else if (rand > 0.2) level = 1;
          else level = 0;
        }
        
        // Map level to natural-looking contribution counts
        if (level === 1) count = Math.floor(Math.random() * 2) + 1; // 1-2
        else if (level === 2) count = Math.floor(Math.random() * 2) + 3; // 3-4
        else if (level === 3) count = Math.floor(Math.random() * 2) + 5; // 5-6
        else if (level === 4) count = Math.floor(Math.random() * 5) + 7; // 7-11
        
        totalContributions += count;
      }
      
      const cell = document.createElement('div');
      cell.className = 'github__cell';
      
      if (isFuture) {
        // Hide future cells to match GitHub but keep elements in DOM to maintain grid alignment
        cell.style.opacity = '0';
        cell.style.pointerEvents = 'none';
      } else {
        cell.dataset.level = String(level);
        
        // Create an organic native hover tooltip that mirrors real GitHub behavior
        const formattedDate = cellDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const contributionText = count === 0 ? 'No contributions' : `${count} contribution${count > 1 ? 's' : ''}`;
        cell.title = `${contributionText} on ${formattedDate}`;
      }
      
      cells.push(cell.outerHTML);
    }
  }

  container.innerHTML = cells.join('');

  // 3. Update the dynamic contribution count header in the DOM
  const countEl = document.getElementById('contribution-count');
  if (countEl) {
    countEl.textContent = `${totalContributions.toLocaleString()} contributions in the last year`;
  }
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
