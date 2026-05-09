# Omnibass Homepages

複数サイトの静的HTMLをまとめて管理しているリポジトリ。

## フォルダ構成

```
.
├── sites/                    ← ロリポップにアップロードする領域
│   ├── omnibass/             → biwako-omnibass.com に丸ごとアップ
│   ├── yamato_dx/            → digital-yamato-dx.jp に丸ごとアップ
│   ├── dachaclub/            → dachaclub.jp に丸ごとアップ
│   └── meguru_travel/        → meguru_travel ドメインに丸ごとアップ
│
├── docs/                     ← 開発用ドキュメント (アップロード不要)
│   ├── WORDPRESS_SETUP.md, CMS_SETUP.md など
│   └── yamato_dx-plots/      ← yamato_dx 関連の社内プロット類
│
├── tools/                    ← サーバー側ツール (Webルートには置かない)
│   ├── scripts/              ← microCMS → WordPress 移行スクリプト (Node.js CLI)
│   └── wp-content/           ← WordPress (cms.biwako-omnibass.com) の mu-plugins
│
├── _migration/               ← 移行スクリプトの実行ログ (gitignore)
├── _verification/            ← Playwright 撮影スクショ (gitignore)
├── .env                      ← WordPress 認証情報 (gitignore)
└── .env.example              ← .env のテンプレート
```

## ロリポップへのアップロード手順

各ドメインのドキュメントルートに、対応する `sites/<サイト名>/` の**中身を丸ごと**アップロードする:

| ドメイン | アップ対象 |
|---|---|
| biwako-omnibass.com | `sites/omnibass/` の中身 |
| digital-yamato-dx.jp | `sites/yamato_dx/` の中身 |
| dachaclub.jp | `sites/dachaclub/` の中身 |
| meguru_travel ドメイン | `sites/meguru_travel/` の中身 |

`docs/`, `tools/`, `_migration/`, `_verification/`, `node_modules/`, `.env` 等はアップロード不要。

## 移行スクリプトの実行

```bash
# .env をリポジトリルートに用意 (.env.example を参考に)
node tools/scripts/migrate-from-microcms.mjs
node tools/scripts/wp-publish.mjs
```

スクリプトは `tools/scripts/wp-lib.mjs` の `REPO_ROOT` を基準に `.env` と `_migration/` を読み書きする。
