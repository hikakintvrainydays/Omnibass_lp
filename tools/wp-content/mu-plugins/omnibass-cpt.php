<?php
/**
 * Plugin Name: Omnibass CPT & Taxonomies
 * Description: columns / dx_columns カスタム投稿タイプと column_category タクソノミーを登録する。
 *              REST API (rest_base) 経由で静的フロント (omnibass.jp / digital-yamato-dx.jp) から取得される。
 *              管理画面で意図せず無効化されないよう mu-plugins に置く想定。
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    register_post_type('columns', [
        'label'         => 'コラム (Omnibass)',
        'public'        => true,
        'show_in_rest'  => true,
        'rest_base'     => 'columns',
        'supports'      => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
        'has_archive'   => false,
        'menu_position' => 20,
        'menu_icon'     => 'dashicons-edit',
    ]);

    register_taxonomy('column_category', 'columns', [
        'labels' => [
            'name'          => 'コラムカテゴリ',
            'singular_name' => 'コラムカテゴリ',
        ],
        'show_in_rest'      => true,
        'rest_base'         => 'column_categories',
        'hierarchical'      => true,
        'show_admin_column' => true,
    ]);

    register_post_type('dx_columns', [
        'label'         => 'DXコラム (YamatoDX)',
        'public'        => true,
        'show_in_rest'  => true,
        'rest_base'     => 'dx-columns',
        'supports'      => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'has_archive'   => false,
        'menu_position' => 21,
        'menu_icon'     => 'dashicons-translation',
    ]);
});

add_action('init', function () {
    if (!taxonomy_exists('column_category')) {
        return;
    }
    foreach ([
        'ai-agent'   => 'AIエージェント',
        'case-study' => '導入事例',
    ] as $slug => $name) {
        if (!term_exists($slug, 'column_category')) {
            wp_insert_term($name, 'column_category', ['slug' => $slug]);
        }
    }
}, 11);
