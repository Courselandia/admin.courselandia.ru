import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/modules/user/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';
import term from '@/stores/term';
import TId from '@/types/id';

export default [
  {
    path: '/dashboard/terms',
    name: 'Terms',
    component: () => import('@/pages/dashboard/terms/Index.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN, ERole.MANAGER],
      redirect: '/',
    },
  },
  {
    path: '/dashboard/terms/create',
    name: 'TermCreate',
    component: () => import('@/pages/dashboard/terms/Create.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN, ERole.MANAGER],
      redirect: '/',
    },
  },
  {
    path: '/dashboard/terms/:id',
    name: 'TermUpdate',
    component: () => import('@/pages/dashboard/terms/Update.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN, ERole.MANAGER],
      redirect: '/',
    },
    beforeEnter: async (to, from, next) => {
      const { get } = term();

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
