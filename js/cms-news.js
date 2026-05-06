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
        const date = window.OmnibassCMS.formatDateDot(item.publishedAt || item.createdAt);
        const tag = window.OmnibassCMS.escapeHtml(item.category || 'お知らせ');
        const title = window.OmnibassCMS.escapeHtml(item.title || '');
        const link = item.link ? window.OmnibassCMS.escapeHtml(item.link) : '';

        const inner = `
            <time class="news-date">${window.OmnibassCMS.escapeHtml(date)}</time>
            <div class="news-content">
                <span class="news-tag">${tag}</span>
                <h3 class="news-title">${title}</h3>
            </div>`;

        if (link) {
            return `<a href="${link}" class="news-item data-island" target="_blank" rel="noopener">${inner}</a>`;
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
