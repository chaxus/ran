/**
 * This site's post-build checks: the engine's generic ones, pointed at this output.
 */
import { verifyOrExit } from 'ssg';
import { ORIGIN } from './config.ts';
import { DIST_DIR } from './build.ts';

verifyOrExit({ distDir: DIST_DIR, origin: ORIGIN });
