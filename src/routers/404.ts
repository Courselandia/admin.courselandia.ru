import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('@/pages/404.vue'),
    meta: {
      layout: 'center-layout',
    },
  },
] as Array<RouteRecordRaw>;
