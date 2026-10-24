# Fixture transition diagnosis

The frozen Linux image `19c9e05cf1de` completed 1009 of 1020 three-engine cases; eleven failed.
The diagnostic rerun preserves the original component implementations and expectations.
It recorded a voice button at (0,0) before clicking, then (24,24) afterward, with actual
pointer events targeting BODY. The theme token was dark while the body computed color was
still light. Layer overrides settled on the following frame.

The shared light-DOM fixture applied `transition-duration: 0.001ms` to every element.
Together with CSS's initial `transition-property: all`, that creates transitions even on
otherwise static geometry, palette and stacking layers. Use exactly `0s` to freeze them.
Shadow-root interaction and normal-motion component animations remain enabled as before.

A new regression changes geometry, color and layer together and requires the immediate
values to equal the painted values. Against the old helper it fails in Firefox and WebKit
(Chromium passes). With only the helper repair, 110 of 111 original affected cases passed.
WebKit's Home-during-exit scenario remains under investigation; this is not full acceptance.
No existing behavioral expectation, screenshot tolerance or retry budget was relaxed.

The remaining normal-motion test now creates its browser context with that preference,
rather than switching emulation after sheets are adopted. The diagnostic showed WebKit
reporting `matchMedia(reduce) === false` while computed animation remained `none` with
`0.00001s` duration. The during-exit assertion is unchanged. This establishes a stable
initial test condition; it does not claim a fix for dynamic operating-system preferences.

Subsequent independent checks found real Modal/Popover focus defects; those were fixed in
production source and have separate regression/recording evidence in the overlay directory.
The final full three-engine result is maintained in the complete-component review ledger.
