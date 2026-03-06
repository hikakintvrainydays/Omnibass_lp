// ============================
// 🧭 Header: Mobile Nav Toggle
// ============================
(function setupMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('siteNav');

  if (!toggle || !nav) return;

  // 背景用レイヤー（クリックで閉じる）
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const openNav = () => {
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'メニューを閉じる');
    // 最初のリンクにフォーカス
    const firstLink = nav.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
    if (firstLink) setTimeout(() => firstLink.focus(), 150);
  };

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    toggle.focus();
  };

  toggle.addEventListener('click', () => {
    document.body.classList.contains('nav-open') ? closeNav() : openNav();
  });

  backdrop.addEventListener('click', closeNav);

  // Escapeで閉じる
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
    }
  });

  // メニュー内リンクを押したら閉じる
  nav.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.closest('a')) closeNav();
  });

  // ブレークポイント超えたら状態をリセット
  const mql = window.matchMedia('(min-width: 1025px)');
  const sync = () => { if (mql.matches) closeNav(); };
  mql.addEventListener ? mql.addEventListener('change', sync) : mql.addListener(sync);
})();





// ============================
// 🌍 基本設定
// ============================
const sections = document.querySelectorAll(".fade-section");
const navItems = document.querySelectorAll(".section-nav .nav-item");

// 3面の画像＆枠要素を取得
const boards = {
  left:   { img: document.getElementById("billboardImageLeft"),   frame: document.querySelector(".billboard--left  .billboard-frame"),  current: "" },
  center: { img: document.getElementById("billboardImageCenter"), frame: document.querySelector(".billboard--center .billboard-frame"), current: "" },
  right:  { img: document.getElementById("billboardImageRight"),  frame: document.querySelector(".billboard--right .billboard-frame"),  current: "" },
};

// 🌍 スクロール距離（演出用の全体高さは維持してOK）
const scrollSpeedFactor = 5;
document.body.style.height = `${sections.length * scrollSpeedFactor * 100}vh`;

// ============================
// 🎯 アクティブセクション取得（可視セクションのインデックス）
// ============================
function getActiveIndex() {
  const scrollY = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const ratio = total > 0 ? scrollY / total : 0;
  return Math.min(sections.length - 1, Math.max(0, Math.floor(ratio * sections.length)));
}

// ============================
// 🚀 スクロール移動（セクション位置へスナップ）
// ============================
function scrollToIndex(idx) {
  const total = document.body.scrollHeight - window.innerHeight;
  const segment = total / sections.length;
  const target = Math.round(Math.min(total, Math.max(0, idx * segment)));
  window.scrollTo({ top: target, behavior: "smooth" });
}

// ============================
// 🖼️ ビジョンボード画像制御
// ============================
function setBoard(board, src) {
  const img = board.img;
  const frame = board.frame;
  if (!img || !frame) return;

  if (!src) {
    img.classList.remove("active");
    frame.classList.remove("active");
    board.current = "";
    return;
  }

  if (src === board.current) return;
  board.current = src;

  img.classList.remove("active");
  frame.classList.remove("active");

  setTimeout(() => {
    img.src = src;
    img.onload = () => {
      requestAnimationFrame(() => {
        img.classList.add("active");
        frame.classList.add("active");
      });
    };
  }, 140);
}

// ============================
// 💼 Businessセクション連動
// ============================
// フォールバック英語文言（lang.js未準備/未取得時用）
const FALLBACK_EN = {
  business: {
    title: 'Business',
    tour: { title: 'Custom Tour', desc: 'We design tailor-made itineraries for every traveler, offering local-guided experiences that capture the spirit of each region.' },
    route: { title: 'ToruRoute', desc: 'Discover local restaurants and shops with photos, reviews, and translated menus connecting local culture with the world.' },
    consult: { title: 'Inbound Consulting', desc: 'We support tourism, dining, and hospitality businesses with English communication and UX design.' },
    btn: 'Learn more'
  }
};

function getI18nForBusiness() {
  try {
    const lang = (window.TT && typeof window.TT.getLang === 'function') ? window.TT.getLang() : 'en';
    const dict = (window.TT && window.TT.translations) ? window.TT.translations : null;
    const tr = dict && dict[lang] ? dict[lang] : null;
    const trEn = dict && dict.en ? dict.en : FALLBACK_EN;
    return tr || trEn;
  } catch (_) {
    return FALLBACK_EN;
  }
}

