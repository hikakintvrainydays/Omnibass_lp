/**
 * YamatoDX 記事ID → ヒーロー画像URL マップ。
 * Unsplash License 準拠のフリー素材。
 */
(function (global) {
    const W = 'w=1600&q=80';
    const CARD_W = 'w=800&q=70';
    const PHOTO = (id) => `https://images.unsplash.com/photo-${id}`;

    const PHOTO_IDS = {
        'txy3at3ulr':      '1454165804606-c3d57bc86b40',
        'e4n-5lrcvyj':     '1573497019940-1c28c88b4f3e',
        '3k7xp1kihgp5':    '1581291518633-83b4ebd1d83e',
        'vvi6h1v8c':       '1551288049-bebda4e38f71',
        'zsgxr3czn':       '1551434678-e076c223a692',
    };

    const FALLBACK_PHOTO_ID = '1499750310107-5fef28a66643';

    function getHeroImageUrl(id) {
        const photoId = PHOTO_IDS[id] || FALLBACK_PHOTO_ID;
        return `${PHOTO(photoId)}?${W}`;
    }

    function getCardImageUrl(id) {
        const photoId = PHOTO_IDS[id] || FALLBACK_PHOTO_ID;
        return `${PHOTO(photoId)}?${CARD_W}`;
    }

    global.YamatoArticleImages = {
        getHeroImageUrl,
        getCardImageUrl,
    };
})(window);
