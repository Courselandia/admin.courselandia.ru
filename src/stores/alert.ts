import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import IAlert from '@/interfaces/modules/alert/alert';
import IAlertForm from '@/interfaces/modules/alert/alertForm';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('alert', {
  state: () => ({
    items: null as IAlert[] | null,
    item: null as IAlert | null,
    total: null as number | null,
    count: null as number | null,
  }),
  actions: {
    async read(
      offset: number | null = null,
      limit: number | null = null,
      status: boolean | null = null,
    ): Promise<IResponseItems<IAlert>> {
      try {
        let sendStatus: number | null = null;

        if (status !== null) {
          sendStatus = status ? 1 : 0;
        }

        const response = await axios.get<IResponseItems<IAlert>>('/api/private/admin/alert/read', {
          params: {
            offset,
            limit,
            status: sendStatus,
          },
          headers: {
            Authorization: access().accessToken || '',
          },
        });

        this.items = response.data.data;
        this.total = response.data.total;

        return response.data;
      } catch (error) {
        this.items = null;
        this.total = null;

        throw error;
      }
    },
    async countUnread(
      limit: number = 99,
    ): Promise<number> {
      try {
        const response = await axios.get<IResponseItems<IAlert>>('/api/private/admin/alert/read', {
          params: {
            offset: 0,
            limit,
            status: 1,
          },
          headers: {
            Authorization: access().accessToken || '',
          },
        });

        this.count = response.data.data.length;

        return response.data.data.length;
      } catch (error) {
        this.count = null;

        throw error;
      }
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IAlertForm>> {
      const response = await axios.put<IResponseItem<IAlertForm>>(`/api/private/admin/alert/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IAlertForm>> {
      const response = await axios.delete<IResponseItem<IAlertForm>>('/api/private/admin/alert/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
