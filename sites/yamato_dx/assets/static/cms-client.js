/**
 * Tiny microCMS client for the YamatoDX site.
 * 設定が未入力の状態では null を返し、呼び出し側は静的HTMLにフォールバックします。
 */
(function (global) {
    const PLACEHOLDER_DOMAIN = 'YOUR_SERVICE_DOMAIN';
    const PLACEHOLDER_KEY = 'YOUR_API_KEY';

    function isConfigured() {
        const cfg = global.YAMATO_CMS_CONFIG;
        return !!(
            cfg &&
            cfg.serviceDomain &&
            cfg.apiKey &&
            cfg.serviceDomain !== PLACEHOLDER_DOMAIN &&
            cfg.apiKey !== PLACEHOLDER_KEY
        );
    }

    async function fetchList(endpoint, params) {
        if (!isConfigured()) return null;
        const cfg = global.YAMATO_CMS_CONFIG;
        const query = new URLSearchParams(params || {}).toString();
        const url = `https://${cfg.serviceDomain}.microcms.io/api/v1/${endpoint}${query ? `?${query}` : ''}`;
        try {
            const res = await fetch(url, {
                headers: { 'X-MICROCMS-API-KEY': cfg.apiKey }
            });
            if (!res.ok) {
                console.warn(`[YamatoCMS] ${endpoint} request failed: ${res.status}`);
                return null;
            }
            return await res.json();
        } catch (err) {
            console.warn(`[YamatoCMS] ${endpoint} fetch error`, err);
            return null;
        }
    }

    async function fetchDetail(endpoint, id) {
        if (!isConfigured()) return null;
        if (!id) return null;
        const cfg = global.YAMATO_CMS_CONFIG;
        const url = `https://${cfg.serviceDomain}.microcms.io/api/v1/${endpoint}/${encodeURIComponent(id)}`;
        try {
            const res = await fetch(url, {
                headers: { 'X-MICROCMS-API-KEY': cfg.apiKey }
            });
            if (!res.ok) {
                console.warn(`[YamatoCMS] ${endpoint}/${id} request failed: ${res.status}`);
                return null;
            }
            return await res.json();
        } catch (err) {
            console.warn(`[YamatoCMS] ${endpoint}/${id} fetch error`, err);
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
