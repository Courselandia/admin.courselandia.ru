import cookies from 'js-cookie';
import { RouteLocationNormalized } from 'vue-router';

import ERole from '@/enums/modules/user/role';
import access from '@/stores/access';

export default async (to: RouteLocationNormalized): Promise<boolean | string> => {
  const store = access();

  const secret = cookies.get('secret');
  store.secret = secret !== undefined ? secret : null;

  const accessToken = cookies.get('accessToken');
  store.accessToken = accessToken !== undefined ? accessToken : null;

  const refreshToken = cookies.get('refreshToken');
  store.refreshToken = refreshToken !== undefined ? refreshToken : null;

  const remember = cookies.get('remember');
  store.remember = remember !== undefined ? Boolean(remember) : null;

  const roles: Array<ERole> = to?.meta?.roles as Array<ERole>;

  try {
    const gate = await store.getGate();

    if (gate) {
      if (roles) {
        if (roles.indexOf(gate.data.role.name) !== -1) {
          return true;
        }

        if (to?.meta?.redirect) {
          return to.meta.redirect as string;
        }

        return false;
      }

      return true;
    }

    if (to?.meta?.redirect) {
      return to.meta.redirect as string;
    }

    return false;
  } catch (error) {
    try {
      cookies.set('accessToken', '');
      await store.logOut();
    } catch (err) {
      console.warn('Logout');
    }

    if (to?.meta?.redirect) {
      return to.meta.redirect as string;
    }

    return false;
  }
};
