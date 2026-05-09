// ===============================
// Contact Form 7 デバッグ付き送信スクリプト
// ===============================

// ✅ あなたのフォームエンドポイント
const CF7_ENDPOINT = "https://meguru-travel.jp/service_hub/wp-json/contact-form-7/v1/contact-forms/7/feedback";

const form = document.getElementById("contactForm");
const resultMessage = document.getElementById("resultMessage");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 送信中の表示
  submitBtn.disabled = true;
  resultMessage.textContent = "送信中です...";
  resultMessage.style.color = "#555";

  const formData = new FormData(form);

  // 🔍 デバッグ: 送信データをコンソール表示
  console.group("📤 送信デバッグ情報");
  for (const [key, value] of formData.entries()) {
    console.log(`・${key}: ${value}`);
  }
  console.groupEnd();

  try {
    console.log("🌍 API送信先:", CF7_ENDPOINT);
    const response = await fetch(CF7_ENDPOINT, {
      method: "POST",
      body: formData
    });

    console.log("📥 ステータスコード:", response.status);
    const result = await response.json();
    // 成功時はサンクスページへリダイレクト
    if (result && result.status === "mail_sent") {
      try {
        const lang = (window.TT && typeof window.TT.getLang === 'function')
          ? window.TT.getLang()
          : (new URLSearchParams(location.search).get('lang') || 'en');
        window.location.href = `thanks.html?lang=${lang}`;
      } catch(_) {
        window.location.href = 'thanks.html';
      }
      return;
    }
    console.log("📦 Contact Form 7 の応答:", result);

    // 🔍 レスポンス内容で分岐
    if (result.status === "mail_sent") {
      resultMessage.textContent = "✅ お問い合わせを送信しました。ありがとうございました！";
      resultMessage.style.color = "green";
      form.reset();
    } else if (result.status === "validation_failed") {
      resultMessage.textContent = "⚠️ 入力内容に不備があります。ご確認ください。";
      resultMessage.style.color = "orange";
    } else if (result.status === "mail_failed") {
      resultMessage.textContent = "❌ メール送信に失敗しました。WordPressのメール設定を確認してください。";
      resultMessage.style.color = "red";
    } else {
      resultMessage.textContent = `⚠️ 不明なエラー: ${result.message || "詳細不明"}`;
      resultMessage.style.color = "red";
    }

  } catch (error) {
    console.error("💥 通信エラー:", error);
    resultMessage.textContent = "通信エラーが発生しました。";
    resultMessage.style.color = "red";
  } finally {
    submitBtn.disabled = false;
  }
});
