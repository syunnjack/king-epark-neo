# king-epark-neo

飲食店向け「順番待ち・ネット予約」システムを、**EPARK**（および導入店舗である**焼肉きんぐ**）の
公開情報をもとに研究し、SEO / AIO・LLMO / UGC の観点で改良を加えた**オリジナルブランドのデモ**です。

**実在の企業・店舗ではありません。** ブランド名「炭火焼肉 灯（あかり）」「ジュンバンナビ」はこのデモ用に作成した名称で、
EPARK株式会社・「焼肉きんぐ」運営企業とは一切関係ありません。詳細は `about-platform.html` の免責事項を参照してください。

## リサーチ結果（このプロジェクトの前提）

公開情報から把握した、EPARK・焼肉きんぐの実際の仕組み：

- EPARKは「**席の予約ではなく順番の予約**」という点が本質的な特徴。来店確定時間を決めず、
  「あと何組で案内できるか」を共有することで、無断キャンセルによる空席リスクを抑えつつ回転率を上げる設計になっている。
  （出典: [EPARK法人向けサイト](https://epark.mbtn.jp/landingpage/)、[飲食店ドットコム](https://www.inshokuten.com/useful_service/22)）
- 焼肉きんぐは公式サイト・アプリからの予約導線がEPARKの予約画面に接続される形で運用されており、
  順番待ち導入により受付人員を接客に再配置できたと報告されている。
  （出典: [飲食店ドットコム ジャーナル](https://www.inshokuten.com/foodist/article/6074/)、[EPARK公式](https://epark.jp/lp/101)）

この「順番待ち」というUXパターン自体は本プロジェクトでも踏襲しつつ、**ブランド・実装はすべて独自**に作成しています。

## 改良のポイント：SEO / AIO・LLMO / UGC

今回は特に **AIO/LLMO（AI検索・LLM引用対策）** を重視して設計しました。

| 観点 | 実装 |
|---|---|
| **SEO** | 全ページに`title`/`meta description`/`canonical`、`sitemap.xml`、Restaurant/Menu/FAQPage/Review/BreadcrumbListのJSON-LD構造化データ |
| **AIO/LLMO** | ①`llms.txt`をサイトルートに設置（llms.txt仕様v1.7.0準拠）②`robots.txt`でGPTBot/ClaudeBot/PerplexityBot/Google-Extended等の主要AIクローラーを明示許可 ③全ページを**静的HTML**で配信し、JavaScriptを実行しないAIクローラーでも本文が読める ④FAQを「AIチャットへの自然な質問」形式にし、回答を1〜3文の具体的事実で完結させる |
| **UGC** | 口コミを`Review`+`AggregateRating`で構造化データ化。**表示件数としてschema上の件数を必ず一致させている**（4件表示・schema上も4件。実際の件数と乖離した`aggregateRating`はGoogleのリッチリザルトガイドライン違反になり得るため） |

### なぜこの設計が「改良」なのか

多くの予約プラットフォームの店舗ページはJavaScriptで描画されるSPA構成になりがちで、AIクローラー（多くはJS非実行）が
店舗情報を正しく取得できないケースがあります。また、`llms.txt`やAIクローラー向けの`robots.txt`設定を行っている
飲食店サイトはまだ少数です。本プロジェクトはこの「まだ対応が薄い領域」を先取りする設計にしています。

## ファイル構成

```
king-epark-neo/
├── index.html          店舗トップページ（Restaurant/AggregateRating等）
├── reserve.html         順番待ち・予約フォーム
├── menu.html            メニュー（Menu/MenuItem）
├── faq.html             よくある質問（FAQPage）
├── reviews.html         口コミ・UGC投稿フォーム（Review/AggregateRating）
├── about-platform.html  「ジュンバンナビ」プラットフォーム紹介・免責事項
├── monitor.html         無料モニター店舗募集ページ（フェーズ1の営業資料）
├── monitor-terms.html   モニター利用規約（ドラフト）
├── llms.txt             LLM向けサイト要約
├── robots.txt           AIクローラー許可設定
├── sitemap.xml
├── assets/style.css
├── assets/app.js        待ち時間シミュレーション・フォーム処理（表示内容には影響しないJS拡張のみ）
└── data/reviews.json    口コミの元データ（HTML内にも静的に重複掲載）
```

## フェーズ1（実証・信頼構築）の実行チェックリスト

`monitor.html` が実際に知人の飲食店へ送れる営業資料になっています。実行手順：

1. **候補店舗を1〜3店舗リストアップ**（知人が営業している飲食店。業態は焼肉に限らず可）
2. `monitor.html` の内容を確認し、[monitor@junbannavi.com](mailto:monitor@junbannavi.com) を実際に受け取れるアドレスに変更する
   （ドメインメール転送を設定するか、自分の既存メールアドレスに置き換える）
3. 候補店舗に `https://junbannavi.com/monitor.html` のリンクを送る、または直接説明してモニター応募を打診する
4. 応募があったら `monitor.html` の「お申し込みに必要な情報」で店舗情報を収集
5. 収集した情報をもとに、現在の`index.html`〜`reviews.html`を複製・編集して店舗ごとのページを作成
   （店舗数が増えてきたら、設定ファイルからページを自動生成する仕組みを検討）
6. 月1回のフィードバックで、検索・AI経由の見え方（`sites-shien`との連携も検討）を報告

**注意**: `monitor-terms.html` は実運用前提のドラフトであり、弁護士によるレビューを受けたものではありません。
実際に個人情報を預かって運用する場合は、特定商取引法・個人情報保護法の観点で内容を見直してください。

## 動作確認方法

ビルド不要の静的サイトです。ローカルで確認する場合：

```bash
cd king-epark-neo
python -m http.server 8000
# http://localhost:8000/ を開く
```

構造化データの検証には [Rich Results Test](https://search.google.com/test/rich-results) または
[Schema Markup Validator](https://validator.schema.org/) に各HTMLファイルを貼り付けてください。

## 公開先

独自ドメイン **junbannavi.com** で公開します（GitHub Pages + CNAME）。
DNS側で以下のレコードをレジストラの管理画面に設定してください。

| 種別 | ホスト | 値 |
|---|---|---|
| A | @（junbannavi.com） | 185.199.108.153 |
| A | @（junbannavi.com） | 185.199.109.153 |
| A | @（junbannavi.com） | 185.199.110.153 |
| A | @（junbannavi.com） | 185.199.111.153 |
| CNAME | www | syunnjack.github.io |

DNS反映後、GitHub側でカスタムドメインとHTTPSが有効化されます（反映まで数時間かかる場合があります）。

実際の店舗として運用する場合は、住所・電話番号・メニュー・価格をすべて実データに差し替え、商標調査を行ってください。

## フェーズ2（直接課金の開始）の進捗

料金プラン（`pricing.html`）と特定商取引法に基づく表記のドラフト（`tokushoho.html`）を追加しました。
ただし、**実際にオンラインで課金を開始するには、このリポジトリの中身だけでは不十分**で、以下がリポジトリ外で必要です。

| 項目 | 状態 |
|---|---|
| 料金プランページ・プラン比較 | ✅ `pricing.html` に実装済み |
| 特定商取引法に基づく表記 | ⚠️ `tokushoho.html` はテンプレート。事業者名・住所等を実データで埋める必要あり |
| 決済手段（クレジットカード決済代行など） | ❌ 未実装。Stripe・Square等の決済代行サービスとの契約が必要 |
| 銀行口座・請求書発行 | ❌ 個人事業主または法人としての口座開設・会計処理が必要 |
| プラン変更・解約のセルフサービス化 | ❌ 現状は手動運用前提（顧客管理画面は未実装） |

**現実的な進め方**: フェーズ1のモニター店舗からのフィードバックを得てから、実際に有料化するかどうか・
いくらにするかを固めるのが安全です。`pricing.html`はあくまで「将来の価格イメージを見せる」ためのページとして先に用意し、
決済導入は事業として継続する判断ができてから着手することをおすすめします。

## 今後の拡張候補

- `sites-shien`と連携し、このサイトのインデックス状況・AI引用状況を継続モニタリング
- 実際にPerplexity/ChatGPT検索でこの店舗名・FAQ内容が引用されるかを定点観測
- レビュー投稿のサーバーサイド化（現状はブラウザのlocalStorageのみ）
- フェーズ2: 決済代行サービスの選定・契約、`tokushoho.html`の実データ化