function rebuildBusinessMarkup() {
  const sec = document.getElementById("business");
  if (!sec) return;
  // 現在の言語に応じて文言を投入（フォールバックあり）
  const tr = getI18nForBusiness();
  const bizTitle = tr.business?.title || FALLBACK_EN.business.title;
  const tour = tr.business?.tour || FALLBACK_EN.business.tour;
  const route = tr.business?.route || FALLBACK_EN.business.route;
  const consult = tr.business?.consult || FALLBACK_EN.business.consult;
  const btnLabel = tr.business?.btn || FALLBACK_EN.business.btn;

  sec.innerHTML = `
      <h2>${bizTitle}</h2>
      <div class="biz-layout">
        <div class="biz-tabs" role="tablist" aria-label="Business Services">
          <button class="biz-tab is-active" id="tab-tour"
            data-key="tour"
            data-title="${tour.title}"
            data-desc="${tour.desc}"
            data-link="../customize_tour/index.html"
            data-vision-left="logo_instance_customize_tour.png"
            data-vision-right="https://images.unsplash.com/photo-1526779259212-939e64788e3c?q=80&w=1600&auto=format&fit=crop">
            ${tour.title}
          </button>

          <button class="biz-tab" id="tab-route"
            data-key="route"
            data-title="${route.title}"
            data-desc="${route.desc}"
            data-link="http://toru-route.toru-tour.jp/"
            data-vision-left="logo_instance_toruroute.png"
            data-vision-right="https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop">
            ${route.title}
          </button>

          <button class="biz-tab" id="tab-consult"
            data-key="consult"
            data-title="${consult.title}"
            data-desc="${consult.desc}"
            data-link=""
            data-vision-left="logo_instance_inbound_counsultant.png"
            data-vision-right="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1600&auto=format&fit=crop">
            Partner
          </button>
        </div>

        <div class="biz-panel" id="bizPanel">
          <h3 class="biz-title">${tour.title}</h3>
          <p class="biz-desc">${tour.desc}</p>
          <a id="bizLinkBtn" class="btn btn-primary" href="../customize_tour/index.html" aria-label="${tour.title} ${btnLabel}">${btnLabel}</a>
        </div>
      </div>
  `;
}
rebuildBusinessMarkup();
// Ensure overlay content allows interaction (override any prior CSS)
(() => {
  try {
    const styleFix = document.createElement('style');
    styleFix.textContent = `
      /* Overlay配下は常に相互作用可能に */
      .overlay-content { pointer-events: auto !important; z-index: 50 !important; }
      .overlay-content * { pointer-events: auto !important; }
      /* Bizパネルとボタンを最前面＆常時クリック可 */
      #bizPanel, #bizPanel * { pointer-events: auto !important; z-index: 9999 !important; }
      #bizLinkBtn { pointer-events: auto !important; opacity: 1 !important; z-index: 10000 !important; }
      /* フッターの黒レイヤーはデフォルト相互作用無効（footer セクションに来たら再度有効化する処理は不要）*/
      .main-footer { pointer-events: none !important; }
      .main-footer.active { pointer-events: auto !important; z-index: 60 !important; }
      /* ヒーローロゴやヒントはクリックを奪わない */
      .hero-logo-container { pointer-events: none !important; }
      #scrollHint { pointer-events: none !important; }
    `;
    document.head.appendChild(styleFix);
  } catch (e) {}
})();
const businessSection = document.getElementById("business");
const bizTabs = businessSection ? businessSection.querySelectorAll(".biz-tab") : [];
const bizPanel = businessSection ? businessSection.querySelector("#bizPanel") : null;
const bizTitle = businessSection ? businessSection.querySelector(".biz-title") : null;
const bizDesc  = businessSection ? businessSection.querySelector(".biz-desc")  : null;
const bizLinkBtn = document.getElementById("bizLinkBtn");

let bizSelectedIndex = 0;
let lastAppliedBizIndex = -1;
const businessSectionIndex = Array.from(sections).findIndex(s => s.id === "business");

// Anchor navigation: ensure clicking Business jumps to Business section
try {
  const businessAnchors = document.querySelectorAll('a[href="#business"]');
  businessAnchors.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (businessSectionIndex >= 0) {
        scrollToIndex(businessSectionIndex);
        try { history.pushState(null, '', '#business'); } catch(_) {}
      }
    }, { passive: false });
  });
} catch(_) {}

