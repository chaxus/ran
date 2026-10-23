# Math and Mermaid component review

Actual registered source fixtures with compact, visible action rows. Static captures cover wide
and narrow views, light/dark, normal/reduced motion and long copy failure text. The independent
Linux continuous recordings cover local failure, retry, overlapping copy/source changes and
stable focus. Loaded response hashes, fixture identity, component inputs and media digests are
retained. Original absolute video paths identify the capture location; files are distributed here.

The first approximately 1–1.5 seconds show demo/fixture loading; the task begins at “Equations and
diagrams”. The videos are not evidence of a shipped product's loading experience. A previous macOS
reduced-motion recording had intermittent missing paint, was rejected and retained outside this
accepted set. Twelve diagnostic screenshots had stable geometry; quiet pinned Linux recordings
were then inspected and fully decoded without that anomaly. Its precise host cause is unproven.

The menu directory separately records the long-copy-error plus download combination: four tests
failed before the fix. Menus now anchor beneath the actual expanded toolbar; the action and error
remain unobstructed and keyboard traversal reaches the menu. The continuous videos do not show
export-menu activation, so this particular result is based on real-browser geometry, keyboard and
before/after stills, not a menu motion claim.

Verification: 52 Math/Mermaid unit cases; 54 Chromium/Firefox/WebKit renderer cases in a quiet
final run without retries. A preceding concurrent run failed while polling the transient 1.2-second success
icon in one WebKit case (53/54); the timing cause has not been proven, and the unchanged full suite passed once isolated. This intermittent
result is retained, not relabeled a clean first run. The wider library passed 1691 unit and 76 SSR
cases. None of these constitute human, physical-device or Document application acceptance.
