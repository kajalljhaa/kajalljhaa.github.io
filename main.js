/**
 * Portfolio — main.js
 * All content is loaded from /data/*.json
 * Never edit this file to change content — only edit JSON files.
 *
 * Modules:
 *  1. Utilities        6. Hero           11. Experience    16. Achievements
 *  2. Data Loader      7. About          12. Projects      17. Blog
 *  3. Loader           8. Skills         13. Certifications 18. Testimonials
 *  4. Theme            9. Skill Anim     14. Education     19. Social/Contact/Footer
 *  5. Navigation      10. Typing         15. Resume        20. Init
 */
'use strict';

/* ─── 1. Utilities ─── */
const $   = (s, c = document) => c.querySelector(s);
const $$  = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const setHTML = (sel, html) => { const e = $(sel); if (e) e.innerHTML = html; };
const setAttr = (sel, attr, val) => { const e = $(sel); if (e) e.setAttribute(attr, val); };
const fmtDate = (d, o = {year:'numeric',month:'short'}) => d ? new Date(d).toLocaleDateString('en-US', o) : 'Present';

function calcDur(start, end) {
  const s = new Date(start), e = end ? new Date(end) : new Date();
  const m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const y = Math.floor(m / 12), mo = m % 12;
  return (y > 0 ? y + 'y ' : '') + (mo > 0 ? mo + 'm' : '');
}
/**
 * calculateExperience — SINGLE SOURCE OF TRUTH for experience display.
 * Calculates from the earliest job startDate to today.
 * Returns a display string like "1+", "1.5+", "2+", "2.5+" etc.
 * Every section of the site calls this — nothing is hardcoded anywhere.
 */
function calculateExperience(jobs) {
  if (!jobs || !jobs.length) return '1+';
  const earliest = jobs.reduce((min, j) => {
    const d = new Date(j.startDate);
    return d < min ? d : min;
  }, new Date());
  const now = new Date();
  const totalMonths = (now.getFullYear() - earliest.getFullYear()) * 12
                    + (now.getMonth() - earliest.getMonth());
  const years = totalMonths / 12;
  const rounded = Math.floor(years * 2) / 2; // nearest 0.5
  return `${rounded}+`;
}
function isVisible(el) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

/* ─── 2. Data Loader ─── */
async function loadData() {
  const files = ['personal','skills','experience','projects','certifications',
                 'education','testimonials','achievements','blog','social','resume','settings'];
  const results = await Promise.all(files.map(f =>
    fetch(`data/${f}.json`).then(r => r.ok ? r.json() : null).catch(() => null)
  ));
  return Object.fromEntries(files.map((f, i) => [f, results[i]]));
}

/* ─── 3. Loader ─── */
function initLoader() {
  setTimeout(() => { const l = $('#loader'); if (l) l.classList.add('out'); }, 1800);
}

/* ─── 4. Theme ─── */
function initTheme(defaultMode = 'dark') {
  const saved = localStorage.getItem('ptm') || defaultMode;
  applyTheme(saved);
  $('#theme-toggle')?.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ptm', theme);
  const btn = $('#theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ─── 5. Navigation ─── */
function initNav() {
  const nav = $('#nav'), ham = $('#hamburger'), mob = $('#mob-nav'), btt = $('#btt');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', scrollY > 30);
    btt?.classList.toggle('show', scrollY > 500);
  }, { passive: true });
  ham?.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob?.classList.toggle('open');
    ham.setAttribute('aria-expanded', ham.classList.contains('open'));
  });
  $$('.mob-nav a').forEach(a => a.addEventListener('click', () => {
    ham?.classList.remove('open'); mob?.classList.remove('open');
  }));
  // Active link highlight
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.nav-links a, .mob-nav a').forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`)
        );
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('section[id]').forEach(s => obs.observe(s));
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── 6. Hero ─── */
function renderHero(p, yrs) {
  if (!p) return;
  const parts = p.name.trim().split(' ');
  setHTML('#hero-name',
    `<span class="ln">${esc(parts[0])}</span>&nbsp;<span class="ln ln-accent">${esc(parts.slice(1).join(' '))}</span>`
  );
  setHTML('#hero-title', esc(p.title));
  // Dynamically replace any hardcoded experience pattern in bio
  const bioText = (p.bio || '').replace(/[\d.]+\+?\s*years? of experience/gi, `${yrs} Years of experience`);
  setHTML('#hero-desc', esc(bioText));
  if (p.openToWork) {
    const s = $('#hero-status');
    if (s) { s.innerHTML = `<span class="status-ring" aria-hidden="true"></span>${esc(p.availability)}`; s.style.display = 'inline-flex'; }
  }
  // Inject dynamic experience into the highlights metrics card
  const highlights = (p.highlights || []).map(h =>
    /years?\s*(of\s*)?exp/i.test(h.label) ? { ...h, value: yrs } : h
  );
  setHTML('#hero-metrics',
    highlights.map(h =>
      `<div class="metric"><div class="metric-val">${esc(h.value)}</div><div class="metric-lbl">${esc(h.label)}</div></div>`
    ).join('')
  );
  // Profile badge
  const pbExp = $('#pb-exp-val');
  if (pbExp) pbExp.textContent = `${yrs} Years`;
  setAttr('#hero-hire-btn', 'href', `mailto:${p.email}?subject=Hiring+Inquiry`);
  setAttr('#nav-cta', 'href', `mailto:${p.email}?subject=Hiring+Inquiry`);
}

