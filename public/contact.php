<?php
/**
 * お問い合わせフォーム処理スクリプト
 * ロリポップレンタルサーバー対応
 */

// CORSヘッダー（必要に応じて調整）
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// プリフライトリクエスト対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POSTメソッドのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => '不正なリクエストです。']);
    exit();
}

// 設定
$to_email = 'your-email@example.com'; // ← 受信先メールアドレスを設定してください
$from_email = 'noreply@omnibus.jp';   // ← 送信元メールアドレスを設定してください

// JSON入力を取得
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 入力値の取得とサニタイズ
$name = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email = isset($data['email']) ? trim(strip_tags($data['email'])) : '';
$subject = isset($data['subject']) ? trim(strip_tags($data['subject'])) : 'お問い合わせ';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

// バリデーション
if (empty($name)) {
    echo json_encode(['success' => false, 'error' => 'お名前を入力してください。']);
    exit();
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => '正しいメールアドレスを入力してください。']);
    exit();
}

if (empty($message)) {
    echo json_encode(['success' => false, 'error' => 'お問い合わせ内容を入力してください。']);
    exit();
}

// ヘッダーインジェクション対策
$name = str_replace(["\r", "\n"], '', $name);
$email = str_replace(["\r", "\n"], '', $email);
$subject = str_replace(["\r", "\n"], '', $subject);

// 日本語メール設定
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// メール件名
$mail_subject = "【お問い合わせ】" . $subject;

// メール本文
$mail_body = <<<EOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Omnibus ホームページからのお問い合わせ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■ お名前
{$name}

■ メールアドレス
{$email}

■ 件名
{$subject}

■ お問い合わせ内容
{$message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
このメールはOmnibusホームページのお問い合わせフォームから
自動送信されました。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOT;

// メールヘッダー
$headers = "From: " . mb_encode_mimeheader($name) . " <{$from_email}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// メール送信
$result = mb_send_mail($to_email, $mail_subject, $mail_body, $headers);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'メールの送信に失敗しました。しばらく経ってからお試しください。']);
}
