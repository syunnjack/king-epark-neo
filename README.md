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
├── llms.txt             LLM向けサイト要約
├── robots.txt           AIクローラー許可設定
├── sitemap.xml
├── assets/style.css
├── assets/app.js        待ち時間シミュレーション・フォーム処理（表示内容には影響しないJS拡張のみ）
└── data/reviews.json    口コミの元データ（HTML内にも静的に重複掲載）
```

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

## 今後の拡張候補

- `sites-shien`と連携し、このサイトのインデックス状況・AI引用状況を継続モニタリング
- 実際にPerplexity/ChatGPT検索でこの店舗名・FAQ内容が引用されるかを定点観測
- レビュー投稿のサーバーサイド化（現状はブラウザのlocalStorageのみ）
