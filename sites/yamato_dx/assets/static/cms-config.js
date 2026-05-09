/**
 * WordPress (cms.omnibass.jp) REST API connection settings for the YamatoDX site.
 *
 * Omnibass と同じ WP インスタンスを共有し、エンドポイントだけ分けている。
 * dx-columns は CPT (rest_base = "dx-columns")。
 *
 * 公開GETのみで取得するため API キーや認証は不要。
 */
window.YAMATO_CMS_CONFIG = {
    wpBase: 'http://cms.biwako-omnibass.com/wp-json/wp/v2',
    endpoints: {
        dxColumns: 'dx-columns'
    },
    limits: {
        dxColumns: 6
    }
};
