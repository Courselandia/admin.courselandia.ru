import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';
import skill from '@/store/skill';
import TId from '@/types/id';

export default [
  {
    path: '/dashboard/skills',
    name: 'Skills',
    component: () => import('@/pages/dashboard/skills/Index.vue'),
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
    path: '/dashboard/skills/create',
    name: 'SkillCreate',
    component: () => import('@/pages/dashboard/skills/Create.vue'),
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
    path: '/dashboard/skills/:id',
    name: 'SkillUpdate',
    component: () => import('@/pages/dashboard/skills/Update.vue'),
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
      const { get } = skill();

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
