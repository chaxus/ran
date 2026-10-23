# Independent review — remaining formal samples

Independent agent review of formal baseline/candidate 01-text, 03-label, 05-freshness and 06-code on 2026-10-22. This supplements independent-review-draft.md and preserves its first-phase findings. No products, worker expectations, formal captures or result records were edited. This review is not human acceptance.

Read TASK.md, REPORT.md, relevant implementation and recorded verification. Inspected actual review-resting.png full panes for all eight samples, plus the narrow, focus, destination, stress and code interaction captures named below. All eight final.png files match their final.capture.json media hashes; candidate/06-code's five interaction images and retained video match verification.json hashes. The video was not played or frame-reviewed; its existence/hash is provenance, not additional visual review. Existing worker test results below were read, not independently rerun. The delayed-copy race is the explicit fresh browser reproduction.

| Task         | Baseline independent result                                              | Candidate independent result                                                          |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 01-text      | Pass for inspected composition, with focus-quality limit                 | Pass for inspected composition, with focus-quality limit                              |
| 03-label     | Pass for the mobile clipping fix; destination wording limitation remains | Pass for inspected mobile detail and localized route context                          |
| 05-freshness | Pass for fresh evidence and inspected spacing                            | Pass for fresh evidence and inspected spacing                                         |
| 06-code      | Pass for inspected presentation and recorded developer-use checks        | Presentation passes; changes required for stale copy completion after streamed update |

## 01-text — both coherent, different composition choices

Inspected both full panes, baseline evidence/after-narrow.png and candidate evidence/final-320.png. Both fix the actual heading/description text drift, retain an identifiable Manage action and reflow body copy without overlap. Baseline aligns the row with the page-title spine and centers the action against its text group. Candidate preserves the row's 16px inset and top-aligns the action. These are coherent alternatives; a universal rule requiring title/row coincidence or vertical centering would exceed this task.

The candidate's compact row still reads as one text/action group at 320px; neither version adds decorative surfaces. The one lower hairline can mark the settings row's extent without introducing nested grouping. Do not treat its presence alone as a failure.

Both reports distinguish activation from a missing business handler and avoid human-acceptance claims. Automated focus reachability does not establish visible focus quality. Baseline explicitly states it did not claim that quality; candidate has no separate focus capture among its final viewport captures. This review therefore does not independently accept keyboard focus appearance for either sample.

## 03-label — full labels visible; inspect destination meaning separately

Inspected both mobile resting panes, baseline evidence/keyboard-focus.png and candidate evidence/project.png and detail-text-stress.png. Both show the complete German destination at 320px; baseline focus is visible, and candidate stress text wraps without clipping or ellipsis. Candidate's Project destination identifies itself as Projekteinstellungen and provides the localized next/ancestor actions; the shown route context agrees with the return label.

Baseline intentionally preserves English destination pages. Its surface/app.js maps “Zurück zu Projekteinstellungen” to #project with the heading “Project” and action “Open settings”. The clipping repair is successful and route usability is recorded, but the report should not imply the full journey is localized or that the destination identity is as consistent as candidate's. This is a residual naming limitation, not evidence that its full-label mechanical pass is false. The report discloses its scope. No new route or feature is required to document that limit.

## 05-freshness — both correctly supersede historical evidence

Inspected baseline prior.png, both current full panes and candidate narrow.png; read both prior-review.json/final-review.json pairs and fresh capture/verification records. The old image has a different lower gap; the actual current pane removes that extra space and keeps title, Activity copy and Manage legible. At narrow width, the description wraps naturally and remains separate from the action.

Both final-review records explicitly treat prior-review.json as historical/stale for the current runtime, preserve its original no-human-decision status and point to fresh final evidence. Prior and final PNG bytes match their own capture hashes. Both final images have SHA-256 d70f8294e788958ef51c788b7ff657baf82dfbbb0f085e2d7624f35736c6db59 while runtime hashes differ (baseline 72f4235…; candidate 507e417…). Identical output pixels are compatible with different implementation fingerprints; neither record reuses the old review to establish the new runtime. No freshness or authority correction is required in this inspected scope.

## 06-code — presentation and developer-use evidence

Inspected both resting panes; baseline evidence/long-line-end.png, mobile.png and copy-failure.png; candidate evidence/native-selection.png, keyboard-scroll.png, streamed.png, narrow-streamed.png and copy-failure.png. Both preserve readable monospace line structure, keep actions visible and contain the long line inside a code viewport. The baseline's one code enclosure and toolbar divider identify a distinct reading/scroll region and command region; they are defensible. Candidate's flat reading surface also works. No conclusion depends on counting borders.

Baseline verification.json records exact initial/source clipboard equality, two streamed appends, real drag selection, retained selected string/text-node identity/180px scroll, keyboard scrolling, a reachable long-line end and local clipboard rejection. Its still captures support the geometry/error observations. Candidate verification.json and verify.cjs record real clipboard write/read for initial and combined payload, controlled rejection/retry, delayed success, actual mouse drag, original text-node/selection/250px scroll preservation, keyboard scroll and narrow layout. The native-selection and stream screenshots visibly show those states; the sensitivity record rejects a browser-only wrapping regression. The select-all serialization's missing final newline is disclosed separately from raw-copy equality. These are concrete developer-use checks, not merely a screenshot or text-presence assertion. Most were not re-executed by this reviewer, and no claim is made to having viewed the retained video.

### Required correction: candidate copy completion becomes stale after an update

Fresh reproduction on the actual unmodified candidate/06-code Vite/ranui host, headless Chromium 151.0.7922.34, 760×640, light/en-US:

1. Begin Copy with a browser-only clipboard promise that captures the requested value but delays completion.
2. Click the still-enabled Receive update; the displayed source receives the exact new chunk and copy status is cleared.
3. Resolve the earlier copy promise. The UI now shows “Copied” beside the updated source even though that request captured only the prior payload.

Observed: clipboard request equals the prior source, differs from current source, and final status is “Copied”. This is stale success associated with newer content, not payload corruption. The worker's delayed-success check resolves without an intervening update, so its twelve passing checks do not cover this race. Baseline code already guards copy attempts against intervening stream updates; this candidate failure must remain visible in the comparison.

Fresh before/pending/after PNGs, requested/current strings, environment, local source hashes, media hashes and reproduction script are under remaining-review-evidence/. The compact result is copy-stream-race.json; reproduction is reproduce-copy-stream-race.cjs (takes the running host URL). Only browser memory was changed, no system clipboard write or source patch. The review server was stopped afterward.

Applicable existing pinned owner: INTERACTION §1 says “The latest intent remains authoritative”; §3 associates feedback with the object acted on; §4's Context changed row requires “Identify stale output; refresh against current data” and avoids applying an old result to a newer document silently. §6 explicitly includes late responses and scope identity. DESIGN's composed-surface checklist also requires control label/state/result to describe one consistent outcome. The guidance already has the general observable contract. It lacks a concrete delayed Copy + changing streamed source example; a scoped clarification can improve discoverability without introducing a new feature or retrospectively changing frozen thresholds. A future corrected/fresh run should be recorded separately from this original failure.

## Authority and scope

All eight reports distinguish agent review from human decision and do not fabricate user acceptance. Their passing automation remains scoped to the actual checks they ran. Candidate/06-code's agent-pass verdict requires qualification by the newly reproduced failure; the report was not dishonest about its listed tests, but those tests were incomplete for concurrent completion. No blanket human approval gate is implied. Review does not establish native-device gestures, other engines, dark themes, native zoom, screen-reader behavior or arbitrary-duration streams.
