/**
 * Renders the #articles section from microCMS.
 *
 * Expected microCMS API id: "columns" (リスト形式)
 * Expected fields (案):
 *   - title       : テキスト
 *   - excerpt     : テキストエリア (記事の抜粋)
 *   - category    : セレクト  値は "ai-agent" / "case-study"
 *                   ※ index.html のフィルタボタンの data-category と一致させる
 *   - thumbnail   : 画像 (任意)
 *   - link        : テキスト (任意, 詳細ページURL)
 *   - publishedAt : 自動付与
 *
 * Falls back to the existing static cards when the CMS is unconfigured
 * or returns no contents.
 */
(function () {
    const ENDPOINT_DEFAULT = 'columns';
    const LIMIT_DEFAULT = 6;
    const FALLBACK_IMAGE = 'images/generated/article_ai.webp';

    const CATEGORY_LABEL = {
        'ai-agent': 'AIエージェント',
        'case-study': '導入事例'
    };

    const CATEGORY_BADGE_CLASS = {
        'case-study': 'badge-case'
    };

    function categoryLabel(slug) {
        return CATEGORY_LABEL[slug] || slug || '記事';
    }

    function badgeClass(slug) {
        return CATEGORY_BADGE_CLASS[slug] || '';
    }

    function pickImage(item) {
        if (item.thumbnail && item.thumbnail.url) return item.thumbnail.url;
        // 記事ID → Unsplash画像のマップから引く
        if (window.OmnibassArticleImages && item.id) {
            return window.OmnibassArticleImages.getCardImageUrl(item.id);
        }
        return FALLBACK_IMAGE;
    }

    function buildCard(item) {
        const esc = window.OmnibassCMS.escapeHtml;
        // microCMSのセレクトフィールドは配列で返る場合があるため両対応
        const rawCategory = Array.isArray(item.category) ? item.category[0] : item.category;
        const slug = (rawCategory && rawCategory.id) ? rawCategory.id : (rawCategory || '');
        const cat = esc(slug);
        const date = esc(window.OmnibassCMS.formatDateDot(item.publishedAt || item.createdAt));
        const title = esc(item.title || '');
        const excerpt = esc(item.excerpt || '');
        const image = esc(pickImage(item));
        const label = esc(categoryLabel(slug));
        const badgeExtra = badgeClass(slug);
        const externalLink = item.link ? esc(item.link) : '';
        const detailHref = item.id ? `articles/?id=${encodeURIComponent(item.id)}` : '';

        const inner = `
            <div class="article-image">
                <img src="${image}" alt="${label}">
                <span class="article-category-badge ${badgeExtra}">${label}</span>
            </div>
            <div class="article-content">
                <time class="article-date">${date}</time>
                <h3 class="article-title">${title}</h3>
                <p class="article-excerpt">${excerpt}</p>
            </div>`;

        // 外部リンクが指定されていればそちらを優先、なければ詳細ページへ
        let href = externalLink || detailHref;
        let target = externalLink ? ' target="_blank" rel="noopener"' : '';
        if (href) {
            return `<a class="article-card" data-category="${cat}" href="${href}"${target}>${inner}</a>`;
        }
        return `<article class="article-card" data-category="${cat}">${inner}</article>`;
    }

    async function render() {
        const grid = document.querySelector('#articles .article-grid');
        if (!grid) return;
        if (!window.OmnibassCMS || !window.OmnibassCMS.isConfigured()) return;

        const cfg = window.OMNIBASS_CMS_CONFIG || {};
        const endpoint = (cfg.endpoints && cfg.endpoints.columns) || ENDPOINT_DEFAULT;
        const limit = (cfg.limits && cfg.limits.columns) || LIMIT_DEFAULT;

        const data = await window.OmnibassCMS.fetchList(endpoint, {
            limit,
            orders: '-publishedAt'
        });
        if (!data || !Array.isArray(data.contents) || data.contents.length === 0) return;

        grid.innerHTML = data.contents.map(buildCard).join('');

        // Re-apply the currently active filter so the freshly inserted
        // cards respect the user's previous selection.
        const active = document.querySelector('#articles .filter-btn.active');
        if (active) {
            const cat = active.dataset.category || 'all';
            grid.querySelectorAll('.article-card').forEach(card => {
                if (cat === 'all' || card.dataset.category === cat) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
