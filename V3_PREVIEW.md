# V3 creative experience — local review

Branch: `v3-creative-experience`. This branch has not been deployed. `main` preserves the production-era V1 code and `v2-experience` preserves V2.

## Experience

The opening is a visual hub, not a long sequence of case studies. Three interactive editorial posters lead to distinct environments:

- `#work`: the collection, in warm paper with coral, cobalt and yellow posters.
- `#partnership`: “Common ground,” a pink and coral partnership environment.
- `#operations`: “Work in motion,” a cobalt and midnight creative-operations environment.
- `#brand`: “Built to hold,” a yellow and ink brand environment.
- `#practice`: “The same brief. Three ways in.” A dark interactive space with Brand, People and Operations lenses.
- `#about`: an expressive coral personal introduction and contact scene.

Visitors choose their own route. The persistent navigation, back-to-collection and next-story links make movement explicit. Ordinary scrolling remains native within each scene. On phones, the hub becomes a native horizontal collection with a visible next-card preview; keyboard focus also brings each case link into view.

## Interaction and accessibility

- Each scene has a direct hash URL, a meaningful title and one visible primary heading.
- Browser Back/Forward and deep-link reloads preserve the selected scene.
- Scene navigation moves focus to the new heading; hidden scenes leave the keyboard and accessibility tree.
- With JavaScript disabled, all scenes remain readable and hash links become normal in-page navigation.
- Three real buttons change the workflow perspective, update pressed states and announce a concise explanation.
- Reduced motion removes scene, hover and perspective animations. No wheel, touchmove or scroll events are intercepted.

## Content and assets

The existing evidence map remains unchanged. All case artwork is identified as original editorial illustration or explanatory reconstruction. It is not presented as historical campaign artwork. Partnership scope, John’s contribution, planned platform direction and department-level OEP7 results retain their distinctions.

The user-verified LinkedIn URL is included: https://www.linkedin.com/in/johncota-go/.

The supplied résumé source was inspected without alteration. No résumé file was copied into this branch and no download link was added. Review identified claims that need reconciliation before that document is used as the public download.

All three flagship cases now include publishable, claim-bounded visual evidence: excerpts from the joint Community Resource Center guide; the archived Graphic Design Workflow plus a clearly labeled reconstruction of its Podio request routing; and five excerpts from the L.A. Care Corporate Identity Manual and Marketing Style Guide. John’s independently curated photography is presented separately as creative perspective, not project documentation. The preview does not depend on locating additional historic projects.

## Verification

The automated local check covers all six scenes at 1440, 768, 390 and 320 pixels; horizontal overflow; keyboard case navigation; Back/Forward; deep-link reload; all three workflow lenses; reduced motion; the skip link; the verified LinkedIn target; and the no-JavaScript fallback. Desktop and phone captures were visually inspected, and tablet overflow plus two visual overlaps were corrected.

Run `python3 -m http.server 4173 --bind 127.0.0.1` from the repository and open `http://127.0.0.1:4173/#work`.

The checks are in `check-preview.cjs`. Set `PLAYWRIGHT_PATH` to an installed Playwright package if necessary. Screenshots are ignored output under `preview-checks/v3/`.