/* ─── 7. About ─── */
function renderAbout(p, expData, yrs) {
  if (!p) return;
  // Replace any hardcoded experience in bio text
  const bioText = (p.bio || '').replace(/[\d.]+\+?\s*years? of experience/gi, `${yrs} Years of experience`);
  setHTML('#about-bio', esc(bioText));
  setHTML('#about-mission', esc(p.mission));
  setHTML('#about-vision', esc(p.vision));
  // Inject dynamic experience into stat block
  const highlights = (p.highlights || []).map(h =>
    /years?\s*(of\s*)?exp/i.test(h.label) ? { ...h, value: yrs } : h
  );
  setHTML('#stat-block', highlights.map(h =>
    `<div class="stat-cell"><div class="stat-num">${esc(h.value)}</div><div class="stat-desc">${esc(h.label)}</div></div>`
  ).join(''));
  setHTML('#strengths-list', (p.coreStrengths || []).map(s =>
    `<div class="str-item"><div class="str-dot" aria-hidden="true"></div>${esc(s)}</div>`
  ).join(''));
  // Populate about timeline from experience data
  const tl = $('#about-timeline');
  if (tl && expData?.jobs?.length) {
    tl.innerHTML = expData.jobs.map(j => {
      const startYr = new Date(j.startDate).getFullYear();
      const endYr = j.current ? 'Present' : new Date(j.endDate).getFullYear();
      return `<div class="tv-item"><div class="tv-year">${startYr} – ${endYr}</div><div class="tv-role">${esc(j.role)}</div><div class="tv-co">${esc(j.company)}</div></div>`;
    }).join('');
  }
}

/* ─── 8. Skills ─── */
function renderSkills(d) {
  if (!d?.categories) return;
  const C = 2 * Math.PI * 18;
  setHTML('#skills-grid', d.categories.map((cat, i) => {
    const top = cat.items[0];
    return `<div class="skill-group reveal d${(i%3)+1}">
      <div class="sg-head">
        <div class="sg-title-row">
          <div class="sg-icon" style="color:${esc(cat.color)}">${esc(cat.icon)}</div>
          <span class="sg-name">${esc(cat.name)}</span>
        </div>
        <div class="sg-ring" aria-label="${esc(top.name)}: ${top.proficiency}%">
          <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <circle cx="22" cy="22" r="18" stroke="var(--border)" stroke-width="2"/>
            <circle class="sg-ring-circle" data-v="${top.proficiency}" cx="22" cy="22" r="18"
              stroke="${esc(cat.color)}" stroke-width="2.5" stroke-linecap="round"
              stroke-dasharray="${C}" stroke-dashoffset="${C}"
              style="transition:stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)"/>
          </svg>
          <span class="sg-ring-val">${top.proficiency}%</span>
        </div>
      </div>
      <div class="sg-pills">
        ${cat.items.map(s => `
          <div class="sg-pill-row">
            <span class="sg-pill-name">${esc(s.name)}</span>
            <div class="sg-pill-track" role="progressbar" aria-valuenow="${s.proficiency}" aria-valuemin="0" aria-valuemax="100">
              <div class="sg-pill-fill" data-w="${s.proficiency}" style="width:0;background:linear-gradient(90deg,${esc(cat.color)},${esc(cat.color)}99)"></div>
            </div>
            <span class="sg-pill-pct">${s.proficiency}%</span>
          </div>`).join('')}
      </div>
    </div>`;
  }).join(''));
}

