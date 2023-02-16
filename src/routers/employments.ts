import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/modules/user/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';
import employment from '@/store/employment';
import TId from '@/types/id';

export default [
  {
    path: '/dashboard/employments',
    name: 'Employments',
    component: () => import('@/pages/dashboard/employments/Index.vue'),
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
    path: '/dashboard/employments/create',
    name: 'EmploymentCreate',
    component: () => import('@/pages/dashboard/employments/Create.vue'),
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
    path: '/dashboard/employments/:id',
    name: 'EmploymentUpdate',
    component: () => import('@/pages/dashboard/employments/Update.vue'),
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
      const { get } = employment();

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
