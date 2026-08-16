// 応募フォームの送信先。
//
// このサイトは GitHub Pages の静的配信なので、フォームを受け取るサーバがない。
// 外部のフォーム受信サービスの送信先URLを、ここに1つだけ書く。
//
// 空のあいだ、応募フォームは表示されない（assets/app.js が hidden を外さない）。
// 送信できないフォームを出すくらいなら、メール案内だけ出すほうがましなため。
//
// 設定できるもの（どれか1つ）:
//   - Formspree      https://formspree.io/f/xxxxxxxx
//   - FormSubmit     https://formsubmit.co/ajax/xxxxxxxxxxxxxxxx
//   - Google フォーム https://docs.google.com/forms/d/e/xxxx/formResponse
//                    （Google フォームの場合は FIELD_MAP も埋めること）
//
// 設定したら、実際に1件送って受信できることを必ず確かめる。
// 送ったつもりで届いていない、が一番まずい。
window.MONITOR_FORM_ENDPOINT = "";

// Google フォームを使う場合だけ必要。
// フォームの「事前入力したURLを取得」で得た URL に含まれる entry.xxxxxxx を、
// 入力欄の name と対応づける。他のサービスを使うなら空のままでよい。
window.MONITOR_FORM_FIELD_MAP = {
  // shop: "entry.1111111",
  // genre: "entry.2222222",
  // address: "entry.3333333",
  // phone: "entry.4444444",
  // name: "entry.5555555",
  // email: "entry.6666666",
  // current_service: "entry.7777777",
  // desired_date: "entry.8888888",
};
