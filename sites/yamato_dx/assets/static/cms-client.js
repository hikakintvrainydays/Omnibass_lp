/**
 * WordPress REST API client for the YamatoDX site.
 * 設定が未入力の状態では null を返し、呼び出し側は静的HTMLにフォールバックします。
 *
 * dx-columns は ACF で title_en / tag_ja / tag_en を持つため、それらを
 * microCMS 互換の titleEn / tag / tagEn にマッピングして返す。
 */
(function (global) {
    function isConfigured() {
        const cfg = global.YAMATO_CMS_CONFIG;
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

    function normalizePost(post) {
        if (!post || typeof post !== 'object') return null;
        const acf = (post.acf && typeof post.acf === 'object') ? post.acf : {};
        return {
            id: String(post.id),
            title: decodeEntities(stripTags(post.title && post.title.rendered)),
            titleEn: acf.title_en || '',
            tag: acf.tag_ja || '',
            tagEn: acf.tag_en || '',
            link: acf.external_link || '',
            thumbnail: pickFeaturedImage(post),
            content: (post.content && post.content.rendered) || '',
            body: (post.content && post.content.rendered) || '',
            publishedAt: post.date_gmt ? (post.date_gmt + 'Z') : (post.date || ''),
            createdAt: post.date_gmt ? (post.date_gmt + 'Z') : (post.date || '')
        };
    }

    function buildListUrl(endpoint, params) {
        const cfg = global.YAMATO_CMS_CONFIG;
        const qs = new URLSearchParams();
        const limit = (params && params.limit) || 10;
        qs.set('per_page', String(limit));
        // featured_media のみ embed し、必要フィールドだけに絞る (レスポンス約 1/4 に縮小)
        qs.set('_embed', 'wp:featuredmedia');
        qs.set('_fields', 'id,date,date_gmt,modified_gmt,title,acf,featured_media,_links,_embedded');
        qs.set('orderby', 'date');
        qs.set('order', 'desc');
        qs.set('status', 'publish');
        return `${cfg.wpBase}/${endpoint}?${qs.toString()}`;
    }

    async function fetchList(endpoint, params) {
        if (!isConfigured()) return null;
        const url = buildListUrl(endpoint, params);
        // ネットワーク不安定対策: 1回まで自動リトライ
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const res = await fetch(url, { credentials: 'omit' });
                if (!res.ok) {
                    console.warn(`[WP/YamatoDX] ${endpoint} request failed: ${res.status} (attempt ${attempt + 1})`);
                    if (attempt === 0) {
                        await new Promise(r => setTimeout(r, 500));
                        continue;
                    }
                    return null;
                }
                const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
                const arr = await res.json();
                if (!Array.isArray(arr)) return null;
                return {
                    contents: arr.map(normalizePost).filter(Boolean),
                    totalCount: isNaN(total) ? arr.length : total
                };
            } catch (err) {
                console.warn(`[WP/YamatoDX] ${endpoint} fetch error (attempt ${attempt + 1})`, err);
                if (attempt === 0) {
                    await new Promise(r => setTimeout(r, 500));
                    continue;
                }
                return null;
            }
        }
        return null;
    }

    async function fetchDetail(endpoint, id) {
        if (!isConfigured()) return null;
        if (!id) return null;
        const cfg = global.YAMATO_CMS_CONFIG;
        const url = `${cfg.wpBase}/${endpoint}/${encodeURIComponent(id)}?_embed=1`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.warn(`[WP/YamatoDX] ${endpoint}/${id} request failed: ${res.status}`);
                return null;
            }
            return normalizePost(await res.json());
        } catch (err) {
            console.warn(`[WP/YamatoDX] ${endpoint}/${id} fetch error`, err);
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

    global.YamatoCMS = {
        isConfigured,
        fetchList,
        fetchDetail,
        escapeHtml,
        formatDateDot
    };
})(window);