// 言語変更時にUIを再同期（データ属性はlang.jsで更新済み）
try {
  const syncBiz = () => {
    updateBusinessUI(bizSelectedIndex, true);
    updateVerticalTitle(getActiveIndex());
  };
  window.addEventListener('i18n:change', syncBiz);
  window.addEventListener('i18n:ready', syncBiz);
} catch(_) {}

function applyBizTabActive(idx) {
  bizTabs.forEach((tab, i) => {
    const active = i === idx;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  const activeTab = bizTabs[idx];
  if (activeTab && bizPanel) bizPanel.setAttribute("aria-labelledby", activeTab.id);
}

function updateBusinessUI(idx, alsoBoards = true) {
  if (!bizTabs.length) return;
  const tab = bizTabs[idx];
  if (!tab) return;

  const title = tab.dataset.title || tab.textContent?.trim() || "Business";
  let desc  = tab.dataset.desc  || "";
  const link  = tab.dataset.link  || "";
  if (!desc || desc.trim() === "") {
    try {
      const tr = getI18nForBusiness();
      const key = tab.dataset.key || (tab.id || '').replace('tab-','');
      if (tr && key) {
        const node = tr.business && tr.business[key];
        if (node && node.desc) desc = node.desc; else desc = FALLBACK_EN.business[key]?.desc || '';
      }
    } catch(_) {}
  }
  if (bizTitle) bizTitle.textContent = title;
  if (bizDesc)  bizDesc.innerHTML  = desc;

  // ✅ リンクボタンの切り替え
  if (bizLinkBtn) {
    bizLinkBtn.setAttribute("href", link);
    try {
      const btnLabel = (getI18nForBusiness().business?.btn) || FALLBACK_EN.business.btn;
      bizLinkBtn.textContent = btnLabel;
      bizLinkBtn.setAttribute('aria-label', `${title} ${btnLabel}`);
    } catch(_) {}
  }

  // Consultタブ選択時は「詳しく見る」ボタンを非表示にし、リンクを無効化
  try {
    const keyForBtn = tab.dataset.key || (tab.id || '').replace('tab-','');
    if (bizLinkBtn) {
      if (!link || keyForBtn === 'consult') {
        bizLinkBtn.style.display = 'none';
        bizLinkBtn.removeAttribute('href');
        bizLinkBtn.setAttribute('aria-hidden', 'true');
      } else {
        bizLinkBtn.style.display = '';
        bizLinkBtn.removeAttribute('aria-hidden');
      }
    }
  } catch(_) {}

  applyBizTabActive(idx);

  if (alsoBoards) {
    const isBusinessActive = getActiveIndex() === businessSectionIndex;
    if (isBusinessActive) {
      const l = tab.dataset.visionLeft   || "";
      const c = tab.dataset.visionCenter || "";
      const r = tab.dataset.visionRight  || "";
      setBoard(boards.left, l);
      setBoard(boards.center, c);
      setBoard(boards.right, r);
      lastAppliedBizIndex = idx;
    }
  }
}

// タブ操作
bizTabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    if (getActiveIndex() !== businessSectionIndex) return; // Business以外では反応無効
    bizSelectedIndex = i;
    updateBusinessUI(bizSelectedIndex, true);
  });
  tab.addEventListener("keydown", (e) => {
    if (getActiveIndex() !== businessSectionIndex) return;
    if (["ArrowRight","ArrowDown"].includes(e.key)) {
      e.preventDefault();
      bizSelectedIndex = (bizSelectedIndex + 1) % bizTabs.length;
      bizTabs[bizSelectedIndex].focus();
      updateBusinessUI(bizSelectedIndex, true);
    } else if (["ArrowLeft","ArrowUp"].includes(e.key)) {
      e.preventDefault();
      bizSelectedIndex = (bizSelectedIndex - 1 + bizTabs.length) % bizTabs.length;
      bizTabs[bizSelectedIndex].focus();
      updateBusinessUI(bizSelectedIndex, true);
    } else if (["Enter"," "].includes(e.key)) {
      e.preventDefault();
      updateBusinessUI(bizSelectedIndex, true);
    }
  });
});

// ============================
// 🧭 スナップスクロール（2ステップ）
// ============================
const SNAP_LOCK_MS = 500;
let snapLock = false;
const WHEEL_UNIT = 120;
const MIN_DELTA = 30;
const STEPS_PER_SWITCH = 2;

