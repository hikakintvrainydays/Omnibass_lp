/**
 * YamatoDX用 SEOヘルパー。
 * 中小企業のDX支援・業務改善・AI活用キーワード強化。
 */
(function (global) {
    const SITE = {
        name: 'YamatoDX',
        url: 'https://digital-yamato-dx.jp',
        logo: 'https://digital-yamato-dx.jp/assets/images/og.png',
        twitter: '@yamatodx',
        description: 'YamatoDX（株式会社OMNIBASS運営）は、滋賀・関西の中小企業・個人事業主向けに、業務改善・IT導入・AIエージェント活用を一貫して支援するDXサービスです。',
        organization: {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'YamatoDX',
            alternateName: '株式会社OMNIBASS YamatoDX事業',
            url: 'https://digital-yamato-dx.jp',
            description: '滋賀・関西の中小企業向けDX支援。業務改善・IT導入・AIエージェント活用を一貫サポート。',
            areaServed: [
                { '@type': 'AdministrativeArea', name: 'Shiga, Japan' },
                { '@type': 'AdministrativeArea', name: 'Kyoto, Japan' },
                { '@type': 'AdministrativeArea', name: 'Kansai, Japan' }
            ],
            inLanguage: 'ja',
            knowsAbout: [
                'DX', 'デジタルトランスフォーメーション', '業務改善', 'IT導入',
                '生成AI', 'AIエージェント', 'ローコード', 'kintone', '中小企業向けDX'
            ],
            parentOrganization: {
                '@type': 'Organization',
                name: '株式会社OMNIBASS',
                url: 'https://biwako-omnibass.com'
            }
        }
    };

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

    function applyArticle(opts) {
        const url = SITE.url + (opts.path || '');
        const fullTitle = `${opts.title} | ${SITE.name}`;
        document.title = fullTitle;
        setMeta('description', opts.description);
        setMeta('keywords', (opts.keywords || []).join(','));
        setMeta('og:title', fullTitle, true);
        setMeta('og:description', opts.description, true);
        setMeta('og:type', 'article', true);
        setMeta('og:url', url, true);
        setMeta('og:image', opts.image || SITE.logo, true);
        setMeta('og:site_name', SITE.name, true);
        setMeta('og:locale', 'ja_JP', true);
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', fullTitle);
        setMeta('twitter:description', opts.description);
        setMeta('twitter:image', opts.image || SITE.logo);
        setLink('canonical', url);

        const articleLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: opts.title,
            description: opts.description,
            image: opts.image ? [opts.image] : undefined,
            datePublished: opts.publishedAt,
            dateModified: opts.modifiedAt || opts.publishedAt,
            articleSection: opts.articleSection || 'DXコラム',
            keywords: (opts.keywords || []).join(','),
            author: SITE.organization,
            publisher: SITE.organization,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            inLanguage: 'ja'
        };
        Object.keys(articleLd).forEach(k => articleLd[k] === undefined && delete articleLd[k]);
        injectJsonLd(articleLd);

        injectJsonLd({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE.url + '/' },
                { '@type': 'ListItem', position: 2, name: 'DXコラム', item: SITE.url + '/#column-ja' },
                { '@type': 'ListItem', position: 3, name: opts.title, item: url }
            ]
        });
    }

    global.YamatoSeo = {
        SITE,
        applyArticle,
        setMeta,
        setLink,
        injectJsonLd
    };
})(window);
