# Glass lifecycle implementation and bounded acceptance

Changed only `packages/ranui/components/glass/{index.ts,rim.ts,rim-webgpu.ts}` plus `test/unit/glass.lifecycle.test.ts`. No stylesheet, shader, public attribute/event API, generated docs, commits or Docker changes.

- `Glass._ensureRim` only allocates while connected. Removal destroys its renderer; reconnect allocates one fresh renderer.
- Renderer destroy is idempotent; queued resize/radius work is inert after cleanup. Its existing late-handle guard now runs because the component actually disposes the renderer.
- WebGPU setup owns device/context/buffer cleanup, including failed setup. Successful backend reports `device.lost`; active renderer disposes it and mounts a new WebGL backend, or CSS-only fallback if WebGL is unavailable. Deliberate destroy cannot trigger fallback resurrection.

## Evidence

`work/glass-lifecycle-red.log`: four regressions failed on original source (detached canvas allocated; delayed device not destroyed; setup failure device not destroyed; device loss left original canvas). Initial harness import was corrected before recording this red log, so failures are functional rather than registration errors.

`work/glass-lifecycle-green.log`: 25 passed, including five lifecycle regressions and 20 prior Glass contracts. Added queued-resize/intentional-loss-after-destroy coverage. `work/glass-lifecycle-types.log`: ranui TypeScript passed. SSR result in `work/glass-lifecycle-ssr.log`.

Real browser fixture: `work/glass-lifecycle-browser.ts`; output `outputs/ran-all-components/glass-lifecycle/`. Four screenshots, two continuous recordings, two decoded filmstrips, manifest with source/runtime-response/media hashes and observations. Chromium at 360 light and 1280 dark: actual WebGL context exists and is not lost, removal leaves zero canvases/no renderer, reconnect restores the surface, radius/width updates redraw; no page errors. Reviewed endpoint screenshots and 3fps recording sequence. Fixture uses the public `--ran-glass-padding` token (placing padding on the host would separate its focus outline from the glass surface).

## Limits

Both actual browser requests exposed `navigator.gpu` but returned no adapter. WebGPU shader pixels, WebGPU visual parity and real device-loss recovery are **unverified**. Mock protocol tests establish cleanup/fallback ownership only. WebGL runtime context loss/restoration is not implemented or certified by this change; normal removal and reconnect are verified. Fixture is a controlled component exercise, not a complete product visual acceptance or full browser matrix. No default visual redesign was attempted.