let wheelAccumAbs = 0;
let sectionSteps = 0;
let lastDir = 0;

let bizWheelAccumAbs = 0;
let bizSteps = 0;
let bizLastDir = 0;

function resetSectionCount() { wheelAccumAbs = 0; sectionSteps = 0; }
function resetBizCount() { bizWheelAccumAbs = 0; bizSteps = 0; }

function snapWithinBusinessBySteps(dir) {
  if (!bizTabs.length) return;
  if (dir > 0) {
    if (bizSelectedIndex < bizTabs.length - 1) {
      bizSelectedIndex++;
      updateBusinessUI(bizSelectedIndex, true);
    } else {
      scrollToIndex(businessSectionIndex + 1);
    }
  } else {
    if (bizSelectedIndex > 0) {
      bizSelectedIndex--;
      updateBusinessUI(bizSelectedIndex, true);
    } else {
      scrollToIndex(businessSectionIndex - 1);
    }
  }
}

function snapGlobalBySteps(dir) {
  const current = getActiveIndex();
  const next = Math.min(sections.length - 1, Math.max(0, current + dir));
  if (next !== current) scrollToIndex(next);
}

function handleSnap(deltaY) {
  if (snapLock) return;

  const dir = deltaY > 0 ? 1 : -1;
  if (Math.abs(deltaY) < MIN_DELTA) return;

  const inBusiness = getActiveIndex() === businessSectionIndex;

  if (inBusiness) {
    if (dir !== bizLastDir) { resetBizCount(); bizLastDir = dir; }
    bizWheelAccumAbs += Math.abs(deltaY);
    while (bizWheelAccumAbs >= WHEEL_UNIT) { bizWheelAccumAbs -= WHEEL_UNIT; bizSteps += 1; }
    if (bizSteps >= STEPS_PER_SWITCH) {
      bizSteps = 0; snapLock = true; snapWithinBusinessBySteps(dir);
      setTimeout(() => { snapLock = false; }, SNAP_LOCK_MS);
    }
  } else {
    if (dir !== lastDir) { resetSectionCount(); lastDir = dir; }
    wheelAccumAbs += Math.abs(deltaY);
    while (wheelAccumAbs >= WHEEL_UNIT) { wheelAccumAbs -= WHEEL_UNIT; sectionSteps += 1; }
    if (sectionSteps >= STEPS_PER_SWITCH) {
      sectionSteps = 0; snapLock = true; snapGlobalBySteps(dir);
      setTimeout(() => { snapLock = false; }, SNAP_LOCK_MS);
    }
  }
}

// セクション表示更新
const singleVTitle = document.createElement("div");
singleVTitle.className = "vtitle-single";
document.body.appendChild(singleVTitle);

function updateVerticalTitle(activeIndex) {
  const sec = sections[activeIndex];
  if (!sec) return;
  // Do not show vertical title on Hero section
  if (sec.id === "hero") {
    singleVTitle.textContent = "";
    singleVTitle.classList.remove("show");
    return;
  }
  const title = sec.querySelector("h2")?.textContent || sec.getAttribute("aria-label") || "";
  if (title) { singleVTitle.textContent = title; singleVTitle.classList.add("show"); }
  else { singleVTitle.textContent = ""; singleVTitle.classList.remove("show"); }
}

