/**
 * WordPress REST API client. Returns null when wpBase is unconfigured so
 * callers can fall back to the static markup.
 *
 * レスポンスは microCMS 互換の { contents: [...], totalCount } / 単体オブジェクトに
 * 正規化して返す。これにより cms-news.js / cms-articles.js / 詳細ページ等の
 * レンダリング側は microCMS 時代のフィールド名 (id, title, excerpt, category,
 * thumbnail.url, link, publishedAt) のまま動作する。
 */
(function (global) {
    function isConfigured() {
        const cfg = global.OMNIBASS_CMS_CONFIG;
        return !!(cfg && cfg.wpBase && /^https?:\/\//.test(cfg.wpBase));
    }

    function stripTags(html) {
        if (!html) return '';
        return String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }

    function decodeEntities(html) {
        if (!html) return '';
        return String(html)
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#0?39;/g, "'")
            .replace(/&#8217;/g, "’")
            .replace(/&#8220;/g, "“")
            .replace(/&#8221;/g, "”")
            .replace(/&nbsp;/g, ' ');
    }

    function pickFeaturedImage(post) {
        const media = post && post._embedded && post._embedded['wp:featuredmedia'];
        if (Array.isArray(media) && media[0] && media[0].source_url) {
            return { url: media[0].source_url };
        }
        return null;
    }

    function pickTerms(post) {
        const groups = post && post._embedded && post._embedded['wp:term'];
        if (!Array.isArray(groups)) return [];
        const flat = [];
        groups.forEach(g => {
            if (Array.isArray(g)) g.forEach(t => flat.push(t));
        });
        return flat;
    }

    /**
     * WP の post を microCMS 互換シェイプに正規化する。
     * カテゴリは「columns CPT のときだけスラッグを返し、news (posts) のときは
     * 表示名 (お知らせ/プレス/ブログ) を返す」という既存JSの期待に合わせる。
     */
    function normalizePost(post, endpoint) {
        if (!post || typeof post !== 'object') return null;

        const terms = pickTerms(post);
        let category = '';
        if (endpoint === 'columns') {
            const t = terms.find(x => x && x.taxonomy === 'column_category');
            category = t ? (t.slug || t.name || '') : '';
        } else {
            const t = terms.find(x => x && x.taxonomy === 'category');
            category = t ? decodeEntities(t.name || '') : '';
        }

        const acf = (post.acf && typeof post.acf === 'object') ? post.acf : {};
        const featured = pickFeaturedImage(post);

        return {
            id: String(post.id),
            title: decodeEntities(stripTags(post.title && post.title.rendered)),
            excerpt: decodeEntities(stripTags(post.excerpt && post.excerpt.rendered)),
            content: (post.content && post.content.rendered) || '',
            body: (post.content && post.content.rendered) || '',
            category: category,
            thumbnail: featured,
            link: acf.external_link || '',
            titleEn: acf.title_en || '',
            tag: acf.tag_ja || '',
            tagEn: acf.tag_en || '',
            publishedAt: post.date_gmt ? (post.date_gmt + 'Z') : (post.date || ''),
            createdAt: post.date_gmt ? (post.date_gmt + 'Z') : (post.date || '')
        };
    }

    function buildListUrl(endpoint, params) {
        const cfg = global.OMNIBASS_CMS_CONFIG;
        const qs = new URLSearchParams();
        const limit = (params && params.limit) || 10;
        qs.set('per_page', String(limit));
        qs.set('_embed', '1');
        qs.set('orderby', 'date');
        qs.set('order', 'desc');
        qs.set('status', 'publish');
        return `${cfg.wpBase}/${endpoint}?${qs.toString()}`;
    }

    async function fetchList(endpoint, params) {
        if (!isConfigured()) return null;
        try {
            const res = await fetch(buildListUrl(endpoint, params));
            if (!res.ok) {
                console.warn(`[WP] ${endpoint} request failed: ${res.status}`);
                return null;
            }
            const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
            const arr = await res.json();
            if (!Array.isArray(arr)) return null;
            return {
                contents: arr.map(p => normalizePost(p, endpoint)).filter(Boolean),
                totalCount: isNaN(total) ? arr.length : total
            };
        } catch (err) {
            console.warn(`[WP] ${endpoint} fetch error`, err);
            return null;
        }
    }

    async function fetchDetail(endpoint, id) {
        if (!isConfigured()) return null;
        if (!id) return null;
        const cfg = global.OMNIBASS_CMS_CONFIG;
        const url = `${cfg.wpBase}/${endpoint}/${encodeURIComponent(id)}?_embed=1`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.warn(`[WP] ${endpoint}/${id} request failed: ${res.status}`);
                return null;
            }
            const post = await res.json();
            return normalizePost(post, endpoint);
        } catch (err) {
            console.warn(`[WP] ${endpoint}/${id} fetch error`, err);
            return null;
        }
    }

    function escapeHtml(value) {
        if (value == null) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDateDot(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}.${mm}.${dd}`;
    }

    global.OmnibassCMS = {
        isConfigured,
        fetchList,
        fetchDetail,
        escapeHtml,
        formatDateDot
    };
})(window);
