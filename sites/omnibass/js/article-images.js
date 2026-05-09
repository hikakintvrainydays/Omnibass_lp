/**
 * 記事ID → ヒーロー画像URL のマップ。
 *
 * microCMSのリッチエディタは外部URLの<img>タグを保存時に除去するため、
 * 画像はサイト側で別途管理しています。Unsplash License に準拠した
 * フリー素材を使用しています。
 *
 * 新しい記事を追加した場合、ここにIDと画像URLを追記すれば、
 * トップページのカードと詳細ページに自動で画像が表示されます。
 */
(function (global) {
    const W = 'w=1600&q=80';
    const CARD_W = 'w=800&q=70';
    const PHOTO = (id) => `https://images.unsplash.com/photo-${id}`;

    // 各記事用のUnsplash画像ID
    const PHOTO_IDS = {
        // === news ===
        // '578n7-ecg' (株式会社OMNIBASSを設立しました) は写真なしの方針
        '4-h25in3qel3':    '1545569341-9eb8b30979d9',     // 京都の街並み
        'k3s97fz_eec':     '1523050854058-8df90110c9f1',  // 大学キャンパス
        'yk4vmx327':       '1521737711867-e3b97375f902',  // 協働
        'la1ga9hdhi':      '1500382017468-9049fed747ef',  // 畑/緑の風景
        '74jx7wspmgng':    '1528360983277-13d401cdc186',  // 日本の伝統
        'wjkiv2bffj':      '1559028012-481c04fa702d',     // PC・ウェブサイト

        // === columns (記事/コラム) ===
        '20o9udv2luil':    '1563013544-824ae1b704d3',     // セキュリティ
        'hlpfcs8omo7':     '1522071820081-009f0129c71c',  // チームミーティング
        'k0ob3y8a3stn':    '1556761175-5973dc0f32e7',     // 経営者会議
        '2ewv2w086_uf':    '1454165804606-c3d57bc86b40',  // 分析・データ
        'rr07vmfu1z':      '1611926653458-09294b3142bf',  // チャット・コミュニケーション
        'wgoxyb3we':       '1677442136019-21780ecad995',  // AIの概念

        // === dx-columns ===
        'txy3at3ulr':      '1454165804606-c3d57bc86b40',  // データ分析
        'e4n-5lrcvyj':     '1573497019940-1c28c88b4f3e',  // 注意・落とし穴
        '3k7xp1kihgp5':    '1581291518633-83b4ebd1d83e',  // 開発・コード
        'vvi6h1v8c':       '1551288049-bebda4e38f71',     // データ整理
        'zsgxr3czn':       '1551434678-e076c223a692',     // チームワーク
    };

    // マップにないIDは「画像なし」とする（空文字を返す）。
    // 必要なら画像IDをこのファイルに追加すれば自動的に表示される。
    function getHeroImageUrl(id) {
        const photoId = PHOTO_IDS[id];
        return photoId ? `${PHOTO(photoId)}?${W}` : '';
    }

    function getCardImageUrl(id) {
        const photoId = PHOTO_IDS[id];
        return photoId ? `${PHOTO(photoId)}?${CARD_W}` : '';
    }

    global.OmnibassArticleImages = {
        getHeroImageUrl,
        getCardImageUrl,
    };
})(window);
