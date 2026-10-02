# sms-redirect

Opens the visitor's Messages app with a prepared SMS draft. The visitor reviews the draft and taps Send; this function does not send messages.

## Customer thank-you draft

`GET /api/sms` preserves the original customer thank-you message.
Add `?to=6232160454` to prefill a US recipient.

## Channel lineup drafts

`GET /api/sms?pack=epp&to=6232160454`

| pack | Lineup |
| --- | --- |
| lite | TV Lite |
| ep | Entertainment Pack |
| epp | Entertainment Pack + |
| sv | Sports View |

Each lineup has its own fixed PDF and image links. Pack keys match exactly: `epp` cannot fall back to `ep` or `lite`.
Lineup requests require one valid US recipient. Formatted numbers and a leading US country code are supported; encode query parameters when building URLs.

The page immediately attempts to open the SMS composer, with iOS-specific SMS syntax and a fallback button if the browser blocks automatic opening.

## Deploy

In [Vercel New Project](https://vercel.com/new), import `valentinoatspectrum/sms-redirect` and deploy the repository root. This function requires no environment variables or external SMS service.

Use the new project's production domain for `/api/sms` links. The original repository's domain does not deploy this fork automatically.

## Safety

Recipients are validated and lineup URLs are fixed in the function. No arbitrary redirect URL or message body can be supplied. Responses use `Cache-Control: no-store` and `Referrer-Policy: no-referrer`.
