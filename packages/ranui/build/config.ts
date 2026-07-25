export const TIME_OUT = 1000;

/**
 * Dev-server port, shared by `vite.config.ts` and `playwright.config.ts`.
 *
 * Deliberately **not** Vite's default 5173. Playwright's `reuseExistingServer` treats
 * anything already answering on this port as our dev server, so on 5173 any other Vite
 * project left running silently hijacks the whole e2e suite — every test then asserts
 * against a stranger's app and fails with a mismatched page title, which reads like 200
 * broken tests rather than a port clash. Keep this off any framework's default.
 */
export const PORT = 5273;

export const DEV_SERVER = `http://localhost:${PORT}/`;
