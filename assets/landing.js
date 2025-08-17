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
  metaTheme?.setAttribute('content', getComputedStyle(htmlEl).getPropertyValue('--bg').trim());
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
    if (id.length > 1 && document.querySelector(id)) {
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
  let deadline = el.dataset.deadline?.trim();
  let end = deadline ? new Date(deadline) : new Date(Date.now() + 3*24*60*60*1000);
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    const now = new Date();
    let diff = Math.max(0, end - now);
    const d = Math.floor(diff / (24*60*60*1000)); diff -= d*24*60*60*1000;
    const h = Math.floor(diff / (60*60*1000)); diff -= h*60*60*1000;
    const m = Math.floor(diff / (60*1000)); diff -= m*60*1000;
    const s = Math.floor(diff / 1000);
    el.querySelector('[data-unit="days"]').textContent = pad(d);
    el.querySelector('[data-unit="hours"]').textContent = pad(h);
    el.querySelector('[data-unit="minutes"]').textContent = pad(m);
    el.querySelector('[data-unit="seconds"]').textContent = pad(s);
    if (end - now <= 0) return;
    requestAnimationFrame(()=>setTimeout(tick, 250));
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