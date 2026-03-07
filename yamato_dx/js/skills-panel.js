(function () {
    var panels = document.querySelectorAll('.skills-panel');
    if (!panels.length) return;
    var mq = window.matchMedia('(min-width: 900px)');
    function sync(e) {
        panels.forEach(function (panel) {
            if (e.matches) {
                if (!panel.open) {
                    panel.setAttribute('data-forced', 'true');
                    panel.open = true;
                }
            } else if (panel.getAttribute('data-forced') === 'true') {
                panel.open = false;
                panel.removeAttribute('data-forced');
            }
        });
    }
    sync(mq);
    if (mq.addEventListener) {
        mq.addEventListener('change', sync);
    } else if (mq.addListener) {
        mq.addListener(sync);
    }
})();
