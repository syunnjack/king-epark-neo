// Google Analytics 4 (gtag.js)
//
// Replace the placeholder below with your real GA4 Measurement ID
// (Admin > Data Streams > your web stream > Measurement ID, format "G-XXXXXXXXXX")
// once you've created the property in Google Analytics. Until then, this
// script does nothing -- no requests are sent, so placeholder data never
// pollutes real analytics.
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

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
