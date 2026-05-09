<?php
/**
 * Plugin Name: Omnibass CORS for Headless Frontends
 * Description: omnibass.jp / digital-yamato-dx.jp などの静的フロントから wp-json/* を fetch
 *              できるよう、許可済みオリジンに対してのみ Access-Control-Allow-Origin を返す。
 *              GET/OPTIONS のみ許可。書き込みは Application Password 経由で同一オリジン扱いになるため CORS 不要。
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        $allowed = [
            'https://omnibass.jp',
            'https://www.omnibass.jp',
            'https://digital-yamato-dx.jp',
            'https://www.digital-yamato-dx.jp',
            'http://localhost:8000',
            'http://127.0.0.1:8000',
        ];

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if ($origin && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
            header('Access-Control-Allow-Credentials: false');
            header('Vary: Origin');
        }

        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(204);
            exit;
        }

        return $value;
    }, 15);
}, 15);
