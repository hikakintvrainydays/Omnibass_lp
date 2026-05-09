/**
 * Renders the DX column sections on the YamatoDX top page from microCMS.
 *
 * Targets:
 *   - #column-ja .news-list  (日本語パネル)
 *   - #column-en .news-list  (英語パネル)
 *
 * Expected microCMS API id: "dx-columns" (リスト形式)
 * Expected fields:
 *   - title       : テキスト       (日本語タイトル, 必須)
 *   - titleEn     : テキスト       (英語タイトル, 任意 / 未入力時は title を流用)
 *   - tag         : テキスト       (日本語タグ, 例: "DXコラム" / "事例")
 *   - tagEn       : テキスト       (英語タグ, 任意 / 未入力時は tag を流用)
 *   - link        : テキスト       (任意, 詳細ページURL)
 *   - publishedAt : 自動付与
 *
 * 設定未入力時 / 取得失敗時 / 0件のときは静的な「まだありません」カードがそのまま残ります。
 */
(function () {
    const ENDPOINT_DEFAULT = 'dx-columns';
    const LIMIT_DEFAULT = 6;

    function pick(value, fallback) {
        return (value && String(value).trim()) || fallback || '';
    }

    function buildItem(item, lang) {
        const esc = window.YamatoCMS.escapeHtml;
        const title = lang === 'en'
            ? pick(item.titleEn, item.title)
            : pick(item.title, item.titleEn);
        const tag = lang === 'en'
            ? pick(item.tagEn, item.tag || 'DX Column')
            : pick(item.tag, item.tagEn || 'DXコラム');
        const date = window.YamatoCMS.formatDateDot(item.publishedAt || item.createdAt);
        const externalLink = item.link ? esc(item.link) : '';
        const detailHref = item.id ? `dx-columns/?id=${encodeURIComponent(item.id)}` : '';
        const wpThumb = (item.thumbnail && item.thumbnail.url) ? item.thumbnail.url : '';
        const cardImage = wpThumb || (
            (window.YamatoArticleImages && item.id)
                ? window.YamatoArticleImages.getCardImageUrl(item.id)
                : ''
        );
        const thumbHtml = cardImage
            ? `<div class="news-item__thumb"><img src="${esc(cardImage)}" alt="" loading="lazy"></div>`
            : '';

        const inner = `
            ${thumbHtml}
            <div class="news-item__body">
                <div class="news-item__meta">
                    <span class="news-item__date">${esc(date)}</span>
                    <span class="news-item__tag">${esc(tag)}</span>
                </div>
                <h3 class="news-item__title">${esc(title)}</h3>
            </div>
            <span class="news-item__arrow">→</span>`;

        // 外部リンクが指定されていればそちらを優先、なければ詳細ページへ
        if (externalLink) {
            return `<a class="news-item" href="${externalLink}" target="_blank" rel="noopener">${inner}</a>`;
        }
        if (detailHref) {
            return `<a class="news-item" href="${detailHref}">${inner}</a>`;
        }
        return `<div class="news-item">${inner}</div>`;
    }

    function renderInto(selector, contents, lang) {
        const container = document.querySelector(selector);
        if (!container) return;
        container.innerHTML = contents.map(item => buildItem(item, lang)).join('');
    }

    async function render() {
        if (!window.YamatoCMS || !window.YamatoCMS.isConfigured()) return;

        const cfg = window.YAMATO_CMS_CONFIG || {};
        const endpoint = (cfg.endpoints && cfg.endpoints.dxColumns) || ENDPOINT_DEFAULT;
        const limit = (cfg.limits && cfg.limits.dxColumns) || LIMIT_DEFAULT;

        const data = await window.YamatoCMS.fetchList(endpoint, {
            limit,
            orders: '-publishedAt'
        });
        if (!data || !Array.isArray(data.contents) || data.contents.length === 0) return;

        renderInto('#column-ja .news-list', data.contents, 'ja');
        renderInto('#column-en .news-list', data.contents, 'en');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
