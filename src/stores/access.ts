import cookies from 'js-cookie';
import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import IClient from '@/interfaces/modules/access/client';
import IToken from '@/interfaces/modules/access/token';
import IUser from '@/interfaces/modules/user/user';
import { IResponseItem } from '@/interfaces/response';

export default defineStore('access', {
  state: () => ({
    user: null as IUser | null,
    secret: null as string | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    remember: null as boolean | null,
  }),
  getters: {
    role: (state) => state.user?.role.name,
    verified: (state) => state.user?.verification.status,
  },
  actions: {
    async getClient(
      login: string,
      password: string,
      remember: boolean,
    ): Promise<IResponseItem<IClient>> {
      try {
        const response = await axios.post<IResponseItem<IClient>>(
          '/api/client',
          {
            login,
            password,
            remember,
          },
        );

        const client = response.data.data;
        this.user = client.user;

        this.setCookies(client.secret, null, null, remember);

        return response.data;
      } catch (error) {
        this.user = null;

        throw error;
      }
    },
    async getToken(secret: string, remember: boolean): Promise<IResponseItem<IToken>> {
      const response = await axios.post<IResponseItem<IToken>>(
        '/api/token',
        {
          secret,
          remember,
        },
      );

      const token = response.data.data;
      this.setCookies(secret, token.accessToken, token.refreshToken, remember);

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
      this.setCookies(null, token.accessToken, token.refreshToken, remember);

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

        this.setCookies(token.secret, token.accessToken, token.refreshToken, remember);

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

      cookies.set('secret', '');
      cookies.set('accessToken', '');
      cookies.set('refreshToken', '');
      cookies.set('remember', '');

      return response.data;
    },
    setCookies(
      secret: string | null = null,
      accessToken: string | null = null,
      refreshToken: string | null = null,
      remember: boolean | null = null,
    ): void {
      const expires = 365 * 20;

      if (secret !== null) {
        cookies.set(
          'secret',
          secret,
          {
            expires,
          },
        );

        this.secret = secret;
      }

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
