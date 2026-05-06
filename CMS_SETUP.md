# microCMS セットアップガイド

トップページの「ニュース」「記事（コラム）」セクションを microCMS から配信するための手順です。
ロリポップ側はファイルをアップロードするだけで、サーバープランは問いません（エコノミーでも動作します）。

---

## 1. microCMS でサービスを作る

1. <https://microcms.io/> でアカウント作成
2. 「サービスを作る」→ サービスID（サブドメイン）を決める
   - 例: `omnibass` → 管理画面 URL は `https://omnibass.microcms.io`
   - この **サービスID** が後で `js/cms-config.js` の `serviceDomain` に入る値です

---

## 2. API を 2 つ作成

### 2-1. ニュース用 API

| 項目 | 値 |
|---|---|
| API名 | ニュース |
| エンドポイント | `news` |
| API の型 | **リスト形式** |

フィールド:

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| `title` | タイトル | テキストフィールド | ✅ | |
| `category` | カテゴリ | セレクト（単一） | ✅ | 選択肢: `お知らせ` / `プレス` / `ブログ` |
| `link` | 外部リンク | テキストフィールド |  | 任意。設定すると一覧でクリック可能になります |

`publishedAt`（公開日時）は microCMS が自動で付与します。

### 2-2. コラム / 記事用 API

| 項目 | 値 |
|---|---|
| API名 | コラム |
| エンドポイント | `columns` |
| API の型 | **リスト形式** |

フィールド:

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| `title` | タイトル | テキストフィールド | ✅ | |
| `excerpt` | 抜粋 | テキストエリア | ✅ | カードに表示する短い説明 |
| `category` | カテゴリ | セレクト（単一） | ✅ | **選択肢の値は `ai-agent` と `case-study` の 2 つ**（フィルタボタンと一致させる必要あり） |
| `thumbnail` | サムネイル | 画像 |  | 未設定の場合は既定画像が使われます |
| `link` | 外部リンク | テキストフィールド |  | 任意 |

> ⚠️ `category` の選択肢の **値（value）** は必ず `ai-agent` / `case-study` にしてください。表示名（label）は日本語で構いません（例: `AIエージェント` / `導入事例`）。

---

## 3. API キーを発行

1. 管理画面 → 権限管理 → API キー
2. 「API キーを作成」
3. 権限は **GET のみ ON**（公開サイトに埋め込むため、書き込み権限は付けない）
4. 発行された **API キー** をコピー

---

## 4. `js/cms-config.js` を書き換える

```js
window.OMNIBASS_CMS_CONFIG = {
    serviceDomain: 'omnibass',          // ← 手順1のサービスID
    apiKey: 'xxxxxxxxxxxxxxxxxxxx',     // ← 手順3のAPIキー
    endpoints: {
        news: 'news',
        columns: 'columns'
    },
    limits: {
        news: 5,      // トップページに表示する件数
        columns: 6
    }
};
```

`YOUR_SERVICE_DOMAIN` または `YOUR_API_KEY` のどちらかでも残っていると CMS 連携は無効化され、既存の「近日公開予定」カードがそのまま表示されます。

---

## 5. ロリポップにアップロード

FTP / FileManager で以下を上書きアップロードします。

```
index.html
js/cms-config.js     ← 書き換えたもの
js/cms-client.js
js/cms-news.js
js/cms-articles.js
js/main.js           ← フィルタ修正版
```

PHP も MySQL も不要です。HTML/JS だけです。

---

## 6. 動作確認

1. ブラウザでトップページを開く
2. ニュース欄・記事欄に microCMS で作った記事が出ていれば成功
3. 出ない場合は DevTools の Console を確認:
   - `[microCMS] news request failed: 401` → API キー違い
   - `[microCMS] news request failed: 404` → エンドポイント名違い
   - 何も出ない → `cms-config.js` のプレースホルダがまだ残っている可能性

---

## 7. 運用

- 記事の追加・編集・公開は microCMS の管理画面から行います
- **公開ボタンを押すと即座にサイトに反映されます**（再アップロード不要）
- 下書き保存・予約公開・差し戻しなどの基本機能はすべて microCMS 側にあります

---

## セキュリティについて

ブラウザに埋め込む API キーは必ず **GET 専用** にしてください。
書き込み権限のあるキーをサイトに置くと、誰でも記事を作成・削除できてしまいます。