/* ─── 9. Skill Bar & Ring Animations ─── */
function initSkillAnimations() {
  const C = 2 * Math.PI * 18;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('.sg-pill-fill', entry.target).forEach(b => { b.style.width = b.dataset.w + '%'; });
      const ring = $('.sg-ring-circle', entry.target);
      if (ring) ring.style.strokeDashoffset = C - (parseFloat(ring.dataset.v) / 100) * C;
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  $$('.skill-group').forEach(g => obs.observe(g));
}

/* ─── 10. Typing Effect ─── */
function initTyping(roles, speed = 85, delSpeed = 55, pause = 1800) {
  const el = $('#typing-el');
  if (!el || !roles?.length) return;
  let ri = 0, ci = 0, del = false;
  function tick() {
    const word = roles[ri];
    del ? ci-- : ci++;
    el.textContent = word.slice(0, ci);
    let d = del ? delSpeed : speed;
    if (!del && ci === word.length) { d = pause; del = true; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 300; }
    setTimeout(tick, d);
  }
  tick();
}

/* ─── 11. Experience (Accordion) ─── */
function renderExperience(d, totalYrs) {
  if (!d?.jobs) return;
  // totalYrs already contains the "+" e.g. "1.5+" — just render it
  setHTML('#exp-total-years',
    `${totalYrs}<span style="font-size:1.8rem;vertical-align:middle"> Years</span>`
  );
  setHTML('#exp-timeline', d.jobs.map((j, i) => {
    const logoHTML = j.logo
      ? `<img src="${esc(j.logo)}" alt="${esc(j.company)} logo" loading="lazy" onerror="this.parentElement.innerHTML='${esc(j.logoFallback || '🏢')}';">`
      : `<span>${esc(j.logoFallback || '🏢')}</span>`;
    return `
    <div class="exp-item reveal d${Math.min(i+1,4)}" data-idx="${i}"
      onclick="window._toggleExp(this)"
      role="button" tabindex="0" aria-expanded="false"
      aria-label="${esc(j.role)} at ${esc(j.company)}">
      <div class="exp-header">
        <div class="exp-year-badge">${fmtDate(j.startDate,{month:'short',year:'numeric'})} – ${j.current?'Present':fmtDate(j.endDate,{month:'short',year:'numeric'})}</div>
        <div class="exp-h-main">
          <div class="exp-logo-sq">${logoHTML}</div>
          <div>
            <div class="exp-role-text">${esc(j.role)}</div>
            <div class="exp-company-text">${esc(j.company)}</div>
          </div>
        </div>
        <div class="exp-h-right">
          ${j.current ? '<span class="exp-current-pill">● Current</span>' : ''}
          <span class="exp-dur-text">${calcDur(j.startDate, j.endDate)} · ${esc(j.location)}</span>
          <span class="exp-chevron" aria-hidden="true">▾</span>
        </div>
      </div>
      <div class="exp-body">
        <div class="exp-body-inner">
          <div class="exp-divider"></div>
          <p class="exp-desc-text">${esc(j.description)}</p>
          <div class="exp-two-col">
            <div>
              <div class="exp-col-title">Responsibilities</div>
              <div class="exp-resp-list">${j.responsibilities.map(r=>`<div class="exp-resp">${esc(r)}</div>`).join('')}</div>
            </div>
            <div>
              <div class="exp-col-title">Key Wins</div>
              <div class="exp-win-list">${j.achievements.map(a=>`<div class="exp-win">${esc(a)}</div>`).join('')}</div>
            </div>
          </div>
          <div class="exp-tech-list">${j.technologies.map(t=>`<span class="exp-tech">${esc(t)}</span>`).join('')}</div>
        </div>
      </div>
    </div>`;
  }).join(''));

  // Auto-open first
  const first = $('.exp-item');
  if (first) { first.classList.add('open'); first.setAttribute('aria-expanded','true'); }
}
window._toggleExp = el => {
  const open = el.classList.toggle('open');
  el.setAttribute('aria-expanded', open);
};
document.addEventListener('keydown', e => {
  if ((e.key==='Enter'||e.key===' ') && document.activeElement?.classList.contains('exp-item')) {
    e.preventDefault(); window._toggleExp(document.activeElement);
  }
});

