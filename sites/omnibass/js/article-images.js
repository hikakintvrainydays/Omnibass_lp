/**
 * 記事ID → サムネ画像URL のマップ。
 *
 * 値は以下のいずれか:
 *   - Unsplash の photo ID 文字列 (例: '1545569341-9eb8b30979d9')
 *     → CDN URL に展開して使う。Unsplash License に準拠したフリー素材。
 *   - サイト内画像のパス (例: '/images/generated/article_ai.webp')
 *     → そのままURLとして使う ('/' か '.' で始まるものを判定)。
 *
 * キーは WordPress の post ID (数値文字列) を入れる。
 * 旧 microCMS 時代のスラッグも残してあるが、現行のWP配信では参照されない。
 *
 * 新しい記事を追加した場合、ここにIDと画像を追記すれば、
 * トップページのカードと詳細ページに自動で画像が表示されます。
 */
(function (global) {
    const W = 'w=1600&q=80';
    const CARD_W = 'w=800&q=70';
    const PHOTO = (id) => `https://images.unsplash.com/photo-${id}`;

    const PHOTO_IDS = {
        // === news (WP posts) ===
        // 14 (株式会社OMNIBASSを設立しました) は写真なしの方針
        // 6  (WordPress 移行テスト投稿), 1 (Hello world!) はWP既定/テスト用なので写真なし
        '15': '1545569341-9eb8b30979d9',                  // 京都市下京区にオフィス開設 → 京都の街並み
        '16': '/images/generated/business_dx.webp',        // YamatoDX → DXブランド画像
        '17': '/images/generated/business_travel.webp',    // MEGURU TRAVEL → トラベルブランド画像
        '18': '1559028012-481c04fa702d',                  // 公式HP公開 → PC・ウェブサイト
        '13': '/images/generated/business_agri.webp',      // Dacha club 活動報告 → 農業ブランド画像

        // === columns (WP CPT) ===
        // 10 (内製と外注) はWP側で featured image 設定済みのためここでは未指定
        '7':  '/images/generated/article_ai.webp',         // AIエージェント導入の3ステップ → AIブランド画像
        '24': '1563013544-824ae1b704d3',                  // ガードレール設計 → セキュリティ
        '23': '1611926653458-09294b3142bf',               // 社内コミュニケーション → チャット
        '22': '1522071820081-009f0129c71c',               // 経営者の5つの質問 → チームミーティング
        '21': '1454165804606-c3d57bc86b40',               // 業務棚卸し → 分析・データ
        '20': '1551434678-e076c223a692',                  // Slack×AI → チームワーク
        '19': '1677442136019-21780ecad995',               // AIエージェントとは → AIの概念

        // === 旧 microCMS 時代のスラッグ (現行WPでは未使用、互換のため残置) ===
        '4-h25in3qel3':    '1545569341-9eb8b30979d9',
        'k3s97fz_eec':     '1523050854058-8df90110c9f1',
        'yk4vmx327':       '1521737711867-e3b97375f902',
        'la1ga9hdhi':      '1500382017468-9049fed747ef',
        '74jx7wspmgng':    '1528360983277-13d401cdc186',
        'wjkiv2bffj':      '1559028012-481c04fa702d',
        '20o9udv2luil':    '1563013544-824ae1b704d3',
        'hlpfcs8omo7':     '1522071820081-009f0129c71c',
        'k0ob3y8a3stn':    '1556761175-5973dc0f32e7',
        '2ewv2w086_uf':    '1454165804606-c3d57bc86b40',
        'rr07vmfu1z':      '1611926653458-09294b3142bf',
        'wgoxyb3we':       '1677442136019-21780ecad995',
        'txy3at3ulr':      '1454165804606-c3d57bc86b40',
        'e4n-5lrcvyj':     '1573497019940-1c28c88b4f3e',
        '3k7xp1kihgp5':    '1581291518633-83b4ebd1d83e',
        'vvi6h1v8c':       '1551288049-bebda4e38f71',
        'zsgxr3czn':       '1551434678-e076c223a692',
    };

    function isLocalOrAbsolute(value) {
        return /^(https?:|\/|\.)/.test(value) || value.includes('/');
    }

    function resolveUrl(value, sizeQs) {
        if (!value) return '';
        return isLocalOrAbsolute(value) ? value : `${PHOTO(value)}?${sizeQs}`;
    }

    function getHeroImageUrl(id) {
        return resolveUrl(PHOTO_IDS[id], W);
    }

    function getCardImageUrl(id) {
        return resolveUrl(PHOTO_IDS[id], CARD_W);
    }

    global.OmnibassArticleImages = {
        getHeroImageUrl,
        getCardImageUrl,
    };
})(window);
