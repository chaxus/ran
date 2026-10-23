# Reading and AI component verification

Actual registered components, Chromium 151 on the pinned Linux arm64 image
`sha256:e4030c918462f4e57140a783d6e392c4deb5ccdc371dc800df7265a90e8caf8f`.
The manifest binds 18 component source files, loaded resources, fixture and media hashes.
The source tree contains the reading implementations being verified; subsequent unrelated
demo, player and dropdown work is not certified by these captures.

Dark 360px checks ran with normal and reduced motion. Separate static and continuous-video
runs preserve actual transitions without screenshot-induced pauses. The two recordings and
sampled filmstrips were inspected; narrow copy feedback, horizontal table/code scrolling,
focus and retained reading position remain visible. Initial blank fixture setup is not a
production startup measurement.

Verified behaviors: original code copied after a simulated denial/retry; streamed content
preserves existing nodes and scroll; a paused conversation does not follow appended content
until the explicit jump; attachment removal moves keyboard focus and survives reconnect;
pending voice input cancels with Escape. Reasoning, disclosure, tool errors, state indicators
and token usage were inspected in the same narrow composition. Existing focused browser
regressions additionally cover selection, table growth and late highlighting.

Clipboard failure and speech recognition transport are deterministic fixtures. This does
not certify microphone permission, speech service availability, a model's response quality,
screen-reader announcements or the Document application. Host captures that showed missing
paint were rejected; they are not included in this accepted Linux set.