let previousActiveIndex = -1;
function onScroll() {
  const active = getActiveIndex();

  sections.forEach((sec, i) => sec.classList.toggle("visible", i === active));
  navItems.forEach((item, i) => {
    item.classList.toggle("active", i === active);
    item.setAttribute("aria-current", i === active ? "true" : "false");
  });

  updateVerticalTitle(active);

  const sec = sections[active];
  const leftBoard  = document.querySelector(".billboard--left");
  const rightBoard = document.querySelector(".billboard--right");
  const heroLogo = document.querySelector(".hero-logo-container");
  const overlay = document.querySelector(".overlay");
  const sectionNav = document.querySelector(".section-nav");
  const footerEl = document.querySelector(".main-footer");

  if (sec?.id === "hero") {
    if (heroLogo) { heroLogo.style.opacity = "1"; heroLogo.style.transform = "translateX(-50%) scale(1)"; }
    if (overlay) overlay.classList.add("hidden");
    if (sectionNav) sectionNav.classList.add("hidden-nav");
    singleVTitle.classList.remove("show");
  } else {
    if (heroLogo) { heroLogo.style.opacity = "0"; heroLogo.style.transform = "translateX(-50%) scale(0.9)"; }
    if (overlay) overlay.classList.remove("hidden");
    if (sectionNav) sectionNav.classList.remove("hidden-nav");
  }

  if (sec?.id === "business") {
    leftBoard.classList.add("business-left-resize", "no-frame-glow");
    rightBoard.classList.add("business-right-resize");
  } else {
    leftBoard.classList.remove("business-left-resize", "no-frame-glow");
    rightBoard.classList.remove("business-right-resize");
  }

  // フッターはフッターセクションのときのみ前面・操作可にする
  if (footerEl) {
    if (sec?.id === "footer") {
      footerEl.style.display = "flex";
      footerEl.classList.add("active");
    } else {
      footerEl.style.display = "none";
      footerEl.classList.remove("active");
    }
  }

  // Bizタブ有効・無効（視覚）＋ボタンクリック制御
  const bizTabContainer = document.querySelector(".biz-tabs");
  if (bizTabContainer) {
    if (sec?.id === "business") {
      bizTabContainer.style.pointerEvents = "auto";
      bizTabContainer.style.opacity = "1";
      bizTabContainer.style.filter = "none";
      if (bizLinkBtn) {
        bizLinkBtn.style.pointerEvents = "auto";
        bizLinkBtn.style.opacity = "1";
      }
    } else {
      bizTabContainer.style.pointerEvents = "none";
      bizTabContainer.style.opacity = "0.4";
      bizTabContainer.style.filter = "grayscale(60%)";
      if (bizLinkBtn) {
        bizLinkBtn.style.pointerEvents = "none";
        bizLinkBtn.style.opacity = "0.6";
      }
    }
  }

  if (active !== businessSectionIndex) {
    setBoard(boards.left, sec?.dataset?.visionLeft || "");
    setBoard(boards.center, sec?.dataset?.visionCenter || "");
    setBoard(boards.right, sec?.dataset?.visionRight || "");
    previousActiveIndex = active;
    return;
  }

  if (previousActiveIndex !== businessSectionIndex || lastAppliedBizIndex !== bizSelectedIndex) {
    updateBusinessUI(bizSelectedIndex, true);
  }
  previousActiveIndex = active;
}

window.addEventListener("scroll", onScroll);

// 入力イベント
window.addEventListener("wheel", (e) => handleSnap(e.deltaY), { passive: true });

// タッチ
let touchStartY = null;
window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
window.addEventListener("touchend", (e) => {
  if (touchStartY == null) return;
  const endY = e.changedTouches[0].clientY;
  const diff = touchStartY - endY;
  touchStartY = null;

  const dir = diff > 0 ? 1 : -1;
  if (Math.abs(diff) < 40) return;

  const inBusiness = getActiveIndex() === businessSectionIndex;

  if (inBusiness) {
    if (dir !== bizLastDir) { resetBizCount(); bizLastDir = dir; }
    bizSteps += 1;
    if (bizSteps >= STEPS_PER_SWITCH) {
      bizSteps = 0;
      if (snapLock) return;
      snapLock = true;
      snapWithinBusinessBySteps(dir);
      setTimeout(() => { snapLock = false; }, SNAP_LOCK_MS);
    }
  } else {
    if (dir !== lastDir) { resetSectionCount(); lastDir = dir; }
    sectionSteps += 1;
    if (sectionSteps >= STEPS_PER_SWITCH) {
      sectionSteps = 0;
      if (snapLock) return;
      snapLock = true;
      snapGlobalBySteps(dir);
      setTimeout(() => { snapLock = false; }, SNAP_LOCK_MS);
    }
  }
}, { passive: true });

