import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';

export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard/Index.vue'),
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
] as Array<RouteRecordRaw>;
