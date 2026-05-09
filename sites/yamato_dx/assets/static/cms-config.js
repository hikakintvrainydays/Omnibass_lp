/**
 * WordPress (cms.biwako-omnibass.com) REST API connection settings for the YamatoDX site.
 *
 * Omnibass と同じ WP インスタンスを共有し、エンドポイントだけ分けている。
 * dx-columns は CPT (rest_base = "dx-columns")。
 *
 * 公開GETのみで取得するため API キーや認証は不要。
 *
 * 本番ページは https:// で配信されるため、wpBase も必ず https:// を使うこと。
 * http:// にすると Mixed Content でブラウザがブロックし、CMSが反映されなくなる。
 */
window.YAMATO_CMS_CONFIG = {
    wpBase: 'https://cms.biwako-omnibass.com/wp-json/wp/v2',
    endpoints: {
        dxColumns: 'dx-columns'
    },
    limits: {
        dxColumns: 6
    }
};