// キーボード
window.addEventListener("keydown", (e) => {
  if (!["ArrowDown","PageDown","ArrowUp","PageUp"," "].includes(e.key) && e.key !== "Home" && e.key !== "End") return;
  if (e.key === "Home") { e.preventDefault(); scrollToIndex(0); return; }
  if (e.key === "End")  { e.preventDefault(); scrollToIndex(sections.length - 1); return; }

  e.preventDefault();
  const dir = (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") ? 1 : -1;

  const inBusiness = getActiveIndex() === businessSectionIndex;

  if (inBusiness) {
    if (dir !== bizLastDir) { resetBizCount(); bizLastDir = dir; }
    bizSteps += 1;
    if (bizSteps >= STEPS_PER_SWITCH) {
      bizSteps = 0;
      if (snapLock) return;
      snapLock = true;
      snapWithinBusinessBySteps(dir);
      setTimeout(() => { snapLock = false; }, SNAP_LOCK_MS);
    }
  } else {
    if (dir !== lastDir) { resetSectionCount(); lastDir = dir; }
    sectionSteps += 1;
    if (sectionSteps >= STEPS_PER_SWITCH) {
      sectionSteps = 0;
      if (snapLock) return;
      snapLock = true;
      snapGlobalBySteps(dir);
      setTimeout(() => { snapLock = false; }, SNAP_LOCK_MS);
    }
  }
});

// 初期化
(function init() {
  onScroll();
  if (businessSectionIndex >= 0) updateBusinessUI(bizSelectedIndex, false);
  // If page loaded with #business, snap to Business section
  try {
    if (location.hash === '#business' && businessSectionIndex >= 0) {
      setTimeout(() => scrollToIndex(businessSectionIndex), 50);
    }
    // React to future hash changes
    window.addEventListener('hashchange', () => {
      if (location.hash === '#business' && businessSectionIndex >= 0) {
        scrollToIndex(businessSectionIndex);
      }
    });
  } catch(_) {}
})();

// スクロールヒント
let scrollTimeout;
const scrollHint = document.getElementById("scrollHint");
function showScrollHint() { if (!scrollHint.classList.contains("visible")) scrollHint.classList.add("visible"); }
function hideScrollHint() { scrollHint.classList.remove("visible"); }
window.addEventListener("scroll", () => { hideScrollHint(); clearTimeout(scrollTimeout); scrollTimeout = setTimeout(showScrollHint, 3000); });

// 🌟 About演出（既存）
const aboutSection = document.getElementById("about");
const aboutText = document.getElementById("aboutText");
const particle = document.querySelector(".particle");
const catchPhrase = document.querySelector(".catch_phrase_about"); 

if (aboutSection && aboutText && particle) {
  let originalText = aboutText.getAttribute('data-original') || aboutText.innerHTML;
  const getOriginalText = () => aboutText.getAttribute('data-original') || originalText;
  const glyphs = "ꙮ𓂀𓆑𓏤𓈖𓃭𓋹𓎛𓊃𓅓𓍿𓐍𓄿𓏪𓎼𓋴𓏏𓈉";
  const aboutIndex = Array.from(sections).findIndex(s => s === aboutSection);
  let isActivated = false; let hasScrolled = false; let timer = null;

  aboutText.innerHTML = getOriginalText().replace(/[^\s<>\n]/g, () =>
    glyphs[Math.floor(Math.random() * glyphs.length)]
  );

  if (catchPhrase) { catchPhrase.style.opacity = "0"; catchPhrase.style.transition = "opacity 1s ease"; }

  window.addEventListener("scroll", () => {
    if (!hasScrolled && window.scrollY > 0) hasScrolled = true;
    if (!hasScrolled || isActivated) return;

    const active = getActiveIndex();
    if (active === aboutIndex) {
      if (!timer) {
        timer = setTimeout(() => {
          const current = getActiveIndex();
          if (current === aboutIndex) {
            isActivated = true;
            particle.classList.add("active");
            decodeText();
            if (catchPhrase) { setTimeout(() => { catchPhrase.style.opacity= "1"; }, 2000); }
} else {
timer = null;
}
}, 500);
}
} else {
if (timer) { clearTimeout(timer); timer = null; }
}
});

function decodeText() {
const duration = 3000;
const startTime = performance.now();
const base = getOriginalText();
const revealed = new Array(base.length).fill(false);
function update(now) {
  const progress = Math.min(1, (now - startTime) / duration);
  let newText = "";
  for (let i = 0; i < base.length; i++) {
    const char = base[i];
    if (!char.match(/[^\s<>\n]/)) { newText += char; continue; }
    if (!revealed[i] && Math.random() < progress * 0.35) { revealed[i] = true; }
    newText += revealed[i] ? char : glyphs[Math.floor(Math.random() * glyphs.length)];
  }
  aboutText.innerHTML = newText;
  if (progress < 1) requestAnimationFrame(update);
}
requestAnimationFrame(update);
}
}

// 初回も3秒後にヒント表示
scrollTimeout = setTimeout(showScrollHint, 3000);
