# ranui Testing Plan

## Objective

Build a modern, fast, and reliable testing system for `ranui` with layered coverage:

1. Unit tests (Vitest) for component contracts and utilities.
2. Browser integration tests (Playwright) for real rendering, style, and interaction.
3. Optional visual and accessibility checks on critical components.

## Target Architecture

1. `Vitest` is the default runner for unit tests (using `jsdom`).
2. `Playwright` remains for integration and smoke checks.
3. Components expose small testable helpers when DOM orchestration is complex.
4. Test layers are explicit and isolated by directory and scripts.
5. Use `vi.stubGlobal` or specialized mocks for browser APIs not supported by JSDOM (e.g., `ResizeObserver`).

## Test Layers and Scope

1. Unit (`test/**/*.test.ts`)

- Attribute/property reflection
- Event payload and dispatch timing
- Utility helpers and state transitions
- Edge cases and guard clauses

2. Integration (`tests/**/*.spec.ts`)

- Real browser interaction chains
- Shadow DOM visual behavior
- Overlay stacking and positioning

3. Optional non-blocking extensions

- a11y checks for core components
- visual snapshots for high-risk UI changes

## Web Component Testing Guidelines

1. **Shadow DOM Mode Awareness**: Most ranui components use `attachShadow({ mode: 'closed' })`, so unit tests should primarily validate public contracts (props/attributes/events/observable DOM effects) instead of internal node queries.

2. **Open Shadow Components Only**: Use `element.shadowRoot` assertions only when a component intentionally exposes open shadow mode.
   ```typescript
   const button = document.createElement('r-button');
   document.body.appendChild(button);
   // For closed shadow components, avoid internal DOM assertions.
   expect(button.getAttribute('role')).toBeNull();
   ```
3. **Registry Management**: To avoid `customElements` re-definition errors during tests, ensure tests are isolated or use dynamic tag names if necessary.

4. **Async Rendering**: Use `await Promise.resolve()` or `requestAnimationFrame` if the component renders asynchronously after property updates.

## Coverage Targets & Calculation

To ensure quality without slowing down development, coverage should be tracked using **Vitest Coverage (v8 provider)**.

Current status:

1. `test:unit` is implemented and running.
2. Coverage command and CI gate are planned for next step.

### Target Objectives

- **Core Logic & Utilities**: `> 90%` (Branch & Statement)
- **UI Rendering & Style Classes**: `> 80%`
- **Private Helper Methods**: Implicitly covered by public API tests.

### Coverage Dimensions

Beyond percentage metrics, robust component tests must achieve "Logical Coverage" across these dimensions:

1. **Property-Attribute Reflection**: Changing a property (e.g., `disabled=true`) correctly updates the DOM attribute and internal state.
2. **Slot Content**: The component renders gracefully with default slots, named slots, and empty slot permutations.
3. **Event Dispatching**: User interactions trigger correct `CustomEvent` dispatches with expected `detail` payloads.
4. **Lifecycle Safety**: Global listeners (e.g., `window.resize`, `document.click`) are properly cleaned up in `disconnectedCallback` to prevent memory leaks.

## Phase Plan

### Phase 1: Foundation (completed)

1. Add Vitest config and scripts.
2. Keep existing Playwright flow unchanged.
3. Refactor `message` container logic into testable helpers.
4. Add first unit tests covering `top`, `zIndex`, and `getContainer`.

Acceptance:

1. `npm run test:unit` passes.
2. Existing Playwright scripts still run.
3. New unit tests verify container reuse and style updates.

### Phase 2: Coverage Expansion (in progress)

1. Add unit tests for `button`, `icon`, `select`, `modal` core contracts.
2. Add reusable test utilities for Web Components setup/cleanup.
3. Keep Playwright cases focused on end-to-end behavior only.

Progress:

1. `message` contract helper and unit tests completed.
2. `button` contract tests completed.
3. `icon` contract tests completed.
4. `select` and `modal` contract tests pending.

Acceptance:

1. Critical components have at least one contract test file.
2. Redundant browser-level logic tests are removed or reduced.

### Phase 3: Quality Gates (pending)

1. Add CI matrix with `test:unit` and `test:e2e` jobs.
2. Add optional a11y and visual checks for stable components.
3. Enforce minimal test requirements for changed components (e.g., >80% coverage for new logic).

Acceptance:

1. PR checks fail on unit regressions.
2. Browser smoke remains stable with low flake rate.

## Directory Convention

1. Unit tests: `packages/ranui/test/**`
2. Browser tests: `packages/ranui/tests/**`
3. Test helpers: `packages/ranui/test/helpers/**`

## Script Convention

1. `test:unit`: run Vitest once.
2. `test:unit:watch`: watch mode for local development.
3. `test:e2e`: run Playwright tests.
4. `test:unit:coverage`: generate coverage report with thresholds (planned).
5. `test`: keep current behavior until CI migration is completed.

## Risk and Mitigation

1. Risk: duplicate coverage between unit and browser tests.

- Mitigation: mark each test file with layer intent and keep integration tests concise.

2. Risk: helper extraction changes runtime behavior.

- Mitigation: preserve existing public API and validate with both unit and browser tests.

3. Risk: flaky async tests for message lifecycle.

- Mitigation: unit test stable helper contracts first; keep timing-sensitive checks in Playwright only.
