/**
 * microCMS connection settings.
 *
 * Replace the two placeholder strings below with your own values.
 * Until both are filled in, the page keeps showing the static
 * "近日公開予定" cards already in index.html.
 *
 *   serviceDomain : the subdomain of your microCMS service
 *                   e.g. "omnibass" if the admin URL is
 *                        https://omnibass.microcms.io
 *
 *   apiKey        : a READ-ONLY API key issued from the microCMS
 *                   admin (権限管理 → APIキー → GET のみ許可)
 *
 * Endpoint IDs default to "news" and "columns". Change them here
 * if you used different IDs when you created the APIs.
 */
window.OMNIBASS_CMS_CONFIG = {
    serviceDomain: 'ie4goy9psi',
    apiKey: 'EnvocVdgZA9UF6OTh0qTgomxDLy20nTFo8rU',
    endpoints: {
        news: 'news',
        columns: 'columns'
    },
    limits: {
        news: 5,
        columns: 6
    }
};
