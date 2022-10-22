import { RouteLocationNormalized } from 'vue-router';

type TMiddleware = (
  toRoute: RouteLocationNormalized,
  fromRoute: RouteLocationNormalized
) => Promise<boolean | string>;

export default TMiddleware;
