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

## Customer file links

The production domain is `https://sms-redirect-ten.vercel.app`.
`/lite`, `/ep`, `/epp`, and `/sv` open the corresponding PDF.
Append `/image` to open that pack's PNG. These public routes are for customers viewing a lineup; `/api/sms?pack=KEY&to=NUMBER` opens the sender's Messages draft.

The fixed file destinations are defined in `vercel.json` as temporary redirects so they can be updated without permanent browser caches. Drafts use the same customer routes.

## Deploy

In [Vercel New Project](https://vercel.com/new), import `valentinoatspectrum/sms-redirect` and deploy the repository root. This function requires no environment variables or external SMS service.

Use the new project's production domain for `/api/sms` links. The original repository's domain does not deploy this fork automatically.

## Safety

Recipients are validated and lineup destinations are fixed in `vercel.json`. No arbitrary redirect URL or message body can be supplied. Responses use `Cache-Control: no-store` and `Referrer-Policy: no-referrer`.
