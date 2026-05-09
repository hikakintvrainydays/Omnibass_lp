# WordPress (cms.biwako-omnibass.com) セットアップ実装メモ

`omnibass.jp` / `digital-yamato-dx.jp` の **ニュース／コラム／DXコラム** を、
ロリポップ上に立てた WordPress (`cms.biwako-omnibass.com`) からヘッドレス配信する構成。
記事の作成は **Claude が WP REST API + JWT 経由で自動投稿** する。

このドキュメントは「すでに構築済み」状態の記録。再構築する場合や引継ぎ時の参照用。

---

## 構成サマリー

| 項目 | 値 |
|---|---|
| WordPress URL | `http://cms.biwako-omnibass.com/` |
| WP管理画面 | `http://cms.biwako-omnibass.com/wp-admin/` |
| REST API ベース | `http://cms.biwako-omnibass.com/wp-json/wp/v2` |
| 自動投稿用ユーザー | `claude-publisher` (administrator) |
| 認証方式 | **JWT Authentication for WP REST API** (Application Password が HTTP では使えないため) |
| JWT トークン取得 | `POST /wp-json/jwt-auth/v1/token` |
| 設定の永続化 | **Code Snippets プラグイン**（mu-plugin の代替、FTP 不要で全PHP定義を管理画面で運用） |

---

## 導入済みプラグイン

| プラグイン | 用途 |
|---|---|
| Advanced Custom Fields (ACF) | `external_link` / `title_en` / `tag_ja` / `tag_en` / `legacy_microcms_id` を REST に出す |
| Code Snippets | CPT / CORS / ACFフィールド / JWT定数 をPHPスニペットで定義 |
| JWT Authentication for WP REST API | HTTP環境でトークン認証を可能にする |
| WP Multibyte Patch | 既存（日本語環境用） |
| Site Kit by Google | 既存 |

---

## Code Snippets で運用中のスニペット (5本)

すべて Active で `scope=global`。再構築時はこの5本をコピーすればCMSとして同等に動く。

### 1. `Omnibass JWT Auth Constants` (priority=1)
```php
if (!defined('JWT_AUTH_SECRET_KEY')) {
    define('JWT_AUTH_SECRET_KEY', '<64バイトhex 秘密鍵>');
}
if (!defined('JWT_AUTH_CORS_ENABLE')) {
    define('JWT_AUTH_CORS_ENABLE', true);
}
```

### 2. `Omnibass CPT & Taxonomies`
- `register_post_type('columns', ...)` (rest_base=`columns`、taxonomies=`column_category`)
- `register_taxonomy('column_category', ...)` (rest_base=`column_categories`)
- `register_post_type('dx_columns', ...)` (rest_base=`dx-columns`)
- 起動時に `ai-agent` / `case-study` ターム を自動作成

### 3. `Omnibass CORS for Headless Frontends`
- `omnibass.jp` / `digital-yamato-dx.jp` / `biwako-omnibass.com` / `localhost` からの GET/OPTIONS のみ許可
- `get_http_origin()` を使い、`$_SERVER` 直接参照は避けている (ロリポップWAF回避)

### 4. `Omnibass ACF Field Groups`
- `acf_add_local_field_group(...)` で 3 つのグループを動的登録
  - `group_omnibass_news` (post): external_link, legacy_microcms_id
  - `group_omnibass_columns` (columns CPT): external_link, legacy_microcms_id
  - `group_yamato_dx_columns` (dx_columns CPT): title_en, tag_ja, tag_en, external_link, legacy_microcms_id
- いずれも `show_in_rest=1`

### 5. (Code Snippets プリセット) — 「アップロードしたファイル名を英小文字にする」など
- 既存サンプルは inactive のまま放置 (削除しても可)

> 全スニペットは管理画面 → スニペット → すべてのスニペット で確認・編集できる。

---

## REST API エンドポイント早見表

| 用途 | URL |
|---|---|
| ニュース一覧 | `/wp-json/wp/v2/posts?_embed=1` |
| ニュース詳細 | `/wp-json/wp/v2/posts/<id>?_embed=1` |
| Omnibass コラム一覧 | `/wp-json/wp/v2/columns?_embed=1` |
| Omnibass コラム詳細 | `/wp-json/wp/v2/columns/<id>?_embed=1` |
| YamatoDX DXコラム一覧 | `/wp-json/wp/v2/dx-columns?_embed=1` |
| YamatoDX DXコラム詳細 | `/wp-json/wp/v2/dx-columns/<id>?_embed=1` |
| カラムカテゴリ一覧 | `/wp-json/wp/v2/column_categories` |
| JWT トークン取得 | `POST /wp-json/jwt-auth/v1/token` (body: `{username, password}`) |
| JWT 検証 | `POST /wp-json/jwt-auth/v1/token/validate` (header: `Authorization: Bearer ...`) |

---

## フロント側の配信

`js/cms-config.js` と `yamato_dx/assets/static/cms-config.js` の `wpBase` が
`http://cms.biwako-omnibass.com/wp-json/wp/v2` を指していれば、
`omnibass.jp` / `digital-yamato-dx.jp` にデプロイした時点で WP からコンテンツが読み込まれる。

**変更が必要なファイル (本番 FTP アップロード対象):**
```
js/cms-config.js
js/cms-client.js
yamato_dx/assets/static/cms-config.js
yamato_dx/assets/static/cms-client.js
```

レンダリング層 (`cms-news.js` / `cms-articles.js` / `cms-columns.js` / 詳細ページHTML) は
`cms-client.js` 内で WP→microCMS 互換シェイプに正規化しているため **無変更**。

