/**
 * microCMS connection settings for the YamatoDX site.
 *
 * 共有するか分けるかについて:
 *   - Omnibass トップ (omnibass.jp) と YamatoDX (digital-yamato-dx.jp) は
 *     ドメインが異なりますが、同じ microCMS サービスを共有しても構いません。
 *     エンドポイント (API ID) を分けて使います。
 *   - YamatoDX 専用に新しい microCMS サービスを作る場合は serviceDomain と
 *     apiKey をそのサービスのものに差し替えてください。
 *
 * apiKey は **必ず GET 専用** のキーを使うこと。
 */
window.YAMATO_CMS_CONFIG = {
    serviceDomain: 'ie4goy9psi',
    apiKey: 'EnvocVdgZA9UF6OTh0qTgomxDLy20nTFo8rU',
    endpoints: {
        // YamatoDX の DXコラム用 (リスト形式)
        // microCMS 側でこの API ID を作成してください
        dxColumns: 'dx-columns'
    },
    limits: {
        dxColumns: 6
    }
};
