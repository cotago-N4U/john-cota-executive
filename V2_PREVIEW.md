# Executive site V2 — review preview

Branch: `v2-experience`. This is a local review version, not a production deployment. V1 remains recoverable from `main`.

## What changed

- A new opening: “Creative vision. Built to work.” The introduction uses first-person language and an original diagram connecting brand, creative and operations.
- Three visual exhibits replace five large text panels: the Community Resource Center partnership, creative operations, and the enterprise brand function.
- Each exhibit pairs an editorial visual with a concise narrative, role/context information, and a native expandable case description.
- “Follow the work” has Brand, People and Operations perspectives. Selecting a button changes the four stage explanations and an announced summary. Buttons retain focus and identify the selected perspective with `aria-pressed`.
- A quieter paper, forest-green and pale-lime palette, deliberate display typography and a responsive editorial grid.
- A vertical workflow on mobile, visible focus styles, keyboard-operated cases, an Escape-dismissable mobile menu, and reduced-motion behavior.
- Removed the unverified registered-mark symbol, the empty Lab section and the separate giant department-metric panel. OEP7 figures remain explicitly attributed department context inside the brand case.

## Visual and evidence boundaries

All graphics in this preview are original editorial illustrations or simplified reconstructions. The captions identify them as such. They are not represented as historical campaign executions or screenshots.

Copy is grounded in `EXECUTIVE_EVIDENCE_MAP.md`. Original source evidence and the evidence map were not altered. No savings claim, sole-designer attribution, individual ownership of the partnership investment, or completion of the marketing-platform roadmap was added.

## Assets that would make the next version stronger

1. Two or three publishable pages from the CRC joint brand guide: identity arrangement, application rules, and one finished application.
2. A redacted, readable Creative Services request form or workflow excerpt. The current reconstruction is useful on its own, but an authentic excerpt would provide stronger documentary proof.
3. Two or three existing enterprise brand applications or standards pages to sit alongside the organizational model.
4. An approved current résumé PDF, verified LinkedIn URL, and optional current portrait. There are no empty buttons or invented destinations in this preview.

These are curation needs from the existing archive, not a request to continue searching for new bodies of work.

## Local review

From this repository, run `python3 -m http.server 4173 --bind 127.0.0.1` and open `http://127.0.0.1:4173`.

Use `check-preview.cjs` with a locally installed Playwright package to run the acceptance checks. Set `PLAYWRIGHT_PATH` to the package path if needed, and optionally `CHROME_PATH` to a Chrome executable. The script checks desktop, tablet and mobile sizes, keyboard perspective changes, case expansion, mobile navigation, reduced motion and script errors. It writes ignored screenshots into `preview-checks/`.

External Google Fonts are retained from V1 with system fallbacks. No analytics, tracking, form backend, new service dependencies or production settings were introduced.
