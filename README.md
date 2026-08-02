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

### 訪問営業用の資料（`marketing/`）

知人の飲食店に直接訪問して説明する際に使える資料一式です。

| ファイル | 内容 |
|---|---|
| `marketing/flyer.pdf` | A4 1枚のチラシ（印刷用）。QRコード付きで`monitor.html`に直接誘導 |
| `marketing/flyer.html` | チラシのHTML原本。文言修正はこちらを編集し、ヘッドレスChromeの`--print-to-pdf`で再出力 |
| `marketing/pitch-deck.pptx` | 訪問先で見せる10枚のPowerPoint資料（課題提起→サービス紹介→実際の画面→料金感→申込み） |
| `marketing/monitor-qr.png` / `.svg` | `monitor.html`へのQRコード（実際にデコードして正しいURLであることを確認済み） |

チラシ・スライドとも、店舗名・連絡先が変わった場合はまずここを修正してください。



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

## Search Console と GA4 の登録・連携

Googleアカウントでのログインが必要な作業のため、登録自体はご自身で行ってください。サイト側の受け入れ準備（トラッキングタグ設置）は完了しています。

### 1. Search Console にドメインプロパティを追加

1. [Search Console](https://search.google.com/search-console) を開き、「プロパティを追加」→「ドメイン」を選択し `junbannavi.com` と入力
2. 表示されるDNS TXTレコードを、DNSレコードを設定したのと同じレジストラの管理画面に追加（**推奨**: ドメインプロパティならサブドメイン込みで一括管理でき、サイトのHTML変更も不要）
3. 別法として、URLプレフィックスプロパティ＋HTMLタグ確認を使う場合は、`index.html`内のコメントアウトされた
   `<meta name="google-site-verification" content="REPLACE_WITH_YOUR_TOKEN" />` の値を実際のトークンに置き換え、コメントを解除してください
4. 確認が完了したら、`sitemap.xml`（`https://junbannavi.com/sitemap.xml`）をSearch Console上で送信してください

### 2. GA4プロパティを作成してMeasurement IDを取得

1. [Google Analytics](https://analytics.google.com/) で新規プロパティを作成（プロパティ名は「ジュンバンナビ」など）
2. 「データストリーム」→「ウェブ」でストリームを追加し、URLに `https://junbannavi.com` を設定
3. 発行された測定ID（`G-XXXXXXXXXX`形式）を控える

### 3. 測定IDをサイトに反映

`assets/analytics.js` 内の `GA_MEASUREMENT_ID` の値を、手順2で取得した測定IDに書き換えてコミットしてください。
このファイルはすべてのページから読み込まれているため、1箇所書き換えるだけで全ページに反映されます。
プレースホルダー（`G-XXXXXXXXXX`）のままではスクリプトは何も送信しないため、実際のデータが混ざる心配はありません。

### 4. `sites-shien` と連携する

`sites-shien`リポジトリの`config/sites.json`に、`junbannavi`のエントリをすでに追加済みです。
以下を実データに置き換えてください。

- `ga4_property_id`: 手順2のGA4プロパティID（`properties/`に続く数字。Analytics管理画面の「プロパティ設定」に表示されます。**測定IDとは別の値**です）
- 既存の`GCP_SA_KEY`サービスアカウントに、`junbannavi`のGA4プロパティへの閲覧者権限を追加（`index-on-off`/`sites-shien`のREADMEと同じ手順）

反映後、`sites-shien`のActionsを手動実行すると、`junbannavi.com`の実データでダッシュボードが更新されます。
ただし、Search Console・GA4とも**登録直後はデータが空、または数日分反映されるまでタイムラグがあります**。
インデックス状況の反映には特に時間がかかるため、実データに基づく改善提案は登録から1〜2週間後を目安にしてください。

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

## フェーズ3（収益源の多角化）の進捗

フェーズ3の施策のうち、**実際のプラットフォーム利用者数に依存せず、今すぐ単体で販売開始できるもの**を
`services.html` として実装しました。

| フェーズ3の施策 | 状態 |
|---|---|
| AIO/LLMOコンサル単体販売 | ✅ `services.html` に実装（¥49,800・診断+実装込み）。プラットフォーム未導入の店舗にも販売可能 |
| `sites-shien`連携の月次AI検索レポート販売 | ✅ `services.html` に実装（月額¥9,800〜）。`sites-shien`の仕組みをレポート提供に利用する想定 |
| 送客手数料モデル | ❌ 未実装。実際の予約・送客の取引量が発生してから設計するのが安全（今は分母となる利用者がいない） |
| 口コミ・UGCデータのトレンドレポート販売 | ❌ 未実装。複数店舗分のレビューデータが蓄積してから着手（現状は`akari-shibuya`1店舗のみ） |

**この2つを先に実装した理由**: どちらも「導入店舗数」に依存せず、知人以外の見込み客（`services.html`経由の問い合わせ）
にもアプローチできるため、フェーズ1のモニター営業と並行して動かせる収益源だからです。

## 今後の拡張候補

- `sites-shien`と連携し、このサイトのインデックス状況・AI引用状況を継続モニタリング
- 実際にPerplexity/ChatGPT検索でこの店舗名・FAQ内容が引用されるかを定点観測
- レビュー投稿のサーバーサイド化（現状はブラウザのlocalStorageのみ）
- フェーズ2: 決済代行サービスの選定・契約、`tokushoho.html`の実データ化
- フェーズ3: 送客手数料モデルの設計、複数店舗分のUGCデータが貯まった段階でのトレンドレポート販売
