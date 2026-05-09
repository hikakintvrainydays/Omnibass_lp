#!/usr/bin/env node
/**
 * WordPress 自動投稿 CLI。
 *
 *   node scripts/wp-publish.mjs <kind> [options]
 *
 * kind:
 *   news        : 標準投稿 (posts) に投稿。--category="お知らせ" など
 *   columns     : CPT columns に投稿。--category-slug=ai-agent / case-study
 *   dx-columns  : CPT dx_columns に投稿。--title-en --tag-ja --tag-en
 *
 * 共通オプション:
 *   --title         必須。投稿タイトル
 *   --content       本文。.md / .html ファイルパスでも、文字列直書きでも可
 *   --excerpt       任意。抜粋
 *   --thumbnail-url 任意。featured_media にアップロードする画像URL
 *   --external-link 任意。ACF external_link
 *   --status        draft (デフォルト) | publish | future
 *   --date          ISO日時 (例: 2026-05-08T10:00:00) — future で予約公開
 *   --dry-run       実投稿せずペイロードを表示
 *
 * 認証は .env から:
 *   WP_BASE=https://cms.omnibass.jp/wp-json/wp/v2
 *   WP_USER=claude-publisher
 *   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
 */

import {
    loadDotenv, requireEnv, buildAuthHeader, wpRequest,
    resolveOrCreateTerm, uploadMediaFromUrl,
    loadContent, parseArgs, logErr, logInfo,
} from './wp-lib.mjs';

const KIND_TO_REST = {
    news: 'posts',
    columns: 'columns',
    'dx-columns': 'dx-columns',
};

const NEWS_CATEGORY_DEFAULTS = {
    'お知らせ': 'お知らせ',
    'プレス':   'プレス',
    'ブログ':   'ブログ',
};

async function main() {
    await loadDotenv();
    const { positional, opts } = parseArgs(process.argv.slice(2));
    const kind = positional[0];
    if (!kind || !(kind in KIND_TO_REST)) {
        logErr(`usage: wp-publish.mjs <news|columns|dx-columns> --title=... --content=... [--status=draft|publish]`);
        process.exit(1);
    }
    const restBase = KIND_TO_REST[kind];

    if (!opts.title) { logErr('--title is required'); process.exit(1); }
    const status = (opts.status || 'draft');
    if (!['draft', 'publish', 'future', 'pending'].includes(status)) {
        logErr(`invalid --status=${status}`); process.exit(1);
    }

    const base = requireEnv('WP_BASE');
    const auth = opts['dry-run'] ? null : await buildAuthHeader();

    const contentHtml = await loadContent(opts.content || '');
    const payload = {
        title: opts.title,
        content: contentHtml,
        status,
    };
    if (opts.excerpt) payload.excerpt = opts.excerpt;
    if (opts.date) payload.date = opts.date;

    // ACF フィールド (REST に出すには ACF プラグイン側で expose 設定済みであること)
    const acf = {};
    if (opts['external-link']) acf.external_link = opts['external-link'];
    if (kind === 'dx-columns') {
        if (opts['title-en']) acf.title_en = opts['title-en'];
        if (opts['tag-ja']) acf.tag_ja = opts['tag-ja'];
        if (opts['tag-en']) acf.tag_en = opts['tag-en'];
    }
    if (Object.keys(acf).length > 0) payload.acf = acf;

    // カテゴリ / ターム解決
    if (kind === 'news' && opts.category) {
        if (opts['dry-run']) {
            payload.categories_resolved_by_name = opts.category;
        } else {
            const slugCandidate = NEWS_CATEGORY_DEFAULTS[opts.category] || opts.category;
            const id = await resolveOrCreateTerm({
                base, auth,
                taxonomyRestBase: 'categories',
                slug: encodeURIComponent(slugCandidate),
                name: opts.category,
            });
            payload.categories = [id];
        }
    }
    if (kind === 'columns' && opts['category-slug']) {
        if (opts['dry-run']) {
            payload.column_categories_resolved_by_slug = opts['category-slug'];
        } else {
            const id = await resolveOrCreateTerm({
                base, auth,
                taxonomyRestBase: 'column_categories',
                slug: opts['category-slug'],
                name: opts['category-slug'],
            });
            payload.column_categories = [id];
        }
    }

    // featured_media
    if (opts['thumbnail-url']) {
        if (opts['dry-run']) {
            payload.featured_media_resolved_from = opts['thumbnail-url'];
        } else {
            const mediaId = await uploadMediaFromUrl({
                base, auth, sourceUrl: opts['thumbnail-url'],
            });
            payload.featured_media = mediaId;
        }
    }

    if (opts['dry-run']) {
        logInfo(`DRY RUN: POST ${base}/${restBase}`);
        process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
        return;
    }

    try {
        const result = await wpRequest(base, restBase, { method: 'POST', auth, body: payload });
        logInfo(`created id=${result.id} status=${result.status} link=${result.link}`);
        process.stdout.write(JSON.stringify({ id: result.id, status: result.status, link: result.link }) + '\n');
    } catch (e) {
        logErr(e.message);
        process.exit(2);
    }
}

main().catch(e => { logErr(e.stack || e.message); process.exit(99); });
