/**
 * SEOヘルパー: 各ページのメタタグ・OG・Twitter Card・JSON-LD構造化データを動的に挿入する。
 *
 * 詳細ページ（記事）の場合は、microCMSから取得したdata（title/excerpt/publishedAt等）を
 * もとに記事ごとのメタ情報を生成する。
 */
(function (global) {
    const SITE = {
        name: 'OMNIBASS',
        url: 'https://biwako-omnibass.com',
        logo: 'https://biwako-omnibass.com/images/omnibass_logo.png',
        twitter: '@omnibass',
        description: '株式会社OMNIBASS（オムニバス）は滋賀・京都を拠点に、中小企業のDX支援・AIエージェント活用・ローコード開発を一貫して支援します。',
        organization: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: '株式会社OMNIBASS',
            alternateName: 'OMNIBASS',
            url: 'https://biwako-omnibass.com',
            logo: 'https://biwako-omnibass.com/images/omnibass_logo.png',
            sameAs: ['https://digital-yamato-dx.jp/'],
            address: {
                '@type': 'PostalAddress',
                addressCountry: 'JP',
                addressRegion: '京都府',
                addressLocality: '京都市下京区',
                streetAddress: '大黒町227番地 第2キョートビル402'
            },
            foundingDate: '2026-04-28',
            taxID: '9130001082033'
        }
    };

    function setText(selector, text) {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    }

    function setMeta(name, content, isProperty) {
        if (!content) return;
        const attr = isProperty ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    }

    function setLink(rel, href) {
        if (!href) return;
        let el = document.querySelector(`link[rel="${rel}"]`);
        if (!el) {
            el = document.createElement('link');
            el.setAttribute('rel', rel);
            document.head.appendChild(el);
        }
        el.setAttribute('href', href);
    }

    function injectJsonLd(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    /**
     * Article詳細ページのSEO設定を反映。
     * @param {object} opts
     *  - title, description, image, publishedAt, modifiedAt
     *  - path: '/news/?id=xxx' のようなパス
     *  - articleSection: 'ニュース' | '記事' | 'DXコラム'
     *  - keywords: string[]
     */
    function applyArticle(opts) {
        const url = SITE.url + (opts.path || '');
        const fullTitle = `${opts.title} | ${SITE.name}`;
        document.title = fullTitle;

        setMeta('description', opts.description);
        setMeta('keywords', (opts.keywords || []).join(','));

        // OG
        setMeta('og:title', fullTitle, true);
        setMeta('og:description', opts.description, true);
        setMeta('og:type', 'article', true);
        setMeta('og:url', url, true);
        setMeta('og:image', opts.image || SITE.logo, true);
        setMeta('og:site_name', SITE.name, true);
        setMeta('og:locale', 'ja_JP', true);

        // Twitter
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', fullTitle);
        setMeta('twitter:description', opts.description);
        setMeta('twitter:image', opts.image || SITE.logo);

        // canonical
        setLink('canonical', url);

        // JSON-LD: Article
        const articleLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: opts.title,
            description: opts.description,
            image: opts.image ? [opts.image] : undefined,
            datePublished: opts.publishedAt,
            dateModified: opts.modifiedAt || opts.publishedAt,
            articleSection: opts.articleSection,
            keywords: (opts.keywords || []).join(','),
            author: SITE.organization,
            publisher: SITE.organization,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url
            }
        };
        // remove undefined
        Object.keys(articleLd).forEach(k => articleLd[k] === undefined && delete articleLd[k]);
        injectJsonLd(articleLd);

        // BreadcrumbList
        const breadcrumb = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE.url + '/' },
                { '@type': 'ListItem', position: 2, name: opts.articleSection, item: SITE.url + (opts.sectionPath || '/') },
                { '@type': 'ListItem', position: 3, name: opts.title, item: url }
            ]
        };
        injectJsonLd(breadcrumb);
    }

    global.OmnibassSeo = {
        SITE,
        applyArticle,
        setMeta,
        setLink,
        injectJsonLd,
    };
})(window);
