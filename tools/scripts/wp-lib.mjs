// 共通ヘルパ: WordPress REST API クライアント / Markdown 変換 / .env 読み込み。
// 依存ゼロ (Node.js 18+ 標準のみ) で動く。

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const SCRIPT_DIR = path.dirname(__filename);
export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');

/** .env を読んで process.env に流し込む (引用符は剥がす)。 */
export async function loadDotenv(file = path.join(REPO_ROOT, '.env')) {
    let raw;
    try {
        raw = await fs.readFile(file, 'utf8');
    } catch {
        return;
    }
    for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        let v = m[2];
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
        }
        if (!(m[1] in process.env)) process.env[m[1]] = v;
    }
}

export function requireEnv(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

/** Application Password 用 Basic 認証ヘッダを組み立てる。 */
export function basicAuthHeader(user, appPassword) {
    return 'Basic ' + Buffer.from(`${user}:${appPassword}`).toString('base64');
}

/** JWT Authentication for WP REST API: ユーザ名/パスワードでトークンを取得し Bearer ヘッダにする。 */
export async function jwtAuthHeader(jwtBase, user, password) {
    const url = `${jwtBase.replace(/\/$/, '')}/token`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`JWT token fetch failed ${res.status}: ${text}`);
    let json;
    try { json = JSON.parse(text); } catch { throw new Error(`JWT token parse error: ${text}`); }
    if (!json.token) throw new Error(`JWT token missing in response: ${text}`);
    return 'Bearer ' + json.token;
}

/**
 * .env を読み、利用可能な認証方式から自動で Authorization ヘッダを組み立てる。
 *   - WP_JWT_BASE が設定されていれば JWT 経由 (HTTP でも動く)
 *   - 無ければ Application Password 想定で Basic
 */
export async function buildAuthHeader() {
    if (process.env.WP_JWT_BASE) {
        return jwtAuthHeader(
            process.env.WP_JWT_BASE,
            requireEnv('WP_USER'),
            requireEnv('WP_PASSWORD'),
        );
    }
    return basicAuthHeader(
        requireEnv('WP_USER'),
        requireEnv('WP_APP_PASSWORD'),
    );
}

/** WP REST にリクエスト。失敗時はステータスとレスポンス本文を含む Error を投げる。 */
export async function wpRequest(base, pathPart, { method = 'GET', auth, body, headers, query } = {}) {
    let url = `${base.replace(/\/$/, '')}/${pathPart.replace(/^\//, '')}`;
    if (query) {
        const qs = new URLSearchParams();
        for (const [k, v] of Object.entries(query)) {
            if (v == null) continue;
            qs.set(k, String(v));
        }
        const s = qs.toString();
        if (s) url += (url.includes('?') ? '&' : '?') + s;
    }
    const reqHeaders = { ...(headers || {}) };
    if (auth) reqHeaders['Authorization'] = auth;
    let payload = body;
    if (payload && typeof payload === 'object' && !(payload instanceof Buffer) && !(payload instanceof Uint8Array)) {
        reqHeaders['Content-Type'] = reqHeaders['Content-Type'] || 'application/json';
        payload = JSON.stringify(payload);
    }
    const res = await fetch(url, { method, headers: reqHeaders, body: payload });
    const text = await res.text();
    if (!res.ok) {
        const err = new Error(`WP ${method} ${url} -> ${res.status} ${res.statusText}: ${text}`);
        err.status = res.status;
        err.body = text;
        throw err;
    }
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
}

/** タクソノミーの slug → term ID を解決。無ければ作る。 */
export async function resolveOrCreateTerm({ base, auth, taxonomyRestBase, slug, name }) {
    const list = await wpRequest(base, taxonomyRestBase, { query: { slug, per_page: 1 } });
    if (Array.isArray(list) && list.length > 0) return list[0].id;
    const created = await wpRequest(base, taxonomyRestBase, {
        method: 'POST',
        auth,
        body: { slug, name: name || slug },
    });
    return created.id;
}

