(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const zone = document.querySelector('.showcase-scroll');
  const sticky = document.querySelector('.showcase-sticky');
  const clothes = document.querySelector('.showcase-clothes');
  const title = document.querySelector('.showcase-title');
  const cue = document.querySelector('.showcase-scroll-cue');
  const progressBar = document.querySelector('#showcase-progress-bar');
  if (!zone || !sticky || !clothes || reducedMotion) return;

  let ticking = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  const updateShowcase = () => {
    const scrollSpan = Math.max(1, zone.offsetHeight - sticky.offsetHeight);
    const progress = clamp(-zone.getBoundingClientRect().top / scrollSpan);
    const coverProgress = clamp(progress / 0.27);
    const clothesProgress = clamp((progress - 0.1) / 0.9);
    const fadeIn = clamp((progress - 0.1) * 8);
    const fadeOut = clamp((1 - progress) * 20);
    sticky.style.setProperty('--showcase-cover-y', `${(1 - coverProgress) * 100}%`);
    clothes.style.setProperty('--showcase-y', `${(0.36 - clothesProgress) * 100}svh`);
    clothes.style.setProperty('--showcase-clothes-opacity', (fadeIn * fadeOut).toFixed(3));
    if (title) title.style.setProperty('--showcase-copy-opacity', clamp(progress * 5).toFixed(3));
    if (cue) cue.style.opacity = String(clamp(1 - progress * 5));
    if (progressBar) progressBar.style.width = `${(progress * 100).toFixed(2)}%`;
    ticking = false;
  };
  const requestUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateShowcase);
      ticking = true;
    }
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  updateShowcase();
})();

