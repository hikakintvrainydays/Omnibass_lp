/**
 * microCMS connection settings.
 *
 *   serviceDomain : microCMSサービスのサブドメイン。
 *                   管理画面URLが https://ie4goy9psi.microcms.io なので "ie4goy9psi"。
 *
 *   apiKey        : このキーは「GET」のみ許可された読み取り専用キーです。
 *                   POST / PUT / PATCH / DELETE はすべて無効になっており、
 *                   このキーが流出しても「公開済み記事を取得できる」だけで
 *                   書き込み・改ざん・削除は不可能です。
 *                   権限変更履歴は microCMS 管理画面 → 権限管理 → APIキー で確認できます。
 *
 *   endpoints     : このサービスで使うAPIのエンドポイントID。
 *                   - news    : トップページのニュース欄
 *                   - columns : トップページの記事欄
 *
 * 投稿（POST）が必要になった場合は、別途POST権限付きの一時キーを発行し、
 * 投稿後に必ず無効化してください（この cms-config.js には絶対に書かないこと）。
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
