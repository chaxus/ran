import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Koa from 'koa';
import serve from 'koa-static';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = new Koa();

const PORT = 5555;

const STATIC_DIR = 'dist';

// Serve static files from the 'dist' directory
app.use(serve(path.join(__dirname, STATIC_DIR)));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