/** 画像URL → /wp/v2/media にアップロードして media ID を返す。 */
export async function uploadMediaFromUrl({ base, auth, sourceUrl, filename }) {
    const res = await fetch(sourceUrl);
    if (!res.ok) throw new Error(`fetch image failed ${res.status}: ${sourceUrl}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get('content-type') || 'application/octet-stream';
    const name = filename || path.basename(new URL(sourceUrl).pathname) || 'upload.bin';
    const upload = await wpRequest(base, 'media', {
        method: 'POST',
        auth,
        headers: {
            'Content-Type': ct,
            'Content-Disposition': `attachment; filename="${name}"`,
        },
        body: buf,
    });
    return upload.id;
}

// --- 軽量 Markdown → HTML 変換 -------------------------------------------------
// シンプルなブログ記事 (見出し / 段落 / リスト / 画像 / リンク / コードブロック) のみ対応。
// 完全な MD パーサが必要になったら marked などに置換する。

function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function inline(s) {
    // コード `xxx`
    s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${escHtml(c)}</code>`);
    // 画像 ![alt](url)
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) =>
        `<img src="${escHtml(url)}" alt="${escHtml(alt)}" loading="lazy">`);
    // リンク [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
        (_, t, url) => `<a href="${escHtml(url)}" target="_blank" rel="noopener">${t}</a>`);
    // 強調 **bold** / *italic*
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    return s;
}

export function markdownToHtml(md) {
    if (!md) return '';
    const lines = String(md).replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (/^```/.test(line)) {
            const buf = [];
            i++;
            while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
            i++;
            out.push(`<pre><code>${escHtml(buf.join('\n'))}</code></pre>`);
            continue;
        }
        const h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h) {
            const lv = h[1].length;
            out.push(`<h${lv}>${inline(escHtml(h[2]))}</h${lv}>`);
            i++; continue;
        }
        if (/^[-*]\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                items.push(`<li>${inline(escHtml(lines[i].replace(/^[-*]\s+/, '')))}</li>`);
                i++;
            }
            out.push(`<ul>${items.join('')}</ul>`);
            continue;
        }
        if (/^\d+\.\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                items.push(`<li>${inline(escHtml(lines[i].replace(/^\d+\.\s+/, '')))}</li>`);
                i++;
            }
            out.push(`<ol>${items.join('')}</ol>`);
            continue;
        }
        if (/^\s*$/.test(line)) { i++; continue; }
        // 段落: 連続行をまとめる
        const buf = [];
        while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6})\s/.test(lines[i])
               && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i]) && !/^```/.test(lines[i])) {
            buf.push(lines[i]); i++;
        }
        out.push(`<p>${inline(escHtml(buf.join(' ')))}</p>`);
    }
    return out.join('\n');
}

/** content 引数が .md / .html / .txt ファイルなら読んで返す。文字列ならそのまま。 */
export async function loadContent(input) {
    if (!input) return '';
    // ファイルパスっぽければ読む
    if (/\.(md|markdown|html|htm|txt)$/i.test(input)) {
        try {
            const stat = await fs.stat(input);
            if (stat.isFile()) {
                const raw = await fs.readFile(input, 'utf8');
                if (/\.(md|markdown)$/i.test(input)) return markdownToHtml(raw);
                return raw;
            }
        } catch {
            // 存在しなければそのまま文字列として扱う
        }
    }
    return input;
}

/** argv をパース。--key=val / --key val / --flag を扱う。 */
export function parseArgs(argv) {
    const positional = [];
    const opts = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith('--')) {
            const eq = a.indexOf('=');
            if (eq > -1) {
                opts[a.slice(2, eq)] = a.slice(eq + 1);
            } else {
                const next = argv[i + 1];
                if (next && !next.startsWith('--')) { opts[a.slice(2)] = next; i++; }
                else { opts[a.slice(2)] = true; }
            }
        } else {
            positional.push(a);
        }
    }
    return { positional, opts };
}

export function logErr(msg) { process.stderr.write(`[wp-publish] ${msg}\n`); }
export function logInfo(msg) { process.stdout.write(`[wp-publish] ${msg}\n`); }
