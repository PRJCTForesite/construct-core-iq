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

The three stale failures were marked fixed pending scanner verification.

## Site-wide consistency sweep

Rule: public pages must have logical heading levels and discoverable URLs; all enquiry buttons must retain the intended request type, and a form must confirm success only after acceptance.

| Place checked | Result |
| --- | --- |
| Home, operational preview, stakeholder showcase | Source read and rendered headings checked; follows the rule. |
| Home trade directory, result cards and expanded profile | Found H2 → H4 skip; changed card/profile headings to H3 and checked the expanded view. Sample records unchanged. |
| Features and its eight demo links | Headings follow the rule; added demo enquiry selection to all feature demo links and checked navigation. |
| Industries and Download | Source and rendered headings follow the rule. Download installation availability is outside these reported findings and was not changed. |
| About, founder section and roadmap | Source and rendered headings follow the rule. |
| Pricing software plans | Added H2 before shared H3 plan cards; rendered order now follows the rule. |
| Pricing professional services, consultation links and FAQ | Source read and alternate view exercised; follows the rule. Prices unchanged. |
| Desktop/mobile header, shared CTA band and footer | Desktop, CTA band and footer already preserve demo request selection; corrected mobile demo selection and closed the mobile menu for both enquiry buttons. Mobile demo navigation checked. |
| Contact beta, demo, sales and advisory entry modes | Source confirms validated selection of all four modes through the same handler. Actual beta test accepted; demo navigation checked. Sales/advisory dispatch inspected, not separately sent. |
| FormSubmit handler and shared validation | Read success, activation-required, rejected-response and unavailable-service branches; success depends on acceptance, failures retain the form. Final inbox placement and automated replies remain unverified. |
| All application/login route files | Read sitemap decisions and inherited exclusions; all excluded from public sitemap. Private workflows, permissions and settings unchanged. |
| Sitemap helper, sitemap handler and robots.txt | Source read and published responses checked; seven public URLs, no invented lastmod dates. No database function or background enquiry job exists in the inspected project. |

All seven public pages have distinct search metadata. Browser checks passed for their heading sequences, both pricing views and the open trade profile. Tests passed: 11 validation/sitemap tests and 29 pricing/showcase/directory tests (each using its existing runner).

The additional heading and enquiry-link corrections require publishing before appearing on the live website. No already-sent enquiry or settled app record was modified.