# Foresite SEO review

3 findings were recorded as failing. All scanner results were stale; current checks confirm the reported issues are already addressed.

| Finding | Level | State |
| --- | --- | --- |
| Some pages skip heading levels | mid | failing |
| Connect contact enquiries before driving more traffic | low | failing |
| Add a sitemap | low | failing |
| Search titles and descriptions are relevant | low | passing |
| Shared-link previews describe the pages | low | passing |
| Structured data is appropriate | low | passing |
| Home page is reachable | low | passing |
| AI assistants can see your site as markdown | low | passing |
| Search engines see your fully-rendered pages | low | passing |
| Crawler rules look good | low | passing |
| Page basics are set | low | passing |

## Verification

- Industries and Download both render H1 → H2 → H3 sequences in the current preview and published HTML; no heading change is needed.
- The contact handler submits validated applications to FormSubmit at the confirmed recipient, shows success only after provider acceptance and retains inputs on failure. A labelled internal test through the website returned the Thank You confirmation. This verifies provider acceptance, not final inbox placement or automatic applicant replies.
- The published `/sitemap.xml` returns HTTP 200 with seven public pages on https://foresiteos.com.au, excludes application and login pages, and omits generated lastmod dates. The published `/robots.txt` references this sitemap.
- Application validation and sitemap tests: 11 passed.

The three stale failures can be marked fixed pending scanner verification. No website code or publishing changes are required for these findings.