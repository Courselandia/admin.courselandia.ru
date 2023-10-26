import cookies from 'js-cookie';
import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import IToken from '@/interfaces/modules/access/token';
import IUser from '@/interfaces/modules/user/user';
import { IResponseItem } from '@/interfaces/response';

export default defineStore('access', {
  state: () => ({
    user: null as IUser | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    remember: null as boolean | null,
    intervalTokenRefresh: null as number | null,
  }),
  getters: {
    role: (state) => state.user?.role.name,
    verified: (state) => state.user?.verification.status,
  },
  actions: {
    async getToken(
      login: string,
      password: string,
      remember: boolean,
    ): Promise<IResponseItem<IToken>> {
      const response = await axios.post<IResponseItem<IToken>>(
        '/api/token',
        {
          login,
          password,
          remember,
        },
      );

      const token = response.data.data;
      this.setCookies(token.accessToken, token.refreshToken, remember);

      return response.data;
    },
    async getRefreshToken(refreshToken: string, remember: boolean): Promise<IResponseItem<IToken>> {
      const response = await axios.post<IResponseItem<IToken>>(
        '/api/refresh',
        {
          refreshToken,
          remember,
        },
      );

      const token = response.data.data;
      this.setCookies(token.accessToken, token.refreshToken, remember);

      return response.data;
    },
    async getGate(): Promise<IResponseItem<IUser>> {
      try {
        const response = await axios.get<IResponseItem<IUser>>('/api/private/access/gate', {
          headers: {
            Authorization: this.accessToken || '',
          },
        });

        this.user = response.data.data;

        return response.data;
      } catch (error) {
        this.user = null;

        throw error;
      }
    },
    async signIn(
      login: string,
      password: string,
      remember: boolean,
    ): Promise<IResponseItem<IToken>> {
      try {
        const response = await axios.post<IResponseItem<IToken>>(
          '/api/private/site/access/sign-in',
          {
            login,
            password,
            remember,
          },
        );

        const token = response.data.data;
        this.user = token.user;

        this.setCookies(token.accessToken, token.refreshToken, remember);

        return response.data;
      } catch (error) {
        this.user = null;

        throw error;
      }
    },
    async logOut(): Promise<IResponseItem<null>> {
      const response = await axios.post<IResponseItem<null>>('/api/private/access/logout', null, {
        headers: {
          Authorization: this.accessToken || '',
        },
      });

      this.user = null;

      cookies.remove('accessToken');
      cookies.remove('refreshToken');
      cookies.remove('remember');

      if (this.intervalTokenRefresh) {
        window.clearInterval(this.intervalTokenRefresh);
        this.intervalTokenRefresh = null;
      }

      return response.data;
    },
    setCookies(
      accessToken: string | null = null,
      refreshToken: string | null = null,
      remember: boolean | null = null,
    ): void {
      const expires = remember ? 365 * 20 : 1 / 24;

      if (accessToken !== null) {
        cookies.set(
          'accessToken',
          accessToken,
          {
            expires,
          },
        );

        this.accessToken = accessToken;
      }

      if (refreshToken !== null) {
        cookies.set(
          'refreshToken',
          refreshToken,
          {
            expires,
          },
        );

        this.refreshToken = refreshToken;
      }

      if (remember !== null) {
        cookies.set(
          'remember',
          remember ? '1' : '0',
          {
            expires,
          },
        );

        this.remember = remember;
      }
    },
  },
});
