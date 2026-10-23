# Player live UI fix and actual media verification

Source frozen. No adapter changes. Five files changed: player core effects/media-dispatch, player index.ts/index.less, player-event-handlers.test.ts. No commit by this task.

## Actual defect and ownership

Real live MediaStream duration is Infinity. formatDuration intentionally emits no finite duration, but loadeddata unconditionally wrote `/`, causing an orphan separator. Visual effects now own duration and separator together; both hidden and empty unless total is finite and positive. Elapsed time remains visible. Native 8-second MP4 still shows elapsed / 00:08. No invented total or Live label.

The media container had no background, so object-fit letterboxing exposed white host content beneath fixed white player controls. `.ran-player` now uses `--ran-player-background`, default #000, matching the existing fixed dark control-skin contract. This is deliberately stable across page themes; consumers can override the component token. Root should regenerate token documentation for the new variable.

Seek aria-valuetext uses elapsed time directly rather than percentage * Infinity (NaN) for live media.

## Red and green

`work/player-live-ui-red.log`: added finite/unknown duration regression fails original implementation (separator remains visible).
`work/player-live-ui-green.log`: 5 suites / 57 tests pass (events, controls, playback, contract).
`work/player-live-ui-types.log`: ranui TypeScript check exit 0.
Changed files formatted.

## Actual screenshots and continuous recording

Before retained at `outputs/ran-all-components/player-webrtc-accepted/` and `player-final/`.
After `outputs/ran-all-components/player-webrtc-ui-final/`:

- currentTime 0 -> 1.326 seconds, decodedFrames 36, readyState 4, both peers connected;
- divider and duration hidden and empty, background computed rgb(0, 0, 0);
- DELETE and srcObject release preserved.

After `outputs/ran-all-components/player-native-ui-final/`:

- currentTime 1.264993 seconds, decodedFrames 35, readyState 4;
- finite duration 8, divider visible `/`, label `00:08`, black letterbox.

Both screenshot and decoded continuous-recording contact sheet inspected: no empty slash in live playback; MP4 remains correctly paired; controls retain contrast on the dark media canvas. Observations include runtime resource SHA hashes, recordings and their hashes. Harnesses assert actual playback and UI, not replaced screenshots. All prior failures retained.

Limits: WHEP remains a real same-machine RTP fixture with documented VPN host-candidate-to-loopback SDP normalization; public WHEP/TURN/NAT compatibility remains outside this acceptance. These changes do not redesign seekability or adaptive streaming controls.

## Semantic-token follow-up

Design gate correctly rejected the literal component fallback. Added exactly one foundation semantic token, `--ran-media-background: #000`, intentionally stable in both page themes. Player derives its component background override from that token. No ratchet/baseline or dark palette change. `work/player-media-token-design.log`: all 9 design rules pass with 302 existing known findings and no additions.

Fresh actual captures on these source bytes supersede the earlier UI-final proof:

- `outputs/ran-all-components/player-webrtc-semantic-final`: 1.362s, 35 decoded frames, hidden empty divider/duration, black canvas, normal teardown.
- `outputs/ran-all-components/player-native-semantic-final`: 1.265924s, 35 decoded frames, /00:08 retained, black canvas.
  Both scripts exited 0; source-inputs.json binds foundation/player files and original observations bind loaded resources and recordings. Continuous recording contact sheets span the complete recorded duration and were inspected. Previous artifacts preserved. Root owns regeneration of public style-token documentation.
