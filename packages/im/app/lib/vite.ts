import { createServer } from 'vite';

const viteServer = async () => {
  return await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
};

export const ssr = await viteServer();