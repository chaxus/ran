# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2026-10-18

### Fixed

- Stop shipping debug logs to the console on ordinary code paths (`console.log` removed; `getUserMedia` failure kept as `console.error`).

### Changed

- Share compiler options through `tsconfig.base.json` instead of repeating them in six packages.

### CI & Infrastructure

- Check Markdown links on every pull request (`verify:links` moved from release-only to lint job).
- Cancel superseded runs on the same ref (`concurrency` added to `ci.yml`, `e2e.yml`, `semantic-pull-request.yml`).
- Bound the lint job's runtime (`timeout-minutes: 20`).
- Collect coverage in the test run that already executes the suite (`RANUI_COVERAGE=1` collapses the duplicate `vitest run` pass).
- Clone shallow in E2E where nothing reads git history (saves ~690 MB per browser job).
- Serialize gh-pages publishes (prevents race conditions between consecutive merges).
- Ignore local debris without tracked content in `verify-packages` (`debug`, `ranite`, `visual` no longer fail the check).
