// Enable JS-mode for reveal fallback
document.documentElement.classList.add('js');

const htmlEl = document.documentElement;
const metaTheme = document.querySelector('meta[name="theme-color"]');
const toggleBtn = document.getElementById('theme-toggle');

// Theme Toggle (pill)
function applyTheme(theme){
  htmlEl.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  toggleBtn?.setAttribute('aria-checked', String(isDark));
  // sync meta theme-color with current background
  const bg = getComputedStyle(htmlEl).getPropertyValue('--bg').trim();
  metaTheme?.setAttribute('content', bg || '#0d1016');
}
function getPreferredTheme(){
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function toggleTheme(){
  const next = (htmlEl.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
}
toggleBtn?.addEventListener('click', toggleTheme);
applyTheme(getPreferredTheme());

// Reveal on Scroll
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Card Shine
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
});

// Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id && id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Lead form (demo)
const form = document.getElementById('lead-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (form.checkValidity && !form.checkValidity()) return;
  const btn = form.querySelector('button[type="submit"]');
  const old = btn.textContent;
  btn.disabled = true; btn.textContent = 'در حال ارسال...';
  setTimeout(() => {
    btn.disabled = false; btn.textContent = old;
    alert('ثبت‌نام شما دریافت شد! به‌زودی با شما تماس می‌گیریم.');
    form.reset();
  }, 900);
});

// Coupon copy
const copyBtn = document.getElementById('copy-coupon');
copyBtn?.addEventListener('click', async () => {
  const code = document.getElementById('coupon-code')?.textContent?.trim() || '';
  try {
    await navigator.clipboard.writeText(code);
    copyBtn.textContent = 'کپی شد!';
    setTimeout(()=>copyBtn.textContent='کپی', 1200);
  } catch {
    prompt('کد را دستی کپی کنید:', code);
  }
});

// Countdown (defaults to 3 days if dataset empty)
function initCountdown(){
  const el = document.getElementById('countdown');
  if (!el) return;

  const deadline = el.dataset.deadline?.trim();
  const end = deadline ? new Date(deadline) : new Date(Date.now() + 3*24*60*60*1000);

  const DAY = 24*60*60*1000, HOUR = 60*60*1000, MIN = 60*1000;
  const pad = n => String(n).padStart(2,'0');

  function tick(){
    const now = Date.now();
    let diff = Math.max(0, end.getTime() - now);

    const d = Math.floor(diff / DAY); diff -= d * DAY;
    const h = Math.floor(diff / HOUR); diff -= h * HOUR;
    const m = Math.floor(diff / MIN); diff -= m * MIN;
    const s = Math.floor(diff / 1000);

    el.querySelector('[data-unit="days"]').textContent = pad(d);
    el.querySelector('[data-unit="hours"]').textContent = pad(h);
    el.querySelector('[data-unit="minutes"]').textContent = pad(m);
    el.querySelector('[data-unit="seconds"]').textContent = pad(s);

    if (end.getTime() - now > 0) requestAnimationFrame(()=>setTimeout(tick, 250));
  }
  tick();
}
initCountdown();

// Sticky CTA on scroll
const sticky = document.getElementById('sticky-cta');
function onScroll(){
  const y = window.scrollY || document.documentElement.scrollTop;
  if (y > 420) sticky?.classList.add('show'); else sticky?.classList.remove('show');
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// Mobile menu
const menuBtn = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn?.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  if (open) mobileMenu.removeAttribute('hidden'); else mobileMenu.setAttribute('hidden','');
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close on click outside or link click
mobileMenu?.addEventListener('click', (e) => {
  if (e.target === mobileMenu || (e.target instanceof Element && e.target.matches('a'))) {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('hidden','');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// Close on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('hidden','');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});