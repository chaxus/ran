# Editor Escape ownership follow-up

The previous document capture listener closed the modal before a focused editor could consume Escape. The regression reproduces that failure, then keeps the draft and focus on the first Escape and closes the modal on the next unconsumed Escape.

Modal keyboard handling now runs on its host during bubbling, before an ancestor popup, with document bubbling for body-portaled children. Eighteen focused Chromium checks passed. Cross-engine verification is tracked separately; these recordings alone do not establish Firefox or WebKit acceptance.

The ten screenshots and two continuous recordings cover 360px dark/reduced motion and 1000px light/normal motion, including editing, Select, Popover and close recovery. Source and recorder fingerprints are recorded in manifest.json.
