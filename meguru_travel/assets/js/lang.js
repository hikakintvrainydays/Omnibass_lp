// ============================================
// 🌐 Simple i18n (rebuilt from scratch)
// Default language: English
// Exposes window.TT: { getLang, setLang, translations, t }
// Fires: i18n:ready, i18n:change
// ============================================
(function(){
  const translations = {
    en: {
      nav: { business: 'Business', about: 'About', contact: 'Contact' },
      business: {
        title: 'Business',
        tour:    { title: 'Custom Tour',       desc: 'We offer fully customized tours designed for each guest.<br>Experience authentic culture and meaningful local connections through carefully curated moments.<br>Our English-fluent guides are entertainers who create memorable journeys, not just sightseeing tours.' },
        route:   { title: 'ToruRoute',         desc: 'Bringing the local spirit to the world.<br>ToruRoute is a digital portal that connects travelers with local restaurants and experiences —<br>capturing the charm of each area through photos, stories, and genuine recommendations.' },
        consult: { title: 'Inbound Consulting', desc: 'We work alongside local tourism, dining, and hospitality partners —<br>helping them rediscover and share their unique charm with the world.<br>From inbound strategy to experience design and branding, we act as a creative partner that communicates true local value.' },
        btn: 'Learn more'
      },
      about: {
        title: 'About Us',
        heading: 'Our Vision',
        text: 'Crossing language barriers with learning and heart.<br>Connecting travelers and local communities from Kyoto and Uji to the world.',
        btn: 'Learn more'
      },
      footer: {
        tagline: 'Your next journey begins here.',
        contact: 'Contact',
        copyright: '© 2025 Toru Tour. All rights reserved.'
      },
      aboutPage: {
        heroTitle: 'About Us',
        mission: {
          title: 'Mission',
          sub: 'Connecting the world and local communities through travel.',
          desc: 'We share the pride and warmth of each region,<br>creating journeys of mutual learning and growth.'
        },
        vision: {
          title: 'Vision',
          sub: 'Building bridges between communities and the world.',
          desc: 'Through travel, Toru Tour creates a cycle of growth — where people learn, connect, and make regions shine.<br>We believe tourism is not just about showcasing places, but about co-creating culture together.'
        },
        value: {
          title: 'Value',
          desc: '- <strong>Authenticity | Sharing what’s real</strong><br>  We communicate the true voices and culture of each community.<br>- <strong>Empathy | Connecting through heart</strong><br>  Building relationships that resonate between locals and travelers.<br>- <strong>Growth | Growing together</strong><br>  Every journey is a chance to learn, evolve, and inspire the next generation.'
        },
        greeting: {
          sub: 'MESSAGE FROM CEO',
          title: 'Message',
          people: [
            {
              name: 'CEO — Toru Yoshizaki',
              lines: [
                'Travel is a continuous journey of encounters and learning.<br>We aim to create journeys that connect hearts between regions and the world.',
                'By sharing local voices and culture as they are, travelers can experience the “real Japan,”<br>and those experiences bring both learning and pride to local communities.'
              ],
              signature: 'Toru Tour Inc.<br>CEO: Toru Yoshizaki'
            },
            {
              name: 'Yamato Takeuchi',
              lines: [
                'We value co-creation through travel.<br>We believe the future of tourism will evolve when travelers and communities learn from each other.',
                'And someday — beyond language, culture, or even planets —<br>we hope to create journeys where we could connect hearts with beings from outer space.'
              ],
              signature: 'Toru Tour Inc.<br>Yamato Takeuchi'
            }
          ]
        },
        company: {
          title: 'Company Profile',
          th: { name: 'Company Name', founded: 'Founded', addr: 'Location', business: 'Business Areas', rep: 'CEO', contact: 'Contact' },
          values: {
            name: 'Toru Tour Inc.',
            founded: '2025',
            addr: 'Hikone, Shiga, Japan',
            business: 'Inbound tourism / Tour planning / Regional promotion / Web design & media support',
            rep: 'Toru Yoshizaki',
            contact: 'torutour81@gmail.com'
          }
        },
        footer: { home: 'Home', business: 'Business', company: 'Company', contact: 'Contact' }
      },
      contactPage: {
        title: 'Contact',
        desc: 'Please send your questions or requests using the form below.',
        form: { name: 'Name', email: 'Email', message: 'Message (optional)', submit: 'Send' },
        footer: { home: 'Home', business: 'Business', company: 'Company', contact: 'Contact' }
      }
    },
    ja: {
      nav: { business: '事業紹介', about: '私たちについて', contact: 'お問い合わせ' },
      business: {
        title: '事業紹介',
        tour:    { title: 'カスタマイズツアー',     desc: 'お客様一人ひとりに合わせた、完全オーダーメイドの旅を提供します。<br>地域の文化や人とのつながりを深く感じられる特別な体験をご用意。<br>ガイドは流暢な英語を話し、観光を超えた“心に残る物語”を演出するエンターテイナーです。' },
        route:   { title: 'ToruRoute',           desc: '地域の“今”を世界へ。<br>ToruRouteは、地元の飲食店や体験スポットを写真やレビューで紹介する、<br>地域と旅人をつなぐデジタルポータルです。<br>現地の魅力をわかりやすく伝え、訪れるきっかけを生み出します。' },
        consult: { title: 'インバウンドコンサルティング', desc: '観光・飲食・宿泊事業者さまと共に、<br>地域の魅力を見つめ直し、世界へ伝えるお手伝いをしています。<br>海外からの集客や体験設計、ブランド発信まで、“魅力を伝えるパートナー”として伴走します。' },
        btn: '詳しく見る'
      },
      about: {
        title: '私たちについて',
        heading: 'Toru Tourの想い',
        text: '言葉の壁を、学びと心で越える。<br>京都・宇治から、世界中の旅人と地域をつなぎます。',
        btn: '詳しく見る'
      },
      footer: {
        tagline: '次の旅が、ここから始まる。',
        contact: 'お問い合わせ',
        copyright: '© 2025 Toru Tour. All rights reserved.'
      },
      aboutPage: {
        heroTitle: '私たちについて',
        mission: {
          title: 'Mission',
          sub: '旅を通じて、世界と地域をつなぐ。',
          desc: '私たちは、地域の誇りと人の温かさを世界へ届け、<br>学び合い、共に成長する旅の形を創ります。'
        },
        vision: {
          title: 'Vision',
          sub: '地域と世界のあいだに、心の橋をかける。',
          desc: 'Toru Tourは、旅を通じて人が育ち、地域が輝く“つながりの循環”を生み出します。<br>私たちは、観光を「伝える仕事」から「共に創る文化」へと進化させていきます。'
        },
        value: {
          title: 'Value',
          desc: '・<strong>Authenticity｜本質を伝える</strong><br>　地域の声と文化を、飾らずまっすぐに届ける。<br>・<strong>Empathy｜心でつながる</strong><br>　人と人、地域と旅人が共に響き合う関係を築く。<br>・<strong>Growth｜共に育つ</strong><br>　旅を通じて、学び、挑戦し、次の世代へつなぐ。'
        },
        greeting: {
          sub: 'MESSAGE FROM CEO',
          title: '代表挨拶',
          people: [
            {
              name: '吉崎 徹（代表取締役）',
              lines: [
                '旅は、出会いと学びの連続です。<br>私たちは、地域と世界の“心をつなぐ”旅を創ることを目指しています。',
                '地元の声や文化をそのまま伝えることで、旅人が「本当の日本」を体験できるように。<br>そしてその体験が、地域の人々にとっても新たな誇りと学びになるように。'
              ],
              signature: '株式会社Toru Tour<br>代表取締役　吉崎 徹'
            },
            {
              name: '竹内 大和',
              lines: [
                '私たちは「旅を通じた共創」を大切にしています。<br>旅人と地域が互いに学び合うことで、未来の観光が変わると信じています。',
                'そしていつか——言葉も文化も超えて、宇宙人とでも語り合えるような、<br>そんな心の通じる旅を創り続けたいと思っています。'
              ],
              signature: '株式会社Toru Tour<br>竹内 大和'
            }
          ]
        },
        company: {
          title: '会社概要',
          th: { name: '会社名', founded: '設立', addr: '所在地', business: '事業内容', rep: '代表取締役', contact: '連絡先' },
          values: {
            name: '株式会社Toru Tour',
            founded: '2025年',
            addr: '滋賀県彦根市',
            business: 'インバウンド観光 / ツアー企画 / 地域プロモーション / Web制作・運営支援',
            rep: '吉崎 徹',
            contact: 'torutour81@gmail.com'
          }
        },
        footer: { home: 'トップ', business: '事業紹介', company: '会社概要', contact: 'お問い合わせ' }
      },
      contactPage: {
        title: 'お問い合わせ',
        desc: 'ご質問・ご相談は以下のフォームからお送りください。',
        form: { name: '氏名', email: 'メールアドレス', message: 'メッセージ（任意）', submit: '送信' },
        footer: { home: 'トップ', business: '事業紹介', company: '会社概要', contact: 'お問い合わせ' }
      }
    }
  };

  // Add thanks page translations
  translations.en.thanksPage = {
    title: 'Thank you',
    desc: 'Your message has been sent successfully.',
    back: 'Back to Home'
  };
  translations.ja.thanksPage = {
    title: 'ありがとうございます',
    desc: 'お問い合わせ内容を送信しました。担当者より追ってご連絡いたします。',
    back: 'トップへ戻る'
  };

  const getLangFromUrl = () => {
    try {
      const p = new URLSearchParams(location.search);
      const v = p.get('lang');
      return (v === 'ja' || v === 'en') ? v : null;
    } catch(_) { return null; }
  };

  let lang = getLangFromUrl() || 'en';

  const t = (path) => {
    try {
      const parts = path.split('.');
      let node = translations[lang];
      for (const k of parts) { node = node?.[k]; if (node == null) break; }
      return (typeof node === 'string') ? node : '';
    } catch(_) { return ''; }
  };

  const setText = (sel, val) => { const el = document.querySelector(sel); if (el && typeof val === 'string') el.textContent = val; };
  const setHTML = (sel, val) => { const el = document.querySelector(sel); if (el && typeof val === 'string') el.innerHTML = val; };

  function apply() {
    try { document.documentElement.setAttribute('lang', lang); } catch(_){}

    // Header + Mobile nav
    ['nav#siteNav', 'nav.main-nav'].forEach(ns => {
      const root = document.querySelector(ns);
      if (!root) return;
      const businessLinks = root.querySelectorAll('a[href="#business"], a[href="index.html#business"]');
      businessLinks.forEach(a => { a.textContent = t('nav.business'); });
      const aboutA   = root.querySelector('a[href="about.html"]'); if (aboutA) aboutA.textContent = t('nav.about');
      const contactA = root.querySelector('.contact-link');        if (contactA) contactA.textContent = t('nav.contact');
    });

    // Business
    const biz = document.getElementById('business');
    if (biz) {
      const h2 = biz.querySelector('h2'); if (h2) h2.textContent = t('business.title');
      const tabs = biz.querySelectorAll('.biz-tab');
      const map = ['tour','route','consult'];
      tabs.forEach((tab, i) => {
        const key = map[i]; if (!key) return;
        const title = t(`business.${key}.title`);
        const desc  = t(`business.${key}.desc`);
        // 表示ラベル（メニュー）は consult のみ 'Partner' 固定
        if (key === 'consult') {
          tab.textContent = 'Partner';
        } else if (title) {
          tab.textContent = title;
        }
        // パネル側で使うタイトル・説明は従来の翻訳を維持
        if (title) tab.dataset.title = title; else tab.dataset.title = '';
        if (desc)  tab.dataset.desc  = desc;  else tab.dataset.desc  = '';
      });
    }

    // About
    const about = document.getElementById('about');
    if (about) {
      setText('#about h2', t('about.title'));
      setText('#about .about-card__title', t('about.heading'));
      const txt = about.querySelector('.about-card__text');
      if (txt) { const v = t('about.text'); txt.setAttribute('data-original', v); txt.innerHTML = v; }
      setText('#about .about-card__cta a', t('about.btn'));
    }

    // Contact page
    const contact = document.getElementById('contact');
    if (contact) {
      setText('#contact .about-title', t('contactPage.title'));
      const descEl = contact.querySelector('.about-desc'); if (descEl) descEl.innerHTML = t('contactPage.desc');
      const nameLabel = contact.querySelector('label[for="your-name"]');
      const emailLabel = contact.querySelector('label[for="your-email"]');
      const msgLabel = contact.querySelector('label[for="your-message"]');
      const btn = contact.querySelector('#submitBtn');
      const req = '<span class="required">*</span>';
      if (nameLabel) nameLabel.innerHTML = `${t('contactPage.form.name')} ${req}`;
      if (emailLabel) emailLabel.innerHTML = `${t('contactPage.form.email')} ${req}`;
      if (msgLabel) msgLabel.textContent = t('contactPage.form.message');
      if (btn) btn.textContent = t('contactPage.form.submit');
    }

    // Thanks page
    const thanks = document.getElementById('thanks');
    if (thanks) {
      setText('#thanks .about-title', t('thanksPage.title'));
      const d = thanks.querySelector('.about-desc');
      if (d) d.innerHTML = t('thanksPage.desc');
      const back = thanks.querySelector('.back-home');
      if (back) {
        back.textContent = t('thanksPage.back');
        try {
          const lang = (window.TT && typeof window.TT.getLang === 'function') ? window.TT.getLang() : 'en';
          back.setAttribute('href', `index.html?lang=${lang}`);
        } catch(_) {}
      }
    }

    // Footer links (global: applies to contact/about pages)
    (function updateSiteFooter(){
      const fnav = document.querySelector('.site-footer .footer-links');
      if (!fnav) return;
      const fdict = (translations[lang] && (translations[lang].contactPage?.footer || translations[lang].aboutPage?.footer)) || null;
      fnav.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (/index\.html$/.test(href)) a.textContent = (fdict && fdict.home) || t('aboutPage.footer.home');
        else if (/index\.html#business/.test(href) || href === '#business') a.textContent = (fdict && fdict.business) || t('aboutPage.footer.business');
        else if (/#company$/.test(href)) a.textContent = (fdict && fdict.company) || t('aboutPage.footer.company');
        else if (/contact\.html$/.test(href)) a.textContent = (fdict && fdict.contact) || t('aboutPage.footer.contact');
      });
      const copy = document.querySelector('.site-footer .footer-copy');
      if (copy) copy.textContent = t('footer.copyright');
    })();

    // Footer
    setText('#footer .footer-tagline', t('footer.tagline'));
    setText('#footer .footer-contact-link', t('footer.contact'));
    setText('#footer .copyright', t('footer.copyright'));

    // About page (about.html) specific
    if (document.querySelector('.about-hero-section')) {
      // Hero
      setText('.about-hero-title', t('aboutPage.heroTitle'));

      // Mission
      const ms = document.getElementById('mission');
      if (ms) {
        const tt = ms.querySelector('.about-title'); if (tt) tt.textContent = t('aboutPage.mission.title');
        const sb = ms.querySelector('.about-sub');   if (sb) sb.textContent = t('aboutPage.mission.sub');
        const ds = ms.querySelector('.about-desc');  if (ds) ds.innerHTML   = t('aboutPage.mission.desc');
      }

      // Vision
      const vs = document.getElementById('vision');
      if (vs) {
        const tt = vs.querySelector('.about-title'); if (tt) tt.textContent = t('aboutPage.vision.title');
        const sb = vs.querySelector('.about-sub');   if (sb) sb.textContent = t('aboutPage.vision.sub');
        const ds = vs.querySelector('.about-desc');  if (ds) ds.innerHTML   = t('aboutPage.vision.desc');
      }

      // Value
      const vl = document.getElementById('value');
      if (vl) {
        const tt = vl.querySelector('.about-title'); if (tt) tt.textContent = t('aboutPage.value.title');
        const ds = vl.querySelector('.about-desc');  if (ds) ds.innerHTML   = t('aboutPage.value.desc');
      }

      // Greeting header
      const gr = document.getElementById('greeting');
      if (gr) {
        const sb = gr.querySelector('.about-greeting-sub');   if (sb) sb.textContent = t('aboutPage.greeting.sub');
        const tt = gr.querySelector('.about-greeting-title'); if (tt) tt.textContent = t('aboutPage.greeting.title');
        // People cards
        const cards = gr.querySelectorAll('.greeting-card');
        const ppl = (translations[lang] && translations[lang].aboutPage && translations[lang].aboutPage.greeting && translations[lang].aboutPage.greeting.people) || [];
        cards.forEach((card, i) => {
          const data = ppl[i];
          if (!data) return;
          const nameEl = card.querySelector('.greeting-name');
          if (nameEl && data.name) nameEl.textContent = data.name;
          const textWrap = card.querySelector('.greeting-text');
          if (textWrap) {
            const paras = Array.from(textWrap.querySelectorAll('p:not(.greeting-signature)'));
            const lines = Array.isArray(data.lines) ? data.lines : [];
            paras.forEach((p, j) => { p.innerHTML = lines[j] || ''; });
            const sig = textWrap.querySelector('p.greeting-signature');
            if (sig && data.signature) sig.innerHTML = data.signature;
          }
        });
      }

      // Company profile
      const cp = document.getElementById('company');
      if (cp) {
        const tt = cp.querySelector('.about-profile-title'); if (tt) tt.textContent = t('aboutPage.company.title');
        const rows = cp.querySelectorAll('.about-table tr');
        const ths = [
          t('aboutPage.company.th.name'),
          t('aboutPage.company.th.founded'),
          t('aboutPage.company.th.addr'),
          t('aboutPage.company.th.business'),
          t('aboutPage.company.th.rep'),
          t('aboutPage.company.th.contact')
        ];
        rows.forEach((tr, i) => { const th = tr.querySelector('th'); if (th && ths[i]) th.textContent = ths[i]; });

        // Set td values per language
        const vals = [
          translations[lang]?.aboutPage?.company?.values?.name || '',
          translations[lang]?.aboutPage?.company?.values?.founded || '',
          translations[lang]?.aboutPage?.company?.values?.addr || '',
          translations[lang]?.aboutPage?.company?.values?.business || '',
          translations[lang]?.aboutPage?.company?.values?.rep || '',
          translations[lang]?.aboutPage?.company?.values?.contact || ''
        ];
        rows.forEach((tr, i) => { const td = tr.querySelector('td'); if (td && vals[i] !== '') td.textContent = vals[i]; });
      }

      // Footer links (applies to about/contact pages)
      const fnav = document.querySelector('.site-footer .footer-links');
      if (fnav) {
        const fdict = (translations[lang] && (translations[lang].contactPage?.footer || translations[lang].aboutPage?.footer)) || null;
        fnav.querySelectorAll('a').forEach(a => {
          const href = a.getAttribute('href') || '';
          if (/index\.html$/.test(href)) a.textContent = (fdict && fdict.home) || t('aboutPage.footer.home');
          else if (/index\.html#business/.test(href) || href === '#business') a.textContent = (fdict && fdict.business) || t('aboutPage.footer.business');
          else if (/#company$/.test(href)) a.textContent = (fdict && fdict.company) || t('aboutPage.footer.company');
          else if (/contact\.html$/.test(href)) a.textContent = (fdict && fdict.contact) || t('aboutPage.footer.contact');
        });
        // Copyright (shared)
        const copy = document.querySelector('.site-footer .footer-copy');
        if (copy) copy.textContent = t('footer.copyright');
      }
    }

    // Title
    document.title = (lang === 'en') ? 'Toru Tour | Official Site' : 'Toru Tour｜公式サイト';

    // Sync selects
    const ds = document.getElementById('langSelectDesktop'); if (ds) ds.value = lang;
    const ms = document.getElementById('langSelectMobile');  if (ms) ms.value = lang;

    // Notify others
    try { window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } })); } catch(_){}
  }

  function setLang(next) {
    lang = (next === 'ja') ? 'ja' : 'en';
    try { const url = new URL(location.href); url.searchParams.set('lang', lang); history.replaceState(null, '', url.toString()); } catch(_){ }
    apply();
  }

  function init() {
    apply();
    const ds = document.getElementById('langSelectDesktop'); if (ds) ds.addEventListener('change', e => setLang(e.target.value));
    const ms = document.getElementById('langSelectMobile');  if (ms) ms.addEventListener('change', e => setLang(e.target.value));
    try { window.dispatchEvent(new CustomEvent('i18n:ready', { detail: { lang } })); } catch(_){}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  // Minimal global API
  window.TT = { getLang: () => lang, setLang, translations, t };
})();
