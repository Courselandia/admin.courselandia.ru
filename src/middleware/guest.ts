import cookies from 'js-cookie';
import { RouteLocationNormalized } from 'vue-router';

import access from '@/stores/access';

export default async (to: RouteLocationNormalized): Promise<boolean | string> => {
  if (!cookies.get('accessToken')) {
    return true;
  }

  if (to?.meta?.redirect) {
    const store = access();
    store.accessToken = cookies.get('accessToken') || null;
    store.refreshToken = cookies.get('accessToken') || null;

    try {
      await store.getGate();

      return to.meta.redirect as string;
    } catch (error) {
      cookies.set('accessToken', '');
      cookies.set('refreshToken', '');

      return true;
    }
  }

  return false;
};
