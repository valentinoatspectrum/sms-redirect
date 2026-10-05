const LINEUPS = Object.freeze({
  lite: { name: "TV Lite" },
  ep: { name: "Entertainment Pack" },
  epp: { name: "Entertainment Pack +" },
  sv: { name: "Sports View" },
  az: { name: "Arizona" }
});

function phoneNumber(raw) {
  if (typeof raw !== "string" || !/^[+0-9\s().-]+$/.test(raw)) return null;
  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 11 && digits[0] === "1") digits = digits.slice(1);
  return /^[2-9][0-9]{2}[2-9][0-9]{6}$/.test(digits) ? "+1" + digits : null;
}

export default function handler(req, res) {
  let message =
    "Hey its Valentino over at Spectrum! Just wanted to reach out and thank you for allowing me to help you today. For future references, if you need anything Spectrum related or have any questions about your services, reply to this message and I'll get back to you with an answer. Have a great day!";

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  const query = req.query || {};
  const key = query.pack;
  const hasPack = key !== undefined;
  const phone = query.to === undefined ? "" : phoneNumber(query.to);
  if (phone === null || (hasPack && (typeof key !== "string" || !Object.prototype.hasOwnProperty.call(LINEUPS, key) || !phone))) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Specify pack=lite, ep, epp, sv, or az and one valid US number in to.");
    return;
  }
  if (hasPack) {
    const pack = LINEUPS[key];
    const lineupUrl = `https://sms-redirect-ten.vercel.app/${key}`;
    message = key === "az"
      ? `Hi! Here is the Spectrum ${pack.name} channel lineup.\n\nPDF: ${lineupUrl}\n\nLet me know if you have any questions!`
      : `Hi! Here is the Spectrum ${pack.name} channel lineup.\n\nPDF: ${lineupUrl}\n\nImage: ${lineupUrl}/image\n\nLet me know if you have any questions!`;
  }
  const encodedBody = encodeURIComponent(message);
  const smsUrl = `sms:${phone}?body=${encodedBody}`;
  const iosUrl = `sms:${phone}&body=${encodedBody}`;

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.statusCode = 200;

  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Opening SMS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 32px 24px;
      max-width: 360px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    }
    h1 { font-size: 1.25rem; color: #111; margin-bottom: 8px; }
    p  { font-size: 0.95rem; color: #555; line-height: 1.5; margin-bottom: 24px; }
    a.btn {
      display: inline-block;
      background: #0070f3;
      color: #fff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
    }
    a.btn:active { opacity: 0.85; }
  </style>
  <script>
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const smsUrl = ios ? ${JSON.stringify(iosUrl)} : ${JSON.stringify(smsUrl)};
    window.location.href = smsUrl;
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector("a.btn").href = smsUrl;
    });
  </script>
</head>
<body>
  <div class="card">
    <h1>Open SMS Composer</h1>
    <p>Your SMS app should open automatically.<br>If it did not, tap the button below.</p>
    <a class="btn" href="${smsUrl}">Tap to Open SMS</a>
  </div>
</body>
</html>`);
}
