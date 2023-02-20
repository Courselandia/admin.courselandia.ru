import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/modules/user/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';
import user from '@/stores/user';
import TId from '@/types/id';

export default [
  {
    path: '/dashboard/users',
    name: 'Users',
    component: () => import('@/pages/dashboard/users/Index.vue'),
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
    path: '/dashboard/users/create',
    name: 'UserCreate',
    component: () => import('@/pages/dashboard/users/Create.vue'),
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
    path: '/dashboard/users/:id',
    name: 'UserUpdate',
    component: () => import('@/pages/dashboard/users/Update.vue'),
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
      const { get } = user();

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