> ⚠️ 本番フロント (omnibass.jp 等) が HTTPS で配信されている場合、HTTPの WP に直接 fetch すると
> Mixed Content エラーになる。ロリポップで `cms.biwako-omnibass.com` の **無料独自SSL** を有効化し、
> `wpBase` を `https://...` に書き換える対応が必要。

---

## Claude による自動投稿

### `.env` (gitignore済)

```
WP_BASE=http://cms.biwako-omnibass.com/wp-json/wp/v2
WP_JWT_BASE=http://cms.biwako-omnibass.com/wp-json/jwt-auth/v1
WP_USER=claude-publisher
WP_PASSWORD=<claude-publisher のWPログインパスワード>

MICROCMS_DOMAIN=ie4goy9psi
MICROCMS_API_KEY=<microCMSのGET権限キー>
```

`WP_JWT_BASE` が定義されていれば JWT 認証、無ければ Application Password 認証で動く（`scripts/wp-lib.mjs` の `buildAuthHeader()`）。

### 投稿コマンド

```bash
# ニュース (お知らせ/プレス/ブログ)
node scripts/wp-publish.mjs news \
  --title "サービスリリースのお知らせ" \
  --category "プレス" \
  --content path/to/body.md \
  --status publish

# コラム (AIエージェント / 導入事例)
node scripts/wp-publish.mjs columns \
  --title "AIエージェント導入の3ステップ" \
  --category-slug ai-agent \
  --excerpt "導入を始める前に押さえておくべき3つの観点を解説します。" \
  --content path/to/body.md \
  --thumbnail-url https://example.com/hero.jpg \
  --status draft

# DXコラム (JA/EN bilingual)
node scripts/wp-publish.mjs dx-columns \
  --title "DX推進の落とし穴" \
  --title-en "Pitfalls of DX" \
  --tag-ja "DXコラム" --tag-en "DX Column" \
  --content path/to/body.md \
  --status publish
```

オプション:
- `--status draft` (default) / `publish` / `future` (要 `--date=2026-05-10T10:00:00`)
- `--dry-run` — 実投稿せず payload を表示
- `--external-link <URL>` — ACF external_link

---

## microCMS からのデータ移行 (一回限り)

```bash
# .env に MICROCMS_DOMAIN / MICROCMS_API_KEY を入れる

# まずドライラン
node scripts/migrate-from-microcms.mjs --all --dry-run

# 本番実行 (1エンドポイントずつが安全)
node scripts/migrate-from-microcms.mjs --endpoint=news
node scripts/migrate-from-microcms.mjs --endpoint=columns
node scripts/migrate-from-microcms.mjs --endpoint=dx-columns
```

挙動:
- microCMS の全件を `_migration/dump-{endpoint}-{ts}.json` にバックアップ
- 各記事を WP に POST (公開日時 / カテゴリ / 画像 / ACF を保持)
- 元の microCMS ID を ACF `legacy_microcms_id` に保存
- 結果ログを `_migration/result-{endpoint}-{ts}.json` に出力
- **再実行で重複しない**（`legacy_microcms_id` 一致でスキップ）

移行完了後:
1. 静的サイトを再デプロイし、本番で記事が表示されることを確認
2. **microCMS 管理画面で旧 APIキーを失効**
3. microCMS 契約解除

---

## トラブルシュート

### 1. JWT トークンが取れない (`[jwt_auth] jwt_auth_bad_config`)
→ Code Snippets `Omnibass JWT Auth Constants` が active か確認。priority=1 (最優先) で実行されている必要あり。

### 2. REST API が 401 (rest_forbidden)
→ JWT トークンの有効期限切れ (デフォルト7日)。`POST /wp-json/jwt-auth/v1/token` で再取得。
スクリプトは毎回新規取得するので通常は意識不要。

### 3. CORS で fetch が失敗する
→ `Origin` ヘッダの値を確認。`Omnibass CORS for Headless Frontends` の `$allowed` 配列に追加して
スニペットを更新。Playwright で確認するときは `http://localhost:8000` 等を入れておく。

### 4. ロリポップ WAF が 403 を返す
→ Code Snippets で PHP コードを保存・実行する際、`$_SERVER` 直接参照、`status_header`、`exit`、
日本語コメント等が WAF に検知されて 403 になる。回避策:
- `get_http_origin()` 等のWP関数で `$_SERVER` 参照を避ける
- コメントは英語に
- 連続する WAF 検知時はロリポップ管理画面 → セキュリティ → WAF を一時的に無効化

### 5. ACF フィールドが REST に出ない
→ ACF プラグインが有効、かつ `acf_add_local_field_group` の各 field と group に `show_in_rest=1` が
設定されているか確認。Code Snippets `Omnibass ACF Field Groups` を再保存して試す。

### 6. CPT に taxonomy が `_embed` に出ない
→ CPT 登録時に `'taxonomies' => ['column_category']` を含めること（Code Snippets `Omnibass CPT & Taxonomies` 参照）。
これが無いと `column_categories:[id]` のアサインは動くが `_embedded.wp:term` には出ない。

---

## セキュリティ

- **JWTトークン取得用パスワードは `.env` のみ** — Git にコミットしない
- **ブラウザ側にトークンや認証情報は一切置かない** — フロント `cms-config.js` には URL のみ
- WP管理画面の **2要素認証** を有効化推奨
- ロリポップで **無料独自SSL** を有効化し、本番では `https://cms.biwako-omnibass.com` に切り替える
