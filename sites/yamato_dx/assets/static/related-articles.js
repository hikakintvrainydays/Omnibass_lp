/**
 * 記事ID → 関連記事3件 のマップ。
 * 詳細ページのJSが本文末尾に「関連コラム」セクションを動的に挿入する。
 *
 * 各エントリ: { href, title, hint }
 *   - href: クリック先URL（OMNIBASS or YamatoDX）
 *   - title: リンクテキスト
 *   - hint:  読者に文脈を伝える短い前置き
 */
(function (global) {
    const OMNI = 'https://biwako-omnibass.com';
    const YAMATO = 'https://digital-yamato-dx.jp';

    // 各記事のメタ
    const ARTICLES = {
        // OMNIBASS columns
        'wgoxyb3we': { title: 'AIエージェントとは何か〜「生成AI」との違いとビジネスへのインパクト〜', site: 'omni', path: '/articles/?id=wgoxyb3we' },
        'rr07vmfu1z': { title: '社内SlackにAIエージェントを置くと何が変わるか', site: 'omni', path: '/articles/?id=rr07vmfu1z' },
        '2ewv2w086_uf': { title: 'AIエージェント導入前にやるべき業務棚卸しの具体手順', site: 'omni', path: '/articles/?id=2ewv2w086_uf' },
        'k0ob3y8a3stn': { title: '経営者がAI導入で問うべき5つの質問', site: 'omni', path: '/articles/?id=k0ob3y8a3stn' },
        'hlpfcs8omo7': { title: 'AIエージェント定着のための社内コミュニケーション設計', site: 'omni', path: '/articles/?id=hlpfcs8omo7' },
        '20o9udv2luil': { title: 'AIエージェントを安全に運用するための「ガードレール」設計', site: 'omni', path: '/articles/?id=20o9udv2luil' },

        // YamatoDX dx-columns
        'txy3at3ulr': { title: '中小企業がDXに踏み出すための「最初の一歩」とは', site: 'yamato', path: '/dx-columns/?id=txy3at3ulr' },
        'e4n-5lrcvyj': { title: 'なぜ多くの中小企業のDXは失敗するのか — 3つの落とし穴', site: 'yamato', path: '/dx-columns/?id=e4n-5lrcvyj' },
        '3k7xp1kihgp5': { title: 'ローコード／ノーコードを業務に取り入れる現実的な手順', site: 'yamato', path: '/dx-columns/?id=3k7xp1kihgp5' },
        'vvi6h1v8c': { title: '「データ活用」より先に整えるべき「データの場所」', site: 'yamato', path: '/dx-columns/?id=vvi6h1v8c' },
        'zsgxr3czn': { title: '業務改善に効くAIエージェントの具体的な使いどころ5選', site: 'yamato', path: '/dx-columns/?id=zsgxr3czn' },
    };

    // 記事ID → 推奨する3件のIDと文脈
    const RELATED = {
        // dx-columns
        'txy3at3ulr': [
            { id: 'e4n-5lrcvyj', hint: '失敗を避けるために' },
            { id: '3k7xp1kihgp5', hint: '具体的な手順を知りたい方は' },
            { id: 'zsgxr3czn', hint: 'AI活用を検討中なら' }
        ],
        'e4n-5lrcvyj': [
            { id: 'txy3at3ulr', hint: 'これからDXを始める方は' },
            { id: 'vvi6h1v8c', hint: 'データの整理から手をつけたい方は' },
            { id: '3k7xp1kihgp5', hint: '具体的なツール選定なら' }
        ],
        '3k7xp1kihgp5': [
            { id: 'txy3at3ulr', hint: 'その前に何をするか' },
            { id: 'e4n-5lrcvyj', hint: '失敗を避けたい方は' },
            { id: 'zsgxr3czn', hint: 'AIエージェントとの組み合わせなら' }
        ],
        'vvi6h1v8c': [
            { id: 'txy3at3ulr', hint: 'これからDXを始める方は' },
            { id: 'e4n-5lrcvyj', hint: '失敗を避けるために' },
            { id: '3k7xp1kihgp5', hint: '具体的なツール選定なら' }
        ],
        'zsgxr3czn': [
            { id: 'txy3at3ulr', hint: 'はじめての方は' },
            { id: 'e4n-5lrcvyj', hint: '失敗を避けるために' },
            { id: '3k7xp1kihgp5', hint: 'ローコードと組み合わせるなら' }
        ],
        // columns
        'wgoxyb3we': [
            { id: 'rr07vmfu1z', hint: '具体的な使い方を知りたい方は' },
            { id: '2ewv2w086_uf', hint: '導入手順を知りたい方は' },
            { id: '20o9udv2luil', hint: '安全な運用方法は' }
        ],
        'rr07vmfu1z': [
            { id: 'wgoxyb3we', hint: 'そもそもAIエージェントとは' },
            { id: '2ewv2w086_uf', hint: '導入前にやるべきことは' },
            { id: '20o9udv2luil', hint: '安全な運用なら' }
        ],
        '2ewv2w086_uf': [
            { id: 'wgoxyb3we', hint: 'AIエージェントの基本知識' },
            { id: 'zsgxr3czn', hint: '具体的な使い方' },
            { id: 'rr07vmfu1z', hint: '社内SlackでのAI活用なら' }
        ],
        'k0ob3y8a3stn': [
            { id: '20o9udv2luil', hint: '失敗を避けるために' },
            { id: 'hlpfcs8omo7', hint: '定着のために' },
            { id: '2ewv2w086_uf', hint: '業務の選び方' }
        ],
        'hlpfcs8omo7': [
            { id: 'k0ob3y8a3stn', hint: '導入前の問い' },
            { id: '20o9udv2luil', hint: '安全な運用' },
            { id: 'zsgxr3czn', hint: '具体的な使いどころ' }
        ],
        '20o9udv2luil': [
            { id: 'k0ob3y8a3stn', hint: '導入前の問い' },
            { id: 'hlpfcs8omo7', hint: '定着のために' },
            { id: '2ewv2w086_uf', hint: '業務の選び方' }
        ]
    };

    function urlFor(meta) {
        return (meta.site === 'yamato' ? YAMATO : OMNI) + meta.path;
    }

    /**
     * @param {string} id 現在の記事ID
     * @returns {string} HTML（関連コラムセクション + CTA）
     */
    function buildSection(id) {
        const list = RELATED[id];
        if (!list || !list.length) return '';
        const liItems = list.map(r => {
            const meta = ARTICLES[r.id];
            if (!meta) return '';
            return `<li>${escapeHtml(r.hint)} → <a href="${urlFor(meta)}">${escapeHtml(meta.title)}</a></li>`;
        }).filter(Boolean).join('');
        return `
            <section class="article-related">
                <h2>関連コラム</h2>
                <ul class="article-related__list">${liItems}</ul>
            </section>
            <section class="article-cta">
                <div class="article-cta__inner">
                    <p class="article-cta__lead">「うちの場合はどう進めればいい？」<br>少しでも気になる点があれば、ぜひお気軽にご相談ください。</p>
                    <a href="https://digital-yamato-dx.jp/#contact-ja" class="article-cta__btn" target="_blank" rel="noopener">YamatoDXの無料相談を予約する →</a>
                    <p class="article-cta__sub">中小企業のDX支援なら YamatoDX（株式会社OMNIBASS）</p>
                </div>
            </section>`;
    }

    function escapeHtml(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    global.OmnibassRelated = { buildSection, ARTICLES, RELATED };
    global.YamatoRelated = { buildSection, ARTICLES, RELATED };
})(window);
