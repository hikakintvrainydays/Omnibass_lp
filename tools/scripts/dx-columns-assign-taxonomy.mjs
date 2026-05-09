#!/usr/bin/env node
/**
 * 既存の dx_columns 全記事に対し、ACF tag_ja の値を見て
 * dx_column_category タクソノミーの該当 term を割り当てる。
 *
 *   node tools/scripts/dx-columns-assign-taxonomy.mjs [--dry-run]
 *
 * 前提: WordPress 側に omnibass-cpt.php (mu-plugin) の更新版が反映され、
 *       dx_column_category タクソノミーが登録済みであること。
 */

import {
    loadDotenv, requireEnv, buildAuthHeader, wpRequest,
    parseArgs, logErr, logInfo,
} from './wp-lib.mjs';

const TAG_JA_TO_SLUG = {
    'DX入門': 'dx-basics',
    '業務改善': 'operations',
    'IT導入': 'it-adoption',
    'AI活用': 'ai',
    '補助金': 'subsidy',
    '法令対応': 'compliance',
    '業種別DX': 'industry',
    '滋賀・関西': 'shiga-kansai',
    '人材・組織': 'people',
    'セキュリティ': 'security',
};

async function fetchAllArticles({ base, auth }) {
    const all = [];
    let page = 1;
    while (true) {
        const arr = await wpRequest(base, 'dx-columns', {
            auth,
            query: { per_page: 100, page, status: 'publish,draft,pending,future,private', _fields: 'id,title,acf' },
        });
        if (!Array.isArray(arr) || arr.length === 0) break;
        all.push(...arr);
        if (arr.length < 100) break;
        page++;
        if (page > 50) break; // 安全ガード
    }
    return all;
}

async function fetchTermsBySlug({ base, auth }) {
    const terms = await wpRequest(base, 'dx-column-categories', {
        auth,
        query: { per_page: 100, _fields: 'id,slug,name' },
    });
    const map = {};
    for (const t of (terms || [])) map[t.slug] = t.id;
    return map;
}

async function main() {
    await loadDotenv();
    const { opts } = parseArgs(process.argv.slice(2));
    const dryRun = !!opts['dry-run'];

    const base = requireEnv('WP_BASE');
    const auth = await buildAuthHeader();

    logInfo('fetching dx-column-categories ...');
    const slugToTermId = await fetchTermsBySlug({ base, auth });
    const missing = Object.values(TAG_JA_TO_SLUG).filter(s => !(s in slugToTermId));
    if (missing.length > 0) {
        logErr(`missing terms in WP: ${missing.join(', ')}. mu-plugin の最新版がアップ済みか確認してください。`);
        process.exit(1);
    }
    logInfo(`terms ok: ${Object.keys(slugToTermId).length} terms`);

    logInfo('fetching all dx-columns ...');
    const articles = await fetchAllArticles({ base, auth });
    logInfo(`articles: ${articles.length}`);

    let ok = 0, skipped = 0, failed = 0;
    for (const a of articles) {
        const tagJa = a.acf && a.acf.tag_ja;
        if (!tagJa) { skipped++; continue; }
        const slug = TAG_JA_TO_SLUG[tagJa];
        if (!slug) { skipped++; continue; }
        const termId = slugToTermId[slug];
        if (dryRun) {
            logInfo(`DRY id=${a.id} tagJa="${tagJa}" -> term=${slug}(${termId})`);
            ok++;
            continue;
        }
        try {
            await wpRequest(base, `dx-columns/${a.id}`, {
                method: 'POST',
                auth,
                body: { 'dx-column-categories': [termId] },
            });
            ok++;
            if (ok % 10 === 0) logInfo(`progress: ${ok}/${articles.length}`);
        } catch (e) {
            failed++;
            logErr(`FAIL id=${a.id}: ${e.message.slice(0, 200)}`);
        }
    }
    logInfo(`done: ok=${ok} skipped=${skipped} failed=${failed}`);
    if (failed > 0) process.exit(2);
}

main().catch(e => { logErr(e.stack || e.message); process.exit(99); });
