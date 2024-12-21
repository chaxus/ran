import type { Context } from '@/app/types/index';

export default class UserController {
  async login(ctx: Context): Promise<void> {
    try {
      const { username, password } = ctx.request.body;
      console.log('login:', username, password);
    } catch (error) {
      console.log('login:', error);
      // ctx.errorHandler({ error });
    }
  }

  async list(ctx: Context): Promise<void> {
    try {
      const { limit, offset } = ctx.request.query;
      console.log('list:', limit, offset);
    } catch (error) {
      console.log('register:', error);
      // ctx.errorHandler({ error });
    }
  }
}
