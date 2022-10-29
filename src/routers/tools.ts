import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';
import tool from '@/store/tool';
import TId from '@/types/id';

export default [
  {
    path: '/dashboard/tools',
    name: 'Tools',
    component: () => import('@/pages/dashboard/tools/Index.vue'),
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
    path: '/dashboard/tools/create',
    name: 'ToolCreate',
    component: () => import('@/pages/dashboard/tools/Create.vue'),
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
    path: '/dashboard/tools/:id',
    name: 'ToolUpdate',
    component: () => import('@/pages/dashboard/tools/Update.vue'),
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
      const { get } = tool();

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
