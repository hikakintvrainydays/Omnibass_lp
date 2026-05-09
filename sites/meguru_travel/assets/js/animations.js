// Fade-in observer
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('in-view'));
}, { threshold: 0.2 });
fadeEls.forEach(el => observer.observe(el));

// Scroll-based line angle
const root = document.documentElement;
window.addEventListener("scroll", () => {
    const deg = 135 + window.scrollY / 40;
    root.style.setProperty("--line-angle", `${deg}deg`);
});

// Mouse-based light position
document.addEventListener("mousemove", e => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    root.style.setProperty("--light-x", `${x * 100}%`);
    root.style.setProperty("--light-y", `${y * 100}%`);
});
