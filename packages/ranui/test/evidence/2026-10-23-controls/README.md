# Select and Colorpicker disabled-state review

Actual source-registered components, Chromium 151 on macOS,1280/light/normal motion and
360/dark/reduced motion. Fixture isolates component state transitions; it is not Document
acceptance, a physical-device test or a human decision. Demo boot is present at the start.

The ten PNGs and two continuous WEBM recordings cover keyboard opening, disabled retention,
re-enabling, drag cancellation and disabling the nested format choice. Source hashes were
checked before/after capture, including dropdown-item styling omitted from an earlier rejected
provenance manifest. The final fixture records no disabled user-change event.

The relevant eight functional spec files passed153 cases in pinned Linux Chromium, Firefox and
WebKit with zero retries. That suite checks behavior and ignores screenshot comparisons. It does
not replace canonical visual approval or the later whole-library proportion review.

Independent source/media review found no blocker for these bounded fixes; its shadow-root focus
concern was tested in real Chromium and withdrawn. Existing Select keyboard/IME cases remain.
