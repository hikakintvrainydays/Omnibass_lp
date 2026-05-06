/**
 * Tiny microCMS client. Returns null when the config still has
 * placeholder values so callers can fall back to the static markup.
 */
(function (global) {
    const PLACEHOLDER_DOMAIN = 'YOUR_SERVICE_DOMAIN';
    const PLACEHOLDER_KEY = 'YOUR_API_KEY';

    function isConfigured() {
        const cfg = global.OMNIBASS_CMS_CONFIG;
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
        const cfg = global.OMNIBASS_CMS_CONFIG;
        const query = new URLSearchParams(params || {}).toString();
        const url = `https://${cfg.serviceDomain}.microcms.io/api/v1/${endpoint}${query ? `?${query}` : ''}`;
        try {
            const res = await fetch(url, {
                headers: { 'X-MICROCMS-API-KEY': cfg.apiKey }
            });
            if (!res.ok) {
                console.warn(`[microCMS] ${endpoint} request failed: ${res.status}`);
                return null;
            }
            return await res.json();
        } catch (err) {
            console.warn(`[microCMS] ${endpoint} fetch error`, err);
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
        escapeHtml,
        formatDateDot
    };
})(window);
