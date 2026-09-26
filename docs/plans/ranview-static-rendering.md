# Ranview static rendering

Scope: preserve the fluent node-building API, make SSR bindings one-shot and untracked, and add a signal-free static entry for Node and browser DOM construction. Keep the existing mock tree and serialization contracts; direct HTML streaming is deferred until measurements justify a separate API.

1. Add failing SSR snapshot/non-subscription tests and static browser/server contract tests.
2. Extract shared node operations behind a per-builder binding/children strategy; avoid global mutable rendering switches.
3. Add static factories and one-shot control flow, package exports, and build entries.
4. Document semantics and benchmark plain values, getters, branches and lists with output equivalence checks.
5. Run ranview tests, types and build, inspect static bundle dependencies, and run benchmarks.

Existing docs CSS fix is outside this change and remains untouched.
