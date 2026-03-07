(function setupMobileNav(){
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) { backdrop = document.createElement('div'); backdrop.className = 'nav-backdrop'; document.body.appendChild(backdrop); }
    const openNav = () => {
        document.body.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'メニューを閉じる');
        const first = nav.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
        if (first) setTimeout(() => first.focus(), 150);
    };
    const closeNav = () => {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'メニューを開く');
        toggle.focus();
    };
    toggle.addEventListener('click', () => { document.body.classList.contains('nav-open') ? closeNav() : openNav(); });
    backdrop.addEventListener('click', closeNav);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav(); });
    nav.addEventListener('click', (e) => { if (e.target && e.target.closest('a')) closeNav(); });
    const mql = window.matchMedia('(min-width: 1025px)');
    const sync = () => { if (mql.matches) closeNav(); };
    mql.addEventListener ? mql.addEventListener('change', sync) : mql.addListener(sync);
})();