/* ─── 12. Projects ─── */
let _projects = [];
function renderProjects(d) {
  if (!d?.projects) return;
  _projects = [...d.projects].sort((a,b) => (a.order||99)-(b.order||99));
  const cats = [...new Set(_projects.flatMap(p => p.category))].sort();
  setHTML('#proj-filters',
    `<button class="pf-btn active" data-f="all">All</button>` +
    cats.map(c=>`<button class="pf-btn" data-f="${esc(c)}">${esc(c)}</button>`).join('')
  );
  $('#proj-filters')?.addEventListener('click', e => {
    if (!e.target.matches('.pf-btn')) return;
    $$('.pf-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterProjects();
  });
  $('#proj-search-input')?.addEventListener('input', filterProjects);
  renderProjectCards(_projects);
}
function filterProjects() {
  const f = $('.pf-btn.active')?.dataset.f || 'all';
  const q = ($('#proj-search-input')?.value || '').toLowerCase().trim();
  renderProjectCards(_projects.filter(p =>
    (f==='all' || p.category.includes(f)) &&
    (!q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) ||
     (p.tools||[]).some(t => t.toLowerCase().includes(q)))
  ));
}
function renderProjectCards(ps) {
  const grid = $('#proj-grid');
  if (!grid) return;
  if (!ps.length) {
    grid.innerHTML = `<div class="no-results"><div class="no-results-icon">🔍</div><p>No projects match your search.</p></div>`;
    return;
  }
  grid.innerHTML = ps.map(p => {
    const span = p.featured ? 'span-full' : '';
    return `
    <article class="proj-card ${span} reveal" onclick="window._openModal('${esc(p.id)}')" aria-label="${esc(p.title)}">
      <div class="proj-accent" style="background:${p.gradient||'linear-gradient(135deg,var(--accent),var(--accent-h))'}"></div>
      <div class="proj-thumb" style="background:linear-gradient(135deg,var(--bg-2),var(--bg-3))">
        <div class="proj-thumb-bg" style="background:${p.gradient||''}"></div>
        <div class="proj-emoji">${p.emoji||'📊'}</div>
        ${p.featured ? '<div class="proj-feat-pill">Featured</div>' : ''}
      </div>
      <div class="proj-body">
        <div class="proj-cats">${(p.category||[]).map(c=>`<span class="proj-cat">${esc(c)}</span>`).join('')}</div>
        <h3 class="proj-title">${esc(p.title)}</h3>
        <p class="proj-summary">${esc(p.summary)}</p>
        <div class="proj-kpis">${(p.kpis||[]).map(k=>
          `<div class="proj-kpi"><div class="proj-kpi-val">${esc(k.value)}</div><div class="proj-kpi-lbl">${esc(k.label)}</div></div>`
        ).join('')}</div>
        <div class="proj-actions">
          ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" class="pa-btn pa-primary" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">GitHub →</a>` : ''}
          ${p.liveUrl  ? `<a href="${esc(p.liveUrl)}"  class="pa-btn pa-secondary" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Live Demo</a>` : ''}
          <button class="pa-btn pa-secondary" onclick="event.stopPropagation();window._openModal('${esc(p.id)}')">Case Study →</button>
        </div>
      </div>
    </article>`;
  }).join('');
  setTimeout(() => $$('#proj-grid .reveal').forEach(el => { if (isVisible(el)) el.classList.add('vis'); }), 60);
}
window._openModal = id => {
  const p = _projects.find(x => x.id === id);
  if (!p) return;
  const modal = $('#modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="proj-cats" style="margin-bottom:10px">${(p.category||[]).map(c=>`<span class="proj-cat">${esc(c)}</span>`).join('')}</div>
        <h2 style="font-family:'Manrope',sans-serif;font-size:1.4rem;font-weight:900;color:var(--text);letter-spacing:-.03em">${esc(p.title)}</h2>
      </div>
      <button class="modal-close" onclick="window._closeModal()" aria-label="Close">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-kpis">${(p.kpis||[]).map(k=>
        `<div class="modal-kpi"><div class="modal-kpi-val">${esc(k.value)}</div><div class="modal-kpi-lbl">${esc(k.label)}</div></div>`
      ).join('')}</div>
      <div class="modal-sec-label">The Problem</div><p class="modal-text">${esc(p.problem||'')}</p>
      <div class="modal-sec-label">The Solution</div><p class="modal-text">${esc(p.solution||'')}</p>
      <div class="modal-sec-label">Results & Impact</div><p class="modal-text">${esc(p.results||'')}</p>
      <div class="modal-sec-label">Tools & Stack</div>
      <div class="modal-tools">${(p.tools||[]).map(t=>`<span class="modal-tool">${esc(t)}</span>`).join('')}</div>
      <div class="proj-actions" style="margin-top:8px">
        ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" class="pa-btn pa-primary" target="_blank" rel="noopener noreferrer">GitHub →</a>` : ''}
        ${p.liveUrl   ? `<a href="${esc(p.liveUrl)}"  class="pa-btn pa-secondary" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
      </div>
    </div>`;
  $('#modal-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window._closeModal = () => {
  $('#modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
};
document.addEventListener('click', e => { if (e.target === $('#modal-overlay')) window._closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') window._closeModal(); });

/* ─── 13. Certifications ─── */
function renderCerts(d) {
  if (!d?.certifications) return;
  const certs = [...d.certifications].sort((a,b)=>(a.order||99)-(b.order||99));
  setHTML('#certs-grid', certs.map(c => `
    <div class="cert-card reveal">
      <div class="cert-top">
        <span class="cert-emoji">${c.emoji}</span>
        <div><div class="cert-title">${esc(c.title)}</div><div class="cert-issuer">${esc(c.issuer)}</div></div>
      </div>
      <p class="cert-desc">${esc(c.description)}</p>
      <div class="cert-footer">
        <span class="cert-date-str">Issued ${fmtDate(c.issuedDate,{month:'short',year:'numeric'})}${c.expiryDate?' · Expires '+fmtDate(c.expiryDate,{month:'short',year:'numeric'}):'  · No Expiry'}</span>
        <div class="cert-tags">${(c.tags||[]).map(t=>`<span class="cert-tag">${esc(t)}</span>`).join('')}</div>
      </div>
      <div class="cert-actions">
        ${c.verifyUrl ? `<a href="${esc(c.verifyUrl)}" class="cert-link" target="_blank" rel="noopener noreferrer">✓ Verify</a>` : ''}
        ${c.pdfFile   ? `<a href="${esc(c.pdfFile)}" class="cert-link" download>⬇ PDF</a>` : ''}
        <span style="font-size:.7rem;color:var(--text-3);margin-left:auto;align-self:center">ID: ${esc(c.credentialId)}</span>
      </div>
    </div>`).join(''));
  $('#cert-search-input')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    $$('.cert-card').forEach(card => { card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none'; });
  });
}

/* ─── 14. Education ─── */
function renderEducation(d) {
  if (!d?.education?.length) return;
  const e = d.education[0];
  setHTML('#edu-container', `
    <div class="edu-wrap reveal">
      <div class="edu-header">
        <div class="edu-badge">${e.emoji}</div>
        <div>
          <div class="edu-degree">${esc(e.degree)}</div>
          <div class="edu-school">${esc(e.institution)}</div>
          <div class="edu-meta-row">
            <span class="edu-meta-item">${e.startYear} – ${e.endYear}</span>
            <span class="edu-meta-item">GPA: ${esc(e.gpa)}</span>
            <span class="edu-meta-item">${esc(e.location)}</span>
          </div>
        </div>
      </div>
      <div class="edu-body">
        <div class="edu-section">
          <div class="edu-sec-h">Academic Highlights</div>
          <div class="edu-hl-list">${e.highlights.map(h=>`<div class="edu-hl">${esc(h)}</div>`).join('')}</div>
        </div>
        <div class="edu-section">
          <div class="edu-sec-h">Core Subjects</div>
          <div class="edu-subj-wrap">${e.subjects.map(s=>`<span class="edu-subj">${esc(s)}</span>`).join('')}</div>
        </div>
        <div class="edu-section" style="margin-bottom:0">
          <div class="edu-sec-h">Academic Projects</div>
          <div class="edu-proj-grid">${e.projects.map(p=>
            `<div class="edu-proj"><div class="edu-proj-title">${esc(p.title)}</div><div class="edu-proj-desc">${esc(p.description)}</div></div>`
          ).join('')}</div>
        </div>
      </div>
    </div>`);
}

/* ─── 15. Resume ─── */
function renderResume(d) {
  if (!d?.resumes) return;
  const rs = [...d.resumes].sort((a,b)=>(a.order||99)-(b.order||99));
  setHTML('#resume-grid', rs.map(r => `
    <div class="resume-card ${r.primary?'primary':''} reveal">
      ${r.primary ? '<div class="resume-primary-badge">Recommended</div>' : ''}
      <div class="resume-icon">${r.icon}</div>
      <div class="resume-label">${esc(r.label)}</div>
      <div class="resume-desc">${esc(r.description)}</div>
      <a href="${esc(r.file)}" class="resume-dl" download aria-label="Download ${esc(r.label)} resume">⬇ Download PDF</a>
    </div>`).join(''));
}

/* ─── 16. Achievements ─── */
function renderAchievements(d) {
  if (!d?.achievements) return;
  const as = [...d.achievements].sort((a,b)=>(a.order||99)-(b.order||99));
  setHTML('#ach-grid', as.map((a,i) => `
    <div class="ach-card reveal d${(i%3)+1}">
      <div class="ach-icon">${a.icon}</div>
      <div>
        <div class="ach-cat">${esc(a.category)}</div>
        <div class="ach-title">${esc(a.title)}</div>
        <div class="ach-desc">${esc(a.description)}</div>
        <div class="ach-date">${fmtDate(a.date,{month:'long',year:'numeric'})}</div>
        ${a.link ? `<a href="${esc(a.link)}" class="cert-link" target="_blank" rel="noopener noreferrer" style="margin-top:10px;display:inline-flex">View →</a>` : ''}
      </div>
    </div>`).join(''));
}

/* ─── 17. Blog ─── */
let _posts = [];
function renderBlog(d) {
  if (!d?.posts) return;
  _posts = [...d.posts].sort((a,b)=>(a.order||99)-(b.order||99));
  const cats = [...new Set(_posts.map(p=>p.category))];
  setHTML('#blog-cat-filters',
    `<button class="blog-cat-btn active" data-bc="all">All</button>` +
    cats.map(c=>`<button class="blog-cat-btn" data-bc="${esc(c)}">${esc(c)}</button>`).join('')
  );
  $('#blog-cat-filters')?.addEventListener('click', e => {
    if (!e.target.matches('.blog-cat-btn')) return;
    $$('.blog-cat-btn').forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active'); filterBlog();
  });
  $('#blog-search-input')?.addEventListener('input', filterBlog);
  renderPostCards(_posts);
}
function filterBlog() {
  const bc = $('.blog-cat-btn.active')?.dataset.bc || 'all';
  const q = ($('#blog-search-input')?.value||'').toLowerCase().trim();
  renderPostCards(_posts.filter(p=>
    (bc==='all'||p.category===bc) && (!q||p.title.toLowerCase().includes(q)||p.summary.toLowerCase().includes(q))
  ));
}
function renderPostCards(posts) {
  const grid = $('#blog-grid');
  if (!grid) return;
  grid.innerHTML = posts.length ? posts.map(p => `
    <article class="blog-card reveal">
      <div class="blog-thumb"><div class="blog-thumb-glow"></div>${p.emoji}</div>
      <div class="blog-body">
        <span class="blog-cat-label">${esc(p.category)}</span>
        <h3 class="blog-title">${esc(p.title)}</h3>
        <p class="blog-summary">${esc(p.summary)}</p>
        <div class="blog-footer">
          <span class="blog-meta-text">${fmtDate(p.date,{month:'short',day:'numeric',year:'numeric'})} · ${esc(p.readTime)}</span>
          ${p.externalUrl ? `<a href="${esc(p.externalUrl)}" class="blog-read-link" target="_blank" rel="noopener noreferrer">Read →</a>` : '<span class="blog-read-link" style="color:var(--text-3)">Coming soon</span>'}
        </div>
      </div>
    </article>`).join('')
    : `<div class="no-results" style="grid-column:1/-1"><div class="no-results-icon">📭</div><p>No posts found.</p></div>`;
  setTimeout(() => $$('#blog-grid .reveal').forEach(el => { if (isVisible(el)) el.classList.add('vis'); }), 60);
}

/* ─── 18. Testimonials Carousel ─── */
function renderTestimonials(d, autoMs = 5500) {
  if (!d?.testimonials) return;
  const ts = [...d.testimonials].sort((a,b)=>(a.order||99)-(b.order||99));
  let cur = 0, timer;
  setHTML('#test-slides', ts.map(t => `
    <div class="test-slide">
      <div class="test-card">
        <div class="test-stars">${'★'.repeat(t.stars)}<span style="opacity:.2">${'★'.repeat(5-t.stars)}</span></div>
        <blockquote class="test-quote">"${esc(t.text)}"</blockquote>
        <div class="test-author">
          <div class="test-avatar">
            ${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.name)}" loading="lazy" onerror="this.parentElement.textContent='${esc(t.initials||t.name.slice(0,2))}';">` : esc(t.initials||t.name.slice(0,2))}
          </div>
          <div><div class="test-name">${esc(t.name)}</div><div class="test-role-str">${esc(t.role)}, ${esc(t.company)}</div></div>
        </div>
      </div>
    </div>`).join(''));
  setHTML('#test-dots', ts.map((_,i) =>
    `<div class="test-dot ${i===0?'active':''}" data-idx="${i}" role="button" tabindex="0" aria-label="Slide ${i+1}"></div>`
  ).join(''));
  const slides = $('#test-slides'), dots = $$('.test-dot');
  function goTo(n) {
    cur = (n + ts.length) % ts.length;
    if (slides) slides.style.transform = `translateX(-${cur*100}%)`;
    dots.forEach((d,i) => d.classList.toggle('active', i===cur));
  }
  $('#test-prev')?.addEventListener('click', () => { clearInterval(timer); goTo(cur-1); });
  $('#test-next')?.addEventListener('click', () => { clearInterval(timer); goTo(cur+1); });
  $('#test-dots')?.addEventListener('click', e => {
    if (e.target.matches('.test-dot')) { clearInterval(timer); goTo(+e.target.dataset.idx); }
  });
  let sx = 0;
  slides?.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  slides?.addEventListener('touchend', e => {
    if (Math.abs(sx - e.changedTouches[0].clientX) > 50) goTo(cur + (sx > e.changedTouches[0].clientX ? 1 : -1));
  });
  if (autoMs > 0) {
    const start = () => { timer = setInterval(() => goTo(cur+1), autoMs); };
    const stop = () => clearInterval(timer);
    start();
    $('.test-wrap')?.addEventListener('mouseenter', stop);
    $('.test-wrap')?.addEventListener('mouseleave', start);
  }
}

/* ─── 19. Social / Contact / Footer ─── */
function renderSocial(d) {
  if (!d?.social) return;
  const vis = d.social.filter(s => s.display !== false);
  setHTML('#social-chips', vis.map(s =>
    `<a href="${esc(s.url)}" class="soc-chip" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.platform)}">
      <span style="font-weight:900;font-size:.75rem;font-family:'Manrope',sans-serif">${esc(s.symbol)}</span>${esc(s.label)}
    </a>`).join(''));
  setHTML('#footer-soc-row', vis.map(s =>
    `<a href="${esc(s.url)}" class="footer-soc" target="_blank" rel="noopener noreferrer" title="${esc(s.platform)}">${esc(s.symbol)}</a>`
  ).join(''));
}
function renderContact(p) {
  if (!p) return;
  setAttr('#ci-email-link', 'href', `mailto:${p.email}`);
  setHTML('#ci-email-val', esc(p.email));
  setAttr('#ci-phone-link', 'href', `tel:${p.phone.replace(/[\s()-]/g,'')}`);
  setHTML('#ci-phone-val', esc(p.phone));
  setAttr('#ci-wa-link', 'href', `https://wa.me/${p.whatsapp}`);
  setHTML('#ci-loc-val', esc(p.location));
  setHTML('#contact-sub', `Open to full-time roles, freelance engagements, and speaking opportunities. Available from ${esc(p.availability)}.`);
}
function renderFooter(p) {
  if (!p) return;
  setHTML('#footer-name', esc(p.name));
  setHTML('#footer-tagline', esc(p.tagline));
  setHTML('#footer-copy-name', esc(p.name));
  const y = $('#footer-year'); if (y) y.textContent = new Date().getFullYear();
}
function initForm(endpoint) {
  const form = $('#contact-form'), msg = $('#cf-msg');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('.cf-submit');
    btn.textContent = 'Sending…'; btn.disabled = true;
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      if (r.ok) {
        if (msg) { msg.textContent = "✅ Message sent — I'll be in touch soon!"; msg.className = 'cf-msg ok'; }
        form.reset();
      } else throw new Error();
    } catch {
      if (msg) { msg.textContent = '❌ Could not send. Please email me directly.'; msg.className = 'cf-msg err'; }
    } finally {
      btn.textContent = 'Send Message →'; btn.disabled = false;
    }
  });
}

/* ─── Scroll Reveal ─── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  $$('.reveal, .reveal-l').forEach(el => isVisible(el) ? el.classList.add('vis') : obs.observe(el));
}

/* ─── 20. Init ─── */
async function init() {
  initLoader();
  initTheme();
  initNav();
  $('#btt')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  try {
    const D = await loadData();
    const { personal: p, skills, experience, projects, certifications,
            education, testimonials, achievements, blog, social, resume, settings } = D;

    const yrs = experience?.jobs ? calculateExperience(experience.jobs) : '1+';
    if (settings?.theme?.defaultMode) initTheme(settings.theme.defaultMode);

    renderHero(p, yrs);
    renderAbout(p, experience, yrs);
    renderSkills(skills);
    renderExperience(experience, yrs);
    renderProjects(projects);
    renderCerts(certifications);
    renderEducation(education);
    renderResume(resume);
    renderAchievements(achievements);
    renderBlog(blog);
    renderTestimonials(testimonials, settings?.testimonials?.autoplayMs ?? 5500);
    renderSocial(social);
    renderContact(p);
    renderFooter(p);

    if (p?.contact?.formspreeEndpoint) initForm(p.contact.formspreeEndpoint);

    // SEO update
    if (p?.seo?.title) document.title = p.seo.title;
    if (p?.seo?.description) {
      $('meta[name="description"]')?.setAttribute('content', p.seo.description);
      $('meta[property="og:description"]')?.setAttribute('content', p.seo.description);
      $('meta[name="twitter:description"]')?.setAttribute('content', p.seo.description);
    }
    if (p?.seo?.title) {
      $('meta[property="og:title"]')?.setAttribute('content', p.seo.title);
      $('meta[name="twitter:title"]')?.setAttribute('content', p.seo.title);
    }
    if (p?.seo?.siteUrl) {
      $('link[rel="canonical"]')?.setAttribute('href', p.seo.siteUrl + '/');
      $('meta[property="og:url"]')?.setAttribute('content', p.seo.siteUrl + '/');
    }
    if (p?.name) $('meta[name="author"]')?.setAttribute('content', p.name);

    // Typing
    initTyping(p?.typingRoles || [], settings?.hero?.typingSpeedMs, settings?.hero?.typingDeleteMs, settings?.hero?.typingPauseMs);

    // Post-render
    setTimeout(() => { initReveal(); initSkillAnimations(); }, 120);

  } catch (err) {
    console.error('Portfolio init error:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
