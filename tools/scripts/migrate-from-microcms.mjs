#!/usr/bin/env node
/**
 * microCMS → WordPress 全件移行スクリプト (一回限り想定)。
 *
 *   node scripts/migrate-from-microcms.mjs --endpoint=news       [--dry-run] [--limit=N]
 *   node scripts/migrate-from-microcms.mjs --endpoint=columns    [--dry-run]
 *   node scripts/migrate-from-microcms.mjs --endpoint=dx-columns [--dry-run]
 *   node scripts/migrate-from-microcms.mjs --all                 [--dry-run]
 *
 * 動作:
 *   1. microCMS から全件取得し _migration/dump-{endpoint}-{ts}.json に保存
 *   2. 各記事を対応する WP rest_base に POST (公開日時 / カテゴリ / 画像 / ACF を保持)
 *   3. ACF.legacy_microcms_id に元IDを保存。再実行時は既存をスキップ
 *   4. 結果を _migration/result-{endpoint}-{ts}.json に書き出す
 *
 * .env (移行用に追加):
 *   MICROCMS_DOMAIN=ie4goy9psi
 *   MICROCMS_API_KEY=<GET権限のキー>
 *   WP_BASE / WP_USER / WP_APP_PASSWORD は wp-publish と共通
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import {
    loadDotenv, requireEnv, buildAuthHeader, wpRequest,
    resolveOrCreateTerm, uploadMediaFromUrl,
    parseArgs, logErr, logInfo, REPO_ROOT,
} from './wp-lib.mjs';

const ENDPOINT_MAP = {
    'news':       { restBase: 'posts',      microcms: 'news' },
    'columns':    { restBase: 'columns',    microcms: 'columns' },
    'dx-columns': { restBase: 'dx-columns', microcms: 'dx-columns' },
};

async function fetchAllFromMicrocms(domain, apiKey, microcmsId) {
    const headers = { 'X-MICROCMS-API-KEY': apiKey };
    const all = [];
    let offset = 0;
    const PAGE = 100;
    while (true) {
        const url = `https://${domain}.microcms.io/api/v1/${microcmsId}?limit=${PAGE}&offset=${offset}&orders=publishedAt`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`microCMS ${microcmsId} ${res.status}: ${await res.text()}`);
        const data = await res.json();
        const list = Array.isArray(data.contents) ? data.contents : [];
        all.push(...list);
        const total = typeof data.totalCount === 'number' ? data.totalCount : list.length;
        offset += list.length;
        if (offset >= total || list.length === 0) break;
    }
    return all;
}

async function findExistingByLegacyId({ base, auth, restBase, legacyId }) {
    // ACF プラグインが REST 検索を提供しないため、検索 (search) と meta_query の代わりに
    // legacy_microcms_id を query string で渡し、ACF 側で `acf_meta` 公開しているケースに頼る。
    // より確実には wp-content/mu-plugins/omnibass-cpt.php に検索フィルタを足す手もある。
    // ここではシンプルに新着順でページ走査し、ACF.legacy_microcms_id 一致を探す。
    let page = 1;
    while (page <= 10) {
        const list = await wpRequest(base, restBase, {
            auth, query: { per_page: 100, page, status: 'any,publish,draft,private,future' }
        });
        if (!Array.isArray(list) || list.length === 0) return null;
        for (const p of list) {
            if (p.acf && String(p.acf.legacy_microcms_id || '') === String(legacyId)) return p;
        }
        if (list.length < 100) return null;
        page++;
    }
    return null;
}

async function migrateOne({ base, auth, kind, item, dryRun }) {
    const { restBase, microcms } = ENDPOINT_MAP[kind];
    const legacyId = item.id;

    const acf = { legacy_microcms_id: legacyId };
    if (item.link) acf.external_link = item.link;
    if (kind === 'dx-columns') {
        if (item.titleEn) acf.title_en = item.titleEn;
        if (item.tag) acf.tag_ja = item.tag;
        if (item.tagEn) acf.tag_en = item.tagEn;
    }

    const payload = {
        title: item.title || '(no title)',
        content: item.body || item.content || '',
        excerpt: item.excerpt || '',
        status: 'publish',
        date_gmt: item.publishedAt ? item.publishedAt.replace(/Z$/, '') : undefined,
        acf,
    };

    // カテゴリ解決
    if (kind === 'news' && item.category) {
        const cat = Array.isArray(item.category) ? item.category[0] : item.category;
        if (cat && !dryRun) {
            const id = await resolveOrCreateTerm({
                base, auth, taxonomyRestBase: 'categories',
                slug: encodeURIComponent(cat), name: cat,
            });
            payload.categories = [id];
        } else if (cat) {
            payload.categories_resolved_by_name = cat;
        }
    }
    if (kind === 'columns' && item.category) {
        const cat = Array.isArray(item.category) ? item.category[0] : item.category;
        const slug = (cat && cat.id) ? cat.id : cat;
        if (slug && !dryRun) {
            const id = await resolveOrCreateTerm({
                base, auth, taxonomyRestBase: 'column_categories',
                slug, name: slug,
            });
            payload.column_categories = [id];
        } else if (slug) {
            payload.column_categories_resolved_by_slug = slug;
        }
    }

    // 画像
    if (item.thumbnail && item.thumbnail.url) {
        if (dryRun) {
            payload.featured_media_resolved_from = item.thumbnail.url;
        } else {
            try {
                const mediaId = await uploadMediaFromUrl({ base, auth, sourceUrl: item.thumbnail.url });
                payload.featured_media = mediaId;
            } catch (e) {
                logErr(`thumbnail upload failed for ${legacyId}: ${e.message}`);
            }
        }
    }

    if (dryRun) return { dryRun: true, legacyId, payload };

    // 重複チェック
    const existing = await findExistingByLegacyId({ base, auth, restBase, legacyId });
    if (existing) {
        logInfo(`skip ${microcms}/${legacyId} → already at WP id=${existing.id}`);
        return { skipped: true, legacyId, wpId: existing.id };
    }

    const created = await wpRequest(base, restBase, { method: 'POST', auth, body: payload });
    logInfo(`migrated ${microcms}/${legacyId} → WP id=${created.id}`);
    return { legacyId, wpId: created.id };
}

async function migrateEndpoint(kind, opts) {
    const { microcms } = ENDPOINT_MAP[kind];
    const domain = requireEnv('MICROCMS_DOMAIN');
    const apiKey = requireEnv('MICROCMS_API_KEY');
    const base = requireEnv('WP_BASE');
    const auth = opts['dry-run'] ? null : await buildAuthHeader();

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const dumpDir = path.join(REPO_ROOT, '_migration');
    await fs.mkdir(dumpDir, { recursive: true });

    logInfo(`fetching microCMS ${microcms} ...`);
    const items = await fetchAllFromMicrocms(domain, apiKey, microcms);
    await fs.writeFile(path.join(dumpDir, `dump-${microcms}-${ts}.json`),
        JSON.stringify(items, null, 2));
    logInfo(`fetched ${items.length} items`);

    let limit = opts.limit ? parseInt(opts.limit, 10) : items.length;
    const target = items.slice(0, limit);

    const results = [];
    for (const item of target) {
        try {
            const r = await migrateOne({
                base, auth, kind, item, dryRun: !!opts['dry-run']
            });
            results.push(r);
        } catch (e) {
            logErr(`failed ${microcms}/${item.id}: ${e.message}`);
            results.push({ legacyId: item.id, error: e.message });
        }
    }

    await fs.writeFile(path.join(dumpDir, `result-${microcms}-${ts}.json`),
        JSON.stringify(results, null, 2));
    logInfo(`done ${microcms}: ${results.length} items processed`);
    return results;
}

async function main() {
    await loadDotenv();
    const { opts } = parseArgs(process.argv.slice(2));
    const targets = opts.all
        ? Object.keys(ENDPOINT_MAP)
        : (opts.endpoint ? [opts.endpoint] : []);
    if (targets.length === 0) {
        logErr('usage: migrate-from-microcms.mjs --endpoint=<news|columns|dx-columns> [--dry-run] [--limit=N]');
        logErr('   or: migrate-from-microcms.mjs --all [--dry-run]');
        process.exit(1);
    }
    for (const t of targets) {
        if (!(t in ENDPOINT_MAP)) {
            logErr(`unknown endpoint: ${t}`); process.exit(1);
        }
        await migrateEndpoint(t, opts);
    }
}

main().catch(e => { logErr(e.stack || e.message); process.exit(99); });
