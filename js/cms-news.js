/**
 * Renders the #news section from microCMS.
 *
 * Expected microCMS API id: "news" (リスト形式)
 * Expected fields (案):
 *   - title       : テキスト
 *   - category    : セレクト or テキスト  例: "お知らせ" / "プレス" / "ブログ"
 *   - link        : テキスト (任意, 外部URL)
 *   - publishedAt : 自動付与
 *
 * Falls back to the existing static cards when:
 *   - cms-config.js still has placeholder values, or
 *   - the request fails / returns no contents.
 */
(function () {
    const ENDPOINT_DEFAULT = 'news';
    const LIMIT_DEFAULT = 5;

    function buildItem(item) {
        const esc = window.OmnibassCMS.escapeHtml;
        const date = window.OmnibassCMS.formatDateDot(item.publishedAt || item.createdAt);
        // microCMSのセレクトフィールドは配列で返るため両対応
        const cat = Array.isArray(item.category) ? item.category[0] : item.category;
        const tag = esc(cat || 'お知らせ');
        const title = esc(item.title || '');
        const externalLink = item.link ? esc(item.link) : '';
        const detailHref = item.id ? `news/?id=${encodeURIComponent(item.id)}` : '';
        const cardImage = (window.OmnibassArticleImages && item.id)
            ? window.OmnibassArticleImages.getCardImageUrl(item.id)
            : '';
        // 画像が無い記事もレイアウトを揃えるため、空のプレースホルダーを置く
        const thumbHtml = cardImage
            ? `<div class="news-thumb"><img src="${esc(cardImage)}" alt="" loading="lazy"></div>`
            : `<div class="news-thumb news-thumb--empty" aria-hidden="true"></div>`;

        const inner = `
            ${thumbHtml}
            <time class="news-date">${esc(date)}</time>
            <div class="news-content">
                <span class="news-tag">${tag}</span>
                <h3 class="news-title">${title}</h3>
            </div>`;

        // 外部リンクが指定されていればそちらを優先、なければ詳細ページへ
        if (externalLink) {
            return `<a href="${externalLink}" class="news-item data-island" target="_blank" rel="noopener">${inner}</a>`;
        }
        if (detailHref) {
            return `<a href="${detailHref}" class="news-item data-island">${inner}</a>`;
        }
        return `<article class="news-item data-island">${inner}</article>`;
    }

    async function render() {
        const container = document.querySelector('#news .news-list');
        if (!container) return;
        if (!window.OmnibassCMS || !window.OmnibassCMS.isConfigured()) return;

        const cfg = window.OMNIBASS_CMS_CONFIG || {};
        const endpoint = (cfg.endpoints && cfg.endpoints.news) || ENDPOINT_DEFAULT;
        const limit = (cfg.limits && cfg.limits.news) || LIMIT_DEFAULT;

        const data = await window.OmnibassCMS.fetchList(endpoint, {
            limit,
            orders: '-publishedAt'
        });
        if (!data || !Array.isArray(data.contents) || data.contents.length === 0) return;

        container.innerHTML = data.contents.map(buildItem).join('');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
