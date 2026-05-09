/**
 * WordPress (cms.omnibass.jp) REST API connection settings.
 *
 *   wpBase    : WP REST API のベースURL。末尾スラッシュ無し。
 *   endpoints : 各コンテンツの rest_base
 *               - news    : 標準投稿 (posts)
 *               - columns : CPT (rest_base = "columns")
 *
 * 公開GETのみで取得するため API キーや認証は不要。
 * 書き込み (Application Password) は scripts/wp-publish.mjs 側で扱い、ブラウザには絶対に置かない。
 */
window.OMNIBASS_CMS_CONFIG = {
    wpBase: 'http://cms.biwako-omnibass.com/wp-json/wp/v2',
    endpoints: {
        news: 'posts',
        columns: 'columns'
    },
    limits: {
        news: 5,
        columns: 6
    }
};
