import os from 'node:os';

export const getIPAdress = (): string | undefined => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const iface: any = interfaces[name];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
};
