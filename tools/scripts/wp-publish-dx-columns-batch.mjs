#!/usr/bin/env node
/**
 * dx001.md 〜 dx100.md を一括で WordPress (dx-columns CPT) に投稿する。
 *
 *   node tools/scripts/wp-publish-dx-columns-batch.mjs [--from=1] [--to=100] [--status=publish] [--dry-run]
 *
 * 各記事の仕様 (タイトル / タグ / サムネ photo-id) は本ファイル末尾の ARTICLES 配列で定義。
 * 本文は docs/yamato_dx-plots/dx-columns-articles/dx{NNN}.md を読む。
 *
 * 認証は .env から (wp-lib.mjs の buildAuthHeader と同じ)。
 */

import path from 'node:path';
import {
    loadDotenv, requireEnv, buildAuthHeader, wpRequest,
    loadContent, parseArgs, logErr, logInfo, REPO_ROOT,
} from './wp-lib.mjs';

// ロリポップの WAF が wp-json/wp/v2/media へのバイナリ raw POST を 403 で弾くため、
// multipart/form-data 形式で送る (これは通る)。
async function uploadMediaMultipart({ base, auth, sourceUrl, filename }) {
    const res = await fetch(sourceUrl);
    if (!res.ok) throw new Error(`fetch image failed ${res.status}: ${sourceUrl}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get('content-type') || 'image/jpeg';
    const name = filename || 'upload.jpg';

    const form = new FormData();
    const blob = new Blob([buf], { type: ct });
    form.append('file', blob, name);

    const up = await fetch(`${base.replace(/\/$/, '')}/media`, {
        method: 'POST',
        headers: { 'Authorization': auth },
        body: form,
    });
    const text = await up.text();
    if (!up.ok) throw new Error(`media upload ${up.status}: ${text.slice(0, 200)}`);
    const json = JSON.parse(text);
    return json.id;
}

const ARTICLES_DIR = path.join(REPO_ROOT, 'docs/yamato_dx-plots/dx-columns-articles');
const UNSPLASH_TPL = (id) => `https://images.unsplash.com/photo-${id}?w=1600&q=80`;

const ARTICLES = [
    // C01 DX入門・基礎
    { id: 'dx001', title: '中小企業のDXとは何か?経産省の定義と現場感覚のギャップを埋める', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1454165804606-c3d57bc86b40' },
    { id: 'dx002', title: 'DXに何から手をつけるべきか?中小企業の優先順位の付け方', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1531973576160-7125cd663d86' },
    { id: 'dx003', title: 'DXとIT化・デジタル化の違いを整理する', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1497215728101-856f4ea42174' },
    { id: 'dx004', title: 'DXが進まない8つの理由と中小企業ができる打ち手', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1568992687947-868a62a9f521' },
    { id: 'dx005', title: 'DX推進指標で自社を診断する手順とつまずきポイント', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1606857521015-7f9fcf423740' },
    { id: 'dx006', title: 'DX認定制度のメリットと申請の流れ', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1535957998253-26ae1ef29506' },
    { id: 'dx007', title: 'DXセレクション選定企業から学べる中小企業DXの型', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1517048676732-d65bc937f952' },
    { id: 'dx008', title: '中小企業のDX成熟度4段階モデル|現在地の見つけ方', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1573164574572-cb89e39749b4' },
    { id: 'dx009', title: 'デジタルガバナンス・コード3.0が中小企業に与える影響', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1686771416282-3888ddaf249b' },
    { id: 'dx010', title: 'DXの第一歩としての「業務の見える化」具体的な進め方', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1532622785990-d2c36a76f5a6' },
    { id: 'dx011', title: 'DX推進体制の作り方|専任が置けない中小企業の選択肢', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1596496181871-9681eacf9764' },
    { id: 'dx012', title: 'DX投資のROI試算|経営者が見るべき5つの指標', tagJa: 'DX入門', tagEn: 'DX Basics', photoId: '1666875753105-c63a6f3bdc86' },

    // C02 業務改善・自動化
    { id: 'dx013', title: 'Excel業務を自動化する5つの方法|VBA / Power Query / Power Automate', tagJa: '業務改善', tagEn: 'Operations', photoId: '1551288049-bebda4e38f71' },
    { id: 'dx014', title: 'RPAとマクロの違い|中小企業はどちらから始めるべきか', tagJa: '業務改善', tagEn: 'Operations', photoId: '1485827404703-89b55fcc595e' },
    { id: 'dx015', title: '紙の請求書をなくす|ペーパーレス化の進め方とよくある失敗', tagJa: '業務改善', tagEn: 'Operations', photoId: '1554224155-1696413565d3' },
    { id: 'dx016', title: '定型業務を自動化するツール比較|RPA / iPaaS / マクロ', tagJa: '業務改善', tagEn: 'Operations', photoId: '1531746790731-6c087fecd65a' },
    { id: 'dx017', title: 'Power Automateで始める業務自動化|中小企業向け実装パターン', tagJa: '業務改善', tagEn: 'Operations', photoId: '1488590528505-98d2b5aba04b' },
    { id: 'dx018', title: 'Zapier / Make / Power Automate どれを使う?用途別比較', tagJa: '業務改善', tagEn: 'Operations', photoId: '1498050108023-c5249f4df085' },
    { id: 'dx019', title: 'スプレッドシート × GASで作る小さな自動化の始め方', tagJa: '業務改善', tagEn: 'Operations', photoId: '1555066931-4365d14bab8c' },
    { id: 'dx020', title: '経費精算を自動化する|手入力ゼロを目指すワークフロー設計', tagJa: '業務改善', tagEn: 'Operations', photoId: '1574607408180-3b72da2969bb' },
    { id: 'dx021', title: '受発注業務のDX|FAX/メール/電話を脱却するステップ', tagJa: '業務改善', tagEn: 'Operations', photoId: '1684695749267-233af13276d0' },
    { id: 'dx022', title: '在庫管理システム導入の判断基準|Excel卒業のタイミング', tagJa: '業務改善', tagEn: 'Operations', photoId: '1587293852726-70cdb56c2866' },
    { id: 'dx023', title: '勤怠管理のクラウド化|紙タイムカードを乗り換える前に確認すること', tagJa: '業務改善', tagEn: 'Operations', photoId: '1605052746298-b82956aa8bca' },
    { id: 'dx024', title: '議事録作成を自動化する|文字起こしAIと運用ルール', tagJa: '業務改善', tagEn: 'Operations', photoId: '1606836591695-4d58a73eba1e' },

    // C03 クラウドツール・IT導入
    { id: 'dx025', title: 'kintone導入で失敗しないための要件整理5ステップ', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1542744173-8e7e53415bb0' },
    { id: 'dx026', title: 'クラウド会計ソフト比較|freee / マネーフォワード / 弥生の選び方', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1574607408168-ba3d03011c23' },
    { id: 'dx027', title: 'グループウェアの選び方|サイボウズOffice / Microsoft 365 / Google Workspace', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1606836559739-7b1d9fbf8a6e' },
    { id: 'dx028', title: 'SmartHRとジョブカン労務|労務管理クラウドの違い', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1635859890085-ec8cb5466806' },
    { id: 'dx029', title: 'Microsoft 365を導入する中小企業がまず使うべき3機能', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1499673610122-01c7122c5dcb' },
    { id: 'dx030', title: 'Google Workspaceで何が変わるか|Gmail以外の活用法', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1555099962-4199c345e5dd' },
    { id: 'dx031', title: 'Notionを業務で使う|社内Wiki化の手順とつまずきポイント', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1773332585788-9104ec6f38ef' },
    { id: 'dx032', title: 'Slackを社内コミュニケーションの基盤にする|チャネル設計', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1521791136064-7986c2920216' },
    { id: 'dx033', title: 'ノーコードツールで中小企業ができること|限界と使いどころ', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1607705703571-c5a8695f18f6' },
    { id: 'dx034', title: '顧客管理(CRM)を始める|まずスプレッドシートから抜け出す', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1600880292203-757bb62b4baf' },
    { id: 'dx035', title: 'API連携で業務を繋ぐ|中小企業のシステム間連携入門', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1690627931320-16ac56eb2588' },
    { id: 'dx036', title: '小規模システム開発の費用感と発注時のチェックリスト', tagJa: 'IT導入', tagEn: 'IT Adoption', photoId: '1484417894907-623942c8ee29' },

    // C04 AI・生成AI活用
    { id: 'dx037', title: 'ChatGPTを業務で使う|中小企業が押さえるべき5つの活用領域', tagJa: 'AI活用', tagEn: 'AI', photoId: '1677442135703-1787eea5ce01' },
    { id: 'dx038', title: 'ChatGPT TeamとEnterpriseの違い|法人プランの選び方', tagJa: 'AI活用', tagEn: 'AI', photoId: '1677442136019-21780ecad995' },
    { id: 'dx039', title: '生成AI社内ガイドラインの作り方|テンプレートと運用のコツ', tagJa: 'AI活用', tagEn: 'AI', photoId: '1516192518150-0d8fee5425e3' },
    { id: 'dx040', title: '業務で使えるChatGPTプロンプトの設計原則', tagJa: 'AI活用', tagEn: 'AI', photoId: '1546776310-eef45dd6d63c' },
    { id: 'dx041', title: 'AIエージェントとは何か|2026年の業務利用ユースケース', tagJa: 'AI活用', tagEn: 'AI', photoId: '1620712943543-bcc4688e7485' },
    { id: 'dx042', title: 'Microsoft 365 Copilotでできること|中小企業の現実的な使い道', tagJa: 'AI活用', tagEn: 'AI', photoId: '1531297484001-80022131f5a1' },
    { id: 'dx043', title: '生成AIを社内に展開する手順|PoCで確認すべき5項目', tagJa: 'AI活用', tagEn: 'AI', photoId: '1507146153580-69a1fe6d8aa1' },
    { id: 'dx044', title: '生成AIの情報漏洩リスクと中小企業の対策', tagJa: 'AI活用', tagEn: 'AI', photoId: '1677442135131-4d7c123aef1c' },
    { id: 'dx045', title: 'カスタマーサポートに生成AIを使う|FAQ自動化の進め方', tagJa: 'AI活用', tagEn: 'AI', photoId: '1626863905121-3b0c0ed7b94c' },
    { id: 'dx046', title: '営業資料・提案書作成にChatGPTを使う|具体的な手順', tagJa: 'AI活用', tagEn: 'AI', photoId: '1542744173-05336fcc7ad4' },
    { id: 'dx047', title: '議事録・要約・翻訳|文書系業務に効くAIツールの選び方', tagJa: 'AI活用', tagEn: 'AI', photoId: '1486312338219-ce68d2c6f44d' },
    { id: 'dx048', title: '生成AI活用で成果が出ない原因と立て直し方', tagJa: 'AI活用', tagEn: 'AI', photoId: '1727434032773-af3cd98375ba' },

    // C05 補助金・制度
    { id: 'dx049', title: '2026年「デジタル化・AI導入補助金」の要点とIT導入補助金からの変更点', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1620202304757-2be2ae73784d' },
    { id: 'dx050', title: 'デジタル化・AI導入補助金 申請の流れと必要書類', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1564846824194-346b7871b855' },
    { id: 'dx051', title: '補助金の対象になるITツールの探し方|公式検索の使い方', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1607623198457-7aad066a4ade' },
    { id: 'dx052', title: 'ものづくり補助金とDX枠|2026年の制度動向', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1632914146475-bfe6fa6b2a12' },
    { id: 'dx053', title: '事業再構築補助金後継|新事業進出補助金との関係を整理', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1582190506824-ef3bd95a956e' },
    { id: 'dx054', title: '小規模事業者持続化補助金でDXに使えるパターン', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1574607524755-56493b242d28' },
    { id: 'dx055', title: '補助金申請の事業計画書|採択されるための書き方の基本', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1631651693480-97f1132e333d' },
    { id: 'dx056', title: '補助金が下りたあとの実績報告|スケジュールと注意点', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1554224155-cfa08c2a758f' },
    { id: 'dx057', title: '中小企業のためのIT導入支援事業者の選び方', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1521898284481-a5ec348cb555' },
    { id: 'dx058', title: '補助金頼みにしないIT投資|自己資金とのバランス', tagJa: '補助金', tagEn: 'Subsidy', photoId: '1574607407388-56b8ee097167' },

    // C06 法令対応
    { id: 'dx059', title: '電子帳簿保存法|中小企業がいま改めて確認すべき要件', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1583521214690-73421a1829a9' },
    { id: 'dx060', title: '電帳法対応のクラウドサービス選び方|JIIMA認証の見方', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1562654501-a0ccc0fc3fb1' },
    { id: 'dx061', title: 'インボイス制度|2026年9月の20%特例終了で何が変わるか', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1632152133952-98b268dc4b86' },
    { id: 'dx062', title: '改正個人情報保護法|中小企業が押さえるべき実務ポイント', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1516409590654-e8d51fc2d25c' },
    { id: 'dx063', title: '適格請求書発行事業者の登録判断|簡易課税との比較', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1631557776808-91908aba7ca0' },
    { id: 'dx064', title: 'フリーランスとの取引|下請法・フリーランス保護新法のチェックリスト', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1603796846097-bee99e4a601f' },
    { id: 'dx065', title: '改正電子契約法と電子署名|中小企業が導入する際の論点', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1695388474402-ed805a890d8d' },
    { id: 'dx066', title: '改正法対応で見直すべき社内規程5つ', tagJa: '法令対応', tagEn: 'Compliance', photoId: '1468779036391-52341f60b55d' },

    // C07 業種別DX
    { id: 'dx067', title: '製造業のDX|現場改善から始める3つの入り口', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1599765824376-a87eb981b2ee' },
    { id: 'dx068', title: '小売業・店舗のDX|POSデータと顧客接点の見直し', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1441984904996-e0b6ba687e04' },
    { id: 'dx069', title: '飲食店のDX|モバイルオーダーと予約管理の選択肢', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1578916171728-46686eac8d58' },
    { id: 'dx070', title: '建設業のDX|施工管理アプリと2026年問題', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1610895953514-4c6f2f2f4393' },
    { id: 'dx071', title: '物流・運送業のDX|2024年問題後の中小事業者の打ち手', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1740914994657-f1cdffdc418e' },
    { id: 'dx072', title: '士業(税理士・社労士)のDX|顧問先支援にも繋がる導入', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1635185481431-661b09594e6c' },
    { id: 'dx073', title: '医療・クリニックのDX|電子カルテ以降の業務効率化', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1525182008055-f88b95ff7980' },
    { id: 'dx074', title: '介護事業所のDX|記録業務の負担軽減策', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1556740758-90de374c12ad' },
    { id: 'dx075', title: '不動産業のDX|内見・契約・管理のオンライン化', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1481437156560-3205f6a55735' },
    { id: 'dx076', title: '観光・宿泊業のDX|予約管理とインバウンド対応', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1546213290-e1b492ab3eee' },
    { id: 'dx077', title: '農業のDX|スマート農業の中小経営体での現実解', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1583321500900-82807e458f3c' },
    { id: 'dx078', title: '教育・塾のDX|オンライン授業と学習管理の運用設計', tagJa: '業種別DX', tagEn: 'Industry', photoId: '1568871391149-449702439177' },

    // C08 滋賀・関西 地域SEO
    { id: 'dx079', title: '滋賀県のDX支援制度|産業支援プラザの活用法', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1681489934573-62bc242a82ed' },
    { id: 'dx080', title: '滋賀県の中小企業向け補助金|DXに使える制度まとめ', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1664596350962-603b0a41524a' },
    { id: 'dx081', title: '大津・草津エリアの中小企業がDXで変わる業務領域', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1629875499750-a31b83446598' },
    { id: 'dx082', title: '彦根・長浜エリアの製造業DX|地域企業の傾向と打ち手', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1681489935810-d8678d482dc6' },
    { id: 'dx083', title: '関西の中小企業DX|大阪・京都・兵庫・滋賀の支援制度比較', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1706273882882-5b5ce7e45eb4' },
    { id: 'dx084', title: '京都の伝統産業DX|職人技術とデジタルの両立', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1593870682327-0f313a173e21' },
    { id: 'dx085', title: '滋賀の観光・宿泊業DX|びわ湖エリアでの実装ヒント', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1660144240658-394c2b54488f' },
    { id: 'dx086', title: '滋賀のDX協創サロンと相談窓口の使い方', tagJa: '滋賀・関西', tagEn: 'Shiga/Kansai', photoId: '1681489933902-bb3644b91d65' },

    // C09 DX人材・組織
    { id: 'dx087', title: 'デジタルスキル標準ver.2.0|中小企業の人材育成にどう使うか', tagJa: '人材・組織', tagEn: 'People', photoId: '1532619187608-e5375cab36aa' },
    { id: 'dx088', title: 'DX人材を社内で育てる|外注しない中小企業の道筋', tagJa: '人材・組織', tagEn: 'People', photoId: '1690192168579-0f79e522a270' },
    { id: 'dx089', title: 'DXリテラシー研修|全社員に必要な基礎の作り方', tagJa: '人材・組織', tagEn: 'People', photoId: '1590103514966-5e2a11c13e21' },
    { id: 'dx090', title: 'リスキリング補助金|中小企業の人材投資に使える制度', tagJa: '人材・組織', tagEn: 'People', photoId: '1542744094-24638eff58bb' },
    { id: 'dx091', title: 'DX推進担当者を社内に置く|役割定義と権限設計', tagJa: '人材・組織', tagEn: 'People', photoId: '1497409988347-cbfaac2f0b12' },
    { id: 'dx092', title: '中小企業の組織文化とDX|抵抗をどう乗り越えるか', tagJa: '人材・組織', tagEn: 'People', photoId: '1542903660-eedba2cda473' },
    { id: 'dx093', title: 'DX伴走支援を活用する|中小企業の支援機関選びの基準', tagJa: '人材・組織', tagEn: 'People', photoId: '1521737604893-d14cc237f11d' },

    // C10 セキュリティ・ガバナンス
    { id: 'dx094', title: '中小企業の情報セキュリティ対策|2026年に押さえる10項目', tagJa: 'セキュリティ', tagEn: 'Security', photoId: '1695668548342-c0c1ad479aee' },
    { id: 'dx095', title: 'サプライチェーン攻撃|中小企業が標的になる理由と対策', tagJa: 'セキュリティ', tagEn: 'Security', photoId: '1546124404-9e7e3cac2ec1' },
    { id: 'dx096', title: 'AIガバナンス|2026年に向けた中小企業の現実的な対応', tagJa: 'セキュリティ', tagEn: 'Security', photoId: '1654009603731-20b6d7536002' },
    { id: 'dx097', title: 'プロンプトインジェクション対策|生成AI利用企業のチェックリスト', tagJa: 'セキュリティ', tagEn: 'Security', photoId: '1694903089438-bf28d4697d9a' },
    { id: 'dx098', title: 'ランサムウェア対策|バックアップ運用の見直しポイント', tagJa: 'セキュリティ', tagEn: 'Security', photoId: '1488229297570-58520851e868' },
    { id: 'dx099', title: 'クラウドサービスのセキュリティ評価|中小企業の選定基準', tagJa: 'セキュリティ', tagEn: 'Security', photoId: '1744868562210-fffb7fa882d9' },
    { id: 'dx100', title: 'EU AI Actと日本企業|中小企業も無関係ではない理由', tagJa: 'セキュリティ', tagEn: 'Security', photoId: '1601132359864-c974e79890ac' },
];

function checkDuplicateThumbnails() {
    const seen = new Map();
    for (const a of ARTICLES) {
        if (seen.has(a.photoId)) {
            throw new Error(`Duplicate photoId ${a.photoId}: ${seen.get(a.photoId)} と ${a.id}`);
        }
        seen.set(a.photoId, a.id);
    }
    return ARTICLES.length;
}

async function publishOne({ article, base, auth, status, dryRun }) {
    const mdPath = path.join(ARTICLES_DIR, `${article.id}.md`);
    const contentHtml = await loadContent(mdPath);
    if (!contentHtml || contentHtml.length < 100) {
        throw new Error(`content too short or missing: ${mdPath}`);
    }

    const thumbnailUrl = UNSPLASH_TPL(article.photoId);

    let mediaId = null;
    if (!dryRun) {
        mediaId = await uploadMediaMultipart({
            base, auth, sourceUrl: thumbnailUrl,
            filename: `${article.id}-${article.photoId}.jpg`,
        });
    }

    const payload = {
        title: article.title,
        content: contentHtml,
        status,
        acf: {
            tag_ja: article.tagJa,
            tag_en: article.tagEn,
        },
    };
    if (mediaId) payload.featured_media = mediaId;

    if (dryRun) {
        logInfo(`DRY ${article.id}: title="${article.title}" thumb=${thumbnailUrl} contentLen=${contentHtml.length}`);
        return { id: article.id, dryRun: true };
    }

    const res = await wpRequest(base, 'dx-columns', { method: 'POST', auth, body: payload });
    return { id: article.id, wpId: res.id, link: res.link, status: res.status };
}

async function main() {
    await loadDotenv();
    const { opts } = parseArgs(process.argv.slice(2));
    const status = opts.status || 'publish';
    const dryRun = !!opts['dry-run'];
    const from = parseInt(opts.from || '1', 10);
    const to = parseInt(opts.to || '100', 10);

    const total = checkDuplicateThumbnails();
    logInfo(`articles defined: ${total}, no duplicate thumbnails`);

    const base = requireEnv('WP_BASE');
    const auth = dryRun ? null : await buildAuthHeader();

    const targets = ARTICLES.filter(a => {
        const n = parseInt(a.id.replace('dx', ''), 10);
        return n >= from && n <= to;
    });
    logInfo(`will publish ${targets.length} articles (from=${from} to=${to}) status=${status} dry-run=${dryRun}`);

    const results = [];
    let succeeded = 0, failed = 0;
    for (const a of targets) {
        try {
            const r = await publishOne({ article: a, base, auth, status, dryRun });
            results.push({ ok: true, ...r });
            succeeded++;
            logInfo(`OK   ${a.id} -> wpId=${r.wpId || '-'} ${r.link || ''}`);
        } catch (e) {
            results.push({ ok: false, id: a.id, error: e.message });
            failed++;
            logErr(`FAIL ${a.id}: ${e.message}`);
        }
    }

    logInfo(`done: ${succeeded} succeeded, ${failed} failed`);
    process.stdout.write(JSON.stringify({ succeeded, failed, results }, null, 2) + '\n');
    if (failed > 0) process.exit(2);
}

main().catch(e => { logErr(e.stack || e.message); process.exit(99); });
