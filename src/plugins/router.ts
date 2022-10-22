import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import routes from '@/routers/index';
import TMiddleware from '@/types/middleware';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from): Promise<boolean | string> => {
  const nextGo = async (): Promise<boolean | string> => true;

  if (!to.meta.middleware) {
    return nextGo();
  }

  const middleware: Array<TMiddleware> = typeof to.meta.middleware === 'function'
    ? [to.meta.middleware] as Array<TMiddleware>
    : to.meta.middleware as Array<TMiddleware>;

  for (let i = 0; i < middleware.length; i++) {
    const result = await middleware[i](to, from);

    if (result !== true) {
      return result;
    }
  }

  return nextGo();
});

export default router;
