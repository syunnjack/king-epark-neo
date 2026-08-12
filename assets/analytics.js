// Google Analytics 4 (gtag.js)
//
// Measurement ID for the GA4 property "king-epark-neo (http://junbannavi.com/)"
// (Admin > Data Streams > your web stream > Measurement ID, format "G-XXXXXXXXXX").
// If this is ever reset to the "G-XXXXXXXXXX" placeholder, this script does
// nothing -- no requests are sent, so placeholder data never pollutes real
// analytics.
const GA_MEASUREMENT_ID = "G-3Y70KDBYD9";

if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}
