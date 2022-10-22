import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';
import log from '@/store/log';
import TId from '@/types/id';

export default [
  {
    path: '/dashboard/logs',
    name: 'Logs',
    component: () => import('@/pages/dashboard/logs/Index.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN],
      redirect: '/',
    },
  },
  {
    path: '/dashboard/logs/:id',
    name: 'LogShow',
    component: () => import('@/pages/dashboard/logs/Show.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN],
      redirect: '/',
    },
    beforeEnter: async (to, from, next) => {
      const { get } = log();

      try {
        await get(to.params.id as TId);
        next();
      } catch (error: Error | any) {
        // eslint-disable-next-line no-param-reassign
        to.meta.layout = 'center-layout';
        next();
      }
    },
  },
] as Array<RouteRecordRaw>;
